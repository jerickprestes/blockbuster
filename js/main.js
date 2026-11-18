(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* loader: exactly 4s, page loads behind it */
const loader=$("#loader");
const LOAD_MS=4000;
function start(){
  root.classList.add("ready");
  loader&&loader.remove();
  const yt=$(".tv__yt");
  if(yt){/* só mostra o vídeo quando o YouTube confirma que está tocando; senão fica o poster */
    addEventListener("message",e=>{if(e.source!==yt.contentWindow)return;let d=e.data;try{if(typeof d==="string")d=JSON.parse(d)}catch(_){return}
      const playing=d&&((d.event==="onStateChange"&&d.info===1)||(d.event==="infoDelivery"&&d.info&&d.info.playerState===1));
      if(playing)yt.classList.add("on")});
    yt.addEventListener("load",()=>{const ping=()=>yt.contentWindow&&yt.contentWindow.postMessage(JSON.stringify({event:"listening",id:1,channel:"widget"}),"*");ping();setTimeout(ping,800);setTimeout(ping,2000)});
    yt.src=yt.dataset.src}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  $$(".reveal").forEach(el=>io.observe(el));
}
setTimeout(start,LOAD_MS);
/* mobile nav */
const nav=$(".nav"),nt=$(".nav__t");
nt.addEventListener("click",()=>{const o=nav.classList.toggle("open");nt.setAttribute("aria-expanded",o)});
$$("#menu a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");nt.setAttribute("aria-expanded","false");$$("#menu a").forEach(x=>x.classList.toggle("is-on",x===a))}));
/* carousels */
function setupCarousel(c){
  const track=()=>$(".track:not([hidden])",c);
  const step=()=>{const t=track(),k=$(".card",t);return k?k.getBoundingClientRect().width+16:300};
  const go=d=>{const t=track(),max=t.scrollWidth-t.clientWidth-4;
    if(d>0&&t.scrollLeft>=max)t.scrollTo({left:0});else if(d<0&&t.scrollLeft<=4)t.scrollTo({left:max});else t.scrollBy({left:d*step()})};
  $("[data-prev]",c).addEventListener("click",()=>go(-1));
  $("[data-next]",c).addEventListener("click",()=>go(1));
  const bar=$("[data-bar]",c),cnt=$("[data-count]",c);
  const upd=()=>{if(!bar)return;const t=track(),max=Math.max(1,t.scrollWidth-t.clientWidth),p=t.scrollLeft/max;
    bar.style.width=(33+67*p)+"%";const n=Math.min(3,1+Math.round(p*2));cnt.textContent="0"+n+" / 03"};
  $$(".track",c).forEach(t=>t.addEventListener("scroll",upd,{passive:true}));
  const ap=+c.dataset.autoplay;
  if(ap&&!reduce){let h=false;c.addEventListener("pointerenter",()=>h=true);c.addEventListener("pointerleave",()=>h=false);c.addEventListener("focusin",()=>h=true);c.addEventListener("focusout",()=>h=false);
    setInterval(()=>{if(!h&&!document.hidden)go(1)},ap)}
  c._upd=upd;
}
$$("[data-carousel]").forEach(setupCarousel);
/* swipe: toque já é nativo (scroll-snap); aqui o mouse também arrasta */
function dragScroll(el,snap){
  let down=false,sx=0,sl=0,moved=false;
  el.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;down=true;moved=false;sx=e.clientX;sl=el.scrollLeft});
  addEventListener("pointermove",e=>{if(!down)return;const dx=e.clientX-sx;
    if(!moved&&Math.abs(dx)>5){moved=true;el.classList.add("dragging")}
    if(moved)el.scrollLeft=sl-dx});
  const end=e=>{if(!down)return;down=false;if(!moved)return;
    const dx=e.clientX-sx;el.classList.remove("dragging");
    if(snap){const k=$(".card",el),st=k?k.getBoundingClientRect().width+16:300;
      let n=(sl-dx)/st;n=Math.abs(dx)>40?(dx<0?Math.ceil(n-.15):Math.floor(n+.15)):Math.round(n);
      el.scrollTo({left:Math.max(0,n*st),behavior:"smooth"})}
    el.addEventListener("click",ev=>ev.stopPropagation(),{capture:true,once:true})};
  addEventListener("pointerup",end);addEventListener("pointercancel",end);
}
$$(".track").forEach(t=>dragScroll(t,true));$$(".pills").forEach(p=>dragScroll(p,false));
/* trends tabs */
$$(".tabs [data-tab]").forEach(b=>b.addEventListener("click",()=>{
  const k=b.dataset.tab,sec=b.closest("section");
  $$(".tabs [data-tab]",sec).forEach(x=>x.setAttribute("aria-selected",x===b));
  $$(".track[data-pane]",sec).forEach(t=>{t.hidden=t.dataset.pane!==k;if(!t.hidden)t.scrollTo({left:0})});
  const c=$("[data-carousel]",sec);c._upd&&c._upd();applyFilter(sec.querySelector(".pillsrow"));
}));
/* genre pills filter */
function applyFilter(row){
  const sel=$$(".pill[aria-pressed=true]",row).map(p=>p.dataset.g);
  const scope=row.dataset.filter==="trends"?row.closest("section"):null;
  const cards=row.dataset.filter==="movies"?$$("#mgrid .card"):$$(".card",scope);
  cards.forEach(c=>{const g=c.dataset.genres.split(",");c.classList.toggle("hide",sel.length>0&&!sel.some(s=>g.includes(s)))});
  if(row.dataset.filter==="movies")refreshMovies();
}
$$(".pillsrow").forEach(row=>row.addEventListener("click",e=>{const p=e.target.closest(".pill");if(!p)return;
  p.setAttribute("aria-pressed",p.getAttribute("aria-pressed")!=="true");applyFilter(row)}));
