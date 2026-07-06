import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = window.firebaseConfig;
const tripId = window.tripConfig?.tripId || "california-2026";

const itinerary = [
  {day:1,date:"Sat, Jul 18",route:"LA Icons → Santa Barbara",sleep:"Hilton Santa Barbara Beachfront Resort",stops:[
    stop("d1-1","10:00 AM","Arrive LAX","ORD → LAX, then pick up rental car","LAX",["Flight","Rental car"]),
    stop("d1-2","11:30 AM","Erewhon Santa Monica 🥤","Hailey Bieber smoothie and quick lunch","Erewhon Santa Monica",["Kids wish list"]),
    stop("d1-3","12:45 PM","Beverly Hills / Rodeo Drive","Beverly Hills sign, Rodeo Drive, photo stop","Beverly Hills Sign",["30–45 min"]),
    stop("d1-4","1:45 PM","Hollywood Walk of Fame ⭐","TCL Chinese Theatre and Dolby Theatre","Hollywood Walk of Fame",["Kids wish list"]),
    stop("d1-5","3:00 PM","Griffith Observatory 📸","Best easy view of the Hollywood Sign","Griffith Observatory",["Hollywood Sign"]),
    stop("d1-6","4:30 PM","Drive to Santa Barbara 🚙","Expect LA traffic. Do not add Malibu today.","Santa Barbara Hilton Beachfront Resort",["2.5–3.5 hrs","Drive"]),
    stop("d1-7","7:30 PM","Dinner in Santa Barbara","Check in and keep the night simple","Hilton Santa Barbara Beachfront Resort",["Sleep"])
  ]},
  {day:2,date:"Sun, Jul 19",route:"Santa Barbara → Solvang → Pismo",sleep:"Inn at the Pier Pismo Beach",stops:[
    stop("d2-1","8:30 AM","Santa Barbara breakfast","Slow morning after the LA day","Stearns Wharf",[]),
    stop("d2-2","9:30 AM","Stearns Wharf / State Street","Beach walk, pier, quick browsing","Stearns Wharf",[]),
    stop("d2-3","11:45 AM","Solvang 🇩🇰","Danish bakeries, windmills, quick walk","Solvang CA",[]),
    stop("d2-4","1:00 PM","OstrichLand USA 🦩","Feed ostriches and emus","OstrichLand USA",["Kids"]),
    stop("d2-5","2:00 PM","Drive to Pismo","Short drive, check in if available","Inn at the Pier Pismo Beach",["Drive"]),
    stop("d2-6","12:00 PM PT / 2:00 PM CT","World Cup Final ⚽","Watch in Pismo or Santa Barbara depending timing","Pismo Beach sports bar",["Must do"]),
    stop("d2-7","Evening","Pismo Pier sunset","Ice cream, beach, easy night","Pismo Pier",["Sleep"])
  ]},
  {day:3,date:"Mon, Jul 20",route:"Pismo → Big Sur → Monterey",sleep:"Monterey Marriott",stops:[
    stop("d3-1","8:30 AM","Leave Pismo","Big scenic day. Pack snacks and water.","Pismo Beach",["Drive"]),
    stop("d3-2","10:00 AM","Elephant Seal Vista Point","Wildlife stop kids will remember","Elephant Seal Vista Point",["Must do"]),
    stop("d3-3","11:30 AM","Ragged Point","Lunch or snack with ocean views","Ragged Point",[]),
    stop("d3-4","1:00 PM","McWay Falls","Iconic Big Sur waterfall overlook","McWay Falls",["Photo"]),
    stop("d3-5","2:30 PM","Bixby Bridge","Quick photo stop. Watch parking.","Bixby Creek Bridge",["Photo"]),
    stop("d3-6","5:30 PM","Arrive Monterey","Dinner and check in","Monterey Marriott",["Sleep"])
  ]},
  {day:4,date:"Tue, Jul 21",route:"Monterey / Carmel",sleep:"Courtyard Sand City Monterey Bay",stops:[
    stop("d4-1","9:30 AM","Monterey Bay Aquarium 🐠","Main event. Don’t rush it.","Monterey Bay Aquarium",["Kids wish list"]),
    stop("d4-2","12:30 PM","Cannery Row lunch","Walkable lunch after aquarium","Cannery Row",[]),
    stop("d4-3","2:00 PM","17-Mile Drive","Lone Cypress and coastline viewpoints","17-Mile Drive",["Drive"]),
    stop("d4-4","4:00 PM","Carmel-by-the-Sea","Beach, shops, relaxed walk","Carmel-by-the-Sea",[]),
    stop("d4-5","Evening","Lovers Point","Easy sunset if everyone has energy","Lovers Point",["Sleep"])
  ]},
  {day:5,date:"Wed, Jul 22",route:"Monterey → Santa Cruz → SF",sleep:"San Francisco Marriott Fisherman’s Wharf",stops:[
    stop("d5-1","9:30 AM","Santa Cruz Beach Boardwalk 🎢","Rides, arcade, beach energy","Santa Cruz Beach Boardwalk",["Kids"]),
    stop("d5-2","12:30 PM","Natural Bridges State Beach","Quick scenic stop","Natural Bridges State Beach",[]),
    stop("d5-3","2:00 PM","Half Moon Bay","Beach / snack stop, don’t overbuild it","Half Moon Bay",[]),
    stop("d5-4","5:00 PM","Arrive San Francisco","Check in near Fisherman’s Wharf","San Francisco Marriott Fisherman's Wharf",["Sleep"]),
    stop("d5-5","Sunset","Crissy Field Golden Gate view","Better than paying huge money for a bridge-view room","Crissy Field",["Golden Gate"])
  ]},
  {day:6,date:"Thu, Jul 23",route:"San Francisco",sleep:"San Francisco Marriott Fisherman’s Wharf",stops:[
    stop("d6-1","9:30 AM","Cable Car Ride 🚋","Classic SF. Go early to avoid long waits.","Powell Hyde Cable Car",["Kids wish list"]),
    stop("d6-2","11:00 AM","Fisherman’s Wharf","Walk, snacks, tourist chaos—embrace it","Fisherman's Wharf",[]),
    stop("d6-3","12:00 PM","Pier 39 Sea Lions","Quick fun stop","Pier 39 Sea Lions",["Must do"]),
    stop("d6-4","2:00 PM","Ghirardelli Square","Chocolate break","Ghirardelli Square",[]),
    stop("d6-5","4:00 PM","Palace of Fine Arts","Beautiful family photos","Palace of Fine Arts",[]),
    stop("d6-6","Evening","Lombard Street","Optional if energy is decent","Lombard Street",[])
  ]},
  {day:7,date:"Fri, Jul 24",route:"San Francisco / Alcatraz",sleep:"San Francisco Marriott Fisherman’s Wharf",stops:[
    stop("d7-1","Morning","Easy Fisherman’s Wharf morning","Keep this light. Alcatraz is already locked.","Fisherman's Wharf",[]),
    stop("d7-2","12:30 PM","Be at Pier 33","Boarding is 12:50 PM. Don’t be cute and arrive late.","Pier 33 Alcatraz Landing",["Ticket booked"]),
    stop("d7-3","1:05 PM","Alcatraz Day Tour 🚢","Booking ID 79925340 · 2 adults, 2 children","Alcatraz Island",["Must do","Booked"]),
    stop("d7-4","After tour","Boudin / Pier 39 / Ghirardelli","Pick based on energy. No forced march.","Boudin Bakery Fisherman's Wharf",[]),
    stop("d7-5","Late afternoon","Painted Ladies / Full House house 🏠","Add this if everyone still has legs.","Painted Ladies San Francisco",["Full House"])
  ]},
  {day:8,date:"Sat, Jul 25",route:"Fly home",sleep:"Home",stops:[
    stop("d8-1","Morning","Breakfast and pack","Do not cram a full sightseeing day before a flight.","San Francisco Marriott Fisherman's Wharf",[]),
    stop("d8-2","Optional","Battery Spencer / Golden Gate final view","Only if timing is comfortable","Battery Spencer",["Golden Gate"]),
    stop("d8-3","11:30 AM","Return rental car","Give yourself a buffer at SFO","SFO Rental Car Center",["Rental car"]),
    stop("d8-4","2:29 PM","SFO → ORD","UA 1777 arrives ORD 9:03 PM","SFO",["Flight"])
  ]}
];
function stop(id,time,title,desc,map,tags){return{ id,time,title,desc,map,tags }}
const allStops = itinerary.flatMap(d=>d.stops.map(s=>({...s,day:d.day,date:d.date,route:d.route,sleep:d.sleep})));

