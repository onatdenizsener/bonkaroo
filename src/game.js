(()=>{
const $=id=>document.getElementById(id);
const cv=$('c'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR}
addEventListener('resize',resize);resize();
const rng=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const hsh=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const easeOut=t=>1-Math.pow(1-t,3);
const easeBack=t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const PX=20; // pixels per game metre
const INK='#1b1330';
const VERSION='1.0';
// Flix toy colours (same palette as Flix Kick Up). price: coins in the shop; the "All Balls" purchase unlocks every one.
const SKINS={
  turuncu:{price:0,base:'#ff7a00',f:['#ff3b3b','#ffc21a','#2ec27e','#2f80ff','#ff5fb8']},
  sari:{price:250,base:'#ffcc00',f:['#ff3b3b','#ff8a1f','#2ec27e','#2f80ff','#9b5cff']},
  beyaz:{price:250,base:'#f4f4f4',f:['#ff3b3b','#ffc21a','#2ec27e','#2f80ff','#ff5fb8']},
  kirmizi:{price:500,base:'#e11d2a',f:['#ffc21a','#ff8a1f','#2ec27e','#2f80ff','#ffffff']},
  mavi:{price:500,base:'#2f80ff',f:['#ffffff','#9fd3ff','#ffffff','#9fd3ff','#ffffff']},
  cimen:{price:500,base:'#2ec27e',f:['#e8ff6b','#ffffff','#e8ff6b','#ffffff','#e8ff6b']},
  pembe:{price:800,base:'#ff7fbf',f:['#ffd1ea','#ffffff','#b6e3ff','#ffffff','#ffd1ea']},
  mor:{price:1200,base:'#5b2bb5',f:['#00e0c6','#ff4fd8','#00e0c6','#ff4fd8','#00e0c6']},
  turkiye:{price:1500,base:'#e30a17',f:['#ffffff','#e30a17','#ffffff','#e30a17','#ffffff']},
  siyahbeyaz:{price:1500,base:'#111111',f:['#ffffff','#111111','#ffffff','#111111','#ffffff']},
};
const toySkin=()=>SKINS[save.skin]||SKINS.turuncu;

// ================= DATA =================
// Themes: what the land between two cities looks like and what lives there.
const TH={
  marmara:{sky:'#4aa3e0,#cfeaff',hills:'#8fb7a0,#6f9f86',ground:'water',deco:'none',bouncer:'ferry',slow:null,pops:['#ff4d6d','#ffd23f'],flyers:[['gull',5]],big:'plane'},
  uludag:{sky:'#5fb0e6,#eef8ff',hills:'#f4f8fb,#9cc59a',ground:'snow',deco:'pine',bouncer:'ramp',slow:'snow',pops:['#ff4d6d','#4dabf7'],flyers:[['cable',2],['gull',1]],big:'cable'},
  ege:{sky:'#3fa2e8,#d9f1ff',hills:'#a9c98d,#86b26f',ground:'grass',deco:'olive',bouncer:'spring',slow:'mud',pops:['#ff4d6d','#ffd23f','#9b5de5'],flyers:[['flamingo',3],['gull',2]],big:'plane'},
  akdeniz:{sky:'#1f9be6,#bdeaff',hills:'#d9c29a,#7fb36a',ground:'sand',deco:'palm',bouncer:'umbrella',slow:'sand',pops:['#ff8c42','#ffd23f'],flyers:[['parasail',2],['gull',2]],big:'parasail'},
  kapadokya:{sky:'#f29e63,#ffe6c2',hills:'#e0be96,#cba077',ground:'tuff',deco:'fairy',bouncer:'spring',slow:'sand',pops:['#ff4d6d','#ffd23f','#4dabf7'],flyers:[['hotair',2],['pigeon',3]],big:'hotair'},
  ankara:{sky:'#6aaee0,#eef5fa',hills:'#d9c991,#c4b273',ground:'steppe',deco:'poplar',bouncer:'spring',slow:'mud',pops:['#e63946','#ffffff'],flyers:[['pigeon',4]],big:'plane'},
  europe:{sky:'#6bb6ea,#e2f3ff',hills:'#9fcf8b,#78bd6a',ground:'grass',deco:'tree',bouncer:'cafe',slow:'mud',pops:['#ff4d6d','#4dabf7'],flyers:[['pigeon',4]],big:'plane'},
  atlantic:{sky:'#3d8fd6,#b6e0ff',hills:'#7fa9c9,#6b98bb',ground:'water',deco:'none',bouncer:'ferry',slow:null,pops:['#ff4d6d','#ffd23f'],flyers:[['gull',4]],big:'plane'},
  tropic:{sky:'#1fa6d8,#fff0b8',hills:'#4fae5f,#2f8f4a',ground:'sand',deco:'palm',bouncer:'umbrella',slow:'sand',pops:['#ff4d6d','#06d6a0','#ffd23f'],flyers:[['parrot',4]],big:'plane'},
  sunsea:{sky:'#ef7b54,#ffd8a8',hills:'#c98a7a,#b5776a',ground:'water',deco:'none',bouncer:'ferry',slow:null,pops:['#ffd23f'],flyers:[['gull',4]],big:'plane'},
  desert:{sky:'#f0a35a,#ffe9b8',hills:'#e8c07d,#d9a85e',ground:'sand',deco:'cactus',bouncer:'spring',slow:'sand',pops:['#e63946','#ffd23f'],flyers:[['eagle',3]],big:'plane'},
  istanbul:{sky:'#56a9e3,#d6efff',hills:'#9ccf8e,#7bbd70',ground:'grass',deco:'tree',bouncer:'spring',slow:'mud',pops:['#e63946','#ffd23f'],flyers:[['gull',5]],big:'plane'},
  medsea:{sky:'#3fa2e8,#d4efff',hills:'#9bb9c9,#88a9bb',ground:'water',deco:'none',bouncer:'ferry',slow:null,pops:['#ff4d6d','#ffd23f'],flyers:[['gull',5]],big:'plane'},
};
for(const k in TH){TH[k].sky=TH[k].sky.split(',');TH[k].hills=TH[k].hills.split(',')}

// Tours: city list with cumulative km. A leg's look comes from its destination city (segs = [fraction, theme]).
const TOURS={
  tr:{name:'Türkiye Turu',km:1,cities:[
    {n:'İstanbul',km:0,lm:'istanbul',col:'#d62828',note:'Marmara martıları tüylere bayılır'},
    {n:'Bursa',km:155,lm:'bursa',col:'#2a9d8f',segs:[[0,'istanbul'],[.12,'marmara'],[.55,'uludag']],note:'Feribotta sek, Uludağ teleferiğine kon'},
    {n:'İzmir',km:485,lm:'izmir',col:'#3a86ff',segs:[[0,'ege']],note:'Flamingolar seni kapar, zeytinliklerden geçersin'},
    {n:'Antalya',km:925,lm:'antalya',col:'#fb8500',segs:[[0,'akdeniz']],note:'Plaj şemsiyelerinde zıpla, paraşüte takıl'},
    {n:'Kapadokya',km:1405,lm:'kapadokya',col:'#c1121f',segs:[[0,'kapadokya']],note:'Sıcak hava balonlarıyla süzül'},
    {n:'Ankara',km:1695,lm:'ankara',col:'#6a4c93',segs:[[0,'ankara']],note:'Güvercinlerle başkente uç'},
  ]},
  world:{name:'Dünya Turu',km:8,cities:[
    {n:'İstanbul',km:0,lm:'istanbul',col:'#d62828'},
    {n:'Paris',km:2250,lm:'paris',col:'#3a0ca3',segs:[[0,'istanbul'],[.04,'europe']],note:'Kafe şemsiyeleri ve güvercinler'},
    {n:'New York',km:8090,lm:'newyork',col:'#f77f00',segs:[[0,'atlantic']],note:'Okyanusu sekerek ve uçakla geç'},
    {n:'Rio',km:15840,lm:'rio',col:'#2a9d8f',segs:[[0,'atlantic'],[.45,'tropic']],note:'Papağanlar seni taşır'},
    {n:'Kahire',km:25740,lm:'kahire',col:'#bc6c25',segs:[[0,'sunsea'],[.65,'desert']],note:'Kartallarla piramitlere'},
    {n:'İstanbul',km:26970,lm:'istanbul',col:'#d62828',segs:[[0,'medsea']],note:'Eve dönüş!'},
  ]},
};
for(const t in TOURS){for(const c of TOURS[t].cities)c.at=c.km/TOURS[t].km}
TOURS.tr.cities.forEach((c,i)=>{if(i)c.note='n_tr'+(i+1)});TOURS.world.cities.forEach((c,i)=>{if(i)c.note='n_w'+i});

// Things Flix can grab with its spikes.
const FLY={
  gull:{r:16,free:150,carry:560,rise:-25,time:1.5,h:[90,330],hang:26,label:'Martı kaptı!'},
  pigeon:{r:14,free:130,carry:520,rise:-25,time:1.4,h:[80,300],hang:24,label:'Güvercin kaptı!'},
  flamingo:{r:18,free:140,carry:600,rise:-20,time:1.7,h:[90,300],hang:30,label:'Flamingo kaptı!'},
  parrot:{r:16,free:170,carry:620,rise:-30,time:1.6,h:[90,340],hang:26,label:'Papağan kaptı!'},
  eagle:{r:20,free:160,carry:680,rise:-60,time:1.6,h:[120,380],hang:30,label:'Kartal kaptı!'},
  cable:{r:24,free:90,carry:460,rise:-170,time:2.4,h:[200,420],hang:40,label:'Teleferiğe kondun!'},
  parasail:{r:28,free:200,carry:640,rise:-70,time:2.2,h:[160,380],hang:58,label:'Paraşüte takıldın!'},
  hotair:{r:42,free:60,carry:400,rise:-150,time:3.2,h:[260,560],hang:84,label:'Balon sepetine düştün!'},
  plane:{r:32,free:420,carry:980,rise:-15,time:2.6,h:[560,860],hang:26,label:'Uçağa takıldın!'},
};

const UPS=[
  {id:'power',name:'Şut Gücü',desc:'Flix daha sert vurur',max:10,cost:l=>Math.round(30*Math.pow(1.6,l))},
  {id:'bounce',name:'Lastik Gövde',desc:'Yerde ve suda daha iyi seker',max:8,cost:l=>Math.round(40*Math.pow(1.7,l))},
  {id:'spike',name:'Renkli Tüyler',desc:'Kuşlar ve araçlar seni daha uzun taşır',max:6,cost:l=>Math.round(50*Math.pow(1.8,l))},
  {id:'boost',name:'Ekstra Zıplama',desc:'Havada +1 zıplama',max:4,cost:l=>Math.round(80*Math.pow(2.2,l))},
];



// ================= SAVE =================
const KEY='bonkaroo_v3';
const freshTour=()=>({journey:0,leg:0,round:1,stamps:{}});
let save={coins:0,best:0,tour:'tr',lv:{power:0,bounce:0,spike:0,boost:0},tours:{tr:freshTour(),world:freshTour()},
  lang:'tr',sound:true,haptic:true,skins:['turuncu'],skin:'turuncu',noads:false,skinPack:false,tx:[],runs:0,superNext:false};
try{const s=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('bonkaroo_v2'));
  if(s&&s.tours){const lv=Object.assign({},save.lv,s.lv),tours=Object.assign({},save.tours,s.tours);save=Object.assign(save,s);save.lv=lv;save.tours=tours;
    if(!Array.isArray(save.skins)||!save.skins.length)save.skins=['turuncu'];if(!Array.isArray(save.tx))save.tx=[];if(!TX[save.lang])save.lang='tr'}}catch(e){}
function store(){try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}}
const T=()=>TOURS[save.tour], TS=()=>save.tours[save.tour];
function themeAt(m){
  const cs=T().cities;let i=1;
  while(i<cs.length-1&&m>=cs[i].at)i++;
  const a=cs[i-1].at,b=cs[i].at,f=Math.max(0,(m-a)/(b-a));
  let th=cs[i].segs[0][1];for(const s of cs[i].segs)if(f>=s[0])th=s[1];
  return TH[th];
}
const fmt=n=>Math.round(n).toLocaleString(save.lang==='tr'?'tr-TR':save.lang==='ar'?'ar-EG':save.lang);
let lastVib=0;
function vib(ms){if(!save.haptic)return;try{if(window.FlixNative&&FlixNative.haptic)FlixNative.haptic(ms);else{const n=Date.now();if(n-lastVib>40&&navigator.vibrate){lastVib=n;navigator.vibrate(ms)}}}catch(e){}}

