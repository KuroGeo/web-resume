'use strict';
(() => {
 const root=document.getElementById('work-collection'),section=document.getElementById('work-next'),nav=document.getElementById('journey-nav');
 function organize(mode='topic'){
  section.dataset.layout=mode;root.replaceChildren();nav.replaceChildren();nav.hidden=mode!=='journey';
  section.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===mode)));
  const groups=mode==='journey'?[{id:'2025',title:'2025–2026 / AI & Content'},{id:'2023',title:'2023–2024 / Cross-platform'},{id:'2021',title:'2021–2022 / Commerce Foundations'}]:PORTFOLIO_GROUPS;
  groups.forEach(g=>{
   const projects=SCROLLCAROUSEL_PROJECTS.map((p,i)=>({...p,index:i})).filter(p=>mode==='topic'?p.section===g.id:g.id==='2025'?p.year>=2025:g.id==='2023'?p.year===2023:p.year<=2022);
   if(!projects.length)return;
   const group=document.createElement('section');group.className='work-group';group.id='chapter-'+g.id;
   const head=document.createElement('header');head.className='group-heading';
   const heading=document.createElement('h3');heading.textContent=g.title;head.append(heading);
   const intro=document.createElement('p');intro.textContent=g.line||window.PUBLIC_RESUME_FACTS.company;head.append(intro);group.append(head);
   projects.sort((a,b)=>b.year-a.year).forEach(p=>{
    const a=document.createElement('a');a.className='work-item';a.href=p.url;
    a.innerHTML='<span class="work-number micro">'+String(p.index+1).padStart(2,'0')+'</span><div class="work-thumb"><img width="160" height="90" alt="" loading="lazy"></div><div class="work-copy"><h4></h4><p></p></div><span class="work-meta micro"></span><span class="work-arrow" aria-hidden="true">↗</span>';
    a.querySelector('img').src=p.thumb;a.querySelector('h4').textContent=p.title;a.querySelector('.work-copy p').textContent=PORTFOLIO_GROUPS.find(g=>g.id===p.section).keywords.join(' · ');a.querySelector('.work-meta').textContent=p.year+' / '+p.company;group.append(a);
   });root.append(group);
   const a=document.createElement('a');a.href='#'+group.id;a.textContent=g.title;a.addEventListener('click',e=>{e.preventDefault();group.scrollIntoView({block:'start'})});nav.append(a);
  });
  document.getElementById('work-status').textContent=SCROLLCAROUSEL_PROJECTS.length+(PROFILE_ZH?' 组精选实践 / ':' selected works / ')+(mode==='topic'?'By topic':'Newest first');
 }
 section.querySelectorAll('[data-layout]').forEach(b=>b.addEventListener('click',()=>organize(b.dataset.layout)));organize();
 window.BadgeWorkRestore=s=>organize(s.mode);
})();
