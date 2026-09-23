/* =========================================================
   CORE & RUN — app logic
   ========================================================= */

/* ---------- データ定義 ---------- */

const THEMES = [
  { key: 'running',   emoji: '🏃',  title: 'ランニングフォーム向上・軸ブレ防止', sub: '体幹安定＋股関節連動' },
  { key: 'abs',        emoji: '🔥',  title: 'ぽっこりお腹引き締め・腹筋強化', sub: '腹直筋・腹斜筋集中' },
  { key: 'hip',        emoji: '🍑',  title: '骨盤の安定・お尻（臀筋）の推進力強化', sub: 'ヒップリフト・ブリッジ等' },
  { key: 'injury',     emoji: '🛡️', title: '怪我予防・膝＆足首の補強', sub: 'カーフレイズ・ブルガリアン等' },
  { key: 'endurance',  emoji: '⏱️', title: '後半の崩れ防止！持久的体幹の構築', sub: '高耐久・高保持力' },
  { key: 'posture',    emoji: '🧍',  title: '姿勢改善・猫背解消', sub: '背筋・脊柱起立筋・ドローイン' },
];

const DURATIONS = [
  { key: 5,  title: '5分',  sub: 'サクッと時短 / 3種目',       count: 3 },
  { key: 10, title: '10分', sub: '標準しっかり / 4〜5種目',    count: 5 },
  { key: 15, title: '15分', sub: 'フルコース / 6種目以上',     count: 6 },
];

const LEVELS = [
  { key: 'beginner',     title: '初級', sub: '自重・基本種目中心、長めの休憩', restSet: 30, restEx: 40, preferStar: false },
  { key: 'intermediate', title: '中級', sub: '⭐重点種目中心、標準休憩',       restSet: 20, restEx: 25, preferStar: true  },
  { key: 'advanced',     title: '上級', sub: '高負荷・動的種目mix、短時間高強度', restSet: 12, restEx: 15, preferStar: true  },
];

