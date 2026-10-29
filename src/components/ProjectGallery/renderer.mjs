import {galleryGeometry,projectPoint} from './geometry.mjs';
import {previewCanvas,logoCanvas} from './artwork.mjs';
const clockOrigin=performance.now();
export const galleryTime=()=> (performance.now()-clockOrigin)/1000;
const vertex="attribute vec2 uv;\nuniform vec2 planeSize;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float time;\nuniform float frameScale;\nuniform float frameRotation;\nuniform float bend;\nuniform float floating;\nvarying vec2 vUv;\nvoid main(){\n float wave=sin(time*.35*3.141592653589793)*floating;\n vec3 pos=vec3((uv.x-.5)*planeSize.x,(.5-uv.y)*planeSize.y,0.);\n pos.y-=bend*(1.-sin(uv.x*3.141592653589793));\n pos.x+=bend*(1.-2.*uv.y)*(2.*uv.x-1.)*.5;\n pos.xy+=wave*vec2(-.007,.028);\n vUv=(uv-.5)*frameScale+.5+wave*vec2(-.007,-.028);\n vec2 centered=vUv-.5;\n centered.y*=planeSize.y/planeSize.x;\n float c=cos(frameRotation),s=sin(frameRotation);\n centered=mat2(c,-s,s,c)*centered;\n centered.y/=planeSize.y/planeSize.x;\n vUv=centered+.5;\n gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);\n}";
const fragment="precision mediump float;\nuniform sampler2D textureImage;\nuniform sampler2D logoImage;\nuniform float distanceFromCenter;\nuniform float highlight;\nuniform float photoScale;\nuniform float maskLeft;\nuniform float maskRight;\nuniform vec2 resolution;\nuniform vec2 pointer;\nvarying vec2 vUv;\nvoid main(){\n vec2 st=gl_FragCoord.xy/resolution;\n if(st.x<maskLeft||st.x>1.-maskRight)discard;\n float distance=abs(distanceFromCenter);\n vec2 photoUv=(vUv-.5)*(1.95-photoScale-.11*(1.-highlight)*distance)+.5;\n vec4 color=mix(texture2D(textureImage,photoUv),texture2D(logoImage,photoUv),highlight);\n float normalized=1.-clamp(distance,0.,1.);\n float opacity=mix(.55+.45*normalized,1.,highlight);\n float gray=dot(color.rgb,vec3(.299,.587,.114));\n color=vec4(mix(vec3(gray),color.rgb,mix(normalized,1.,highlight)),color.a*opacity);\n vec2 delta=vec2(pointer.x,1.-pointer.y)-st;\n delta.x*=resolution.x/resolution.y;\n float light=(1.-sin(min(length(delta)/.7,1.)*1.57079632679))*.08*opacity;\n gl_FragColor=color;\n}";
export async function createGalleryRenderer(canvas,root,projects,selected,options={}){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:!!options.static});if(!gl)return null;
 const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.useProgram(program);
 const points=[];for(let x=0;x<50;x++)for(let y=0;y<2;y++){const a=x/50,b=(x+1)/50,c=y/2,d=(y+1)/2;points.push(a,c,b,c,a,d,a,d,b,c,b,d)}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
 const uv=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);
 const uniforms=Object.fromEntries(['resolution','planeSize','modelViewMatrix','projectionMatrix','time','frameScale','frameRotation','photoScale','distanceFromCenter','bend','floating','highlight','maskLeft','maskRight','pointer','textureImage','logoImage'].map(n=>[n,gl.getUniformLocation(program,n)]));
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
 const upload=source=>{
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  return texture;
 };
 const textures=await Promise.all(projects.map(async project=>{
  const [preview,logo]=await Promise.all([previewCanvas(project),logoCanvas(project)]);
  return [upload(preview),upload(logo)];
 }));
 const links=[...root.querySelectorAll('.gallery-hit')],preference=matchMedia('(prefers-reduced-motion:reduce)');
 let width=0,height=0,frame=0,last=0,time=options.initialTime??galleryTime(),position=options.initialPosition??selected(),velocity=0,disposed=false,lastHitUpdate=-Infinity,pointer={x:.5,y:.5},targetPointer={x:.5,y:.5};
 function resize(){width=root.clientWidth;height=root.clientHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);invalidate();}
 const observer=new ResizeObserver(resize);observer.observe(root);
 function draw(now){
  if(disposed)return;frame=0;if(!width||!height)return;const dt=Math.min((now-last)/1000||.016,.032);last=now;
  if(options.position){position=options.position();velocity=0;}else if(preference.matches){position=selected();velocity=0;}else{const acceleration=(selected()-position)*80/2.5-velocity*24/2.5;velocity+=acceleration*dt;position+=velocity*dt;time=galleryTime();}
  const state=options.state?.()||{};
  if(options.time)time=options.time();
  pointer.x+=(targetPointer.x-pointer.x)*.06;pointer.y+=(targetPointer.y-pointer.y)*.06;
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(uniforms.resolution,width,height);
  const updateHits=now-lastHitUpdate>=50;if(updateHits)lastHitUpdate=now;
  projects.forEach((project,index)=>{
   const virtualIndex=options.loop?index+Math.round((position-index)/projects.length)*projects.length:index;
   const offset=virtualIndex-position,distance=Math.abs(offset);
   if(state.onlyIndex!==undefined&&index!==state.onlyIndex)return;
   const active=index===(options.loop?(selected()%projects.length+projects.length)%projects.length:selected());
   const highlight=active?(state.highlight||0):0;
   const geometry=options.geometry?.(width,height,index,state)||galleryGeometry(width,height,position,virtualIndex,highlight);
   gl.uniform2f(uniforms.planeSize,geometry.planeWidth,geometry.planeHeight);
   gl.uniformMatrix4fv(uniforms.modelViewMatrix,false,geometry.modelView);
   gl.uniformMatrix4fv(uniforms.projectionMatrix,false,geometry.projection);
   gl.uniform1f(uniforms.bend,geometry.bend);gl.uniform1f(uniforms.floating,geometry.floating);
   gl.uniform1f(uniforms.highlight,highlight);
   gl.uniform1f(uniforms.maskLeft,active?(state.activeMaskLeft||0):(state.otherMaskLeft||0));
   gl.uniform1f(uniforms.maskRight,state.maskRight||0);
   gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.frameScale,geometry.scale);gl.uniform1f(uniforms.frameRotation,geometry.frameRotation||0);gl.uniform1f(uniforms.photoScale,geometry.photoScale||1);
   gl.uniform1f(uniforms.distanceFromCenter,geometry.distance);
   gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
   gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[index][0]);gl.uniform1i(uniforms.textureImage,0);
   gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,textures[index][1]);gl.uniform1i(uniforms.logoImage,1);gl.drawArrays(gl.TRIANGLES,0,points.length/2);
   // The hit target follows the actual curved mesh, including perspective.
   if(!links[index]||!updateHits)return;
   const boundary=[];
   for(let x=0;x<=16;x++)boundary.push(projectPoint(geometry,x/16,0,time,width,height));
   for(let x=16;x>=0;x--)boundary.push(projectPoint(geometry,x/16,1,time,width,height));
   links[index].style.clipPath='polygon('+boundary.map(p=>p[0]/width*100+'% '+p[1]/height*100+'%').join(',')+')';
   links[index].style.zIndex=String(10-Math.round(distance));links[index].dataset.offset=offset.toFixed(4);
  });
  canvas.dataset.position=position.toFixed(5);canvas.dataset.time=time.toFixed(3);
  if(!document.hidden&&!preference.matches&&!options.manual&&!options.static)frame=requestAnimationFrame(draw);
 }
 function invalidate(){if(!frame&&!disposed){last=performance.now();frame=requestAnimationFrame(draw)}}
 function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate()}
 function motion(){invalidate()}
 function move(e){if(options.static||options.manual)return;targetPointer={x:e.clientX/width,y:e.clientY/height};invalidate()}
 function leave(){targetPointer={x:.5,y:.5}}
 document.addEventListener('visibilitychange',visibility);preference.addEventListener('change',motion);window.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);resize();
 return{invalidate,render(){cancelAnimationFrame(frame);frame=0;draw(performance.now())},destroy(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',motion);window.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);textures.flat().forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext()}};
}