// ================= AUDIO =================
let AC=null;
function beep(f=440,d=.08,type='square',v=.06){if(!save.sound)return;try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,AC.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(40,f*.5),AC.currentTime+d);g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function whoosh(){if(!save.sound)return;try{if(!AC)return;const n=AC.sampleRate*0.25,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();f.type='bandpass';f.frequency.value=900;g.gain.value=0.12;s.buffer=b;s.connect(f);f.connect(g);g.connect(AC.destination);s.start()}catch(e){}}

// ================= STATE =================
const TR=15;                 // toy radius
const G=950, GDROP=1300;
const HIP=58, LEG=46;        // mascot hip height and leg length
const KICK_A=1.3;            // leg angle at contact
const SWEET_DY=-(HIP-Math.cos(KICK_A)*LEG); // contact height (≈ -45)
const RANGE=58;
let state='menu',toy,mas,items=[],genX,nextBig,parts=[],popups=[],runCoins=0,boosts=0,runTime=0,startX=0,arrivals=[],tourDone=false,trail=[],skipMsgT=0;
let CX=0,CY=0,Z=1,shake=0,timeScale=1,hitstop=0,flash=0,skyCur=null,tNow=0;

function contactX(){return mas.x+8+Math.sin(KICK_A)*LEG}
function reset(){
  startX=TS().journey*PX;
  mas={x:startX-60,from:startX-60-260,phase:'run',pT:0,kick:-1,wind:0,lean:0,arm:0,blink:0,celebrate:0};
  toy={x:0,y:0,vx:0,vy:0,ang:0,av:0,sq:0,sqv:0,held:true,onGround:false,att:null,attT:0,kicked:false};
  items=[];genX=startX+450;nextBig=startX+rng(900,1600);parts=[];popups=[];runCoins=0;runTime=0;arrivals=[];tourDone=false;trail=[];
  boosts=1+save.lv.boost;timeScale=1;hitstop=0;
  CX=mas.from+120;CY=-(H*0.23)/1.15;Z=1.15;
  state='drop';
}
function pickW(list){let s=0;for(const l of list)s+=l[1];let r=Math.random()*s;for(const l of list){r-=l[1];if(r<=0)return l[0]}return list[0][0]}
function addFlyer(kind,x){const k=FLY[kind],by=-rng(k.h[0],k.h[1]);items.push({t:'fly',kind,x,y:by,by,ph:Math.random()*6,st:'free',vy:0,flap:0})}
function genItems(upto){
  while(genX<upto){
    genX+=rng(200,440);
    const th=themeAt(genX/PX),r=Math.random();
    if(r<.24) items.push({t:'bounce',x:genX,skin:th.bouncer,fire:0,fv:0});
    else if(r<.34&&th.slow) items.push({t:'slow',x:genX,w:rng(70,130),skin:th.slow,hit:false});
    else if(r<.52){const h=rng(90,320),n=4+(Math.random()*4|0);for(let i=0;i<n;i++)items.push({t:'coin',x:genX+i*34,y:-h-Math.sin(i/(n-1)*Math.PI)*40,got:false,gt:0});genX+=n*34}
    else if(r<.67) items.push({t:'pop',x:genX,y:-rng(110,380),col:th.pops[Math.random()*th.pops.length|0],alive:true,ph:Math.random()*6,pt:0});
    else addFlyer(pickW(th.flyers),genX);
    if(genX>nextBig){addFlyer(th.big,genX+rng(0,200));nextBig=genX+rng(1100,2100)}
  }
}
function popup(txt,col='#fff',size=32){popups.push({txt,col,size,t:0})}
function burst(x,y,col,n=10,sp=220,sz=4){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=rng(sp*.3,sp);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-100,life:rng(.4,.8),t:0,col,sz:rng(sz*.6,sz*1.3),g:600})}}
function dust(x,y,col,n=8){for(let i=0;i<n;i++)parts.push({x:x+rng(-10,10),y,vx:rng(-120,120),vy:rng(-80,-20),life:rng(.4,.7),t:0,col,sz:rng(5,10),g:-30,soft:1})}
function confetti(){for(let i=0;i<70;i++)parts.push({x:toy.x+rng(-W*.5,W*.5),y:toy.y-rng(250,500),vx:rng(-80,80),vy:rng(-60,60),life:rng(1.2,2),t:0,col:['#ff3b3b','#ffc21a','#2f80ff','#2ec27e','#ff5fb8'][i%5],sz:rng(4,7),g:220,spin:rng(-10,10)})}
function kickSq(v){toy.sqv+=v}

// ================= INPUT =================
function tap(){
  if(state==='drop'){
    if(mas.kick>=0||toy.held)return;
    mas.kick=0;whoosh();
    const d=Math.hypot(toy.x-contactX(),toy.y-SWEET_DY);
    const q=Math.max(0,1-d/RANGE);
    if(q<=0){popup(t('miss'),'#ffe1e1');beep(160,.15,'sawtooth');return}
    launch(q);
  } else if(state==='flight'){
    if(toy.att){release(true);return}
    if(boosts>0){boosts--;toy.vy=Math.min(toy.vy,-560);toy.vx+=140;toy.onGround=false;burst(toy.x,toy.y,'#fff',12,180);kickSq(-6);beep(660,.1,'triangle',.07);popup(t('jump'),'#fff',24)}
  }
}
function launch(q){
  const ang=clamp(42+(SWEET_DY-toy.y)*0.3,22,65)*Math.PI/180;
  const sup=save.superNext?1.5:1;if(save.superNext){save.superNext=false;store()}
  const v=(520+1050*Math.pow(q,1.3))*(1+0.12*save.lv.power)*sup;vib(q>.85?40:q>.55?20:10);
  toy.vx=v*Math.cos(ang);toy.vy=-v*Math.sin(ang);toy.kicked=true;state='flight';
  kickSq(14);
  if(q>.85){popup(t('perfect'),'#ffd23f',42);shake=16;hitstop=0.09;flash=1;timeScale=0.3;beep(880,.18,'square',.08);mas.celebrate=1}
  else if(q>.55){popup(t('good'),'#fff',30);shake=8;hitstop=0.05;timeScale=0.5;beep(620,.12)}
  else{popup(t('weak'),'#ffe1e1',26);beep(300,.12)}
  burst(toy.x,toy.y,'#ffd23f',18,320,5);burst(toy.x,toy.y,'#fff',8,200,3);
}
function release(jump){
  const it=toy.att;if(!it)return;const k=FLY[it.kind];
  toy.att=null;toy.vx=k.carry*0.95;toy.vy=jump?-480:-60;
  it.st='gone';it.vy=-160;
  if(jump){burst(toy.x,toy.y,'#fff',10,160);kickSq(-5);beep(700,.08,'triangle',.06)}
  else popup(t('letgo'),'#fff',22);
}
cv.addEventListener('pointerdown',e=>{e.preventDefault();tap()});
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();tap()}});

