import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = window.firebaseConfig;
const tripId = window.tripConfig?.tripId || "california-2026";

const itinerary = [
  {day:1,date:"Sat, Jul 18",route:"LAX → LA icons → Malibu → Ventura",sleep:"Four Points Ventura Harbor Resort",stops:[
    stop("d1-1","7:29–10:00","Delta DL1556: ORD → LAX","Confirmation HGLYMC · Comfort · seats 14C–14F · ORD T5 → LAX T3","LAX Terminal 3",["Flight","Booked"]),
    stop("d1-1b","11:30","Pick up National rental car","Emerald Aisle at LAX. Choose best available vehicle; add plate to SpotHero after pickup.","National Car Rental LAX",["Rental car","Booked"]),
    stop("d1-2","12:15","Hollywood Walk of Fame","TCL Chinese Theatre and Dolby Theatre. Keep this to a focused photo stop.","Hollywood Walk of Fame",["Kids"]),
    stop("d1-3","1:15","Griffith Observatory","Best easy view of the Hollywood Sign.","Griffith Observatory",["Photo"]),
    stop("d1-4","2:30","Beverly Hills / Rodeo Drive","Beverly Hills sign, Rodeo Drive, quick photo stop.","Beverly Hills Sign",["Photo"]),
    stop("d1-5","3:30","Erewhon Santa Monica","Hailey Bieber smoothie, quick food, and bathroom break before the coast drive.","Erewhon Santa Monica",["Kids"]),
    stop("d1-6","4:15","Malibu / Pacific Coast Highway","Take PCH north through Malibu. Make one short scenic stop only; El Matador is the target if parking is easy.","El Matador State Beach",["Coast","Photo"]),
    stop("d1-7","6:15","Continue to Ventura","Stay on the coast toward Ventura. Skip the beach stop if LA traffic has pushed the day late.","Four Points by Sheraton Ventura Harbor Resort",["Drive"]),
    stop("d1-8","Evening","Check in: Four Points Ventura","Booked direct with Marriott. Confirmation 75176420. Check-in 3:00 PM, checkout noon.","Four Points by Sheraton Ventura Harbor Resort",["Sleep","Booked"])
  ]},
  {day:2,date:"Sun, Jul 19",route:"Ventura → Santa Barbara → Pismo",sleep:"Spyglass Inn, Pismo Beach",stops:[
    stop("d2-1","8:30","Breakfast / checkout Ventura","Slow morning at the harbor hotel, then move north.","Four Points by Sheraton Ventura Harbor Resort",["Hotel"]),
    stop("d2-2","9:30","Drive to Santa Barbara","Quick coastal hop from Ventura.","Stearns Wharf",["Drive"]),
    stop("d2-3","10:15","Stearns Wharf / State Street","Beach walk, pier, quick browsing before the World Cup window.","Stearns Wharf",["Coast"]),
    stop("d2-4","12:00 PT","World Cup Final","Protect this window. Watch in Santa Barbara or near Pismo depending family energy.","Santa Barbara CA",["Must do"]),
    stop("d2-5","Afternoon","Solvang / OstrichLand USA","Optional if the match timing and family energy cooperate.","OstrichLand USA",["Kids","Optional"]),
    stop("d2-6","4:00","Check in: Spyglass Inn","Booked via Expedia. Itinerary 73490781138425. Check-in 4:00 PM, checkout 11:00 AM.","Spyglass Inn Pismo Beach",["Sleep","Booked"]),
    stop("d2-7","Evening","Pismo sunset","Beach, dinner, and easy night after the World Cup day.","Pismo Pier",["Coast"])
  ]},
  {day:3,date:"Mon, Jul 20",route:"Pismo → Big Sur → Monterey",sleep:"Embassy Suites Monterey Bay Seaside",stops:[
    stop("d3-1","8:30","Leave Spyglass Inn","Big scenic day. Pack snacks and water.","Spyglass Inn Pismo Beach",["Drive"]),
    stop("d3-2","10:00","Elephant Seal Vista Point","Wildlife stop the kids will remember.","Elephant Seal Vista Point",["Must do"]),
    stop("d3-3","11:30","Ragged Point","Lunch or snack with ocean views.","Ragged Point",["Food"]),
    stop("d3-4","1:00","McWay Falls","Iconic Big Sur waterfall overlook.","McWay Falls",["Photo"]),
    stop("d3-5","2:30","Bixby Bridge","Quick photo stop. Watch parking.","Bixby Creek Bridge",["Photo"]),
    stop("d3-6","5:30","Check in: Embassy Suites","Booked direct with Hilton. Confirmation 81718225. Check-in 4:00 PM, checkout 11:00 AM.","Embassy Suites by Hilton Monterey Bay Seaside",["Sleep","Booked"])
  ]},
  {day:4,date:"Tue, Jul 21",route:"Monterey / Carmel",sleep:"Embassy Suites Monterey Bay Seaside",stops:[
    stop("d4-1","9:30","Monterey Bay Aquarium","Main event. Do not rush it.","Monterey Bay Aquarium",["Kids","Must do"]),
    stop("d4-2","12:30","Cannery Row lunch","Walkable lunch after aquarium.","Cannery Row",["Food"]),
    stop("d4-3","2:00","17-Mile Drive","Lone Cypress and coastline viewpoints.","Lone Cypress Pebble Beach",["Drive"]),
    stop("d4-4","4:00","Carmel-by-the-Sea","Beach, shops, relaxed walk.","Carmel-by-the-Sea",["Coast"]),
    stop("d4-5","Evening","Lovers Point","Easy sunset if everyone has energy.","Lovers Point",["Coast"]),
    stop("d4-6","Night","Second night: Embassy Suites","Booked direct with Hilton. Confirmation 80692049. Check guest count shows 4, not 1.","Embassy Suites by Hilton Monterey Bay Seaside",["Sleep","Booked"])
  ]},
  {day:5,date:"Wed, Jul 22",route:"Monterey → Santa Cruz → Half Moon Bay",sleep:"Aristocrat Hotel, BW Signature Collection",stops:[
    stop("d5-1","9:30","Santa Cruz Beach Boardwalk","Rides, arcade, beach energy.","Santa Cruz Beach Boardwalk",["Kids"]),
    stop("d5-2","12:30","Natural Bridges State Beach","Quick scenic stop.","Natural Bridges State Beach",["Coast"]),
    stop("d5-3","2:00","Coastal drive to Half Moon Bay","Keep the coast vibe. Do not rush into San Francisco tonight.","Half Moon Bay",["Drive"]),
    stop("d5-4","Optional","Pigeon Point Lighthouse","Quick scenic photo stop if everyone still has energy.","Pigeon Point Lighthouse",["Photo","Optional"]),
    stop("d5-5","5:00","Check in: Aristocrat Hotel","Booked via Expedia. Itinerary 73490728060257. Free parking, breakfast, Wi‑Fi.","Aristocrat Hotel BW Signature Collection Half Moon Bay",["Sleep","Booked"]),
    stop("d5-6","Evening","Half Moon Bay sunset / dinner","Beach, harbor, or simple dinner. This is decompression night.","Half Moon Bay State Beach",["Coast"])
  ]},
  {day:6,date:"Thu, Jul 23",route:"Half Moon Bay → San Francisco",sleep:"Hilton San Francisco Financial District",stops:[
    stop("d6-1","8:30","Breakfast + checkout Half Moon Bay","Use the included breakfast, then move toward SF without dragging.","Aristocrat Hotel BW Signature Collection Half Moon Bay",["Hotel"]),
    stop("d6-2","9:30","Drive into San Francisco","Aim to be in the city late morning. Parking starts at 1:30 PM.","Hilton San Francisco Financial District",["Drive"]),
    stop("d6-3","Late AM","Golden Gate / Palace of Fine Arts","Start with an iconic SF view before hotel logistics take over.","Palace of Fine Arts",["Photo"]),
    stop("d6-4","1:30","SpotHero parking begins","20 Trenton St. Spots #1–4 only. Add rental plate after pickup.","20 Trenton St San Francisco",["Parking","Booked"]),
    stop("d6-5","Afternoon","Check in: Hilton SF Financial District","Booked direct with Hilton. Confirmation 3496618540.","Hilton San Francisco Financial District",["Sleep","Booked"]),
    stop("d6-6","Afternoon","Fisherman’s Wharf + Pier 39","Sea lions, Boudin, waterfront walk.","Pier 39 Sea Lions",["Must do"]),
    stop("d6-7","Evening","Lombard Street zig-zag road","Best view is from Leavenworth looking uphill.","Lombard Street Hyde Leavenworth",["Must do","Photo"])
  ]},
  {day:7,date:"Fri, Jul 24",route:"San Francisco / Alcatraz",sleep:"Hilton San Francisco Financial District",stops:[
    stop("d7-1","Morning","Easy Fisherman’s Wharf morning","Keep this light. Alcatraz is already locked.","Fisherman's Wharf",["Coast"]),
    stop("d7-2","12:30","Be at Pier 33","Boarding is 12:50 PM. Do not arrive late.","Pier 33 Alcatraz Landing",["Ticket"]),
    stop("d7-3","1:05","Alcatraz Day Tour","Booking ID 79925340 · 2 adults, 2 children.","Alcatraz Island",["Must do","Booked"]),
    stop("d7-4","After tour","Boudin / Pier 39 / Ghirardelli","Pick based on energy. No forced march.","Boudin Bakery Fisherman's Wharf",["Food"]),
    stop("d7-5","Late PM","Painted Ladies / Full House house","Add this if everyone still has legs.","Painted Ladies San Francisco",["Optional"])
  ]},
  {day:8,date:"Sat, Jul 25",route:"Fly home",sleep:"Home",stops:[
    stop("d8-1","Morning","Breakfast and pack","Do not cram a full sightseeing day before a flight. SpotHero parking ends at noon.","Hilton San Francisco Financial District",["Hotel"]),
    stop("d8-2","Optional","Battery Spencer / Golden Gate final view","Only if timing is comfortable.","Battery Spencer",["Optional"]),
    stop("d8-3","11:30","Return National rental car","Return at SFO by 11:30 AM. SpotHero parking ends at noon.","SFO Rental Car Center",["Rental car","Booked"]),
    stop("d8-4","2:29","United UA1777: SFO → ORD","Confirmation GR6P5Y · arrives 9:03 PM CT · seats 32A, 32B, 32C, 41D.","SFO",["Flight","Booked"])
  ]}
];
function stop(id,time,title,desc,map,tags){return {id,time,title,desc,map,tags};}

