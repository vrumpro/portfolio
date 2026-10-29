import {projectPresentation} from '../../presentation.mjs';
const logos=import.meta.glob('/assets/optimized/logos/*-satin-3d.webp',{eager:true,query:'?url',import:'default'});
const marks=new Map(),cards=new Map();
export function logoURL(slug){
 return logos['/assets/optimized/logos/'+projectPresentation(slug).logo+'-satin-3d.webp'];
}
export const logoWidth=slug=>slug==='sokolov'?1100:720;
async function compose(project,onCard){
 const img=new Image();img.src=logoURL(project.slug);await img.decode();
 const canvas=document.createElement('canvas');canvas.width=1366;canvas.height=844;
 const ctx=canvas.getContext('2d');
 if(onCard){ctx.fillStyle=projectPresentation(project.slug).card;ctx.fillRect(0,0,canvas.width,canvas.height);}
 const width=logoWidth(project.slug),height=width*img.naturalHeight/img.naturalWidth;
 ctx.drawImage(img,(canvas.width-width)/2,(canvas.height-height)/2,width,height);
 return canvas;
}
export function logoCanvas(project){
 if(!marks.has(project.slug))marks.set(project.slug,compose(project,false));
 return marks.get(project.slug);
}
export function previewCanvas(project){
 if(!cards.has(project.slug))cards.set(project.slug,compose(project,true));
 return cards.get(project.slug);
}