// ================= UPDATE =================
function arrive(i){
  const ts=TS(),c=T().cities[i];ts.leg=i;ts.stamps[i]=ts.round;
  const bonus=30+15*i;save.coins+=bonus;arrivals.push({i,bonus});
  popup(upper(cname(c))+'!','#ffd23f',46);vib(80);
  confetti();shake=10;flash=.6;beep(523,.15,'square',.07);setTimeout(()=>beep(784,.2,'square',.07),140);
  if(i===T().cities.length-1)tourDone=true;
  store();
}
function updateMascot(dt){
  const m=mas;m.blink-=dt;if(m.blink<-0.12)m.blink=rng(2,4);
  if(m.phase==='run'){
    m.pT+=dt;const k=Math.min(1,m.pT/0.8);
    m.cx=lerp(m.from,m.x,easeOut(k));
    toy.x=m.cx+30;toy.y=-110+Math.abs(Math.sin(m.pT*14))*-6;
    if(k>=1){m.phase='toss';m.pT=0}
  } else {m.cx=m.x}
  if(m.phase==='toss'){
    m.pT+=dt;const k=Math.min(1,m.pT/0.28);m.arm=easeOut(k);
    toy.x=m.cx+26-k*4;toy.y=-110-k*40;
    if(k>=1){
      m.phase='wait';toy.held=false;
      const vy0=-760,y0=toy.y,yt=SWEET_DY,a=GDROP/2;
      const tt=(-vy0+Math.sqrt(vy0*vy0+4*a*(yt-y0)))/(2*a);
      toy.vy=vy0;toy.vx=(contactX()-toy.x)/tt;toy.av=rng(-4,4);
      beep(420,.06,'sine',.05);
    }
  }
  if(m.phase==='wait')m.arm=Math.max(0,m.arm-dt*3);
  // kick animation: 0..1 over .45s
  if(m.kick>=0){m.kick+=dt/0.45;if(m.kick>1)m.kick=-2}
  // anticipation: wind the leg back as the toy falls toward the foot
  if(state==='drop'&&!toy.held&&m.kick<0&&toy.vy>0)m.wind=lerp(m.wind,1,Math.min(1,dt*6));else if(m.kick<0)m.wind=lerp(m.wind,0,Math.min(1,dt*4));
  m.celebrate=Math.max(0,m.celebrate-dt*0.6);
}
function legAngle(){
  const m=mas;
  if(m.kick>=0){const k=m.kick;
    if(k<0.22)return lerp(-0.7*m.wind,KICK_A+0.25,easeOut(k/0.22));
    if(k<0.5)return KICK_A+0.25;
    return lerp(KICK_A+0.25,0.05,easeOut((k-0.5)/0.5));}
  return 0.05-0.7*m.wind;
}
function update(rdt){
  tNow+=rdt;
  if(hitstop>0){hitstop-=rdt;camUpdate(rdt);fx(rdt);hud();return}
  timeScale=lerp(timeScale,targetTS(),Math.min(1,rdt*(timeScale<targetTS()?3:10)));
  const dt=rdt*timeScale;
  if(state==='drop'||state==='flight')updateMascot(dt);
  if(state==='drop'){
    if(!toy.held){
      toy.vy+=GDROP*dt;toy.x+=toy.vx*dt;toy.y+=toy.vy*dt;toy.av*=0.99;toy.ang+=toy.av*dt;
      if(toy.y>=-TR){toy.y=-TR;if(mas.kick<0)popup(t('late'),'#ffe1e1');launch(0.06);dust(toy.x,0,'rgba(200,170,120,.6)')}
    }
  } else if(state==='flight'){
    runTime+=dt;
    const th=themeAt(toy.x/PX);
    if(toy.att){
      const it=toy.att,k=FLY[it.kind];
      it.x+=k.carry*dt;it.y+=k.rise*dt;it.flap=1.6;
      toy.x=it.x;toy.y=it.y+k.hang;toy.vx=k.carry;toy.vy=0;
      toy.attT-=dt;if(toy.attT<=0)release(false);
    } else {
      const bounce=0.42+0.045*save.lv.bounce;
      toy.vy+=G*dt;toy.vx*=Math.pow(0.995,dt*60);
      toy.x+=toy.vx*dt;toy.y+=toy.vy*dt;
      if(toy.y>=-TR){
        toy.y=-TR;
        if(th.ground==='water'){
          if(toy.vy>60){
            if(toy.vx>360&&toy.vx>2.2*toy.vy){toy.vy=-(toy.vy*0.6+120+40*save.lv.bounce);toy.vx*=0.9;if(tNow-skipMsgT>.6){popup(t('skip'),'#e3f6ff',24);skipMsgT=tNow}}
            else{toy.vy=-toy.vy*bounce*0.7;toy.vx*=0.8}
            kickSq(9);burst(toy.x,0,'#e3f6ff',12,170,4);beep(300,.06,'sine',.06);
          } else {toy.vy=0;toy.onGround=true;toy.vx-=Math.min(toy.vx,(toy.vx*2.2+70)*dt)}
        } else if(toy.vy>90){
          const imp=Math.min(14,toy.vy/60);toy.vy=-toy.vy*bounce;toy.vx*=0.86;kickSq(imp);toy.av=toy.vx/30;
          dust(toy.x,0,th.ground==='snow'?'rgba(255,255,255,.9)':'rgba(190,160,120,.65)',8);beep(220,.06,'triangle',.05);
        } else {toy.vy=0;toy.onGround=true;const f=th.ground==='sand'?2.3:th.ground==='snow'?1.0:1.6;toy.vx-=Math.min(toy.vx,toy.vx*f*dt+40*dt)}
      } else toy.onGround=false;
    }
    genItems(toy.x+W*2.5);
    for(const it of items){
      if(it.t==='bounce'){
        if(!toy.att&&toy.y>-TR-16&&Math.abs(toy.x-it.x)<40&&toy.vy>=-50){
          const ramp=it.skin==='ramp';
          toy.vy=-(ramp?560:700)-Math.abs(toy.vx)*0.18;toy.vx=toy.vx*(ramp?1.25:1.06)+(ramp?140:60);toy.y=-TR-17;
          it.fv+=ramp?10:22;shake=6;kickSq(12);burst(it.x,-10,'#ffd23f',14,260);beep(520,.14,'square',.07);
          popup(it.skin==='ferry'?t('honk'):it.skin==='ramp'?t('ramp'):'Boing!','#ffd23f',26);vib(15);
        }
      } else if(it.t==='slow'){
        if(!it.hit&&!toy.att&&toy.y>-TR-6&&toy.x>it.x&&toy.x<it.x+it.w){it.hit=true;toy.vx*=0.45;toy.vy*=0.3;kickSq(8);dust(toy.x,0,it.skin==='snow'?'#fff':'rgba(120,90,60,.8)',14);beep(120,.15,'sawtooth',.05);popup(t(it.skin),'#f0e2cc',24)}
      } else if(it.t==='coin'){
        if(!it.got&&Math.hypot(toy.x-it.x,toy.y-it.y)<TR+14){it.got=true;runCoins++;burst(it.x,it.y,'#ffd23f',6,120,3);beep(1200,.05,'square',.04)}
      } else if(it.t==='pop'){
        if(it.alive&&!toy.att&&Math.hypot(toy.x-it.x,toy.y-it.y)<TR+19){it.alive=false;toy.vy=Math.min(toy.vy,-640);toy.vx+=60;runCoins+=2;kickSq(-8);burst(it.x,it.y,it.col,18,260,5);beep(900,.07,'square',.07);popup(t('pop'),'#fff',26)}
      } else if(it.t==='fly'){
        const k=FLY[it.kind];
        if(it.st==='free'){it.x+=k.free*dt;it.y=it.by+Math.sin(tNow*2.5+it.ph)*14;
          if(!toy.att&&Math.hypot(toy.x-it.x,(toy.y-k.hang*0.4)-it.y)<TR+k.r+4){
            it.st='carry';toy.att=it;toy.attT=k.time*(1+0.25*save.lv.spike);toy.onGround=false;kickSq(-7);
            popup(t('f_'+it.kind),'#fff',24);vib(20);burst(toy.x,toy.y,'#fff',10,150);beep(440,.1,'triangle',.07);beep(660,.12,'triangle',.05);
          }
        } else if(it.st==='gone'){it.x+=k.carry*0.8*dt;it.vy-=200*dt;it.y+=it.vy*dt}
      }
    }
    items=items.filter(it=>it.x>toy.x-W*2&&it.y>-3000);
    const ts=TS(),cs=T().cities;
    if(ts.leg<cs.length-1&&toy.x/PX>=cs[ts.leg+1].at)arrive(ts.leg+1);
    if(!toy.att&&toy.onGround&&toy.vx<18){toy.vx=0;finish()}
    if(runTime>120)finish();
  }
  // toy orientation: base leads in flight (shuttlecock), sits upright when resting
  if(state==='flight'||(state==='drop'&&!toy.held)){
    let target;
    if(toy.att)target=Math.sin(tNow*9)*0.25;
    else if(toy.onGround)target=Math.sin(tNow*6)*0.08*Math.min(1,toy.vx/200);
    else if(state==='flight')target=Math.atan2(toy.vy,toy.vx)-Math.PI/2;
    if(target!==undefined){let d=target-toy.ang;d=Math.atan2(Math.sin(d),Math.cos(d));toy.av+=(d*40-toy.av*8)*dt}
    toy.ang+=toy.av*dt;
  }
  // squash spring
  toy.sqv+=(-320*toy.sq-14*toy.sqv)*dt;toy.sq+=toy.sqv*dt;toy.sq=clamp(toy.sq,-0.4,0.4);
  for(const it of items)if(it.t==='bounce'){it.fv+=(-300*it.fire-12*it.fv)*dt;it.fire+=it.fv*dt}
  if(state==='flight'&&Math.hypot(toy.vx,toy.vy)>520&&!toy.att)trail.push({x:toy.x,y:toy.y,a:1});
  for(const p of trail)p.a-=dt*2.6;trail=trail.filter(p=>p.a>0);if(trail.length>40)trail.shift();
  camUpdate(rdt);fx(rdt);hud();
}
function targetTS(){
  if(state==='drop'&&!toy.held&&mas.kick<0&&toy.vy>0&&Math.abs(toy.y-SWEET_DY)<130)return 0.38;
  return 1;
}
function fx(dt){
  shake=Math.max(0,shake-dt*40);flash=Math.max(0,flash-dt*3);
  for(const p of parts){p.t+=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=0.99}parts=parts.filter(p=>p.t<p.life);
  for(const p of popups)p.t+=dt;popups=popups.filter(p=>p.t<1.2);
  for(const it of items)if(it.t==='coin'&&it.got)it.gt+=dt;
}
function camUpdate(dt){
  let tx,ty,tz;
  if(state==='drop'||state==='menu'){tz=1.15;tx=(mas?mas.cx||mas.x:0)+70;ty=-(H*0.23)/tz}
  else{
    const alt=Math.max(0,-toy.y),spd=Math.hypot(toy.vx,toy.vy);
    tz=clamp(1.05-alt/2200-spd/5200,0.62,1.05);
    tx=toy.x+clamp(toy.vx*0.12,-60,180);
    ty=Math.min(toy.y+30,-(H*0.23)/tz);
  }
  Z+=(tz-Z)*Math.min(1,dt*2.2);
  CX+=(tx-CX)*Math.min(1,dt*7);
  CY+=(ty-CY)*Math.min(1,dt*6);
}
let routeShown=false;
function hud(){
  const m=Math.max(0,Math.floor(((toy&&toy.kicked?toy.x:startX)-startX)/PX));
  $('dist').textContent=fmt(m)+' m';$('best').textContent=t('best')+': '+fmt(save.best)+' m';
  $('coinHud').innerHTML='<i class="coin"></i>'+fmt(save.coins+runCoins);
  $('boostHud').textContent=state==='flight'?(toy.att?t('release'):t('boosts')+': '+'▲'.repeat(boosts)+'△'.repeat(Math.max(0,1+save.lv.boost-boosts))):'';
  const ts=TS(),cs=T().cities,show=state==='drop'||state==='flight';
  if(show!==routeShown){$('route').style.opacity=show?1:0;routeShown=show}
  if(show){
    const nx=Math.min(ts.leg+1,cs.length-1),a=cs[nx-1],b=cs[nx];
    const cm=Math.max(toy.x/PX,a.at);const left=Math.max(0,(b.at-cm)*T().km);
    $('routeTxt').textContent=(ts.leg>=cs.length-1?t('done'):cname(a)+(save.lang==='ar'?' ← ':' → ')+cname(b)+' · '+fmt(left)+' km');
    $('routeBar').style.width=Math.min(100,(cm-a.at)/(b.at-a.at)*100)+'%';
  }
}