const walkingByDay = {
  1:{level:"Medium–High",miles:"2–3.5 miles",note:"Airport logistics plus several short LA stops and one Malibu viewpoint. Mostly flat, but fragmented walking and standing add up."},
  2:{level:"Low–Medium",miles:"1–2 miles",note:"Mostly car-to-stop. Santa Barbara, Solvang, or OstrichLand can add walking depending on how long the family wanders."},
  3:{level:"Low–Medium",miles:"1–2 miles",note:"Car-heavy scenic day with short overlooks. Driving time and repeated getting in and out of the car are the bigger strain."},
  4:{level:"High",miles:"2.5–4 miles",note:"The aquarium is standing-heavy, and Carmel can be hilly. Keep the afternoon flexible and skip extra wandering if needed."},
  5:{level:"Medium–High",miles:"2–4 miles",note:"The Boardwalk and beach stops can quietly add up. Use benches and avoid crossing the whole Boardwalk repeatedly."},
  6:{level:"Medium–High",miles:"2.5–4 miles",note:"San Francisco adds hills, waterfront distances, and parking-to-attraction walking. Use the car or rideshare strategically."},
  7:{level:"High",miles:"3–5 miles",note:"Alcatraz includes slopes, ramps, and prolonged standing. The tram is the best backup if the uphill walk feels like too much."},
  8:{level:"Low–Medium",miles:"1–2 miles",note:"Mostly checkout, rental-car return, and airport walking. Leave extra time so the logistics do not become a rush."}
};

