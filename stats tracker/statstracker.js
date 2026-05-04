// ── DATA ──────────────────────────────────────────────────────────────────────
const CLS_STYLE={Knight:{bg:"#EAF1FB",tx:"#1A3A6B",dt:"#3B6DA8"},Barbarian:{bg:"#FBECEC",tx:"#6B1A1A",dt:"#B03030"},Assassin:{bg:"#2A2A2816",tx:"#3A3530",dt:"#5A5048"},Archer:{bg:"#EAF3DE",tx:"#1A4A10",dt:"#3B8020"},Wizard:{bg:"#EEECFE",tx:"#2D1A6B",dt:"#5A48C0"},Witch:{bg:"#FBECF2",tx:"#6B1A40",dt:"#B03070"},Bard:{bg:"#FBF0DC",tx:"#6B3A00",dt:"#C08020"}};

// Which substats sum into each parent
const STAT_SUMS={
  Attack:["Physical attack","Magical attack","Range"],
  Defense:["Physical defense","Magical defense"],
  Magic:["Magical proficiency","Healing proficiency","Brewing proficiency"],
  Nature:["Survival","Animal handling"],
  Intelligence:["Knowledge","Precision","Perception","Investigation"],
  Movement:["Movement speed","Reaction speed","Acrobatics","Stamina","Stealth"],
  Charisma:["Persuasion","Deception","Intimidation"],
};

// Base class substats only (parents are computed)
const BASE={
  Knight:   {Health:30,"Physical attack":4,"Magical attack":0,Range:1,"Physical defense":2,"Magical defense":0,"Magical proficiency":0,"Healing proficiency":0,"Brewing proficiency":0,Survival:1,"Animal handling":0,Knowledge:1,Precision:3,Perception:1,Investigation:0,"Movement speed":2,"Reaction speed":2,Acrobatics:1,Stamina:3,Stealth:0,Persuasion:2,Deception:2,Intimidation:2},
  Barbarian:{Health:50,"Physical attack":7,"Magical attack":0,Range:0,"Physical defense":6,"Magical defense":3,"Magical proficiency":0,"Healing proficiency":0,"Brewing proficiency":0,Survival:2,"Animal handling":0,Knowledge:0,Precision:0,Perception:0,Investigation:0,"Movement speed":3,"Reaction speed":-4,Acrobatics:0,Stamina:5,Stealth:0,Persuasion:-1,Deception:0,Intimidation:4},
  Assassin: {Health:20,"Physical attack":2,"Magical attack":0,Range:1,"Physical defense":-2,"Magical defense":-2,"Magical proficiency":0,"Healing proficiency":0,"Brewing proficiency":0,Survival:1,"Animal handling":0,Knowledge:1,Precision:2,Perception:2,Investigation:1,"Movement speed":3,"Reaction speed":2,Acrobatics:2,Stamina:2,Stealth:3,Persuasion:1,Deception:3,Intimidation:3},
  Archer:   {Health:20,"Physical attack":0,"Magical attack":0,Range:5,"Physical defense":0,"Magical defense":0,"Magical proficiency":0,"Healing proficiency":0,"Brewing proficiency":0,Survival:2,"Animal handling":2,Knowledge:1,Precision:3,Perception:3,Investigation:0,"Movement speed":1,"Reaction speed":2,Acrobatics:2,Stamina:1,Stealth:2,Persuasion:0,Deception:0,Intimidation:1},
  Wizard:   {Health:20,"Physical attack":0,"Magical attack":4,Range:1,"Physical defense":0,"Magical defense":2,"Magical proficiency":3,"Healing proficiency":2,"Brewing proficiency":0,Survival:1,"Animal handling":1,Knowledge:3,Precision:1,Perception:2,Investigation:0,"Movement speed":1,"Reaction speed":1,Acrobatics:0,Stamina:0,Stealth:0,Persuasion:1,Deception:1,Intimidation:1},
  Witch:    {Health:20,"Physical attack":0,"Magical attack":2,Range:1,"Physical defense":0,"Magical defense":0,"Magical proficiency":2,"Healing proficiency":1,"Brewing proficiency":3,Survival:2,"Animal handling":2,Knowledge:3,Precision:1,Perception:0,Investigation:0,"Movement speed":1,"Reaction speed":1,Acrobatics:0,Stamina:0,Stealth:0,Persuasion:1,Deception:2,Intimidation:3},
  Bard:     {Health:20,"Physical attack":0,"Magical attack":3,Range:0,"Physical defense":0,"Magical defense":0,"Magical proficiency":3,"Healing proficiency":3,"Brewing proficiency":0,Survival:0,"Animal handling":2,Knowledge:0,Precision:0,Perception:0,Investigation:0,"Movement speed":1,"Reaction speed":1,Acrobatics:0,Stamina:0,Stealth:0,Persuasion:6,Deception:4,Intimidation:2},
};