// ================= DRAW: CHARACTERS =================
// Flix toy (from Kick Up): domed base + fan of colourful plumes. Local "down" (+y) is the base.
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
// Flix mascot: red body, flame crest, angry brows + big grin, black rubber-hose limbs, white gloves, silver pads, red shoes.
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

// ================= DRAW: WORLD =================
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
const rgb=a=>`rgb(${a.map(v=>v|0).join(',')})`;
function hills(par,col,amp,base,freq,gyS){
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W+20;x+=16){const wx=x/Z+CX*par;ctx.lineTo(x,gyS-(base+Math.sin(wx*freq)*amp+Math.sin(wx*freq*2.3+1)*amp*0.4)*Z*(0.6+par*0.6))}
  ctx.lineTo(W,H);ctx.fill();
}
// ---- landmarks (simple original silhouettes) ----
function lm(kind,x,gy){
  ctx.save();ctx.translate(x,gy);
  const D='rgba(45,55,80,.75)';ctx.fillStyle=D;ctx.strokeStyle=D;
  const minaret=(mx,h)=>{ctx.fillRect(mx-5,-h,10,h);ctx.beginPath();ctx.moveTo(mx-6,-h);ctx.lineTo(mx,-h-34);ctx.lineTo(mx+6,-h);ctx.fill();ctx.fillRect(mx-8,-h*0.7,16,5)};
  if(kind==='istanbul'){
    ctx.fillRect(-90,-70,180,70);ctx.beginPath();ctx.arc(0,-70,62,Math.PI,0);ctx.fill();
    ctx.beginPath();ctx.arc(-70,-70,24,Math.PI,0);ctx.arc(70,-70,24,Math.PI,0);ctx.fill();ctx.fillRect(-2,-150,4,22);
    minaret(-118,190);minaret(118,190);
    // tower
    ctx.fillRect(180,-150,34,150);ctx.beginPath();ctx.moveTo(174,-150);ctx.lineTo(197,-205);ctx.lineTo(220,-150);ctx.fill();
  } else if(kind==='bursa'){
    ctx.fillStyle='rgba(120,140,160,.7)';ctx.beginPath();ctx.moveTo(-260,0);ctx.lineTo(-40,-260);ctx.lineTo(40,-230);ctx.lineTo(260,0);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-95,-195);ctx.lineTo(-40,-260);ctx.lineTo(40,-230);ctx.lineTo(80,-185);ctx.lineTo(20,-200);ctx.lineTo(-30,-180);ctx.fill();
    ctx.fillStyle='#2a9d8f';ctx.fillRect(-60,-50,120,50);ctx.beginPath();ctx.arc(0,-50,45,Math.PI,0);ctx.fill();
  } else if(kind==='izmir'){
    ctx.fillRect(-22,-110,44,110);ctx.fillRect(-30,-118,60,10);ctx.fillRect(-16,-170,32,52);
    ctx.beginPath();ctx.arc(0,-170,16,Math.PI,0);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-143,9,0,7);ctx.fill();
    ctx.fillStyle=D;ctx.fillRect(-60,-30,6,30);ctx.fillRect(54,-30,6,30);
  } else if(kind==='antalya'){
    ctx.fillStyle='rgba(150,120,90,.75)';ctx.beginPath();ctx.moveTo(-220,0);ctx.lineTo(-200,-90);ctx.lineTo(-120,-110);ctx.lineTo(-90,0);ctx.fill();
    ctx.fillStyle=D;for(let i=0;i<5;i++)ctx.fillRect(-14+i*6,-210,4,190);ctx.fillRect(-20,-30,40,30);ctx.fillRect(-18,-214,36,8);
    ctx.beginPath();ctx.moveTo(-14,-214);ctx.lineTo(0,-250);ctx.lineTo(14,-214);ctx.fill();
  } else if(kind==='kapadokya'){
    const ch=(cx,h,w)=>{ctx.fillStyle='rgba(205,160,120,.9)';ctx.beginPath();ctx.moveTo(cx-w,0);ctx.quadraticCurveTo(cx-w*0.3,-h*0.6,cx-w*0.3,-h);ctx.lineTo(cx+w*0.3,-h);ctx.quadraticCurveTo(cx+w*0.3,-h*0.6,cx+w,0);ctx.fill();ctx.fillStyle='rgba(110,80,60,.9)';ctx.beginPath();ctx.ellipse(cx,-h,w*0.55,w*0.25,0,0,7);ctx.fill()};
    ch(-120,140,40);ch(-40,200,46);ch(50,160,40);ch(130,120,34);
  } else if(kind==='ankara'){
    ctx.fillRect(-8,-220,16,220);ctx.beginPath();ctx.ellipse(0,-225,40,14,0,0,7);ctx.fill();ctx.fillRect(-26,-250,52,22);ctx.fillRect(-3,-290,6,40);
    ctx.fillRect(-200,-60,140,60);for(let i=0;i<7;i++)ctx.fillRect(-200+i*20,-72,12,12);
  } else if(kind==='paris'){
    ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-80,0);ctx.quadraticCurveTo(-20,-100,-6,-280);ctx.lineTo(6,-280);ctx.quadraticCurveTo(20,-100,80,0);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,40,Math.PI,0);ctx.stroke();ctx.fillRect(-46,-80,92,8);ctx.fillRect(-24,-170,48,7);ctx.fillRect(-2,-320,4,40);
    for(let i=1;i<8;i++){const y=-i*35;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-70+i*8.5,y+10);ctx.lineTo(70-i*8.5,y-10);ctx.stroke()}
  } else if(kind==='newyork'){
    const b=[[-220,140],[-180,200],[-140,120],[-100,260],[-60,180],[-20,320],[20,230],[60,170],[100,280],[140,150],[180,210]];
    for(const [bx,h] of b){ctx.fillStyle=D;ctx.fillRect(bx,-h,36,h);ctx.fillStyle='rgba(255,230,150,.6)';for(let y=-h+12;y<-10;y+=18)for(let wx=bx+6;wx<bx+32;wx+=10)if(hsh(bx*y)>.45)ctx.fillRect(wx,y,5,8)}
    ctx.fillStyle=D;ctx.fillRect(-4,-360,8,40);
  } else if(kind==='rio'){
    ctx.fillStyle='rgba(60,100,80,.85)';ctx.beginPath();ctx.moveTo(-260,0);ctx.bezierCurveTo(-240,-260,-140,-260,-120,0);ctx.fill();
    ctx.beginPath();ctx.moveTo(-140,0);ctx.bezierCurveTo(-120,-160,-40,-160,-20,0);ctx.fill();
    ctx.strokeStyle='rgba(40,40,40,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-190,-205);ctx.lineTo(-80,-120);ctx.stroke();
  } else if(kind==='kahire'){
    ctx.fillStyle='rgba(190,140,80,.9)';
    for(const [px,s] of [[-140,170],[30,220],[170,120]]){ctx.beginPath();ctx.moveTo(px-s,0);ctx.lineTo(px,-s);ctx.lineTo(px+s,0);ctx.fill()}
    ctx.fillStyle='rgba(255,240,180,.8)';ctx.beginPath();ctx.arc(-260,-260,40,0,7);ctx.fill();
  }
  ctx.restore();
}
// ---- ground decorations ----
function deco(kind,x,gy,s){
  ctx.save();ctx.translate(x,gy);ctx.scale(s,s);
  if(kind==='pine'){ctx.fillStyle='#5b3a1a';ctx.fillRect(-4,-20,8,20);ctx.fillStyle='#2d6a4f';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-26+i*5,-18-i*22);ctx.lineTo(0,-58-i*22);ctx.lineTo(26-i*5,-18-i*22);ctx.fill()}ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-8,-110);ctx.lineTo(0,-124);ctx.lineTo(8,-110);ctx.fill()}
  else if(kind==='olive'){ctx.fillStyle='#6b4f2a';ctx.fillRect(-4,-34,8,34);ctx.fillStyle='#7d9a5b';ctx.beginPath();ctx.arc(-14,-44,18,0,7);ctx.arc(10,-50,20,0,7);ctx.arc(0,-62,16,0,7);ctx.fill()}
  else if(kind==='palm'){ctx.strokeStyle='#8a6a3b';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(10,-50,4,-100);ctx.stroke();ctx.strokeStyle='#2f9e44';ctx.lineWidth=6;for(const a of[-2.6,-2,-1.2,-0.5,0.1]){ctx.beginPath();ctx.moveTo(4,-100);ctx.quadraticCurveTo(4+Math.cos(a)*30,-100+Math.sin(a)*30-10,4+Math.cos(a)*55,-100+Math.sin(a)*40+20);ctx.stroke()}}
  else if(kind==='fairy'){ctx.fillStyle='#d9b38c';ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(-8,-50,-8,-80);ctx.lineTo(8,-80);ctx.quadraticCurveTo(8,-50,22,0);ctx.fill();ctx.fillStyle='#7a5a44';ctx.beginPath();ctx.ellipse(0,-80,16,7,0,0,7);ctx.fill();ctx.fillStyle='#5a3d2b';ctx.fillRect(-4,-40,8,10)}
  else if(kind==='poplar'){ctx.fillStyle='#5b3a1a';ctx.fillRect(-3,-16,6,16);ctx.fillStyle='#6a994e';ctx.beginPath();ctx.ellipse(0,-60,13,48,0,0,7);ctx.fill()}
  else if(kind==='tree'){ctx.fillStyle='#5b3a1a';ctx.fillRect(-4,-28,8,28);ctx.fillStyle='#52a447';ctx.beginPath();ctx.arc(0,-48,26,0,7);ctx.fill()}
  else if(kind==='cactus'){ctx.fillStyle='#4f9d4a';ctx.fillRect(-7,-60,14,60);ctx.fillRect(-22,-40,10,22);ctx.fillRect(-22,-28,18,8);ctx.fillRect(12,-48,10,24);ctx.fillRect(4,-30,18,8)}
  ctx.restore();
}

