'use strict';
const $=s=>document.querySelector(s);
const token=$('meta[name="studio-token"]').content;
let versions=[],doc=null,group='',mode='form',changes={},collectionChanges={},sourceDirty=false,busy=false,previewError=false,page=1;
const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h6"/></svg>';
function error(message){$('#error span').textContent=message;$('#error').hidden=false;}
function dirty(){return Object.keys(changes).length>0||Object.keys(collectionChanges).length>0||sourceDirty;}
async function api(path,body){const r=await fetch('/api/'+path,{method:body?'POST':'GET',headers:{'X-Studio-Token':token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(data.error||'操作失败，请重试。');return data;}
function artifact(file){return '/api/artifact?'+new URLSearchParams({id:doc.preview.id,file,token});}
function status(message){$('#save-state').textContent=message|| (dirty()?'有未保存的修改':'已保存到本机');$('#save-state').classList.toggle('dirty',dirty());$('#save').disabled=busy||!dirty();$('#generate').disabled=busy||!doc;$('#empty-generate').disabled=busy||!doc;$('#reload').disabled=busy;$('#form-mode').disabled=busy;$('#source-mode').disabled=busy;$('#search').disabled=busy;document.querySelectorAll('.version,#fields input,#fields textarea,#fields button,#source').forEach(el=>el.disabled=busy);if(doc?.preview){const stale=dirty()||doc.preview.revision!==doc.previewRevision;$('#preview-state').textContent=previewError?'生成失败 · 可重试':stale?'内容有修改 · 待生成':'已与保存内容同步';$('#download').firstChild.textContent=stale?'下载上次 PDF':'下载 PDF';}}
function setBusy(value,message){busy=value;status(message);$('#generate span').textContent=value?'正在处理…':'保存并生成 PDF';}
function list(){const nav=$('#versions');nav.replaceChildren();const term=$('#search').value.trim().toLowerCase();let last=null,count=0;for(const v of versions){if(![v.name,v.id,v.detail].join(' ').toLowerCase().includes(term))continue;const kind=v.public?'公开版本':'私人版本';if(last!==kind){const h=document.createElement('p');h.className='version-group';h.textContent=kind;nav.append(h);last=kind;}const b=document.createElement('button');b.className='version';b.innerHTML=icon+'<span><strong></strong><small></small></span>';b.querySelector('strong').textContent=v.name;b.querySelector('small').textContent=v.public?v.detail:v.id.replace(/^resume_/, '').replaceAll('_', ' · ');b.title=v.name+' · '+v.id;b.setAttribute('aria-current',String(v.id===doc?.version));b.disabled=busy;b.onclick=()=>choose(v.id);nav.append(b);count++;}if(!count){const p=document.createElement('p');p.className='rail-loading';p.textContent='没有匹配的版本。';nav.append(p);}$('#version-count').textContent=versions.length;}
function tabs(){const nav=$('#sections');nav.replaceChildren();for(const g of [...new Set([...doc.fields.map(f=>f.group),...(doc.collections||[]).map(c=>c.group)])]){const b=document.createElement('button');b.type='button';b.textContent=g;b.setAttribute('aria-current',String(g===group));b.onclick=()=>{group=g;tabs();fields();$('.editor-scroll').scrollTop=0;};nav.append(b);}}
function projectOperation(collection){return collectionChanges[collection.id] ||= {add:0,remove:[]};}
function projectFields(collection,index){
 const path=[...collection.path,index];
 const fields=[];
 function walk(value,parts){if(typeof value==='string'){const key=parts.findLast(p=>typeof p==='string');fields.push({id:"["+parts.map(p=>JSON.stringify(p)).join(", ")+"]",group:collection.group,context:'新项目',value,label:({title:'标题',name:'名称',date:'时间',role:'职位',paragraphs:'内容',summary:'简介'})[key]||key,multiline:['paragraphs','summary'].includes(key)});}else if(Array.isArray(value))value.forEach((v,i)=>walk(v,[...parts,i]));else Object.entries(value).forEach(([k,v])=>walk(v,[...parts,k]));}
 walk(collection.template,path);return fields;
}
function fields(){
 const form=$('#fields');form.replaceChildren();
 const collection=(doc.collections||[]).find(c=>c.group===group);
 const operation=collectionChanges[collection?.id]||{add:0,remove:[]};
 const items=doc.fields.filter(f=>f.group===group);
 if(collection)for(let i=0;i<operation.add;i++)items.push(...projectFields(collection,collection.count+i));
 const header=document.createElement('div');header.className='section-title';
 const h=document.createElement('h3');h.textContent=group;
 const c=document.createElement('span');c.textContent=(collection?collection.count+operation.add-operation.remove.length:items.length)+(collection?' 个项目':' 项');header.append(h,c);
 if(collection){const add=document.createElement('button');add.type='button';add.textContent='+ 新增项目';add.onclick=()=>{const op=projectOperation(collection);op.add++;fields();status();const inputs=[...form.querySelectorAll('input')];const last=inputs.find(el=>JSON.parse(el.name)[collection.path.length]===collection.count+op.add-1);last?.focus();};header.append(add);}
 form.append(header);
 if(collection?.minimum){const hint=document.createElement('p');hint.className='project-hint';hint.textContent='公开版至少保留一个项目。新增和删除保存后生效。';form.append(hint);}
 let context='';let previousEntry=null;
 items.forEach((f,i)=>{
  const parts=JSON.parse(f.id);const isEntry=collection&&collection.path.every((part,n)=>parts[n]===part)&&Number.isInteger(parts[collection.path.length]);
  const index=isEntry?parts[collection.path.length]:null;
  const removed=isEntry&&operation.remove.includes(index);
  if(isEntry&&previousEntry!==index){
   previousEntry=index;
   const row=document.createElement('div');row.className='entry-title project-entry';
   const title=document.createElement('span');title.textContent=(removed?'待删除 · ':'')+f.context;
   const button=document.createElement('button');button.type='button';button.textContent=removed?'撤销删除':'删除';button.setAttribute('aria-label',(removed?'撤销删除 ':'删除项目 ')+f.context);
   button.onclick=()=>{const op=projectOperation(collection);if(op.remove.includes(index))op.remove=op.remove.filter(n=>n!==index);else{if(collection.count+op.add-op.remove.length<=collection.minimum){error('公开版精选项目至少保留一个项目。');return;}op.remove.push(index);}if(!op.add&&!op.remove.length)delete collectionChanges[collection.id];fields();status();};row.append(title,button);form.append(row);
  }else if(!isEntry&&f.context&&f.context!==context){const title=document.createElement('h4');title.className='entry-title';title.textContent=f.context;form.append(title);context=f.context;}
  if(removed)return;
  const label=document.createElement('label');label.className='field';const text=document.createElement('span');text.textContent=f.label;const input=document.createElement(f.multiline?'textarea':'input');input.value=Object.hasOwn(changes,f.id)?changes[f.id]:f.value;input.id='field-'+i;input.name=f.id;if(f.multiline)input.rows=Math.min(8,Math.max(3,Math.ceil(input.value.length/34)));input.classList.toggle('changed',Object.hasOwn(changes,f.id));input.oninput=()=>{if(input.value===f.value)delete changes[f.id];else changes[f.id]=input.value;input.classList.toggle('changed',Object.hasOwn(changes,f.id));status();};label.append(text,input);form.append(label);
 });$('#field-count').textContent=doc.fields.length+' 个可编辑字段';
}
function fill(){const v=versions.find(v=>v.id===doc.version);$('#document-title').textContent=v?.name||doc.name;$('#scope-note').textContent=doc.public?'公开内容源 · 修改共享文本可能影响其他引用，保存不会发布到网站。':'私人版本 · 修改仅覆盖当前版本，共享内容保持不变。';const groups=[...new Set([...doc.fields.map(f=>f.group),...(doc.collections||[]).map(c=>c.group)])];if(!groups.includes(group))group=groups[0];$('#source').value=doc.source;list();tabs();fields();showMode();proof();status();}
function showMode(){const source=mode==='source';$('#fields').hidden=source;$('#sections').hidden=source;$('#source-pane').hidden=!source;$('#form-mode').setAttribute('aria-pressed',String(!source));$('#source-mode').setAttribute('aria-pressed',String(source));}
async function choose(version){if(busy||version===doc?.version)return;if(dirty()&&!confirm('当前修改尚未保存。放弃修改并切换版本？'))return;setBusy(true,'正在载入版本…');$('#error').hidden=true;try{const next=await api('document?version='+encodeURIComponent(version));doc=next;changes={};collectionChanges={};sourceDirty=false;previewError=false;page=1;group='';fill();}catch(e){error(e.message);}finally{setBusy(false,doc?'已载入本机内容':'请重新载入');}}
function proof(){const p=doc?.preview;$('#empty-preview').hidden=!!p;$('#page').hidden=!p;$('#download').hidden=!p;if(!p){$('#page-count').textContent='— / —';$('#preview-state').textContent='本地预览不可用';$('#prev').disabled=$('#next').disabled=true;return;}page=Math.min(page,p.pages);$('#page-image').src=artifact('page-'+page+'.png');$('#page-image').alt=doc.name+'的简历 PDF，第 '+page+' 页';$('#page-count').textContent=page+' / '+p.pages;$('#page-caption').textContent='第 '+page+' 页，共 '+p.pages+' 页';$('#prev').disabled=page<=1;$('#next').disabled=page>=p.pages;$('#download').href=artifact('document.pdf');$('#download').download=doc.exportFilename||doc.version+'.pdf';status();}
async function save(){if(!dirty())return;const body={version:doc.version,revision:doc.revision,...(mode==='source'?{source:$('#source').value}:{changes,collections:collectionChanges})};doc=await api('save',body);changes={};collectionChanges={};sourceDirty=false;fill();}
async function renderCurrent(){previewError=false;$('#rendering').hidden=false;$('#preview-state').textContent='正在生成…';try{const generated=await api('render',{version:doc.version,revision:doc.revision});doc.preview=generated;page=1;proof();}catch(e){previewError=true;$('#preview-state').textContent='生成失败 · 可重试';throw e;}finally{$('#rendering').hidden=true;}}
async function action(render){if(busy||!doc)return;$('#error').hidden=true;setBusy(true,'正在保存并更新本地 PDF…');try{await save();if(render||!doc.preview)await renderCurrent();status();}catch(e){error(e.message);}finally{setBusy(false);}}
$('#save').onclick=()=>action(false);$('#generate').onclick=$('#empty-generate').onclick=()=>action(true);$('#search').oninput=list;
$('#reload').onclick=async()=>{if(busy)return;if(dirty()&&!confirm('重新载入会放弃当前未保存修改，是否继续？'))return;const version=doc?.version||'public-zh';changes={};collectionChanges={};sourceDirty=false;doc=null;await choose(version);};
$('#form-mode').onclick=()=>switchMode('form');$('#source-mode').onclick=()=>switchMode('source');
function switchMode(next){if(next===mode)return;if(dirty()){error('请先保存当前修改，再切换编辑方式。也可重新载入以放弃修改。');return;}mode=next;showMode();}
$('#source').oninput=()=>{sourceDirty=$('#source').value!==doc.source;status();};
$('#prev').onclick=()=>{if(page>1){page--;proof();$('#proof-canvas').scrollTop=0;}};$('#next').onclick=()=>{if(page<doc.preview.pages){page++;proof();$('#proof-canvas').scrollTop=0;}};
$('#page-image').onerror=()=>error('预览图片读取失败，请重新生成 PDF。');$('#error button').onclick=()=>$('#error').hidden=true;$('#fields').onsubmit=e=>e.preventDefault();
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('.workspace').classList.toggle('show-preview',b.dataset.view==='preview');});
window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='s'){e.preventDefault();action(false);}});
(async()=>{try{versions=await api('versions');list();await choose('public-zh');}catch(e){error(e.message);status('连接失败，请重新启动工作台');}})();
