const INK='#1b1330',HIP=58,LEG=46;let tNow=0;const lerp=(a,b,k)=>a+(b-a)*k;const SKINS={turuncu:{base:'#ff7a00',f:['#ff3b3b','#ffc21a','#2ec27e','#2f80ff','#ff5fb8']}};const toySkin=()=>SKINS.turuncu;
function drawToy(c,x,y,ang,r,sq,speed,skin){
  const TOY=skin||toySkin();
  c.save();c.translate(x,y);c.rotate(ang);c.scale(1+sq,1-sq);
  const baseY=r*0.55,n=TOY.f.length,sway=Math.min(1,speed)*0.09;
  for(let i=0;i<n;i++){
    const a=-0.5+i/(n-1)+Math.sin(tNow*14+i*1.3)*sway;
    c.save();c.translate(0,baseY-r*0.15);c.rotate(a);
    const L=r*1.75,w=r*0.36;
    c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-w,-L*0.55,0,-L);c.quadraticCurveTo(w,-L*0.55,0,0);
    c.fillStyle=TOY.f[i];c.fill();c.lineWidth=Math.max(1.4,r*0.08);c.strokeStyle=INK;c.stroke();
    c.beginPath();c.moveTo(0,-2);c.lineTo(0,-L*0.85);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=Math.max(1,r*0.05);c.stroke();
    c.restore();
  }
  c.beginPath();c.ellipse(0,baseY,r*0.5,r*0.32,0,0,Math.PI*2);c.fillStyle=TOY.base;c.fill();
  c.lineWidth=Math.max(2,r*0.1);c.strokeStyle=INK;c.stroke();
  c.beginPath();c.ellipse(0,baseY-r*0.05,r*0.5,r*0.09,0,0,Math.PI*2);c.strokeStyle='rgba(27,19,48,.55)';c.lineWidth=Math.max(1,r*0.06);c.stroke();
  c.beginPath();c.ellipse(-r*0.15,baseY-r*0.1,r*0.16,r*0.08,-0.3,0,Math.PI*2);c.fillStyle='rgba(255,255,255,.55)';c.fill();
  c.restore();
}
function limb(c,x1,y1,x2,y2,bend,w){c.beginPath();c.moveTo(x1,y1);const mx=(x1+x2)/2,my=(y1+y2)/2,dx=y2-y1,dy=-(x2-x1),l=Math.hypot(dx,dy)||1;c.quadraticCurveTo(mx+dx/l*bend,my+dy/l*bend,x2,y2);c.lineWidth=w;c.lineCap='round';c.strokeStyle='#15101f';c.stroke()}
function glove(c,x,y,r,a){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#fff';c.strokeStyle=INK;c.lineWidth=2;c.beginPath();c.arc(0,0,r,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(-r*0.9,0,r*0.35,r*0.75,0,0,7);c.fill();c.stroke();c.beginPath();c.arc(r*0.55,-r*0.6,r*0.45,0,7);c.fill();c.stroke();c.restore()}
function shoe(c,x,y,a){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#fff';c.strokeStyle=INK;c.lineWidth=2;c.beginPath();c.ellipse(4,5,15,5,0,0,7);c.fill();c.stroke();c.fillStyle='#e11d2a';c.beginPath();c.ellipse(4,-1,14,9,0,Math.PI,0);c.lineTo(18,3);c.lineTo(-10,3);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(0,-5,5,2.5,-.3,0,7);c.fill();c.restore()}
function drawMascot(c,mx,t,opts){
  const m=opts;const la=m.leg;const bob=m.running?Math.abs(Math.sin(t*14))*-5:Math.sin(t*2.2)*1.5;
  const lean=-0.18*Math.max(0,Math.sin(la))*(la>0?1:0)+(m.running?0.12:0)+0.08*m.wind;
  const hipY=-HIP+bob;
  // legs
  let sA=0.05,run=m.running?Math.sin(t*14):0;
  const hipB={x:mx-8,y:hipY},hipF={x:mx+8,y:hipY};
  const backA=m.running?-run*0.7:-0.08-0.15*Math.max(0,Math.sin(la));
  const fA=m.running?run*0.7:la;
  const fb={x:hipB.x+Math.sin(backA)*LEG,y:hipB.y+Math.cos(backA)*LEG};
  // shadow
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(mx,2,38,7,0,0,7);c.fill();
  // back arm
  const body={x:mx,y:hipY-34};
  c.save();c.translate(mx,hipY);c.rotate(lean);c.translate(-mx,-hipY);
  const shB={x:body.x-24,y:body.y+6},shF={x:body.x+22,y:body.y+8};
  const armSwing=m.running?Math.sin(t*14)*0.9:0;
  const kickArms=m.kickPose;
  let gB={x:shB.x-14-kickArms*18+armSwing*10,y:shB.y+28-kickArms*34};
  limb(c,shB.x,shB.y,gB.x,gB.y,-8,4);glove(c,gB.x,gB.y,6.5,-0.6);
  c.restore();
  // back leg
  limb(c,hipB.x,hipB.y,fb.x,fb.y,m.running?6:3,4.5);shoe(c,fb.x,Math.min(fb.y,-4),m.running?backA*0.6:0);
  c.save();c.translate(mx,hipY);c.rotate(lean);c.translate(-mx,-hipY);
  // body
  const g=c.createRadialGradient(body.x-10,body.y-12,4,body.x,body.y,34);g.addColorStop(0,'#ff5a5a');g.addColorStop(0.7,'#e11d2a');g.addColorStop(1,'#a50f1a');
  // crest (three flames)
  const sway=Math.sin(t*3)*0.06+(m.running?-0.15:0);
  for(const [ox,h,rot,col] of [[-14,58,-0.32,'#c1121f'],[14,56,0.3,'#c1121f'],[0,72,0.02,'#e11d2a']]){
    c.save();c.translate(body.x+ox*0.6,body.y-24);c.rotate(rot+sway);
    c.beginPath();c.moveTo(-14,4);c.quadraticCurveTo(-16,-h*0.5,0,-h);c.quadraticCurveTo(4,-h*0.55,14,4);c.closePath();
    const cg=c.createLinearGradient(0,0,0,-h);cg.addColorStop(0,col);cg.addColorStop(1,'#ff4d4d');c.fillStyle=cg;c.fill();c.lineWidth=2;c.strokeStyle='rgba(27,19,48,.6)';c.stroke();
    c.beginPath();c.moveTo(-3,-6);c.quadraticCurveTo(-5,-h*0.45,0,-h*0.85);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;c.stroke();
    c.restore();
  }
  c.fillStyle=g;c.beginPath();c.arc(body.x,body.y,32,0,7);c.fill();c.lineWidth=2.5;c.strokeStyle=INK;c.stroke();
  c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(body.x-12,body.y-16,9,5,-0.5,0,7);c.fill();
  // face (3/4 to the right)
  const look=m.look||{x:1,y:0};
  const ey=body.y-6,eyes=[[body.x+2,9.5],[body.x+20,8.5]];
  for(const [ex,rr] of eyes){c.fillStyle='#fff';c.beginPath();c.ellipse(ex,ey,rr*0.8,m.blink<0?1.5:rr,0,0,7);c.fill();c.lineWidth=1.8;c.strokeStyle=INK;c.stroke();
    if(m.blink>=0){c.fillStyle=INK;c.beginPath();c.arc(ex+look.x*3,ey+look.y*3+1,3.6,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex+look.x*3-1.2,ey+look.y*3-0.5,1.2,0,7);c.fill()}}
  c.lineWidth=4;c.lineCap='round';c.strokeStyle=INK;c.beginPath();c.moveTo(body.x-6,ey-14);c.lineTo(body.x+8,ey-9);c.moveTo(body.x+14,ey-10);c.lineTo(body.x+27,ey-15);c.stroke();
  c.fillStyle='#3a0a14';c.beginPath();c.moveTo(body.x-14,body.y+6);c.quadraticCurveTo(body.x+8,body.y+12,body.x+29,body.y+5);c.quadraticCurveTo(body.x+24,body.y+27+m.cheer*4,body.x+8,body.y+27+m.cheer*4);c.quadraticCurveTo(body.x-10,body.y+25,body.x-14,body.y+6);c.fill();c.lineWidth=2;c.strokeStyle=INK;c.stroke();
  c.fillStyle='#ff6b81';c.beginPath();c.ellipse(body.x+8,body.y+22+m.cheer*3,9,4.5,0,0,7);c.fill();
  c.fillStyle='#fff';c.beginPath();c.moveTo(body.x-11,body.y+8);c.quadraticCurveTo(body.x+8,body.y+13,body.x+26,body.y+7);c.lineTo(body.x+25,body.y+11);c.quadraticCurveTo(body.x+8,body.y+17,body.x-10,body.y+12);c.fill();
  // shoulder pads
  for(const s of [shB,shF]){const pg=c.createLinearGradient(s.x,s.y-6,s.x,s.y+6);pg.addColorStop(0,'#f1f3f5');pg.addColorStop(1,'#9aa5b1');c.fillStyle=pg;c.beginPath();c.ellipse(s.x,s.y,9,6,s===shB?-0.4:0.4,0,7);c.fill();c.lineWidth=1.5;c.strokeStyle=INK;c.stroke()}
  c.restore();
  // front leg (kicking) + front arm
  const ff={x:hipF.x+Math.sin(fA)*LEG,y:hipF.y+Math.cos(fA)*LEG};
  limb(c,hipF.x,hipF.y,ff.x,ff.y,m.running?-6:(fA>0.5?-10:4),4.5);shoe(c,ff.x,Math.min(ff.y,-4),m.running?fA*0.6:fA*0.55);
  c.save();c.translate(mx,hipY);c.rotate(lean);c.translate(-mx,-hipY);
  let gF;
  if(m.toss>0)gF={x:shF.x+6,y:shF.y-28-m.toss*14};
  else gF={x:shF.x+16-armSwing*10+kickArms*14,y:shF.y+26-kickArms*40+m.cheer*-30};
  limb(c,shF.x,shF.y,gF.x,gF.y,8,4);glove(c,gF.x,gF.y,6.5,0.4);
  c.restore();
  return {hand:gF};
}