// ---- items ----
function drawBird(kind,x,y,t,flap){
  const f=Math.sin(t*14+x)*flap;
  const cols={gull:['#ffffff','#9aa5b1'],pigeon:['#8d99ae','#5c677d'],flamingo:['#ff8fab','#f25c8a'],parrot:['#e63946','#2a9d8f'],eagle:['#7f5539','#4a2f1e']}[kind];
  ctx.save();ctx.translate(x,y);
  ctx.strokeStyle=cols[1];ctx.lineWidth=kind==='eagle'?5:4;ctx.lineCap='round';
  const span=kind==='eagle'?30:kind==='flamingo'?24:20;
  ctx.beginPath();ctx.moveTo(-span,-6-f*10);ctx.quadraticCurveTo(-span*0.4,-12-f*12,0,0);ctx.quadraticCurveTo(span*0.4,-12-f*12,span,-6-f*10);ctx.stroke();
  ctx.fillStyle=cols[0];ctx.beginPath();ctx.ellipse(0,0,13,7,0,0,7);ctx.fill();
  if(kind==='flamingo'){ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(10,-2);ctx.quadraticCurveTo(20,-18,26,-8);ctx.stroke();ctx.strokeStyle='#d6336c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-4,6);ctx.lineTo(-16,22);ctx.moveTo(0,6);ctx.lineTo(-12,24);ctx.stroke()}
  else{ctx.fillStyle=kind==='parrot'?'#ffd23f':'#f4a261';ctx.beginPath();ctx.moveTo(12,-2);ctx.lineTo(20,1);ctx.lineTo(12,3);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(8,-2,1.6,0,7);ctx.fill()}
  ctx.restore();
}
function drawFlyer(it,t){
  const x=it.x,y=it.y;
  const k=it.kind;
  if(FLY[k].hang<=30&&k!=='plane'){drawBird(k,x,y,t,it.st==='free'?1:1.6);return}
  ctx.save();ctx.translate(x,y);
  if(k==='cable'){ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-400,140);ctx.lineTo(400,-140);ctx.stroke();ctx.fillStyle='#e63946';ctx.fillRect(-18,8,36,30);ctx.fillStyle='#bde0fe';ctx.fillRect(-13,13,11,12);ctx.fillRect(2,13,11,12);ctx.strokeStyle='#333';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,8);ctx.stroke();ctx.fillStyle='#333';ctx.beginPath();ctx.arc(0,0,4,0,7);ctx.fill()}
  else if(k==='parasail'){const cols=['#ff006e','#ffbe0b','#3a86ff'];for(let i=0;i<3;i++){ctx.fillStyle=cols[i];ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,34,Math.PI+i*Math.PI/3,Math.PI+(i+1)*Math.PI/3);ctx.fill()}ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-32,0);ctx.lineTo(0,40);ctx.lineTo(32,0);ctx.moveTo(0,-34);ctx.lineTo(0,40);ctx.stroke()}
  else if(k==='hotair'){const cols=['#e63946','#ffd23f','#2a9d8f','#ff8c42'];const c=cols[(it.ph*10|0)%4];ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,0,40,Math.PI*0.85,Math.PI*2.15);ctx.lineTo(12,48);ctx.lineTo(-12,48);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(0,4,14,40,0,0,7);ctx.fill();ctx.strokeStyle='#5b3a1a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-11,48);ctx.lineTo(-9,60);ctx.moveTo(11,48);ctx.lineTo(9,60);ctx.stroke();ctx.fillStyle='#8a5a2b';ctx.fillRect(-10,60,20,14)}
  else if(k==='plane'){ctx.fillStyle='#f8f9fa';ctx.beginPath();ctx.ellipse(0,0,46,9,0,0,7);ctx.fill();ctx.fillStyle='#d62828';ctx.beginPath();ctx.moveTo(-38,-2);ctx.lineTo(-50,-24);ctx.lineTo(-30,-4);ctx.fill();ctx.fillStyle='#adb5bd';ctx.beginPath();ctx.moveTo(-6,2);ctx.lineTo(-22,24);ctx.lineTo(4,4);ctx.fill();ctx.fillStyle='#4dabf7';for(let i=0;i<6;i++)ctx.fillRect(-20+i*9,-4,4,4);ctx.fillStyle='#d62828';ctx.fillRect(-40,1,80,2)}
  ctx.restore();
}
function drawBouncer(it,x,gy){
  const f=it.fire;
  if(it.skin==='spring'){const h=14+f*18;ctx.fillStyle='#555';ctx.fillRect(x-22,gy-6,44,6);ctx.strokeStyle='#888';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<4;i++){ctx.moveTo(x-16,gy-6-i*h/4);ctx.lineTo(x+16,gy-6-(i+.5)*h/4)}ctx.stroke();ctx.fillStyle='#ffd23f';ctx.fillRect(x-28,gy-10-h,56,8)}
  else if(it.skin==='ferry'){const b=f*6;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(x-50,gy-14+b);ctx.lineTo(x+50,gy-14+b);ctx.lineTo(x+40,gy+4);ctx.lineTo(x-40,gy+4);ctx.fill();ctx.fillStyle='#d62828';ctx.fillRect(x-48,gy-10+b,96,4);ctx.fillStyle='#f1f3f5';ctx.fillRect(x-26,gy-32+b,52,18);ctx.fillStyle='#4dabf7';for(let i=0;i<4;i++)ctx.fillRect(x-22+i*12,gy-28+b,7,7);ctx.fillStyle='#333';ctx.fillRect(x+10,gy-44+b,8,12)}
  else if(it.skin==='umbrella'||it.skin==='cafe'){const h=46-f*10;ctx.strokeStyle='#666';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy-h);ctx.stroke();const cs=it.skin==='cafe'?['#c1121f','#fff']:['#ff006e','#ffbe0b'];for(let i=0;i<6;i++){ctx.fillStyle=cs[i%2];ctx.beginPath();ctx.moveTo(x,gy-h);ctx.arc(x,gy-h+16,40,Math.PI+i*Math.PI/6,Math.PI+(i+1)*Math.PI/6);ctx.fill()}}
  else if(it.skin==='ramp'){ctx.fillStyle='#e9f2f7';ctx.beginPath();ctx.moveTo(x-50,gy);ctx.quadraticCurveTo(x+10,gy-6,x+36,gy-34-f*6);ctx.lineTo(x+40,gy);ctx.fill();ctx.strokeStyle='#4dabf7';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-50,gy);ctx.quadraticCurveTo(x+10,gy-6,x+36,gy-34-f*6);ctx.stroke()}
}


function gate(c,x){
  ctx.fillStyle='#5b3a1a';ctx.fillRect(x-70,-130,8,130);ctx.fillRect(x+62,-130,8,130);
  ctx.fillStyle=c.col;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-82,-152,164,42,10):ctx.rect(x-82,-152,164,42);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='900 20px system-ui';ctx.textAlign='center';ctx.fillText(upper(cname(c)),x,-124);
  const f=Math.sin(tNow*3)*3;ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.moveTo(x-62,-150);ctx.lineTo(x-62,-176+f);ctx.lineTo(x-40,-165+f);ctx.lineTo(x-62,-158);ctx.fill();
}
const GROUND={grass:['#5aa84a','#b98d57'],sand:['#f2d49b','#e6c07d'],snow:['#ffffff','#dbe9f2'],water:['#3d8fd6','#2a6fb0'],tuff:['#e7c9a5','#d4ad84'],steppe:['#c9b46b','#b59a5a']};

