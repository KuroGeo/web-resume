'use strict';
const switcher=document.getElementById('language-switch');switcher.textContent=PROFILE_ZH?'EN':'中文';
switcher.addEventListener('click',()=>{try{localStorage.setItem('resume-language',PROFILE_ZH?'en':'zh')}catch{}location.reload()});
document.documentElement.lang=PROFILE_ZH?'zh-CN':'en';
if(PROFILE_ZH){document.title='George Y. | AI 应用工程师';const dictionary={"AI Application Engineer":"AI 应用工程师","WORK & EDUCATION":"工作与教育背景","Commerce":"抖音电商","Frontend":"前端工程","Bachelor":"信息工程","Degree":"学位","SCUT":"华南理工大学","Learn more ":"更多","about me":"关于我","Scroll down":"向下探索"," Scroll down":" 向下探索","COMPLETE ARCHIVE":"全部作品","Project index":"项目索引","By Topic":"按主题","My Journey":"我的历程","Explore":"探索","SELECTED WORK":"精选实践","All Projects":"全部作品","All Projects ":"全部作品 ","8 projects ↗":"8 组实践 ↗","Résumé":"简历","Contact":"联系","← Menu":"← 返回菜单","Print my résumé ":"打印我的简历 ","Printing résumé…":"正在打印简历…","Saving résumé…":"正在准备简历…","Download résumé ":"打印 / 保存 PDF ","Print another copy ":"再打印一份 ","A multidisciplinary lens into":"用跨领域的视角","the":"连接","side":"与体验","of everyday experience.":"把想法变成真实产品。","Ask an AI ":"让 AI ","about me.":"介绍我。","Ask an AI":"问问 AI","Get to know me through my work.":"从我的项目了解我，","Then explore where I could fit in your team.":"再聊聊我能为你的团队做什么。","Copy the prompt instead ":"复制提问内容 ","Reach out to collaborate,":"聊聊产品、工程，","chat, or learn more.":"或一杯 Dirty Coffee。","Find me on GitHub":"在 GitHub 找到我","Resume":"简历"};
 function translate(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement.closest('script,style,textarea'))continue;const translated=dictionary[n.nodeValue];if(translated)n.nodeValue=translated;}}
 translate(document.body);
 const observer=new MutationObserver(records=>{observer.disconnect();if(!document.body)return;for(const record of records){if(record.type==='characterData')translate(record.target.parentElement);else for(const node of record.addedNodes){if(node.nodeType===1)translate(node);else if(node.nodeType===3&&dictionary[node.nodeValue])node.nodeValue=dictionary[node.nodeValue]}}observer.observe(document.body,{childList:true,subtree:true,characterData:true})});observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}

// Identity is generated from the same public source as the PDFs.
document.querySelectorAll("[data-resume-name]").forEach(el=>el.textContent=window.PUBLIC_RESUME_IDENTITY.name);
document.querySelectorAll("[data-resume-role]").forEach(el=>el.textContent=window.PUBLIC_RESUME_IDENTITY.role);
document.title=window.PUBLIC_RESUME_IDENTITY.name+" | "+window.PUBLIC_RESUME_IDENTITY.role;

document.querySelectorAll("[data-resume-fact]").forEach(el=>el.textContent=window.PUBLIC_RESUME_FACTS[el.dataset.resumeFact]||"");
