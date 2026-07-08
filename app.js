import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = window.firebaseConfig;
const tripId = window.tripConfig?.tripId || "california-2026";

const itinerary = [
  {day:1,date:"Sat, Jul 18",route:"LAX → LA icons → Ventura",sleep:"Four Points by Sheraton Ventura Harbor Resort",stops:[
    stop("d1-1","7:29 AM–10:00 AM","Delta DL1556: ORD → LAX","Confirmation HGLYMC · Boeing 737-800 · Comfort · seats 14C, 14D, 14E, 14F · ORD Terminal 5 → LAX Terminal 3","LAX Terminal 3",["Flight","Delta","Booked"]),
    stop("d1-1b","11:30 AM","Pick up National rental car","Emerald Aisle at LAX. Choose best available vehicle; add plate to SpotHero after pickup.","National Car Rental LAX",["Rental car","Booked"]),
    stop("d1-2","12:15 PM","Erewhon Santa Monica 🥤","Hailey Bieber smoothie and quick lunch","Erewhon Santa Monica",["Kids wish list"]),
    stop("d1-3","1:15 PM","Beverly Hills / Rodeo Drive","Beverly Hills sign, Rodeo Drive, photo stop","Beverly Hills Sign",["30–45 min"]),
    stop("d1-4","2:15 PM","Hollywood Walk of Fame ⭐","TCL Chinese Theatre and Dolby Theatre","Hollywood Walk of Fame",["Kids wish list"]),
    stop("d1-5","3:30 PM","Griffith Observatory 📸","Best easy view of the Hollywood Sign","Griffith Observatory",["Hollywood Sign"]),
    stop("d1-6","4:30 PM","Drive to Ventura 🚙","Expect LA traffic. Do not add Malibu today.","Four Points by Sheraton Ventura Harbor Resort",["1.5–2.5 hrs","Drive"]),
    stop("d1-7","Evening","Check in: Four Points Ventura Harbor","Booked direct with Marriott. Confirmation 75176420. Check-in 3:00 PM, checkout noon.","Four Points by Sheraton Ventura Harbor Resort",["Sleep","Booked","Marriott"])
  ]},
  {day:2,date:"Sun, Jul 19",route:"Ventura → Santa Barbara → Pismo",sleep:"Spyglass Inn, Pismo Beach",stops:[
    stop("d2-1","8:30 AM","Breakfast / checkout Ventura","Slow morning at the harbor hotel, then move north.","Four Points by Sheraton Ventura Harbor Resort",["Hotel"]),
    stop("d2-2","9:30 AM","Drive to Santa Barbara","Quick coastal hop from Ventura.","Stearns Wharf",["Drive"]),
    stop("d2-3","10:15 AM","Stearns Wharf / State Street","Beach walk, pier, quick browsing before the World Cup window.","Stearns Wharf",[]),
    stop("d2-4","12:00 PM PT","World Cup Final ⚽","Protect this window. Watch in Santa Barbara or near Pismo depending family energy.","Santa Barbara CA",["Must do"]),
    stop("d2-5","Afternoon","Solvang 🇩🇰 / OstrichLand USA 🦩","Optional if the match timing and family energy cooperate.","OstrichLand USA",["Kids","Optional"]),
    stop("d2-6","4:00 PM","Check in: Spyglass Inn","Booked via Expedia. Itinerary 73490781138425. Check-in 4:00 PM, checkout 11:00 AM.","Spyglass Inn Pismo Beach",["Sleep","Booked","Expedia"]),
    stop("d2-7","Evening","Pismo sunset","Beach, dinner, and easy night after the World Cup day.","Pismo Pier",["Coast"])
  ]},
  {day:3,date:"Mon, Jul 20",route:"Pismo → Big Sur → Monterey",sleep:"Embassy Suites by Hilton Monterey Bay Seaside",stops:[
    stop("d3-1","8:30 AM","Leave Spyglass Inn","Big scenic day. Pack snacks and water.","Spyglass Inn Pismo Beach",["Drive"]),
    stop("d3-2","10:00 AM","Elephant Seal Vista Point","Wildlife stop kids will remember","Elephant Seal Vista Point",["Must do"]),
    stop("d3-3","11:30 AM","Ragged Point","Lunch or snack with ocean views","Ragged Point",[]),
    stop("d3-4","1:00 PM","McWay Falls","Iconic Big Sur waterfall overlook","McWay Falls",["Photo"]),
    stop("d3-5","2:30 PM","Bixby Bridge","Quick photo stop. Watch parking.","Bixby Creek Bridge",["Photo"]),
    stop("d3-6","5:30 PM","Check in: Embassy Suites Monterey Bay Seaside","Booked direct with Hilton. Confirmation 81718225. Check-in 4:00 PM, checkout 11:00 AM.","Embassy Suites by Hilton Monterey Bay Seaside",["Sleep","Booked","Hilton"])
  ]},
  {day:4,date:"Tue, Jul 21",route:"Monterey / Carmel",sleep:"Embassy Suites by Hilton Monterey Bay Seaside",stops:[
    stop("d4-1","9:30 AM","Monterey Bay Aquarium 🐠","Main event. Don’t rush it.","Monterey Bay Aquarium",["Kids wish list"]),
    stop("d4-2","12:30 PM","Cannery Row lunch","Walkable lunch after aquarium","Cannery Row",[]),
    stop("d4-3","2:00 PM","17-Mile Drive","Lone Cypress and coastline viewpoints","Lone Cypress Pebble Beach",["Drive"]),
    stop("d4-4","4:00 PM","Carmel-by-the-Sea","Beach, shops, relaxed walk","Carmel-by-the-Sea",[]),
    stop("d4-5","Evening","Lovers Point","Easy sunset if everyone has energy","Lovers Point",["Coast"]),
    stop("d4-6","Night","Second night: Embassy Suites Monterey Bay Seaside","Booked direct with Hilton. Confirmation 80692049. Check the guest count shows 4, not 1.","Embassy Suites by Hilton Monterey Bay Seaside",["Sleep","Booked","Hilton"])
  ]},
  {day:5,date:"Wed, Jul 22",route:"Monterey → Santa Cruz → Half Moon Bay",sleep:"Aristocrat Hotel, BW Signature Collection",stops:[
    stop("d5-1","9:30 AM","Santa Cruz Beach Boardwalk 🎢","Rides, arcade, beach energy","Santa Cruz Beach Boardwalk",["Kids"]),
    stop("d5-2","12:30 PM","Natural Bridges State Beach","Quick scenic stop","Natural Bridges State Beach",[]),
    stop("d5-3","2:00 PM","Coastal drive toward Half Moon Bay","Keep the coast vibe. Don’t rush into San Francisco tonight.","Half Moon Bay",["Drive"]),
    stop("d5-4","Optional","Pigeon Point Lighthouse","Quick scenic photo stop if everyone still has energy","Pigeon Point Lighthouse",["Photo"]),
    stop("d5-5","5:00 PM","Check in: Aristocrat Hotel","Booked via Expedia. Itinerary 73490728060257. Free parking, breakfast, Wi‑Fi.","Aristocrat Hotel BW Signature Collection Half Moon Bay",["Sleep","Booked","Expedia"]),
    stop("d5-6","Evening","Half Moon Bay sunset / dinner","Beach, harbor, or simple dinner. This is the decompression night.","Half Moon Bay State Beach",["Coast"])
  ]},
  {day:6,date:"Thu, Jul 23",route:"Half Moon Bay → San Francisco",sleep:"Hilton San Francisco Financial District",stops:[
    stop("d6-1","8:30 AM","Breakfast + check out Half Moon Bay","Use the included breakfast, then move toward SF without dragging.","Aristocrat Hotel BW Signature Collection Half Moon Bay",["Hotel"]),
    stop("d6-2","9:30 AM","Drive into San Francisco","Aim to be in the city late morning. Parking starts at 1:30 PM.","Hilton San Francisco Financial District",["Drive"]),
    stop("d6-3","Late morning","Golden Gate / Palace of Fine Arts","Start with an iconic SF view before hotel logistics take over.","Palace of Fine Arts",["Photo"]),
    stop("d6-4","1:30 PM","SpotHero parking begins","20 Trenton St. Spots #1–4 only. Add rental plate after pickup.","20 Trenton St San Francisco",["Booked","Parking"]),
    stop("d6-5","Afternoon","Check in: Hilton SF Financial District","Booked direct with Hilton. Confirmation 3496618540. Check Hilton app for details.","Hilton San Francisco Financial District",["Sleep","Booked","Hilton"]),
    stop("d6-6","Afternoon / evening","Fisherman’s Wharf + Pier 39","Sea lions, Boudin, waterfront walk. Use rideshare/transit if parking is annoying.","Pier 39 Sea Lions",["Must do"]),
    stop("d6-7","Evening","Lombard Street zig-zag road 🌀","Iconic crooked street. 20–30 min photo stop; best view is from Leavenworth looking uphill.","Lombard Street Hyde Leavenworth",["Must do","Photo"])
  ]},
  {day:7,date:"Fri, Jul 24",route:"San Francisco / Alcatraz",sleep:"Hilton San Francisco Financial District",stops:[
    stop("d7-1","Morning","Easy Fisherman’s Wharf morning","Keep this light. Alcatraz is already locked.","Fisherman's Wharf",[]),
    stop("d7-2","12:30 PM","Be at Pier 33","Boarding is 12:50 PM. Don’t be cute and arrive late.","Pier 33 Alcatraz Landing",["Ticket booked"]),
    stop("d7-3","1:05 PM","Alcatraz Day Tour 🚢","Booking ID 79925340 · 2 adults, 2 children","Alcatraz Island",["Must do","Booked"]),
    stop("d7-4","After tour","Boudin / Pier 39 / Ghirardelli","Pick based on energy. No forced march.","Boudin Bakery Fisherman's Wharf",[]),
    stop("d7-5","Late afternoon","Painted Ladies / Full House house 🏠","Add this if everyone still has legs.","Painted Ladies San Francisco",["Full House"])
  ]},
  {day:8,date:"Sat, Jul 25",route:"Fly home",sleep:"Home",stops:[
    stop("d8-1","Morning","Breakfast and pack","Do not cram a full sightseeing day before a flight. SpotHero parking ends at 12:00 PM.","Hilton San Francisco Financial District",[]),
    stop("d8-2","Optional","Battery Spencer / Golden Gate final view","Only if timing is comfortable","Battery Spencer",["Golden Gate"]),
    stop("d8-3","11:30 AM","Return National rental car","Return at SFO by 11:30 AM. SpotHero parking ends at 12:00 PM, so do not run late.","SFO Rental Car Center",["Rental car","Booked"]),
    stop("d8-4","2:29 PM","United UA1777: SFO → ORD","Confirmation GR6P5Y · departs 2:29 PM · arrives 9:03 PM · seats 32A, 32B, 32C, 41D","SFO",["Flight","United","Booked"])
  ]}
];
function stop(id,time,title,desc,map,tags){return{ id,time,title,desc,map,tags }}