const walkingByStop = {
  "d1-1":"Medium · airport terminals, baggage claim, and shuttle logistics",
  "d1-1b":"Low–Medium · rental facility walking and choosing/loading the car",
  "d1-2":"Low · short store and lunch stop",
  "d1-3":"Low–Medium · flat photo stop with optional browsing",
  "d1-4":"Medium · crowded sidewalks and standing",
  "d1-5":"Medium · short uphill areas and standing at viewpoints",
  "d1-6":"Low · driving break",
  "d1-7":"Low · hotel check-in",
  "d2-1":"Low · hotel and harbor area",
  "d2-2":"Low · driving",
  "d2-3":"Medium · pier and State Street walking; mostly flat",
  "d2-4":"Low · seated viewing",
  "d2-5":"Medium · uneven ground and optional wandering",
  "d2-6":"Low · hotel check-in",
  "d2-7":"Low–Medium · optional beach or pier walk",
  "d3-1":"Low · driving",
  "d3-2":"Low · short paved walk from parking",
  "d3-3":"Low–Medium · viewpoint and restaurant grounds",
  "d3-4":"Medium · short overlook trail; check current access",
  "d3-5":"Low · quick roadside photo stop",
  "d3-6":"Low · hotel check-in",
  "d4-1":"High · several hours of slow walking and standing",
  "d4-2":"Medium · flat but crowded Cannery Row walking",
  "d4-3":"Low · mostly driving with short viewpoint stops",
  "d4-4":"Medium–High · hilly streets and optional beach slope",
  "d4-5":"Low–Medium · short coastal walk if energy remains",
  "d4-6":"Low · hotel return",
  "d5-1":"High · Boardwalk distances, standing, and repeated movement",
  "d5-2":"Low–Medium · short paths and beach overlook",
  "d5-3":"Low · driving",
  "d5-4":"Low · quick viewpoint near parking",
  "d5-5":"Low · hotel check-in",
  "d5-6":"Low–Medium · optional beach or harbor walk",
  "d6-1":"Low · breakfast and checkout",
  "d6-2":"Low · driving",
  "d6-3":"Medium · viewpoint walking and some uneven ground",
  "d6-4":"Medium · walk from parking to hotel or attractions",
  "d6-5":"Low · hotel check-in",
  "d6-6":"High · long waterfront distances and crowds",
  "d6-7":"Medium–High · steep hill; view from the bottom to reduce climbing",
  "d7-1":"Low–Medium · keep waterfront wandering controlled",
  "d7-2":"Medium · pier approach, queueing, and standing",
  "d7-3":"High · steep uphill route, ramps, and prolonged standing",
  "d7-4":"Medium · waterfront walking; choose one area",
  "d7-5":"Medium · park paths and nearby hills",
  "d8-1":"Low · hotel logistics",
  "d8-2":"Low–Medium · uneven viewpoint area; optional",
  "d8-3":"Medium · unloading, rental return, and airport transfer",
  "d8-4":"Medium · airport terminal walking"
};

const dayBriefs = {
  1:{wake:"Naperville / ORD",sleep:"Ventura",drive:"4–5.5 hrs total",must:"Delta DL1556, LA icons, Malibu / PCH",leaveBy:"Reach Santa Monica by 3:30 PM and Malibu by about 4:15 PM",dinner:"Ventura Harbor",warning:"Malibu is part of the route, but the beach stop is optional. If traffic runs late, stay on PCH and keep moving to Ventura."},
  2:{wake:"Ventura",sleep:"Pismo Beach",drive:"3–4.5 hrs",must:"World Cup Final + Pismo sunset",leaveBy:"Leave Ventura by 9:30 AM",dinner:"Pismo Pier area",warning:"Protect the World Cup Final window. Solvang/OstrichLand is optional."},
  3:{wake:"Pismo Beach",sleep:"Seaside / Monterey",drive:"5–6 hrs with stops",must:"Elephant seals, McWay Falls, Bixby Bridge",leaveBy:"Leave Pismo by 8:30 AM",dinner:"Monterey / Cannery Row",warning:"Gas, snacks, bathrooms before Big Sur. Cell service gets spotty."},
  4:{wake:"Seaside / Monterey",sleep:"Seaside / Monterey",drive:"Light local driving",must:"Monterey Bay Aquarium",leaveBy:"Be at Aquarium by 9:30 AM",dinner:"Carmel or Monterey",warning:"Aquarium first. Also fix Hilton guest count to 4 if it still shows 1."},
  5:{wake:"Seaside / Monterey",sleep:"Half Moon Bay",drive:"3–4 hrs",must:"Santa Cruz Boardwalk + HMB sunset",leaveBy:"Leave Santa Cruz by 12:30 PM",dinner:"Half Moon Bay",warning:"Do not push into San Francisco tonight."},
  6:{wake:"Half Moon Bay",sleep:"San Francisco",drive:"45–75 min + city logistics",must:"Golden Gate / Wharf / Lombard",leaveBy:"Leave HMB by 9:30 AM",dinner:"North Beach / Chinatown / Wharf",warning:"Parking starts 1:30 PM at 20 Trenton. Add rental plate in SpotHero."},
  7:{wake:"San Francisco",sleep:"San Francisco",drive:"Minimal",must:"Alcatraz Day Tour",leaveBy:"Be at Pier 33 by 12:30 PM",dinner:"Embarcadero / Wharf",warning:"Alcatraz boarding is locked. Missing it is not recoverable."},
  8:{wake:"San Francisco",sleep:"Home",drive:"Hotel → SFO",must:"Return car + United UA1777",leaveBy:"Leave hotel by 11:00 AM",dinner:"Home",warning:"SpotHero parking ends at noon. United departs 2:29 PM."}
};

