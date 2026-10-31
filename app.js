'use strict';
const C = window.BIRTHDAY_CONFIG;
const scene = document.querySelector('#scene');
const chapters = ['IDENTIFICATION','ACCOUNT INVESTIGATION','TALENT ANALYSIS','TRUST CHECK','PRANK REVEAL','SIDE QUEST','CHECKING IN','BIRTHDAY WISHES','YOUR GIFT','CONVENE','REWARDS','YOUR COLLECTION','NEW ENVELOPE','OPENING YOUR LETTER','HAPPY BIRTHDAY, YUKI'];
let transitionOverlay=null, artistOverlay=null;
let stage=0, attempts=0, rewardIndex=0, sound=false, audioContext, epoch=0, audio;
const timers = new Set();
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
function clearScene(){epoch++;clearArtistOverlay();if(transitionOverlay){transitionOverlay.querySelector('video')?.pause();transitionOverlay.remove();transitionOverlay=null;document.querySelector('main').inert=false;document.querySelector('header').inert=false;document.querySelector('footer').inert=false;document.body.classList.remove('transition-playing');}for(const id of timers)clearTimeout(id);timers.clear();if(audio){audio.pause();audio=null;}scene.querySelectorAll('video').forEach(v=>v.pause());}
function tone(freq=440,duration=.08){if(!sound)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.value=freq;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.start();o.stop(audioContext.currentTime+duration);}catch{}}
function button(label,id='next',cls='primary'){return `<button class="${cls}" id="${id}">${label}</button>`;}
function nextTo(n){document.querySelector('#next')?.addEventListener('click',()=>go(n));}
function intro(eyebrow,title,description=''){return `<p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${description?`<p class="lead">${description}</p>`:''}`;}
function go(n){clearScene();stage=n;document.querySelector('#chapter').textContent=`${String(n+1).padStart(2,'0')} / ${chapters[n]}`;document.querySelector('#progress').setAttribute('aria-valuemax',String(chapters.length-1));document.querySelector('#progress').setAttribute('aria-valuenow',String(n));document.querySelector('#progress>div').style.width=`${n/(chapters.length-1)*100}%`;scene.style.animation='none';void scene.offsetWidth;scene.style.animation='';tone(550);render();decorateArchive();const heading=scene.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'instant'});}
function render(){
if(stage===0){scene.innerHTML=`<div class="split"><div><p class="eyebrow pill">Character archive · Restricted access</p><h1>Who’s that<br><em>character?</em></h1><p class="lead">Six sealed fragments. Every wrong guess uncovers another piece of the mystery.</p><form id="guess"><label class="tiny" for="answer">CHARACTER NAME</label><div class="form"><input id="answer" name="answer" autocomplete="off" placeholder="Your best guess…" required maxlength="80">${button('Scan entry ↗','submit')}</div></form><p id="feedback" class="tiny" role="status">Make a guess to begin the investigation.</p><button id="hint" class="icon-button hidden">Need a hint?</button><p class="tiny">Hints unlock after six wrong guesses.</p></div><div class="mystery-evidence"><div class="mystery-frame"><img id="mystery-image" src="${esc(C.characterImage)}" alt="Covered mystery character illustration"><div class="tile-covers" aria-hidden="true">${Array.from({length:6},(_,i)=>`<div class="tile-cover" data-tile="${i}"><span>✦<small>SEALED / 0${i+1}</small></span></div>`).join('')}</div></div><p class="art-tag" id="tile-count">EVIDENCE RECOVERED · 0 / 6</p></div></div>`;
document.querySelector('#guess').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#answer');const value=input.value.trim().toLowerCase();if(!value){input.focus();return;}if(C.acceptedAnswers.map(x=>x.toLowerCase()).includes(value)){document.querySelectorAll('.tile-cover').forEach(t=>t.classList.add('unsealed'));document.querySelector('#mystery-image').alt=C.characterName+' character illustration';document.querySelector('#tile-count').textContent='IDENTITY CONFIRMED';document.querySelector('#feedback').textContent=`${C.characterName} identified. Wait… that was a little too easy.`;document.querySelector('#submit').disabled=true;document.querySelector('#hint').classList.add('hidden');later(()=>go(1),1500);}else{attempts++;const uncovered=Math.min(attempts,6);document.querySelectorAll('.tile-cover').forEach((t,i)=>t.classList.toggle('unsealed',i<uncovered));document.querySelector('#tile-count').textContent=`EVIDENCE RECOVERED · ${uncovered} / 6`;tone(180);document.querySelector('#feedback').textContent=attempts<6?`Not quite. Fragment ${uncovered} of 6 recovered. Take another look.`:'All six fragments recovered. Still a mystery? You can ask for a hint now.';if(attempts>=6)document.querySelector('#hint').classList.remove('hidden');input.select();}});document.querySelector('#hint').onclick=()=>{document.querySelector('#feedback').textContent=`The answer is ${C.characterName}. The archive believes in second chances. And seventh guesses.`;};}
if(stage===1){scene.innerHTML=`${intro('Unexpected player signature','That was a little<br><em>too easy.</em>','The archive has a few follow-up questions about your account.')}<div class="panel"><span class="eyebrow">LIVE ACCOUNT DIAGNOSTIC <span class="blink">●</span></span><div class="terminal" id="logs"></div>${button('Continue investigation ↗')}</div>`;document.querySelector('#next').disabled=true;const lines=['Gacha player detected.','Checking account…','Crazy account detected.','Almost whale-like account detected.','Inspecting Phrolova…','WARNING: PHROLOVA ALMOST NUKED THE SYSTEM.','Emergency recovery initiated… system restored.'];lines.forEach((line,i)=>later(()=>{const p=document.createElement('p');p.textContent=`> ${line}`;if(/phrolova/i.test(line))p.classList.add('phrolova-tile');document.querySelector('#logs').append(p);tone(i===5?130:500);if(i===5){scene.classList.add('shake');later(()=>scene.classList.remove('shake'),850);}if(i===lines.length-1)document.querySelector('#next').disabled=false;},450+i*750));document.querySelector('#next').onclick=investigationTransition;}
if(stage===2){scene.innerHTML=`${intro('Profile recovered','Too much talent.<br>One person.','No actual scanning. Just overwhelming evidence.')}<div class="panel"><p class="eyebrow">✦ FANTASTIC VOICE DETECTED</p><div class="grid">${[['LOCATION','Malaysia'],['VOICE','Fantastic'],['TALENTS','Singer · Artist · Writer · Gamer · Musician · etc.'],['THREAT LEVEL','Phrolova S2']].map(([k,v])=>`<div class="stat ${k==='THREAT LEVEL'?'phrolova-tile':''}"><small>${k}</small><strong>${v}</strong></div>`).join('')}</div><p class="tiny">System unable to act normal about this.</p>${C.singingAudio?button('Play voice evidence ♫','voice','secondary'):''} ${button('Can I trust this system? ↗')}</div>`;if(C.singingAudio)document.querySelector('#voice').onclick=()=>{audio ||= new Audio(C.singingAudio);audio.play().catch(()=>{document.querySelector('#voice').textContent='Audio unavailable';});};nextTo(3);}
if(stage===3)choice('Security checkpoint','Do you trust<br>this terminal?','Choose wisely. One of these options is feeling a little shy.','Yes, I trust you','Absolutely not',4,false);
if(stage===4)choice('A small confession','It was a prank,<br>btw… 🥺','Are you mad at me?','No, I’m not mad ♡','YES, I’M MAD',5,true);
if(stage===5){scene.innerHTML=`<div class="panel soft center"><div class="emoji">💧</div>${intro('Optional side quest','A tiny wellness mission','Even legendary gamers need water.')}<ol class="mission"><li><b>01</b> Grab a nearby water bottle.</li><li><b>02</b> Open it, and shove it inside your…</li><li id="water-end" class="hidden"><b>03</b> Mouth :3 Take a sip! 💦</li></ol>${button('Mission complete ✓')}<p class="tiny" id="water-note">The suspense is deeply unnecessary.</p></div>`;document.querySelector('#next').disabled=true;later(()=>{document.querySelector('#water-end').classList.remove('hidden');document.querySelector('#next').disabled=false;},1800);document.querySelector('#next').onclick=()=>{document.querySelector('#water-note').textContent='Achievement unlocked: Hydrated gamer ✦';document.querySelector('#next').disabled=true;tone(880,.2);later(()=>go(6),1000);};}
if(stage===6){scene.innerHTML=`<div class="panel soft center"><div class="emoji">🌷</div>${intro('No tricks for this one','Jokes apart…',`How are you doing today, ${esc(C.nickname)}?`)}<div class="choice-zone" id="feelings">${button('I’m doing good 😊','good')}${button('Not good 🥺','bad','secondary')}</div><div id="response"></div></div>`;const answer=good=>{document.querySelector('#feelings').remove();document.querySelector('#response').innerHTML=`<p class="lead">${good?'Good. Let’s make today a little more special.':'Then let’s take today one little moment at a time. You don’t have to be cheerful for this — your gift is still here, just for you. ♡'}</p>${button('There’s something for you… ↗')}`;nextTo(7);};document.querySelector('#good').onclick=()=>answer(true);document.querySelector('#bad').onclick=()=>answer(false);}
if(stage===7){scene.innerHTML=`<div class="birthday-book"><div class="birthday-photo"><img src="./assets/yuki-birthday-picture.webp" alt="Birthday illustration for Yuki with a family at a Japanese shrine"></div><div class="birthday-trait"><h2>HAPPY BIRTHDAY YUKI</h2></div><div class="birthday-orientation"><h3>Character Orientation</h3><p>This picture might be AI-generated, but it was made possible by the love and hard work of the people behind these tools.</p><p>So, on behalf of all those companies: a very, very <strong>HAPPY BIRTHDAY!</strong> ♡</p><p>For the rest of us, it’s an easier way to express ourselves. We’re not all as talented as you, Yuki—but we still wanted to make something special for you.</p></div></div><div class="birthday-actions">${button('Now, about your gift… ↗')}</div>`;nextTo(8);}
if(stage===8){scene.innerHTML=`<div class="panel banner"><div>${intro('Birthday-exclusive convene · 31 October','Your gift<br>has arrived.','One ten-pull. Absolutely no suspicious birthday interference. Probably.')}<div class="balance"><span class="tide">✦</span><strong>10</strong> Radiant Tides</div><div>${button('Convene ×10 ✦')}</div><p class="tiny">A fan-made birthday pull · no purchases · no account connection</p></div><div class="gift-art" aria-hidden="true">✧</div></div>`;nextTo(9);}
if(stage===9)cinematic();
if(stage===10)showReward(rewardIndex);
if(stage===11)results();
if(stage===12)envelope();
if(stage===13)playPullVideo('./assets/letter-opening.mp4','Your birthday letter opening',()=>go(14));
if(stage===14)finalLetter();
}
function investigationTransition(){
 if(transitionOverlay)return;
 const originEpoch=epoch;
 document.querySelector('#next').disabled=true;
 transitionOverlay=document.createElement('div');transitionOverlay.className='phrolova-transition';transitionOverlay.setAttribute('role','dialog');transitionOverlay.setAttribute('aria-modal','true');transitionOverlay.setAttribute('aria-label','Phrolova cinematic transition');
 transitionOverlay.innerHTML=`<video playsinline muted preload="auto" aria-label="Phrolova animation from Tenor"><source src="./assets/phrolova-transition.mp4?v=2" type="video/mp4"></video><p class="transition-loading">One more anomaly…</p><button class="transition-skip">Skip transition ↗</button><a class="transition-credit" href="https://tenor.com/en-IN/view/phrolova-anime-wuwa-wuthering-waves-gif-16453555748876991683" target="_blank" rel="noopener noreferrer">Phrolova · TyoTyo / Tenor</a>`;
 document.body.append(transitionOverlay);document.body.classList.add('transition-playing');
 for(const el of ['main','header','footer'])document.querySelector(el).inert=true;
 const video=transitionOverlay.querySelector('video'),skip=transitionOverlay.querySelector('button');skip.focus();
 let finished=false;
 const finish=()=>{if(finished||epoch!==originEpoch)return;finished=true;transitionOverlay?.classList.add('is-leaving');later(()=>go(2),450);};
 video.addEventListener('playing',()=>transitionOverlay?.classList.add('is-playing'),{once:true});
 video.addEventListener('ended',finish,{once:true});video.addEventListener('error',finish,{once:true});
 video.querySelector('source').addEventListener('error',finish,{once:true});
 skip.onclick=finish;transitionOverlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish();}});
 video.play().catch(()=>finish());later(finish,15000);
}
function decorateArchive(){
 document.body.classList.toggle('letter-mode',stage>=12);document.body.classList.toggle('idv-mode',stage<=7);document.body.classList.toggle('birthday-page',stage===7);
 scene.classList.remove('shake');
 if(stage<1||stage>6)return;
 const variants=['','hunter','survivor','survivor-switch','hunter-switch','survivor','survivor-switch'];
 const book=document.createElement('div');book.className=`idv-book book-${variants[stage]}`;
 const portrait=document.createElement('aside');portrait.className='book-evidence';
 portrait.innerHTML=`<div class="evidence-photo" aria-label="Citrus.rain case portrait"></div><div class="evidence-caption">CASE No. 1031<br><strong>Citrus.rain</strong><small>HANDLE WITH EXTREME CAUTION</small></div>`;
 const copy=document.createElement('div');copy.className='book-copy';
 while(scene.firstChild)copy.append(scene.firstChild);
 book.append(portrait,copy);scene.append(book);
}
function choice(eyebrow,title,description,yes,no,next,soft){scene.innerHTML=`<div class="panel center ${soft?'soft':''}">${intro(eyebrow,title,description)}<div class="choice-zone"><button class="primary" id="next">${yes}</button><button class="secondary dodge" id="dodge">${no}</button></div><p class="tiny" id="dodge-note">You’re definitely in control here.</p></div>`;nextTo(next);const b=document.querySelector('#dodge'),zone=b.parentElement;let count=0;function dodge(e){e.preventDefault();count++;const w=zone.clientWidth-b.offsetWidth,h=zone.clientHeight-b.offsetHeight; b.style.position='absolute';const oldX=parseFloat(b.style.left)||0;let x=Math.random()*Math.max(0,w);if(Math.abs(x-oldX)<70)x=oldX>w/2?0:w;b.style.left=x+'px';b.style.top=(55+Math.random()*Math.max(0,h-55))+'px';document.querySelector('#dodge-note').textContent=count>2?(soft?'Your complaint has been successfully avoided.':'That option appears to have commitment issues.'):'Huh. Slippery little button.';tone(250+count*20);}b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')dodge(e);});b.addEventListener('pointerdown',dodge);b.addEventListener('click',dodge);}
// Advance on the actual end of each supplied clip, with a fallback for unavailable media.
function playPullVideo(src,label,onFinish,{fakeout=false}={}){
 const token=epoch;
 scene.innerHTML=`<div class="cinema footage"><video playsinline preload="auto" aria-label="${esc(label)}"></video><p class="pull-loading" role="status">Preparing your pull…</p><button class="secondary" id="skip">Skip animation ↗</button></div>`;
 const video=scene.querySelector('video'),box=scene.querySelector('.cinema');
 let finished=false,watchdog,interrupted=false;
 const finish=()=>{if(finished||epoch!==token)return;finished=true;clearTimeout(watchdog);timers.delete(watchdog);video.pause();onFinish();};
 const arm=()=>{clearTimeout(watchdog);timers.delete(watchdog);watchdog=later(finish,20000);};
 video.muted=!sound;
 video.addEventListener('ended',finish,{once:true});
 video.addEventListener('error',finish,{once:true});
 video.addEventListener('playing',()=>{box.classList.add('is-playing');arm();});
 video.addEventListener('timeupdate',()=>{
  if(finished||epoch!==token)return;
  arm();
  if(!fakeout||interrupted||!Number.isFinite(video.duration)||video.currentTime<video.duration/2)return;
  interrupted=true;video.pause();
  const caption=document.createElement('div');caption.className='gift-override';
  caption.innerHTML='<p class="eyebrow">BIRTHDAY INTERVENTION</p><h2>That’s not how your gift will go.</h2><p class="tiny">Let’s try that again.</p>';
  box.append(caption);
  later(()=>{
   if(finished||epoch!==token)return;
   box.classList.add('rewinding');video.muted=true;
   caption.querySelector('.eyebrow').textContent='◀◀ REWINDING';
   const from=video.currentTime;let frame=0;
   const rewind=()=>{
    if(finished||epoch!==token)return;
    frame++;video.currentTime=Math.max(0,from*(1-frame/30));
    if(frame<30)later(rewind,60);else later(finish,250);
   };
   rewind();
  },2200);
 });
 scene.querySelector('#skip').onclick=finish;
 scene.querySelector('#skip').focus({preventScroll:true});
 arm();
 if(!src){finish();return;}
 video.src=src;
 video.play().catch(()=>{if(epoch===token)finish();});
}
function cinematic(){
 playPullVideo(C.purpleVideo,'Four-star pull — before the birthday intervention',()=>{
  playPullVideo(C.goldVideo,'Five-star birthday override',()=>{
   playPullVideo(C.firstPullVideo,'Your first birthday pull',()=>{rewardIndex=0;go(10);});
  });
 },{fakeout:true});
}
function revealReward(index){
 rewardIndex=index;
 go(10);
}
function showReward(index,fromCollection=false){const r=C.rewards[index];scene.innerHTML=`<div class="reward ${r.rarity===5?'five-star-reward':''}"><div class="reward-art">${r.image?`<img src="${esc(r.image)}" alt="${esc(r.title)}">`:`<span aria-hidden="true">${r.icon}</span>`}</div><div><p class="eyebrow">${fromCollection?'YOUR COLLECTION':index>=10?'SURPRISE · BONUS REVEAL':`REVEAL ${String(index+1).padStart(2,'0')} / 10`} · ${esc(r.subtitle)}</p><div class="stars" aria-label="${r.rarity} stars">${'✦'.repeat(r.rarity)}</div><h2>${esc(r.title)}</h2><p class="lead">${esc(r.description)}</p>${button(fromCollection?'Back to results ↗':index===C.rewards.length-1?'View all rewards ↗':index===9?'Wait, one more thing… ↗':'Next reveal ↗')}</div></div>`;document.querySelector('#next').onclick=()=>{if(fromCollection||index===C.rewards.length-1)go(11);else{revealReward(index+1);}};if(r.title==='The Artist')artistBurst();}
function results(){scene.innerHTML=`${intro('Convene complete','Ten pulls. One extra surprise.','A very suspicious amount of birthday luck. Tap a reward to look again.')}<div class="results">${C.rewards.map((r,i)=>`<button class="result-card ${r.rarity===5?'gold-card':''}" data-reward="${i}" aria-label="View ${esc(r.title)}">${r.image?`<img src="${esc(r.image)}" alt="">`:`<span>${r.icon}</span>`}<strong>${esc(r.title)}</strong><small>${'✦'.repeat(r.rarity)}</small></button>`).join('')}</div><div class="panel"><p class="eyebrow">ONE LAST THING</p><h3>There’s a letter for you.</h3><p class="tiny">A final message, just for Yuki.</p>${button('Read your final message ↗','final-message')} ${button('Replay the ten-pull ↺','replay','secondary')}</div>`;document.querySelectorAll('[data-reward]').forEach(b=>b.onclick=()=>{showReward(Number(b.dataset.reward),true);scene.querySelector('h2').focus?.();});document.querySelector('#replay').onclick=()=>go(8);document.querySelector('#final-message').onclick=()=>go(12);}

function clearArtistOverlay(){
 if(!artistOverlay)return;
 artistOverlay.remove();artistOverlay=null;
 document.body.classList.remove('art-overflow');
 for(const tag of ['main','header','footer'])document.querySelector(tag).inert=false;
}
function artistBurst(){
 clearArtistOverlay();
 const artworks=C.artistArtwork||[];if(!artworks.length)return;
 const originEpoch=epoch,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const cols=window.innerWidth<700?3:6, rows=Math.ceil(artworks.length/cols);
 artistOverlay=document.createElement('div');
 artistOverlay.className='artist-overflow';artistOverlay.setAttribute('role','dialog');
 artistOverlay.setAttribute('aria-modal','true');artistOverlay.setAttribute('aria-labelledby','art-overflow-title');
 artistOverlay.innerHTML=`<div class="art-storm" aria-hidden="true">${Array.from({length:rows*cols},(_,i)=>artworks[i%artworks.length]).map((src,i)=>{
 const x=((i%cols)+.5)*100/cols,y=(Math.floor(i/cols)+.5)*100/rows;
 return `<figure class="storm-sheet" style="--x:${x}%;--y:${y}%;--w:${125/cols}vw;--h:${130/rows}dvh;--turn:${(i*17%23)-11}deg;--delay:${reduced?0:i*145}ms;--fly-y:${(i%2?1:-1)*(30+i*4)}vh;--fly-turn:${(i%2?1:-1)*(35+i*7)}deg;--exit-delay:${i*18}ms"><img src="${esc(src)}" alt="" decoding="async"></figure>`;
 }).join('')}</div><div class="art-overflow-prompt" hidden><p class="eyebrow">ARCHIVE CAPACITY EXCEEDED</p><h2 id="art-overflow-title">Too much talent.<br>Not enough screen space.</h2><p>There’s too much art to fit on one page.<br>Blow it away to uncover the artist. 💨</p><button class="primary" id="blow-art">Blow away the art 💨</button></div><button class="art-skip secondary">Skip art animation ↗</button>`;
 document.body.append(artistOverlay);document.body.classList.add('art-overflow');
 for(const tag of ['main','header','footer'])document.querySelector(tag).inert=true;
 const overlay=artistOverlay,prompt=overlay.querySelector('.art-overflow-prompt'),blow=overlay.querySelector('#blow-art'),skip=overlay.querySelector('.art-skip');
 skip.focus();let leaving=false;
 const finish=()=>{if(leaving||epoch!==originEpoch)return;leaving=true;overlay.classList.add('is-blowing');tone(330,.2);later(()=>{clearArtistOverlay();const heading=scene.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}},reduced?0:1800);};
 blow.onclick=finish;skip.onclick=finish;
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish();}if(e.key==='Tab'&&!prompt.hidden){e.preventDefault();(document.activeElement===blow?skip:blow).focus();}});
 later(()=>{if(epoch!==originEpoch||leaving)return;prompt.hidden=false;blow.focus();},reduced?0:artworks.length*145+900);
}


