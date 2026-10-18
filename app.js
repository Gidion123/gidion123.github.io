/* V6 buildless renderer. Content is owned by project-data/profile-data/case-evidence. */
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=escapeHTML;
const routes=['home','projects','about','credentials','contact','resume'];
const sections=Object.fromEntries([...routes,'case'].map(id=>[id,document.getElementById('page-'+id)]));
const header=document.getElementById('site-header'),menu=document.getElementById('mobile-menu'),menuButton=document.getElementById('menu-toggle');
let currentRoute='';const scrollPositions={};
const caseLink=id=>'#/case/'+id;
const asArray=value=>Array.isArray(value)?value:value?[value]:[];
function sourceURL(project,path,ref){const clean=path.split('#')[0],d=caseData[project.id];const source=d?.sources?.find(s=>s.path===clean);const fragment=path.includes('#')?path.slice(path.indexOf('#')):'';return `${project.github}/blob/${encodeURIComponent(ref||source?.ref||d?.sources?.[0]?.ref||'main')}/${clean.split('/').map(encodeURIComponent).join('/')}${/^#L\d+(?:-L\d+)?$/.test(fragment)?fragment:''}`} 
function sourceLink(project,path,label='Source',ref){const cell=path.match(/#cell-(.+)$/);return `<a href="${text(sourceURL(project,path,ref))}" target="_blank" rel="noopener noreferrer">${text(label)} ↗</a>${cell?` <span class="source-location">Notebook cell ${text(cell[1])}</span>`:''}`}
function getResumeTarget(config){
 const value=String(config?.url||'').trim();
 if(!value||value==='#'||/[\u0000-\u001f]/.test(value))return '';
 if(/^https?:\/\//i.test(value)){try{const u=new URL(value);return u.hostname&&!u.username&&!u.password?u.href:''}catch{return ''}}
 if(/^(?:[\w.-]+\/)*[\w .-]+\.pdf$/i.test(value)&&!value.split('/').includes('..'))return value;
 return '';
}
function renderResume(){
 const target=getResumeTarget(portfolioAssets.resume),label=portfolioAssets.resume.label||'Resume';
 document.querySelectorAll('[data-resume-slot]').forEach(slot=>{const id=slot.dataset.resumeSlot+'-resume-note';slot.innerHTML=target?`<a class="btn btn-secondary resume-control" href="${text(target)}" target="_blank" rel="noopener noreferrer">${text(label)} ↗</a>`:`<button class="btn btn-secondary resume-control" type="button" disabled aria-describedby="${id}">${text(label)}</button><small id="${id}">Contact for a copy</small>`});
 document.getElementById('resume-page-description').textContent=target?'Open the final one-page A4 resume as a PDF.':'Contact me for a copy of my resume.';
}
function imageMarkup(project){const media=projectMedia(project);if(media)return media;return `<div class="project-illustration"><small>${text(project.label)}</small><strong>${text(project.illustration)}</strong><span>Concept summary · not an application screenshot</span></div>`}
function galleryCard(project,mode='gallery'){
 const p=project;return `<article data-project="${p.id}" class="${mode==='selected'?'project-card':'gallery-card'} ${mode==='selected'&&p.id==='jobfit'?'featured':''}"><div class="project-visual">${imageMarkup(p)}</div><div class="project-info"><div class="card-top"><span class="category">${text(p.label)}</span>${p.featured?'<span class="project-index">SELECTED</span>':''}</div><h3>${text(p.name)}</h3><p>${text(p.description)}</p><div class="project-highlight">${text(p.highlight)} <span class="card-source">${sourceLink(p,p.sourcePath,'Source')}</span></div><div class="tag-list">${p.tags.slice(0,4).map(t=>`<span>${text(t)}</span>`).join('')}</div><div class="project-links"><a class="small-link primary" href="${caseLink(p.id)}">View case study →</a><a class="small-link" href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div></article>`;
}
function renderGallery(filter='All'){
 const visible=projectData.filter(p=>filter==='All'||p.category===filter||(p.secondaryCategories||[]).includes(filter)),main=visible.filter(p=>!p.additional),additional=visible.filter(p=>p.additional);
 document.getElementById('gallery-grid').innerHTML=main.map(p=>galleryCard(p)).join('');
 document.getElementById('additional-analysis').innerHTML=additional.length?`<div class="additional-heading"><p class="eyebrow">ADDITIONAL DATA ANALYSIS</p><h2>Start with the data.</h2></div><div class="gallery-grid">${additional.map(p=>galleryCard(p)).join('')}</div>`:'';
 document.getElementById('results-count').textContent=`${visible.length} project${visible.length===1?'':'s'} · ${filter}`;
 document.getElementById('gallery-empty').hidden=!!visible.length;
}
function renderHome(){
 document.getElementById('selected-projects').innerHTML=projectData.filter(p=>p.featured).map(p=>galleryCard(p,'selected')).join('');
 document.getElementById('supporting-projects').innerHTML=projectData.filter(p=>['smartshopper','smartsplit'].includes(p.id)).map(p=>`<article class="supporting-card"><span class="category">${text(p.label)}</span><h3>${text(p.name)}</h3><p>${text(p.description)}</p><div class="project-highlight">${text(p.highlight)} ${sourceLink(p,p.sourcePath,'Source')}</div><div class="tag-list">${p.tags.map(t=>`<span>${text(t)}</span>`).join('')}</div><a class="text-link" href="${caseLink(p.id)}">Read the case study →</a></article>`).join('');
 const portrait=document.getElementById('hero-portrait-image'),a=portfolioAssets.profilePhoto;
 portrait.src=a.path;portrait.alt=a.alt;portrait.width=a.width;portrait.height=a.height;
}
function formatValue(result){
 let value=result.displayValue??result.value;
 if(typeof value==='number'){value=Number.isInteger(value)?value.toLocaleString('en-US'):value.toLocaleString('en-US',{minimumFractionDigits:result.decimals??2,maximumFractionDigits:result.decimals??4});}
 if(result.unit==='%')return `${value}%`;
 if(result.unit==='USD'||result.unit==='$')return '$'+value;
 if(result.unit==='GBP'||result.unit==='£')return '£'+value;
 return String(value);
}
function resultContext(r){return [r.split,r.sampleSize!=null?`n = ${r.sampleSize.toLocaleString?.('en-US')||r.sampleSize}${r.sampleUnit?' '+r.sampleUnit:''}`:'',r.context].filter(Boolean).join(' · ')}
function renderCase(id){
 const p=projectData.find(p=>p.id===id),d=caseData[id];if(!p||!d)return false;
 const prefixes={recorded:'Recorded experiment','implementation-verified':'Implementation overview','owner-reported':'Owner-reported',unresolved:'Evidence limitation'};
 const paras=values=>asArray(values).map(v=>`<p>${text(typeof v==='string'?v:JSON.stringify(v))}</p>`).join('');
 const list=values=>`<ul>${asArray(values).map(v=>`<li>${text(v)}</li>`).join('')}</ul>`;
 const section=(key,title,body,eyebrow)=>`<section class="case-section" id="case-${id}-${key}"><div class="container case-two-col"><div><p class="eyebrow">${eyebrow||key.toUpperCase()}</p><h2>${title}</h2></div><div class="case-copy">${body}</div></div></section>`;
 const insights=d.exploration.map((i,index)=>`<article class="insight"><span class="number">QUESTION ${String(index+1).padStart(2,'0')}</span><h3>${text(i.question)}</h3><dl><dt>Evidence</dt><dd>${text(i.finding)} ${text(i.population)}</dd>${i.interpretation?`<dt>Interpretation</dt><dd>${text(i.interpretation)}</dd>`:''}<dt>Decision</dt><dd>${text(i.decision)}</dd><dt>Validation / limitation</dt><dd class="limitation">${text(i.limitation)}</dd></dl><p class="case-source">${asArray(i.sourcePaths).map(path=>sourceLink(p,path,'Evidence')).join(' · ')} ${text(i.sourceSection||'')}</p></article>`).join('');
 const headlineIndices=d.headlineIndices||({jobfit:[1,3],forecasting:[1,2],churn:[],butterfly:[0,1],ner:[0,3],recommender:[0,2]}[id])||[0,1,2];
 const headline=headlineIndices.map(i=>d.results[i]).filter(Boolean);
 const metrics=headline.length?`<div class="case-key-results"><div class="metric-grid">${headline.map(r=>`<div class="metric-card"><span class="model-label">${text(r.displayLabel||r.modelVersion)}</span><span class="value">${text(formatValue(r))}</span><span class="label">${text(r.metric)}${r.unit&&!['%','USD','$','GBP','£','score',''].includes(r.unit)?' · '+text(r.unit):''}</span><span class="context">${text(resultContext(r))}</span></div>`).join('')}</div><p class="case-source">${text(d.resultNote||'Recorded results; see the evaluation context and sources below.')} <a href="${caseLink(id)}" data-scroll="case-${id}-results">Read evaluation context ↓</a></p></div>`:'';
 const workflow=d.workflow?.length?`<dl class="workflow">${d.workflow.map(w=>`<div><dt>${text(w.label)}</dt><dd>${text(Array.isArray(w.flow)?w.flow.join(' → '):w.flow)}</dd></div>`).join('')}</dl><p class="case-source">Workflow illustration based on the linked implementation or notebook; it does not establish live availability.</p>`:'';
 const media=portfolioAssets.projects[id];
 const screenshot=media?.path?`<figure class="case-main-image"><button type="button" class="image-open" data-image="${media.original||media.path}" data-caption="${text(media.alt+(media.note?' — '+media.note:''))}" aria-label="Enlarge ${text(p.name)} interface"><img src="${media.path}" width="${media.width}" height="${media.height}" alt="${text(media.alt)}" loading="lazy" decoding="async"><span>View full screenshot ↗</span></button><figcaption>${text(media.note||media.alt)} Source: owner-provided V5.1 asset.</figcaption></figure>`:'';
 const resultsFull=d.results.length?`<div class="result-list">${d.results.map(r=>`<article class="result-item"><p class="eyebrow">${text(prefixes[r.evidenceStatus]||'Recorded result')}</p><h3>${text(r.metric)} <span class="result-value">${text(formatValue(r))}</span>${r.unit&&!['fraction','%','USD','$','GBP','£','score',''].includes(r.unit)?' '+text(r.unit):''}</h3><p>${text(resultContext(r))}</p>${r.modelVersion?`<p>${text(r.modelVersion)}</p>`:''}<p class="case-source">${sourceLink(p,r.sourcePath||p.sourcePath,'Metric source')}</p></article>`).join('')}</div>`:paras(d.resultNote||'This case describes the implemented workflow. No verified performance headline is available.');
 const results=d.results.length>6?`<p>Reader comparisons are shown above. Open the metric ledger for final-total checks, arithmetic consistency, successful runs, and timing with their separate denominators.</p><details class="disclosure"><summary>All recorded measurements & evaluation definitions</summary><div class="disclosure-body">${resultsFull}</div></details>`:resultsFull;
 const slides=portfolioAssets.slides?.[id];const slideLink=slides&&/^https:\/\//.test(slides)?`<a class="btn btn-secondary" href="${text(slides)}" target="_blank" rel="noopener noreferrer">Public slides ↗</a>`:'';
 document.getElementById('case-content').innerHTML=`<div class="case-hero container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/projects">Projects</a><span aria-hidden="true">/</span><span>${text(p.name)}</span></nav><p class="eyebrow">${text(p.label)}</p><h1>${text(p.name)}</h1><p class="case-summary">${text(d.summary)}</p><p class="case-meta">${text(d.subtitle)}</p><div class="project-links"><a class="btn btn-primary" href="${p.github}" target="_blank" rel="noopener noreferrer">View repository ↗</a><a class="btn btn-secondary" href="${caseLink(id)}" data-scroll="case-${id}-exploration">Explore the decisions ↓</a>${slideLink}</div>${metrics}</div><div class="case-nav-wrap"><nav class="case-nav container" aria-label="Case study sections">${[['overview','Overview'],['exploration','Exploration'],['experiments','Experiments'],['workflow','Workflow'],['results','Results'],['lessons','Lessons'],['sources','Sources']].map(([key,label])=>`<a href="${caseLink(id)}" data-scroll="case-${id}-${key}">${label}</a>`).join('')}</nav></div>
 ${section('overview','The problem & scope.',paras(d.overview||p.description)+`<p>${text(d.contribution||'My work in this project covers the exploration and implementation described below. The study uses the datasets, libraries, and pretrained components attributed in the source repository.')}</p>`+screenshot,'01 / OVERVIEW')}
 ${section('exploration','What the data changed.',`<div class="exploration-list">${insights}</div>`,'02 / DATA & DISCOVERY')}
 ${section('experiments','What was tried.<br>What was kept.',paras(d.experiments)+(d.parameters?`<details class="disclosure"><summary>Configuration & preparation details</summary><div class="disclosure-body">${paras(d.parameters)}</div></details>`:''),'03 / EXPERIMENTS & SELECTION')}
 ${section('workflow','How it fits together.',workflow+paras(d.delivery),'04 / SYSTEM OR NOTEBOOK WORKFLOW')}
 ${section('results','Results in context.',(caseVisuals[id]?evidenceChart(caseVisuals[id],p):'')+results,'05 / EVALUATION')}
 ${section('lessons','Limits worth keeping visible.',list(d.lessons)+`<h3>Next experiments</h3><p class="case-source">Proposed next work; these changes are not claimed as completed.</p>`+list(d.nextSteps),'06 / LESSONS & NEXT STEPS')}
 ${section('sources','Explore the evidence.',`<p>Evidence snapshot: ${text(d.checkedAt||'2026-10-14')}. Recorded outputs and implementation sources; no training or inference rerun. <a href="SOURCE_MAP.json">Source and provenance map</a>.</p><ul class="source-links">${d.sources.map(s=>`<li>${sourceLink(p,s.path,s.path,s.ref)}<small>${text(s.section||'')} · ${text(s.ref==='main'?'main snapshot; commit unresolved':s.ref?'commit '+s.ref.slice(0,12):'revision unresolved')}</small></li>`).join('')}</ul>`,'07 / SOURCES')}
 <section class="case-cta"><div class="container"><p class="eyebrow">CONTINUE EXPLORING</p><h2>Another question. Another project.</h2><div class="project-links"><a class="btn btn-primary" href="#/projects">All projects →</a><a class="btn btn-secondary" href="#/contact">Get in touch ↗</a></div></div></section>`;
 return true;
}
function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open)}
function routeName(){try{return decodeURIComponent(location.hash.replace(/^#\/?/,''))||'home'}catch{return 'home'}}
function navigate(){
 const wasNavigated=Boolean(currentRoute);
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());
 if(currentRoute)scrollPositions[currentRoute]=window.scrollY;
 let route=routeName(),caseId=route.startsWith('case/')?route.slice(5):null;
 if(caseId&&!renderCase(caseId)){route='projects';caseId=null}
 if(!caseId&&!routes.includes(route))route='home';
 const page=caseId?'case':route;
 Object.entries(sections).forEach(([key,el])=>el.hidden=key!==page);
 document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===(page==='case'?'projects':page))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 const names={home:'Gidion Depari | Applied AI Engineer',projects:'Projects & Explorations | Gidion Depari',about:'About | Gidion Depari',credentials:'Credentials | Gidion Depari',contact:'Contact | Gidion Depari',resume:'Resume | Gidion Depari'};
 document.title=caseId?`${projectData.find(p=>p.id===caseId).name} | Gidion Depari`:names[page];
 const description=caseId?caseData[caseId].summary:page==='projects'?'Explore applied AI systems, machine learning notebook studies, and data analysis with documented sources and limitations.':'Gidion Depari, Information Systems graduate building applied AI and machine learning projects. Explore the data, decisions, and results behind the work.';
 document.querySelector('meta[name=description]').content=description;
 document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(m=>m.content=document.title);
 document.querySelectorAll('meta[property="og:description"],meta[name="twitter:description"]').forEach(m=>m.content=description);
 setMenu(false);currentRoute=route;
 requestAnimationFrame(()=>window.scrollTo({top:scrollPositions[route]||0,behavior:'instant'}));
 const heading=sections[page].querySelector('h1');if(heading&&wasNavigated){heading.tabIndex=-1;heading.focus({preventScroll:true})}
}
window.addEventListener('hashchange',navigate);
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>12),{passive:true});
menuButton.addEventListener('click',()=>setMenu(menu.hidden));
matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});
document.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape'){setMenu(false);menuButton.focus()}if(e.key==='Tab'){const items=[menuButton,...menu.querySelectorAll('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.addEventListener('click',e=>{if(e.target.closest('.skip-link')){e.preventDefault();const main=document.getElementById('main-content');main.focus();main.scrollIntoView();return}const filter=e.target.closest('[data-filter]');if(filter){document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===filter)));renderGallery(filter.dataset.filter)}if(e.target.closest('#mobile-menu a'))setMenu(false)});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px')).observe(header);
renderHome();renderGallery();renderResume();navigate();
