export async function finishPreloader(){
 const loader=document.getElementById('site-preloader');if(!loader)return;
 const started=performance.now();
 try{
  await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,3000))]);
  await new Promise(resolve=>{
   function ready(){
    const main=document.querySelector('#app main');
    const gallery=main?.querySelector('.webgl-gallery');
    const poster=main?.querySelector('.case-poster');
    const mobile=innerWidth<=800;
    const scene=main&&(mobile||gallery?.querySelector('canvas[data-position]')||poster?.dataset.ready||gallery&&!gallery.classList.contains('ready')&&performance.now()-started>2500);
    if(scene||performance.now()-started>7000)resolve();else setTimeout(ready,32);
   }ready();
  });
  const images=[...document.querySelectorAll('.case-cover-artwork img,.mobile-cover.active img,.brand-ambience img.visible')];
  await Promise.race([Promise.allSettled(images.map(i=>i.decode())),new Promise(resolve=>setTimeout(resolve,1500))]);
 }finally{
  clearTimeout(window.__preloadFallback);
  document.documentElement.classList.remove('is-loading');
  loader.classList.add('is-finished');
  setTimeout(()=>loader.remove(),matchMedia('(prefers-reduced-motion:reduce)').matches?0:280);
 }
}