const EXERCISES = [
  { id: 1,  name: 'バイシクルクランチ',            star: true,  type: 'reps', repsLabel: '30回',      sets: 3, category: '腹筋',       themes: ['abs', 'running'],             icon: '🚴',
    form: '仰向けで両手を頭の後ろに添え、片肘ともう片方の膝を近づけながら体を捻ります。左右交互にペダルを漕ぐように行い、呼吸を止めず腰が反らないよう腹筋に力を入れ続けましょう。' },
  { id: 2,  name: 'プランク',                      star: true,  type: 'time', timeSec: 60,             sets: 3, category: '体幹安定',   themes: ['running', 'endurance'],       icon: '🧎',
    form: '肘とつま先で体を支え、頭からかかとまで一直線に保ちます。お尻が上がったり腰が落ちたりしないよう、お腹とお尻に力を入れて姿勢をキープしましょう。' },
  { id: 3,  name: 'シングルレッグ グルート ブリッジ', star: true,  type: 'reps', repsLabel: '左右各20回', sets: 3, category: '股関節・臀部', themes: ['hip'],                        icon: '🌉',
    form: '仰向けで片膝を立て、もう片方の脚を伸ばします。立てた脚のかかとで床を押し、お尻を持ち上げましょう。骨盤が傾かないよう左右の高さを揃えたまま上げ下げします。' },
  { id: 4,  name: 'ダイアゴナル',                  star: false, type: 'time', timeSec: 30,             sets: 3, category: '体幹安定',   themes: ['running', 'posture'],         icon: '✈️',
    form: '四つ這いから対角線上の手足（右手と左脚など）を同時にまっすぐ伸ばします。体幹を使ってバランスを取り、骨盤が左右に傾かないようキープしましょう。' },
  { id: 5,  name: 'スパイダープランク',            star: false, type: 'reps', repsLabel: '左右10回',   sets: 3, category: '腹筋',       themes: ['abs', 'running'],             icon: '🕷️',
    form: 'プランク姿勢から片膝を同じ側の肘に近づけるように引きつけます。腰の高さを一定に保ち、体幹を安定させたまま左右交互に行いましょう。' },
  { id: 6,  name: 'サイドプランク',                star: true,  type: 'time', timeSec: 20,             sets: 3, category: '体幹安定',   themes: ['running', 'abs'],             icon: '📐',
    form: '横向きに寝て肘と足の側面で体を支え、体を一直線に持ち上げます。腰が落ちないよう体幹全体に力を入れて姿勢を維持しましょう。' },
  { id: 7,  name: 'Vシットアップ',                 star: false, type: 'reps', repsLabel: '10回',      sets: 3, category: '腹筋',       themes: ['abs'],                        icon: '🔺',
    form: '仰向けから上体と両脚を同時に持ち上げ、体をV字にして手と足先を近づけます。反動を使わず腹筋の力でコントロールしながら行いましょう。' },
  { id: 8,  name: 'リバースクランチ',              star: false, type: 'reps', repsLabel: '10回',      sets: 3, category: '腹筋',       themes: ['abs'],                        icon: '⤴️',
    form: '仰向けで両脚を上げ、膝を軽く曲げた状態から骨盤を丸めるように持ち上げます。反動をつけず下腹部の力でゆっくりコントロールしましょう。' },
  { id: 9,  name: 'ホローホールド',                star: false, type: 'time', timeSec: 30,             sets: 3, category: '腹筋',       themes: ['running', 'abs'],             icon: '🌙',
    form: '仰向けで腰を床に押しつけ、肩と脚を浮かせた姿勢をキープします。腰が反らないよう常にお腹に力を入れ続けましょう。' },
  { id: 10, name: 'ウィンドシールド ワイパー',     star: false, type: 'reps', repsLabel: '10回',      sets: 3, category: '腹筋',       themes: ['abs'],                        icon: '🚿',
    form: '仰向けで両脚を天井に伸ばし、腹筋を使って左右にゆっくり倒します。肩が床から浮かないようコントロールしながら行いましょう。' },
  { id: 11, name: 'マウンテンクライマー',          star: false, type: 'reps', repsLabel: '左右各30回', sets: 3, category: '体幹安定',   themes: ['endurance', 'running'],       icon: '⛰️',
    form: 'プランク姿勢から膝を交互に胸へ引きつけます。腰の高さを一定に保ち、リズムよくテンポを刻みながら行いましょう。' },
  { id: 12, name: 'ブルガリアンスクワット',        star: true,  type: 'reps', repsLabel: '左右各15回', sets: 3, category: '下半身',     themes: ['hip', 'injury'],              icon: '🦵',
    form: '後ろ脚を台に乗せ、前脚を曲げて腰を落とします。膝がつま先より前に出過ぎないよう注意し、前脚のかかとで押し上げるように戻りましょう。' },
  { id: 13, name: 'ヒップリフト',                  star: true,  type: 'reps', repsLabel: '20回',      sets: 3, category: '股関節・臀部', themes: ['hip', 'posture'],             icon: '🌉',
    form: '仰向けで両膝を立て、かかとで床を押しながらお尻を持ち上げます。トップで臀筋をしっかり締め、腰を反りすぎないよう注意しましょう。' },
  { id: 14, name: 'エアスクワット',                star: false, type: 'reps', repsLabel: '15回',      sets: 3, category: '下半身',     themes: ['injury', 'hip'],              icon: '🏋️',
    form: '足を肩幅に開き、椅子に座るように股関節から曲げてしゃがみます。膝が内側に入らないよう、胸を張ったまま太もも裏とお尻の力で立ち上がりましょう。' },
  { id: 15, name: 'ランナーズタッチ',              star: false, type: 'reps', repsLabel: '左右各10回', sets: 3, category: '股関節・臀部', themes: ['running', 'hip'],             icon: '👣',
    form: '片脚立ちになり、上体を前傾させながら反対の手で軸足のつま先付近にタッチします。骨盤を水平に保ち、バランスを取りながら行いましょう。' },
  { id: 16, name: 'バックエクステンション',        star: false, type: 'reps', repsLabel: '20回',      sets: 3, category: '背部',       themes: ['posture'],                    icon: '🔙',
    form: 'うつ伏せで両手を頭の後ろに添え、上体を反らせるように持ち上げます。腰に力を入れすぎず、背筋全体を使ってゆっくり上げ下げしましょう。' },
  { id: 17, name: 'カーフレイズ',                  star: false, type: 'reps', repsLabel: '左右各30回', sets: 3, category: '下半身',     themes: ['injury'],                     icon: '🦶',
    form: 'つま先立ちになりかかとをゆっくり上げ下げします。ふらつく場合は壁や椅子に手を添えて行い、足首の安定性を高めましょう。' },
  { id: 18, name: 'トゥレイズ',                    star: false, type: 'reps', repsLabel: '20回',      sets: 3, category: '下半身',     themes: ['injury'],                     icon: '🦶',
    form: 'かかとを床につけたまま、つま先を持ち上げてすねの筋肉を使います。反動をつけず、すねの前側にしっかり効かせましょう。' },
  { id: 19, name: 'ドローイン',                    star: true,  type: 'time', timeSec: 30,             sets: 3, category: '腹筋',       themes: ['abs', 'posture'],             icon: '🫁',
    form: '息を吐きながらお腹をへこませ、その状態をキープしたまま呼吸を続けます。腰と背中はニュートラルな姿勢を保ちましょう。' },
  { id: 20, name: 'プッシュアップ（ゆっくり）',    star: true,  type: 'reps', repsLabel: '10回',      sets: 3, category: '体幹安定',   themes: ['running', 'posture'],         icon: '💪',
    form: '手を肩幅よりやや広めについて体を一直線に保ちます。ゆっくり胸を床に近づけ、体幹を締めたまま一定のペースで上げ下げしましょう。' },
];

