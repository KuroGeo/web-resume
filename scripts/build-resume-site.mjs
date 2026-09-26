// Public-only adapter: this program has no access to the private source repository.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
const generated='// Generated from public/generated/resume.json. Edit the private content source.\n';
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const js=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const requireValid=(condition,message)=>{if(!condition)throw new Error(message)};
const keys=(value,allowed)=>requireValid(object(value)&&Object.keys(value).every(k=>allowed.includes(k)),'Unexpected data field');
const string=value=>requireValid(typeof value==='string'&&value.length>0,'Expected nonempty text');
const unique=(records)=>requireValid(new Set(records.map(r=>r.id)).size===records.length,'Duplicate IDs');
export function validatePublicResume(data){
 keys(data,['schemaVersion','locales']);requireValid(data.schemaVersion===1,'Unsupported schema');
 requireValid(object(data.locales)&&Object.keys(data.locales).sort().join(',')==='en,zh','Both languages required');
 for(const locale of Object.values(data.locales)){
  keys(locale,['identity','sections','projects','groups','copy']);keys(locale.identity,['name','email','role','connections']);
  for(const key of ['name','role','connections'])string(locale.identity[key]);
  if(locale.identity.email!==undefined)string(locale.identity.email);
  for(const list of ['sections','projects','groups'])requireValid(Array.isArray(locale[list])&&locale[list].length>0,'Missing '+list);
  unique(locale.sections);unique(locale.projects);unique(locale.groups);
  for(const section of locale.sections){
   keys(section,['id','title','items','pageBreakBefore']);requireValid(section.pageBreakBefore===undefined||typeof section.pageBreakBefore==='boolean','Invalid page break');string(section.id);string(section.title);
   requireValid(/^[a-z][a-z0-9-]*$/.test(section.id)&&Array.isArray(section.items),'Invalid section');
   for(const item of section.items){keys(item,['title','paragraphs','label','role','date','place','url']);for(const field of ['label','role','date','place'])if(item[field]!==undefined)string(item[field]);if(item.title!==undefined)string(item.title);if(item.url!==undefined){string(item.url);const url=new URL(item.url);requireValid(url.protocol==='https:'&&url.hostname&&!url.username&&!url.password,'Invalid item URL')}requireValid(Array.isArray(item.paragraphs),'Missing paragraphs');item.paragraphs.forEach(string)}
  }
  for(const group of locale.groups){keys(group,['id','title','keywords','line']);for(const key of ['id','title','line'])string(group[key]);requireValid(Array.isArray(group.keywords)&&group.keywords.length>0,'Missing keywords');group.keywords.forEach(string)}
  for(const [index,project] of locale.projects.entries()){
   keys(project,['id','section','year','thumb','hero','title','summary','company','category','sceneOrder','url']);
   for(const key of ['id','title','summary','company','category'])string(project[key]);
   requireValid(Number.isInteger(project.year)&&project.sceneOrder===index,'Invalid project order');
   requireValid(locale.groups.some(g=>g.id===project.section),'Unknown project group');
   for(const key of ['thumb','hero'])requireValid(typeof project[key]==='string'&&/^assets\/[a-zA-Z0-9_./-]+$/.test(project[key])&&!project[key].split('/').includes('..'),'Invalid asset path');
   requireValid(project.url==='./project-scrollcarousel.html?project='+index,'Invalid project URL');
  }
  keys(locale.copy,['meta','pages','text']);requireValid(object(locale.copy.meta)&&object(locale.copy.pages)&&object(locale.copy.text),'Invalid copy');
  for(const text of Object.values(locale.copy.text))requireValid(typeof text==='string','Invalid copy value');
 }
 return data;
}
export function presentationFacts(locale){
 const work=locale.sections.find(s=>s.id==='experience')?.items[0];
 const experience=work?.title||'';
 const schoolEntry=locale.sections.find(s=>s.id==='education')?.items[0];
 const education=schoolEntry?.title||'';
 const [school='',educationDates='']=education.split(/\s*·\s*/);
 const shortSchool=/[\u3400-\u9fff]/.test(school)?school:school.split(/\s+/).filter(word=>!['of','the','and'].includes(word.toLowerCase())).map(word=>word[0]||'').join('');
 return {company:experience.split(/\s*[·,]\s*/)[0],school:shortSchool,educationDates:schoolEntry?.date||educationDates};
}
export function downloadPath(language){return `downloads/resume-${language==='zh'?'zh':'en'}.pdf`}
// The public PDF's selected-project section is the source for the website showcase.
// Asset and destination choices belong to this website; the private exporter still
// includes its older, more detailed project catalogue for other consumers.
export function showcaseProjects(locale){
 const selected=locale.sections.find(section=>section.id==='projects')?.items;
 requireValid(selected?.length===3,'Expected three public selected projects');
 const presentation=[
  {id:'cbi',section:'independent',thumb:'assets/cbi/cover.jpg',video:'assets/cbi/film-loop.mp4',url:'./work/cbi/'},
  {id:'ai',section:'ux',thumb:'assets/ai-commerce/gift-assistant-content.jpeg',url:'./project-scrollcarousel.html?project=1'},
  {id:'video',section:'experimental',thumb:'assets/video-commerce/feed-irregular-card.jpeg',url:'./project-scrollcarousel.html?project=2'}
 ];
 requireValid(Boolean(selected[0].url),'Startup project needs its public case-study link');
 return selected.map((item,index)=>{
  const visual=presentation[index];
  requireValid(Boolean(item.title&&item.date&&item.paragraphs?.length),'Incomplete selected project');
  const year=Number(item.date.match(/^\d{4}/)?.[0]);
  requireValid(Number.isInteger(year),'Selected project needs a year');
  return {...visual,year,hero:visual.thumb,title:item.title,summary:item.paragraphs.join(' '),company:item.date.split('·').slice(1).join('·').trim(),category:'product',sceneOrder:index};
 });
}
export function showcaseGroups(language){
 return language==='zh' ? [
  {id:'independent',title:'AI 创作与广告',keywords:['AIGC 画布','素材复刻','广告投放'],line:'把脚本、图片和视频创作连到广告投放场景。'},
  {id:'ux',title:'AI 电商创新',keywords:['AI 内容','多 Feed','Agent'],line:'把生成内容、导购对话和素材管理做成可用的电商体验。'},
  {id:'experimental',title:'短视频电商',keywords:['推荐流','购物卡','交互性能'],line:'在短视频观看中清楚呈现商品、优惠和价格信息。'}
 ] : [
  {id:'independent',title:'AI Creation & Advertising',keywords:['AIGC Canvas','Creative Replication','Campaigns'],line:'Connect scripts, images and video creation to advertising workflows.'},
  {id:'ux',title:'AI Commerce Innovation',keywords:['AI Content','Multi-feed','Agents'],line:'Turn generated content, shopping conversations and asset management into usable experiences.'},
  {id:'experimental',title:'Short-video Commerce',keywords:['In-feed','Shopping Cards','Performance'],line:'Present products, offers and prices clearly while people watch short videos.'}
 ];
}
export function renderResumeDocument(locale){
 const {identity,sections}=locale;
 return '<article class="resume-document"><h1>'+escapeHtml(identity.name)+'</h1><p>'+escapeHtml(identity.role)+'</p><p>'+escapeHtml(identity.connections)+'</p>'+sections.map(s=>'<h2 id="'+escapeHtml(s.id)+'">'+escapeHtml(s.title)+'</h2>'+s.items.map(item=>'<section>'+(item.title?'<h3>'+escapeHtml(item.title)+'</h3>':'')+(item.label?'<strong>'+escapeHtml(item.label)+'</strong>':'')+(['role','place','date'].filter(k=>item[k]).length?'<p>'+['role','place','date'].filter(k=>item[k]).map(k=>escapeHtml(item[k])).join(' · ')+'</p>':'')+item.paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('')+'</section>').join('')).join('')+'</article>';
}
export function buildSite(root){
 const publicRoot=join(root,'public');const data=validatePublicResume(JSON.parse(readFileSync(join(publicRoot,'generated/resume.json'),'utf8')));
 const locales=data.locales;const projects=Object.fromEntries(Object.entries(locales).map(([lang,v])=>[lang,showcaseProjects(v)]));const groups=Object.fromEntries(Object.keys(locales).map(lang=>[lang,showcaseGroups(lang)]));
 const documents=Object.fromEntries(Object.entries(locales).map(([lang,v])=>[lang,renderResumeDocument(v)]));
 const identities=Object.fromEntries(Object.entries(locales).map(([lang,v])=>[lang,v.identity]));
 const facts=Object.fromEntries(Object.entries(locales).map(([lang,v])=>[lang,presentationFacts(v)]));
 const translations=Object.fromEntries(Object.entries(locales).map(([lang,v])=>[lang,v.copy]));
 const outputs={
  'js/profile-data.js':generated+`'use strict';\nconst SCROLLCAROUSEL_CATEGORY_LABELS={product:'Engineering'};
let profileLanguage='en';try{profileLanguage=localStorage.getItem('resume-language')==='zh'?'zh':'en'}catch{}
const PROFILE_ZH=profileLanguage==='zh';
const PROFILE_PROJECTS=${js(projects)};
const SCROLLCAROUSEL_PROJECTS=PROFILE_PROJECTS[profileLanguage];
window.PORTFOLIO_GROUPS=${js(groups)}[profileLanguage];
window.PUBLIC_RESUME_IDENTITY=${js(identities)}[profileLanguage];
window.PUBLIC_RESUME_FACTS=${js(facts)}[profileLanguage];
`,
  'resume-content.js':generated+`export const supportedLanguages=['zh','en'];
const translations=${js(translations)};
export const isSupportedLanguage=language=>supportedLanguages.includes(language);
export const getResumeCopy=language=>translations[isSupportedLanguage(language)?language:'en'];
export const getResumePageMeta=(language,pageKey='home')=>{const copy=getResumeCopy(language);return copy.pages?.[pageKey]?.meta||copy.meta};
`,
  'js/resume-document.js':generated+`const resumeDocuments=${js(documents)};
let lang='en';try{lang=localStorage.getItem('resume-language')==='zh'?'zh':'en'}catch{}
const requested=new URLSearchParams(location.search).get('lang');if(requested==='en'||requested==='zh')lang=requested;
document.documentElement.lang=lang==='zh'?'zh-CN':'en';
const identity=${js(identities)}[lang];
document.querySelectorAll('[data-resume-name]').forEach(el=>el.textContent=identity.name);
document.querySelectorAll('[data-resume-role]').forEach(el=>el.textContent=identity.role);
document.querySelectorAll('[data-resume-fact]').forEach(el=>el.textContent=${js(facts)}[lang][el.dataset.resumeFact]||'');
document.title=identity.name+' — Résumé';
document.querySelectorAll('[data-resume-copy]').forEach(el=>el.innerHTML=resumeDocuments[lang].replaceAll('id="','id="text-'));
document.querySelectorAll('[data-resume-download]').forEach(link=>{link.href='downloads/resume-'+lang+'.pdf';link.download=lang==='zh'?'叶禹锋_V1.pdf':'George_V1.pdf';link.textContent=lang==='zh'?'下载 PDF':'Download PDF'});
document.querySelectorAll('[data-resume-language]:not([data-reader-language])').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.resumeLanguage===lang));button.addEventListener('click',()=>{const next=button.dataset.resumeLanguage;try{localStorage.setItem('resume-language',next)}catch{}const url=new URL(location.href);url.searchParams.set('lang',next);location.href=url.href})});
const preview=document.querySelector('.paper .resume-document');if(preview)new ResizeObserver(()=>{preview.style.setProperty('--paper-scale',preview.parentElement.clientWidth/800)}).observe(preview.parentElement);
document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
`};
 // All rendering/validation is complete before replacing any generated file.
 mkdirSync(join(publicRoot,'js'),{recursive:true});
 for(const [path,content] of Object.entries(outputs))writeFileSync(join(publicRoot,path),content);
 for(const file of ['index.html','index-resume-embed.html','resume.html']){
  const path=join(publicRoot,file);if(!existsSync(path))continue;
  let html=readFileSync(path,'utf8');
  html=html.replace(/(<[^>]+data-resume-name[^>]*>)[^<]*(<\/[^>]+>)/g,(_,a,b)=>a+escapeHtml(locales.en.identity.name)+b);
  html=html.replace(/(<[^>]+data-resume-role[^>]*>)[^<]*(<\/[^>]+>)/g,(_,a,b)=>a+escapeHtml(locales.en.identity.role)+b);
  html=html.replace(/(<[^>]+data-resume-fact="([^"]+)"[^>]*>)[^<]*(<\/[^>]+>)/g,(_,a,key,b)=>a+escapeHtml(facts.en[key]||'')+b);
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+escapeHtml(locales.en.identity.name+(file==='index.html'?' | '+locales.en.identity.role:' — Résumé'))+'</title>');
  if(file==='resume.html')html=html.replace(/(<div data-resume-copy>)[\s\S]*?(<\/div>)/,(_,a,b)=>a+documents.en.replaceAll('id="','id="text-')+b);
  writeFileSync(path,html);
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){buildSite(process.cwd());console.log('Built website from public resume JSON')}