function draw(){
  const t=tNow;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const sxx=shake>0?rng(-shake,shake)*.5:0,syy=shake>0?rng(-shake,shake)*.5:0;
  ctx.translate(sxx,syy);
  const thC=themeAt(CX/PX);
  const target=[hex(thC.sky[0]),hex(thC.sky[1]),hex(thC.hills[0]),hex(thC.hills[1])];
  if(!skyCur)skyCur=target.map(a=>a.slice());
  for(let i=0;i<4;i++)skyCur[i]=mix(skyCur[i],target[i],0.04);
  const sk=ctx.createLinearGradient(0,0,0,H);sk.addColorStop(0,rgb(skyCur[0]));sk.addColorStop(1,rgb(skyCur[1]));
  ctx.fillStyle=sk;ctx.fillRect(-20,-20,W+40,H+40);
  const gyS=H*0.62+(0-CY)*Z;
  // sun glow
  const sg=ctx.createRadialGradient(W*0.8,H*0.15,10,W*0.8,H*0.15,H*0.4);sg.addColorStop(0,'rgba(255,250,220,.55)');sg.addColorStop(1,'rgba(255,250,220,0)');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
  // clouds (screen-space parallax)
  ctx.fillStyle='rgba(255,255,255,.82)';
  for(let i=0;i<9;i++){const span=W+500,cx=((i*430-CX*0.12*Z+t*(8+i*2))%span+span)%span-250,cy=50+((i*97)%190)+(gyS-H*0.85)*0.15,s=0.7+hsh(i)*0.6;ctx.beginPath();ctx.arc(cx,cy,26*s,0,7);ctx.arc(cx+28*s,cy-10*s,32*s,0,7);ctx.arc(cx+60*s,cy,24*s,0,7);ctx.arc(cx+30*s,cy+8*s,24*s,0,7);ctx.fill()}
  hills(0.2,rgb(skyCur[2]),40,95,0.004,gyS);
  // ---- world space ----
  ctx.save();ctx.translate(W*0.35,H*0.62);ctx.scale(Z,Z);ctx.translate(-CX,-CY);
  const xL=CX-W*0.35/Z-120,xR=CX+W*0.65/Z+120,yB=CY+H*0.38/Z+40;
  const cs=T().cities;
  for(let i=0;i<cs.length;i++){const lx=cs[i].at*PX,x=lx*0.85+CX*0.15+80;if(x>xL-400&&x<xR+400)lm(cs[i].lm,x,0)}
  ctx.restore();
  hills(0.45,rgb(skyCur[3]),24,34,0.007,gyS);
  ctx.save();ctx.translate(W*0.35,H*0.62);ctx.scale(Z,Z);ctx.translate(-CX,-CY);
  // ground strips
  for(let x=Math.floor(xL/40)*40;x<xR;x+=40){const th=themeAt(x/PX),g=GROUND[th.ground];ctx.fillStyle=g[0];ctx.fillRect(x,0,41,12);ctx.fillStyle=g[1];ctx.fillRect(x,12,41,Math.max(40,yB))}
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;
  for(let x=Math.floor(xL/40)*40;x<xR;x+=40){if(themeAt(x/PX).ground!=='water')continue;const o=Math.sin(t*3+x*0.05)*2;ctx.beginPath();ctx.moveTo(x,4);ctx.quadraticCurveTo(x+10,-2+o,x+20,4);ctx.quadraticCurveTo(x+30,10-o,x+40,4);ctx.stroke()}
  for(let k=Math.floor((xL-200)/260);k<(xR+200)/260;k++){const wx=k*260+hsh(k)*160,th=themeAt(wx/PX);if(th.deco==='none'||hsh(k+7)<.35)continue;deco(th.deco,wx,2,0.8+hsh(k+3)*0.5,t)}
  ctx.font='bold 12px system-ui';ctx.textAlign='center';
  const step=50*PX;
  for(let m=Math.floor(xL/step)*step;m<xR;m+=step){if(m<=startX)continue;ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(m-1,-20,3,20);ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillText(Math.round((m-startX)/PX)+'m',m,28)}
  for(let i=1;i<cs.length;i++){const x=cs[i].at*PX;if(x>xL-120&&x<xR+120)gate(cs[i],x)}
  // mascot
  if(mas){const mx=mas.cx||mas.x;if(mx>xL-100&&mx<xR+100){
    const la=legAngle();
    const look=state==='drop'?{x:clamp((toy.x-mx)/80,-1,1),y:clamp((toy.y+100)/80,-1,1)}:{x:1,y:-0.6};
    if(themeAt(mx/PX).ground==='water'){const bo=Math.sin(t*2)*2;ctx.fillStyle='#a0703c';ctx.fillRect(mx-60,-4+bo,140,12);ctx.strokeStyle='#6b4423';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.strokeRect(mx-60+i*20,-4+bo,20,12)}ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(mx-64,6+bo,148,3)}
    const res=drawMascot(ctx,mx,t,{leg:la,running:mas.phase==='run',wind:mas.wind,kickPose:mas.kick>=0?Math.sin(Math.min(1,mas.kick)*Math.PI):0,toss:mas.phase==='toss'?mas.arm:(mas.phase==='run'?1:0),cheer:mas.celebrate,blink:mas.blink,look});
    if(toy.held){toy.x=res.hand.x+2;toy.y=res.hand.y-10;}
  }}
  // sweet zone ring
  if(state==='drop'&&!toy.held&&mas.kick<0){const cx=contactX(),pul=1+Math.sin(t*10)*0.06;const near=clamp(1-Math.abs(toy.y-SWEET_DY)/160,0,1);
    ctx.lineWidth=4;ctx.strokeStyle=`rgba(46,194,126,${0.45+near*0.5})`;ctx.beginPath();ctx.arc(cx,SWEET_DY,RANGE*0.55*pul,0,7);ctx.stroke();
    ctx.fillStyle=`rgba(46,194,126,${0.12+near*0.2})`;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,SWEET_DY,RANGE*0.18,0,7);ctx.stroke()}
  // items
  for(const it of items){
    if(it.x<xL-160||it.x>xR+160)continue;
    if(it.t==='bounce')drawBouncer(it,it.x,0);
    else if(it.t==='slow'){const c={mud:['#6b4423','#86572e'],sand:['#d9b26f','#e8c98d'],snow:['#ffffff','#e3eef5']}[it.skin];const x=it.x;ctx.fillStyle=c[0];ctx.beginPath();ctx.ellipse(x+it.w/2,1,it.w/2,it.skin==='mud'?9:14,0,Math.PI,0);ctx.fill();if(it.skin==='mud'){ctx.beginPath();ctx.ellipse(x+it.w/2,2,it.w/2,8,0,0,7);ctx.fill()}ctx.fillStyle=c[1];ctx.beginPath();ctx.ellipse(x+it.w/2-8,-2,it.w/4,4,0,0,7);ctx.fill()}
    else if(it.t==='coin'){if(it.got&&it.gt>0.35)continue;const k=it.got?it.gt/0.35:0,y=it.y-k*40,s=Math.abs(Math.sin(t*4+it.x*0.01)),sc=1+k*0.6;ctx.globalAlpha=1-k;ctx.fillStyle='#ffc93c';ctx.strokeStyle='#b8860b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(it.x,y,(9*s+2)*sc,10*sc,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(it.x-2*s,y-3,2*s,3,0,0,7);ctx.fill();ctx.globalAlpha=1}
    else if(it.t==='pop'&&it.alive){const y=it.y+Math.sin(t*2+it.ph)*5;ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(it.x,y+20);ctx.quadraticCurveTo(it.x+6,y+34,it.x,y+46);ctx.stroke();const bg=ctx.createRadialGradient(it.x-5,y-7,2,it.x,y,20);bg.addColorStop(0,'#fff');bg.addColorStop(0.25,it.col);bg.addColorStop(1,it.col);ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(it.x,y,15,19,0,0,7);ctx.fill();ctx.fillStyle=it.col;ctx.beginPath();ctx.moveTo(it.x-3,y+19);ctx.lineTo(it.x+3,y+19);ctx.lineTo(it.x,y+23);ctx.fill()}
    else if(it.t==='fly')drawFlyer(it,t);
  }
  // plume-coloured speed trail
  if(trail.length>2){const TOY=toySkin();for(let ci=0;ci<TOY.f.length;ci++){ctx.strokeStyle=TOY.f[ci];ctx.lineCap='round';for(let i=1;i<trail.length;i++){const p=trail[i-1],q=trail[i];ctx.globalAlpha=q.a*0.5;ctx.lineWidth=3*q.a;const off=(ci-2)*3;ctx.beginPath();ctx.moveTo(p.x,p.y+off);ctx.lineTo(q.x,q.y+off);ctx.stroke()}}ctx.globalAlpha=1}
  // toy shadow + toy
  if(toy){
    const sh=Math.max(.15,1-(-toy.y)/600);ctx.fillStyle=`rgba(0,0,0,${.2*sh})`;ctx.beginPath();ctx.ellipse(toy.x,2,TR*sh*1.1,4*sh,0,0,7);ctx.fill();
    if(toy.att){const k=FLY[toy.att.kind];const f=Math.max(0,toy.attT/(k.time*(1+0.25*save.lv.spike)));ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(toy.x-24,toy.y+TR+12,48,6);ctx.fillStyle='#ffd23f';ctx.fillRect(toy.x-24,toy.y+TR+12,48*f,6)}
    drawToy(ctx,toy.x,toy.y,toy.ang,TR*Math.pow(1/Z,0.6),toy.sq,Math.hypot(toy.vx,toy.vy)/600);
    if(toy.att&&FLY[toy.att.kind].hang<=30){ // claws gripping the plumes
      ctx.strokeStyle='#f4a261';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(toy.att.x-3,toy.att.y+5);ctx.lineTo(toy.x-3,toy.y-TR*0.9);ctx.moveTo(toy.att.x+4,toy.att.y+5);ctx.lineTo(toy.x+3,toy.y-TR*0.9);ctx.stroke()}
  }
  for(const p of parts){const k=p.t/p.life;ctx.globalAlpha=Math.max(0,1-k);ctx.fillStyle=p.col;if(p.soft){ctx.beginPath();ctx.arc(p.x,p.y,p.sz*(1+k),0,7);ctx.fill()}else{ctx.save();ctx.translate(p.x,p.y);ctx.rotate((p.spin||0)*p.t);ctx.fillRect(-p.sz/2,-p.sz/2,p.sz,p.sz*(p.spin?0.5:1));ctx.restore()}}ctx.globalAlpha=1;
  ctx.restore();
  // ---- screen space overlays ----
  if(toy&&state==='flight'){const ysc=H*0.62+(toy.y-CY)*Z,xsc=W*0.35+(toy.x-CX)*Z;if(ysc<-10){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.moveTo(xsc,110);ctx.lineTo(xsc-9,126);ctx.lineTo(xsc+9,126);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(Math.round(-toy.y/PX)+'m',xsc,140)}}
  if(state==='flight'&&Math.hypot(toy.vx,toy.vy)>950){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=2;for(let i=0;i<7;i++){const fr=Math.floor(t*10),y=hsh(i+fr)*H,x=hsh(i*3+fr)*W;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-90,y);ctx.stroke()}}
  // vignette during slow motion
  const sm=1-timeScale;if(sm>0.05){const vg=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(10,10,30,${sm*0.45})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(flash>0){ctx.fillStyle=`rgba(255,255,255,${flash*0.45})`;ctx.fillRect(0,0,W,H)}
  ctx.textAlign='center';
  popups.forEach((p,pi)=>{const k=p.t/1.2,inK=Math.min(1,p.t/0.25),sc=easeBack(inK);ctx.globalAlpha=k>0.7?1-(k-0.7)/0.3:1;const y=H*0.3+(popups.length-1-pi)*-46-easeOut(k)*30;ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);ctx.font=`900 ${p.size}px system-ui`;ctx.lineWidth=7;ctx.lineJoin='round';ctx.strokeStyle='rgba(27,19,48,.55)';ctx.strokeText(p.txt,0,0);ctx.fillStyle=p.col;ctx.fillText(p.txt,0,0);ctx.restore()});
  ctx.globalAlpha=1;
  if(state==='drop'&&mas.kick<0){const a=0.75+Math.sin(t*6)*0.25;ctx.globalAlpha=a;ctx.font='800 18px system-ui';ctx.fillStyle='#fff';ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=4;const tx=save.superNext?tr('superOn'):toy.held?tr('ready'):tr('tapRing');ctx.strokeText(tx,W/2,H*0.22);ctx.fillText(tx,W/2,H*0.22);ctx.globalAlpha=1}
}

// ================= LOOP =================
let last=performance.now(),paused=false;
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;
  if(!paused){
    if(state==='drop'||state==='flight')update(dt);else{tNow+=dt;if(mas)updateMascot(dt);fx(dt);camUpdate(dt)}
    draw();drawMenuArt(dt);
  }
  requestAnimationFrame(loop)}