function envelope(){
 scene.innerHTML=`<div class="envelope-scene center"><p class="eyebrow">A FINAL MESSAGE</p><h2>You have a new envelope.</h2><button class="envelope-button" id="open-letter" aria-label="Open your birthday envelope"><img src="./assets/new-envelope.png" alt="Sealed birthday envelope"></button><p class="lead">One last thing, just for you.</p>${button('Open your letter ↗')}</div>`;
 document.querySelector('#open-letter').onclick=()=>go(13);nextTo(13);
}
function finalLetter(){
 const token=epoch;
 const full=C.finalMessage;
 scene.innerHTML=`<div class="letter-controls">${button('Show full letter','show-letter','secondary')}</div><article class="birthday-letter" aria-label="A birthday letter for Yuki"><h2 class="letter-title">For Yuki,</h2><div class="letter-copy" aria-live="off"></div><p class="letter-end" hidden>♡</p></article><p class="tiny letter-status" role="status">Your letter is being written…</p>`;
 const copy=scene.querySelector('.letter-copy'),end=scene.querySelector('.letter-end'),status=scene.querySelector('.letter-status'),show=scene.querySelector('#show-letter');
 const pieces=full.match(/\S+\s*/g)||[];let i=0,complete=false;
 const finish=()=>{if(complete||epoch!==token)return;complete=true;copy.textContent=full;end.hidden=false;show.hidden=true;status.textContent='Happy birthday, Yuki. ♡';};
 show.onclick=finish;
 const write=()=>{if(complete||epoch!==token)return;if(i>=pieces.length){finish();return;}copy.append(document.createTextNode(pieces[i++]));later(write,140);};
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else later(write,650);
}

document.querySelector('#sound').onclick=()=>{sound=!sound;document.querySelector('#sound').textContent=sound?'Sound on':'Sound off';document.querySelector('#sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');scene.querySelectorAll('video').forEach(v=>v.muted=!sound);if(sound)tone(660);};document.querySelector('#restart').onclick=()=>{attempts=0;rewardIndex=0;go(0);};go(0);