const dayReminders = {
  1: "Do not let LA steal the whole trip. Leave by 4:30 PM or Ventura turns into a punishment drive.",
  2: "World Cup Final day. Protect the match window and keep the Santa Barbara → Pismo drive easy.",
  3: "Fill gas before leaving Pismo. Big Sur has limited bathrooms, food, and cell service.",
  4: "Aquarium first. If you delay it, the day gets messy fast.",
  5: "Santa Cruz is fun, but do not overstay. The win is a relaxed Half Moon Bay night, not arriving exhausted.",
  6: "Half Moon Bay to SF. Parking starts 1:30 PM. Get into the city, then keep sightseeing realistic.",
  7: "Alcatraz is locked. Be at Pier 33 by 12:30 PM. Missing boarding would be an own goal.",
  8: "Flight day is not an adventure day. Build in airport and rental-car buffer."
};

const dayBriefs = {
  1: {wake:"Naperville / ORD", sleep:"Ventura", drive:"3.5–5 hrs total with LA traffic", must:"Delta DL1556, National rental, Erewhon, Walk of Fame, Hollywood Sign", leaveBy:"Leave LA by 4:30 PM", dinner:"Ventura Harbor or hotel-area dinner", warning:"Land LAX Terminal 3 at 10:00 AM, then National Emerald Aisle pickup at 11:30 AM. Ventura keeps the trip moving north."},
  2: {wake:"Ventura", sleep:"Pismo Beach", drive:"3–4.5 hrs plus Santa Barbara / optional Solvang stops", must:"World Cup Final + Pismo sunset", leaveBy:"Leave Ventura by 9:30 AM", dinner:"Pismo Pier area", warning:"Protect the World Cup Final window. Solvang/OstrichLand is optional, not mandatory."},
  3: {wake:"Pismo Beach", sleep:"Seaside / Monterey", drive:"5–6 hrs with Big Sur stops", must:"Elephant seals, McWay Falls, Bixby Bridge", leaveBy:"Leave Pismo by 8:30 AM", dinner:"Monterey / Cannery Row", warning:"Gas, snacks, bathrooms before Big Sur. Cell service gets spotty."},
  4: {wake:"Seaside / Monterey", sleep:"Seaside / Monterey", drive:"Light local driving", must:"Monterey Bay Aquarium", leaveBy:"Be at Aquarium by 9:30 AM", dinner:"Carmel or Monterey", warning:"Do Aquarium first. Everything else flexes around it. Also fix Hilton guest count to 4 if the app still shows 1."},
  5: {wake:"Seaside / Monterey", sleep:"Half Moon Bay", drive:"3–4 hrs with Santa Cruz + coastal stops", must:"Santa Cruz Boardwalk + Half Moon Bay sunset", leaveBy:"Leave Santa Cruz by 12:30 PM", dinner:"Half Moon Bay / harbor area", warning:"Do not push into San Francisco tonight. The booked win is a coast decompression night."},
  6: {wake:"Half Moon Bay", sleep:"San Francisco", drive:"45–75 min into SF plus city logistics", must:"Golden Gate / Wharf / Lombard", leaveBy:"Leave Half Moon Bay by 9:30 AM", dinner:"North Beach, Chinatown, or Wharf", warning:"Parking starts 1:30 PM at 20 Trenton St. Add rental plate in SpotHero after pickup."},
  7: {wake:"San Francisco", sleep:"San Francisco", drive:"Minimal", must:"Alcatraz Day Tour", leaveBy:"Be at Pier 33 by 12:30 PM", dinner:"Embarcadero / Wharf", warning:"Alcatraz is booked. Missing boarding is not recoverable."},
  8: {wake:"San Francisco", sleep:"Home", drive:"Hotel to SFO + rental return", must:"Return National car + United UA1777", leaveBy:"Leave hotel by 11:00 AM", dinner:"Home / airport if needed", warning:"SpotHero parking ends at noon. United UA1777 departs SFO at 2:29 PM. No heroic sightseeing."}
};