const dayMapRoutes = {
  1:{origin:"Los Angeles International Airport LAX",destination:"Four Points by Sheraton Ventura Harbor Resort",waypoints:["Hollywood Walk of Fame","Griffith Observatory","Beverly Hills Sign","Erewhon Santa Monica","El Matador State Beach"]},
  2:{origin:"Four Points by Sheraton Ventura Harbor Resort",destination:"Spyglass Inn Pismo Beach",waypoints:["Stearns Wharf Santa Barbara","Solvang CA","OstrichLand USA"]},
  3:{origin:"Spyglass Inn Pismo Beach",destination:"Embassy Suites by Hilton Monterey Bay Seaside",waypoints:["Elephant Seal Vista Point San Simeon CA","Ragged Point CA","McWay Falls CA","Bixby Creek Bridge CA"]},
  4:{origin:"Embassy Suites by Hilton Monterey Bay Seaside",destination:"Embassy Suites by Hilton Monterey Bay Seaside",waypoints:["Monterey Bay Aquarium","Cannery Row Monterey","Lone Cypress Pebble Beach","Carmel-by-the-Sea CA","Lovers Point Park Pacific Grove"]},
  5:{origin:"Embassy Suites by Hilton Monterey Bay Seaside",destination:"Aristocrat Hotel BW Signature Collection Half Moon Bay CA",waypoints:["Santa Cruz Beach Boardwalk","Natural Bridges State Beach","Pigeon Point Lighthouse"]},
  6:{origin:"Aristocrat Hotel BW Signature Collection Half Moon Bay CA",destination:"Hilton San Francisco Financial District",waypoints:["Palace of Fine Arts San Francisco","20 Trenton St San Francisco","Pier 39 Sea Lions","Lombard Street Hyde Leavenworth"]},
  7:{origin:"Hilton San Francisco Financial District",destination:"Hilton San Francisco Financial District",waypoints:["Fisherman's Wharf San Francisco","Pier 33 Alcatraz Landing","Boudin Bakery Fisherman's Wharf","Pier 39","Painted Ladies San Francisco"]},
  8:{origin:"Hilton San Francisco Financial District",destination:"SFO Rental Car Center",waypoints:["Battery Spencer"]}
};

const stays = [
  {night:"Night 1",date:"Jul 18–19",city:"Ventura",hotel:"Four Points by Sheraton Ventura Harbor Resort",brand:"Marriott",source:"Direct",confirmation:"75176420",checkin:"Jul 18 · 3:00 PM",checkout:"Jul 19 · 12:00 PM",map:"Four Points by Sheraton Ventura Harbor Resort",note:"Harbor base that keeps the trip moving north."},
  {night:"Night 2",date:"Jul 19–20",city:"Pismo Beach",hotel:"Spyglass Inn",brand:"Expedia",source:"Expedia",confirmation:"73490781138425",checkin:"Jul 19 · 4:00 PM",checkout:"Jul 20 · 11:00 AM",map:"Spyglass Inn Pismo Beach",note:"8.8/10 Excellent shown in Expedia."},
  {night:"Night 3",date:"Jul 20–21",city:"Seaside / Monterey",hotel:"Embassy Suites by Hilton Monterey Bay Seaside",brand:"Hilton",source:"Direct",confirmation:"81718225",checkin:"Jul 20 · 4:00 PM",checkout:"Jul 21 · 11:00 AM",map:"Embassy Suites by Hilton Monterey Bay Seaside",note:"First Monterey base night. Breakfast-friendly family choice."},
  {night:"Night 4",date:"Jul 21–22",city:"Seaside / Monterey",hotel:"Embassy Suites by Hilton Monterey Bay Seaside",brand:"Hilton",source:"Direct",confirmation:"80692049",checkin:"Jul 21 · 4:00 PM",checkout:"Jul 22 · 11:00 AM",map:"Embassy Suites by Hilton Monterey Bay Seaside",note:"Check that this reservation shows 4 guests, not 1."},
  {night:"Night 5",date:"Jul 22–23",city:"Half Moon Bay",hotel:"Aristocrat Hotel, BW Signature Collection",brand:"Expedia",source:"Expedia",confirmation:"73490728060257",checkin:"Jul 22 · 3:00 PM",checkout:"Jul 23 · 11:00 AM",map:"Aristocrat Hotel BW Signature Collection Half Moon Bay CA",note:"Free continental breakfast, self-parking, and Wi‑Fi."},
  {night:"Nights 6–7",date:"Jul 23–25",city:"San Francisco",hotel:"Hilton San Francisco Financial District",brand:"Hilton",source:"Direct",confirmation:"3496618540",checkin:"Jul 23",checkout:"Jul 25",map:"Hilton San Francisco Financial District",note:"Two-night SF base. SpotHero parking is separate."}
];