// Stat display groups — parent auto-computed, children editable
const GROUPS=[
  {title:"Health",   color:"#1D9E75", specialHealth:true},
  {title:"Combat",   color:"#B03030", rows:[{parent:"Attack",  children:["Physical attack","Magical attack","Range"]},{parent:"Defense",children:["Physical defense","Magical defense"]}]},
  {title:"Magic",    color:"#5A48C0", rows:[{parent:"Magic",   children:["Magical proficiency","Healing proficiency","Brewing proficiency"]}]},
  {title:"Nature",   color:"#3B8020", rows:[{parent:"Nature",  children:["Survival","Animal handling"]}]},
  {title:"Intelligence",color:"#1A3A6B",rows:[{parent:"Intelligence",children:["Knowledge","Precision","Perception","Investigation"]}]},
  {title:"Movement", color:"#0D6B50", rows:[{parent:"Movement",children:["Movement speed","Reaction speed","Acrobatics","Stamina","Stealth"]}]},
  {title:"Charisma", color:"#B06010", rows:[{parent:"Charisma",children:["Persuasion","Deception","Intimidation"]}]},
];

const SCHOOL_CLR={Fire:{bg:"#FBECEC",tx:"#8B1A1A"},Ice:{bg:"#EAF3FB",tx:"#0D3A6B"},Ground:{bg:"#f7c98dff",tx:"#8b5e1aff"},Light:{bg:"#fffad0ff",tx:"#d7da3cff"},Arcane:{bg:"#EEECFE",tx:"#2D1A6B"},Curse:{bg:"#F2ECFB",tx:"#4A1A6B"},Alchemy:{bg:"#EAF3DE",tx:"#1A4D10"},Divination:{bg:"#FBF0DC",tx:"#6B3A00"},Inspiration:{bg:"#FBF0DC",tx:"#6B3A00"},Enchantment:{bg:"#FBECF2",tx:"#6B1A40"},Healing:{bg:"#EAFBEC",tx:"#0D5A1A"},Resonance:{bg:"#eaf6fbff",tx:"#0d4b5aff"}};

const SPELLS={
  Wizard:[
    {name:"Firebolt",school:"Fire",cost:"10 MP",range:"Long",desc:"Hurls a ball of fire that explodes on impact.",effect:"Deals 2 Magical attack fire damage."},
    {name:"Ground guard",school:"Ground",cost:"5 MP",range:"Short",desc:"Creates a defensive dirt wall for your team.",effect:"Grants teammates behind the wall 2 extra defense."},
    {name:"Frostbite",school:"Ice",cost:"7 MP",range:"Short",desc:"Blows a cloud of cold air that slows down enemys.",effect:"Deals 1 Magical attack ice damage and reduces target movement by 2 for 1 turn."},
    {name:"Light",school:"Light",cost:"2 MP",range:"Short",desc:"Creates a small ball of bright light.",effect:"Grants normal perception in dark rooms."},
  ],
  Witch:[
    {name:"Curse",school:"Curse",cost:"10 MP",range:"Medium",desc:"A debilitating curse that weakens the target's resolve.",effect:"Reduces all target stats by 1 for 1 turn."},
    {name:"Fly",school:"Arcane",cost:"3 MP",range:"Self",desc:"Allows user to fly using a broom.",effect:"1 Magic Proficiency of flight duration."},
  ],
  Bard:[
    {name:"Song of Courage",school:"Inspiration",cost:"2 MP",range:"Short",desc:"A rousing melody that steels the party's nerves.",effect:"All allies gain 1 Attack and Defense for 1 turn."},
    {name:"Lullaby",school:"Enchantment",cost:"2 MP",range:"Short",desc:"A soft melody that lulls enemies to sleep.",effect:"Target falls asleep for 2 turns unless damaged."},
    {name:"Heal prayer",school:"Healing",cost:"5 MP",range:"Short",desc:"A soothing tune that closes wounds.",effect:"Target regains 1 Healing proficiency HP."},
    {name:"Sonic scream",school:"Resonance",cost:"5 MP",range:"Medium",desc:"Fires a sonic blast dealing damage to the target.",effect:"Deals 2 Magical attack sonic damage."},
  ],
};