// stop the clock while the app is in the background (phone call, home button): nothing moves on behind the player's back
document.addEventListener('visibilitychange',()=>{paused=document.hidden;last=performance.now();try{if(AC)(paused?AC.suspend():AC.resume())}catch(e){}});
// idle scene behind the menu
startX=TS().journey*PX;
mas={x:startX-60,cx:startX-60,from:startX-60,phase:'idle',pT:0,kick:-1,wind:0,arm:0,blink:2,celebrate:0};
toy={x:startX+30,y:-TR,vx:0,vy:0,ang:0,av:0,sq:0,sqv:0,held:false,onGround:true,att:null,attT:0,kicked:false};
CX=startX+10;CY=-(H*0.23)/1.15;Z=1.15;

// menu art: Flix juggling the toy
const ma=$('menuArt'),mc=ma.getContext('2d');let mt=0,mtoy={y:-150,vy:0,ang:0,sq:0,sqv:0},mkick=-1;
function drawMenuArt(dt){
  if(!$('menuPanel').classList.contains('on'))return;
  mt+=dt;mtoy.vy+=900*dt;mtoy.y+=mtoy.vy*dt;mtoy.ang=Math.sin(mt*3)*0.3;
  if(mtoy.y>-50&&mtoy.vy>0){mtoy.vy=-620;mkick=0;mtoy.sqv+=10}
  mtoy.sqv+=(-320*mtoy.sq-14*mtoy.sqv)*dt;mtoy.sq+=mtoy.sqv*dt;
  if(mkick>=0){mkick+=dt/0.4;if(mkick>1)mkick=-1}
  const la=mkick>=0?(mkick<0.3?lerp(0,1.1,easeOut(mkick/0.3)):lerp(1.1,0.05,easeOut((mkick-0.3)/0.7))):0.05;
  mc.setTransform(2,0,0,2,0,0);mc.clearRect(0,0,220,150);
  mc.save();mc.translate(80,140);mc.scale(0.95,0.95);
  drawMascot(mc,0,mt,{leg:la,running:false,wind:0,kickPose:mkick>=0?Math.sin(mkick*Math.PI)*0.6:0,toss:0,cheer:0.3,blink:Math.sin(mt*0.9)>0.97?-1:1,look:{x:1,y:-0.8}});
  drawToy(mc,52,mtoy.y,mtoy.ang,15,mtoy.sq,0.4);
  mc.restore();
}
// ================= TEXT =================
const t=(k,v)=>{let s=(TX[save.lang]||TX.tr)[k];if(s===undefined)s=TX.en[k]!==undefined?TX.en[k]:k;if(v)for(const n in v)s=s.split('{'+n+'}').join(v[n]);return s};
const tr=(k,v)=>t(k,v); // for functions that use t as a time variable
const loc=()=>save.lang==='tr'?'tr-TR':save.lang;
const cname=c=>(CITY_NAMES[c.lm]||{})[save.lang]||(CITY_NAMES[c.lm]||{}).en||c.n;
const upper=s=>s.toLocaleUpperCase(loc());
const tname=id=>t('tour_'+id);
function applyLang(){
  const h=document.documentElement;h.lang=save.lang;h.dir=save.lang==='ar'?'rtl':'ltr';
  try{localStorage.setItem('flixLegalLang',save.lang==='tr'?'tr':'en')}catch(e){}
  try{window.dispatchEvent(new Event('flixlang'))}catch(e){}
  document.querySelectorAll('[data-t]').forEach(e=>{e.textContent=t(e.dataset.t)});
  document.querySelectorAll('[data-th]').forEach(e=>{e.innerHTML=t(e.dataset.th)});
}

// ================= ADS =================
// Pacing (lessons from Flix Jump 1.3.2 / 1.3.3): interstitial only on "Continue", every 3rd finished kick, at most once
// per 90 s, never within 60 s of a rewarded ad and never in the first minute; "No Ads" turns it off. A rewarded button
// with no AdMob ad ready shows the FLIX TOYS house ad and still rewards, so the button never does nothing.
const Ads={
  lastI:Date.now()-30000,lastR:0,
  house(res){const a=$('houseAd');a.classList.add('on');let n=3;$('houseN').textContent=n;const iv=setInterval(()=>{n--;$('houseN').textContent=n;if(n<=0){clearInterval(iv);a.classList.remove('on');res(true)}},800)},
  rewarded(){return new Promise(res=>{
    if(window.FlixAds){FlixAds.showRewarded(6000).then(r=>{Ads.lastR=Date.now();if(r==='unavailable')Ads.house(res);else res(r==='rewarded')});return}
    Ads.house(res)})},
  maybeInterstitial(){
    if(save.noads||!window.FlixAds)return;const now=Date.now();
    if(save.runs%3!==0||now-Ads.lastI<90000||now-Ads.lastR<60000)return;
    Ads.lastI=now;FlixAds.showInterstitial();
  }
};

// ================= SHOP: products =================
// Product ids match native-bridge.js and App Store Connect exactly. "web" is only the label of the browser demo:
// inside the app the price always comes from the App Store in the player's own currency ("…" until it has loaded).
const PACKS=[
  {id:'bonk_coins_500',coins:500,web:'29,99 ₺'},
  {id:'bonk_coins_1500',coins:1500,web:'69,99 ₺'},
  {id:'bonk_coins_4000',coins:4000,web:'149,99 ₺',best:1},
  {id:'bonk_coins_10000',coins:10000,web:'299,99 ₺'},
];
const PERMA=[{id:'bonk_noads',web:'79,99 ₺',name:'noads',desc:'noadsD'},{id:'bonk_skin_pack',web:'99,99 ₺',name:'skinPack',desc:'skinPackD'}];
// What every product gives, known from launch, so a purchase that arrives before the shop was opened (Ask to Buy,
// a transaction finished on the next launch, Restore) is never lost.
function grantFor(id){
  const p=PACKS.find(q=>q.id===id);if(p)return()=>{save.coins+=p.coins};
  if(id==='bonk_noads')return()=>{save.noads=true;if(window.FlixAds)FlixAds.setAdsRemoved(true)};
  if(id==='bonk_skin_pack')return()=>{save.skinPack=true;for(const k in SKINS)if(!save.skins.includes(k))save.skins.push(k)};
  return null;
}
function grantIAP(id){const g=grantFor(id);if(!g)return false;g();store();refreshUI();beep(990,.12,'triangle',.07);vib(30);return true}
// native-bridge.js calls this once per App Store transaction (tx) before finishing it; tx null = owned non-consumable (restore / reinstall)
window.__flixGrant=(id,tx)=>{if(tx&&save.tx.includes(tx))return true;if(!grantFor(id))return false;if(tx){save.tx.push(tx);if(save.tx.length>80)save.tx.shift()}grantIAP(id);return true};
function iapPrice(id,web){const p=window.FlixNative&&FlixNative.price&&FlixNative.price(id);return p||(window.FlixNative?'…':web)}
window.addEventListener('flixprices',()=>{if(isOn('shopPanel'))renderShop()});
function buyIAP(id,label,web){
  if(window.FlixNative&&FlixNative.buy){FlixNative.buy(id).then(r=>{
      if(r==='pending')modal(label,t('buyPending'));
      else if(r==='unavailable')modal(label,t('buyNoStore'));
      else if(r===false)modal(label,t('buyFail'));},()=>modal(label,t('buyFail')));return}
  modal(label,`<div class="mprice">${web}</div><small>${t('testBuy')}</small>`,()=>grantIAP(id));
}
function restorePurchases(){
  if(!(window.FlixNative&&FlixNative.restore)){modal(t('restore'),t('restoreNone'));return}
  document.querySelectorAll('.restoreB').forEach(b=>b.disabled=true);
  FlixNative.restore().then(ids=>{(ids||[]).forEach(id=>grantIAP(id));modal(t('restore'),t(ids&&ids.length?'restoreOk':'restoreNone'))},()=>modal(t('restore'),t('restoreFail')))
    .finally(()=>document.querySelectorAll('.restoreB').forEach(b=>b.disabled=false));
}