let app, auth, db, userId = null;
let state = {completed:{}, notes:""};
const $ = sel => document.querySelector(sel);
const panels = ["today","itinerary","mustdo","photos","details"];

document.querySelectorAll('.tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  panels.forEach(id=>$('#'+id).classList.remove('active'));
  btn.classList.add('active'); $('#'+btn.dataset.tab).classList.add('active');
}));

$('#shareBtn').addEventListener('click', async()=>{
  const data={title:'Malik Family Adventures', text:'California Coast itinerary', url:location.href};
  if(navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); alert('Link copied'); }
});

init();
async function init(){
  renderAll();
  try{
    app = initializeApp(firebaseConfig);
    auth = getAuth(app); db = getFirestore(app);
    await signInAnonymously(auth);
    onAuthStateChanged(auth, user=>{ if(user){userId=user.uid; subscribe();} });
  }catch(e){
    console.error(e); $('#syncStatus').textContent = 'Local only — Firebase not connected yet';
  }
}
function subscribe(){
  $('#syncStatus').textContent='Live sync connected';
  onSnapshot(collection(db,'trips',tripId,'completed'), snap=>{
    state.completed={}; snap.forEach(d=>state.completed[d.id]=d.data().done); renderAll();
  });
  onSnapshot(doc(db,'trips',tripId,'shared','notes'), snap=>{
    state.notes = snap.exists() ? (snap.data().text || '') : '';
    renderDetails();
  });
}
async function toggleDone(id,done){
  state.completed[id]=done; renderAll();
  if(db) await setDoc(doc(db,'trips',tripId,'completed',id),{done,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
function nextStop(){ return allStops.find(s=>!state.completed[s.id]) || allStops[allStops.length-1]; }
function renderAll(){ renderProgress(); renderUpNext(); renderToday(); renderItinerary(); renderMustDo(); renderPhotos(); renderDetails(); }
function renderProgress(){
  const done=allStops.filter(s=>state.completed[s.id]).length;
  $('#progressText').textContent=`${done} / ${allStops.length} stops completed`;
  $('#progressBar').style.width=`${Math.round(done/allStops.length*100)}%`;
}
function renderUpNext(){
  const n=nextStop(); $('#upNextTitle').textContent=n.title; $('#upNextMeta').textContent=`${n.date} · ${n.time} · ${n.route}`;
  $('#upNextMap').href=mapUrl(n.map); $('#markUpNext').onclick=()=>toggleDone(n.id,true);
}
function renderToday(){
  const day=itinerary.find(d=>d.stops.some(s=>!state.completed[s.id])) || itinerary[0];
  $('#today').innerHTML=dayHeader(day)+ day.stops.map(renderStop).join(''); bindStops($('#today'));
}
function renderItinerary(){
  $('#itinerary').innerHTML=itinerary.map(d=>dayHeader(d)+d.stops.map(renderStop).join('')).join(''); bindStops($('#itinerary'));
}
function renderMustDo(){
  const must=allStops.filter(s=>s.tags.some(t=>/Must|Kids|Golden|Full House|Booked|wish/i.test(t)));
  $('#mustdo').innerHTML='<div class="day"><h2>Family must-do list</h2><p>The stuff you actually care about. Everything else is negotiable.</p></div>'+must.map(renderStop).join(''); bindStops($('#mustdo'));
}
function renderPhotos(){
  $('#photos').innerHTML='<div class="day"><h2>Picture book</h2><p>Storage is intentionally skipped for now.</p></div><div class="card"><h2>Photo plan</h2><p>Create a shared Google Drive or Google Photos album and paste the link in Shared Notes. That is cleaner than paying for Firebase Storage right now.</p></div>';
}
function renderDetails(){
  $('#details').innerHTML=`<div class="day"><h2>Trip details</h2><p>Keep the key confirmations here.</p></div>
  <div class="card detail-list">
    <div class="detail"><b>Outbound</b><span>Jul 18 · ORD → LAX · arrive 10:00 AM</span></div>
    <div class="detail"><b>Return</b><span>Jul 25 · SFO → ORD · 2:29 PM</span></div>
    <div class="detail"><b>Alcatraz</b><span>Jul 24 · 1:05 PM · Booking 79925340</span></div>
    <div class="detail"><b>Travelers</b><span>2 adults, 2 children</span></div>
    <div class="detail"><b>Share code</b><span>${window.tripConfig.familyCode}</span></div>
  </div>
  <div class="card"><h2>Shared notes</h2><textarea id="notes" class="note" placeholder="Add Wi‑Fi passwords, room numbers, parking notes, Google Drive photo link…">${escapeHtml(state.notes || '')}</textarea><p class="danger">These notes sync through Firestore.</p></div>`;
  const notes = $('#notes');
  let timer;
  notes?.addEventListener('input', e=>{
    state.notes = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(()=>saveNotes(e.target.value), 500);
  });
}
async function saveNotes(text){
  if(db) await setDoc(doc(db,'trips',tripId,'shared','notes'),{text,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
function dayHeader(d){return `<div class="day"><h2>Day ${d.day} · ${d.date}</h2><p>${d.route} · Sleep: ${d.sleep}</p></div>`}
function renderStop(s){
  const done=!!state.completed[s.id];
  return `<article class="stop card ${done?'done':''}" data-id="${s.id}">
    <label class="checkwrap"><input type="checkbox" ${done?'checked':''}/><span></span></label>
    <div class="stop-main"><div class="time">${s.time}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p>
    <div class="chips">${s.tags.map(t=>`<span class="chip ${t==='Sleep'?'sleep':t==='Drive'?'drive':''}">${escapeHtml(t)}</span>`).join('')}</div>
    <div class="stop-actions"><a class="small map" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">Open map</a></div></div></article>`;
}
function bindStops(root){
  root.querySelectorAll('.stop').forEach(el=>{
    const id=el.dataset.id;
    el.querySelector('input[type=checkbox]').addEventListener('change',e=>toggleDone(id,e.target.checked));
  });
}
function mapUrl(q){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}
function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
