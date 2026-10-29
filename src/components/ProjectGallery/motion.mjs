// Timings and easing curves from the public Robin Noguier transition scene.
export const motionTiming=Object.freeze({delay:300,plane:820,page:1000,returnPage:1400,returnReset:900});
export function bezier(x1,y1,x2,y2){
 const curve=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1;for(let i=0;i<22;i++){const t=(lo+hi)/2;if(curve(t,x1,x2)<x)lo=t;else hi=t;}return curve((lo+hi)/2,y1,y2);};
}
export const planeEase=bezier(.4,0,.3,1),pageEase=bezier(.6,0,.18,1),returnEase=bezier(.75,0,.25,1);
export function transitionFrame(type,elapsed){
 const returning=type==='case-home',duration=returning?motionTiming.returnPage:motionTiming.page;
 const progress=(returning?returnEase:pageEase)((elapsed-motionTiming.delay)/duration);
 return {
  progress,
  highlight:returning?(elapsed<motionTiming.returnReset?1:0):planeEase((elapsed-motionTiming.delay)/motionTiming.plane),
  homeReveal:returning?Math.max(progress-.65,0)/.35:1-progress,
  returnCover:Math.max(1-progress-.65,0)/.35,
  done:elapsed>=motionTiming.delay+duration
 };
}
