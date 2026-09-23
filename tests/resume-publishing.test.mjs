import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {validatePublicResume, renderResumeDocument, buildSite, downloadPath} from '../scripts/build-resume-site.mjs';
const locale={identity:{name:'Public Name',role:'Engineer',connections:'github.com/example'},
 sections:[{id:'education',title:'Education',items:[{title:'University',paragraphs:['Degree']}]}],
 projects:[{id:'a',section:'one',year:2025,thumb:'assets/a.png',hero:'assets/a.png',title:'Project',summary:'Summary',company:'Company',category:'product',sceneOrder:0,url:'./project-scrollcarousel.html?project=0'}],
 groups:[{id:'one',title:'Group',keywords:['Work'],line:'Description'}],
 copy:{meta:{htmlLang:'en',title:'Public Name',description:'Description',ogDescription:'Description'},pages:{},text:{'intro.role':'Engineer'}}};
const valid=()=>({schemaVersion:1,locales:{en:structuredClone(locale),zh:structuredClone(locale)}});
test('unsupported schema, missing language, invalid asset and duplicate IDs fail closed',()=>{
 assert.throws(()=>validatePublicResume({schemaVersion:99,locales:{}}));
 for(const change of [d=>delete d.locales.zh,d=>d.locales.en.projects[0].thumb='../secret',d=>d.locales.en.projects.push(d.locales.en.projects[0]),d=>d.locales.en.identity.private='secret']){
  const d=valid();change(d);assert.throws(()=>validatePublicResume(d));
 }
});
test('HTML data is escaped and education anchor remains reachable',()=>{
 const html=renderResumeDocument({...locale,identity:{...locale.identity,name:'<script>alert(1)</script>'}});
 assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('id="education"'));
});
test('downloads remain under Pages base path and unsupported locales fall back',()=>{
 assert.equal(new URL(downloadPath('zh'),'https://example.com/web-resume/resume.html').pathname,'/web-resume/downloads/resume-zh.pdf');
 assert.equal(downloadPath('en'),'downloads/resume-en.pdf');assert.equal(downloadPath('xx'),'downloads/resume-en.pdf');
});
test('invalid JSON cannot replace existing generated files',()=>{
 const root=mkdtempSync(join(tmpdir(),'resume-site-'));mkdirSync(join(root,'public/generated'),{recursive:true});mkdirSync(join(root,'public/js'));
 writeFileSync(join(root,'public/generated/resume.json'),'{');writeFileSync(join(root,'public/js/profile-data.js'),'old');
 assert.throws(()=>buildSite(root));assert.equal(readFileSync(join(root,'public/js/profile-data.js'),'utf8'),'old');
});
test('a canonical title change reaches project globals and HTML resume together; builds are stable',()=>{
 const root=mkdtempSync(join(tmpdir(),'resume-site-'));mkdirSync(join(root,'public/generated'),{recursive:true});mkdirSync(join(root,'public/js'));
 const data=valid(); data.locales.en.identity.name='Updated Public Name';
 writeFileSync(join(root,'public/generated/resume.json'),JSON.stringify(data));
 buildSite(root);const first=readFileSync(join(root,'public/js/resume-document.js'),'utf8');
 assert.ok(first.includes('Updated Public Name'));buildSite(root);assert.equal(readFileSync(join(root,'public/js/resume-document.js'),'utf8'),first);
});
test('canonical employer and education edits update every marked HTML view',()=>{
 const root=mkdtempSync(join(tmpdir(),'resume-bindings-'));mkdirSync(join(root,'public/generated'),{recursive:true});
 const data=valid();data.locales.en.sections.push({id:'experience',title:'Experience',items:[{title:'Updated Company · 2025–2026',paragraphs:['Engineer']}]});
 data.locales.en.sections[0].items[0].title='Updated University · 2020–2024';
 const template='<title>Old</title><header><span data-resume-name>Old Name</span></header><span data-resume-fact="company">Old Company</span><span data-resume-fact="educationDates">Old dates</span><span data-resume-fact="school">Old school</span>';
 for(const file of ['index.html','index-resume-embed.html','resume.html'])writeFileSync(join(root,'public',file),template);
 writeFileSync(join(root,'public/generated/resume.json'),JSON.stringify(data));buildSite(root);
 for(const file of ['index.html','index-resume-embed.html','resume.html']){
  const html=readFileSync(join(root,'public',file),'utf8');assert.ok(html.includes('Updated Company'));assert.ok(html.includes('2020–2024'));assert.ok(!html.includes('Old Name'));assert.ok(!html.includes('Old school'));
 }
});