/* ---------- 汎用ヘルパー ---------- */

const $ = (id) => document.getElementById(id);

function specText(ex) {
  const base = ex.type === 'time' ? `${ex.timeSec}秒` : ex.repsLabel;
  return `${base} × ${ex.sets}set`;
}

/* ---------- state ---------- */

const state = {
  filters: { cat: 'all', star: false, time: false, q: '' },
  builder: { theme: null, duration: null, level: null },
  currentMenu: null,
};

/* =========================================================
   種目図鑑
   ========================================================= */

function matchesFilters(ex) {
  const f = state.filters;
  if (f.cat !== 'all' && ex.category !== f.cat) return false;
  if (f.star && !ex.star) return false;
  if (f.time && ex.type !== 'time') return false;
  if (f.q && !ex.name.toLowerCase().includes(f.q.toLowerCase())) return false;
  return true;
}

function renderLibrary() {
  const list = EXERCISES.filter(matchesFilters);
  const grid = $('exerciseGrid');
  grid.innerHTML = '';
  $('resultCount').textContent = `${list.length}種目`;
  $('libraryEmpty').hidden = list.length !== 0;

  list.forEach((ex) => {
    const btn = document.createElement('button');
    btn.className = 'ex-card';
    btn.innerHTML = `
      <span class="ex-card-icon">${ex.icon}</span>
      <span class="ex-card-body">
        <span class="ex-card-name">${ex.star ? '<span class="star">⭐</span>' : ''}${ex.name}</span>
        <span class="ex-card-meta">${specText(ex)}</span>
      </span>
      <span class="ex-card-cat">${ex.category}</span>
    `;
    btn.addEventListener('click', () => openDetail(ex));
    grid.appendChild(btn);
  });
}

function openDetail(ex) {
  $('detailStar').hidden = !ex.star;
  $('detailName').textContent = ex.name;
  $('detailSpec').textContent = specText(ex);
  $('detailForm').textContent = ex.form;
  const tagWrap = $('detailTags');
  tagWrap.innerHTML = `<span>${ex.category}</span><span>${ex.type === 'time' ? '時間計測種目' : '回数計測種目'}</span>`;
  $('detailModal').hidden = false;
}

$('closeDetail').addEventListener('click', () => { $('detailModal').hidden = true; });
$('detailModal').addEventListener('click', (e) => { if (e.target === $('detailModal')) $('detailModal').hidden = true; });

