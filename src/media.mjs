import sources from '../assets/sources.json';
const images=import.meta.glob('/assets/optimized/screens/*.webp',{eager:true,query:'?url',import:'default'});
const byName=new Map(sources.map(source=>[source.file.split('/').at(-1).replace('.png',''),source]));
export function getScreen(name){
 const source=byName.get(name),url=images['/assets/optimized/screens/'+name+'.webp'];
 if(!source||!url)throw new Error('Unknown portfolio screen: '+name);
 return{url,width:source.width,height:source.height,sourceUrl:source.source};
}
