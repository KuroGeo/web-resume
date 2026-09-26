'use strict';
const requested=Number(new URLSearchParams(location.search).get('project'));const index=Number.isInteger(requested)&&requested>=0&&requested<SCROLLCAROUSEL_PROJECTS.length?requested:0;
const project=SCROLLCAROUSEL_PROJECTS[index];ProjectDetailHero.render(document,index);document.title=project.title+' — George Y.';
const galleries={cbi:['cbi/cover.jpg'],ai:['ai-commerce/gift-assistant-content.jpeg','ai-commerce/gift-assistant-agent.jpeg'],video:['video-commerce/feed-irregular-card.jpeg']};
const body=document.getElementById('scc-detail-content');body.replaceChildren();
const section=document.createElement('section');section.className='scc-detail-block';const title=document.createElement('h3');title.textContent=PROFILE_ZH?'项目实践':'Project overview';const p=document.createElement('p');p.textContent=project.summary;section.append(title,p);body.append(section);
for(const src of galleries[project.id]){const figure=document.createElement('figure');figure.className='scc-detail-block';const img=document.createElement('img');img.src='assets/'+src;img.alt=project.title;img.loading='lazy';img.style.cssText='max-height:900px;object-fit:contain;background:#f0f0ed;width:100%';figure.append(img);body.append(figure)}
const next=document.getElementById('scc-detail-next');const nextProject=SCROLLCAROUSEL_PROJECTS[(index+1)%SCROLLCAROUSEL_PROJECTS.length];next.href=nextProject.url;next.textContent=(PROFILE_ZH?'下一个：':'Next: ')+nextProject.title+' →';
