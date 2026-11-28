'use strict';
(() => {
  const C=window.BrandifyCatalog;
  const ns='http://www.w3.org/2000/svg';
  const measure=document.createElement('canvas').getContext('2d');
  const imageCache=new Map();
  let clipSerial=0;
  const systemSans='Arial, Helvetica, sans-serif';
  function el(tag,attrs={},content) {
    const n=document.createElementNS(ns,tag);
    for(const [key,val] of Object.entries(attrs)) n.setAttribute(key,String(val));
    if(content!==undefined) n.textContent=String(content);
    return n;
  }
  function root(w,h,label) {
    return el('svg',{viewBox:'0 0 '+w+' '+h,width:w,height:h,class:'art',role:'img','aria-label':label,preserveAspectRatio:'xMidYMid meet'});
  }
  const rect=(x,y,w,h,fill,rx=0)=>el('rect',{x,y,width:w,height:h,fill,rx});
  const circle=(cx,cy,r,fill)=>el('circle',{cx,cy,r,fill});
  function type(parent,value,x,y,size,color,options={}) {
    const {family=systemSans,weight=400,style='normal',anchor='start',width=9999,spacing=0}=options;
    const content=String(value);
    measure.font=style+' '+weight+' '+size+'px '+family;
    const wanted=measure.measureText(content).width+Math.max(0,content.length-1)*spacing;
    const scaled=Math.min(1,width/Math.max(1,wanted));
    const n=el('text',{x,y,fill:color,'font-family':family,'font-weight':weight,'font-style':style,'font-size':size*scaled,'text-anchor':anchor,'letter-spacing':spacing*scaled},content);
    parent.append(n);return n;
  }
  function lines(parent,value,x,y,width,size,leading,color,limit=3) {
    measure.font='400 '+size+'px '+systemSans;
    const words=value.split(/\s+/u);
    const list=[];let line='';
    for(const word of words){
      const next=line?line+' '+word:word;
      if(line && measure.measureText(next).width>width){list.push(line);line=word;}
      else line=next;
    }
    if(line) list.push(line);
    list.slice(0,limit).forEach((l,i)=>type(parent,l+(i===limit-1&&list.length>limit?'…':''),x,y+i*leading,size,color,{width}));
  }
  function nested(parent,child,x,y,w,h) {
    for(const [k,v] of Object.entries({x,y,width:w,height:h})) child.setAttribute(k,v);
    parent.append(child);return child;
  }
  const marks=[
    'M47 68C27 48 31 17 60 6C80 22 75 53 51 69C55 53 58 34 65 23C54 35 49 50 47 68ZM4 52C32 50 48 66 50 98C24 87 8 80 4 52ZM51 98C52 69 70 53 97 51C92 79 74 91 51 98Z',
    'M11 78C4 35 33 10 88 10C88 58 63 89 25 85L66 32C46 49 28 66 11 78Z',
    'M50 2 59 30 82 13 72 40 99 45 74 57 88 82 61 70 51 99 41 72 15 86 28 60 1 49 30 40 17 14 40 30Z',
    'M50 49C17 49 10 41 11 27C13 7 36 4 50 35C50 7 68-3 81 10C94 23 84 41 63 50C96 48 105 70 88 83C75 95 58 78 52 65C53 92 39 106 23 92C10 81 18 60 37 53C15 63 0 62 4 48C7 36 24 39 50 49Z',
    'M49 3 96 30V70L51 97 6 71V31ZM50 20 22 37 50 54 78 37ZM20 49V64L44 79V64ZM56 64V80L82 65V49Z',
    'M4 18H33L72 82H42ZM34 18H61L99 82H73ZM6 82 21 56 37 82Z',
    'M14 6H61C94 6 100 42 78 53C100 70 86 96 59 96H14ZM37 26V44H58C72 44 73 26 58 26ZM37 62V77H59C72 77 72 62 58 62Z',
    'M4 53Q27 26 50 45T96 36V53Q73 79 50 62T4 72ZM4 76Q27 49 50 68T96 59V73Q73 99 50 83T4 94Z',
    'M50 3 59 36 93 49 59 59 50 95 40 59 6 49 41 38Z',
    'M3 4H45V46H3ZM53 4H96V46H53ZM3 54H45V96H3ZM54 96V54H96Z',
    'M5 63C5 31 25 7 50 2C77 10 96 35 96 63L73 63C73 44 63 29 50 22C36 30 28 45 28 63ZM11 70H89V80H11ZM22 87H78V96H22Z',
    'M4 83 31 20 49 54 65 4 97 83H74L66 58 57 83H39L31 61 22 83Z'
  ];
  function mark(parent,index,x,y,size,color) {
    parent.append(el('path',{d:marks[index]||marks[0],fill:color,'fill-rule':'evenodd',transform:'translate('+x+' '+y+') scale('+size/100+')'}));
  }
  function fontOptions(s) {const f=C.fonts[s.font];return {family:f[2],weight:f[3],style:f[4]};}
  function lock(parent,s,style,shape,ink,accent) {
    const b=s.brief, f=fontOptions(s);
    const center={...f,anchor:'middle'};
    if(style===0) {
      mark(parent,shape,217,12,86,ink);
      type(parent,b.name,260,153,65,ink,{...center,width:480});
      type(parent,b.slogan,260,191,18,ink,{anchor:'middle',width:420,spacing:.4});
    } else if(style===1) {
      type(parent,b.name,260,126,91,ink,{...center,width:482});
      parent.append(rect(205,147,110,5,accent,2));
      type(parent,b.slogan,260,185,19,ink,{anchor:'middle',width:435,spacing:1.1});
    } else if(style===2) {
      const g=el('g',{transform:'rotate(-6 260 88)'});g.append(rect(199,27,122,116,ink,22));
      type(g,C.initials(b.name),260,111,68,C.ink(ink),{...center,width:107});parent.append(g);
      type(parent,b.name,260,188,45,ink,{...center,width:454});
    } else if(style===3) {
      parent.append(el('ellipse',{cx:260,cy:111,rx:157,ry:95,fill:'none',stroke:ink,'stroke-width':3}),
        el('ellipse',{cx:260,cy:111,rx:146,ry:85,fill:'none',stroke:ink,'stroke-width':1.2,'stroke-dasharray':'2 5'}));
      mark(parent,shape,237,34,46,ink);
      type(parent,b.name,260,130,46,ink,{...center,width:265});
      type(parent,b.slogan,260,158,13,ink,{anchor:'middle',width:218});
    } else if(style===4) {
      mark(parent,shape,18,64,93,ink);parent.append(rect(129,56,3,109,accent));
      type(parent,b.name,153,116,61,ink,{...f,width:349});
      type(parent,b.slogan,154,148,17,ink,{width:342});
    } else {
      parent.append(el('path',{d:'M260 6 329 38 329 107 260 139 191 107 191 38Z',fill:ink}));
      mark(parent,shape,225,34,70,C.ink(ink));
      type(parent,b.name,260,183,47,ink,{...center,width:460});
      type(parent,b.slogan,260,207,15,ink,{anchor:'middle',width:404});
    }
  }
  function logo(s,style=s.logo,shape=s.mark,transparent=false) {
    const c=C.paletteList[s.palette][1], bg=[c[2],c[0],c[3],c[1],c[2],c[0]][style];
    const ink=transparent?c[0]:C.ink(bg), accent=transparent?c[0]:ink;
    const svg=root(520,228,C.logoStyles[style]+' — '+s.brief.name);
    if(!transparent) svg.append(rect(0,0,520,228,bg));
    lock(svg,s,style,shape,ink,accent);return svg;
  }
  const plate={
    pouch:[490,554,470,-.005],cup:[497,566,361,-.006],box:[447,554,438,.035],
    shirt:[505,428,462,.014],tote:[502,660,472,-.015],pump:[502,645,318,-.008]
  };
  const fileFor=key=>'./assets/'+key+'.webp';
  const photo=(href,x,y,w,h)=>el('image',{href,x,y,width:w,height:h,preserveAspectRatio:'xMidYMid slice'});
  function mockup(s,kind=s.product,finish=s.treatment,back=false) {
    const svg=root(1000,1000,'Mockup '+C.products[kind]+' dengan logo '+s.brief.name);
    const rear=back && kind==='shirt';
    svg.append(photo(fileFor(rear?'shirt-back':kind),0,0,1000,1000));
    const [cx,cy,width,tilt]=rear?[500,490,555,0]:plate[kind],c=C.paletteList[s.palette][1];
    const g=el('g',{transform:'translate('+cx+' '+cy+') matrix(1 '+tilt+' 0 1 0 0) scale('+width/520+') translate(-260 -114)'});
    g.setAttribute('opacity',(kind==='shirt' || kind==='tote') ? 0.91 : 0.97);
    const ink=finish===1?C.ink(c[0]):c[0];
    if(finish===1) {
      g.append(rect(0,-9,520,244,c[0],17),rect(15,5,490,4,c[1],2));
    }
    if(finish===2) {
      g.append(el('rect',{x:4,y:0,width:512,height:224,rx:55,fill:'none',stroke:c[0],'stroke-width':4,'stroke-dasharray':'6 4'}));
    }
    lock(g,s,s.logo,s.mark,ink,ink);svg.append(g);return svg;
  }
  function board(s) {
    const b=s.brief, c=C.paletteList[s.palette][1], isShirt=s.product==='shirt';
    const sheet=root(1440,1000,'Papan presentasi '+C.products[s.product]+' — '+b.name);
    sheet.append(rect(0,0,1440,1000,c[2]));
    const onPaper=C.ink(c[2]);
    type(sheet,'MOCKUP PRODUK',58,72,20,onPaper,{weight:700,spacing:3});
    type(sheet,b.name,55,167,90,c[0],{...fontOptions(s),width:910});
    type(sheet,C.products[s.product]+' / '+C.treatments[s.treatment],1383,144,27,onPaper,{anchor:'end',width:380});
    sheet.append(rect(58,206,1324,2,c[0]));
    const leftX=60,rightX=745,w=632,top=232;
    if(isShirt) nested(sheet,mockup(s),leftX,top,w,w);
    else {
      sheet.append(rect(leftX,top,w,w,c[1]));
      const glyph=root(520,228,'Desain cetak');lock(glyph,s,s.logo,s.mark,C.ink(c[1]),C.ink(c[1]));
      nested(sheet,glyph,leftX+28,top+160,w-56,280);
      type(sheet,b.slogan,leftX+32,top+w-52,31,C.ink(c[1]),{width:w-64});
    }
    nested(sheet,mockup(s,s.product,s.treatment,isShirt),rightX,top,w,w);
    type(sheet,isShirt?'Tampak depan':'Identitas cetak',leftX,920,27,onPaper,{weight:700});
    type(sheet,isShirt?'Tampak belakang':'Aplikasi pada produk',rightX,920,27,onPaper,{weight:700});
    type(sheet,C.paletteList[s.palette][0],leftX,964,21,onPaper);
    const chips=root(200,34,'Warna merek');
    c.forEach((v,i)=>chips.append(rect(i*40,0,40,34,v)));
    nested(sheet,chips,1177,930,200,34);return sheet;
  }
  function isCampaign(s) {
    return s.brief.name===C.defaultBrief.name && s.brief.slogan===C.defaultBrief.slogan && s.brief.industry===C.defaultBrief.industry && s.logo===0 && s.mark===0 && s.font===0 && s.palette===0 && s.product==='pouch' && s.treatment===0;
  }
  function coverGroup(parent,x,y,w,h) {
    const id='bf-mask-'+(++clipSerial);
    const defs=el('defs'),clip=el('clipPath',{id});clip.append(rect(x,y,w,h,'white'));defs.append(clip);
    const group=el('g',{'clip-path':'url(#'+id+')'});parent.append(defs,group);return group;
  }
  function productPhoto(parent,s,uploaded,x,y,w,h,kind=s.product,back=false) {
    if(uploaded) {parent.append(photo(uploaded,x,y,w,h));return;}
    const clipped=coverGroup(parent,x,y,w,h);
    const size=Math.max(w,h);
    nested(clipped,mockup(s,kind,s.treatment,back),x+(w-size)/2,y+(h-size)/2,size,size);
  }
  function post(s,i,uploaded='') {
    const b=s.brief,c=C.paletteList[s.palette][1],fg=C.ink(c[0]), onPaper=C.ink(c[2]),info=C.postInfo(s,i);
    const svg=root(1080,1350,info.theme+' — desain Instagram '+b.name),f=fontOptions(s);
    const left=70;
    svg.append(rect(0,0,1080,1350,c[2]));
    const layout=(i+s.postRound)%3, label=info.theme.toLocaleUpperCase('id');
    if(layout===0){
      type(svg,label,left,93,23,onPaper,{weight:700,spacing:4});
      mark(svg,s.mark,941,48,65,c[0]);
      type(svg,b.name,left,235,135,c[0],{...f,width:940});
      type(svg,b.slogan,left,310,44,onPaper,{width:940});
      if(!uploaded && isCampaign(s)) svg.append(photo(fileFor('bumi-brew'),0,378,1080,750));
      else productPhoto(svg,s,uploaded,0,378,1080,750);
      svg.append(rect(0,1127,1080,223,c[0]));
      type(svg,info.headline,left,1240,75,fg,{...f,width:910});
      type(svg,'@'+C.handle(b.name),left,1303,23,fg,{spacing:1});
    } else if(layout===1) {
      productPhoto(svg,s,uploaded,0,0,1080,795);
      svg.append(rect(0,795,1080,555,c[0]),rect(68,858,98,7,c[1],3));
      type(svg,label,left,936,25,fg,{weight:700,spacing:4});
      type(svg,info.headline,left,1062,92,fg,{...f,width:940});
      type(svg,b.name,left,1142,52,fg,{...f,width:920});
      type(svg,b.slogan,left,1218,31,fg,{width:930});
      type(svg,'@'+C.handle(b.name),left,1295,23,fg,{spacing:1});
    } else {
      const accentInk=C.ink(c[1]);
      svg.append(rect(0,0,1080,1350,c[1]));
      type(svg,label,left,98,23,accentInk,{spacing:4,weight:700});
      type(svg,info.headline,left,229,113,accentInk,{...f,width:940});
      type(svg,b.name,left,310,43,accentInk,{width:930});
      productPhoto(svg,s,uploaded,70,380,940,643,isCampaign(s)?'cup':s.product,s.product==='shirt');
      svg.append(rect(0,1090,1080,260,c[2]));
      mark(svg,s.mark,70,1147,86,c[0]);
      lines(svg,'Apa yang paling kamu cari dari '+b.industry.toLowerCase()+'?',196,1189,809,42,48,onPaper,2);
      type(svg,'@'+C.handle(b.name),196,1297,22,onPaper,{spacing:.8});
    }
    return svg;
  }
  function swatches(colors,w=500,h=95) {
    const svg=root(w,h,'Palet '+colors.join(', '));
    colors.forEach((v,i)=>svg.append(rect(i*w/colors.length,0,w/colors.length+0.02,h,v)));
    return svg;
  }
  function loadImage(uri) {
    return new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Gambar gagal dibuka.'));img.src=uri;
    });
  }
  async function embedPhoto(path) {
    if(path.startsWith('data:image/')) return path;
    if(!imageCache.has(path)) {
      const task=loadImage(path).then(img=>{
        const cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;
        cv.getContext('2d').drawImage(img,0,0);
        return cv.toDataURL('image/jpeg',.95);
      }).catch(e=>{imageCache.delete(path);throw e;});
      imageCache.set(path,task);
    }
    return imageCache.get(path);
  }
  async function portable(svg,width,height) {
    const copy=svg.cloneNode(true);copy.setAttribute('width',width);copy.setAttribute('height',height);
    const imgs=Array.from(copy.querySelectorAll('image'));
    await Promise.all(imgs.map(async img=>{img.setAttribute('href',await embedPhoto(img.getAttribute('href')));}));
    return copy;
  }
  async function artBlob(svg,format,width,height) {
    const clean=await portable(svg,width,height);
    const raw=new XMLSerializer().serializeToString(clean);
    const blob=new Blob([raw],{type:'image/svg+xml;charset=utf-8'});
    if(format==='svg') return blob;
    const url=URL.createObjectURL(blob);
    try{
      const img=await loadImage(url),cv=document.createElement('canvas');
      cv.width=width;cv.height=height;cv.getContext('2d').drawImage(img,0,0,width,height);
      return await new Promise((resolve,reject)=>cv.toBlob(b=>b?resolve(b):reject(new Error('Ekspor PNG gagal.')),'image/png'));
    } finally {URL.revokeObjectURL(url);}
  }
  function photoSize(bytes) {
    const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    const tag=off=>String.fromCharCode(...bytes.subarray(off,off+4));
    const u24=off=>bytes[off]+(bytes[off+1]<<8)+(bytes[off+2]<<16);
    if(bytes.length>=24 && tag(0)==='\x89PNG' && dv.getUint32(4)===0x0d0a1a0a && tag(12)==='IHDR') {
      return ['image/png',dv.getUint32(16),dv.getUint32(20)];
    }
    if(bytes.length>=30 && tag(0)==='RIFF' && tag(8)==='WEBP'){
      for(let p=12;p+8<=bytes.length;){
        const n=dv.getUint32(p+4,true),d=p+8;
        if(d+n>bytes.length) break;
        if(tag(p)==='VP8X'&&n>=10) return ['image/webp',u24(d+4)+1,u24(d+7)+1];
        if(tag(p)==='VP8 '&&n>=10 && bytes[d+3]===157 && bytes[d+4]===1 && bytes[d+5]===42) return ['image/webp',dv.getUint16(d+6,true)&16383,dv.getUint16(d+8,true)&16383];
        if(tag(p)==='VP8L'&&n>=5&&bytes[d]===47){const bits=dv.getUint32(d+1,true);return ['image/webp',(bits&16383)+1,((bits>>>14)&16383)+1];}
        p=d+n+(n%2);
      }
    }
    if(bytes[0]===255&&bytes[1]===216){
      for(let p=2;p+4<bytes.length;){
        if(bytes[p++]!==255) break;
        while(bytes[p]===255) p++;
        const kind=bytes[p++];
        if(kind===217||kind===218||p+2>bytes.length) break;
        if(kind===1||(kind>=208&&kind<=215)) continue;
        const n=dv.getUint16(p);
        if(n<2||p+n>bytes.length) break;
        if(kind>=192&&kind<=207&&![196,200,204].includes(kind)&&n>=8) return ['image/jpeg',dv.getUint16(p+5),dv.getUint16(p+3)];
        p+=n;
      }
    }
    return ['',0,0];
  }
  async function readPhoto(file) {
    if(!file || !file.size || file.size>5*1024*1024) throw new Error('Pilih foto JPG, PNG, atau WebP hingga 5 MB.');
    const bytes=new Uint8Array(await file.arrayBuffer());
    const [mime,width,height]=photoSize(bytes);
    if(!mime || (file.type && mime!==file.type)) throw new Error('Format foto tidak dikenali. Gunakan JPG, PNG, atau WebP.');
    if(!width || !height || width*height>24000000 || Math.max(width,height)>16384) throw new Error('Resolusi maksimum foto adalah 24 megapiksel dengan sisi terpanjang 16.384 piksel.');
    const url=URL.createObjectURL(file);
    try{
      const img=await loadImage(url),w=img.naturalWidth,h=img.naturalHeight;
      if(!w||!h||w*h>24000000) throw new Error('Resolusi maksimum foto adalah 24 megapiksel.');
      const ratio=Math.min(1,1500/Math.max(w,h));
      const cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(w*ratio));cv.height=Math.max(1,Math.round(h*ratio));
      const ctx=cv.getContext('2d');ctx.fillStyle='#fff9ef';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0,cv.width,cv.height);
      return cv.toDataURL('image/jpeg',.89);
    } finally {URL.revokeObjectURL(url);}
  }
  window.BrandifyArt=Object.freeze({el,root,rect,logo,mockup,board,post,swatches,mark,isCampaign,fileFor,artBlob,portable,readPhoto});
})();

