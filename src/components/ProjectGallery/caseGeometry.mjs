import {galleryGeometry,scene} from './geometry.mjs';
// Original st/worker: hero y=.0004*scroll; next y=-.0015*remaining.
// Highlighted mesh scale=1-.25*distance, rotation=-.2*distance.
export function caseGeometry(width,height,{mode='hero',scroll=0,remaining=0,open=0}={}){
 const g=galleryGeometry(width,height,0,0,1);
 const y=mode==='next'?-.0015*remaining:.0004*scroll,distance=2*y;
 const scale=mode==='next'?.85+.15*open:Math.max(.4,1-.25*distance);
 const angle=mode==='next'?.1*(1-open):-.2*distance,c=Math.cos(angle),s=Math.sin(angle);
 g.modelView=new Float32Array([c*scale,s*scale,0,0,-s*scale,c*scale,0,0,0,0,scale,0,0,y,-scene.cameraZ,1]);
 return {...g,distance,scale,frameRotation:angle,photoScale:mode==='next'?1.15-.15*open:1};
}
