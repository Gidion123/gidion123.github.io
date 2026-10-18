/* Native dialogs retain browser keyboard/focus behavior. No remote services. */
(()=>{
  const dialog=document.getElementById('image-dialog');
  let opener=null;
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-image]');
    if(trigger){
      opener=trigger;
      document.getElementById('image-dialog-title').textContent=trigger.dataset.imageTitle||'Project evidence';
      const image=document.getElementById('image-dialog-picture');
      image.src=trigger.dataset.image;
      image.alt=trigger.dataset.caption;
      document.getElementById('image-dialog-caption').textContent=trigger.dataset.caption;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      document.getElementById('image-dialog-title').focus();
    }
    if(event.target.closest('[data-close-image]'))dialog.close();
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');if(opener?.isConnected)opener.focus()});
  document.addEventListener('load',event=>{if(event.target.tagName==='IMG'&&event.target.hasAttribute('data-fallback-media'))event.target.closest('[data-media-slot]')?.classList.add('media-loaded')},true);
  document.querySelectorAll('[data-fallback-media]').forEach(img=>{if(img.complete&&img.naturalWidth)img.closest('[data-media-slot]')?.classList.add('media-loaded')});
  document.addEventListener('error',event=>{
    if(event.target.tagName!=='IMG')return;
    const img=event.target;
    img.hidden=true;
    if(img.hasAttribute('data-fallback-media')){img.closest('[data-media-slot]')?.classList.remove('media-loaded');return}
    const fallback=document.createElement('p');
    fallback.className='asset-fallback';
    fallback.textContent='This image could not load. Its description: '+img.alt;
    img.after(fallback);
  },true);
})();