// ================= PANELS =================
function show(id,v){$(id).classList.toggle('on',!!v)}
const isOn=id=>$(id).classList.contains('on');
function modal(title,body,ok){
  $('mT').textContent=title;$('mB').innerHTML=body;$('mOk').textContent=t(ok?'ok':'close');$('mNo').hidden=!ok;$('mNo').textContent=t('cancel');
  $('mOk').onclick=e=>{e.stopPropagation();show('modal',0);ok&&ok()};$('mNo').onclick=e=>{e.stopPropagation();show('modal',0)};show('modal',1);
}
function refreshUI(){
  if(isOn('menuPanel'))renderMenu();if(isOn('shopPanel'))renderShop();if(isOn('endPanel')){renderUpgrades($('endUps'));$('endTotal').textContent=fmt(save.coins)}
  if(isOn('setPanel'))renderSettings();hud();
}
function coinIcon(){return '<i class="coin"></i>'}
function renderUpgrades(el){
  el.innerHTML='';
  for(const u of UPS){
    const l=save.lv[u.id],maxed=l>=u.max,c=u.cost(l);
    const d=document.createElement('div');d.className='up';
    d.innerHTML=`<div><b>${t('u_'+u.id)} <small>${t('lv')} ${l}/${u.max}</small></b><small>${t('u_'+u.id+'_d')}</small><span class="pips">${'<i class="on"></i>'.repeat(l)}${'<i></i>'.repeat(u.max-l)}</span></div>`;
    const b=document.createElement('button');b.className='buy';b.innerHTML=maxed?t('max'):(coinIcon()+fmt(c));b.disabled=maxed||save.coins<c;
    b.onclick=e=>{e.stopPropagation();if(save.coins>=c&&!maxed){save.coins-=c;save.lv[u.id]++;store();beep(990,.1,'triangle',.06);vib(15);refreshUI()}};
    d.appendChild(b);el.appendChild(d);
  }
}
let shopTab='up';
function renderShop(){
  document.querySelectorAll('#shopTabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===shopTab));
  $('shopCoins').innerHTML=coinIcon()+fmt(save.coins);
  const g=$('shopGrid');g.innerHTML='';
  if(shopTab==='up'){renderUpgrades(g);return}
  if(shopTab==='toys'){
    const grid=document.createElement('div');grid.className='toys';
    for(const id in SKINS){const s=SKINS[id],own=save.skins.includes(id),sel=save.skin===id;
      const d=document.createElement('div');d.className='toy'+(sel?' sel':'');
      const c=document.createElement('canvas');c.width=120;c.height=120;const x=c.getContext('2d');x.scale(2,2);drawToy(x,30,34,0,17,0,0.3,s);
      d.appendChild(c);const nm=document.createElement('div');nm.className='nm';nm.textContent=t('s_'+id);d.appendChild(nm);
      const b=document.createElement('button');
      if(sel){b.textContent=t('equipped');b.disabled=true;b.className='on'}
      else if(own){b.textContent=t('equip');b.onclick=e=>{e.stopPropagation();save.skin=id;store();vib(10);renderShop()}}
      else{b.className='buy';b.innerHTML=coinIcon()+fmt(s.price);b.onclick=e=>{e.stopPropagation();
        if(save.coins<s.price){modal(t('s_'+id),t('needCoins',{h:fmt(save.coins),a:fmt(s.price)}));return}
        modal(t('s_'+id),t('buyQ',{a:fmt(s.price),n:t('s_'+id)}),()=>{save.coins-=s.price;save.skins.push(id);save.skin=id;store();beep(990,.12,'triangle',.07);refreshUI()})}}
      d.appendChild(b);grid.appendChild(d)}
    g.appendChild(grid);return;
  }
  // coins tab: real-money products
  for(const p of PACKS){const d=document.createElement('div');d.className='pack'+(p.best?' best':'');
    d.innerHTML=`${p.best?`<span class="ribbon">${t('bestDeal')}</span>`:''}<div class="pc">${coinIcon()}${fmt(p.coins)}</div>`;
    const b=document.createElement('button');b.className='buy iap';b.textContent=iapPrice(p.id,p.web);b.onclick=e=>{e.stopPropagation();buyIAP(p.id,t('coinsN',{n:fmt(p.coins)}),p.web)};
    d.appendChild(b);g.appendChild(d)}
  for(const p of PERMA){const own=p.id==='bonk_noads'?save.noads:save.skinPack;const d=document.createElement('div');d.className='pack wide';
    d.innerHTML=`<div><b>${t(p.name)}</b><small>${t(p.desc)}</small></div>`;
    const b=document.createElement('button');b.className=own?'on':'buy iap';b.textContent=own?t('owned'):iapPrice(p.id,p.web);b.disabled=own;
    if(!own)b.onclick=e=>{e.stopPropagation();buyIAP(p.id,t(p.name),p.web)};d.appendChild(b);g.appendChild(d)}
  const r=document.createElement('button');r.className='link restoreB';r.textContent=t('restore');r.onclick=e=>{e.stopPropagation();restorePurchases()};g.appendChild(r);
}
function renderSettings(){
  const tog=(id,on)=>{const b=$(id);b.textContent=t(on?'on':'off');b.classList.toggle('on',on)};
  tog('sndB',save.sound);tog('hapB',save.haptic);
  const L=$('langs');L.innerHTML='';
  for(const [k,n] of LANGS){const b=document.createElement('button');b.textContent=n;b.className=save.lang===k?'on':'';b.onclick=e=>{e.stopPropagation();save.lang=k;store();applyLang();refreshUI();renderSettings()};L.appendChild(b)}
  $('verT').textContent=t('version')+' '+VERSION;
}
function stampHTML(c,on,round){return `<span class="stamp ${on?'':'off'}" style="border-color:${c.col};color:${c.col}">${upper(cname(c))}<small>${on?(round>1?t('roundN',{n:round}):'BONKAROO'):'—'}</small></span>`}
function routeHTML(){
  const ts=TS(),cs=T().cities,j=ts.journey;
  let h='<div class="rt">';
  cs.forEach((c,i)=>{h+=`<span class="d ${j>=c.at||i===0?'on':''}"></span>`;if(i<cs.length-1){const f=Math.max(0,Math.min(1,(j-c.at)/(cs[i+1].at-c.at)));h+=`<span class="l"><i style="width:${f*100}%"></i></span>`}});
  h+='</div><div class="rtn">'+cs.map(c=>`<span>${cname(c)}</span>`).join('')+'</div>';
  const nx=Math.min(ts.leg+1,cs.length-1),b=cs[nx];
  h+=`<div class="next">${t('nextStop')}: <b>${cname(b)}</b> · ${fmt(Math.max(0,(b.at-j)*T().km))} km</div>`;
  return h;
}
function renderMenu(){
  const el=$('tours');el.innerHTML='';
  for(const id in TOURS){
    const tr=TOURS[id],ts=save.tours[id],cs=tr.cities,nx=Math.min(ts.leg+1,cs.length-1);
    const b=document.createElement('button');b.className='tour';
    const done=Object.keys(ts.stamps).length;
    b.innerHTML=`<b>${tname(id)}</b>${ts.round>1?' <small>· '+t('roundTag',{n:ts.round})+'</small>':''}<span>${cs.map(c=>cname(c)).filter((v,i,a)=>a.indexOf(v)===i).join(' · ')}</span><span>${t('next')}: ${cname(cs[nx])} · ${fmt(Math.max(0,(cs[nx].at-ts.journey)*tr.km))} km · ${done}/${cs.length-1} ${t('stamps')}</span>`;
    b.onclick=e=>{e.stopPropagation();save.tour=id;store();show('menuPanel',0);beep(500,.05);reset()};
    el.appendChild(b);
  }
  $('superTag').hidden=!save.superNext;
}
function renderPass(){
  let h='';
  for(const id in TOURS){const tr=TOURS[id],ts=save.tours[id];
    h+=`<p class="ph">${tname(id)}</p><div class="grid">`;
    tr.cities.slice(1).forEach((c,i)=>{const r=ts.stamps[i+1];h+=stampHTML(c,!!r,r||1)});
    h+='</div>';}
  $('passBody').innerHTML=h;
}

// ================= END OF A KICK =================
let lastEarned=0;
function finish(){
  if(state!=='flight')return;state='end';
  const ts=TS(),m=Math.max(0,Math.floor((toy.x-startX)/PX));
  const earned=runCoins+Math.floor(m/5);lastEarned=earned;
  const rec=m>save.best;if(rec)save.best=m;
  save.coins+=earned;save.runs++;ts.journey=toy.x/PX;
  if(tourDone){ts.round++;ts.journey=0;ts.leg=0}
  store();
  $('endTitle').textContent=tourDone?t('tourDone',{t:tname(save.tour)}):arrivals.length?t('newCity'):rec?t('longest'):t('niceShot');
  countUp($('endDist'),m,' m');
  $('endCoins').textContent='+'+fmt(earned+arrivals.reduce((s,a)=>s+a.bonus,0));
  $('endStamp').innerHTML=arrivals.map(a=>{const c=T().cities[a.i];return `<div class="newstamp">${t('stampNew')}<br>${stampHTML(c,true,ts.round-(tourDone?1:0))}<br>${c.note?t(c.note):''}</div>`}).join('');
  $('endRoute').innerHTML=routeHTML();
  $('againBtn').textContent=tourDone?t('newTour'):t('cont');
  $('x2Btn').disabled=earned<=0;$('x2Btn').classList.remove('used');
  $('superBtn').disabled=save.superNext;
  renderUpgrades($('endUps'));$('endTotal').textContent=fmt(save.coins);
  setTimeout(()=>show('endPanel',1),arrivals.length?900:550);
}
function countUp(el,to,suf){const t0=performance.now();const f=now=>{const k=Math.min(1,(now-t0)/700);el.textContent=fmt(Math.round(to*easeOut(k)))+suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

// ================= WIRING =================
function wire(){
  const on=(id,fn)=>$(id).addEventListener('click',e=>{e.stopPropagation();beep(600,.04,'triangle',.04);fn(e)});
  on('againBtn',()=>{show('endPanel',0);Ads.maybeInterstitial();reset()});
  on('menuBtn',()=>{show('endPanel',0);renderMenu();show('menuPanel',1);state='menu'});
  const openPass=()=>{renderPass();show('passPanel',1)};on('passBtn1',openPass);on('passBtn2',openPass);
  on('passClose',()=>show('passPanel',0));
  const openShop=()=>{renderShop();show('shopPanel',1)};on('shopBtn1',openShop);on('shopBtn2',openShop);
  on('shopClose',()=>{show('shopPanel',0);refreshUI()});
  document.querySelectorAll('#shopTabs button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();shopTab=b.dataset.tab;renderShop()}));
  on('setBtn',()=>{renderSettings();show('setPanel',1)});on('setClose',()=>show('setPanel',0));
  on('sndB',()=>{save.sound=!save.sound;store();renderSettings()});
  on('hapB',()=>{save.haptic=!save.haptic;store();vib(20);renderSettings()});
  on('restoreS',restorePurchases);
  on('x2Btn',()=>{const b=$('x2Btn');if(b.disabled)return;b.disabled=true;Ads.rewarded().then(ok=>{if(ok){save.coins+=lastEarned;store();$('endCoins').textContent='+'+fmt(lastEarned*2);$('endTotal').textContent=fmt(save.coins);b.classList.add('used');popup(t('doubled'),'#ffd23f',28);beep(880,.15,'square',.07);renderUpgrades($('endUps'))}else b.disabled=false})});
  on('superBtn',()=>{const b=$('superBtn');if(b.disabled)return;b.disabled=true;Ads.rewarded().then(ok=>{if(ok){save.superNext=true;store();popup(t('superOn'),'#ffd23f',28);beep(880,.15,'square',.07)}else b.disabled=false})});
  for(const id of['menuPanel','endPanel','passPanel','shopPanel','setPanel','modal','houseAd'])$(id).addEventListener('pointerdown',e=>e.stopPropagation());
}

// automated tests only (?test in the address); never present in the App Store build's normal start
if(/[?&]test\b/.test(location.search))window.__bk=()=>({y:toy.y,vy:toy.vy,held:toy.held,state,sweet:SWEET_DY,kick:mas&&mas.kick,save});
if(window.FlixLegal)FlixLegal.init({game:'bonkaroo',name:'Bonkaroo',version:VERSION,oss:['Capacitor, @capacitor-community/admob, cordova-plugin-purchase (MIT)']});
applyLang();wire();renderMenu();show('menuPanel',1);
if(save.noads&&window.FlixAds)FlixAds.setAdsRemoved(true);
if(window.FlixNative&&FlixNative.flush)try{FlixNative.flush()}catch(e){}
requestAnimationFrame(loop);

})();