$('searchInput').addEventListener('input', (e) => { state.filters.q = e.target.value; renderLibrary(); });

$('categoryChips').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  state.filters.cat = btn.dataset.cat;
  [...$('categoryChips').children].forEach((c) => c.classList.toggle('is-active', c === btn));
  renderLibrary();
});

$('starChip').addEventListener('click', () => {
  state.filters.star = !state.filters.star;
  $('starChip').classList.toggle('is-active', state.filters.star);
  renderLibrary();
});

$('timeChip').addEventListener('click', () => {
  state.filters.time = !state.filters.time;
  $('timeChip').classList.toggle('is-active', state.filters.time);
  renderLibrary();
});

/* =========================================================
   タブ切り替え
   ========================================================= */

document.querySelectorAll('.tab-btn').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const target = tab.dataset.tab === 'library' ? 'screen-library' : 'screen-builder';
    showScreen(target);
  });
});

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
}

/* =========================================================
   メニュー提案（診断フォーム）
   ========================================================= */

function buildOptionGrid(container, items, groupKey, renderFn) {
  container.innerHTML = '';
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = renderFn(item);
    btn.addEventListener('click', () => {
      state.builder[groupKey] = item;
      [...container.children].forEach((c) => c.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      updateGenerateBtn();
    });
    container.appendChild(btn);
  });
}

buildOptionGrid($('themeGrid'), THEMES, 'theme', (t) => `
  <span class="opt-emoji">${t.emoji}</span>
  <span class="opt-main"><span class="opt-title">${t.title}</span><span class="opt-sub">${t.sub}</span></span>
`);

buildOptionGrid($('durationGrid'), DURATIONS, 'duration', (d) => `
  <span class="opt-title">${d.title}</span><span class="opt-sub">${d.sub}</span>
`);

buildOptionGrid($('levelGrid'), LEVELS, 'level', (l) => `
  <span class="opt-title">${l.title}</span><span class="opt-sub">${l.sub}</span>
`);

function updateGenerateBtn() {
  const b = state.builder;
  $('generateBtn').disabled = !(b.theme && b.duration && b.level);
}

$('generateBtn').addEventListener('click', () => {
  const menu = generateMenu(state.builder.theme, state.builder.duration, state.builder.level);
  state.currentMenu = menu;
  renderResult(menu);
  showScreen('screen-result');
});

$('backToBuilder').addEventListener('click', () => showScreen('screen-builder'));

/* ---------- メニュー生成アルゴリズム ---------- */

function generateMenu(theme, duration, level) {
  const primary = EXERCISES.filter((ex) => ex.themes.includes(theme.key));
  const rest = EXERCISES.filter((ex) => !ex.themes.includes(theme.key));

  const rank = (ex) => (level.preferStar && ex.star ? 0 : 1);
  primary.sort((a, b) => rank(a) - rank(b));
  rest.sort((a, b) => rank(a) - rank(b));

  const picked = primary.slice(0, duration.count);
  if (picked.length < duration.count) {
    for (const ex of rest) {
      if (picked.length >= duration.count) break;
      picked.push(ex);
    }
  }

  const estSeconds = picked.reduce((sum, ex) => {
    const perSet = ex.type === 'time' ? ex.timeSec : 35;
    return sum + ex.sets * perSet + (ex.sets - 1) * level.restSet;
  }, 0) + (picked.length - 1) * level.restEx;

  return { theme, duration, level, exercises: picked, estMinutes: Math.max(1, Math.round(estSeconds / 60)) };
}

