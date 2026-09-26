import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { Script, createContext } from 'node:vm';

const root=resolve('public');
const selected=JSON.parse(readFileSync(resolve(root,'generated/resume.json'),'utf8')).locales;
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
