import {computed,ref} from 'vue';
export function useVariantScreen(kind){
 const controller=kind==='controller';
 const models=controller?['PS4','PS5','PS5 Slim','PS5 Slim','PS5 Pro','PS4 Pro']:['IP 13','IP 13 Pro','IP 13 Pro Max','IP 14','IP 14 Pro','IP 14 Pro Max','IP 15','IP 15 Pro','IP 15 Pro Max','IP 16','IP 16 Pro','IP 16 Pro Max','IP 17','IP 17 Air','IP 17 Pro','IP 17 Pro Max'];
 const active=ref(controller?1:11),favorite=ref(false),panel=ref(''),added=ref(false),message=ref('');
 const colors=controller?['Чёрный','Чёрный','Чёрный']:['( Black )','( Pacific Blue )','( Dark Cherry )'];
 const stock=controller?[100,100,100]:[461,491,488];
 const quantities=ref(models.map((_,i)=>controller?(i===1?[8,0,0]:[0,0,0]):i===5?[3,0,0]:i===8?[2,0,0]:i===11?[1,0,0]:[0,0,0]));
 const rows=computed(()=>quantities.value[active.value]);
 const count=computed(()=>quantities.value.flat().reduce((a,b)=>a+b,0));
 const selectedModels=computed(()=>quantities.value.filter(q=>q.some(Boolean)).length);
 const prices=controller?[850,820,790,750]:[990,450,375,350];
 const priceIndex=ref(controller?1:0);
 const price=computed(()=>prices[priceIndex.value]);
 const total=computed(()=>count.value*price.value);
 const rub=v=>new Intl.NumberFormat('ru-RU').format(v)+' ₽';
 function change(color,delta){quantities.value[active.value][color]=Math.max(0,Math.min(stock[color],rows.value[color]+delta));added.value=false;}
 function selectModel(index){active.value=index;added.value=false;}
 function badge(index){return quantities.value[index].reduce((a,b)=>a+b,0);}
 function reset(){priceIndex.value=controller?1:0;favorite.value=false;active.value=controller?1:11;quantities.value=models.map((_,i)=>controller?(i===1?[8,0,0]:[0,0,0]):i===5?[3,0,0]:i===8?[2,0,0]:i===11?[1,0,0]:[0,0,0]);panel.value='';added.value=false;}
 function cart(){if(count.value){added.value=true;panel.value='cart';}}
 return{controller,models,active,favorite,panel,added,message,colors,stock,quantities,rows,count,selectedModels,prices,priceIndex,price,total,rub,change,selectModel,badge,reset,cart};
}