function renderResult(menu) {
  $('resultTheme').textContent = `${menu.theme.emoji} ${menu.level.title}レベル`;
  $('resultTitle').textContent = menu.theme.title;
  $('resultDesc').textContent = `${menu.theme.sub}にフォーカスした種目を厳選。${menu.level.sub}で構成しています。`;
  $('resultTime').textContent = `目安 約${menu.estMinutes}分`;
  $('resultCountMeta').textContent = `${menu.exercises.length}種目`;

  const list = $('menuList');
  list.innerHTML = '';
  menu.exercises.forEach((ex, i) => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
      <span class="menu-num">${i + 1}</span>
      <span class="menu-item-body">
        <span class="menu-item-name">${ex.star ? '<span class="star">⭐</span>' : ''}${ex.name}</span>
        <span class="menu-item-spec">${specText(ex)}</span>
      </span>
    `;
    list.appendChild(li);
  });
}

/* =========================================================
   サウンド（Web Audio API）
   ========================================================= */

let audioCtx = null;
let soundOn = true;

function ensureAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, durationMs, type = 'sine', volume = 0.22) {
  if (!soundOn) return;
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000);
}

function sfxStart()    { beep(880, 130, 'sine'); }
function sfxTick()     { beep(660, 90, 'square', 0.16); }
function sfxFinish()   { beep(660, 130, 'sine'); setTimeout(() => beep(990, 260, 'sine'), 140); }
function sfxComplete() { beep(660, 120); setTimeout(() => beep(880, 120), 130); setTimeout(() => beep(1100, 300), 260); }

$('soundToggle').addEventListener('click', () => {
  soundOn = !soundOn;
  $('soundToggle').textContent = soundOn ? '🔊' : '🔇';
  $('soundToggle').setAttribute('aria-pressed', String(soundOn));
});

/* =========================================================
   ワークアウト実行モード
   ========================================================= */

const workout = { steps: [], idx: 0, intervalId: null, remainingMs: 0, totalMs: 0, running: false };

function buildSteps(menu) {
  const steps = [];
  menu.exercises.forEach((ex, exIdx) => {
    for (let s = 1; s <= ex.sets; s++) {
      steps.push({ kind: 'exercise', ex, exIdx, setIdx: s, totalSets: ex.sets, totalEx: menu.exercises.length });
      if (s < ex.sets) {
        steps.push({ kind: 'rest', restSec: menu.level.restSet, label: 'セット間の休憩', exIdx, totalEx: menu.exercises.length });
      }
    }
    if (exIdx < menu.exercises.length - 1) {
      steps.push({ kind: 'rest', restSec: menu.level.restEx, label: '次の種目まで', exIdx, totalEx: menu.exercises.length, isExerciseBreak: true, nextName: menu.exercises[exIdx + 1].name });
    }
  });
  steps.push({ kind: 'done' });
  return steps;
}

$('startWorkoutBtn').addEventListener('click', () => {
  ensureAudio();
  workout.steps = buildSteps(state.currentMenu);
  workout.idx = 0;
  $('workoutOverlay').hidden = false;
  renderStep();
});

$('exitWorkout').addEventListener('click', stopWorkout);

function stopWorkout() {
  clearInterval(workout.intervalId);
  workout.running = false;
  $('workoutOverlay').hidden = true;
}

function updateProgressBar() {
  const step = workout.steps[workout.idx];
  const doneCount = workout.steps.slice(0, workout.idx).filter((s) => s.kind === 'exercise').length;
  const totalExSteps = workout.steps.filter((s) => s.kind === 'exercise').length;
  $('workoutBar').style.width = `${Math.round((doneCount / totalExSteps) * 100)}%`;
  if (step.kind === 'exercise') {
    $('workoutProgress').textContent = `種目 ${step.exIdx + 1}/${step.totalEx} ・ セット ${step.setIdx}/${step.totalSets}`;
  } else if (step.kind === 'rest') {
    $('workoutProgress').textContent = `休憩中 ・ 種目 ${step.exIdx + 1}/${step.totalEx}`;
  } else {
    $('workoutProgress').textContent = '完了';
  }
}

function renderStep() {
  clearInterval(workout.intervalId);
  const step = workout.steps[workout.idx];
  const body = $('workoutBody');
  updateProgressBar();

  if (step.kind === 'exercise') {
    const ex = step.ex;
    if (ex.type === 'time') {
      body.innerHTML = `
        <p class="wk-phase-label">EXERCISE</p>
        <h2 class="wk-name">${ex.star ? '⭐ ' : ''}${ex.name}</h2>
        <p class="wk-set">セット ${step.setIdx} / ${step.totalSets}</p>
        <div class="wk-ring-wrap" id="ringWrap">
          <svg viewBox="0 0 240 240">
            <circle class="wk-ring-bg" cx="120" cy="120" r="100"></circle>
            <circle class="wk-ring-fg" id="ringFg" cx="120" cy="120" r="100"></circle>
          </svg>
          <div class="wk-ring-num" id="ringNum">${ex.timeSec}</div>
        </div>
        <p class="wk-form-hint">${ex.form}</p>
      `;
      runTimer(ex.timeSec, () => { sfxFinish(); nextStep(); });
      sfxStart();
    } else {
      body.innerHTML = `
        <p class="wk-phase-label">EXERCISE</p>
        <h2 class="wk-name">${ex.star ? '⭐ ' : ''}${ex.name}</h2>
        <p class="wk-set">セット ${step.setIdx} / ${step.totalSets}</p>
        <p class="wk-reps-num">${ex.repsLabel}</p>
        <p class="wk-form-hint">${ex.form}</p>
        <button class="wk-action-btn" id="repsDoneBtn">完了して次へ</button>
      `;
      $('repsDoneBtn').addEventListener('click', () => { sfxFinish(); nextStep(); });
      sfxStart();
    }
  } else if (step.kind === 'rest') {
    const nextLine = step.isExerciseBreak ? `次は「${step.nextName}」` : 'もう少しで次のセット';
    body.innerHTML = `
      <p class="wk-phase-label rest">REST</p>
      <h2 class="wk-name">${step.label}</h2>
      <div class="wk-ring-wrap is-rest" id="ringWrap">
        <svg viewBox="0 0 240 240">
          <circle class="wk-ring-bg" cx="120" cy="120" r="100"></circle>
          <circle class="wk-ring-fg" id="ringFg" cx="120" cy="120" r="100"></circle>
        </svg>
        <div class="wk-ring-num" id="ringNum">${step.restSec}</div>
      </div>
      <p class="wk-form-hint">${nextLine}</p>
      <button class="wk-skip-btn" id="skipRestBtn">スキップ →</button>
    `;
    $('skipRestBtn').addEventListener('click', () => { clearInterval(workout.intervalId); nextStep(); });
    runTimer(step.restSec, () => { sfxStart(); nextStep(); });
  } else {
    body.innerHTML = `
      <div class="wk-done-emoji">🎉</div>
      <p class="wk-done-title">お疲れ様でした！</p>
      <p class="wk-done-sub">メニューを完了しました。この調子でトレーニングを続けましょう。</p>
      <button class="wk-action-btn" id="finishBtn">閉じる</button>
    `;
    sfxComplete();
    $('finishBtn').addEventListener('click', stopWorkout);
  }
}

function nextStep() {
  workout.idx += 1;
  renderStep();
}

function runTimer(totalSec, onDone) {
  const circumference = 2 * Math.PI * 100;
  const ringFg = $('ringFg');
  const ringNum = $('ringNum');
  ringFg.style.strokeDasharray = `${circumference}`;
  ringFg.style.strokeDashoffset = '0';

  let remaining = totalSec;
  let tickedFor3 = false, tickedFor2 = false, tickedFor1 = false;
  ringNum.textContent = remaining;

  workout.intervalId = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(workout.intervalId);
      ringNum.textContent = '0';
      ringFg.style.strokeDashoffset = `${circumference}`;
      onDone();
      return;
    }
    ringNum.textContent = remaining;
    ringFg.style.strokeDashoffset = `${circumference * (1 - remaining / totalSec)}`;
    if (remaining === 3 && !tickedFor3) { sfxTick(); tickedFor3 = true; }
    if (remaining === 2 && !tickedFor2) { sfxTick(); tickedFor2 = true; }
    if (remaining === 1 && !tickedFor1) { sfxTick(); tickedFor1 = true; }
  }, 1000);
}

/* ---------- 初期描画 ---------- */

renderLibrary();