const vaultSections = [
  {title:"Flights",icon:"✈️",items:[
    {title:"Delta DL1556 · ORD → LAX",meta:"Jul 18 · 7:29 AM CT → 10:00 AM PT · Comfort · seats 14C–14F · ORD T5 → LAX T3",confirm:"HGLYMC"},
    {title:"United UA1777 · SFO → ORD",meta:"Jul 25 · 2:29 PM PT → 9:03 PM CT · seats 32A/32B/32C/41D",confirm:"GR6P5Y"}
  ]},
  {title:"Car + Parking",icon:"🚗",items:[
    {title:"National Emerald Aisle",meta:"Pickup LAX Jul 18 11:30 AM · return SFO Jul 25 11:30 AM · estimated total $346.16",confirm:"Rental booked"},
    {title:"SpotHero · 20 Trenton St.",meta:"Jul 23 1:30 PM → Jul 25 12:00 PM · Spots #1, #2, #3 or #4 only · add rental plate after pickup",confirm:"127531474"}
  ]},
  {title:"Tickets",icon:"🎟️",items:[
    {title:"Alcatraz Day Tour",meta:"Jul 24 · be at Pier 33 by 12:30 PM · boarding 12:50 PM · tour 1:05 PM · 2 adults, 2 children",confirm:"79925340"}
  ]},
  {title:"Hotels",icon:"🏨",items:stays.map(s=>({title:`${s.city} · ${s.hotel}`,meta:`${s.date} · ${s.source} · ${s.note}`,confirm:s.confirmation}))},
  {title:"Action items",icon:"⚠️",items:[
    {title:"Add rental car plate to SpotHero",meta:"Do this after National pickup at LAX so SF parking is clean.",confirm:"After pickup"},
    {title:"Fix Embassy Suites guest count",meta:"Second Monterey reservation screenshot showed 1 guest. Update to 4 guests.",confirm:"80692049"},
    {title:"Check United seats",meta:"Ayesha is currently separate in 41D. Keep checking, but do not overpay.",confirm:"UA1777"}
  ]}
];

const familyMoments = [
  {id:"moment-erewhon",pickedBy:"Kids",title:"Erewhon smoothie",map:"Erewhon Santa Monica",note:"Quick, fun, and overpriced. Do it once."},
  {id:"moment-malibu",pickedBy:"Family",title:"Malibu coast drive",map:"El Matador State Beach",note:"PCH is the experience. Stop at El Matador only if parking and energy cooperate."},
  {id:"moment-walkoffame",pickedBy:"Family",title:"Hollywood Walk of Fame",map:"Hollywood Walk of Fame",note:"Photo stop, not a whole afternoon."},
  {id:"moment-hollywoodsign",pickedBy:"Kids",title:"Hollywood Sign view",map:"Griffith Observatory",note:"Griffith Observatory gives the easiest family view."},
  {id:"moment-ostrich",pickedBy:"Family",title:"OstrichLand USA",map:"OstrichLand USA",note:"Weird enough that the kids will remember it."},
  {id:"moment-seals",pickedBy:"Family",title:"Elephant seals",map:"Elephant Seal Vista Point",note:"Wildlife without hiking. Perfect road-trip stop."},
  {id:"moment-aquarium",pickedBy:"Family",title:"Monterey Bay Aquarium",map:"Monterey Bay Aquarium",note:"Real must-do. Don’t rush it."},
  {id:"moment-lombard",pickedBy:"Dad",title:"Lombard Street",map:"Lombard Street Hyde Leavenworth",note:"Best photo angle: Leavenworth looking uphill."},
  {id:"moment-alcatraz",pickedBy:"Booked",title:"Alcatraz",map:"Pier 33 Alcatraz Landing",note:"Boarding is 12:50 PM. No messing around."}
];

const allStops = itinerary.flatMap(d=>d.stops.map(s=>({...s,day:d.day,date:d.date,route:d.route,sleep:d.sleep})));
const $ = sel => document.querySelector(sel);
let app, auth, db, userId = null;
let selectedDay = 1;
let state = {completed:{}, moments:{}, notes:""};

function init(){
  wireTabs();
  wireShare();
  renderAll();
  connectFirebase();
}

function wireTabs(){
  document.querySelectorAll('.tabbar button').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tabbar button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    $('#'+btn.dataset.tab).classList.add('active');
  }));
}

function wireShare(){
  $('#shareBtn')?.addEventListener('click', async()=>{
    const data = {title:'Malik Family Adventures', text:'California Coast trip app', url:location.href};
    if(navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); toast('Link copied'); }
  });
}

async function connectFirebase(){
  try{
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    await signInAnonymously(auth);
    onAuthStateChanged(auth, user=>{ if(user){ userId=user.uid; subscribe(); }});
  }catch(e){
    console.error(e);
    updateSync('Local only');
  }
}
function subscribe(){
  updateSync('Live sync connected');
  onSnapshot(collection(db,'trips',tripId,'completed'), snap=>{
    state.completed={}; snap.forEach(d=>state.completed[d.id]=!!d.data().done); renderAll();
  });
  onSnapshot(collection(db,'trips',tripId,'moments'), snap=>{
    state.moments={}; snap.forEach(d=>state.moments[d.id]=!!d.data().done); renderAll();
  });
  onSnapshot(doc(db,'trips',tripId,'shared','notes'), snap=>{
    state.notes = snap.exists() ? (snap.data().text || '') : ''; renderVault();
  });
}
function updateSync(text){ document.querySelectorAll('[data-sync]').forEach(el=>{ el.textContent=text; el.classList.toggle('connected', /connected/i.test(text)); }); }