$$(".track .card").forEach(c=>{});
const st=document.createElement("style");st.textContent=".track .card.hide{display:none}";document.head.append(st);
/* genre expand (comment 9) */
$$(".plus[aria-controls]").forEach(b=>b.addEventListener("click",()=>{
  const p=document.getElementById(b.getAttribute("aria-controls")),o=b.getAttribute("aria-expanded")!=="true";
  b.setAttribute("aria-expanded",o);p.classList.toggle("open",o);
  if(o){$$(".plus[aria-controls]").forEach(x=>{if(x!==b&&x.getAttribute("aria-expanded")==="true")x.click()})}
}));
/* movies: sort + rating */
const grid=$("#mgrid"),orig=$$(".card",grid);let sort="latest";
const rate=$("#rate"),rateo=$("#rateo"),mcount=$("#mcount");
function refreshMovies(){
  const min=+rate.value;rateo.textContent=min.toFixed(1);
  let list=[...orig];
  if(sort==="year")list.sort((a,b)=>b.dataset.year-a.dataset.year);
  if(sort==="az")list.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));
  list.forEach(c=>grid.append(c));
  let n=0;list.forEach(c=>{const ok=+c.dataset.rating>=min;c.hidden=!ok;if(ok&&!c.classList.contains("hide"))n++});
  mcount.textContent=n+" OF 240 TITLES";
}
$$("[data-sort]").forEach(b=>b.addEventListener("click",()=>{sort=b.dataset.sort;$$("[data-sort]").forEach(x=>x.classList.toggle("on",x===b));refreshMovies()}));
rate.addEventListener("input",refreshMovies);
/* player */
const total=7210;let cur=1684,playing=true,tm;
const pad=n=>String(n).padStart(2,"0"),fmt=s=>Math.floor(s/60)+":"+pad(Math.floor(s%60));
const fill=$("#pfill"),knob=$("#pknob"),scrub=$("#scrub");
function paint(){const p=cur/total*100;fill.style.width=p+"%";knob.style.left=p+"%";scrub.setAttribute("aria-valuenow",Math.round(p));
  $("#pcur").textContent=fmt(cur);$("#ptime").textContent=fmt(cur);
  const r=total-cur;$("#prem").textContent="-"+pad(Math.floor(r/3600))+":"+pad(Math.floor(r%3600/60))+":"+pad(r%60);
  const s=Math.floor(cur);$("#pcnt").firstChild.textContent=Math.floor(s/3600)+":"+pad(Math.floor(s%3600/60))+":"+pad(s%60)}
function tick(){clearInterval(tm);if(playing)tm=setInterval(()=>{cur=Math.min(total,cur+1);paint()},1000)}
$("#pp").addEventListener("click",()=>{playing=!playing;$("#pp use").setAttribute("href",playing?"#i-pause":"#i-play");tick()});
function seek(e){const r=scrub.getBoundingClientRect();cur=Math.round(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*total);paint()}
scrub.addEventListener("click",seek);
scrub.addEventListener("keydown",e=>{if(e.key==="ArrowRight")cur=Math.min(total,cur+30);else if(e.key==="ArrowLeft")cur=Math.max(0,cur-30);else return;paint();e.preventDefault()});
$("#fs").addEventListener("click",()=>{const el=$(".pl__scr");document.fullscreenElement?document.exitFullscreen():el.requestFullscreen&&el.requestFullscreen()});
$$(".seg").forEach(s=>s.addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;$$(".chip",s).forEach(x=>x.classList.toggle("on",x===b));if(s.dataset.seg==="speed")$("#pmode").textContent=b.textContent}));
paint();tick();
/* load more */
$("#more").addEventListener("click",()=>{$$("#rgrid .card--extra").forEach((c,i)=>{c.hidden=false;c.style.animationDelay=i*.08+"s"});$("#more").closest(".more").hidden=true});
refreshMovies();
})();
