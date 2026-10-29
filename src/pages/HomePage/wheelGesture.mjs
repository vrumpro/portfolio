// Treat direction changes and fresh acceleration separately from decaying inertia.
export function createWheelGesture(){
 let last=-Infinity,previous=0,direction=0,total=0,used=false,changed=-Infinity;
 return function consume(delta,now,discrete=false){
  const sign=Math.sign(delta),magnitude=Math.abs(delta);if(!sign)return 0;
  const gap=now-last;
  const fresh=gap>160||sign!==direction||(now-changed>220&&magnitude>=18&&magnitude>previous*1.8)||(discrete&&now-changed>240);
  if(fresh){total=0;used=false;}
  last=now;previous=magnitude;direction=sign;
  if(used)return 0;
  total+=delta;
  if(Math.abs(total)<36)return 0;
  used=true;changed=now;total=0;return sign;
 };
}