// Bag limits from Excel (red = over limit): Starter bag rows 1-6, Quiver rows 1-8, Potion bag rows 1-4, Ingredient bag rows 1-4
const BAG_LIMITS={"starter bag":6,"starter quiver":8,"potion bag":4,"ingredient bag":4};
const CARRIED_LIMIT=3;

const STARTER_INV={
  Knight:   {weapon:"Starter sword",offhand:"Starter shield",armor:["Chainmail helmet","Chainmail chestplate","Chainmail leggings","Chainmail boots"],bags:[],slots:[]},
  Barbarian:{weapon:"Starter axe",  offhand:"",armor:["Starter helmet","Starter leggings","Starter boots"],bags:[],slots:[]},
  Assassin: {weapon:"Starter dagger",offhand:"",armor:["Starter hood","Starter cloak","Starter leggings","Starter boots"],bags:[],slots:[]},
  Archer:   {weapon:"Starter bow",  offhand:"",armor:["Starter hood","Starter chestplate","Starter leggings","Starter boots","Starter cloak"],bags:[{name:"Starter quiver",items:["Starter Arrow","Starter Arrow","Starter Arrow","Starter Arrow","Starter Arrow","Starter Arrow","Starter Arrow","Starter Arrow"]}],slots:[]},
  Wizard:   {weapon:"Starter staff",offhand:"",armor:["Starter hood","Starter cloak","Starter boots"],bags:[{name:"Starter bag",items:[]}],slots:[]},
  Witch:    {weapon:"Starter book", offhand:"Starter broom",armor:["Starter hat","Starter cloak","Starter boots"],bags:[{name:"Potion bag",items:[]},{name:"Ingredient bag",items:[]}],slots:[]},
  Bard:     {weapon:"Starter guitar",offhand:"",armor:["Starter helmet","Starter chestplate","Starter leggings","Starter boots"],bags:[],slots:[]},
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let chars={},active=null,swapSlotKey="";
try{chars=JSON.parse(localStorage.getItem("dnd_v5")||"{}");}catch(e){}
function save(){try{localStorage.setItem("dnd_v5",JSON.stringify(chars));}catch(e){}}

function bagLimit(name){return BAG_LIMITS[name.toLowerCase()]||6;}
function calcParent(c,par){const kids=STAT_SUMS[par];if(!kids)return c.stats[par]||0;return kids.reduce((s,k)=>s+(c.stats[k]||0),0);}
function calcMaxHP(c){return(c.stats.Health||0)+(c.maxHpBonus||0);}

function makeChar(name,cls){
  const inv=STARTER_INV[cls];
  return{name,class:cls,level:1,gold:0,hp:BASE[cls].Health,maxHpBonus:0,
    stats:Object.assign({},BASE[cls]),notes:"",
    weapon:inv.weapon,offhand:inv.offhand||"",
    armor:[...(inv.armor||[])],
    bags:(inv.bags||[]).map(b=>({name:b.name,items:[...b.items]})),
    slots:[...(inv.slots||[])],expandedSpells:{}};
}

// ── PARTY ─────────────────────────────────────────────────────────────────────
function renderParty(){
  const g=document.getElementById("party-grid"),keys=Object.keys(chars);
  if(!keys.length){g.innerHTML='<p class="empty">No characters yet.</p>';return;}
  g.innerHTML="";
  keys.forEach(n=>{
    const c=chars[n],mhp=calcMaxHP(c),pct=mhp>0?c.hp/mhp:0;
    const cs=CLS_STYLE[c.class]||CLS_STYLE.Knight;
    const isDead=c.hp<=-mhp,isKno=!isDead&&c.hp<=0;
    const hc=isDead?"#8B1A1A":isKno?"#888":pct>.5?"#1D9E75":pct>.25?"#C07010":"#B03030";
    const st=isDead?" · Dead":isKno?" · Knocked":"";
    const b=document.createElement("button");b.className="pc";
    b.innerHTML=`<div class="pc-name">${esc(n)}</div><div class="pc-class" style="color:${cs.tx}">${c.class} · Lv ${c.level}</div><div class="pc-hp" style="color:${hc}">HP ${c.hp} / ${mhp}${st}</div>`;
    b.onclick=()=>openChar(n);g.appendChild(b);
  });
}
function createChar(){
  const name=document.getElementById("new-name").value.trim(),cls=document.getElementById("new-class").value;
  if(!name){alert("Enter a name.");return;}if(!cls){alert("Choose a class.");return;}
  if(chars[name]&&!confirm(`"${name}" already exists. Overwrite?`))return;
  chars[name]=makeChar(name,cls);save();
  document.getElementById("new-name").value="";document.getElementById("new-class").value="";
  renderParty();openChar(name);
}

// ── CHAR SCREEN ───────────────────────────────────────────────────────────────
function openChar(name){
  active=name;const c=chars[name];const cs=CLS_STYLE[c.class]||CLS_STYLE.Knight;
  const av=document.getElementById("c-ava");av.textContent=name[0].toUpperCase();av.style.background=cs.bg;av.style.color=cs.tx;av.style.borderColor=cs.dt;
  document.getElementById("c-nm").textContent=c.name;
  const cc=document.getElementById("c-cls-chip");cc.textContent=c.class;cc.style.background=cs.bg;cc.style.color=cs.tx;cc.style.borderColor=cs.dt+"88";
  document.getElementById("c-gold").textContent=c.gold||0;
  document.getElementById("c-notes").value=c.notes||"";
  document.getElementById("tab-spells-btn").style.display=SPELLS[c.class]?"":"none";
  refreshHP();refreshLevel();renderStats();renderSpells();renderInventory();
  swTabName("stats");
  document.getElementById("sc-party").classList.remove("active");
  document.getElementById("sc-char").classList.add("active");
}
function goBack(){active=null;document.getElementById("sc-char").classList.remove("active");document.getElementById("sc-party").classList.add("active");renderParty();}
function deleteChar(){if(!confirm(`Delete ${active}?`))return;delete chars[active];save();goBack();}

// ── HP ────────────────────────────────────────────────────────────────────────
function refreshHP(){
  const c=chars[active],mhp=calcMaxHP(c),pct=mhp>0?Math.max(0,Math.min(1,c.hp/mhp)):0;
  const isDead=c.hp<=-mhp,isKno=!isDead&&c.hp<=0;
  document.getElementById("c-hp-big").textContent=c.hp;
  document.getElementById("c-hp-big").style.color=isDead?"#8B1A1A":isKno?"#888":"var(--ink)";
  document.getElementById("c-hp-ml").textContent=`/ ${mhp} HP`;
  document.getElementById("c-hp-bar").style.width=(pct*100)+"%";
  document.getElementById("c-hp-bar").style.background=isDead?"#8B1A1A":isKno?"#888":pct>.5?"#1D9E75":pct>.25?"#EF9F27":"#B03030";
  const st=document.getElementById("c-hp-st");
  if(isDead){st.textContent="Dead";st.style.background="#FBECEC";st.style.color="#8B1A1A";}
  else if(isKno){st.textContent="Knocked out";st.style.background="#F0EDE8";st.style.color="#555";}
  else{st.textContent="";st.style.background="transparent";}
}
function applyHP(dir){const c=chars[active],d=parseInt(document.getElementById("hp-delta").value)||1;c.hp=Math.min(calcMaxHP(c),c.hp+dir*d);save();refreshHP();}
function setFullHP(){chars[active].hp=calcMaxHP(chars[active]);save();refreshHP();}

// ── GOLD / LEVEL ──────────────────────────────────────────────────────────────
function adjGold(d){const c=chars[active];c.gold=Math.max(0,(c.gold||0)+d);document.getElementById("c-gold").textContent=c.gold;save();}
function adjLevel(d){chars[active].level=Math.max(1,(chars[active].level||1)+d);save();refreshLevel();}
function refreshLevel(){
  const c=chars[active];document.getElementById("c-lv-num").textContent=c.level;
  const lc=document.getElementById("c-lv-chip");lc.textContent="Lv "+c.level;lc.style.background="#FBF0DC";lc.style.color="#6B3A00";lc.style.borderColor="#C0801088";
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function renderStats(){
  const c=chars[active],con=document.getElementById("stat-container");con.innerHTML="";
  GROUPS.forEach(g=>{
    const sec=mkSec(g.title,g.color);const grid=sec.querySelector(".sgrid");
    if(g.specialHealth){
      // Locked base health
      grid.appendChild(mkLocked("Health",c.stats.Health||0));
      // Max HP Bonus editable
      const bRow=document.createElement("div");bRow.className="srow";
      bRow.innerHTML=`<span class="slbl">Max HP Bonus</span><div class="sct"><button class="bico" onclick="adjBonus(-1)">−</button><span class="snum" id="s-maxhp-bonus">${c.maxHpBonus||0}</span><button class="bico" onclick="adjBonus(1)">+</button></div>`;
      grid.appendChild(bRow);
      // Total max HP
      const tot=document.createElement("div");tot.className="srow total";
      tot.innerHTML=`<span class="slbl" style="font-weight:500">Total Max HP</span><span class="snum tot" id="s-total-maxhp">${calcMaxHP(c)}</span>`;
      grid.appendChild(tot);
    } else {
      (g.rows||[]).forEach(row=>{
        const pv=calcParent(c,row.parent);
        grid.appendChild(mkParentRow(row.parent,pv,g.color));
        (row.children||[]).forEach(ch=>grid.appendChild(mkEditable(c,ch)));
      });
    }
    con.appendChild(sec);
  });
}

function mkSec(title,color){
  const s=document.createElement("div");s.className="ssec";
  s.innerHTML=`<div class="sshd"><div class="sdot" style="background:${color}"></div><span class="stit" style="color:${color}">${title}</span></div><div class="sgrid"></div>`;
  return s;
}
function mkLocked(label,val){
  const r=document.createElement("div");r.className="srow lkd";
  r.innerHTML=`<span class="slbl">${esc(label)}<span class="slk"> 🔒</span></span><span class="snum${val<0?" neg":""}">${val}</span>`;
  return r;
}
function mkParentRow(label,val,color){
  const r=document.createElement("div");r.className="srow total";
  r.innerHTML=`<span class="slbl" style="font-weight:500;color:${color}">${esc(label)}</span><span class="snum" id="s-par-${label.replace(/ /g,"_")}" style="color:${color};font-size:15px">${val}</span>`;
  return r;
}
function mkEditable(c,stat){
  const val=c.stats[stat]!==undefined?c.stats[stat]:0;
  const sid="s-"+stat.replace(/ /g,"_");
  const r=document.createElement("div");r.className="srow";
  r.innerHTML=`<span class="slbl">${esc(stat)}</span><div class="sct"><button class="bico" onclick="adjStat('${stat}',-1)">−</button><span class="snum${val<0?" neg":""}" id="${sid}">${val}</span><button class="bico" onclick="adjStat('${stat}',1)">+</button></div>`;
  return r;
}
function adjStat(stat,d){
  const c=chars[active];c.stats[stat]=(c.stats[stat]||0)+d;
  const el=document.getElementById("s-"+stat.replace(/ /g,"_"));
  if(el){el.textContent=c.stats[stat];el.className="snum"+(c.stats[stat]<0?" neg":"");}
  Object.entries(STAT_SUMS).forEach(([par,kids])=>{
    if(kids.includes(stat)){
      const pv=calcParent(c,par);
      const pel=document.getElementById("s-par-"+par.replace(/ /g,"_"));
      if(pel)pel.textContent=pv;
    }
  });
  save();
}
function adjBonus(d){
  const c=chars[active];c.maxHpBonus=(c.maxHpBonus||0)+d;
  document.getElementById("s-maxhp-bonus").textContent=c.maxHpBonus;
  document.getElementById("s-total-maxhp").textContent=calcMaxHP(c);
  save();refreshHP();
}

// ── SPELLS ────────────────────────────────────────────────────────────────────
function renderSpells(){
  const c=chars[active],con=document.getElementById("spell-container");con.innerHTML="";
  const list=SPELLS[c.class];
  if(!list||!list.length){con.innerHTML='<p class="empty">No spells for this class.</p>';return;}
  list.forEach((sp,i)=>{
    const sc=SCHOOL_CLR[sp.school]||{bg:"#F0EDE8",tx:"#444"};
    const exp=c.expandedSpells&&c.expandedSpells[i];
    const div=document.createElement("div");div.className="spcard";
    div.innerHTML=`<div class="spnm">${esc(sp.name)}</div>
<div class="spmeta"><span class="sptag" style="background:${sc.bg};color:${sc.tx}">${sp.school}</span><span class="sptag" style="background:#F5ECD7;color:#5C3D2E">⚡ ${sp.cost}</span><span class="sptag" style="background:#F5ECD7;color:#5C3D2E">⬡ ${sp.range}</span></div>
<div class="spdesc">${esc(sp.desc)}</div>
${exp?`<div class="inset" style="margin-top:7px;font-size:13px;color:var(--inkl)"><b style="font-family:var(--fd);font-size:10px;letter-spacing:.05em;color:var(--ink)">EFFECT</b><br>${esc(sp.effect)}</div>`:""}
<button class="spex" onclick="togSpell(${i})">${exp?"▲ Hide":"▼ Show effect"}</button>`;
    con.appendChild(div);
  });
}
function togSpell(i){const c=chars[active];if(!c.expandedSpells)c.expandedSpells={};c.expandedSpells[i]=!c.expandedSpells[i];save();renderSpells();}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
function renderInventory(){
  const c=chars[active];

  // Equipped
  const eq=document.getElementById("inv-eq");eq.innerHTML="";
  const eqSlots=[{label:"Weapon",key:"weapon"},{label:"Off-hand",key:"offhand"}];
  (c.armor||[]).forEach((_,i)=>eqSlots.push({label:`Armor ${i+1}`,key:`armor_${i}`}));
  eqSlots.forEach(sl=>{
    const val=sl.key.startsWith("armor_")?c.armor[parseInt(sl.key.split("_")[1])]:c[sl.key]||"";
    const row=document.createElement("div");row.className="inv-eq-row";
    row.innerHTML=`<span class="inv-lbl">${sl.label}</span><span class="inv-val${!val?" empty":""}">${esc(val||"Empty")}</span><div class="inv-act"><button class="btn bsm" onclick="openSwapEquip('${sl.key}','${sl.label}')">Swap</button></div>`;
    eq.appendChild(row);
  });

  // Bags
  const bagsDiv=document.getElementById("inv-bags");bagsDiv.innerHTML="";
  (c.bags||[]).forEach((bag,bi)=>{
    const lim=bagLimit(bag.name),cnt=bag.items.length,over=cnt>=lim;
    const bc=document.createElement("div");bc.className="bagcard";
    bc.innerHTML=`<div class="bagtit">🎒 ${esc(bag.name)}<span class="bag-cnt${cnt>=lim?" over":""}">${cnt}/${lim}</span></div><div id="bag-items-${bi}"></div><div class="badda"><input type="text" id="bag-inp-${bi}" placeholder="Add item…"><button class="btn bsm${over?" btnd btnp":""}" onclick="addBagItem(${bi})">${over?"Full":"Add"}</button></div>`;
    bagsDiv.appendChild(bc);
    const biDiv=document.getElementById(`bag-items-${bi}`);
    if(!bag.items.length){biDiv.innerHTML='<p class="empty" style="font-size:12px">Empty</p>';}
    else bag.items.forEach((it,ii)=>{
      const row=document.createElement("div");row.className="bitem";
      row.innerHTML=`<span>${esc(it)}</span><div class="row"><button class="btn bsm" onclick="moveBagToCarried(${bi},${ii})" title="Move to carried">→ Carry</button><button class="btn bsm btnd" onclick="remBagItem(${bi},${ii})">✕</button></div>`;
      biDiv.appendChild(row);
    });
  });

  // Carried items (limit 3)
  const carried=c.slots||[];const cnt=carried.length,over=cnt>=CARRIED_LIMIT;
  const ctr=document.getElementById("carried-counter");
  ctr.textContent=`${cnt} / ${CARRIED_LIMIT}`;ctr.className="inv-counter"+(over?" over":"");
  const car=document.getElementById("inv-carried");car.innerHTML="";
  if(!carried.length){car.innerHTML='<p class="empty">No carried items.</p>';}
  else carried.forEach((it,i)=>{
    const row=document.createElement("div");row.className="inv-eq-row";
    const hasBags=(c.bags||[]).length>0;
    row.innerHTML=`<span class="inv-lbl">Item</span><span class="inv-val">${esc(it)}</span><div class="inv-act">${hasBags?`<button class="btn bsm" onclick="openMoveToBag(${i})">→ Bag</button>`:""}<button class="btn bsm" onclick="openEquipFromCarried(${i})">Equip</button><button class="btn bsm btnd" onclick="remCarried(${i})">✕</button></div>`;
    car.appendChild(row);
  });
  // Hide add row if full
  const addRow=document.getElementById("carried-add-row");
  if(addRow)addRow.style.display=over?"none":"";
}

function addCarried(){
  const c=chars[active];
  if((c.slots||[]).length>=CARRIED_LIMIT){alert(`Carried items are full (${CARRIED_LIMIT} max)!`);return;}
  const inp=document.getElementById("new-item-inp");const v=inp.value.trim();if(!v)return;
  if(!c.slots)c.slots=[];c.slots.push(v);inp.value="";save();renderInventory();
}
function remCarried(i){chars[active].slots.splice(i,1);save();renderInventory();}
function addBagItem(bi){
  const c=chars[active],bag=c.bags[bi],lim=bagLimit(bag.name);
  if(bag.items.length>=lim){alert(`${bag.name} is full (${lim} slots)!`);return;}
  const inp=document.getElementById(`bag-inp-${bi}`);const v=inp.value.trim();if(!v)return;
  bag.items.push(v);inp.value="";save();renderInventory();
}
function remBagItem(bi,ii){chars[active].bags[bi].items.splice(ii,1);save();renderInventory();}
function moveBagToCarried(bi,ii){
  const c=chars[active];
  if((c.slots||[]).length>=CARRIED_LIMIT){alert(`Carried items full (${CARRIED_LIMIT} max)! Swap an item first.`);return;}
  const item=c.bags[bi].items.splice(ii,1)[0];
  if(!c.slots)c.slots=[];c.slots.push(item);save();renderInventory();
}

// ── SWAP MODAL ────────────────────────────────────────────────────────────────
function openSwapEquip(slotKey,slotLabel){
  const c=chars[active];swapSlotKey=slotKey;
  const curVal=slotKey.startsWith("armor_")?c.armor[parseInt(slotKey.split("_")[1])]:c[slotKey]||"";
  const opts=[];
  opts.push({label:"(Empty)",src:"empty",idx:-1,bagIdx:-1});
  (c.slots||[]).forEach((it,i)=>opts.push({label:it,src:"carried",idx:i,bagIdx:-1}));
  (c.bags||[]).forEach((bag,bi)=>(bag.items||[]).forEach((it,ii)=>opts.push({label:`${esc(it)} (${esc(bag.name)})`,src:"bag",idx:ii,bagIdx:bi})));
  document.getElementById("swap-title").textContent=`Swap: ${slotLabel}`;
  document.getElementById("swap-sub").textContent=`Currently: ${curVal||"Empty"}`;
  const optsDiv=document.getElementById("swap-opts");optsDiv.innerHTML="";
  if(opts.length===1){optsDiv.innerHTML='<p class="empty">No items available to swap in.</p>';}
  opts.forEach(opt=>{
    const row=document.createElement("div");row.className="swap-opt";
    row.innerHTML=`<span>${opt.label}</span><button class="btn bsm btnp" onclick="doSwap('${opt.src}',${opt.idx},${opt.bagIdx})">Equip</button>`;
    optsDiv.appendChild(row);
  });
  document.getElementById("swap-modal").classList.add("open");
}
function doSwap(src,idx,bagIdx){
  const c=chars[active];
  let oldVal="";
  if(swapSlotKey.startsWith("armor_")){const ai=parseInt(swapSlotKey.split("_")[1]);oldVal=c.armor[ai]||"";c.armor[ai]="";}
  else{oldVal=c[swapSlotKey]||"";c[swapSlotKey]="";}
  let newVal="";
  if(src==="empty"){newVal="";}
  else if(src==="carried"){newVal=c.slots.splice(idx,1)[0];if(oldVal){if(!c.slots)c.slots=[];c.slots.push(oldVal);}}
  else if(src==="bag"){newVal=c.bags[bagIdx].items.splice(idx,1)[0];if(oldVal)c.bags[bagIdx].items.push(oldVal);}
  if(swapSlotKey.startsWith("armor_")){const ai=parseInt(swapSlotKey.split("_")[1]);c.armor[ai]=newVal;}
  else c[swapSlotKey]=newVal;
  save();renderInventory();closeSwap();
}
function closeSwap(){document.getElementById("swap-modal").classList.remove("open");}

function openMoveToBag(carriedIdx){
  const c=chars[active];if(!c.bags||!c.bags.length){alert("No bags.");return;}
  const item=c.slots[carriedIdx];
  document.getElementById("swap-title").textContent="Move to Bag";
  document.getElementById("swap-sub").textContent=`Moving: ${item}`;
  const optsDiv=document.getElementById("swap-opts");optsDiv.innerHTML="";
  c.bags.forEach((bag,bi)=>{
    const lim=bagLimit(bag.name),full=bag.items.length>=lim;
    const row=document.createElement("div");row.className="swap-opt";
    row.innerHTML=`<span>${esc(bag.name)} (${bag.items.length}/${lim})</span><button class="btn bsm${full?" btnd":""}" onclick="doMoveToBag(${carriedIdx},${bi})">${full?"Full":"Move"}</button>`;
    optsDiv.appendChild(row);
  });
  document.getElementById("swap-modal").classList.add("open");
}
function doMoveToBag(carriedIdx,bi){
  const c=chars[active],bag=c.bags[bi],lim=bagLimit(bag.name);
  if(bag.items.length>=lim){alert(`${bag.name} is full!`);return;}
  const item=c.slots.splice(carriedIdx,1)[0];bag.items.push(item);
  save();renderInventory();closeSwap();
}
function openEquipFromCarried(carriedIdx){
  const c=chars[active],item=c.slots[carriedIdx];
  document.getElementById("swap-title").textContent="Equip item";
  document.getElementById("swap-sub").textContent=`Equipping: ${item}`;
  const optsDiv=document.getElementById("swap-opts");optsDiv.innerHTML="";
  const slots=[{label:"Weapon",key:"weapon"},{label:"Off-hand",key:"offhand"}];
  (c.armor||[]).forEach((_,i)=>slots.push({label:`Armor ${i+1}`,key:`armor_${i}`}));
  slots.forEach(sl=>{
    const cur=sl.key.startsWith("armor_")?c.armor[parseInt(sl.key.split("_")[1])]:c[sl.key]||"";
    const row=document.createElement("div");row.className="swap-opt";
    row.innerHTML=`<span>${sl.label}${cur?` <span style="color:var(--inkl);font-size:12px">(${esc(cur)})</span>`:""}</span><button class="btn bsm btnp" onclick="doEquipToSlot('${sl.key}',${carriedIdx})">Equip</button>`;
    optsDiv.appendChild(row);
  });
  document.getElementById("swap-modal").classList.add("open");
}
function doEquipToSlot(slotKey,carriedIdx){swapSlotKey=slotKey;doSwap("carried",carriedIdx,-1);}

// ── NOTES ─────────────────────────────────────────────────────────────────────
function saveNotes(){if(!active)return;chars[active].notes=document.getElementById("c-notes").value;save();}

// ── TABS ──────────────────────────────────────────────────────────────────────
function swTab(name,el){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  if(el)el.classList.add("active");
  document.querySelectorAll(".tc").forEach(t=>t.classList.remove("active"));
  const tc=document.getElementById("tc-"+name);if(tc)tc.classList.add("active");
}
function swTabName(name){
  document.querySelectorAll(".tab").forEach(t=>{t.classList.remove("active");if(t.getAttribute("onclick")&&t.getAttribute("onclick").includes(`'${name}'`))t.classList.add("active");});
  document.querySelectorAll(".tc").forEach(t=>t.classList.remove("active"));
  const tc=document.getElementById("tc-"+name);if(tc)tc.classList.add("active");
}

// ── IMPORT / EXPORT ───────────────────────────────────────────────────────────
function exportChar(){
  const c=chars[active];
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(c,null,2)],{type:"application/json"}));
  a.download=c.name.replace(/\s+/g,"_")+"_character.json";a.click();
}
function importChar(ev){
  const f=ev.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=ex=>{
    try{
      const c=JSON.parse(ex.target.result);
      if(!c.name||!c.class){alert("Invalid file.");return;}
      c.maxHpBonus=c.maxHpBonus||0;c.bags=c.bags||[];c.slots=c.slots||[];c.armor=c.armor||[];c.expandedSpells=c.expandedSpells||{};
      if(chars[c.name]&&!confirm(`"${c.name}" exists. Overwrite?`))return;
      chars[c.name]=c;save();renderParty();alert(`${c.name} imported!`);
    }catch{alert("Could not read file.");}
  };r.readAsText(f);ev.target.value="";
}

function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

renderParty();
