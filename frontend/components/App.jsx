"use client";
import React,{useEffect,useMemo,useState} from "react";
import {Sparkles,Shirt,CalendarDays,Heart,Plus,CloudSun,Search,Upload,Check,Menu,X,Sun,Cloud,CloudRain,Camera,ChevronRight,Trash2,TrendingUp} from "lucide-react";

const outfitCatalog=[
{id:101,name:"Monochrome Minimal",occasion:"Casual",mood:"Confident",style:"Minimal",weather:"Warm",score:96,items:[1,4,5],reason:"Clean neutral contrast with lightweight pieces."},
{id:102,name:"Smart Campus",occasion:"College",mood:"Focused",style:"Classic",weather:"Warm",score:94,items:[1,3,5],reason:"Polished enough for presentations while staying comfortable."},
{id:103,name:"Weekend Street",occasion:"Casual",mood:"Energetic",style:"Street",weather:"Warm",score:91,items:[2,4,5],reason:"Relaxed proportions and easy movement for a day out."},
{id:104,name:"Executive Navy",occasion:"Formal",mood:"Confident",style:"Classic",weather:"Cool",score:98,items:[1,3,6],reason:"Crisp Oxford, tailored chinos and loafers create a sharp silhouette."},
{id:105,name:"Rainy Day Clean",occasion:"College",mood:"Chill",style:"Minimal",weather:"Rainy",score:89,items:[2,4,5],reason:"Simple layers and durable everyday pieces for unpredictable weather."},
{id:106,name:"Dinner Ready",occasion:"Party",mood:"Confident",style:"Classic",weather:"Cool",score:93,items:[1,3,6],reason:"Refined textures and darker footwear elevate the look."},
{id:107,name:"Bold Off-Duty",occasion:"Casual",mood:"Energetic",style:"Bold",weather:"Warm",score:90,items:[2,3,5],reason:"Strong black-and-navy contrast with a sporty finish."},
{id:108,name:"Presentation Day",occasion:"Formal",mood:"Focused",style:"Minimal",weather:"Warm",score:97,items:[1,3,6],reason:"Professional, breathable and distraction-free for important meetings."},
{id:109,name:"Coffee Run",occasion:"Casual",mood:"Chill",style:"Street",weather:"Warm",score:88,items:[2,4,5],reason:"Low-effort outfit that still looks intentionally styled."},
{id:110,name:"Classic Friday",occasion:"College",mood:"Confident",style:"Classic",weather:"Cool",score:95,items:[1,4,6],reason:"Classic shirt and denim combination with a refined shoe choice."}
];