const dayMapRoutes = {
  1: {origin:"Los Angeles International Airport LAX", destination:"Four Points by Sheraton Ventura Harbor Resort", waypoints:["Erewhon Santa Monica","Beverly Hills Sign","Hollywood Walk of Fame","Griffith Observatory"]},
  2: {origin:"Four Points by Sheraton Ventura Harbor Resort", destination:"Spyglass Inn Pismo Beach", waypoints:["Stearns Wharf Santa Barbara","Solvang CA","OstrichLand USA"]},
  3: {origin:"Spyglass Inn Pismo Beach", destination:"Embassy Suites by Hilton Monterey Bay Seaside", waypoints:["Elephant Seal Vista Point San Simeon CA","Ragged Point CA","McWay Falls CA","Bixby Creek Bridge CA"]},
  4: {origin:"Embassy Suites by Hilton Monterey Bay Seaside", destination:"Embassy Suites by Hilton Monterey Bay Seaside", waypoints:["Monterey Bay Aquarium","Cannery Row Monterey","Lone Cypress Pebble Beach","Carmel-by-the-Sea CA","Lovers Point Park Pacific Grove"]},
  5: {origin:"Embassy Suites by Hilton Monterey Bay Seaside", destination:"Aristocrat Hotel BW Signature Collection Half Moon Bay CA", waypoints:["Santa Cruz Beach Boardwalk","Natural Bridges State Beach","Pigeon Point Lighthouse"]},
  6: {origin:"Aristocrat Hotel BW Signature Collection Half Moon Bay CA", destination:"Hilton San Francisco Financial District", waypoints:["Palace of Fine Arts San Francisco","20 Trenton St San Francisco","Pier 39 Sea Lions","Lombard Street Hyde Leavenworth"]},
  7: {origin:"Hilton San Francisco Financial District", destination:"Hilton San Francisco Financial District", waypoints:["Fisherman's Wharf San Francisco","Pier 33 Alcatraz Landing","Boudin Bakery Fisherman's Wharf","Pier 39","Painted Ladies San Francisco"]},
  8: {origin:"Hilton San Francisco Financial District", destination:"SFO Rental Car Center", waypoints:["Battery Spencer"]}
};

