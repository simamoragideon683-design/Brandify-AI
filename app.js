'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const tools = [
    ['logo','✳','Generator logo','6 konsep logo vektor'],['names','Aa','Nama & slogan','Nama, slogan & tipografi'],
    ['palette','◉','Palet warna','Warna yang selaras'],['packaging','▣','Desain produk & kemasan','3 gaya mockup produk'],
    ['social','▧','Konten Instagram','Preview feed & desain 4:5'],['analysis','◎','Analisis merek','Strategi dan positioning'],
    ['guide','⇩','Brand guideline','Panduan identitas lengkap']
  ];
  const fields = ['business','industry','audience','personality','description'];
  const icons = ['spark','leaf','orbit','diamond','wave','sun','petal','mountain','ribbon','arch','bolt','grid'];
  const paletteSets = [ ['#174F3A','#BCE46C','#F4ECDD','#36584A','#FFFFFF'], ['#70482D','#D6A66E','#F8E9D5','#473A32','#FFFFFF'], ['#24233F','#D4B46A','#F3EEE4','#575575','#FFFFFF'], ['#64345B','#FFAA69','#FFF0D9','#405B9C','#FFFFFF'], ['#183D60','#72C7BC','#EEF3F8','#34465C','#FFFFFF'] ];
  const storageKey = 'brandify-studio-v1';
  const state = { tab:'home', kit:null, brief:null, busy:false, iteration:0 };
  let timer;
  function node(tag, cls, text) { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; }
  function button(text, fn, cls='button secondary small'){const b=node('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
  function toast(text,bad=false){clearTimeout(timer);$('toast').textContent=text;$('toast').classList.toggle('bad',bad);$('toast').hidden=false;timer=setTimeout(()=>{$('toast').hidden=true;},4200);}
  function text(v,max=500,min=1){return typeof v==='string' && v.trim().length>=min && v.length<=max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(v);}
  function validBrief(b){return b && typeof b.business==='string' && (b.business===''||text(b.business,60)) && [...$('industry').options].some(o=>o.value!==''&&o.value===b.industry) && [...$('personality').options].some(o=>o.value===b.personality) && text(b.audience,120,3) && text(b.description,500,10);}
  function validKit(k){return k && text(k.brand,60) && Array.isArray(k.names)&&k.names.length===3&&k.names.every(x=>x&&text(x.name,60)&&text(x.slogan,120)) && text(k.slogan,120) && Array.isArray(k.colors)&&k.colors.length===5&&k.colors.every(c=>typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c)) && icons.includes(k.symbol) && text(k.logo,600) && text(k.packaging,600) && text(k.caption,900) && text(k.headline,80) && text(k.analysis,1200) && text(k.voice,400) && text(k.typography,250);}
  function readBrief(){return Object.fromEntries(fields.map(id=>[id,$(id).value.trim()]));}
  function setBrief(b){fields.forEach(id=>{$(id).value=b[id]||'';});updateCounter();}
  function updateCounter(){$('counter').textContent=$('description').value.length+' / 500';}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify({brief:state.brief,kit:state.kit,source:'demo'}));}catch{toast('Penyimpanan lokal tidak tersedia.',true);}}
  function restore(){try{const raw=localStorage.getItem(storageKey);if(!raw||raw.length>24000)return;const o=JSON.parse(raw);if(validBrief(o.brief)&&validKit(o.kit)){state.brief=o.brief;state.kit=o.kit;state.source='demo'; if(o.source!=='demo'){state.kit=demo(o.brief);save();}setBrief(o.brief);}}catch{/* data rusak diabaikan */}}
  function hash(s){let h=2166136261;for(const c of s){h=Math.imul(h^c.codePointAt(0),16777619);}return h>>>0;}
  function demo(b){
    const h=hash(JSON.stringify(b)+state.iteration), mood=Math.max(0,[...$('personality').options].findIndex(o=>o.value===b.personality));
    const roots=['Nusa','Rupa','Karsa','Aruna','Loka','Sora','Raya','Aksa','Pijar','Sela','Bumi','Rona'];
    const endings={ 'Kuliner & minuman':['Rasa','Brew','Dapur'], 'Fashion & aksesori':['Wear','Rupa','Mode'], 'Kecantikan & kesehatan':['Glow','Care','Pure'], 'Teknologi & jasa digital':['Labs','Digital','Works'], 'Kerajinan & dekorasi':['Craft','Ruang','Studio'], 'Pendidikan & jasa':['Kelas','Tumbuh','Karya'], 'Lainnya':['Studio','Karya','Co'] }[b.industry];
    const slogans=industrySlogans[b.industry]||industrySlogans.Lainnya;
    const names=Array.from({length:3},(_,i)=>({name:roots[(h+i*3)%roots.length]+' '+endings[(h+i)%3],slogan:slogans[(h+i)%slogans.length]}));
    const brand=b.business||names[0].name, slogan=names[0].slogan, colors=[...paletteSets[mood]];
    if(state.iteration%3===2){[colors[1],colors[2]]=[colors[2],colors[1]];}
    return {brand,names,slogan,colors,fontChoice:recommendFont(b,0),logoChoice:0,symbol:icons[(mood+state.iteration-1+icons.length)%icons.length],
      logo:'Identitas '+b.personality.toLowerCase()+' dengan simbol sederhana, kontras jelas, dan wordmark yang mudah dibaca. Pertahankan ruang kosong di sekitar logo.',
      packaging:'Konsep kemasan untuk '+b.industry.toLowerCase()+': warna utama sebagai bidang dominan, logo di bagian depan, dan aksen untuk informasi produk. Tambahkan informasi wajib sesuai kategori produk sebelum dicetak.',
      headline:'Kenali '+brand.slice(0,60),caption:'Halo, '+b.audience+'! Kenalkan '+brand+'. '+b.description+'\n\n'+slogan+' Yuk, ceritakan kebutuhanmu di kolom komentar.\n\n#UMKMIndonesia #BrandLokal #DukungLokal',
      analysis:'Positioning: '+brand+' untuk '+b.audience+'.\n\nNilai utama dari brief: '+b.description+'\n\nArah strategi: gunakan gaya '+b.personality.toLowerCase()+' secara konsisten. Uji pesan dan visual melalui wawancara calon pelanggan; bandingkan dengan kompetitor sebelum menetapkan positioning final. Analisis ini berbasis brief, bukan riset pasar.',
      voice:'Gunakan bahasa '+(mood===2?'tenang, ringkas dan berkelas':mood===3?'ceria, aktif dan ekspresif':'ramah, jelas dan mudah dipahami')+'. Hindari klaim berlebihan dan utamakan manfaat nyata.',typography:'Judul memakai gaya huruf pilihan. Isi: sans-serif reguler. Gunakan hierarki konsisten dan uji keterbacaan.'};
  }
  function svgEl(tag,attrs={},value){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(value!==undefined)e.textContent=value;return e;}
  function rect(x,y,w,h,fill,rx=0){return svgEl('rect',{x,y,width:w,height:h,fill,rx});}
  function svgText(x,y,value,fill,size=30,weight=700,anchor='middle',font='Arial, sans-serif'){return svgEl('text',{x,y,fill,'font-size':size,'font-weight':weight,'font-family':font,'text-anchor':anchor},value);}
  function contrast(hex){const v=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);const l=.2126*v[0]+.7152*v[1]+.0722*v[2];return l>.179?'#111111':'#FFFFFF';}
  function mark(type,color){const g=svgEl('g',{fill:color});const paths={spark:'M50 0 60 34 85 15 66 40 100 50 66 60 85 85 60 66 50 100 40 66 15 85 34 60 0 50 34 40 15 15 40 34Z',leaf:'M50 94C-9 63 2 9 88 4 96 61 74 89 50 94ZM19 83 73 25 30 88Z',orbit:'M50 0A50 50 0 1 0 50 100 50 50 0 0 0 50 0ZM50 22A28 28 0 1 1 50 78 28 28 0 0 1 50 22Z',diamond:'M50 0 100 50 50 100 0 50ZM50 26 26 50 50 74 74 50Z',wave:'M0 30Q25 0 50 30T100 30V48Q75 78 50 48T0 48ZM0 60Q25 30 50 60T100 60V78Q75 108 50 78T0 78Z',sun:'M50 0 58 28 79 10 77 39 100 50 77 61 79 90 58 72 50 100 42 72 21 90 23 61 0 50 23 39 21 10 42 28Z',petal:'M50 50C0 60 0 0 50 12C100 0 100 60 50 50C100 40 100 100 50 88C0 100 0 40 50 50Z',mountain:'M0 87 33 16 50 48 69 6 100 87H76L69 66 61 87H39L33 66 24 87Z',ribbon:'M10 15H90V45L58 65V100L42 88V65L10 45ZM29 29V37L50 49 71 37V29Z',arch:'M5 100V48A45 45 0 0 1 95 48V100H72V48A22 22 0 0 0 28 48V100Z',bolt:'M56 0 8 58H43L34 100 94 36H57L68 0Z',grid:'M0 0H44V44H0ZM56 0H100V44H56ZM0 56H44V100H0ZM56 56H100V100H56Z'};g.append(svgEl('path',{d:paths[type],'fill-rule':'evenodd'}));return g;}
  function placeMark(svg,k,x,y,scale,color){const g=svgEl('g',{transform:`translate(${x} ${y}) scale(${scale})`});g.append(mark(k.symbol,color));svg.append(g);}
  function fit(s,n){return [...s].length>n?[...s].slice(0,n-1).join('')+'…':s;}
  function download(content,name,type){const u=URL.createObjectURL(new Blob([content],{type}));const a=node('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);toast('Berkas berhasil disiapkan.');}
  async function copy(value){try{await navigator.clipboard.writeText(value);toast('Disalin ke clipboard.');}catch{const t=node('textarea');t.value=value;document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch{}t.remove();toast(ok?'Disalin ke clipboard.':'Clipboard tidak tersedia. Gunakan ekspor kit.',!ok);}}
  function guide(k,b){return ['BRAND GUIDELINE — '+k.brand,'Slogan: '+k.slogan,'Industri: '+b.industry,'Target: '+b.audience,'Kepribadian: '+b.personality,'Brief: '+b.description,'IDENTITAS VISUAL\n'+k.logo,'PALET WARNA\n'+k.colors.map((v,i)=>['Utama','Aksen','Latar','Pendukung','Netral'][i]+': '+v).join('\n'),'TIPOGRAFI\n'+fontFor(k).name+' — '+fontFor(k).desc+'\n'+k.typography+'\nKonsep logo: '+logoStyles[choice(k.logoChoice,logoStyles.length)][0],'TONE OF VOICE\n'+k.voice,'KEMASAN\n'+k.packaging,'INSTAGRAM\n'+socialThemes.map((v,i)=>v[0]+'\n'+socialCaption(k,i)).join('\n\n'),'STRATEGI\n'+k.analysis,'ATURAN PAKAI\nJaga proporsi logo, hindari distorsi, uji kontras dan keterbacaan. Periksa merek dagang dan persyaratan label sebelum penggunaan komersial.','SUMBER: Studio lokal berbasis aturan (tanpa AI)'].join('\n\n');}
  // Product studio: local shaded vector mockups.
  const productCatalog={
    'Fashion & aksesori':[['shirt','Kaos / T-shirt'],['hoodie','Hoodie'],['polo','Kaos polo'],['tote','Tas tote']],
    'Kuliner & minuman':[['pouch','Standing pouch'],['cup','Gelas minuman'],['bottle','Botol minuman'],['box','Kotak makanan'],['jar','Toples makanan']],
    'Kecantikan & kesehatan':[['pump','Botol pump'],['tube','Tube krim'],['jar','Pot krim'],['bottle','Botol produk']],
    'Teknologi & jasa digital':[['screen','Tampilan aplikasi'],['box','Kotak produk teknologi'],['book','Brosur layanan']],
    'Kerajinan & dekorasi':[['vase','Vas keramik'],['tote','Tas kain'],['box','Kotak hadiah']],
    'Pendidikan & jasa':[['book','Buku / modul'],['screen','Tampilan kursus digital'],['tote','Tas seminar']],
    'Lainnya':[['box','Kotak produk'],['pouch','Standing pouch'],['bottle','Botol'],['shirt','Kaos'],['tote','Tas'],['book','Brosur']]
  };
  const productStyles=[['Minimalis','Logo kecil, penempatan rapi dan warna utama.'],['Bold / modern','Identitas besar, warna aksen dan kontras kuat.'],['Premium','Tampilan elegan dengan detail sederhana dan warna netral.']];
  let productType='',productKey='';
  let localPhoto='',photoVersion=0;
  function resetProducts(){productType='';productKey='';}
  function clearPhoto(){photoVersion++;localPhoto='';}
  function chooseProduct(brief,options){const desc=brief.description.toLowerCase();const rules=[['hoodie',/hoodie|sweater|jaket/],['polo',/polo/],['tote',/tote|tas kain|tas /],['shirt',/kaos|baju|pakaian|outfit|fashion/],['cup',/kopi susu|kedai kopi|es kopi|boba|gelas/],['bottle',/botol|minuman kemasan|jus/],['jar',/toples|selai|pot krim/],['box',/nasi|kue|makanan berat|kotak/],['tube',/tube|pasta|krim/],['pump',/sabun|serum|lotion|sampo/],['screen',/aplikasi|website|software|kursus online/],['vase',/vas|keramik/]];return rules.find(([id,r])=>r.test(desc)&&options.some(o=>o[0]===id))?.[0]||options[0][0];}
  function productSVG(type,k,variant){
    const [a,b,c,d,e]=k.colors;const base=[a,b,d][variant],fg=contrast(base),accent=[b,a,c][variant];
    const s=svgEl('svg',{viewBox:'0 0 540 410',role:'img','aria-label':'Mockup ilustratif '+type+' '+productStyles[variant][0]});
    const uid='p'+(++productSerial);const defs=svgEl('defs');s.append(defs);
    const gradient=(id,stops,vertical=false)=>{const g=svgEl('linearGradient',{id:uid+id,x1:'0%',y1:'0%',x2:vertical?'0%':'100%',y2:vertical?'100%':'18%'});for(const [offset,color,opacity] of stops)g.append(svgEl('stop',{offset,'stop-color':color,'stop-opacity':opacity??1}));defs.append(g);return 'url(#'+uid+id+')';};
    const shade=gradient('shade',[[0,'#000',.30],[.15,'#fff',.08],[.32,'#000',.12],[.49,'#fff',.22],[.67,'#000',.04],[.86,'#fff',.07],[1,'#000',.32]]);
    const floor=gradient('floor',[[0,'#f7f5ef'],[1,'#c9cfc4']],true);
    const gloss=gradient('gloss',[[0,'#fff',.03],[.4,'#fff',.33],[1,'#fff',0]]);
    const bg=gradient('bg',[[0,'#f7f5ef'],[1,'#d9ded4']],true);
    const shadow=svgEl('filter',{id:uid+'blur',x:'-50%',y:'-100%',width:'200%',height:'300%'});shadow.append(svgEl('feGaussianBlur',{stdDeviation:10}));defs.append(shadow);
    const path=(d,fill,stroke='none',width=1)=>svgEl('path',{d,fill,stroke,'stroke-width':width,'stroke-linejoin':'round','stroke-linecap':'round'});
    const shape=(d)=>{s.append(path(d,base,'#00000022',1),path(d,shade));};
    const R=(x,y,w,h,fill,rx=0)=>s.append(rect(x,y,w,h,fill,rx));
    const seam=(d)=>s.append(path(d,'none','#00000035',1.4));
    const label=(x,y,w=130,scale=1)=>{if(variant===2){s.append(rect(x-w/2,y-20,w,76,c,5));}const color=variant===2?contrast(c):fg;const size=variant===0?.31:variant===1?.58:.38;const style=choice(k.logoChoice,logoStyles.length),cy=y-10+size*50;if(style===2){s.append(rect(x-size*50,y-10,size*100,size*100,color,7),svgText(x,cy+size*16,initials(k.brand),variant===2?c:base,size*48,800,'middle',fontFor(k).family));}else if(style===3){s.append(svgEl('circle',{cx:x,cy,r:size*54,fill:'none',stroke:color,'stroke-width':1.5}));placeMark(s,k,x-size*32,cy-size*32,size*.64,color);}else if(style===5){s.append(svgEl('path',{d:`M${x} ${cy-size*54}L${x+size*47} ${cy-size*27}V${cy+size*27}L${x} ${cy+size*54}L${x-size*47} ${cy+size*27}V${cy-size*27}Z`,fill:'none',stroke:color,'stroke-width':1.5}));placeMark(s,k,x-size*28,cy-size*28,size*.56,color);}else if(style!==1){placeMark(s,k,x-size*50,y-10,size,color);}s.append(svgText(x,style===1?cy+7:y+size*100+13,fit(k.brand,variant===0?15:20),color,Math.min(20,w/8)*scale,700,'middle',fontFor(k).family));};
    R(0,0,540,410,bg,14);R(0,304,540,106,floor);s.append(svgEl('ellipse',{cx:270,cy:345,rx:162,ry:19,fill:'#1c241b',opacity:.23,filter:'url(#'+uid+'blur)'}));
    if(['shirt','polo','hoodie'].includes(type)){
      const hoodie=type==='hoodie';const d=hoodie?'M202 100 Q185 65 209 40 Q270 3 331 40 Q355 65 338 100 L393 126 435 311 386 323 356 215 360 346 Q270 357 180 346 L184 215 154 323 105 311 147 126Z':'M215 57 Q270 79 325 57 L375 78 439 139 396 204 357 177 360 337 Q270 350 180 337 L183 177 144 204 101 139 165 78Z';
      shape(d);if(hoodie){s.append(path('M220 90 Q197 50 270 37 Q343 50 320 90 L270 125Z',accent),path('M225 94 270 119 315 94','none','#0005',2));seam('M220 97 231 175 M320 97 309 175 M218 275 Q270 290 322 275 L330 321 210 321Z');}
      else{s.append(path('M216 57 Q270 91 324 57 L312 75 Q270 111 228 75Z',accent),path('M237 64 Q270 83 303 64 Q270 92 237 64Z','#555b55'));seam('M165 80 Q180 124 183 177 M375 80 Q360 124 357 177 M180 328 Q270 340 360 328');if(type==='polo'){s.append(path('M218 61 270 90 241 116 214 76Z',accent),path('M322 61 270 90 299 116 326 76Z',accent));seam('M270 90V142');}}
      s.append(path('M184 189 Q205 235 198 310 M358 189 Q335 237 344 310 M217 314 Q270 326 323 314','none','#00000018',5));const folds=['M181 174Q220 211 205 277','M359 178Q321 211 339 288','M198 304Q242 286 259 319','M277 319Q306 300 345 316','M171 111Q145 151 150 184','M369 111Q395 151 390 184'];for(const fold of folds){s.append(path(fold,'none','#00000020',4),path(fold,'none','#ffffff19',1.2));}seam('M183 333Q270 344 357 333');label(variant===0?305:270,hoodie?167:143,variant===0?100:166);
    }else if(type==='tote'){
      s.append(path('M216 129V84Q216 25 270 25Q324 25 324 84V129','none',base,18),path('M216 129V84Q216 25 270 25Q324 25 324 84V129','none','#fff3',4));shape('M165 114H375L391 337Q270 355 149 337Z');seam('M166 129H374 M159 322Q270 339 381 322');label(270,180,150);
    }else if(type==='pouch'){
      shape('M194 46H346L370 78 385 326Q270 353 155 326L170 78Z');seam('M171 67H369 M170 82H370 M158 316Q270 332 382 316');s.append(path('M178 85Q197 200 177 316M361 85Q342 200 363 316','none','#ffffff35',3));R(179,252,182,28,accent,4);label(270,132,155);
    }else if(type==='cup'){
      shape('M174 95H366L336 337Q270 352 204 337Z');R(163,75,214,28,'#f2f1eb',7);R(182,60,176,20,'#d5d7d1',6);R(190,230,160,24,accent,4);label(270,145,140);
    }else if(['bottle','pump','tube','jar'].includes(type)){
      if(type==='jar'){shape('M163 155Q270 130 377 155L370 325Q270 350 170 325Z');R(157,113,226,57,accent,12);s.append(svgEl('ellipse',{cx:270,cy:114,rx:106,ry:16,fill:c}));label(270,191,160);}
      else if(type==='tube'){shape('M180 49H360L325 299H215Z');R(215,295,110,47,accent,7);seam('M184 66H356');label(270,131,135);}
      else{shape('M231 93Q230 120 191 137Q179 146 179 170V324Q270 350 361 324V170Q361 146 349 137Q310 120 309 93Z');R(226,67,88,41,accent,6);if(type==='pump'){R(253,38,34,35,accent,3);R(253,31,86,15,accent,4);}R(185,161,25,142,gloss,12);R(181,239,178,22,accent,3);label(270,150,140);}
    }else if(type==='vase'){
      shape('M231 55Q270 43 309 55L307 120Q307 146 346 180Q390 240 354 319Q270 355 186 319Q150 240 194 180Q233 146 233 120Z');s.append(svgEl('ellipse',{cx:270,cy:55,rx:39,ry:9,fill:'#26342c'}));label(270,210,130);
    }else if(type==='screen'){
      R(115,48,310,278,'#28312b',17);R(125,59,290,250,c,10);R(137,72,266,32,base,6);R(143,119,254,118,accent,8);R(143,252,120,38,base,6);R(277,252,120,38,base,6);placeMark(s,k,252,132,.36,contrast(accent));s.append(svgText(270,197,fit(k.brand,23),contrast(accent),22));R(95,326,350,13,'#aab1ac',5);
    }else if(type==='book'){
      s.append(path('M190 64 350 45 385 65 385 327 350 346 190 346Z','#d7d4c9'),path('M350 65 385 65 385 327 350 346Z','#eae5dc'));shape('M170 63 350 45 350 346 170 346Z');R(179,80,8,245,accent,2);label(263,141,145);
    }else{
      s.append(path('M155 100 223 50 385 50 385 100Z',accent),path('M355 100 385 50 385 295 355 340Z',d));shape('M155 100H355V340H155Z');R(155,280,200,60,accent,0);label(255,139,155);
    }
    return s;
  }
  let productSerial=0;
  const fonts=[
    {name:'Modern sans',family:'Arial, Helvetica, sans-serif',weight:800,desc:'Bersih dan tegas; cocok untuk fashion, teknologi, dan retail.'},
    {name:'Editorial serif',family:'Georgia, Times New Roman, serif',weight:700,desc:'Elegan dan berkarakter; cocok untuk produk premium atau artisan.'},
    {name:'Friendly rounded',family:'Trebuchet MS, Verdana, sans-serif',weight:700,desc:'Ramah dan mudah dibaca; cocok untuk kuliner dan layanan keluarga.'},
    {name:'Bold display',family:'Impact, Arial Black, sans-serif',weight:900,desc:'Ekspresif dan kuat; cocok untuk streetwear dan kampanye promosi.'},
    {name:'Classic serif',family:'Times New Roman, Georgia, serif',weight:400,desc:'Klasik dan tenang; cocok untuk kecantikan dan jasa profesional.'},
    {name:'Technical mono',family:'Courier New, monospace',weight:700,desc:'Rapi dan khas; cocok untuk digital, edukasi dan produk kreatif.'}
  ];
  const industrySlogans={
    'Kuliner & minuman':['Rasa yang dekat di hati.','Nikmati momen, nikmati rasa.','Teman setiap cerita.','Dari rasa, jadi cerita.','Satu rasa, banyak cerita.'],
    'Fashion & aksesori':['Tampil beda, tetap jadi diri.','Gaya untuk setiap langkah.','Kenakan percaya dirimu.','Sederhana, tetap berkarakter.','Gaya yang tumbuh bersamamu.'],
    'Kecantikan & kesehatan':['Rawat diri, hargai setiap hari.','Cantik dengan caramu.','Ritual kecil untuk dirimu.','Nyaman menjadi diri sendiri.','Momen untuk merawat diri.'],
    'Teknologi & jasa digital':['Solusi untuk langkah berikutnya.','Buat yang rumit lebih sederhana.','Bergerak maju, bersama.','Ide nyata, langkah digital.','Bekerja lebih cerdas.'],
    'Kerajinan & dekorasi':['Sentuhan kecil, cerita besar.','Ruang untuk karakter.','Karya dengan makna.','Detail yang bercerita.','Hadirkan kehangatan.'],
    'Pendidikan & jasa':['Belajar hari ini, melangkah esok.','Tumbuh bersama setiap hari.','Mulai langkah barumu.','Ruang untuk berkembang.','Dari niat menjadi kemampuan.'],
    'Lainnya':['Kecil langkahnya, besar maknanya.','Dibuat dengan niat, hadir untukmu.','Pilihan yang membuat hari lebih baik.','Beda caranya, dekat rasanya.','Tumbuh bersama, setiap hari.']
  };
  const logoStyles=[['Simbol & nama','Identitas seimbang dengan simbol di atas nama.'],['Wordmark','Fokus pada bentuk huruf dan nama usaha.'],['Monogram','Inisial merek dalam bingkai geometris.'],['Emblem','Lencana bundar dengan identitas yang ringkas.'],['Logo horizontal','Simbol di kiri, nama di kanan; untuk header dan label.'],['Badge geometris','Ikon tegas dengan aksen warna untuk produk modern.']];
  function choice(n,len){return Number.isInteger(n)&&n>=0&&n<len?n:0;}
  function recommendFont(b,i){const byMood={'Modern & minimalis':[0,3,5],'Hangat & natural':[2,1,0],'Elegan & premium':[1,4,0],'Ceria & berani':[3,2,0],'Profesional & tepercaya':[0,4,5]};return (byMood[b.personality]||[0,1,2])[i%3];}
  function fontFor(k){return fonts[choice(k.fontChoice,fonts.length)];}
  function brandedText(s,k,x,y,value,fg,size,maxWidth,anchor='middle',font=fontFor(k)){
    const txt=svgText(x,y,fit(value,60),fg,Math.min(size,Math.max(11,maxWidth/Math.max(1,[...value].length)*1.55)),font.weight,anchor,font.family);s.append(txt);return txt;
  }
  function initials(v){return v.trim().split(/\s+/u).slice(0,2).map(x=>[...x][0]||'').join('').toUpperCase();}
  function logoSymbol(k,i){const base=Math.max(0,icons.indexOf(k.symbol));return icons[(base+i*2)%icons.length];}
  function logoSVG(k,i,transparent=false){
    const [a,b,c,d]=k.colors;const s=svgEl('svg',{viewBox:'0 0 600 360',role:'img','aria-label':logoStyles[i][0]+' '+k.brand});
    const bg=[c,a,c,d,a,c][i], fg=transparent?a:contrast(bg), accent=transparent?d:(contrast(bg)=== '#FFFFFF'?b:a);const kk={...k,symbol:logoSymbol(k,i)};
    if(!transparent)s.append(rect(0,0,600,360,bg,0));
    const markColor=i===1?fg:accent;
    if(i===0){placeMark(s,kk,255,48,.9,markColor);brandedText(s,k,300,205,k.brand,fg,48,480);s.append(svgText(300,242,fit(k.slogan,52),fg,15,400));}
    if(i===1){brandedText(s,k,300,174,k.brand,fg,68,490);s.append(rect(245,194,110,4,accent,2),svgText(300,230,fit(k.slogan,52),fg,15,400));}
    if(i===2){s.append(rect(218,37,164,164,a,34));brandedText(s,k,300,141,initials(k.brand),contrast(a),82,138);brandedText(s,k,300,257,k.brand,fg,38,470);}
    if(i===3){s.append(svgEl('circle',{cx:300,cy:180,r:143,fill:'none',stroke:accent,'stroke-width':3}),svgEl('circle',{cx:300,cy:180,r:130,fill:'none',stroke:fg,'stroke-width':1,'stroke-dasharray':'2 5'}));placeMark(s,kk,270,82,.6,accent);brandedText(s,k,300,194,k.brand,fg,32,245);s.append(svgText(300,226,fit(k.slogan,30),fg,12,400),svgText(300,262,'•  IDENTITAS MEREK  •',fg,11,700));}
    if(i===4){placeMark(s,kk,58,123,1,accent);s.append(rect(182,114,2,130,fg,1));brandedText(s,k,202,181,k.brand,fg,42,335,'start');s.append(svgText(202,214,fit(k.slogan,34),fg,13,400,'start'));}
    if(i===5){s.append(svgEl('path',{d:'M300 34 385 83 385 181 300 230 215 181 215 83Z',fill:a}),svgEl('path',{d:'M300 44 375 88 375 176 300 220 225 176 225 88Z',fill:'none',stroke:b,'stroke-width':2}));placeMark(s,kk,265,97,.7,contrast(a));brandedText(s,k,300,279,k.brand,fg,39,470);}
    return s;
  }
  function serialize(svg){return new XMLSerializer().serializeToString(svg);}
  function saveSVG(svg,name){download(serialize(svg),name+'.svg','image/svg+xml');}
  async function savePNG(svg,name,width,height){
    const clone=svg.cloneNode(true);clone.setAttribute('width',String(width));clone.setAttribute('height',String(height));
    const url=URL.createObjectURL(new Blob([serialize(clone)],{type:'image/svg+xml'}));
    try{const im=new Image();im.src=url;await im.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas tidak tersedia.');ctx.drawImage(im,0,0,width,height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Gambar tidak dapat diekspor.');download(blob,name+'.png','image/png');}catch{toast('PNG gagal dibuat. Coba unduh SVG.',true);}finally{URL.revokeObjectURL(url);}
  }
  function selectLogo(k,i){const previous=choice(k.logoChoice,logoStyles.length);const base=(Math.max(0,icons.indexOf(k.symbol))-previous*2+icons.length*2)%icons.length;state.kit={...k,logoChoice:i,symbol:icons[(base+i*2)%icons.length]};resetProducts();save();render();toast('Konsep logo diterapkan ke identitas merek.');}
  function logoPanel(p,k){
    p.classList.add('creative-wide','full');p.append(node('h3','','6 konsep logo untuk merekmu'),node('p','','Pilih komposisi, unduh versi vektor atau PNG transparan. Elemen logo dan tipografi pilihan diterapkan pada label mockup produk.'));
    const gallery=node('div','creative-grid');logoStyles.forEach(([title,desc],i)=>{const tile=node('section','creative-tile'),selected=choice(k.logoChoice,logoStyles.length)===i;
      const baseline={...k,symbol:icons[(Math.max(0,icons.indexOf(k.symbol))-choice(k.logoChoice,logoStyles.length)*2+icons.length*2)%icons.length]};const art=logoSVG(baseline,i);tile.append(art,node('span','product-badge',selected?'Konsep terpilih':'Alternatif '+(i+1)),node('h4','',title),node('p','',desc));const actions=node('div','creative-actions');const pick=button(selected?'✓ Digunakan':'Pakai logo',()=>selectLogo(k,i),'button small '+(selected?'secondary':'primary'));pick.disabled=selected;actions.append(pick,button('SVG',()=>saveSVG(logoSVG(baseline,i,true),'brandify-logo-'+(i+1))),button('PNG transparan',()=>savePNG(logoSVG(baseline,i,true),'brandify-logo-'+(i+1),1500,900)));tile.append(actions);gallery.append(tile);});p.append(gallery,node('p','creative-note','Logo merupakan konsep vektor berbasis template. Periksa kemiripan dan ketersediaan merek dagang sebelum penggunaan komersial.'));
  }
  function namesPanel(p,k){
    p.classList.add('creative-wide','full');p.append(node('h3','','Nama, slogan & gaya huruf'),node('p','','Tiga ide nama dengan tipografi yang disesuaikan dengan kepribadian merek. Kamu juga bisa memilih gaya untuk nama usahamu saat ini.'));
    const gallery=node('div','creative-grid');k.names.forEach((v,i)=>{const fi=recommendFont(state.brief,i),f=fonts[fi],tile=node('section','creative-tile');const s=svgEl('svg',{viewBox:'0 0 600 250',role:'img','aria-label':'Contoh gaya huruf '+f.name});const bg=k.colors[i===1?0:2],fg=contrast(bg);s.append(rect(0,0,600,250,bg,12));brandedText(s,{...k,fontChoice:fi},300,113,v.name,fg,56,500);s.append(svgText(300,158,fit(v.slogan,54),fg,16,400),svgText(300,216,f.name.toUpperCase(),fg,12,700));tile.append(s,node('span','product-badge',f.name),node('h4','',v.name),node('p','',v.slogan),node('p','font-detail',f.desc),node('p','font-detail','Judul: '+f.family.split(',')[0]+' · Isi: Arial'));const actions=node('div','creative-actions');actions.append(button('Pakai nama & huruf',()=>{const b={...state.brief,business:v.name};state.kit={...k,brand:v.name,slogan:v.slogan,fontChoice:fi,headline:('Kenali '+v.name).slice(0,80),caption:k.caption.split(k.brand).join(v.name).slice(0,900),analysis:k.analysis.split(k.brand).join(v.name).slice(0,1200)};state.brief=b;setBrief(b);resetProducts();save();render();toast('Nama dan gaya huruf diterapkan.');},'button primary small'),button('Salin nama & slogan',()=>copy(v.name+' — '+v.slogan+' | '+f.name+' ('+f.family.split(',')[0]+')')));tile.append(actions);gallery.append(tile);});p.append(gallery);
    const row=node('div','font-picker'),label=node('label','','Gaya huruf merek saat ini'),sel=node('select');fonts.forEach((f,i)=>{const o=node('option','',f.name+' · '+f.family.split(',')[0]);o.value=String(i);sel.append(o);});sel.value=String(choice(k.fontChoice,fonts.length));label.append(sel);const sample=node('div','font-sample');const s=svgEl('svg',{viewBox:'0 0 600 120',role:'img','aria-label':'Tipografi aktif'});s.append(rect(0,0,600,120,k.colors[2],10));brandedText(s,k,300,76,k.brand,contrast(k.colors[2]),48,500);sample.append(s);row.append(label,sample);sel.addEventListener('change',()=>{state.kit={...k,fontChoice:choice(Number(sel.value),fonts.length)};save();render();toast('Tipografi merek diperbarui.');});p.append(row,node('p','creative-note','Font memakai keluarga huruf bawaan perangkat; bentuk dapat sedikit berbeda antar sistem. Nama belum diperiksa ketersediaan merek dagang atau domain.'));
  }
  function productPanel(p,k){
    const brief=state.brief,options=productCatalog[brief.industry]||productCatalog.Lainnya;const key=JSON.stringify([brief,k.brand,k.colors,k.symbol]);if(productKey!==key){resetProducts();productKey=key;productType=chooseProduct(brief,options);}
    p.classList.add('product-panel','full');p.append(node('h3','','Studio desain produk & kemasan'),node('p','','Pilih jenis produk dan bandingkan tiga gaya visual dengan identitas merekmu.'));
    const controls=node('div','product-controls'),label=node('label','','Jenis produk'),sel=node('select');for(const [id,name] of options){const opt=node('option','',name);opt.value=id;sel.append(opt);}sel.value=productType;label.append(sel);controls.append(label,node('p','product-hint','Mockup lokal dengan bayangan, lipatan dan efek material.'));p.append(controls);const gallery=node('div','product-gallery');p.append(gallery);
    const draw=()=>{gallery.replaceChildren();const kind=productType,name=options.find(o=>o[0]===kind)[1];productStyles.forEach(([title,desc],i)=>{const tile=node('section','product-option'),art=productSVG(productType,k,i),visual=node('div','product-visual');visual.append(art);const actions=node('div','creative-actions');actions.append(button('⇩ PNG',()=>savePNG(art,'brandify-produk-'+kind+'-'+(i+1),1080,820),'button primary small'),button('SVG',()=>saveSVG(art,'brandify-produk-'+kind+'-'+(i+1))));tile.append(visual,node('span','product-badge','Mockup ilustratif lokal'),node('h4','',title+' · '+name),node('p','',desc),actions);gallery.append(tile);});};sel.addEventListener('change',()=>{productType=sel.value;if(state.tab==='home')render();else draw();});draw();p.append(node('p','product-note',k.packaging),node('p','product-note','Mockup ini bukan foto barang nyata atau file produksi. Untuk unggahan yang lebih realistis, gunakan foto produk asli di studio Instagram.'));
  }
  const socialThemes=[['Perkenalan merek','KENALAN DULU','Kenali','Ceritakan awal perjalanan usaha dan nilai merek.'],['Sorotan produk','PILIHAN UNTUKMU','Temukan','Tampilkan produk dan manfaat yang benar-benar disebut dalam brief.'],['Ajakan interaksi','CERITA BERSAMA','Yuk, kenalan','Undang audiens berinteraksi tanpa klaim promosi palsu.']];
  function socialCaption(k,i){const b=state.brief;return [
    'Kenalan dengan '+k.brand+'! ✨\n\n'+b.description+'\n\n'+k.slogan+'\n\nSimpan postingan ini untuk mengenal kami lebih dekat.',
    'Kenali pilihan dari '+k.brand+'.\n\n'+b.description+'\n\nPenasaran dengan detailnya? Kirim pesan untuk bertanya.',
    'Halo, '+b.audience+'! 👋\n\n'+k.brand+' hadir dengan semangat: '+k.slogan+'\n\nApa yang paling kamu cari dari produk seperti ini? Ceritakan di komentar.'
  ][i]+'\n\n#UMKMIndonesia #BrandLokal #DukungLokal';}
  function instagramSVG(k,i,kind){
    const [a,b,c,d]=k.colors, bg=i===1?a:c,fg=contrast(bg),s=svgEl('svg',{viewBox:'0 0 600 750',role:'img','aria-label':'Desain Instagram '+socialThemes[i][0]});
    s.append(rect(0,0,600,750,bg));
    if(i===0){s.append(svgEl('circle',{cx:535,cy:70,r:115,fill:b,opacity:.65}),rect(32,36,126,30,a,15),svgText(95,56,'BRAND LOKAL',contrast(a),12),svgText(38,102,socialThemes[i][1],fg,14,700,'start'));brandedText(s,k,38,170,k.brand,fg,60,520,'start');s.append(svgText(38,205,fit(k.slogan,49),fg,17,400,'start'));}
    if(i===1){s.append(svgEl('circle',{cx:545,cy:660,r:210,fill:b,opacity:.32}),svgText(300,60,socialThemes[i][1],fg,15,700));brandedText(s,k,300,124,k.brand,fg,57,510);}
    if(i===2){s.append(rect(0,0,600,180,a),svgText(300,55,'CERITA BERSAMA',contrast(a),15,700));brandedText(s,k,300,120,'Yuk, kenalan!',contrast(a),51,510);s.append(svgText(300,153,fit(k.brand,36),contrast(a),17,400));}
    const box=i===0?[32,240,536,398]:i===1?[42,163,516,427]:[42,205,516,393];const [x,y,w,h]=box;
    if(localPhoto){const id='crop'+(++productSerial),defs=svgEl('defs'),clip=svgEl('clipPath',{id});clip.append(rect(x,y,w,h,'#fff',18));defs.append(clip);s.append(defs,svgEl('image',{x,y,width:w,height:h,href:localPhoto,preserveAspectRatio:'xMidYMid slice','clip-path':'url(#'+id+')'}));}
    else{const visual=productSVG(kind,k,i);visual.setAttribute('x',x);visual.setAttribute('y',y);visual.setAttribute('width',w);visual.setAttribute('height',h);visual.setAttribute('preserveAspectRatio','xMidYMid meet');s.append(visual);}
    const footer=i===0?667:i===1?628:639;const cta=['Kenali lebih dekat','Tanya detail produk','Ceritakan di komentar'][i];s.append(rect(32,footer,536,48,i===1?b:a,12),svgText(300,footer+30,cta,contrast(i===1?b:a),17,700));s.append(svgText(300,735,'•  '+fit(k.brand,35)+'  •',fg,12,400));return s;
  }
  async function readLocalPhoto(file){
    if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw Error('Pilih JPEG, PNG, atau WebP maksimal 10 MB.');
    const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71,webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';if(!((file.type==='image/jpeg'&&jpg)||(file.type==='image/png'&&png)||(file.type==='image/webp'&&webp)))throw Error('Format foto tidak valid.');
    const bmp=await createImageBitmap(file);try{if(bmp.width*bmp.height>40000000)throw Error('Resolusi foto terlalu besar.');const scale=Math.min(1,1500/Math.max(bmp.width,bmp.height));const cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(bmp.width*scale));cv.height=Math.max(1,Math.round(bmp.height*scale));const ctx=cv.getContext('2d');if(!ctx)throw Error('Canvas tidak tersedia.');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(bmp,0,0,cv.width,cv.height);return cv.toDataURL('image/jpeg',.86);}finally{bmp.close();}
  }
  function igIcon(kind){const s=svgEl('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});const paths={heart:'M12 21 3.8 12.8C-3 6 7 0 12 7 17 0 27 6 20.2 12.8Z',comment:'M21 11.5a9 9 0 0 1-9 9c-1.7 0-3.3-.4-4.6-1.2L3 21l1.7-4.4A9 9 0 1 1 21 11.5Z',send:'M22 2 9 15m13-13-8 20-5-7-7-5 20-8Z',save:'M6 3H18V21L12 17 6 21Z'};s.append(svgEl('path',{d:paths[kind]}));return s;}
  function socialPanel(p,k){
    p.classList.add('creative-wide','full');p.append(node('h3','','Studio Instagram · 3 ide postingan'),node('p','','Lihat simulasi feed sebelum memposting. Desain potret 1080 × 1350 piksel (4:5) siap diunduh. Tidak terhubung ke akun Instagram.'));
    const controls=node('div','photo-controls'),label=node('label','','Gunakan foto produk asli (opsional)'),input=node('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';label.append(input);controls.append(label,node('p','font-detail',localPhoto?'Foto lokal aktif · tidak dikirim ke server.':'Tanpa foto, desain memakai mockup produk sesuai kategori. Foto hanya berada di memori sesi.'));if(localPhoto)controls.append(button('Hapus foto',()=>{clearPhoto();render();}));p.append(controls);
    input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;const token=++photoVersion;try{const image=await readLocalPhoto(file);if(token!==photoVersion||state.kit!==k)return;localPhoto=image;render();toast('Foto produk diterapkan ke tiga desain.');}catch(e){if(token===photoVersion){toast(e.message||'Foto tidak dapat dibuka.',true);input.value='';}}});
    const options=productCatalog[state.brief.industry]||productCatalog.Lainnya,kind=options.some(o=>o[0]===productType)?productType:chooseProduct(state.brief,options);const gallery=node('div','creative-grid instagram-grid');
    const handle=(k.brand.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'').slice(0,24)||'brandlokal')+'.contoh';
    socialThemes.forEach(([title,_,__,desc],i)=>{const tile=node('section','creative-tile instagram-tile'),phone=node('div','ig-phone'),bar=node('div','ig-top'),head=node('div','ig-profile'),profile=node('div','ig-avatar',initials(k.brand));bar.append(node('b','','Instagram'),node('span','','♡  ⌁'));head.append(profile,node('strong','',handle),node('span','ig-more','•••'));const art=instagramSVG(k,i,kind),visual=node('div','ig-image');visual.append(art);const iconsRow=node('div','ig-icons');['heart','comment','send','save'].forEach(id=>iconsRow.append(igIcon(id)));const caption=socialCaption(k,i),cap=node('div','ig-caption');cap.append(node('strong','',handle+' '),document.createTextNode(caption));phone.append(bar,head,visual,iconsRow,cap,node('div','ig-time','Pratinjau · belum diposting'));const actions=node('div','creative-actions');actions.append(button('⇩ Unduh PNG',()=>savePNG(art,'brandify-instagram-'+(i+1),1080,1350),'button primary small'),button('Salin caption',()=>copy(caption)),button('SVG',()=>saveSVG(art,'brandify-instagram-'+(i+1))));tile.append(node('h4','',title),node('p','',desc),phone,actions);gallery.append(tile);});p.append(gallery,node('p','creative-note','Simulasi tampilan feed, bukan unggahan sungguhan. Pastikan foto milikmu atau berizin dan periksa caption sebelum dipublikasikan.'));
  }

  function card(id){const k=state.kit;const item=tools.find(t=>t[0]===id);const p=node('article','panel result-card'+(state.tab!=='home'?' full':''));p.append(node('span','tag',item[1]+'  '+item[2]));
    if(id==='packaging')productPanel(p,k);
    if(id==='logo')logoPanel(p,k);
    if(id==='social')socialPanel(p,k);
    if(id==='names')namesPanel(p,k);
    if(id==='palette'){p.append(node('h3','','Palet identitas'));const grid=node('div','swatch-grid');k.colors.forEach((c,i)=>{const tile=node('div','swatch');const svg=svgEl('svg',{viewBox:'0 0 100 70','aria-label':c,role:'img',preserveAspectRatio:'none'});svg.append(rect(0,0,100,70,c));tile.append(svg,button(c,()=>copy(c)),node('p','',['Utama','Aksen','Latar','Pendukung','Netral'][i]));grid.append(tile);});p.append(grid,button('Salin semua HEX',()=>copy(k.colors.join(', '))));}
    if(id==='analysis'){p.append(node('h3','','Arah strategi'),node('p','',k.analysis),node('h4','','Gaya komunikasi'),node('p','',k.voice),node('h4','','Tipografi'),node('p','',k.typography));}
    if(id==='guide'){p.append(node('h3','','Panduan identitas merek'),node('p','guide-text',guide(k,state.brief)),button('⇩ Unduh TXT',()=>download(guide(k,state.brief),'brand-guideline.txt','text/plain;charset=utf-8')),button('Cetak / PDF',()=>printGuide()));}
    return p;
  }
  function render(){const target=$('result-content');target.replaceChildren();$('export').disabled=!state.kit||state.busy;$('print').disabled=!state.kit||state.busy;
    if(state.busy){target.append(node('div','panel loading','✦ Sedang menyusun brand kit…'));return;}
    if(!state.kit&&state.tab==='home'){target.append($('sample-preview').content.cloneNode(true));$('results-subtitle').textContent='Buat brand kit untuk melihat hasil milikmu.';return;}
    if(!state.kit){const p=node('div','panel empty');p.append(node('div','empty-icon','✳'),node('h3','','Ide hebat dimulai di sini.'),node('p','','Isi brief merek atau gunakan contoh untuk mencoba semua fitur.'));target.append(p);$('results-subtitle').textContent='Hasil akan muncul setelah brief dibuat.';return;}
    $('results-subtitle').textContent=state.kit.brand+' · '+'Studio lokal · Tanpa API';
    for(const id of state.tab==='home'?tools.map(t=>t[0]):[state.tab])target.append(card(id));
  }
  function printGuide(){if(!state.kit)return;const prior=state.tab;state.tab='guide';render();window.addEventListener('afterprint',()=>{state.tab=prior;render();},{once:true});window.print();}
  function setTab(id,scroll=true){if(id!=='home'&&!tools.some(t=>t[0]===id))id='home';state.tab=id;const t=tools.find(t=>t[0]===id);$('crumb').textContent=t?t[2]:'Ringkasan';$('results-title').textContent=t?t[2]:'Brand kit kamu';$('generate-label').textContent=t?'Buat / perbarui brand kit':'Buat brand kit';document.querySelectorAll('[data-tab]').forEach(el=>{const active=el.dataset.tab===id;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});document.querySelectorAll('[data-tool]').forEach(el=>el.classList.toggle('selected',el.dataset.tool===id));closeMenu();render();if(scroll){if(id==='home')window.scrollTo({top:0,behavior:'smooth'});else $(state.kit?'results':'brief').scrollIntoView({behavior:'smooth'});}}
  function route(id){if(location.hash==='#'+id)setTab(id);else location.hash=id;}
  function closeMenu(){$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}
  for(const [id,icon,title,desc] of tools){const b=button('',()=>route(id),'tool-tile');b.dataset.tool=id;b.append(node('span','tool-icon',icon),node('strong','',title),node('small','',desc));$('tool-grid').append(b);}
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id==='home'||tools.some(t=>t[0]===id))setTab(id);});
  $('menu').addEventListener('click',()=>{const open=$('sidebar').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open));});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});document.addEventListener('click',e=>{if($('sidebar').classList.contains('open')&&!$('sidebar').contains(e.target)&&!$('menu').contains(e.target))closeMenu();});
  $('description').addEventListener('input',updateCounter);
  $('example').addEventListener('click',()=>{setBrief({business:'Bumi Brew',industry:'Kuliner & minuman',audience:'Mahasiswa dan pekerja muda usia 18–30 tahun',personality:'Hangat & natural',description:'Kopi susu gula aren dari biji kopi lokal Indonesia. Kemasan praktis dan harga terjangkau, dengan rasa yang konsisten untuk aktivitas sehari-hari.'});$('form-error').textContent='';toast('Contoh brief dimuat.');});
  $('brief-form').addEventListener('submit',e=>{e.preventDefault();if(state.busy)return;const b=readBrief();if(!validBrief(b)){$('form-error').textContent='Pilih industri, isi target audiens (3–120 karakter) dan cerita usaha (10–500 karakter).';return;}$('form-error').textContent='';state.iteration++;try{const k=demo(b);if(!validKit(k))throw Error('Format hasil tidak valid.');resetProducts();clearPhoto();state.brief=b;state.kit=k;state.source='demo';save();render();toast('Brand kit berhasil dibuat.');$('results').scrollIntoView({behavior:'smooth'});}catch(err){$('form-error').textContent='Gagal membuat brand kit. Coba lagi.';toast('Pembuatan gagal.',true);}});
  $('export').addEventListener('click',()=>{if(state.kit)download(JSON.stringify({brief:state.brief,kit:state.kit,source:state.source,guideline:guide(state.kit,state.brief)},null,2),'brandify-kit.json','application/json');});$('print').addEventListener('click',printGuide);
  $('clear').addEventListener('click',()=>$('clear-dialog').showModal());for(const id of ['close-clear','cancel-clear'])$(id).addEventListener('click',()=>$('clear-dialog').close());$('confirm-clear').addEventListener('click',()=>{try{localStorage.removeItem(storageKey);}catch{}resetProducts();state.kit=null;state.brief=null;state.source=null;clearPhoto();$('brief-form').reset();$('form-error').textContent='';updateCounter();$('clear-dialog').close();render();toast('Data lokal dihapus.');});
  restore();updateCounter();const initial=location.hash.slice(1);setTab(initial,false);
})();
