// Reference scene: 15° perspective camera, Rz → Ry → Rx parent groups.
// Keep world-space geometry separate from projection; affine corner warps
// cannot reproduce the perspective interpolation of this scene.
export const scene = Object.freeze({
 fov:15,cameraZ:5.8,z:.3,x:.16,rotationX:-.41,rotationY:-.87,rotationZ:.06,
 width:.46,ratio:844/1366,gap:.15,bend:.021,floatingX:-.007,floatingY:.028
});
export function galleryGeometry(width,height,position,index,highlight=0){
 const home=1-highlight;
 const sx=Math.sin(scene.rotationX*home),cx=Math.cos(scene.rotationX*home);
 const sy=Math.sin(scene.rotationY*home),cy=Math.cos(scene.rotationY*home);
 const sz=Math.sin(scene.rotationZ*home),cz=Math.cos(scene.rotationZ*home);
 const rotation=[cz*cy,sz*cy,-sy,cz*sy*sx-sz*cx,sz*sy*sx+cz*cx,cy*sx,cz*sy*cx+sz*sx,sz*sy*cx-cz*sx,cy*cx];
 const tangent=Math.tan(scene.fov*Math.PI/360),aspect=width/height;
 const worldHeight=2*tangent*scene.cameraZ,worldWidth=worldHeight*aspect;
 const planeWidth=scene.width*worldWidth,planeHeight=planeWidth*scene.ratio;
 const baseY=(position-index)*planeHeight*(1+scene.gap);
 // Fixed point of the reference worker's bounding-box feedback:
 // mesh.y = -.06 * (box.max.y + box.min.y).
 const meshY=-.12*home*rotation[4]*baseY/(1+.12*home*rotation[4]);
 const y=baseY+meshY,distance=2*rotation[4]*y;
 const scale=(1-.1*home*Math.abs(distance))*(1-.25*highlight*distance);
 const modelView=new Float32Array([
  rotation[0]*scale,rotation[1]*scale,rotation[2]*scale,0,
  rotation[3]*scale,rotation[4]*scale,rotation[5]*scale,0,
  rotation[6]*scale,rotation[7]*scale,rotation[8]*scale,0,
  worldWidth*scene.x*home+rotation[3]*y,rotation[4]*y,scene.z*home-scene.cameraZ+rotation[5]*y,1
 ]);
 const near=.1,far=2000;
 const projection=new Float32Array([
  1/(tangent*aspect),0,0,0,0,1/tangent,0,0,0,0,-(far+near)/(far-near),-1,
  0,0,-2*far*near/(far-near),0
 ]);
 return {planeWidth,planeHeight,modelView,projection,distance,scale,bend:scene.bend*home,floating:home,highlight};
}
export function projectPoint(geometry,u,v,time,width,height){
 const wave=Math.sin(time*.35*Math.PI)*geometry.floating,{planeWidth,planeHeight,modelView:m,projection:p}=geometry;
 const x=(u-.5)*planeWidth+geometry.bend*(1-2*v)*(2*u-1)*.5+wave*scene.floatingX;
 const y=(.5-v)*planeHeight-geometry.bend*(1-Math.sin(u*Math.PI))+wave*scene.floatingY;
 const viewX=m[0]*x+m[4]*y+m[12],viewY=m[1]*x+m[5]*y+m[13],viewZ=m[2]*x+m[6]*y+m[14];
 return [(viewX*p[0]/-viewZ+1)*width*.5,(1-viewY*p[5]/-viewZ)*height*.5];
}
