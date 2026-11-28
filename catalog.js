'use strict';
(() => {
  const tools = [
    ['logo', 'Generator logo', 'Eksplorasi simbol, monogram, dan emblem.', 'Identitas'],
    ['names', 'Nama & slogan', 'Temukan nama, suara, dan karakter huruf.', 'Identitas'],
    ['palette', 'Palet warna', 'Padukan lima warna khas untuk merekmu.', 'Identitas'],
    ['packaging', 'Mockup produk', 'Lihat desain pada kemasan dan merchandise.', 'Aplikasi'],
    ['social', 'Konten Instagram', 'Rancang postingan dan simulasikan feed.', 'Aplikasi'],
    ['analysis', 'Analisis merek', 'Tinjau pesan, audiens, dan arah visual.', 'Identitas']
  ];
  const industries = {
    'Kuliner & minuman': {ends:['Rasa','Brew','Dapur','Saji'], slogans:['Dari rasa, jadi cerita.','Racikan untuk jeda kecilmu.','Satu meja, banyak cerita.','Teman setiap tegukan.'], product:'pouch', marks:[0,1,3,7], tag:'KulinerLokal'},
    'Fashion & aksesori': {ends:['Rupa','Wear','Benang','Mode'], slogans:['Kenakan ceritamu.','Ruang untuk gaya sendiri.','Tiap jahitan punya cerita.','Langkah baru, gaya baru.'], product:'shirt', marks:[6,5,9,8], tag:'GayaLokal'},
    'Kecantikan & perawatan': {ends:['Rona','Sari','Dew','Ritual'], slogans:['Ritual kecil untuk dirimu.','Rawat diri, nikmati jeda.','Sentuhan lembut setiap hari.','Luangkan waktu untuk dirimu.'], product:'pump', marks:[1,3,10,8], tag:'PerawatanDiri'},
    'Kerajinan & dekorasi': {ends:['Ruang','Kriya','Rupa','Studio'], slogans:['Dari tangan, untuk ruangmu.','Detail kecil, cerita panjang.','Ruang yang punya karakter.','Karya yang menemani hari.'], product:'tote', marks:[3,5,2,7], tag:'KriyaLokal'},
    'Teknologi & jasa digital': {ends:['Labs','Sistem','Karya','Digital'], slogans:['Dari ide menjadi nyata.','Buat yang rumit sederhana.','Langkah digitalmu dimulai di sini.','Ide tumbuh bersama.'], product:'box', marks:[4,6,9,5], tag:'KaryaDigital'},
    'Pendidikan & jasa': {ends:['Kelas','Tumbuh','Nalar','Bina'], slogans:['Belajar, tumbuh, berbagi.','Ruang bagi rasa ingin tahu.','Langkah kecil, ilmu baru.','Mulai dari satu pertanyaan.'], product:'tote', marks:[11,2,7,9], tag:'BelajarBersama'},
    'Lainnya': {ends:['Studio','Karya','Ruang','Kolektif'], slogans:['Dibuat dengan sepenuh hati.','Cerita baru setiap hari.','Kenali dari dekat.','Karya yang punya cerita.'], product:'box', marks:[3,2,6,11], tag:'UsahaLokal'}
  };
  const moods = {
    'Hangat & natural': {fonts:[0,3,4], palettes:[0,1,4,7],voice:'Gunakan sapaan akrab dan cerita singkat dari keseharian. Akhiri dengan satu ajakan yang mudah dijawab.'},
    'Modern & minimalis': {fonts:[1,2,0], palettes:[2,4,8,1],voice:'Pilih kalimat pendek, satu manfaat per paragraf, dan ajakan yang langsung.'},
    'Elegan & premium': {fonts:[4,0,1], palettes:[6,3,7,0],voice:'Gunakan kosakata yang tenang dan spesifik. Jelaskan detail bahan atau proses yang benar-benar ada.'},
    'Ceria & berani': {fonts:[5,3,1], palettes:[5,9,3,2],voice:'Gunakan kata kerja aktif, ritme singkat, dan pertanyaan terbuka yang mengundang balasan.'},
    'Profesional & tepercaya': {fonts:[1,0,2], palettes:[8,2,1,6],voice:'Beri penjelasan runtut dan konkret. Sertakan contoh atau bukti yang dapat diperiksa pelanggan.'}
  };
  const fonts = [
    ['Serif editorial','Georgia','Georgia, "Times New Roman", serif',700,'normal','Serif tebal memberi kesan hangat dan berkarakter.'],
    ['Sans modern','Arial','Arial, Helvetica, sans-serif',700,'normal','Bentuk sederhana memudahkan nama terbaca di layar kecil.'],
    ['Mono teknis','Courier New','"Courier New", monospace',700,'normal','Lebar huruf yang seragam memberi ritme terstruktur.'],
    ['Sans humanis','Trebuchet MS','"Trebuchet MS", Verdana, sans-serif',700,'normal','Bentuk huruf terbuka memberi kesan ramah.'],
    ['Serif miring','Georgia Italic','Georgia, "Times New Roman", serif',400,'italic','Garis miring memberi sentuhan personal untuk judul dan slogan.'],
    ['Display tebal','Impact','Impact, "Arial Black", sans-serif',900,'normal','Huruf padat menonjol pada kemasan dan poster singkat.']
  ];
  const paletteList = [
    ['Terakota',['#482D22','#E47D48','#F8EBD6','#927452','#302820']],
    ['Kebun pagi',['#254E3E','#91AD78','#F4EFDA','#C9A477','#20382F']],
    ['Pesisir',['#19475B','#75BABA','#E9F3EF','#DBA668','#213E4B']],
    ['Senja ungu',['#4E385F','#C6A8D5','#F6ECF4','#E9A789','#342839']],
    ['Ruang teduh',['#3F5041','#C3D093','#F4F4E8','#ACB9A5','#26322C']],
    ['Pasar sore',['#633824','#FCAC45','#FFF1D5','#D35F43','#3E3027']],
    ['Arsip klasik',['#313343','#C6AB70','#F5F0E3','#8B8797','#242633']],
    ['Tanah liat',['#703E36','#DB9179','#FFF1E2','#A38360','#3A302D']],
    ['Indigo',['#293B63','#8CAADA','#F0F2F7','#B7A07F','#232D41']],
    ['Jambu',['#784454','#ECA3AA','#FBF1DE','#94AA78','#452B35']]
  ];
  const roles = ['Utama','Aksen','Latar','Pendukung','Teks'];
  const products = {pouch:'Pouch',cup:'Gelas',box:'Kotak',shirt:'Kaus',tote:'Tote bag',pump:'Botol pump'};
  const treatments = ['Sablon','Label warna','Stempel'];
  const logoStyles = ['Simbol & nama','Wordmark','Monogram','Emblem','Logo horizontal','Lencana'];
  const roots = ['Aruna','Loka','Sela','Raya','Pijar','Aksa','Nusa','Karsa','Bumi','Rona','Temu','Naraya','Kala','Nala','Ramu','Teras','Bayu'];
  const socialThemes = ['Perkenalan merek','Sorotan produk','Ajakan interaksi'];
  const defaultBrief = {name:'Bumi Brew',slogan:'Dari rasa, jadi cerita.',industry:'Kuliner & minuman',mood:'Hangat & natural',audience:'Mahasiswa dan pekerja muda pencinta kopi lokal',story:'Kopi susu gula aren dari biji kopi lokal Indonesia. Diseduh untuk menemani jeda di tengah aktivitas sehari-hari.'};
  const bounds = {name:[2,60],slogan:[3,100],audience:[3,120],story:[10,450]};
  const index = (value,length,otherwise=0) => Number.isInteger(value) && value>=0 && value<length ? value : otherwise;
  const validText = (v,min,max) => typeof v==='string' && v.trim().length>=min && v.length<=max && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/u.test(v);
  const has = (obj,key) => typeof key==='string' && Object.hasOwn(obj,key);
  function validBrief(b) {
    return !!b && Object.entries(bounds).every(([key,[min,max]])=>validText(b[key],min,max)) && has(industries,b.industry) && has(moods,b.mood);
  }
  function baseState() {
    return {brief:{...defaultBrief},font:0,palette:0,logo:0,mark:0,logoRound:0,nameRound:0,paletteRound:0,postRound:0,product:'pouch',treatment:0};
  }
  function loadState() {
    const clean=baseState();
    try {
      const raw=localStorage.getItem('brandify.demo.v5');
      if (!raw) {
        const legacy=localStorage.getItem('brandify-studio-v1');
        if (!legacy || legacy.length>45000) return clean;
        const old=JSON.parse(legacy), b=old.brief, k=old.kit;
        if (!b || !k) return clean;
        const brief={name:k.brand,slogan:k.slogan,industry:b.industry==='Kecantikan & kesehatan'?'Kecantikan & perawatan':b.industry,mood:b.personality,audience:b.audience,story:typeof b.description==='string'?b.description.slice(0,450):''};
        if (validBrief(brief)) Object.assign(clean,{brief,logo:index(k.logoChoice,6),product:industries[brief.industry].product,font:moods[brief.mood].fonts[0],palette:moods[brief.mood].palettes[0]});
        return clean;
      }
      if (raw.length>14000) return clean;
      const s=JSON.parse(raw);
      if (!validBrief(s?.brief)) return clean;
      clean.brief=Object.fromEntries(Object.keys(defaultBrief).map(k=>[k,s.brief[k]]));
      for (const [k,n] of [['font',fonts.length],['palette',paletteList.length],['logo',6],['mark',12],['treatment',3],['logoRound',1000],['nameRound',1000],['paletteRound',1000],['postRound',1000]]) clean[k]=index(s[k],n);
      if (has(products,s.product)) clean.product=s.product;
    } catch { /* Penyimpanan privat bisa tidak tersedia. */ }
    return clean;
  }
  function saveState(s) {try{localStorage.setItem('brandify.demo.v5',JSON.stringify(s));return true;}catch{return false;}}
  function hash(text) {let h=2166136261;for(const c of text) h=Math.imul(h^c.codePointAt(0),16777619);return h>>>0;}
  function initials(value) {
    const words=value.match(/[\p{L}\p{N}]+/gu) || [];
    return words.slice(0,2).map(word=>[...word][0]).join('').toLocaleUpperCase('id') || 'BR';
  }
  function handle(name) {return name.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/gu,'').replace(/[^a-z0-9_.]/gu,'').slice(0,22)||'mereklokal';}
  function names(s) {
    const b=s.brief, category=industries[b.industry], mood=moods[b.mood];
    const seed=hash(b.industry+b.mood+b.audience+b.story);
    return [0,1,2].map(i=>({
      name:roots[(seed+s.nameRound*3+i*5)%roots.length]+' '+category.ends[(seed+s.nameRound+i)%category.ends.length],
      slogan:category.slogans[(seed+s.nameRound+i)%category.slogans.length],
      font:mood.fonts[(i+s.nameRound)%mood.fonts.length]
    }));
  }
  function palettes(s) {
    const preferred=moods[s.brief.mood].palettes;
    const rest=paletteList.map((_,i)=>i).filter(i=>!preferred.includes(i));
    const pool=[...preferred,...rest];
    return [0,1,2].map(i=>pool[(s.paletteRound*3+i)%pool.length]);
  }
  function markFor(s,i) {
    const group=industries[s.brief.industry].marks;
    return (group[i%group.length]+Math.floor(i/group.length)*3+s.logoRound*2)%12;
  }
  const headlines=[
    ['Kenalan, yuk.','Cerita di balik merek','Salam dari kami'],
    ['Pilihan hari ini','Dari dekat','Detail pilihan'],
    ['Ceritakan versimu.','Apa pilihanmu?','Yuk, berbagi cerita.']
  ];
  function postInfo(s,i) {
    const b=s.brief, headline=headlines[i][s.postRound%3];
    const intros=[['Kenalan dengan '+b.name+'.','Sapa hangat dari '+b.name+'.','Cerita kami bermula di sini.'],['Lihat lebih dekat pilihan dari '+b.name+'.','Ada cerita di setiap detail.','Kenali produk kami dari dekat.'],['Apa yang paling kamu cari dari '+b.industry.toLowerCase()+'?','Kalau boleh memilih, detail apa yang paling penting buatmu?','Apa yang ingin kamu ketahui tentang '+b.name+'?']];
    const body=[b.story,b.story,'Kami merancang '+b.name+' untuk '+b.audience+'.'][i];
    const cta=['Simpan postingan ini untuk mengenal kami lebih dekat.','Kirim pesan kalau kamu ingin tahu detailnya.','Tulis pendapatmu di kolom komentar.'][i];
    const tags='#'+industries[b.industry].tag+' #UMKMIndonesia #BrandLokal';
    return {theme:socialThemes[i],headline,cta,caption:intros[i][s.postRound%3]+' '+body+'\n\n'+(i===0?b.slogan+' ':'')+cta+'\n\n'+tags};
  }
  function luminance(hex) {
    const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
  }
  function contrast(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function ink(bg) {return contrast(bg,'#241F1B')>=contrast(bg,'#FFFCF5')?'#241F1B':'#FFFCF5';}
  function analysis(s) {
    const b=s.brief,c=paletteList[s.palette][1],ratio=contrast(c[2],c[4]);
    const words=v=>v.trim().split(/\s+/u).length;
    return {ratio,checks:[
      ['Nama merek',words(b.name)<=4,'Nama terdiri dari '+words(b.name)+' kata. Target praktis studio ini empat kata atau kurang.'],
      ['Slogan',words(b.slogan)<=10,'Slogan terdiri dari '+words(b.slogan)+' kata. Baca keras-keras untuk menilai ritme dan daya ingatnya.'],
      ['Audiens',words(b.audience)>=4,'Audiens yang kamu tulis adalah '+b.audience+'. Sebut kebutuhan atau situasi pembelian mereka.'],
      ['Kontras teks',ratio>=4.5,'Warna teks '+c[4]+' pada latar '+c[2]+' memiliki rasio '+ratio.toFixed(2).replace('.',',')+'∶1. Target pemeriksaan teks biasa 4,5∶1.']
    ],position:b.name+' hadir untuk '+b.audience+'. '+b.story,voice:moods[b.mood].voice};
  }
  window.BrandifyCatalog=Object.freeze({tools,industries,moods,fonts,paletteList,roles,products,treatments,logoStyles,socialThemes,defaultBrief,bounds,validBrief,baseState,loadState,saveState,initials,handle,names,palettes,markFor,postInfo,ink,analysis});
})();