const seed=[
{id:1,name:"White Oxford Shirt",cat:"Tops",color:"White",season:"All",occasion:"Formal",img:"https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=500&q=80",wears:8},
{id:2,name:"Black Oversized Tee",cat:"Tops",color:"Black",season:"Summer",occasion:"Casual",img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",wears:12},
{id:3,name:"Navy Chinos",cat:"Bottoms",color:"Navy",season:"All",occasion:"Formal",img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",wears:5},
{id:4,name:"Blue Denim",cat:"Bottoms",color:"Blue",season:"All",occasion:"Casual",img:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",wears:15},
{id:5,name:"White Sneakers",cat:"Shoes",color:"White",season:"All",occasion:"Casual",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",wears:10},
{id:6,name:"Brown Loafers",cat:"Shoes",color:"Brown",season:"All",occasion:"Formal",img:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80",wears:3}
];

const FALLBACK_IMG="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80";
const WEATHER_META={0:["Clear sky",Sun],1:["Mostly clear",Sun],2:["Partly cloudy",CloudSun],3:["Overcast",Cloud],45:["Foggy",Cloud],48:["Icy fog",Cloud],51:["Light drizzle",CloudRain],53:["Drizzle",CloudRain],55:["Heavy drizzle",CloudRain],61:["Light rain",CloudRain],63:["Rain",CloudRain],65:["Heavy rain",CloudRain],66:["Freezing rain",CloudRain],67:["Freezing rain",CloudRain],80:["Light showers",CloudRain],81:["Showers",CloudRain],82:["Heavy showers",CloudRain],95:["Thunderstorm",CloudRain],96:["Thunderstorm",CloudRain],99:["Severe storm",CloudRain],71:["Light snow",Cloud],73:["Snow",Cloud],75:["Heavy snow",Cloud],77:["Snow grains",Cloud]};
const RAINY_CODES=[51,53,55,61,63,65,66,67,80,81,82,95,96,99];
const PALETTE=[["Black",[18,20,24]],["White",[244,244,244]],["Blue",[46,86,158]],["Brown",[108,70,48]],["Beige",[205,185,155]],["Navy",[28,42,74]]];
const CITY_COORDS={Chennai:[13.0827,80.2707],Bengaluru:[12.9716,77.5946],Mumbai:[19.076,72.8777],Delhi:[28.6139,77.209],Hyderabad:[17.385,78.4867],Kolkata:[22.5726,88.3639]};

async function api(path,opts={}){
  try{const r=await fetch("/api"+path,{headers:{"Content-Type":"application/json"},...opts});const d=await r.json();return r.ok?d:null;}catch(e){return null;}
}
function weatherTip(temp,rainy){if(rainy)return"Rain likely — avoid suede and linen";if(temp>=30)return"Hot day — go breathable";if(temp>=24)return"Perfect for breathable layers";if(temp>=17)return"Mild — layered comfort";return"Cool — add a layer or jacket";}
function toWeather(d){
  const c=d.current,code=c.weather_code;
  const meta=WEATHER_META[code]||["Mixed",CloudSun];
  return{temp:Math.round(c.temperature_2m),desc:meta[0],Icon:meta[1],rainy:RAINY_CODES.includes(code),city:d.city||"Chennai",code};
}
function resizeImage(file,cb){
  const reader=new FileReader();
  reader.onload=()=>{const img=new Image();
    img.onload=()=>{const max=520;let w=img.width,h=img.height;if(w>max){h=Math.round(h*max/w);w=max;}const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);cb(c.toDataURL("image/jpeg",0.82));};
    img.onerror=()=>cb(null);img.src=reader.result;};
  reader.readAsDataURL(file);
}
function classifyColor(src,cb){
  const img=new Image();
  img.onload=()=>{const c=document.createElement("canvas");c.width=44;c.height=44;const ctx=c.getContext("2d");ctx.drawImage(img,0,0,44,44);
    let data;try{data=ctx.getImageData(0,0,44,44).data;}catch(e){return cb(null);}
    const buckets=new Array(PALETTE.length).fill(0);
    for(let i=0;i<data.length;i+=4){if(data[i+3]<128)continue;const rgb=[data[i],data[i+1],data[i+2]];let bi=0,bd=1e9;PALETTE.forEach((p,ix)=>{const d=Math.hypot(rgb[0]-p[1][0],rgb[1]-p[1][1],rgb[2]-p[1][2]);if(d<bd){bd=d;bi=ix;}});buckets[bi]++;}
    let bi=0;buckets.forEach((n,ix)=>{if(n>buckets[bi])bi=ix;});cb(buckets[bi]>3?PALETTE[bi][0]:null);};
  img.onerror=()=>cb(null);img.src=src;
}

function buildOutfit(items,filters,weather){
  const tops=items.filter(x=>x.cat==="Tops"||x.cat==="Outerwear");
  const bottoms=items.filter(x=>x.cat==="Bottoms");
  const shoes=items.filter(x=>x.cat==="Shoes");
  if(!tops.length||!bottoms.length||!shoes.length)return null;
  const warm=weather.temp>=24,cool=weather.temp<=17,rainy=filters.weather==="Rainy"||weather.rainy;
  const occ=filters.occasion,mood=filters.mood,style=filters.style;
  const score=(x,role)=>{let s=42;
    if(x.occasion===occ)s+=15;else if(x.occasion!=="Formal"&&occ!=="Formal")s+=6;else if(x.occasion==="Formal"&&(occ==="Formal"||occ==="Party"))s+=8;
    const light=x.color==="White"||x.color==="Beige",dark=x.color==="Black"||x.color==="Navy"||x.color==="Brown";
    if(warm){if(light)s+=9;if(dark)s-=5;}
    if(cool){if(dark)s+=9;if(light)s-=3;}
    if(rainy){if(role==="shoes"&&x.color==="Brown")s-=9;if(role==="shoes"&&x.cat==="Shoes"&&x.color==="White")s+=4;}
    if(mood==="Energetic"){if(x.color==="Blue")s+=6;if(x.color==="White"||x.color==="Beige")s-=2;}
    if(mood==="Chill"){if(light)s+=7;if(x.color==="Blue")s-=2;}
    if(mood==="Confident"){if(dark)s+=7;}
    if(mood==="Focused"){if(x.color==="White"||x.color==="Navy")s+=6;}
    if(style==="Minimal"){if(x.color==="White"||x.color==="Navy"||x.color==="Beige")s+=7;}
    if(style==="Classic"){if(x.color==="Navy"||x.color==="Brown"||x.color==="White")s+=7;}
    if(style==="Street"){if(x.color==="Black")s+=7;}
    if(style==="Bold"){if(x.color==="Blue")s+=7;}
    s-=Math.min(15,x.wears*1.3);
    if(x.wears<4)s+=8;
    return Math.max(0,s);};
  const pick=list=>{const sc=list.map(x=>({x,s:score(x,list[0].cat==="Shoes"?"shoes":"top")})).sort((a,b)=>b.s-a.s).slice(0,3);return sc[Math.floor(Math.random()*sc.length)].x;};
  const t=pick(tops),b=pick(bottoms),sh=pick(shoes);
  const arr=[t,b,sh];
  const under=arr.filter(x=>x.wears<4).length;
  const total=arr.reduce((a,x)=>a+x.wears,0);
  const scoreV=Math.max(82,Math.min(98,76+under*6-total*0.2));
  const name=style==="Minimal"?"Clean Minimalist":style==="Classic"?"Timeless Classic":style==="Street"?"Street Edge":"Bold Statement";
  const reasons=[
    `${weather.temp}°C today → ${weatherTip(weather.temp,rainy)}`,
    `Fits a ${occ.toLowerCase()} setting`,
    `Matches your ${mood.toLowerCase()} mood`,
    `Styled with a ${style.toLowerCase()} aesthetic`,
    under?`${t.name} is underused — giving it a chance to shine`:`Built entirely from your existing wardrobe`
  ];
  return{name,occasion:occ,mood,style,weather:filters.weather,score:Math.round(scoreV),items:arr,reasons,recentlyWorn:null};
}
function buildCatalogOutfit(items,filters,outfitCatalog){
  const matches=outfitCatalog.filter(o=>o.occasion===filters.occasion||o.mood===filters.mood||o.style===filters.style||o.weather===filters.weather);
  const pick=(matches.length?matches:outfitCatalog).sort((a,b)=>b.score-a.score)[0];
  const chosen=pick.items.map(id=>items.find(x=>x.id===id)).filter(Boolean);
  return{...pick,items:chosen,reasons:[`${filters.weather} weather considered for comfort`,`Fits a ${filters.occasion.toLowerCase()} setting`,`Matches your ${filters.mood.toLowerCase()} mood`,`Styled with a ${filters.style.toLowerCase()} aesthetic`,`Built entirely from your existing wardrobe`]};
}

export default function App(){
 const [items,setItems]=useState(seed),[page,setPage]=useState("home"),[fav,setFav]=useState([]),[menu,setMenu]=useState(false);
 const [filters,setFilters]=useState({occasion:"Casual",mood:"Confident",weather:"Warm",style:"Minimal"});
 const [outfit,setOutfit]=useState(null),[showAdd,setShowAdd]=useState(false),[form,setForm]=useState({name:"",cat:"Tops",color:"Black",occasion:"Casual",img:""});
  const [detected,setDetected]=useState(null);
  const [showTrending,setShowTrending]=useState(false),[trendQ,setTrendQ]=useState("dress"),[trending,setTrending]=useState([]),[trendBusy,setTrendBusy]=useState(false);
 const [weather,setWeather]=useState({temp:28,desc:"Partly cloudy",Icon:Sun,rainy:false,city:"Chennai",code:2});
 const [plans,setPlans]=useState({});
 const nav=[["home","Dashboard",Sparkles],["wardrobe","Wardrobe",Shirt],["generate","AI Stylist",Sparkles],["planner","Planner",CalendarDays],["favorites","Favorites",Heart],["looks","Outfit Gallery",Sparkles]];
 useEffect(()=>{(async()=>{
   const [w,s,f,p]=await Promise.all([api("/weather?lat=13.0827&lon=80.2707&city=Chennai"),api("/items"),api("/favorites"),api("/plans")]);
   if(w&&w.current)setWeather(toWeather(w));
   if(s&&Array.isArray(s.items))setItems(s.items);
   if(f&&Array.isArray(f.ids))setFav(f.ids);
   if(p&&p.plans)setPlans(p.plans);
   if(w&&w.current){const x=toWeather(w);setFilters(prev=>({...prev,weather:x.rainy?"Rainy":(x.temp>=24?"Warm":"Cool")}));}
 })();},[]);
 const persistItems=next=>{setItems(next);api("/items",{method:"PUT",body:JSON.stringify(next)});};
 const saveFav=ids=>{setFav(ids);api("/favorites",{method:"PUT",body:JSON.stringify({ids})});};
 const savePlans=next=>{setPlans(next);api("/plans",{method:"PUT",body:JSON.stringify({plans:next})});};
 const generate=()=>{
   const built=buildOutfit(items,filters,weather);
   const o=built||buildCatalogOutfit(items,filters,outfitCatalog);
   setOutfit(o);
   setPage("generate");
   if(built){
     api("/reason",{method:"POST",body:JSON.stringify({
       pieces:built.items.map(x=>({name:x.name,color:x.color,cat:x.cat,occasion:x.occasion,wears:x.wears})),
       occasion:filters.occasion,mood:filters.mood,style:filters.style,
       weather:{temp:weather.temp,desc:weather.desc,rainy:weather.rainy}
     })}).then(res=>{if(res&&res.note)setOutfit(prev=>prev&&{...prev,aiNote:res.note});});
   }
 };
 const saveOutfit=()=>{
   if(!outfit)return;
   const ids=[...new Set([...fav,...outfit.items.map(x=>x.id)])];
   saveFav(ids);
   persistItems(items.map(x=>outfit.items.some(o=>o.id===x.id)?{...x,wears:x.wears+1}:x));
 };
 const add=()=>{
   if(!form.name)return;
   const ni={id:Date.now(),name:form.name,cat:form.cat,color:form.color,season:"All",occasion:form.occasion,img:form.img||FALLBACK_IMG,wears:0};
   persistItems([...items,ni]);
   setForm({name:"",cat:"Tops",color:"Black",occasion:"Casual",img:""});setDetected(null);setShowAdd(false);
 };
 const onPickFile=e=>{
   const f=e.target.files&&e.target.files[0];if(!f)return;
   resizeImage(f,dataUrl=>{
     if(!dataUrl)return;
     setForm(prev=>({...prev,img:dataUrl}));
     classifyColor(dataUrl,c=>{if(c){setDetected(c);setForm(prev=>({...prev,color:c}));}});
   });
 };
  const onPlan=dayIdx=>{
    if(!outfit)return;
    const next={...plans,[dayIdx]:{ids:outfit.items.map(x=>x.id),name:outfit.name}};
    savePlans(next);
  };
  const loadTrending=async q=>{
    setTrendQ(q);setTrending([]);setTrendBusy(true);
    const r=await api("/trending",{method:"POST",body:JSON.stringify({query:q})});
    setTrending(r&&Array.isArray(r.products)?r.products:[]);setTrendBusy(false);
  };
  const addTrending=p=>{
    persistItems([...items,{id:p.id||Date.now(),name:p.name,cat:p.cat,color:p.color,season:p.season||"All",occasion:p.occasion,img:p.img||FALLBACK_IMG,wears:0,price:p.price,currency:p.currency,url:p.url,brand:p.brand}]);
    setTrending(t=>t.filter(x=>x!==p));
  };
 const util=Math.round((items.filter(x=>x.wears>0).length/Math.max(1,items.length))*100);
 return <div className="app">
  <header><div className="brand" onClick={()=>setPage("home")}><div className="logo">O</div><div><b>OutfitWise</b><span>Wear what you already own.</span></div></div>
  <button className="mobile" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  <nav className={menu?"open":""}>{nav.map(([id,label,Icon])=><button className={page===id?"active":""} onClick={()=>{setPage(id);setMenu(false)}} key={id}><Icon size={17}/>{label}</button>)}</nav>
  <button className="avatar">PK</button></header>
  <main>
   {page==="home"&&<Dashboard items={items} util={util} weather={weather} saved={Object.keys(plans).length} onGenerate={generate} onAdd={()=>setShowAdd(true)} setPage={setPage}/>}
    {page==="wardrobe"&&<Wardrobe items={items} onAdd={()=>setShowAdd(true)} onTrending={()=>{setShowTrending(true);if(!trending.length)loadTrending(trendQ);}} onDelete={id=>persistItems(items.filter(x=>x.id!==id))}/>}
   {page==="generate"&&<Stylist filters={filters} setFilters={setFilters} generate={generate} outfit={outfit} weather={weather} onSave={saveOutfit}/>}
   {page==="planner"&&<Planner items={items} outfit={outfit} plans={plans} onPlan={onPlan}/>}
   {page==="favorites"&&<Favorites items={items.filter(x=>fav.includes(x.id))}/>}
   {page==="looks"&&<Looks items={items} setOutfit={setOutfit} setPage={setPage} weather={weather}/>}
  </main>
  {showAdd&&<div className="overlay"><div className="modal"><button className="close" onClick={()=>setShowAdd(false)}><X/></button><h2>Add to your wardrobe</h2><p>Turn a real clothing item into a smart wardrobe asset.</p>
   <label>Item name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Beige Linen Shirt"/></label>
   <label className="upload"><Camera size={17}/> Upload photo<input type="file" accept="image/*" onChange={onPickFile}/></label>
   {form.img&&<div className="upload-preview"><img src={form.img}/>{detected?<span>Auto-detected color: {detected}</span>:<span>Adjust color below if needed</span>}</div>}
   <div className="grid2"><label>Category<select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}><option>Tops</option><option>Dresses</option><option>Bottoms</option><option>Shoes</option><option>Outerwear</option></select></label><label>Color<select value={form.color} onChange={e=>setForm({...form,color:e.target.value})}><option>Black</option><option>White</option><option>Blue</option><option>Brown</option><option>Beige</option><option>Navy</option></select></label></div>
   <label>Occasion<select value={form.occasion} onChange={e=>setForm({...form,occasion:e.target.value})}><option>Casual</option><option>Formal</option><option>Party</option><option>College</option></select></label>
   <label>Image URL (optional)<input value={form.img.startsWith("data:")?"":form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="Paste an image URL instead"/></label>
   <button className="primary full" onClick={add}><Upload size={17}/> Add clothing</button>
   </div></div>}
   {showTrending&&<div className="overlay"><div className="modal wide"><button className="close" onClick={()=>setShowTrending(false)}><X/></button><h2>Trending finds</h2><p>Real products from live catalogs — add them straight to your wardrobe.</p>
    <div className="trend-tabs">{[["dress","Dresses"],["casual","Casuals"],["tops","Tops"],["shoes","Shoes"],["outerwear","Outerwear"]].map(([q,l])=><button key={q} className={trendQ===q?"selected":""} onClick={()=>loadTrending(q)}>{l}</button>)}</div>
    {trendBusy?<div className="empty"><Sparkles size={30}/><h3>Loading trending picks…</h3></div>:trending.length?<div className="trend-grid">{trending.map((p,i)=><div className="trend-card" key={i}><img src={p.img}/><b>{p.name}</b><small>{(p.brand?p.brand+" · ":"")+(p.price?(p.currency||"")+" "+p.price+" · ":"")+p.cat}</small><button className="primary" onClick={()=>addTrending(p)}><Plus size={14}/> Add to wardrobe</button></div>)}</div>:<div className="empty"><Sparkles size={30}/><h3>No results</h3><p>Try another category.</p></div>}
   </div></div>}
  </div>
 }

function Dashboard({items,util,weather,saved,onGenerate,onAdd,setPage}){
 const WIcon=weather.Icon;
 return <><section className="hero"><div><div className="eyebrow">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}</div><h1>Your wardrobe,<br/><em>made effortless.</em></h1><p>AI styling that starts with the clothes you already own.</p><button className="primary" onClick={onGenerate}><Sparkles size={17}/> Generate today's outfit</button></div><div className="hero-card"><div className="sun"><WIcon/></div><b>{weather.temp}°</b><span>{weather.desc} · {weather.city}</span><small>{weatherTip(weather.temp,weather.rainy)}</small></div></section>
 <section className="stats"><div><span>Wardrobe</span><b>{items.length}</b><small>items tracked</small></div><div><span>Utilization</span><b>{util}%</b><small>pieces actively used</small></div><div><span>Saved outfits</span><b>{saved}</b><small>this week</small></div><div><span>Style streak</span><b>7 🔥</b><small>days in a row</small></div></section>
 <section className="section-head"><div><h2>Quick start</h2><p>Make OutfitWise smarter in seconds.</p></div></section>
 <div className="quick"><button onClick={onAdd}><Plus/><b>Add clothes</b><span>Build your digital wardrobe</span><ChevronRight/></button><button onClick={()=>setPage("generate")}><Sparkles/><b>Ask your stylist</b><span>Find your best look</span><ChevronRight/></button><button onClick={()=>setPage("planner")}><CalendarDays/><b>Plan your week</b><span>Never repeat by accident</span><ChevronRight/></button></div>
 <section className="section-head"><div><h2>Underused gems</h2><p>Give these pieces another chance.</p></div><button className="link" onClick={()=>setPage("wardrobe")}>View wardrobe <ChevronRight size={15}/></button></section>
 <div className="mini-grid">{items.filter(x=>x.wears<6).slice(0,4).map(x=><Item key={x.id} x={x}/>)}</div>
 </>}
function Item({x,onDelete}){return <article className="item"><div className="pic"><img src={x.img}/>{x.wears<4&&<span>Underused</span>}</div><div className="item-info"><b>{x.name}</b><small>{x.cat} · {x.color}</small><div className="wear"><span>{x.wears} wears</span><div><i style={{width:Math.min(100,x.wears*6)+"%"}}/></div></div></div>{onDelete&&<button className="trash" onClick={()=>onDelete(x.id)}><Trash2 size={15}/></button>}</article>}
function Wardrobe({items,onAdd,onDelete,onTrending}){const [q,setQ]=useState(""),[cat,setCat]=useState("All");const shown=items.filter(x=>(cat==="All"||x.cat===cat)&&x.name.toLowerCase().includes(q.toLowerCase()));return <><div className="page-title"><div><div className="eyebrow">MY CLOSET</div><h1>Digital wardrobe</h1><p>{items.length} pieces · Your personal style library.</p></div><div className="page-actions"><button className="secondary" onClick={onTrending}><TrendingUp size={16}/> Add trending</button><button className="primary" onClick={onAdd}><Plus/> Add clothing</button></div></div><div className="toolbar"><div className="search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your wardrobe"/></div><div className="chips">{["All","Tops","Dresses","Bottoms","Shoes","Outerwear"].map(x=><button className={cat===x?"selected":""} onClick={()=>setCat(x)} key={x}>{x}</button>)}</div></div><div className="item-grid">{shown.map(x=><Item x={x} onDelete={onDelete} key={x.id}/>)}</div></>}
function Stylist({filters,setFilters,generate,outfit,weather,onSave}){const WIcon=weather.Icon;return <><div className="page-title"><div><div className="eyebrow">OUTFITWISE AI</div><h1>Your personal stylist</h1><p>Tell me the moment. I'll handle the outfit.</p></div></div><div className="stylist-grid"><aside className="panel"><h3>Style brief</h3><div className="live-weather"><WIcon size={15}/> Live · {weather.temp}°C · {weather.desc}</div>{[["occasion","Occasion",["Casual","Formal","Party","College"]],["mood","Mood",["Confident","Chill","Energetic","Focused"]],["weather","Weather",["Warm","Cool","Rainy"]],["style","Style",["Minimal","Street","Classic","Bold"]]].map(([k,l,opts])=><label className="filter" key={k}>{l}<select value={filters[k]} onChange={e=>setFilters({...filters,[k]:e.target.value})}>{opts.map(o=><option key={o}>{o}</option>)}</select></label>)}<button className="primary full" onClick={generate}><Sparkles/> Generate outfit</button></aside><div className="result">{outfit?<><div className="result-head"><div><span className="pill"><Check size={13}/> AI MATCH</span><h2>You've got the look.</h2><p>A {filters.style.toLowerCase()} {filters.occasion.toLowerCase()} outfit built from your wardrobe.</p></div><div className="score"><b>{outfit.score}</b><span>/100<br/>match</span></div></div><div className="outfit-grid">{outfit.items.map(x=><div className="outfit-piece" key={x.id}><img src={x.img}/><div><b>{x.name}</b><small>{x.cat} · {x.color}</small></div></div>)}</div><div className="reasons">{outfit.reasons.map(r=><div key={r}><Check size={15}/>{r}</div>)}{outfit.aiNote&&<div className="ai-note"><Sparkles size={15}/>{outfit.aiNote}</div>}</div><button className="save" onClick={onSave}><Heart size={16}/> Save these pieces</button></>:<div className="empty-ai"><Sparkles size={42}/><h2>Ready when you are.</h2><p>Choose your preferences and generate an outfit from your actual wardrobe.</p><button className="primary" onClick={generate}>Generate my look</button></div>}</div></div></>}
function Planner({items,outfit,plans,onPlan}){const today=new Date();const days=Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()+i);return d;});const fmt=d=>["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()]+" "+d.getDate();return <><div className="page-title"><div><div className="eyebrow">YOUR WEEK</div><h1>Outfit planner</h1><p>Plan once. Dress effortlessly all week.</p></div></div><div className="calendar">{days.map((d,i)=>{const planned=plans[i];const pItems=planned?(planned.ids||[]).map(id=>items.find(x=>x.id===id)).filter(Boolean):[];return <div className={i===0?"day today":"day"} key={i}><span>{fmt(d)}</span>{pItems.length?<div className="planned"><img src={pItems[0].img}/><b>{planned.name}</b><small>{pItems.map(x=>x.name).join(" · ")}</small></div>:i===0&&outfit?<div className="planned"><img src={outfit.items[0].img}/><b>AI Pick</b><small>{outfit.items[0].name}</small></div>:<button className="add-day" onClick={()=>onPlan(i)}><Plus size={18}/><span>Plan outfit</span></button>}</div>;})}</div></>}
function Favorites({items}){return <><div className="page-title"><div><div className="eyebrow">SAVED STYLE</div><h1>Favorites</h1><p>Your most-loved wardrobe pieces.</p></div></div>{items.length?<div className="item-grid">{items.map(x=><Item x={x} key={x.id}/>)}</div>:<div className="empty"><Heart size={35}/><h2>No favorites yet</h2><p>Generate an outfit and save pieces you love.</p></div>}</>}

function Looks({items,setOutfit,setPage,weather}){
 const [filter,setFilter]=useState("All");
 const list=filter==="All"?outfitCatalog:outfitCatalog.filter(x=>x.occasion===filter);
 const open=o=>{
   const chosen=o.items.map(id=>items.find(x=>x.id===id)).filter(Boolean);
   setOutfit({...o,items:chosen,reasons:[o.reason,`${weather.temp}°C today → ${weatherTip(weather.temp,weather.rainy)}`,"Uses only items from your wardrobe","Balanced for your selected style profile"]});
   setPage("generate");
 };
 return <><div className="page-title"><div><div className="eyebrow">STYLE LIBRARY</div><h1>Outfit gallery</h1><p>Explore {outfitCatalog.length}+ ready-to-wear combinations built from your wardrobe.</p></div></div>
 <div className="gallery-filters">{["All","Casual","College","Formal","Party"].map(x=><button className={filter===x?"selected":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
 <div className="looks-grid">{list.map(o=>{
   const chosen=o.items.map(id=>items.find(x=>x.id===id)).filter(Boolean);
   return <article className="look-card" key={o.id}>
    <div className="look-images">{chosen.map(x=><img src={x.img} key={x.id}/>)}</div>
    <div className="look-body"><div className="look-top"><div><span className="eyebrow">{o.occasion.toUpperCase()}</span><h3>{o.name}</h3></div><b className="mini-score">{o.score}</b></div>
    <p>{o.reason}</p><div className="look-tags"><span>{o.style}</span><span>{o.mood}</span><span>{o.weather}</span></div>
    <button className="primary full" onClick={()=>open(o)}><Sparkles size={15}/> Try this outfit</button></div>
   </article>
 })}</div></>
}