const familyMoments = [
  {id:"moment-erewhon", pickedBy:"Kids", title:"Try the famous Erewhon smoothie", map:"Erewhon Santa Monica", note:"Quick, fun, and overpriced. Do it once."},
  {id:"moment-walkoffame", pickedBy:"Family", title:"Hollywood Walk of Fame", map:"Hollywood Walk of Fame", note:"Photo stop, not a whole afternoon."},
  {id:"moment-hollywoodsign", pickedBy:"Kids", title:"See the Hollywood Sign", map:"Griffith Observatory", note:"Griffith Observatory gives the easiest family view."},
  {id:"moment-ostrich", pickedBy:"Family", title:"Feed ostriches and emus", map:"OstrichLand USA", note:"Weird enough that the kids will remember it."},
  {id:"moment-seals", pickedBy:"Family", title:"See elephant seals", map:"Elephant Seal Vista Point", note:"Wildlife without hiking. Perfect road-trip stop."},
  {id:"moment-aquarium", pickedBy:"Family", title:"Monterey Bay Aquarium", map:"Monterey Bay Aquarium", note:"This is a real must-do. Don’t rush it."},
  {id:"moment-cablecar", pickedBy:"Family", title:"Ride a San Francisco cable car", map:"Powell Hyde Cable Car", note:"Go early so it stays magical instead of miserable."},
  {id:"moment-lombard", pickedBy:"Dad", title:"Lombard Street zig-zag road", map:"Lombard Street Hyde Leavenworth", note:"Best photo angle: Leavenworth looking uphill."},
  {id:"moment-alcatraz", pickedBy:"Booked", title:"Alcatraz Day Tour", map:"Pier 33 Alcatraz Landing", note:"Boarding is 12:50 PM. No messing around."}
];

const reservationSections = [
  {title:"Flights", icon:"✈️", fields:[
    field("flight-out-confirmation","Outbound flight","Delta DL1556 · confirmation HGLYMC"),
    field("flight-out-seats","Outbound details","ORD Terminal 5 → LAX Terminal 3 · Boeing 737-800 · Comfort · seats 14C, 14D, 14E, 14F"),
    field("flight-return-confirmation","Return flight","United UA1777 · confirmation GR6P5Y"),
    field("flight-return-seats","Return details","SFO → ORD · Jul 25 · 2:29 PM PT → 9:03 PM CT · seats: Nabeel 32A, Alayna 32B, Humza 32C, Ayesha 41D")
  ]},
  {title:"Hotels", icon:"🏨", fields:[
    field("hotel-ventura-booked","Jul 18 Ventura","BOOKED direct with Marriott · Four Points by Sheraton Ventura Harbor Resort · confirmation #75176420"),
    field("hotel-ventura-details","Ventura details","Check-in Jul 18 3:00 PM · check-out Jul 19 12:00 PM · 1 night"),
    field("hotel-pismo-booked","Jul 19 Pismo Beach","BOOKED via Expedia · Spyglass Inn · Itinerary #73490781138425 · check Expedia app"),
    field("hotel-pismo-details","Pismo details","Check-in Jul 19 4:00 PM · check-out Jul 20 11:00 AM · rating shown 8.8/10 Excellent"),
    field("hotel-monterey-night1","Jul 20 Seaside / Monterey","BOOKED direct with Hilton · Embassy Suites by Hilton Monterey Bay Seaside · confirmation #81718225 · 4 guests"),
    field("hotel-monterey-night2","Jul 21 Seaside / Monterey","BOOKED direct with Hilton · Embassy Suites by Hilton Monterey Bay Seaside · confirmation #80692049 · check guest count shows 4"),
    field("hotel-hmb-booked","Jul 22 Half Moon Bay","BOOKED via Expedia · Aristocrat Hotel, BW Signature Collection · Itinerary #73490728060257 · check Expedia app"),
    field("hotel-hmb-details","Half Moon Bay details","Check-in Jul 22 3:00 PM · check-out Jul 23 11:00 AM · free continental breakfast · free self-parking · free Wi‑Fi · sleeps 4"),
    field("hotel-sf-booked","Jul 23–25 San Francisco","BOOKED direct with Hilton · Hilton San Francisco Financial District · confirmation #3496618540 · check Hilton app"),
    field("hotel-sf-details","San Francisco details","2 nights · Thu Jul 23 to Sat Jul 25 · total shown $418.18")
  ]},
  {title:"Car + tickets + parking", icon:"🚗", fields:[
    field("rental-company","Rental car","National Car Rental · Emerald Aisle · estimated total $346.16"),
    field("rental-pickup-return","Rental logistics","Pickup LAX Sat Jul 18 11:30 AM · return SFO Sat Jul 25 11:30 AM · midsize reservation, choose best available Emerald Aisle vehicle"),
    field("rental-insurance","Rental reminder","Add rental car license plate to SpotHero after pickup. Decline counter CDW only if card coverage plan is final."),
    field("parking-sf-spothero","San Francisco parking","BOOKED via SpotHero · 20 Trenton St. · Spots #1, #2, #3 or #4 only · Rental ID 127531474"),
    field("parking-sf-window","Parking window","Thu Jul 23 1:30 PM → Sat Jul 25 12:00 PM · add rental car plate after pickup"),
    field("alcatraz-confirmation","Alcatraz","Booking 79925340 · Jul 24 · boarding 12:50 PM · tour 1:05 PM"),
    field("alcatraz-location","Alcatraz logistics","Pier 33 · arrive by 12:30 PM · 2 adults, 2 children")
  ]},
  {title:"Operational notes", icon:"🧠", fields:[
    field("guest-count-alert","Hilton guest-count check","Embassy Suites Jul 21–22 screenshot showed 1 guest. Update to 4 guests so breakfast/headcount is clean."),
    field("parking-notes","Parking notes","SF hotel parking, Pier 33, Griffith Observatory, Monterey Aquarium"),
    field("loyalty-points","Points / cards used","Hilton, Marriott, Amex, Chase notes"),
    field("cancel-deadlines","Cancellation deadlines","Hotel/rental deadlines so we don’t get lazy and eat fees")
  ]}
];
function field(id,label,value){return {id,label,value}}
const allStops = itinerary.flatMap(d=>d.stops.map(s=>({...s,day:d.day,date:d.date,route:d.route,sleep:d.sleep})));

