import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { Script, createContext } from 'node:vm';

const root=resolve('public');
const selected=JSON.parse(readFileSync(resolve(root,'generated/resume.json'),'utf8')).locales;
const siteUrl='https://kurogeo.github.io/web-resume/';
const home=readFileSync(resolve(root,'index.html'),'utf8');
const collection=home.match(/<div id="work-collection" aria-label="Project collection">([\s\S]*?)<\/div>/)?.[1];
assert.ok(collection,'Homepage needs server-readable projects');
const escapeHtml=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
for(const item of selected.en.sections.find(section=>section.id==='projects').items){
  assert.ok(collection.includes(escapeHtml(item.title)),'Missing public project title: '+item.title);
  assert.ok(collection.includes(escapeHtml(item.paragraphs[0])),'Missing public project summary: '+item.title);
}
assert.equal((collection.match(/<article>/g)||[]).length,3,'Homepage project count');
const person=JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'null');
assert.equal(person['@type'],'Person');
assert.equal(person.name,selected.en.identity.name);
assert.equal(person.url,siteUrl);
const sitemap=readFileSync(resolve(root,'sitemap.xml'),'utf8');
for(const [file,url] of [['index.html',siteUrl],['resume.html',siteUrl+'resume.html'],['work/cbi/index.html',siteUrl+'work/cbi/'],['work/bytedance/index.html',siteUrl+'work/bytedance/']]){
  const html=readFileSync(resolve(root,file),'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`),'Missing canonical: '+file);
  assert.ok(sitemap.includes(`<loc>${url}</loc>`),'Missing sitemap URL: '+file);
}
for(const language of ['zh','en']){
  const context=createContext({window:{},localStorage:{getItem:()=>language}});
  const source=readFileSync(resolve(root,'js/profile-data.js'),'utf8');
  new Script(source+';window.projects=SCROLLCAROUSEL_PROJECTS;').runInContext(context);
  assert.equal(context.window.projects.length,3);
  assert.deepEqual(Array.from(context.window.projects,project=>project.title),selected[language].sections.find(section=>section.id==='projects').items.map(item=>item.title));
  assert.equal(context.window.projects[0].url,'./work/cbi/');
  for(const group of context.window.PORTFOLIO_GROUPS){
    const count=context.window.projects.filter(p=>p.section===group.id).length;
    assert.ok(count>0&&count<=(group.id==='experimental'?3:4),'Scene slot bounds');
  }
  for(const project of context.window.projects){
    assert.ok(project.title&&project.summary);
    assert.ok(existsSync(resolve(root,project.thumb)),project.thumb);
    assert.ok(existsSync(resolve(root,project.hero)),project.hero);
  }
}
for(const file of ['index.html','index-resume-embed.html','resume.html','project-scrollcarousel.html','work/cbi/index.html']){
  const path=resolve(root,file),html=readFileSync(path,'utf8');
  assert.ok(!/Xinyi|CV_.*\.pdf|assets\/hero-portrait/.test(html),'No reference personal content');
  for(const match of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)){
    const url=match[1];
    if(/^(https?:|mailto:|#)/.test(url))continue;
    assert.ok(existsSync(resolve(dirname(path),url.split(/[?#]/)[0])),file+': '+url);
  }
}
for(const edition of ['EN','ZH']){
  for(const [suffix,signature] of [['.pdf','%PDF'],['-1.png','\x89PNG'],['-2.png','\x89PNG']]){
    const path=resolve(root,'assets/docs/George-Ye-Resume-'+edition+suffix);
    assert.ok(existsSync(path)&&statSync(path).size>10000,'Missing résumé asset: '+path);
    assert.equal(readFileSync(path).subarray(0,4).toString('latin1'),signature,'Invalid résumé asset: '+path);
  }
}
for(const file of readdirSync(resolve(root,'js')).filter(f=>f.endsWith('.js'))){
  new Script(readFileSync(resolve(root,'js',file),'utf8'),{filename:file});
}
console.log('PASS: bilingual project data, scene slot bounds, résumé PDFs and previews, local links, personal content, JavaScript syntax');
