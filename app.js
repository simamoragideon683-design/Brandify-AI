'use strict';
(() => {
  const C=window.BrandifyCatalog, A=window.BrandifyArt;
  const byId=id=>document.getElementById(id);
  const state=C.loadState();
  const view=byId('view'), modal=byId('modal'), drawer=byId('drawer');
  const routes={
    home:['Ringkasan','Studio merek','Kelola identitas, produk, dan konten kreatif merekmu.'],
    brief:['Brief merek','Brief merek','Ceritakan usahamu agar rekomendasi studio sesuai dengan merekmu.'],
    logo:['Generator logo','Generator logo','Eksplorasi bentuk, pilih identitas, lalu unduh logo transparan.'],
    names:['Nama & slogan','Nama & slogan','Padukan nama usaha, slogan, dan gaya huruf yang serasi.'],
    palette:['Palet warna','Palet warna','Pilih kombinasi warna untuk logo, kemasan, dan konten merekmu.'],
    packaging:['Mockup produk','Mockup produk','Terapkan identitas merek pada kemasan dan merchandise.'],
    social:['Konten Instagram','Studio Instagram','Lihat tampilan postingan dan profil sebelum mengunduh desain.'],
    analysis:['Analisis merek','Analisis identitas merek','Tinjau pesan dan keterbacaan identitas berdasarkan brief aktif.'],
    guide:['Panduan merek','Panduan merek','Satu panduan untuk memakai identitas merek secara konsisten.']
  };
  let page='home',filter='Semua alat',socialView='Feed',mockView='Produk',photo='',photoVersion=0,toastTimer;
  const freshSocial=()=>Array.from({length:3},()=>({like:false,saved:false,comments:[]}));
  let activity=freshSocial();
  const node=(tag,cls='',value)=>{
    const e=document.createElement(tag);
    if(cls) e.className=cls;
    if(value!==undefined) e.textContent=value;
    return e;
  };
  function icon(name){
    const svg=A.el('svg',{class:'ico','aria-hidden':'true'});svg.append(A.el('use',{href:'#i-'+name}));return svg;
  }
  function control(tag,label,cls,ic) {
    const e=node(tag,cls);
    if(ic) e.append(icon(ic));
    if(label) e.append(node('span','',label));
    return e;
  }
  function button(label,fn,cls='btn',ic='',key='') {
    const b=control('button',label,cls,ic);b.type='button';
    if(key) b.dataset.key=key;
    b.addEventListener('click',async()=>{
      try {await fn(b);} catch {notify('Operasi gagal. Silakan coba lagi.',true);}
    });
    return b;
  }
  function link(label,target,cls='btn',ic='') {
    const a=control('a',label,cls,ic);a.href='#'+target;return a;
  }
  function image(path,alt,cls='') {const img=node('img',cls);img.src=path;img.alt=alt;img.decoding='async';return img;}
  function iconButton(label,ic,fn,cls='') {
    const b=button('',fn,'icon-button '+cls,ic);b.setAttribute('aria-label',label);b.title=label;return b;
  }
  function notify(message,bad=false) {
    const t=byId('toast');clearTimeout(toastTimer);t.textContent=message;t.classList.toggle('bad',bad);t.hidden=false;
    toastTimer=setTimeout(()=>{t.hidden=true;},3600);
  }
  function persist(message) {
    const ok=C.saveState(state);
    if(message || !ok) notify(ok?message:'Perubahan berlaku untuk sesi ini. Penyimpanan perangkat tidak tersedia.',!ok);
  }
  function rerender(key='') {
    const prev=key || document.activeElement?.dataset?.key;
    render();
    if(prev) Array.from(document.querySelectorAll('[data-key]')).find(el=>el.dataset.key===prev)?.focus({preventScroll:true});
  }
  function commit(change,message,resetSocial=false) {
    Object.assign(state,change);
    if(resetSocial) activity=freshSocial();
    persist(message);rerender();
  }
  function nextRound(field,message) {
    commit({[field]:(state[field]+1)%999},message,field==='postRound');
  }
  function closeDialogs(){if(modal.open) modal.close();if(drawer.open) drawer.close();}
  function openModal(title,content) {
    if(drawer.open) drawer.close();
    byId('modal-title').textContent=title;byId('modal-body').replaceChildren(content);
    if(!modal.open) modal.showModal();
  }
  function savedLabel(){const b=node('span','active-label','Terpilih');b.prepend(icon('check'));return b;}
  function sectionTitle(title,description='') {
    const bar=node('div','section-head'),copy=node('div');
    copy.append(node('h2','',title));if(description) copy.append(node('p','sub',description));bar.append(copy);return bar;
  }
  function intro(title,action) {
    const bar=node('div','tool-intro');bar.append(node('strong','',title));if(action) bar.append(action);return bar;
  }
  function segment(labels,current,onChange,aria,icons=[]) {
    const bar=node('div','segmented');bar.setAttribute('role','group');bar.setAttribute('aria-label',aria);
    labels.forEach((label,i)=>{
      const b=button(label,()=>onChange(label,i),'',icons[i]||'',aria+'-'+i);b.setAttribute('aria-pressed',String(label===current));bar.append(b);
    });return bar;
  }
  function saveBlob(blob,name) {
    const url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=name;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  const stem=()=>C.handle(state.brief.name);
  function downloadArt(label,get,format,width,height,part,primary=false) {
    return button(label,async b=>{
      b.disabled=true;b.setAttribute('aria-busy','true');const name=stem()+'-'+part+'.'+format;
      try{const blob=await A.artBlob(get(),format,width,height);saveBlob(blob,name);notify('Berkas '+format.toUpperCase()+' siap diunduh.');}
      catch{notify('Gambar gagal diekspor. Buka studio melalui pratinjau web atau HTTPS.',true);}
      finally{b.disabled=false;b.removeAttribute('aria-busy');}
    },primary?'btn dark':'btn slim',format==='png'?'down':'file');
  }
  async function copyText(value) {
    try {await navigator.clipboard.writeText(value);notify('Teks berhasil disalin.');}
    catch {
      const t=node('textarea','comment-input');t.value=value;t.readOnly=true;t.rows=5;t.setAttribute('aria-label','Teks untuk disalin');
      openModal('Salin teks',t);t.focus();t.select();
      try{if(document.execCommand('copy')){modal.close();notify('Teks berhasil disalin.');}}catch{/* Kolom terpilih tetap tersedia untuk salin manual. */}
    }
  }
  function updateChrome() {
    const [crumb,title,desc]=routes[page];byId('crumb').textContent=crumb;byId('page-title').textContent=title;
    if(page==='home') byId('page-title').append(node('span','title-dot','.'));
    byId('page-desc').textContent=desc;document.title=title+' · Brandify AI';
    document.querySelectorAll('[data-brand]').forEach(e=>e.textContent=state.brief.name);
    document.querySelectorAll('[data-initials]').forEach(e=>e.textContent=C.initials(state.brief.name));
    document.querySelectorAll('[data-route]').forEach(e=>{
      if(e.dataset.route===page) e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');
    });
    const actions=byId('page-actions');actions.replaceChildren();
    if(page==='guide') {
      const row=node('div','buttons');
      row.append(button('Cetak / PDF',()=>window.print(),'btn','print'),button('Unduh panduan',exportGuide,'btn dark','down'));actions.append(row);
    } else actions.append(link('Ekspor panduan','guide','btn','down'));
  }

  function hero() {
    const wrap=node('section','hero'),copy=node('div','hero-copy'),flag=node('span','hero-eyebrow','Proyek aktif');
    flag.prepend(node('i'));copy.append(flag,node('h2','',state.brief.name),node('p','',state.brief.slogan));
    const row=node('div','hero-actions'),edit=link('Edit brief','brief','btn hero-btn','edit'),id=link('Lihat identitas','logo','hero-secondary');id.append(icon('arrow'));row.append(edit,id);copy.append(row);
    const art=node('div','hero-photo');
    if(A.isCampaign(state)) art.append(image(A.fileFor('bumi-brew'),'Kampanye Bumi Brew dengan pouch kopi dan gelas bermerek'));
    else {const mock=A.mockup(state);mock.setAttribute('preserveAspectRatio','xMidYMid slice');art.append(mock);}
    const photoLink=link('Lihat mockup','packaging','photo-link');photoLink.append(icon('external'));art.append(photoLink);
    wrap.append(copy,art);return wrap;
  }
  function tileArt(id) {
    const block=node('div','tool-visual');block.setAttribute('aria-hidden','true');
    if(['logo','names','palette','analysis'].includes(id)) block.append(image('./assets/tile-'+id+'.svg',''));
    if(id==='packaging') {
      block.classList.add('tile-pack');
      for(const kind of ['shirt','tote']){const mock=A.mockup(state,kind,0);mock.setAttribute('preserveAspectRatio','xMidYMid slice');block.append(mock);}
    }
    if(id==='social') {
      block.classList.add('tile-campaign');
      const one=node('div','mini-print a'),two=node('div','mini-print b');
      one.append(node('b','','Bumi Brew'),image(A.fileFor('bumi-brew'),''),icon('heart'));
      two.append(image(A.fileFor('cup'),''),node('b','','Jeda sejenak.'),icon('heart'));block.append(one,two);
    }
    return block;
  }
  function home() {
    view.append(hero());
    const bar=sectionTitle('Alat kreatif');
    bar.append(segment(['Semua alat','Identitas','Aplikasi'],filter,v=>{filter=v;rerender();},'Filter alat'));
    view.append(bar);
    const cards=node('div','tool-grid');
    for(const [id,title,desc,group] of C.tools){
      if(filter!=='Semua alat'&&filter!==group) continue;
      const card=node('a','tool-card');card.href='#'+id;const text=node('div','tile-body'),top=node('div','tile-bottom'),arr=node('span','tile-arrow');
      arr.append(icon('external'));top.append(node('h3','',title),arr);text.append(top,node('p','',desc));card.append(tileArt(id),text);cards.append(card);
    }
    view.append(cards,sectionTitle('Identitas terpilih'));
    const strip=node('div','identity-strip'),pal=C.paletteList[state.palette],font=C.fonts[state.font];
    const items=[['logo','Logo',C.logoStyles[state.logo],A.logo(state)],['palette','Palet',pal[0],A.swatches(pal[1],65,52)],['names','Tipografi',font[0],node('span','font-'+state.font,'Aa')]];
    items.forEach(([target,key,val,art])=>{
      const a=link('',target,''),s=node('span','sample-icon'+(target==='names'?' type':'')),txt=node('span');
      s.append(art);txt.append(node('small','',key),node('strong','',val));a.append(s,txt);strip.append(a);
    });view.append(strip);
  }

  function briefPage() {
    const layout=node('div','form-layout'),form=node('form','panel'),fields=node('div','field-grid');
    form.noValidate=true;form.append(node('div','panel-head',''),fields);form.firstChild.append(node('h2','','Tentang usahamu'));
    const configs=[
      ['name','Nama usaha','text'],['slogan','Slogan','text'],['industry','Bidang usaha',Object.keys(C.industries)],['mood','Karakter merek',Object.keys(C.moods)],
      ['audience','Target pelanggan','text'],['story','Cerita produk atau jasa','area']
    ];
    for(const [key,label,kind] of configs){
      const holder=node('label','field'+(['audience','story'].includes(key)?' full':''));holder.append(node('span','',label));
      const input=node(Array.isArray(kind)?'select':kind==='area'?'textarea':'input');
      input.name=key;input.required=key!=='name' && key!=='slogan';
      if(Array.isArray(kind)) kind.forEach(v=>{const opt=node('option','',v);opt.value=v;input.append(opt);});
      else {input.minLength=C.bounds[key][0];input.maxLength=C.bounds[key][1];if(kind==='area') input.rows=4;else input.type='text';}
      input.value=state.brief[key];holder.append(input);
      if(!input.required) holder.append(node('small','hint','Kosongkan untuk memakai saran studio.'));
      if(key==='story') {
        const count=node('span','field-count');const update=()=>{count.textContent=input.value.length+' / '+C.bounds.story[1];};
        input.addEventListener('input',update);update();holder.append(count);
      }
      fields.append(holder);
    }
    const footer=node('div','form-footer'),error=node('p','form-error');error.setAttribute('role','status');
    const submit=control('button','Simpan brief','btn dark','check');submit.type='submit';footer.append(error,submit);form.append(footer);
    form.addEventListener('submit',e=>{
      e.preventDefault();const b=Object.fromEntries(Array.from(new FormData(form),([k,v])=>[k,String(v).trim()]));
      if((!b.name || !b.slogan) && Object.hasOwn(C.industries,b.industry) && Object.hasOwn(C.moods,b.mood)){
        const [idea]=C.names({...state,brief:b});b.name=b.name||idea.name;b.slogan=b.slogan||idea.slogan;
      }
      if(!C.validBrief(b)){
        for(const [key,[min,max]] of Object.entries(C.bounds)){
          if(b[key].length<min || b[key].length>max){error.textContent='Isi '+configs.find(item=>item[0]===key)[1].toLowerCase()+' sepanjang '+min+'–'+max+' karakter.';form.elements.namedItem(key).focus();return;}
        }
        error.textContent='Periksa pilihan dan hapus karakter kontrol yang tidak terlihat.';return;
      }
      const changedIndustry=state.brief.industry!==b.industry,changedMood=state.brief.mood!==b.mood;
      if(changedIndustry){state.product=C.industries[b.industry].product;state.mark=C.industries[b.industry].marks[0];}
      if(changedMood){state.palette=C.moods[b.mood].palettes[0];state.font=C.moods[b.mood].fonts[0];}
      state.brief=b;activity=freshSocial();persist('Brief disimpan. Aset merek sudah diperbarui.');location.hash='home';
    });
    const note=node('aside','panel brief-note');note.append(icon('layer'),node('h3','','Satu brief untuk seluruh studio'),node('p','','Nama dan slogan muncul di setiap desain. Bidang usaha menentukan rekomendasi produk. Karakter merek membantu memilih warna dan tipografi.'));
    layout.append(form,note);view.append(layout);
  }
  function logoPage() {
    view.append(intro('6 konsep logo',button('Variasi baru',()=>nextRound('logoRound','Variasi simbol diperbarui.'),'btn','shuffle','logo-round')));
    const grid=node('div','result-grid');
    C.logoStyles.forEach((title,i)=>{
      const shape=C.markFor(state,i),selected=state.logo===i&&state.mark===shape;
      const card=node('article','card result-card'+(selected?' selected':'')),visual=node('div','result-art'),meta=node('div','result-meta'),top=node('div','tile-bottom');
      visual.append(A.logo(state,i,shape));top.append(node('h3','',title));if(selected) top.append(savedLabel());
      const row=node('div','buttons'),get=()=>A.logo(state,i,shape,true);
      row.append(button(selected?'Dipakai':'Pakai logo',()=>commit({logo:i,mark:shape},'Logo diterapkan pada seluruh aset.',true),'btn warm','check','logo-'+i),
        downloadArt('SVG',get,'svg',1040,456,'logo-'+(i+1)),downloadArt('PNG',get,'png',2080,912,'logo-'+(i+1)));
      meta.append(top,row);card.append(visual,meta);grid.append(card);
    });view.append(grid);
    const foot=sectionTitle('Logo aktif',C.logoStyles[state.logo]+' · Berkas unduhan memiliki latar transparan.');view.append(foot);
    const act=node('div','buttons');act.append(downloadArt('Unduh SVG',()=>A.logo(state,state.logo,state.mark,true),'svg',1040,456,'logo-aktif',true),downloadArt('Unduh PNG',()=>A.logo(state,state.logo,state.mark,true),'png',2080,912,'logo-aktif'));view.append(act);
  }
  function namesPage() {
    view.append(intro('3 konsep sesuai bidang usaha',button('Ide lainnya',()=>nextRound('nameRound','Tiga konsep baru sudah disiapkan.'),'btn','shuffle','names-round')));
    const grid=node('div','result-grid names-grid');
    C.names(state).forEach((idea,i)=>{
      const c=node('article','card result-card'),sample=node('div','name-preview'),meta=node('div','result-meta'),font=C.fonts[idea.font],row=node('div','buttons');
      sample.append(node('strong','font-'+idea.font,idea.name),node('span','',idea.slogan));
      row.append(button('Pakai konsep',()=>commit({brief:{...state.brief,name:idea.name,slogan:idea.slogan},font:idea.font},'Nama, slogan, dan huruf diterapkan.',true),'btn warm','check','name-'+i),
        button('Pakai slogan',()=>commit({brief:{...state.brief,slogan:idea.slogan}},'Slogan diterapkan pada merek aktif.',true),'btn slim'));
      meta.append(node('h3','',font[0]+' · '+font[1]),node('p','sub',font[5]),row);c.append(sample,meta);grid.append(c);
    });
    view.append(grid,sectionTitle('Gaya huruf merek','Pilih huruf judul untuk '+state.brief.name+'.'));
    const opts=node('div','font-options');
    C.fonts.forEach((f,i)=>{
      const b=button('',()=>commit({font:i},'Gaya huruf diterapkan.',true),'font-choice','','font-'+i);b.setAttribute('aria-pressed',String(i===state.font));
      b.append(node('span','font-'+i,'Aa'),node('strong','',f[0]),node('small','',f[1]+(i===state.font?' · Terpilih':'')));opts.append(b);
    });view.append(opts);
  }
  function palettePage() {
    const pal=C.paletteList[state.palette];view.append(intro('Palet aktif · '+pal[0]));
    const sw=node('div','swatch-grid');
    pal[1].forEach((hex,i)=>{
      const b=button('',()=>copyText(hex),'swatch');b.setAttribute('aria-label','Salin '+C.roles[i]+' '+hex);
      const t=node('span');t.append(node('small','',C.roles[i]),node('b','',hex));b.append(A.swatches([hex],120,54),t);sw.append(b);
    });
    view.append(sw);const header=sectionTitle('Rekomendasi palet',state.brief.mood);
    header.append(button('Variasi baru',()=>nextRound('paletteRound','Rekomendasi warna diperbarui.'),'btn','shuffle','pal-round'));view.append(header);
    const grid=node('div','result-grid');
    C.palettes(state).forEach(i=>{
      const [name,colors]=C.paletteList[i],card=node('article','card result-card'),preview=node('div','palette-strip'),meta=node('div','result-meta'),line=node('div','tile-bottom');
      preview.append(A.swatches(colors));line.append(node('h3','',name));if(i===state.palette) line.append(savedLabel());
      meta.append(line,button('Pakai palet',()=>commit({palette:i},'Palet diterapkan pada seluruh aset.',true),'btn','palette','pal-'+i));
      card.append(preview,meta);grid.append(card);
    });view.append(grid);
  }
  function packagingPage() {
    const work=node('div','workbench'),stage=node('div','mock-stage'),side=node('div','panel tool-controls');
    const board=mockView==='Papan presentasi';
    const getArt=()=>board?A.board(state):A.mockup(state);
    const modes=segment(['Produk','Papan presentasi'],mockView,v=>{mockView=v;rerender();},'Tampilan mockup',['packaging','layer']);
    view.append(intro('Pratinjau desain',modes));
    if(board) work.classList.add('board-layout');
    stage.append(getArt());
    const head=node('div','panel-head');head.append(node('h2','','Desain produk'));side.append(head);
    const group=node('div','control-block');group.append(node('strong','','Bentuk mockup'));
    const opts=node('div','product-options');opts.setAttribute('role','group');opts.setAttribute('aria-label','Bentuk mockup');
    for(const [k,label] of Object.entries(C.products)){
      const b=button('',()=>commit({product:k},'Mockup '+label.toLowerCase()+' diterapkan.',true),'product-choice','','product-'+k);
      b.setAttribute('aria-pressed',String(state.product===k));b.append(image(A.fileFor(k),''),node('span','',label));opts.append(b);
    }
    group.append(opts);side.append(group);
    const fx=node('div','control-block');fx.append(node('strong','','Aplikasi logo'),segment(C.treatments,C.treatments[state.treatment],(_,i)=>commit({treatment:i},'Tampilan cetak diperbarui.',true),'Teknik cetak'));side.append(fx);
    const desc=node('p','notice',C.products[state.product]+' · '+C.treatments[state.treatment]+' · '+C.paletteList[state.palette][0]+'. Mockup memakai logo dan tipografi aktif.');
    if(board) desc.textContent=state.product==='shirt'?'Papan kaus menampilkan desain pada bagian depan dan belakang.':'Papan menampilkan identitas cetak di samping penerapannya pada produk.';
    const kind=(board?'papan-':'mockup-')+state.product;
    const row=node('div','buttons');row.append(downloadArt('Unduh PNG',getArt,'png',board?1800:1500,board?1250:1500,kind,true),downloadArt('SVG',getArt,'svg',board?1440:1000,1000,kind));
    side.append(desc,row);work.append(stage,side);view.append(work);
  }


  function avatar() {
    const a=node('span','insta-avatar');a.append(node('span','',C.initials(state.brief.name)));return a;
  }
  function photoControl(){
    const area=node('div','upload-row'),label=node('label','btn upload-btn'),input=node('input','file-input');
    input.type='file';input.accept='image/jpeg,image/png,image/webp';input.setAttribute('aria-label','Gunakan foto produk JPG, PNG, atau WebP');
    label.append(input,icon('image'),node('span','',photo?'Ganti foto produk':'Pakai foto produk'));
    input.addEventListener('change',async()=>{
      const file=input.files?.[0];if(!file) return;
      const version=++photoVersion;
      try {const next=await A.readPhoto(file);if(version!==photoVersion) return;photo=next;activity=freshSocial();rerender();notify('Foto diterapkan pada tiga postingan.');}
      catch(e){if(version===photoVersion) notify(e.message||'Foto gagal dibuka.',true);}
      finally{input.value='';}
    });
    area.append(label);
    if(photo) area.append(button('Hapus foto',()=>{photoVersion++;photo='';activity=freshSocial();rerender();notify('Foto bawaan kembali digunakan.');},'btn slim'));
    return area;
  }
  function commentDialog(i) {
    const box=node('div'),ul=node('ul','comments-list'),form=node('form','comment-form');
    const list=activity[i].comments;
    function comments(){ul.replaceChildren();list.forEach(s=>ul.append(node('li','',s)));if(!list.length) ul.append(node('li','', 'Belum ada komentar simulasi.'));}
    comments();
    const field=node('label','field','Komentar simulasi'),input=node('textarea','comment-input');input.rows=2;input.maxLength=180;input.required=true;field.append(input);
    const send=control('button','Tambahkan komentar','btn dark','comment');send.type='submit';form.append(field,send);
    form.addEventListener('submit',e=>{
      e.preventDefault();const value=input.value.trim();if(!value){input.focus();return;}
      if(list.length>=15){notify('Maksimum 15 komentar per pratinjau.',true);return;}
      list.push(value.slice(0,180));input.value='';comments();render();input.focus();
    });
    box.append(node('p','sub','Komentar hanya tampil di pratinjau selama sesi ini.'),ul,form);openModal('Komentar · '+C.socialThemes[i],box);
  }
  function postMenu(i) {
    const opts=node('div','buttons');
    opts.append(downloadArt('Unduh PNG',()=>A.post(state,i,photo),'png',1080,1350,'instagram-'+(i+1),true),button('Salin caption',()=>copyText(C.postInfo(state,i).caption),'btn','copy'));
    openModal(C.socialThemes[i],opts);
  }
  function postCard(i) {
    const info=C.postInfo(state,i),p=node('article','post'),head=node('div','post-head'),user=node('div','post-user'),name=C.handle(state.brief.name);
    user.append(node('strong','',name),node('small','','Pratinjau Instagram'));head.append(avatar(),user,iconButton('Opsi '+info.theme,'more',()=>postMenu(i)));
    const art=node('div','post-art');art.append(A.post(state,i,photo));
    const row=node('div','reactions'),item=activity[i],like=iconButton('Sukai postingan simulasi','heart',b=>{item.like=!item.like;b.setAttribute('aria-pressed',String(item.like));},'liked'),save=iconButton('Simpan postingan simulasi','bookmark',b=>{item.saved=!item.saved;b.setAttribute('aria-pressed',String(item.saved));});
    like.setAttribute('aria-pressed',String(item.like));save.setAttribute('aria-pressed',String(item.saved));
    row.append(like,iconButton('Komentar simulasi','comment',()=>commentDialog(i)),iconButton('Salin caption postingan','send',()=>copyText(info.caption)),save);
    const caption=node('p','caption');caption.append(node('strong','',name),node('span','',info.caption));
    const foot=node('p','post-foot','Simulasi feed'+(item.comments.length?' · '+item.comments.length+' komentar':''));
    p.append(head,art,row,caption,foot);return p;
  }
  function socialPage() {
    const top=node('div','panel'),bar=node('div','social-toolbar');
    bar.append(segment(['Feed','Grid profil'],socialView,v=>{socialView=v;rerender();},'Tampilan Instagram',['feed','home']),button('Variasi konten',()=>nextRound('postRound','Tiga variasi konten diperbarui.'),'btn','shuffle','post-round'));
    const upload=photoControl();upload.append(node('span','hint','JPG, PNG, WebP · Maks. 5 MB · Foto berlaku selama sesi ini.'));
    top.append(bar,upload);view.append(top);
    if(socialView==='Grid profil'){
      view.append(sectionTitle('Pratinjau profil'));
      const panel=node('div','panel profile'),head=node('div','profile-head'),text=node('div');text.append(node('h3','',C.handle(state.brief.name)),node('p','sub',state.brief.slogan),node('p','hint','3 postingan konsep'));
      head.append(avatar(),text);const grid=node('div','profile-grid');
      [0,1,2].forEach(i=>{
        const b=button('',()=>openModal(C.socialThemes[i],postCard(i)),'');b.setAttribute('aria-label','Buka '+C.socialThemes[i]);b.append(A.post(state,i,photo));grid.append(b);
      });panel.append(head,grid);view.append(panel);return;
    }
    view.append(sectionTitle('Pratinjau feed','3 konsep · Format potret 4:5 · PNG 1080 × 1350 piksel'));
    const grid=node('div','feed-grid');
    [0,1,2].forEach(i=>{
      const wrap=node('section','post-shell'),actions=node('div','post-actions');
      actions.append(downloadArt('Unduh PNG',()=>A.post(state,i,photo),'png',1080,1350,'instagram-'+(i+1),true),
        button('Salin caption',()=>copyText(C.postInfo(state,i).caption),'btn slim','copy'));
      wrap.append(node('h3','post-theme',C.socialThemes[i]),postCard(i),actions);grid.append(wrap);
    });view.append(grid);
  }
  function analysisPage() {
    const report=C.analysis(state),layout=node('div','analysis-layout'),left=node('article','panel'),right=node('article','panel');
    left.append(node('h2','','Pemeriksaan identitas'),node('p','sub',report.checks.filter(c=>c[1]).length+' dari '+report.checks.length+' pedoman praktis terpenuhi.'));
    report.checks.forEach(([name,pass,detail])=>{
      const item=node('div','insight'),line=node('div','tile-bottom');line.append(node('h3','',name),node('span',pass?'active-label':'hint',pass?'Terpenuhi':'Tinjau'));
      item.append(line,node('p','',detail));left.append(item);
    });
    right.append(node('h2','','Arah merek'));
    const items=[['Pernyataan posisi',report.position],['Karakter komunikasi',report.voice],['Aplikasi visual','Gunakan palet '+C.paletteList[state.palette][0]+' dengan huruf '+C.fonts[state.font][1]+'. Pertahankan hierarki yang sama pada mockup dan Instagram.'],['Langkah berikutnya','Tunjukkan dua konsep kepada calon pelanggan. Tanyakan nama yang mereka ingat dan manfaat yang mereka tangkap setelah sekali melihat.']];
    items.forEach(([h,p])=>{const block=node('div','insight');block.append(node('h3','',h),node('p','',p));right.append(block);});
    right.append(node('p','notice','Analisis berasal dari brief, panjang teks, dan kontras warna. Respons pasar perlu diuji dengan pelanggan.'));
    layout.append(left,right);view.append(layout);
  }
  function chapter(title,lines=[]) {
    const section=node('section','guide-chapter');section.append(node('h3','',title));lines.forEach(l=>section.append(node('p','',l)));return section;
  }
  function guideSheet() {
    const b=state.brief,report=C.analysis(state),pal=C.paletteList[state.palette],f=C.fonts[state.font];
    const sheet=node('article','panel guide-wrap'),cover=node('header','guide-cover');cover.append(node('span','kicker','Panduan identitas merek'),node('h2','',b.name),node('p','',b.slogan));
    const logoChap=chapter('Logo dan ruang bebas',[C.logoStyles[state.logo]+'. Sisakan ruang kosong setidaknya selebar satu huruf awal nama di setiap sisi. Pertahankan proporsi saat memperbesar atau memperkecil logo.']);
    const logo=node('div','guide-logo');logo.append(A.logo(state));logoChap.append(logo);
    const cols=chapter('Palet '+pal[0]),strips=node('div','guide-colors');
    pal[1].forEach((c,i)=>{const s=node('span');s.append(A.swatches([c],70,28),node('b','',c),node('small','',C.roles[i]));strips.append(s);});cols.append(strips,node('p','','Pakailah warna utama sebagai identitas, warna aksen untuk penekanan, serta warna teks di atas warna latar.'));
    const type=chapter('Tipografi',[f[0]+' · '+f[1]+'. '+f[5]+' Gunakan sans-serif reguler untuk paragraf panjang.']);
    type.append(node('p','guide-type font-'+state.font,b.name+' · Aa Bb Cc'));
    const visual=chapter('Penerapan desain',[C.products[state.product]+' dengan teknik '+C.treatments[state.treatment].toLowerCase()+'. Di Instagram, pertahankan satu pesan utama per gambar.']);
    const examples=node('div','guide-examples');examples.append(A.mockup(state),A.post(state,0,photo));visual.append(examples);
    sheet.append(cover,chapter('Profil dan audiens',[b.industry+' · '+b.mood,b.story,'Untuk '+b.audience+'.']),logoChap,cols,type,chapter('Gaya komunikasi',[report.voice]),visual);
    const campaign=chapter('Konten Instagram');
    [0,1,2].forEach(i=>{const info=C.postInfo(state,i);campaign.append(node('h4','',info.theme),node('p','',info.caption));});
    sheet.append(campaign,chapter('Evaluasi identitas',[report.checks.filter(v=>v[1]).length+' dari 4 pedoman praktis terpenuhi.',...report.checks.map(q=>q[0]+' — '+q[2])]));
    return sheet;
  }
  const guideCSS='*{box-sizing:border-box}body{max-width:820px;margin:24px auto;padding:16px;color:#302c24;background:white;font:15px/1.55 Arial,sans-serif;overflow-wrap:anywhere}h2{font:44px/1.1 Georgia,serif;margin:8px 0}h3{font-size:21px;margin:0 0 5px}h4{margin:14px 0 3px}p{margin:4px 0;white-space:pre-line}.guide-cover{padding:28px;background:#392c23;color:#fff2da;border-radius:14px}.kicker{text-transform:uppercase;letter-spacing:2px;font-size:11px}.guide-chapter{margin:20px 0;break-inside:avoid}.guide-logo svg{width:230px;max-width:100%;height:auto}.guide-colors,.guide-examples{display:flex;flex-wrap:wrap;gap:8px}.guide-colors span{display:grid;text-align:center;font:12px/1.6 monospace;border:1px solid #ddd;border-radius:5px;overflow:hidden}.guide-colors svg{width:74px;height:28px}.guide-examples svg{width:42%;max-width:240px;height:auto;align-self:flex-start}.font-0,.font-4{font-family:Georgia,serif}.font-4{font-style:italic}.font-2{font-family:monospace}.font-3{font-family:Trebuchet MS,Verdana,sans-serif}.font-5{font-family:Impact,Arial Black,sans-serif;font-weight:900}.guide-type{font-size:26px}@media print{@page{size:A4;margin:14mm}body{padding:0;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.guide-examples svg{max-width:160px}}';
  async function exportGuide(btn) {
    btn.disabled=true;btn.setAttribute('aria-busy','true');const filename=stem()+'-panduan-merek.html';
    try{
      const sheet=guideSheet(),examples=Array.from(sheet.querySelectorAll('.guide-examples > svg'));
      // Semua gambar disematkan agar panduan unduhan dapat dibuka luring.
      for(const svg of examples) svg.replaceWith(await A.portable(svg,svg.getAttribute('width'),svg.getAttribute('height')));
      const doc=document.implementation.createHTMLDocument('Panduan merek · '+sheet.querySelector('h2').textContent);
      doc.documentElement.lang='id';const charset=doc.createElement('meta');charset.setAttribute('charset','utf-8');
      const policy=doc.createElement('meta');policy.httpEquiv='Content-Security-Policy';
      policy.content="default-src 'none'; base-uri 'none'; form-action 'none'; img-src data:; style-src 'sha256-3RkUn6yhPC/O/MVv2g5KRQqavY+Isq8YvFHn2hMRCeY='";
      const viewport=doc.createElement('meta');viewport.name='viewport';viewport.content='width=device-width, initial-scale=1';
      const css=doc.createElement('style');css.textContent=guideCSS;doc.head.prepend(charset,policy,viewport);doc.head.append(css);doc.body.append(doc.importNode(sheet,true));
      saveBlob(new Blob(['<!doctype html>\n',doc.documentElement.outerHTML],{type:'text/html;charset=utf-8'}),filename);notify('Panduan lengkap siap diunduh.');
    }catch{notify('Panduan gagal diunduh. Gunakan Cetak / PDF untuk menyimpan salinan.',true);}
    finally{btn.disabled=false;btn.removeAttribute('aria-busy');}
  }
  function render() {
    updateChrome();view.replaceChildren();
    const renderers={home,brief:briefPage,logo:logoPage,names:namesPage,palette:palettePage,packaging:packagingPage,social:socialPage,analysis:analysisPage,guide:()=>view.append(guideSheet())};
    renderers[page]();
  }
  function route(moveFocus=false) {
    const key=location.hash.slice(1);page=Object.hasOwn(routes,key)?key:'home';
    closeDialogs();render();
    if(moveFocus){byId('main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  byId('open-menu').addEventListener('click',()=>drawer.showModal());
  byId('skip').addEventListener('click',e=>{e.preventDefault();byId('main').focus();});
  for(const dialog of [drawer,modal]){
    dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{
      if(e.target!==dialog) return;
      const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();
    });
  }
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.close()));
  window.addEventListener('hashchange',()=>route(true));
  window.matchMedia('(min-width:840px)').addEventListener('change',e=>{if(e.matches&&drawer.open) drawer.close();});
  const tailwind=byId('tailwind-cdn');
  if(tailwind && /^https?:$/.test(location.protocol)) tailwind.rel='stylesheet';
  route();
})();