let app, auth, db, userId = null;
let state = {completed:{}, collapsedDays:{}, moments:{}, ratings:{}, reservations:{}, notes:""};
const $ = sel => document.querySelector(sel);
const panels = ["today","itinerary","mustdo","details"];

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
  onSnapshot(collection(db,'trips',tripId,'collapsedDays'), snap=>{
    state.collapsedDays={}; snap.forEach(d=>state.collapsedDays[d.id]=!!d.data().collapsed); renderAll();
  });
  onSnapshot(collection(db,'trips',tripId,'moments'), snap=>{
    state.moments={}; snap.forEach(d=>state.moments[d.id]=!!d.data().done); renderAll();
  });
  onSnapshot(collection(db,'trips',tripId,'ratings'), snap=>{
    state.ratings={}; snap.forEach(d=>state.ratings[d.id]=d.data()); renderAll();
  });
  onSnapshot(doc(db,'trips',tripId,'shared','reservations'), snap=>{
    state.reservations = snap.exists() ? (snap.data().fields || {}) : {};
    renderDetails();
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

async function toggleMoment(id,done){
  state.moments[id]=done; renderMustDo();
  if(db) await setDoc(doc(db,'trips',tripId,'moments',id),{done,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
async function saveRating(id,patch){
  state.ratings[id] = {...(state.ratings[id] || {}), ...patch};
  renderRating(id);
  if(db) await setDoc(doc(db,'trips',tripId,'ratings',id),{...state.ratings[id],updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
async function saveReservations(){
  if(db) await setDoc(doc(db,'trips',tripId,'shared','reservations'),{fields:state.reservations,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
function nextStop(){ return allStops.find(s=>!state.completed[s.id]) || allStops[allStops.length-1]; }
function renderAll(){ renderProgress(); renderUpNext(); renderToday(); renderItinerary(); renderMustDo(); renderDetails(); }
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
  const departure = new Date('2026-07-18T07:29:00-05:00');
  const now = new Date();

  // V9 regression fix: Today should keep the countdown/flight animation before wheels-up.
  // It should not silently turn into the Day 1 checklist just because itinerary features changed.
  if(now < departure){
    $('#today').innerHTML = renderPreTripToday(now, departure);
    return;
  }

  const day=itinerary.find(d=>d.stops.some(s=>!state.completed[s.id])) || itinerary[0];
  $('#today').innerHTML=renderCountdownCard(now, departure, true)+renderLuxuryDayDetail(day); bindStops($('#today'));
}

function renderPreTripToday(now, departure){
  return `
    <section class="countdown-wrap">
      ${renderCountdownCard(now, departure, false)}

      <article class="card flight-card">
        <div class="label">Outbound flight</div>
        <h2>Chicago → Los Angeles</h2>
        <div class="airport-row">
          <div><b>ORD</b><span>Sat, Jul 18</span><strong>7:29 AM CT</strong></div>
          <div class="arrow">→</div>
          <div><b>LAX</b><span>Sat, Jul 18</span><strong>10:00 AM PT</strong></div>
        </div>
        <div class="chips">
          <span class="chip">Delta DL1556</span>
          <span class="chip">Confirmation HGLYMC</span>
          <span class="chip">Seats 14C–14F</span>
          <span class="chip">National pickup 11:30 AM</span>
        </div>
      </article>

      <article class="card pretrip-card">
        <div class="label">Before we fly</div>
        <h2>Do not leave this for the night before</h2>
        <div class="prep-grid">
          <div>✅ Add app to both phones</div>
          <div>🎟️ Alcatraz booked</div>
          <div>🏨 All hotels booked</div>
          <div>🧳 Packing list + chargers</div>
          <div>🚗 National Emerald Aisle booked</div>
          <div>🅿️ Add rental plate to SpotHero after pickup</div>
        </div>
      </article>

      <article class="card tomorrow-card">
        <div class="label">First day preview</div>
        <h2>Arrival day: LA icons → Ventura</h2>
        <p>Keep LA tight: Erewhon, Beverly Hills, Walk of Fame, Griffith Observatory, then get north to Ventura before the day turns into traffic punishment.</p>
      </article>
    </section>`;
}
function renderCountdownCard(now, departure, compact){
  const rawMs = departure - now;
  const ms = Math.max(0, rawMs);
  const totalHours = Math.floor(ms / 36e5);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.max(0, Math.floor((ms % 36e5) / 60000));
  const progress = rawMs <= 0 ? 100 : Math.min(100, Math.max(0, 100 - (ms / (1000*60*60*24*120))*100));
  const launched = rawMs <= 0;
  return `<article class="card countdown-card ${compact?'compact':''}">
    <div class="countdown-top">
      <div>
        <div class="label">Today</div>
        <h2>${launched ? 'Trip is underway' : 'California countdown'}</h2>
        <p>${launched ? 'The countdown did its job. Now follow the current day below.' : 'Next big milestone: wheels up from Chicago.'}</p>
      </div>
      <div class="count-pill">${launched ? 'GO' : days}<span>${launched ? 'time' : 'days'}</span></div>
    </div>
    ${launched ? '' : `<div class="countdown-numbers"><div><strong>${days}</strong><span>Days</span></div><div><strong>${hours}</strong><span>Hours</span></div><div><strong>${minutes}</strong><span>Minutes</span></div></div>`}
    <div class="flight-path" aria-label="Animated flight path from Chicago to Los Angeles">
      <span class="city left">ORD</span>
      <span class="cloud c1">☁️</span>
      <span class="trail"></span>
      <span class="plane">✈️</span>
      <span class="cloud c2">☁️</span>
      <span class="city right">LAX</span>
    </div>
    <div class="mini-bar"><span style="width:${progress}%"></span></div>
    <p class="muted">V13 uses the Luxury Travel App day layout: cleaner expandable daily details, full-day maps, and no picture page.</p>
  </article>`;
}
function renderItinerary(){
  $('#itinerary').innerHTML=itinerary.map(renderDayCard).join('');
  bindDayCards($('#itinerary'));
  bindStops($('#itinerary'));
}
function renderDayCard(d){
  const doneCount = d.stops.filter(s=>state.completed[s.id]).length;
  const total = d.stops.length;
  const fullyDone = doneCount === total;
  const saved = state.collapsedDays['day-'+d.day];
  const collapsed = typeof saved === 'boolean' ? saved : fullyDone;
  return `<section class="day-card card lux-day-card ${collapsed?'collapsed':''} ${fullyDone?'complete':''}" data-day="${d.day}">
    <button class="day-toggle lux-toggle" type="button" aria-expanded="${!collapsed}">
      <span>
        <b>Day ${d.day} · ${d.date}</b>
        <em>${escapeHtml(d.route)} · Sleep: ${escapeHtml(d.sleep)}</em>
      </span>
      <span class="day-meta">${doneCount}/${total} done <strong>${collapsed?'＋':'−'}</strong></span>
    </button>
    <div class="day-body lux-day-body">${renderLuxuryDayDetail(d)}</div>
  </section>`;
}
function bindDayCards(root){
  root.querySelectorAll('.day-card').forEach(card=>{
    const day = card.dataset.day;
    card.querySelector('.day-toggle').addEventListener('click',()=>{
      const nextCollapsed = !card.classList.contains('collapsed');
      toggleDayCollapsed(day,nextCollapsed);
    });
  });
}
async function toggleDayCollapsed(day,collapsed){
  state.collapsedDays['day-'+day]=collapsed; renderItinerary();
  if(db) await setDoc(doc(db,'trips',tripId,'collapsedDays','day-'+day),{collapsed,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
function renderMustDo(){
  const must=allStops.filter(s=>s.tags.some(t=>/Must|Kids|Golden|Full House|Booked|wish/i.test(t)));
  const momentDone = familyMoments.filter(m=>state.moments[m.id]).length;
  $('#mustdo').innerHTML=`<div class="day"><h2>Family must-do moments</h2><p>One shared list. No kid homework. Just the memories we want to collect.</p></div>
  <section class="moment-grid">
    <article class="card moment-summary"><div class="label">Memory progress</div><h2>${momentDone}/${familyMoments.length} moments collected</h2><p>These sync for the family and keep the trip focused on what matters.</p></article>
    ${familyMoments.map(renderMomentCard).join('')}
  </section>
  <div class="day"><h2>Mapped must-do stops</h2><p>These stay tied to the main itinerary and keep the Google Maps buttons you liked.</p></div>`+must.map(renderStop).join('');
  bindMomentCards($('#mustdo'));
  bindStops($('#mustdo'));
}
function renderMomentCard(m){
  const done = !!state.moments[m.id];
  return `<article class="card moment-card ${done?'done':''}">
    <label class="moment-check"><input type="checkbox" data-moment="${m.id}" ${done?'checked':''}/><span></span></label>
    <div class="moment-main"><div class="label">Picked by ${escapeHtml(m.pickedBy)}</div><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.note)}</p><a class="small map" href="${mapUrl(m.map)}" target="_blank" rel="noreferrer">Open map</a></div>
  </article>`;
}
function bindMomentCards(root){
  root.querySelectorAll('input[data-moment]').forEach(input=>input.addEventListener('change',e=>toggleMoment(e.target.dataset.moment,e.target.checked)));
}
function renderDetails(){
  $('#details').innerHTML=`<div class="day"><h2>Reservation vault</h2><p>This is now the operational command center: confirmations, parking, insurance, and the stuff you do not want to dig for in front of tired kids.</p></div>
  <div class="card vault-summary">
    <div class="label">Quick trip facts</div>
    <div class="detail-list">
      <div class="detail"><b>Travelers</b><span>2 adults, 2 children</span></div>
      <div class="detail"><b>Outbound</b><span>Delta DL1556 · HGLYMC · Jul 18 · ORD T5 → LAX T3 · 7:29 AM CT → 10:00 AM PT · seats 14C–14F</span></div>
      <div class="detail"><b>Return</b><span>United UA1777 · GR6P5Y · Jul 25 · SFO → ORD · 2:29 PM PT → 9:03 PM CT · seats 32A/32B/32C/41D</span></div>
      <div class="detail"><b>Rental car</b><span>National Emerald Aisle · pickup LAX Jul 18 11:30 AM · return SFO Jul 25 11:30 AM · est. $346.16</span></div>
      <div class="detail"><b>Alcatraz</b><span>Jul 24 · boarding 12:50 PM · tour 1:05 PM · Booking 79925340</span></div>
      <div class="detail"><b>Ventura</b><span>Jul 18 · Four Points Ventura Harbor Resort · Marriott confirmation 75176420</span></div>
      <div class="detail"><b>Pismo Beach</b><span>Jul 19 · Spyglass Inn · Expedia itinerary 73490781138425</span></div>
      <div class="detail"><b>Monterey / Seaside</b><span>Jul 20 · Embassy Suites Monterey Bay Seaside · Hilton confirmation 81718225</span></div>
      <div class="detail"><b>Monterey / Seaside</b><span>Jul 21 · Embassy Suites Monterey Bay Seaside · Hilton confirmation 80692049</span></div>
      <div class="detail"><b>Half Moon Bay</b><span>Jul 22 · Aristocrat Hotel · Expedia itinerary 73490728060257</span></div>
      <div class="detail"><b>San Francisco</b><span>Jul 23–25 · Hilton SF Financial District · Hilton confirmation 3496618540</span></div>
      <div class="detail"><b>SF Parking</b><span>SpotHero · 20 Trenton St. · Rental ID 127531474 · add license plate</span></div>
      <div class="detail"><b>Share code</b><span>${window.tripConfig.familyCode}</span></div>
    </div>
  </div>
  <section class="reservation-sections">${reservationSections.map(renderReservationSection).join('')}</section>
  <div class="card"><h2>Shared notes</h2><textarea id="notes" class="note" placeholder="Add Wi‑Fi passwords, room numbers, parking notes, backup plans…">${escapeHtml(state.notes || '')}</textarea><p class="danger">These notes sync through Firestore.</p></div>`;
  bindReservationFields($('#details'));
  const notes = $('#notes');
  let timer;
  notes?.addEventListener('input', e=>{
    state.notes = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(()=>saveNotes(e.target.value), 500);
  });
}
function renderReservationSection(section){
  return `<article class="card reservation-section"><h2>${section.icon} ${escapeHtml(section.title)}</h2><div class="reservation-grid">${section.fields.map(renderReservationField).join('')}</div></article>`;
}
function renderReservationField(f){
  const val = state.reservations[f.id] ?? f.value ?? '';
  return `<label class="reservation-field"><span>${escapeHtml(f.label)}</span><input class="reservation-input" data-reservation="${f.id}" value="${escapeHtml(val)}" placeholder="Add note" /></label>`;
}
function bindReservationFields(root){
  let timer;
  root.querySelectorAll('[data-reservation]').forEach(input=>input.addEventListener('input',e=>{
    state.reservations[e.target.dataset.reservation]=e.target.value;
    clearTimeout(timer); timer=setTimeout(saveReservations,500);
  }));
}
async function saveNotes(text){
  if(db) await setDoc(doc(db,'trips',tripId,'shared','notes'),{text,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
function dayHeader(d){return `<div class="day"><h2>Day ${d.day} · ${d.date}</h2><p>${d.route} · Sleep: ${d.sleep}</p></div>`}

function renderLuxuryDayDetail(d){
  const b = dayBriefs[d.day] || {};
  const route = dayMapRoutes[d.day] || {};
  const start = route.origin || d.route.split('→')[0]?.trim() || 'Start';
  const end = route.destination || d.sleep || 'Tonight';
  const highlights = d.stops.filter(s=>!s.tags.some(t=>/Sleep|Hotel|Flight|Rental car|Parking/i.test(t))).slice(0,4);
  const stay = d.stops.find(s=>s.tags.some(t=>/Sleep/i.test(t))) || d.stops[d.stops.length-1];
  return `<section class="lux-detail">
    <div class="lux-hero-card">
      <div class="lux-pill">DAY ${d.day} · ${escapeHtml(d.date)}</div>
      <h2>${escapeHtml(luxDayTitle(d))}</h2>
      <p>${escapeHtml(d.route)}</p>
    </div>

    <div class="lux-route-strip" aria-label="Daily route">
      <div class="lux-route-point"><span></span><b>${escapeHtml(shortPlace(start))}</b></div>
      <div class="lux-route-line"><i></i></div>
      <div class="lux-route-point middle"><span></span><b>${escapeHtml(String(route.waypoints?.[0] || 'Coast'))}</b></div>
      <div class="lux-route-line"><i></i></div>
      <div class="lux-route-point end"><span></span><b>${escapeHtml(shortPlace(end))}</b></div>
    </div>

    <article class="card lux-overview-card">
      <div class="label">Morning summary</div>
      <h2>${escapeHtml(b.must || 'Keep the day beautiful and realistic')}</h2>
      <div class="lux-stat-grid">
        <div><span>Leave by</span><b>${escapeHtml(b.leaveBy || 'Start early')}</b></div>
        <div><span>Driving</span><b>${escapeHtml(b.drive || 'TBD')}</b></div>
        <div><span>Sleep tonight</span><b>${escapeHtml(b.sleep || d.sleep)}</b></div>
        <div><span>Dinner zone</span><b>${escapeHtml(b.dinner || 'Flexible')}</b></div>
      </div>
      <a class="btn lux-map-btn" href="${dayRouteUrl(d.day)}" target="_blank" rel="noreferrer">🗺 Open full-day Google Map</a>
    </article>

    <details class="lux-accordion" open>
      <summary><span>Highlights</span><b>＋</b></summary>
      <div class="lux-highlight-grid">${highlights.map(renderHighlightCard).join('')}</div>
    </details>

    <details class="lux-accordion" open>
      <summary><span>Stay tonight</span><b>＋</b></summary>
      <div class="lux-stay-card">
        <div class="lux-stay-icon">🏨</div>
        <div><strong>${escapeHtml(d.sleep)}</strong><p>${escapeHtml(stay?.desc || 'Reservation details are in the vault.')}</p>${stay ? `<a class="small map" href="${mapUrl(stay.map)}" target="_blank" rel="noreferrer">Hotel map</a>` : ''}</div>
      </div>
    </details>

    <details class="lux-accordion">
      <summary><span>Reminders</span><b>＋</b></summary>
      <div class="lux-reminder-list">
        <div><strong>Watch out</strong><p>${escapeHtml(b.warning || dayReminders[d.day] || 'Do not overpack the day.')}</p></div>
        <div><strong>Leave-by note</strong><p>${escapeHtml(dayReminders[d.day] || 'Keep the day realistic.')}</p></div>
      </div>
    </details>

    <details class="lux-accordion route-checklist" open>
      <summary><span>Full checklist</span><b>＋</b></summary>
      <div class="lux-stop-list">${d.stops.map(renderCompactStop).join('')}</div>
    </details>
  </section>`;
}

function luxDayTitle(d){
  const titles = {
    1:'LA Arrival → Ventura Harbor',
    2:'Santa Barbara + World Cup → Pismo',
    3:'Big Sur Coast Drive',
    4:'Monterey + Carmel Day',
    5:'Santa Cruz → Half Moon Bay',
    6:'Half Moon Bay → San Francisco',
    7:'Alcatraz + San Francisco',
    8:'Fly Home Day'
  };
  return titles[d.day] || d.route;
}
function shortPlace(place){
  return String(place)
    .replace('Los Angeles International Airport LAX','LAX')
    .replace('Four Points by Sheraton Ventura Harbor Resort','Ventura')
    .replace('Spyglass Inn Pismo Beach','Pismo')
    .replace('Embassy Suites by Hilton Monterey Bay Seaside','Monterey')
    .replace('Aristocrat Hotel BW Signature Collection Half Moon Bay CA','Half Moon Bay')
    .replace('Hilton San Francisco Financial District','San Francisco')
    .replace('SFO Rental Car Center','SFO')
    .replace(' San Francisco','')
    .replace(' CA','');
}
function renderHighlightCard(s){
  return `<a class="lux-highlight-card" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">
    <span>${escapeHtml(s.time)}</span>
    <strong>${escapeHtml(s.title)}</strong>
    <em>${escapeHtml(s.desc)}</em>
  </a>`;
}
function renderCompactStop(s){
  const done=!!state.completed[s.id];
  return `<article class="lux-stop stop ${done?'done':''}" data-id="${s.id}">
    <label class="checkwrap"><input type="checkbox" ${done?'checked':''}/><span></span></label>
    <div class="stop-main"><div class="time">${escapeHtml(s.time)}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p>
    <div class="chips">${s.tags.map(t=>`<span class="chip ${t==='Sleep'?'sleep':t==='Drive'?'drive':''}">${escapeHtml(t)}</span>`).join('')}</div>
    <div class="stop-actions"><a class="small map" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">Open map</a></div></div></article>`;
}
function renderMorningBrief(d){
  const b = dayBriefs[d.day] || {};
  const fullMap = dayRouteUrl(d.day);
  return `<article class="card morning-brief">
    <div class="brief-head"><div><div class="label">Morning brief</div><h2>Day ${d.day}: ${escapeHtml(d.route)}</h2></div><div class="leave-pill">${escapeHtml(b.leaveBy || 'Start early')}</div></div>
    <div class="brief-map-row"><a class="btn full-map-link" href="${fullMap}" target="_blank" rel="noreferrer">Open full-day Google Map</a></div>
    <div class="brief-grid">
      <div><span>Wake up</span><b>${escapeHtml(b.wake || 'TBD')}</b></div>
      <div><span>Sleep tonight</span><b>${escapeHtml(b.sleep || d.sleep)}</b></div>
      <div><span>Driving</span><b>${escapeHtml(b.drive || 'TBD')}</b></div>
      <div><span>Main win</span><b>${escapeHtml(b.must || 'Keep it realistic')}</b></div>
      <div><span>Dinner zone</span><b>${escapeHtml(b.dinner || 'Flexible')}</b></div>
      <div><span>Warning</span><b>${escapeHtml(b.warning || dayReminders[d.day] || 'Do not overpack the day.')}</b></div>
    </div>
  </article>`;
}
function renderReminder(d){return `<article class="card reminder-card"><div class="label">Leave-by reminder</div><p><b>${escapeHtml(dayBriefs[d.day]?.leaveBy || 'Start early')}.</b> ${escapeHtml(dayReminders[d.day] || "Keep the day realistic.")}</p></article>`}
function renderStop(s){
  const done=!!state.completed[s.id];
  return `<article class="stop card ${done?'done':''}" data-id="${s.id}">
    <label class="checkwrap"><input type="checkbox" ${done?'checked':''}/><span></span></label>
    <div class="stop-main"><div class="time">${s.time}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p>
    <div class="chips">${s.tags.map(t=>`<span class="chip ${t==='Sleep'?'sleep':t==='Drive'?'drive':''}">${escapeHtml(t)}</span>`).join('')}</div>
    <div class="stop-actions"><a class="small map" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">Open map</a></div>
    ${renderRatingHtml(s.id)}
    </div></article>`;
}
function renderRatingHtml(id){
  const r = state.ratings[id] || {};
  const stars = Number(r.stars || 0);
  return `<div class="rating-box" data-rating-box="${id}"><div class="rating-row"><span>Family rating</span>${[1,2,3,4,5].map(n=>`<button type="button" class="star ${n<=stars?'on':''}" data-star="${n}" aria-label="${n} stars">★</button>`).join('')}</div><input class="quote-input" data-quote="${id}" value="${escapeHtml(r.quote || '')}" placeholder="Favorite moment or kid quote…" /></div>`;
}
function renderRating(id){
  document.querySelectorAll(`[data-rating-box="${id}"]`).forEach(box=>{
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderRatingHtml(id);
    box.replaceWith(wrapper.firstElementChild);
  });
  bindRatingControls(document);
}
function bindStops(root){
  root.querySelectorAll('.stop').forEach(el=>{
    const id=el.dataset.id;
    el.querySelector('input[type=checkbox]').addEventListener('change',e=>toggleDone(id,e.target.checked));
  });
  bindRatingControls(root);
}
function bindRatingControls(root){
  root.querySelectorAll('[data-rating-box]').forEach(box=>{
    const id=box.dataset.ratingBox;
    box.querySelectorAll('[data-star]').forEach(btn=>{
      btn.onclick=()=>saveRating(id,{stars:Number(btn.dataset.star)});
    });
  });
  root.querySelectorAll('[data-quote]').forEach(input=>{
    let timer;
    input.oninput=e=>{
      const id=e.target.dataset.quote;
      state.ratings[id]={...(state.ratings[id]||{}), quote:e.target.value};
      clearTimeout(timer);
      timer=setTimeout(()=>saveRating(id,{quote:e.target.value}),600);
    };
  });
}
function dayRouteUrl(day){
  const r = dayMapRoutes[day];
  if(!r) return "https://www.google.com/maps";
  const params = new URLSearchParams({api:"1", origin:r.origin, destination:r.destination, travelmode:"driving"});
  if(r.waypoints?.length) params.set("waypoints", r.waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
function mapUrl(q){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;}
function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