async function toggleDone(id,done){
  state.completed[id]=done; renderAll();
  if(db) await setDoc(doc(db,'trips',tripId,'completed',id),{done,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
async function toggleMoment(id,done){
  state.moments[id]=done; renderRoute();
  if(db) await setDoc(doc(db,'trips',tripId,'moments',id),{done,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}
async function saveNotes(text){
  state.notes=text;
  if(db) await setDoc(doc(db,'trips',tripId,'shared','notes'),{text,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true});
}

function renderAll(){ renderToday(); renderRoute(); renderStays(); renderVault(); }

function renderToday(){
  const departure = new Date('2026-07-18T07:29:00-05:00');
  const now = new Date();
  const next = nextStop();
  const day = itinerary.find(d=>d.day === (next?.day || 1)) || itinerary[0];
  const beforeTrip = now < departure;
  $('#today').innerHTML = `
    <section class="stack">
      ${renderCountdown(now, departure)}
      ${beforeTrip ? renderPreTripNext() : renderNextMove(next)}
      ${renderCompactFlow()}
      <article class="card">
        <div class="label">Today command center</div>
        <h2>${beforeTrip ? 'Before we fly' : `Day ${day.day}: ${escapeHtml(day.route)}`}</h2>
        <p class="muted">${beforeTrip ? 'The app is ready. The only operational items left are final pre-flight checks, guest-count cleanup, and adding the rental plate after pickup.' : escapeHtml(dayBriefs[day.day]?.warning || 'Keep the day realistic.')}</p>
        <div class="actions-row" style="margin-top:14px">
          <a class="btn" href="${dayRouteUrl(day.day)}" target="_blank" rel="noreferrer">Open today’s map</a>
          <button class="btn secondary" data-open-tab="route" data-day-jump="${day.day}">View day</button>
        </div>
      </article>
    </section>`;
  bindToday();
}

function renderPreTripNext(){
  return `<article class="card next-card">
    <div>
      <div class="label">Next move</div>
      <h2>Delta DL1556 · ORD → LAX</h2>
      <p>Sat, Jul 18 · 7:29 AM CT → 10:00 AM PT · seats 14C–14F · confirmation HGLYMC</p>
      <div class="next-actions">
        <a class="btn" href="${dayRouteUrl(1)}" target="_blank" rel="noreferrer">Day 1 Map</a>
        <a class="btn secondary" href="${mapUrl('LAX Terminal 3')}" target="_blank" rel="noreferrer">LAX</a>
        <a class="btn gold" href="${mapUrl('National Car Rental LAX')}" target="_blank" rel="noreferrer">Rental</a>
      </div>
    </div>
    <span class="status-dot" data-sync>Connecting…</span>
  </article>`;
}
function renderNextMove(n){
  return `<article class="card next-card">
    <div>
      <div class="label">Next move</div>
      <h2>${escapeHtml(n.title)}</h2>
      <p>${escapeHtml(n.date)} · ${escapeHtml(n.time)} · ${escapeHtml(n.route)}</p>
      <div class="next-actions">
        <a class="btn" href="${mapUrl(n.map)}" target="_blank" rel="noreferrer">Open Map</a>
        <button class="btn secondary" data-mark-done="${n.id}">Mark Done</button>
      </div>
    </div>
    <span class="status-dot" data-sync>Connecting…</span>
  </article>`;
}
function renderCountdown(now, departure){
  const rawMs = departure - now;
  const ms = Math.max(0, rawMs);
  const totalMinutes = Math.floor(ms/60000);
  const days = Math.floor(totalMinutes/(60*24));
  const hours = Math.floor((totalMinutes%(60*24))/60);
  const minutes = totalMinutes%60;
  const launched = rawMs <= 0;
  return `<article class="hero-lite">
    <div class="count-shell">
      <div class="count-pill"><b>${launched ? 'GO' : days}</b><span>${launched ? 'time' : 'days'}</span></div>
      <div class="count-meta">
        <div class="label">California countdown</div>
        <h3>${launched ? 'Trip is underway' : 'Wheels up from Chicago'}</h3>
        <p>${launched ? 'Follow the Route tab for the current day.' : 'Delta DL1556 leaves ORD at 7:29 AM CT on Sat, Jul 18.'}</p>
        ${launched ? '' : `<div class="count-row"><div class="mini-stat"><strong>${days}</strong><span>Days</span></div><div class="mini-stat"><strong>${hours}</strong><span>Hours</span></div><div class="mini-stat"><strong>${minutes}</strong><span>Minutes</span></div></div>`}
      </div>
    </div>
    <div class="flight-path"><span class="city left">ORD</span><span class="cloud c1">☁️</span><span class="trail"></span><span class="plane">✈️</span><span class="cloud c2">☁️</span><span class="city right">LAX</span></div>
  </article>`;
}
function renderCompactFlow(){
  const flow = ['ORD','LAX','Ventura','Pismo','Monterey','Half Moon Bay','San Francisco','SFO','ORD'];
  return `<article class="card flow-card"><div class="label">Trip flow</div><div class="flow-line">${flow.map(x=>`<span class="flow-stop">${escapeHtml(x)}</span>`).join('')}</div></article>`;
}
function bindToday(){
  $('[data-mark-done]')?.addEventListener('click',e=>toggleDone(e.currentTarget.dataset.markDone,true));
  $('[data-open-tab]')?.addEventListener('click',e=>{
    selectedDay = Number(e.currentTarget.dataset.dayJump || 1);
    activateTab('route'); renderRoute();
  });
  updateSync(db ? 'Live sync connected' : 'Connecting…');
}

function renderRoute(){
  $('#route').innerHTML = `
    <div class="section-head">
      <div><h2>Route</h2><p>Clean road-trip view. Tap a day to open the luxury daily plan with full Google Maps link.</p></div>
      <span class="status-dot" data-sync>Connecting…</span>
    </div>
    <section class="route-rail">${itinerary.map(renderRouteCard).join('')}</section>
    <div class="section-head"><div><h2>Family moments</h2><p>Memory list moved here so the old Must-do tab can stay gone.</p></div></div>
    <section class="moment-grid">${familyMoments.map(renderMoment).join('')}</section>`;
  bindRoute(); updateSync(db ? 'Live sync connected' : 'Connecting…');
}
function renderRouteCard(d){
  const done = d.stops.filter(s=>state.completed[s.id]).length;
  const open = d.day === selectedDay;
  return `<article class="card route-card ${open?'open':''}" data-day-card="${d.day}">
    <div class="route-top">
      <div class="day-bubble">${d.day}</div>
      <div class="route-title"><h3>${escapeHtml(luxDayTitle(d))}</h3><p>${escapeHtml(d.date)} · ${escapeHtml(d.route)} · Sleep: ${escapeHtml(d.sleep)}</p></div>
      <div class="progress-mini"><span class="walk-mini ${walkClass(walkingByDay[d.day]?.level)}">${escapeHtml(walkingByDay[d.day]?.level || '—')}</span>${done}/${d.stops.length}<br/>done</div>
    </div>
    <div class="route-actions">
      <button class="small-btn dark" data-select-day="${d.day}">${open?'Close day':'View day'}</button>
      <a class="small-btn" href="${dayRouteUrl(d.day)}" target="_blank" rel="noreferrer">Full-day map</a>
      <a class="small-btn" href="${mapUrl(d.sleep)}" target="_blank" rel="noreferrer">Hotel map</a>
    </div>
    <div class="daily-detail">${open ? renderDailyDetail(d) : ''}</div>
  </article>`;
}
function renderDailyDetail(d){
  const b = dayBriefs[d.day];
  const r = dayMapRoutes[d.day];
  const highlights = d.stops.filter(s=>!s.tags.some(t=>/Sleep|Flight|Rental|Parking|Hotel/i.test(t))).slice(0,4);
  return `<div>
    <div class="lux-day-hero"><div class="label">Day ${d.day} · ${escapeHtml(d.date)}</div><h2>${escapeHtml(luxDayTitle(d))}</h2><p>${escapeHtml(d.route)}</p></div>
    <div class="route-strip"><div class="point"><i></i>${escapeHtml(shortPlace(r.origin))}</div><div class="connector"></div><div class="point mid"><i></i>${escapeHtml(shortPlace(r.waypoints?.[0] || 'Coast'))}</div><div class="connector"></div><div class="point end"><i></i>${escapeHtml(shortPlace(r.destination))}</div></div>
    <article class="card" style="box-shadow:none">
      <div class="label">Morning summary</div>
      <h2>${escapeHtml(b.must)}</h2>
      <div class="overview-grid">
        <div><span>Leave by</span><b>${escapeHtml(b.leaveBy)}</b></div>
        <div><span>Driving</span><b>${escapeHtml(b.drive)}</b></div>
        <div><span>Walking load</span><b>${escapeHtml(walkingByDay[d.day]?.level || '—')} · ${escapeHtml(walkingByDay[d.day]?.miles || '')}</b></div>
        <div><span>Sleep tonight</span><b>${escapeHtml(b.sleep)}</b></div>
        <div><span>Dinner zone</span><b>${escapeHtml(b.dinner)}</b></div>
      </div>
      <a class="btn" href="${dayRouteUrl(d.day)}" target="_blank" rel="noreferrer">Open full-day Google Map</a>
    </article>
    <article class="walking-card ${walkClass(walkingByDay[d.day]?.level)}">
      <div class="walking-icon">${walkIcon(walkingByDay[d.day]?.level)}</div>
      <div><div class="label">Walking load · ${escapeHtml(walkingByDay[d.day]?.level || '—')}</div><h3>${escapeHtml(walkingByDay[d.day]?.miles || '')} expected</h3><p>${escapeHtml(walkingByDay[d.day]?.note || '')}</p></div>
    </article>
    <details class="accordion" open><summary>Highlights <span>＋</span></summary><div class="accordion-content"><div class="highlight-grid">${highlights.map(renderHighlight).join('')}</div></div></details>
    <details class="accordion" open><summary>Stay tonight <span>＋</span></summary><div class="accordion-content"><p><b>${escapeHtml(d.sleep)}</b></p><p class="muted">${escapeHtml((d.stops.find(s=>s.tags.includes('Sleep')) || {}).desc || 'Reservation details are in Stays and Vault.')}</p></div></details>
    <details class="accordion"><summary>Reminders <span>＋</span></summary><div class="accordion-content"><p>${escapeHtml(b.warning)}</p></div></details>
    <details class="accordion" open><summary>Checklist <span>＋</span></summary><div class="accordion-content"><div class="check-list">${d.stops.map(renderCheckRow).join('')}</div></div></details>
  </div>`;
}
function renderHighlight(s){
  return `<a class="highlight" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer"><span>${escapeHtml(s.time)}</span><strong>${escapeHtml(s.title)}</strong><em>${escapeHtml(s.desc)}</em>${walkingByStop[s.id]?`<small class="walk-note">🚶 ${escapeHtml(walkingByStop[s.id])}</small>`:''}</a>`;
}
function renderCheckRow(s){
  const done = !!state.completed[s.id];
  return `<article class="check-row ${done?'done':''}">
    <input type="checkbox" data-stop="${s.id}" ${done?'checked':''}/>
    <div><div class="check-time">${escapeHtml(s.time)}</div><h4>${escapeHtml(s.title)}</h4><p>${escapeHtml(s.desc)}</p>${walkingByStop[s.id]?`<p class="walk-note">🚶 ${escapeHtml(walkingByStop[s.id])}</p>`:''}<div class="tag-list">${s.tags.map(t=>`<span class="tag ${tagClass(t)}">${escapeHtml(t)}</span>`).join('')}</div></div>
    <a class="small-btn" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">Map</a>
  </article>`;
}
function bindRoute(){
  document.querySelectorAll('[data-select-day]').forEach(btn=>btn.addEventListener('click',e=>{
    const day = Number(e.currentTarget.dataset.selectDay);
    selectedDay = selectedDay === day ? 0 : day;
    renderRoute();
  }));
  document.querySelectorAll('[data-stop]').forEach(input=>input.addEventListener('change',e=>toggleDone(e.currentTarget.dataset.stop,e.currentTarget.checked)));
  document.querySelectorAll('[data-moment]').forEach(input=>input.addEventListener('change',e=>toggleMoment(e.currentTarget.dataset.moment,e.currentTarget.checked)));
}
function renderMoment(m){
  const done = !!state.moments[m.id];
  return `<article class="card moment ${done?'done':''}"><input type="checkbox" data-moment="${m.id}" ${done?'checked':''}/><div><div class="label">${escapeHtml(m.pickedBy)}</div><h4>${escapeHtml(m.title)}</h4><p>${escapeHtml(m.note)}</p><div class="actions-row" style="margin-top:9px"><a class="small-btn" href="${mapUrl(m.map)}" target="_blank" rel="noreferrer">Map</a></div></div></article>`;
}

function renderStays(){
  $('#stays').innerHTML = `
    <div class="section-head"><div><h2>Stays</h2><p>Hotels are now their own clean page instead of being buried in a Details wall.</p></div></div>
    <section class="stay-grid">${stays.map(renderStay).join('')}</section>
    <div class="notice" style="margin-top:14px"><b>Reminder:</b> update the Jul 21–22 Embassy Suites reservation to show 4 guests if it still shows 1.</div>`;
}
function renderStay(s){
  return `<article class="card stay-card">
    <span class="badge ${s.brand==='Hilton'?'green':s.brand==='Marriott'?'gold':''}">${escapeHtml(s.brand)} · ${escapeHtml(s.night)}</span>
    <h3>${escapeHtml(s.hotel)}</h3>
    <p>${escapeHtml(s.city)} · ${escapeHtml(s.date)}</p>
    <div class="stay-meta"><div><span>Check in</span><b>${escapeHtml(s.checkin)}</b></div><div><span>Check out</span><b>${escapeHtml(s.checkout)}</b></div></div>
    <div class="stay-meta"><div><span>Confirmation</span><b>${escapeHtml(s.confirmation)}</b></div><div><span>Booked via</span><b>${escapeHtml(s.source)}</b></div></div>
    <p>${escapeHtml(s.note)}</p>
    <div class="stay-actions"><a class="small-btn dark" href="${mapUrl(s.map)}" target="_blank" rel="noreferrer">Directions</a><button class="small-btn" data-copy="${escapeHtml(s.confirmation)}">Copy confirmation</button></div>
  </article>`;
}

function renderVault(){
  $('#vault').innerHTML = `
    <div class="section-head"><div><h2>Vault</h2><p>Grouped confirmation cards. No giant paragraph wall.</p></div><span class="status-dot" data-sync>Connecting…</span></div>
    <section class="vault-groups">${vaultSections.map(renderVaultSection).join('')}</section>
    <article class="card" style="margin-top:14px"><div class="label">Shared notes</div><h2>Trip scratchpad</h2><textarea id="notes" class="notes" placeholder="Room numbers, parking notes, Wi‑Fi, backup plans…">${escapeHtml(state.notes || '')}</textarea><p class="muted">These notes sync through Firebase.</p></article>`;
  bindVault(); updateSync(db ? 'Live sync connected' : 'Connecting…');
}
function renderVaultSection(section){
  return `<article class="card vault-section"><h3>${section.icon} ${escapeHtml(section.title)}</h3><div class="vault-items">${section.items.map(renderVaultItem).join('')}</div></article>`;
}
function renderVaultItem(item){
  return `<div class="vault-item"><div class="item-top"><h4>${escapeHtml(item.title)}</h4><span class="confirm">${escapeHtml(item.confirm)}</span></div><p>${escapeHtml(item.meta)}</p><button class="copy" data-copy="${escapeHtml(item.confirm)}">Copy</button></div>`;
}
function bindVault(){
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async e=>{
    const val = e.currentTarget.dataset.copy;
    try{ await navigator.clipboard.writeText(val); toast('Copied'); } catch { toast(val); }
  }));
  const notes = $('#notes');
  if(notes){
    let timer;
    notes.addEventListener('input',e=>{ clearTimeout(timer); timer = setTimeout(()=>saveNotes(e.target.value), 500); });
  }
}

function nextStop(){ return allStops.find(s=>!state.completed[s.id]) || allStops[allStops.length-1]; }
function activateTab(tab){
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id===tab));
}
function dayRouteUrl(day){
  const r = dayMapRoutes[day];
  if(!r) return 'https://www.google.com/maps';
  const params = new URLSearchParams({api:'1',origin:r.origin,destination:r.destination,travelmode:'driving'});
  if(r.waypoints?.length) params.set('waypoints', r.waypoints.join('|'));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
function mapUrl(q){ return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`; }
function escapeHtml(str){ return String(str ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function tagClass(t){ if(/sleep/i.test(t)) return 'sleep'; if(/booked/i.test(t)) return 'booked'; return ''; }
function shortPlace(place){
  return String(place || '')
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
function luxDayTitle(d){
  return ({1:'LA Arrival → Ventura Harbor',2:'Santa Barbara + World Cup → Pismo',3:'Big Sur Coast Drive',4:'Monterey + Carmel Day',5:'Santa Cruz → Half Moon Bay',6:'Half Moon Bay → San Francisco',7:'Alcatraz + San Francisco',8:'Fly Home Day'})[d.day] || d.route;
}
function walkClass(level){
  const v = String(level || '').toLowerCase();
  if(v.includes('high') && !v.includes('medium')) return 'walk-high';
  if(v.includes('medium')) return 'walk-medium';
  return 'walk-low';
}
function walkIcon(level){
  const v = String(level || '').toLowerCase();
  if(v.includes('high') && !v.includes('medium')) return '🥾';
  if(v.includes('medium')) return '🚶';
  return '👟';
}
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#122734;color:white;padding:10px 14px;border-radius:999px;font-weight:900;z-index:1000;box-shadow:0 10px 24px rgba(0,0,0,.18)';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1400);
}

init();
