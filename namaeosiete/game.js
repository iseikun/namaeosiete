// game.js - クエリ大戦争 メインスクリプト

// キャラクター画像管理システム
const CHAR_IMAGES = {};

function initCharImages() {
  const allIds = [
    'index_neko', 'asterisk', 'redis_dog', 'transaction',
    'souikun', 'moridig', 'iseikun', 'yoshinori',
    'boss_moridig', 'boss_n1_emperor', 'legacy_server_boss',
    'n_plus_one', 'sql_injection', 'memory_leak', 'deadlock'
  ];

  allIds.forEach(id => {
    const img = new Image();
    const custom = localStorage.getItem('custom_img_' + id);
    if (custom) {
      img.src = custom;
    } else {
      img.src = `images/${id}.png`;
      img.onerror = () => {
        if (img.src.endsWith('.png')) {
          img.src = `images/${id}.jpg`;
        }
      };
    }
    img.onload = () => {
      // 読み込み完了時にUIを再描画
      if (typeof renderDeckButtons === 'function') renderDeckButtons();
      if (typeof renderUnitsList === 'function') renderUnitsList();
    };
    CHAR_IMAGES[id] = img;
  });
}
initCharImages();

function getCharIconHtml(charId, fallbackEmoji, rarity = '') {
  const img = CHAR_IMAGES[charId];
  if (img && img.src && (img.src.startsWith('data:') || (img.complete && img.naturalWidth > 0))) {
    return `<img class="unit-thumb-img ${rarity}" src="${img.src}" alt="${charId}">`;
  }
  return `<span class="unit-icon">${fallbackEmoji}</span>`;
}

// キャラクターマスターデータ
const CHAR_DATA = {
  index_neko: {
    id: 'index_neko',
    name: 'インデックスネコ',
    rarity: 'normal',
    rarityName: 'ノーマル',
    cost: 50,
    cooldown: 2.0,
    hp: 350,
    atk: 15,
    range: 40,
    speed: 1.8,
    attackInterval: 1.0,
    icon: '🐱',
    desc: '低コストで量産できる基本の肉壁。B-Tree構造で敵の猛攻を受け止める。',
    quote: 'ニャー（INDEX）',
    unlocked: true,
    level: 1
  },
  asterisk: {
    id: 'asterisk',
    name: 'アスタリスクくん',
    rarity: 'rare',
    rarityName: 'レア',
    cost: 150,
    cooldown: 4.5,
    hp: 180,
    atk: 45,
    range: 180,
    speed: 1.2,
    attackInterval: 2.2,
    icon: '✳️',
    isArea: true,
    desc: '「SELECT *」で広範囲の敵を一掃する遠距離シューター。足は少し遅い。',
    quote: 'SELECT * FROM ALL;',
    unlocked: true,
    level: 1
  },
  redis_dog: {
    id: 'redis_dog',
    name: 'Redis犬（キャッシュ）',
    rarity: 'rare',
    rarityName: 'レア',
    cost: 200,
    cooldown: 5.0,
    hp: 240,
    atk: 70,
    range: 45,
    speed: 3.5,
    attackInterval: 0.8,
    icon: '🐕',
    desc: '超高速で戦場を駆け抜けるインメモリ爆走犬。敵の前線に素早く噛みつく。',
    quote: 'SETEX cache 60 dog',
    unlocked: false,
    level: 1
  },
  transaction: {
    id: 'transaction',
    name: 'トランザクション重装兵',
    rarity: 'super_rare',
    rarityName: '激レア',
    cost: 450,
    cooldown: 10.0,
    hp: 1200,
    atk: 130,
    range: 60,
    speed: 1.0,
    attackInterval: 2.0,
    icon: '🛡️',
    desc: 'ACID特性で守られた鉄壁の重戦車。敵の猛攻を物ともせず前線を押し上げる。',
    quote: 'BEGIN TRANSACTION;',
    unlocked: false,
    level: 1
  },
  souikun: {
    id: 'souikun',
    name: '【熱血闘士】そういくん',
    rarity: 'legendary',
    rarityName: '伝説レア',
    cost: 800,
    cooldown: 11.0,
    hp: 1700,
    atk: 290,
    range: 65,
    speed: 2.8,
    attackInterval: 0.45,
    icon: '🔥🥋',
    desc: '「ねっけつ」を胸に宿した伝説の拳士。燃え盛る闘気で敵前線を猛連打し、敵全員を吹き飛ばす！',
    quote: 'ねっけつーーっ！',
    unlocked: true,
    level: 1
  },
  moridig: {
    id: 'moridig',
    name: '【伝説レア】ただの森ディグ',
    rarity: 'legendary',
    rarityName: '伝説レア',
    cost: 850,
    cooldown: 12.0,
    hp: 1800,
    atk: 310,
    range: 75,
    speed: 1.6,
    attackInterval: 0.95,
    icon: '🦔🌲',
    isArea: true,
    desc: '森の深部に生息する原種ディグダ。出陣時も攻撃時も「名前教えて」と問い詰め、敵の情報を容赦なく引き出す！',
    quote: 'なまえおしえて',
    unlocked: false,
    level: 1
  },
  iseikun: {
    id: 'iseikun',
    name: '【絶対零度】いせいくん',
    rarity: 'legendary',
    rarityName: '伝説レア',
    cost: 950,
    cooldown: 15.0,
    hp: 1800,
    atk: 320,
    range: 220,
    speed: 1.4,
    attackInterval: 2.5,
    icon: '❄️🕶️',
    isArea: true,
    desc: 'すべてを嘲笑う伝説の男。「冷笑」の一言で周囲の敵を凍結させ、絶対零度の冷気クエリで消滅させる。',
    quote: 'フッ…冷笑。',
    unlocked: false,
    level: 1
  },
  yoshinori: {
    id: 'yoshinori',
    name: '【朝の支配者】よしのり',
    rarity: 'legendary',
    rarityName: '伝説レア',
    cost: 1100,
    cooldown: 16.0,
    hp: 2200,
    atk: 400,
    range: 350,
    speed: 1.2,
    attackInterval: 3.0,
    icon: '☀️👑',
    isArea: true,
    desc: '戦場に爽やかな朝をもたらす伝説の光。「おはようございまーす」の挨拶で味方を全快＆敵城まで届く極太ソーラービームを放つ！',
    quote: 'おはようございまーす！',
    unlocked: false,
    level: 1
  }
};

// 敵キャラクターデータ
const ENEMY_TYPES = {
  n_plus_one: {
    id: 'n_plus_one',
    name: 'N+1問題',
    hp: 90,
    atk: 12,
    speed: 1.4,
    range: 35,
    attackInterval: 1.0,
    rewardMemory: 20,
    icon: '🐛',
    color: '#a855f7'
  },
  sql_injection: {
    id: 'sql_injection',
    name: 'SQLインジェクション',
    hp: 140,
    atk: 40,
    speed: 2.5,
    range: 35,
    attackInterval: 0.9,
    rewardMemory: 40,
    icon: '🥷',
    color: '#ef4444'
  },
  memory_leak: {
    id: 'memory_leak',
    name: 'メモリリークスライム',
    hp: 550,
    atk: 30,
    speed: 0.8,
    range: 45,
    attackInterval: 1.5,
    rewardMemory: 80,
    icon: '🦠',
    color: '#10b981'
  },
  deadlock: {
    id: 'deadlock',
    name: 'デッドロック怪獣',
    hp: 1200,
    atk: 60,
    speed: 0.7,
    range: 50,
    attackInterval: 2.0,
    rewardMemory: 150,
    icon: '🔒👹',
    color: '#eab308'
  },
  // 要所要所のボス
  boss_n1_emperor: {
    id: 'boss_n1_emperor',
    name: '【中ボス】無限ループ・N+1大帝',
    hp: 2600,
    atk: 90,
    speed: 0.9,
    range: 60,
    attackInterval: 1.5,
    rewardMemory: 300,
    icon: '🐛👑⚡',
    color: '#d946ef',
    isBoss: true
  },
  boss_moridig: {
    id: 'boss_moridig',
    name: '【伝説の面談官】森ディグ(アローラのすがた)',
    hp: 5200,
    atk: 180,
    speed: 0.65,
    range: 85,
    attackInterval: 1.2,
    rewardMemory: 600,
    icon: '🦔🌴✨',
    color: '#22c55e',
    isBoss: true
  },
  legacy_server_boss: {
    id: 'legacy_server_boss',
    name: '【ラスボス】20年稼働メインフレーム神',
    hp: 7500,
    atk: 200,
    speed: 0.4,
    range: 140,
    attackInterval: 2.5,
    rewardMemory: 1000,
    icon: '📠☠️⚡',
    color: '#64748b',
    isBoss: true
  }
};

// ステージ定義
const STAGES = [
  {
    id: 'stage_sea',
    name: '第1章：クエリ・オーシャン（海ステージ）',
    shortName: '海ステージ',
    icon: '🌊',
    bgType: 'sea',
    enemyBaseHp: 3800,
    bossId: 'boss_n1_emperor',
    bossName: '【ボス】無限ループ・N+1大帝',
    desc: '🌊【海ステージ】波立つデータの大海原。N+1大帝の群れを捌き切れ！'
  },
  {
    id: 'stage_mountain',
    name: '第2章：インデックス・マウンテン（山ステージ）',
    shortName: '山ステージ',
    icon: '⛰️',
    bgType: 'mountain',
    enemyBaseHp: 5200,
    bossId: 'legacy_server_boss',
    bossName: '【ボス】20年稼働メインフレーム神',
    desc: '⛰️【山ステージ】険しい岩山に鎮座するレガシー神。高負荷に耐えて突破せよ！'
  },
  {
    id: 'stage_forest',
    name: '最終章：決戦！元気森森ステージ',
    shortName: '元気森森ステージ',
    icon: '🌲👑',
    bgType: 'forest',
    enemyBaseHp: 7500,
    bossId: 'boss_moridig',
    bossName: '【最凶ボス】森ディグ(アローラのすがた)',
    desc: '🌲👑【元気森森ステージ】最深部に君臨するアローラのすがた！個人面談を耐え抜け！'
  }
];

// ゲーム状態クラス
class GameState {
  constructor() {
    this.queryStones = 3000; // 初期ガチャ石（30連分プレゼント！）
    this.deck = ['index_neko', 'asterisk', 'souikun']; // 初期編成
    this.unlockedChars = { ...CHAR_DATA };
    
    // ステージ情報
    this.currentStageIndex = 0; // 0: 海, 1: 山, 2: 元気森森

    // バトルステータス
    this.battleActive = false;
    this.isBattleStarted = false;
    this.worldWidth = 1800;
    this.cameraX = 0;
    
    // 拠点HP
    this.maxBaseHp = 3000;
    this.baseHp = 3000;
    this.maxEnemyBaseHp = 3800;
    this.enemyBaseHp = 3800;
    
    // メモリ（コスト）
    this.memory = 100;
    this.cpuLevel = 1;
    this.maxMemory = 200;
    this.memoryPerSec = 15;
    
    // DROP TABLE砲
    this.cannonCharge = 0; // 0 ~ 100
    this.cannonMax = 100;
    
    // エンティティ
    this.allies = [];
    this.enemies = [];
    this.effects = [];
    this.projectiles = [];
    
    // クールダウン
    this.cooldowns = {};
    
    // 敵スポーンタイマー
    this.battleTime = 0;
    this.nextSpawnTime = 2.0;
    this.bossSpawnFlags = { stage1: false, stage2: false, stage3: false };
  }

  getCpuUpgradeCost() {
    return Math.floor(100 * Math.pow(1.5, this.cpuLevel - 1));
  }

  upgradeCpu() {
    const cost = this.getCpuUpgradeCost();
    if (this.memory >= cost && this.cpuLevel < 10) {
      this.memory -= cost;
      this.cpuLevel++;
      this.maxMemory = 200 + (this.cpuLevel - 1) * 150;
      this.memoryPerSec = 15 + (this.cpuLevel - 1) * 8;
      window.soundManager.playBeep(600, 0.15, 'triangle');
      return true;
    }
    return false;
  }
}

const state = new GameState();

// Canvas設定
const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// バトルロジック
// ==========================================

function initBattle(autoStart = false) {
  state.battleActive = autoStart;
  state.isBattleStarted = autoStart;
  state.baseHp = state.maxBaseHp;
  state.enemyBaseHp = state.maxEnemyBaseHp;
  state.memory = 100;
  state.cpuLevel = 1;
  state.maxMemory = 200;
  state.memoryPerSec = 15;
  state.cannonCharge = 0;
  state.allies = [];
  state.enemies = [];
  state.effects = [];
  state.projectiles = [];
  state.battleTime = 0;
  state.nextSpawnTime = 2.0;
  state.bossSpawnFlags = { stage1: false, stage2: false, stage3: false };
  state.cameraX = 0;

  // バトル開始オーバーレイ表示切り替え
  const overlay = document.getElementById('battleStartOverlay');
  if (overlay) {
    if (autoStart) {
      overlay.classList.add('hidden');
    } else {
      overlay.classList.remove('hidden');
    }
  }

  // クールダウン初期化
  Object.keys(state.unlockedChars).forEach(id => {
    state.cooldowns[id] = 0;
  });

  renderDeckButtons();
  updateHud();
}

// ユーザー操作によるバトル開始
function startBattle() {
  state.battleActive = true;
  state.isBattleStarted = true;
  const overlay = document.getElementById('battleStartOverlay');
  if (overlay) overlay.classList.add('hidden');

  window.soundManager.ensureContext();
  window.soundManager.playDeploy();
  window.soundManager.speak('バトル開始！出撃せよ！', { pitch: 1.15, rate: 1.1 });
}

// ボス出現トリガー
function triggerBoss(typeKey, alertMessage) {
  const warningOverlay = document.getElementById('bossWarningOverlay');
  const warningText = document.getElementById('bossWarningText');
  if (warningOverlay && warningText) {
    warningText.innerText = alertMessage;
    warningOverlay.classList.add('active');
    setTimeout(() => {
      warningOverlay.classList.remove('active');
    }, 2200);
  }

  window.soundManager.playWarningSiren();
  window.soundManager.speak('警告！ボスが接近中！', { pitch: 0.85 });

  // 画面揺れ・フラッシュエフェクト
  state.effects.push({
    type: 'screen_flash',
    color: 'rgba(239, 68, 68, 0.4)',
    life: 0.6,
    maxLife: 0.6
  });

  spawnEnemy(typeKey);
}

// ユニット出撃
function deployUnit(charId) {
  if (!state.battleActive) return;
  const data = state.unlockedChars[charId];
  if (!data || !data.unlocked) return;
  if (state.memory < data.cost) return;
  if (state.cooldowns[charId] > 0) return;

  // コスト支払い & クールダウン
  state.memory -= data.cost;
  state.cooldowns[charId] = data.cooldown;

  // 音声 & ボイス再生
  window.soundManager.playDeploy();
  window.soundManager.playDeployVoice(charId);

  // 特殊登場時効果！
  if (charId === 'iseikun') {
    // 全画面冷気エフェクト
    state.effects.push({
      type: 'screen_flash',
      color: 'rgba(56, 189, 248, 0.35)',
      life: 0.5,
      maxLife: 0.5
    });
    // 敵全体に軽い移動低下
    state.enemies.forEach(e => {
      e.freezeTimer = 2.0;
    });
  } else if (charId === 'yoshinori') {
    // 全画面朝日フラッシュ＆味方全回復
    state.effects.push({
      type: 'screen_flash',
      color: 'rgba(253, 224, 71, 0.45)',
      life: 0.7,
      maxLife: 0.7
    });
    state.allies.forEach(a => {
      a.hp = a.maxHp;
      a.buffTimer = 8.0; // 攻撃力UP
    });
  } else if (charId === 'moridig') {
    // 森ディグ：自然の癒しフラッシュ
    state.effects.push({
      type: 'screen_flash',
      color: 'rgba(34, 197, 94, 0.35)',
      life: 0.5,
      maxLife: 0.5
    });
  }

  // 出撃時セリフ決定
  let say = '';
  if (charId === 'iseikun') say = '冷笑';
  else if (charId === 'yoshinori') say = 'おはようございまーす';
  else if (charId === 'souikun') say = 'ねっけつーーっ！';
  else if (charId === 'moridig') say = '名前教えて';

  // ユニット生成
  const unit = {
    ...data,
    x: 140, // 自陣前
    y: canvas.height - 110,
    hp: data.hp * (1 + (data.level - 1) * 0.2),
    maxHp: data.hp * (1 + (data.level - 1) * 0.2),
    atk: data.atk * (1 + (data.level - 1) * 0.2),
    attackCooldown: 0,
    sayText: say,
    sayTimer: 2.2,
    freezeTimer: 0,
    buffTimer: 0,
    frame: 0
  };

  state.allies.push(unit);
  updateDeckButtonsUI();
}

// 敵スポーン
function spawnEnemy(typeKey) {
  const t = ENEMY_TYPES[typeKey];
  if (!t) return;

  let say = '';
  let timer = 0;
  if (typeKey === 'boss_moridig') {
    say = '名前教えて';
    timer = 3.5;
    window.soundManager.playDeployVoice('moridig'); // 「なまえおしえて」ボイス！
  }

  const enemy = {
    ...t,
    x: state.worldWidth - 140,
    y: canvas.height - 110,
    maxHp: t.hp,
    attackCooldown: 0,
    freezeTimer: 0,
    sayText: say,
    sayTimer: timer,
    frame: 0
  };
  state.enemies.push(enemy);
}

// DROP TABLE砲 発射
function fireDropTableCannon() {
  if (state.cannonCharge < state.cannonMax) return;
  state.cannonCharge = 0;

  window.soundManager.playDropTableCannon();

  // 画面全体に巨大なSQLレーザー
  state.effects.push({
    type: 'cannon_beam',
    life: 0.8,
    maxLife: 0.8
  });

  // 直線上の敵全員に大ダメージ＆大ノックバック
  state.enemies.forEach(enemy => {
    enemy.hp -= 450;
    enemy.x += 150; // 強制後退
    if (enemy.x > state.worldWidth - 140) enemy.x = state.worldWidth - 140;
    
    state.effects.push({
      type: 'hit_spark',
      x: enemy.x,
      y: enemy.y - 30,
      color: '#ef4444',
      life: 0.3,
      maxLife: 0.3
    });
  });

  // 音声合成で叫ぶ
  window.soundManager.speak('ドロップ・テーブル発射！！', { pitch: 1.1, rate: 1.2 });
}

// ゲームループ更新 (dt 秒)
function updateGame(dt) {
  if (!state.battleActive) return;

  state.battleTime += dt;

  // メモリ蓄積
  state.memory = Math.min(state.maxMemory, state.memory + state.memoryPerSec * dt);

  // 大砲チャージ
  state.cannonCharge = Math.min(state.cannonMax, state.cannonCharge + 3.5 * dt);

  // クールダウン減衰
  Object.keys(state.cooldowns).forEach(k => {
    if (state.cooldowns[k] > 0) {
      state.cooldowns[k] = Math.max(0, state.cooldowns[k] - dt);
    }
  });

  // 要所要所でのボス出現AI
  if (!state.bossSpawnFlags.stage1 && (state.enemyBaseHp <= state.maxEnemyBaseHp * 0.8 || state.battleTime >= 25)) {
    state.bossSpawnFlags.stage1 = true;
    triggerBoss('boss_n1_emperor', '⚠️【中ボス】無限ループ・N+1大帝が出現！');
  } else if (!state.bossSpawnFlags.stage2 && (state.enemyBaseHp <= state.maxEnemyBaseHp * 0.5 || state.battleTime >= 55)) {
    state.bossSpawnFlags.stage2 = true;
    triggerBoss('boss_moridig', '🚨【伝説の超ボス】森ディグ(アローラのすがた)が降臨！！');
  } else if (!state.bossSpawnFlags.stage3 && (state.enemyBaseHp <= state.maxEnemyBaseHp * 0.2 || state.battleTime >= 85)) {
    state.bossSpawnFlags.stage3 = true;
    triggerBoss('legacy_server_boss', '🚨【ラスボス】20年稼働メインフレーム神が起動！！');
  }

  // 通常敵スポーンAI
  if (state.battleTime >= state.nextSpawnTime) {
    const rand = Math.random();
    if (state.battleTime < 30) {
      // 序盤
      if (rand < 0.7) spawnEnemy('n_plus_one');
      else spawnEnemy('sql_injection');
      state.nextSpawnTime = state.battleTime + (2.5 + Math.random() * 2);
    } else {
      // 中盤以降
      if (rand < 0.4) spawnEnemy('n_plus_one');
      else if (rand < 0.7) spawnEnemy('sql_injection');
      else if (rand < 0.9) spawnEnemy('memory_leak');
      else spawnEnemy('deadlock');
      state.nextSpawnTime = state.battleTime + (2.0 + Math.random() * 2);
    }
  }

  // --- 味方ユニット更新 ---
  for (let i = state.allies.length - 1; i >= 0; i--) {
    const ally = state.allies[i];
    ally.frame += dt * 5;
    if (ally.sayTimer > 0) ally.sayTimer -= dt;
    if (ally.attackCooldown > 0) ally.attackCooldown -= dt;
    if (ally.buffTimer > 0) ally.buffTimer -= dt;

    // 前方にいる最も近い敵を探す
    let target = null;
    let minDist = 99999;
    state.enemies.forEach(e => {
      const dist = e.x - ally.x;
      if (dist >= 0 && dist < minDist) {
        minDist = dist;
        target = e;
      }
    });

    const distToEnemyBase = (state.worldWidth - 100) - ally.x;

    // 攻撃判定
    if (target && minDist <= ally.range) {
      // 敵を攻撃
      if (ally.attackCooldown <= 0) {
        performAllyAttack(ally, target);
      }
    } else if (distToEnemyBase <= ally.range) {
      // 敵拠点を攻撃
      if (ally.attackCooldown <= 0) {
        ally.attackCooldown = ally.attackInterval;
        let dmg = ally.atk * (ally.buffTimer > 0 ? 2 : 1);
        state.enemyBaseHp -= dmg;
        window.soundManager.playHit();
        addSpark(state.worldWidth - 100, canvas.height - 130, '#f59e0b');
      }
    } else {
      // 前進
      let spd = ally.speed * 40 * dt;
      if (ally.freezeTimer > 0) spd *= 0.3;
      ally.x += spd;
    }

    if (ally.hp <= 0) {
      state.effects.push({
        type: 'dust',
        x: ally.x,
        y: ally.y,
        life: 0.4,
        maxLife: 0.4
      });
      state.allies.splice(i, 1);
    }
  }

  // --- 敵ユニット更新 ---
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    enemy.frame += dt * 5;
    if (enemy.sayTimer > 0) enemy.sayTimer -= dt;
    if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt;
    if (enemy.freezeTimer > 0) enemy.freezeTimer -= dt;

    // 前方にいる最も近い味方を探す
    let target = null;
    let minDist = 99999;
    state.allies.forEach(a => {
      const dist = enemy.x - a.x;
      if (dist >= 0 && dist < minDist) {
        minDist = dist;
        target = a;
      }
    });

    const distToBase = enemy.x - 100;

    if (target && minDist <= enemy.range) {
      // 味方を攻撃
      if (enemy.attackCooldown <= 0 && enemy.freezeTimer <= 0) {
        enemy.attackCooldown = enemy.attackInterval;

        if (enemy.id === 'boss_moridig') {
          // 森ディグの個人面談攻撃！！
          enemy.sayText = '個人面談！';
          enemy.sayTimer = 0.8;
          window.soundManager.playMoriInterview(); // 個人面談ボイス＋ズガァン音！

          // 前方の味方全体を範囲攻撃＆ノックバック！
          state.allies.forEach(a => {
            if (Math.abs(enemy.x - a.x) <= enemy.range + 45) {
              a.hp -= enemy.atk;
              a.x -= 35; // 味方を押し返す！
              addSpark(a.x, a.y - 20, '#22c55e');
            }
          });
        } else {
          target.hp -= enemy.atk;
          window.soundManager.playHit();
          addSpark(target.x, target.y - 20, '#ef4444');
        }
      }
    } else if (distToBase <= enemy.range) {
      // 自軍拠点を攻撃
      if (enemy.attackCooldown <= 0 && enemy.freezeTimer <= 0) {
        enemy.attackCooldown = enemy.attackInterval;

        if (enemy.id === 'boss_moridig') {
          enemy.sayText = '個人面談！';
          enemy.sayTimer = 0.8;
          window.soundManager.playMoriInterview();
          state.baseHp -= enemy.atk;
          addSpark(100, canvas.height - 130, '#22c55e');
        } else {
          state.baseHp -= enemy.atk;
          window.soundManager.playHit();
          addSpark(100, canvas.height - 130, '#ef4444');
        }
      }
    } else {
      // 前進
      let spd = enemy.speed * 40 * dt;
      if (enemy.freezeTimer > 0) spd = 0; // 凍結停止
      enemy.x -= spd;
    }

    if (enemy.hp <= 0) {
      // 倒した！メモリボーナス
      state.memory = Math.min(state.maxMemory, state.memory + enemy.rewardMemory);
      state.effects.push({
        type: 'dust',
        x: enemy.x,
        y: enemy.y,
        life: 0.4,
        maxLife: 0.4
      });
      state.enemies.splice(i, 1);
    }
  }

  // エフェクト更新
  for (let i = state.effects.length - 1; i >= 0; i--) {
    const eff = state.effects[i];
    eff.life -= dt;
    if (eff.life <= 0) state.effects.splice(i, 1);
  }

  // 勝敗判定
  if (state.enemyBaseHp <= 0) {
    onBattleEnd(true);
  } else if (state.baseHp <= 0) {
    onBattleEnd(false);
  }

  // カメラ自動追従（最も前線の味方に寄せる）
  updateCamera(dt);
  updateHud();
}

function performAllyAttack(ally, target) {
  ally.attackCooldown = ally.attackInterval;
  let dmg = ally.atk * (ally.buffTimer > 0 ? 2 : 1);

  // 全キャラ攻撃サウンドを即座に再生！
  window.soundManager.playAttackSound(ally.id);

  if (ally.id === 'moridig') {
    // ただの森ディグ: 攻撃するたびに「名前教えて」！
    ally.sayText = '名前教えて';
    ally.sayTimer = 0.8;

    state.effects.push({
      type: 'screen_flash',
      color: 'rgba(34, 197, 94, 0.15)',
      life: 0.2,
      maxLife: 0.2
    });

    state.enemies.forEach(e => {
      if (Math.abs(e.x - ally.x) <= ally.range + 50) {
        e.hp -= dmg;
        e.x += 25; // ノックバック
        addSpark(e.x, e.y - 20, '#22c55e');
      }
    });
  } else if (ally.id === 'iseikun') {
    // いせいくんの冷笑攻撃：周囲の敵を凍結＋範囲大ダメージ
    state.enemies.forEach(e => {
      if (Math.abs(e.x - ally.x) <= ally.range + 80) {
        e.hp -= dmg;
        e.freezeTimer = 2.5; // 2.5秒完全凍結！
        addSpark(e.x, e.y - 20, '#38bdf8');
      }
    });
  } else if (ally.id === 'yoshinori') {
    // よしのりのソーラービーム：直線の敵全員貫通
    state.effects.push({
      type: 'solar_beam',
      startX: ally.x,
      life: 0.4,
      maxLife: 0.4
    });
    state.enemies.forEach(e => {
      if (e.x >= ally.x) {
        e.hp -= dmg;
        addSpark(e.x, e.y - 20, '#facc15');
      }
    });
  } else if (ally.id === 'souikun') {
    // そういくんの熱血ラッシュ：連続攻撃＆強ノックバック
    target.hp -= dmg;
    target.x += 45; // 敵を殴り飛ばす
    addSpark(target.x, target.y - 20, '#f97316');
  } else if (ally.isArea) {
    // 範囲攻撃
    state.enemies.forEach(e => {
      if (Math.abs(e.x - ally.x) <= ally.range) {
        e.hp -= dmg;
        addSpark(e.x, e.y - 20, '#a855f7');
      }
    });
  } else {
    // 単体攻撃
    target.hp -= dmg;
    addSpark(target.x, target.y - 20, '#38bdf8');
  }
}

function addSpark(x, y, color) {
  state.effects.push({
    type: 'hit_spark',
    x, y, color,
    life: 0.25,
    maxLife: 0.25
  });
}

function updateCamera(dt) {
  if (state.allies.length > 0) {
    let leadX = 0;
    state.allies.forEach(a => { if (a.x > leadX) leadX = a.x; });
    const targetCamX = Math.max(0, Math.min(state.worldWidth - canvas.width, leadX - canvas.width * 0.45));
    state.cameraX += (targetCamX - state.cameraX) * 4 * dt;
  }
}

function onBattleEnd(isWin) {
  state.battleActive = false;
  const modal = document.getElementById('battleResultModal');
  const banner = document.getElementById('battleResultBanner');
  const title = document.getElementById('resultTitle');
  const desc = document.getElementById('resultDesc');
  const reward = document.getElementById('resultReward');

  modal.classList.add('active');

  if (isWin) {
    banner.className = 'battle-result-banner win';
    title.innerText = 'VICTORY!!';
    desc.innerText = 'レガシーサーバーを完全にシャットダウンしました！';
    const stones = 500;
    state.queryStones += stones;
    reward.innerText = `報酬：クエリ石 +${stones}個 獲得！`;
    window.soundManager.playVictory();
    window.soundManager.speak('勝利！素晴らしいクエリでした！', { pitch: 1.2 });
  } else {
    banner.className = 'battle-result-banner lose';
    title.innerText = 'DEFEAT...';
    desc.innerText = '自軍データベースが500 Internal Errorでダウンしました...';
    reward.innerText = 'CPUのレベルを上げてリベンジしよう！';
    window.soundManager.playExplosion();
    window.soundManager.speak('システムダウン。ロールバックを実行します', { pitch: 0.8 });
  }
  updateResourceUI();
}

// ==========================================
// Canvas 描画ルーチン
// ==========================================

function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-state.cameraX, 0);

  // 背景（サイバー風グリッド）
  drawBackground();

  // 拠点（自陣・敵陣）
  drawBases();

  // 味方ユニット描画
  state.allies.forEach(drawAlly);

  // 敵ユニット描画
  state.enemies.forEach(drawEnemy);

  // エフェクト描画
  state.effects.forEach(drawEffect);

  ctx.restore();

  // 画面全体エフェクト（フラッシュなど）
  state.effects.forEach(eff => {
    if (eff.type === 'screen_flash') {
      ctx.fillStyle = eff.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  });
}

function drawBackground() {
  const groundY = canvas.height - 80;

  // 空グラデーション
  const grad = ctx.createLinearGradient(0, 0, 0, groundY);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(1, '#1e1e38');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, state.worldWidth, groundY);

  // グリッド線
  ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < state.worldWidth; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, groundY);
    ctx.stroke();
  }
  for (let y = 0; y < groundY; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(state.worldWidth, y);
    ctx.stroke();
  }

  // 地面
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, groundY, state.worldWidth, 80);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(state.worldWidth, groundY);
  ctx.stroke();
}

function drawBases() {
  const groundY = canvas.height - 80;

  // 自陣城（PostgreSQL クラウドサーバー）
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(30, groundY - 140, 90, 140);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, groundY - 140, 90, 140);

  // サーバーラック風ランプ
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = (Date.now() + i * 200) % 600 > 300 ? '#10b981' : '#047857';
    ctx.fillRect(45, groundY - 120 + i * 25, 12, 6);
  }

  ctx.font = '28px sans-serif';
  ctx.fillText('🐘', 60, groundY - 40);

  // 自陣HPバー
  const baseHpRatio = Math.max(0, state.baseHp / state.maxBaseHp);
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, groundY - 165, 110, 12);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(20, groundY - 165, 110 * baseHpRatio, 12);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, groundY - 165, 110, 12);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`DB: ${Math.floor(state.baseHp)}`, 30, groundY - 170);

  // 敵陣城（レガシーオンプレサーバー）
  const enemyBaseX = state.worldWidth - 120;
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(enemyBaseX, groundY - 160, 100, 160);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(enemyBaseX, groundY - 160, 100, 160);

  // 煙・火花
  if (Math.random() < 0.3) {
    ctx.fillStyle = '#f97316';
    ctx.fillRect(enemyBaseX + 20 + Math.random() * 60, groundY - 170, 8, 8);
  }

  ctx.font = '32px sans-serif';
  ctx.fillText('🔥💾', enemyBaseX + 20, groundY - 60);

  // 敵陣HPバー
  const enemyHpRatio = Math.max(0, state.enemyBaseHp / state.maxEnemyBaseHp);
  ctx.fillStyle = '#334155';
  ctx.fillRect(enemyBaseX - 10, groundY - 185, 120, 12);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(enemyBaseX - 10, groundY - 185, 120 * enemyHpRatio, 12);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(enemyBaseX - 10, groundY - 185, 120, 12);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Legacy: ${Math.floor(state.enemyBaseHp)}`, enemyBaseX, groundY - 190);
}

function drawAlly(ally) {
  const bounce = Math.sin(ally.frame) * 4;
  const drawY = ally.y + bounce;

  // オーラ演出
  if (ally.id === 'iseikun') {
    // 冷笑オーラ（絶対零度）
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(ally.x, drawY - 20, 45, 0, Math.PI * 2);
    ctx.fill();
  } else if (ally.id === 'yoshinori') {
    // 太陽オーラ（朝の光）
    ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
    ctx.beginPath();
    ctx.arc(ally.x, drawY - 25, 55, 0, Math.PI * 2);
    ctx.fill();
  } else if (ally.id === 'souikun') {
    // 熱血オーラ（炎）
    ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.beginPath();
    ctx.arc(ally.x, drawY - 15, 45, 0, Math.PI * 2);
    ctx.fill();
  } else if (ally.id === 'moridig') {
    // 森ディグオーラ（自然＆アローラ金髪）
    ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(ally.x, drawY - 20, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // キャラアイコンまたは画像描画
  const allyImg = CHAR_IMAGES[ally.id];
  if (allyImg && allyImg.complete && allyImg.naturalWidth > 0) {
    const sz = ally.rarity === 'legendary' ? 62 : 46;
    ctx.save();
    // 丸型クリッピング
    ctx.beginPath();
    ctx.arc(ally.x, drawY - sz / 2, sz / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(allyImg, ally.x - sz / 2, drawY - sz, sz, sz);
    ctx.restore();

    // 枠線リング
    ctx.strokeStyle = ally.rarity === 'legendary' ? '#fbbf24' : '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ally.x, drawY - sz / 2, sz / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.font = (ally.rarity === 'legendary' ? '42px' : '32px') + ' sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ally.icon, ally.x, drawY);
  }

  // HPバー
  const hpRatio = Math.max(0, ally.hp / ally.maxHp);
  ctx.fillStyle = '#334155';
  ctx.fillRect(ally.x - 20, drawY - 45, 40, 5);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(ally.x - 20, drawY - 45, 40 * hpRatio, 5);

  // ふきだしセリフ（冷笑、おはようございまーす、熱血）
  if (ally.sayTimer > 0 && ally.sayText) {
    ctx.save();
    ctx.font = 'bold 13px sans-serif';
    const textWidth = ctx.measureText(ally.sayText).width;
    const bubbleX = ally.x;
    const bubbleY = drawY - 60;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = ally.rarity === 'legendary' ? '#fbbf24' : '#f97316';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bubbleX - textWidth / 2 - 8, bubbleY - 16, textWidth + 16, 22, 6);
    } else {
      ctx.rect(bubbleX - textWidth / 2 - 8, bubbleY - 16, textWidth + 16, 22);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ally.rarity === 'legendary' ? '#fef08a' : '#fff';
    ctx.fillText(ally.sayText, bubbleX, bubbleY);
    ctx.restore();
  }
}

function drawEnemy(enemy) {
  const bounce = Math.sin(enemy.frame) * 4;
  const drawY = enemy.y + bounce;

  // 森ディグの金髪・アローラオーラ演出！
  if (enemy.id === 'boss_moridig') {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.beginPath();
    ctx.arc(enemy.x, drawY - 25, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.25)';
    ctx.beginPath();
    ctx.arc(enemy.x, drawY - 25, 70, 0, Math.PI * 2);
    ctx.fill();
  }

  // 凍結エフェクト
  if (enemy.freezeTimer > 0) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(enemy.x - 25, drawY - 40, 50, 50);
  }

  // 敵アイコンまたは画像描画
  const enemyImg = CHAR_IMAGES[enemy.id];
  if (enemyImg && enemyImg.complete && enemyImg.naturalWidth > 0) {
    if (enemy.id === 'boss_moridig') {
      // ポンデディグダ（アローラのすがた）は超特大で描画！
      const sz = 85;
      ctx.save();
      ctx.shadowColor = 'rgba(234, 179, 8, 0.7)';
      ctx.shadowBlur = 12;
      ctx.drawImage(enemyImg, enemy.x - sz / 2, drawY - sz + 15, sz, sz);
      ctx.restore();
    } else {
      const sz = enemy.isBoss ? 68 : 46;
      ctx.save();
      ctx.beginPath();
      ctx.arc(enemy.x, drawY - sz / 2, sz / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(enemyImg, enemy.x - sz / 2, drawY - sz, sz, sz);
      ctx.restore();

      ctx.strokeStyle = enemy.isBoss ? '#f59e0b' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x, drawY - sz / 2, sz / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.font = (enemy.isBoss ? '44px' : '32px') + ' sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.icon, enemy.x, drawY);
  }

  // 敵HPバー
  const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
  const barW = enemy.isBoss ? 70 : 40;
  ctx.fillStyle = '#334155';
  ctx.fillRect(enemy.x - barW / 2, drawY - 48, barW, 6);
  ctx.fillStyle = enemy.isBoss ? '#f59e0b' : '#ef4444';
  ctx.fillRect(enemy.x - barW / 2, drawY - 48, barW * hpRatio, 6);

  // 敵のふきだしセリフ（森ディグの「名前教えて」「個人面談！」）
  if (enemy.sayTimer > 0 && enemy.sayText) {
    ctx.save();
    ctx.font = 'bold 13px sans-serif';
    const textWidth = ctx.measureText(enemy.sayText).width;
    const bubbleX = enemy.x;
    const bubbleY = drawY - 65;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bubbleX - textWidth / 2 - 8, bubbleY - 16, textWidth + 16, 22, 6);
    } else {
      ctx.rect(bubbleX - textWidth / 2 - 8, bubbleY - 16, textWidth + 16, 22);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#86efac';
    ctx.fillText(enemy.sayText, bubbleX, bubbleY);
    ctx.restore();
  }
}

function drawEffect(eff) {
  const ratio = eff.life / eff.maxLife;

  if (eff.type === 'hit_spark') {
    ctx.fillStyle = eff.color;
    ctx.beginPath();
    ctx.arc(eff.x, eff.y, (1 - ratio) * 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (eff.type === 'dust') {
    ctx.fillStyle = `rgba(148, 163, 184, ${ratio})`;
    ctx.beginPath();
    ctx.arc(eff.x, eff.y, (1 - ratio) * 25, 0, Math.PI * 2);
    ctx.fill();
  } else if (eff.type === 'cannon_beam') {
    // DROP TABLE砲レーザー
    ctx.fillStyle = `rgba(239, 68, 68, ${ratio * 0.7})`;
    ctx.fillRect(0, canvas.height - 150, state.worldWidth, 80);
    ctx.fillStyle = `rgba(255, 255, 255, ${ratio})`;
    ctx.fillRect(0, canvas.height - 120, state.worldWidth, 20);
  } else if (eff.type === 'solar_beam') {
    // よしのりのソーラービーム
    ctx.fillStyle = `rgba(253, 224, 71, ${ratio * 0.8})`;
    ctx.fillRect(eff.startX, canvas.height - 145, state.worldWidth - eff.startX, 70);
    ctx.fillStyle = `rgba(255, 255, 255, ${ratio})`;
    ctx.fillRect(eff.startX, canvas.height - 120, state.worldWidth - eff.startX, 20);
  }
}

// ==========================================
// UI更新 & ガチャ機能
// ==========================================

function updateHud() {
  document.getElementById('memoryCounter').innerText = `${Math.floor(state.memory)} / ${state.maxMemory} MB`;
  document.getElementById('cpuLevelText').innerText = `Lv.${state.cpuLevel} (増設: ${state.getCpuUpgradeCost()}MB)`;
  
  const cannonBtn = document.getElementById('cannonBtn');
  const cannonPct = Math.min(100, Math.floor((state.cannonCharge / state.cannonMax) * 100));
  cannonBtn.innerText = `💥 DROP TABLE砲 (${cannonPct}%)`;
  cannonBtn.disabled = state.cannonCharge < state.cannonMax;

  const cpuBtn = document.getElementById('cpuBtn');
  cpuBtn.disabled = state.memory < state.getCpuUpgradeCost() || state.cpuLevel >= 10;

  updateDeckButtonsUI();
}

function updateResourceUI() {
  document.getElementById('stoneDisplay').innerText = state.queryStones;
}

function renderDeckButtons() {
  const container = document.getElementById('deckContainer');
  container.innerHTML = '';

  state.deck.forEach(charId => {
    const data = state.unlockedChars[charId];
    if (!data) return;

    const btn = document.createElement('button');
    btn.className = `deck-unit-btn ${data.rarity}`;
    btn.id = `deck_btn_${charId}`;
    btn.onclick = () => deployUnit(charId);

    btn.innerHTML = `
      <div class="cooldown-overlay" id="cd_${charId}" style="height: 0%;"></div>
      <div class="unit-icon-box">${getCharIconHtml(charId, data.icon, data.rarity)}</div>
      <div class="unit-name">${data.name}</div>
      <div class="unit-cost">${data.cost}MB</div>
    `;
    container.appendChild(btn);
  });
}

function updateDeckButtonsUI() {
  state.deck.forEach(charId => {
    const data = state.unlockedChars[charId];
    const btn = document.getElementById(`deck_btn_${charId}`);
    const cdOverlay = document.getElementById(`cd_${charId}`);
    if (!btn || !cdOverlay) return;

    const cd = state.cooldowns[charId] || 0;
    if (cd > 0) {
      const cdRatio = (cd / data.cooldown) * 100;
      cdOverlay.style.height = `${cdRatio}%`;
    } else {
      cdOverlay.style.height = '0%';
    }

    btn.disabled = state.memory < data.cost || cd > 0;
  });
}

// --- ガチャロジック ---

function rollGacha(count) {
  const cost = count === 1 ? 100 : 1000;
  if (state.queryStones < cost) {
    alert('クエリ石が足りません！バトルに勝利して集めよう！');
    return;
  }

  state.queryStones -= cost;
  updateResourceUI();

  window.soundManager.playGachaRoll();

  const results = [];
  let hasLegend = false;

  for (let i = 0; i < count; i++) {
    const rand = Math.random() * 100;
    let pickedId = 'index_neko';

    // 排出率：伝説 14% (いせいくん 3.5%, よしのり 3.5%, そういくん 3.5%, ただの森ディグ 3.5%)
    // 激レア 16% (トランザクション 16%), レア 40%, ノーマル 30%
    if (rand < 3.5) {
      pickedId = 'iseikun'; // 伝説
      hasLegend = true;
    } else if (rand < 7.0) {
      pickedId = 'yoshinori'; // 伝説
      hasLegend = true;
    } else if (rand < 10.5) {
      pickedId = 'souikun'; // 伝説
      hasLegend = true;
    } else if (rand < 14.0) {
      pickedId = 'moridig'; // 伝説
      hasLegend = true;
    } else if (rand < 30.0) {
      pickedId = 'transaction';
    } else if (rand < 50.0) {
      pickedId = 'redis_dog';
    } else if (rand < 70.0) {
      pickedId = 'asterisk';
    } else {
      pickedId = 'index_neko';
    }

    // 解放＆レベルアップ
    const char = state.unlockedChars[pickedId];
    if (!char.unlocked) {
      char.unlocked = true;
      if (!state.deck.includes(pickedId)) {
        state.deck.push(pickedId);
      }
    } else {
      char.level++;
    }

    results.push(char);
  }

  showGachaResultModal(results, hasLegend);
  renderDeckButtons();
  renderUnitsList();
}

function showGachaResultModal(results, hasLegend) {
  const modal = document.getElementById('gachaModal');
  const anim = document.getElementById('gachaAnim');
  const grid = document.getElementById('gachaGrid');
  const closeBtn = document.getElementById('gachaCloseBtn');

  modal.classList.add('active');
  anim.style.display = 'block';
  grid.style.display = 'none';
  closeBtn.style.display = 'none';

  // 演出待機
  setTimeout(() => {
    anim.style.display = 'none';
    grid.style.display = 'grid';
    closeBtn.style.display = 'inline-block';
    grid.innerHTML = '';

    if (hasLegend) {
      window.soundManager.playLegendFanfare();
      window.soundManager.speak('超絶激レア！伝説のキャラクターが降臨しました！！', { pitch: 1.2 });
    }

    results.forEach(char => {
      const card = document.createElement('div');
      card.className = `result-card ${char.rarity}`;
      card.innerHTML = `
        <div class="unit-icon-box" style="width: 70px; height: 70px; margin-bottom: 6px;">
          ${getCharIconHtml(char.id, char.icon, char.rarity)}
        </div>
        <span class="unit-rarity rarity-${char.rarity}">${char.rarityName}</span>
        <strong style="margin: 6px 0; font-size: 0.95rem;">${char.name}</strong>
        <span style="font-size: 0.8rem; color: #38bdf8;">Lv.${char.level}</span>
        <div style="font-size: 0.75rem; color: #fef08a; margin-top: 4px;">"${char.quote}"</div>
      `;
      grid.appendChild(card);
    });
  }, 1200);
}

// キャラ一覧画面の描画
function renderUnitsList() {
  const container = document.getElementById('unitsGrid');
  container.innerHTML = '';

  Object.values(state.unlockedChars).forEach(char => {
    const card = document.createElement('div');
    card.className = `unit-detail-card ${char.rarity} ${char.unlocked ? '' : 'locked'}`;

    card.innerHTML = `
      <div class="unit-detail-header">
        <div class="unit-icon-box" style="width: 60px; height: 60px;">
          ${getCharIconHtml(char.id, char.icon, char.rarity)}
        </div>
        <div class="name-area">
          <h3>${char.name} ${char.unlocked ? `<span style="font-size: 0.85rem; color: #38bdf8;">(Lv.${char.level})</span>` : '<span style="font-size: 0.8rem; color: #94a3b8;">[未所持]</span>'}</h3>
          <span class="unit-rarity rarity-${char.rarity}">${char.rarityName}</span>
        </div>
      </div>
      <div class="unit-stats">
        <div>コスト: ${char.cost}MB</div>
        <div>HP: ${Math.floor(char.hp * (1 + (char.level - 1) * 0.2))}</div>
        <div>攻撃力: ${Math.floor(char.atk * (1 + (char.level - 1) * 0.2))}</div>
        <div>再生産: ${char.cooldown}秒</div>
      </div>
      <p class="unit-desc">${char.desc}</p>
      <div style="font-size: 0.85rem; color: #facc15; font-style: italic;">出陣時:「${char.quote}」</div>
    `;
    container.appendChild(card);
  });
}

// 画像カスタマイズ画面の描画
function renderCustomTab() {
  const container = document.getElementById('customGrid');
  if (!container) return;
  container.innerHTML = '';

  const charList = [
    { id: 'iseikun', name: '【絶対零度】いせいくん', rarity: 'legendary', icon: '❄️🕶️' },
    { id: 'yoshinori', name: '【朝の支配者】よしのり', rarity: 'legendary', icon: '☀️👑' },
    { id: 'souikun', name: '【熱血闘士】そういくん', rarity: 'legendary', icon: '🔥🥋' },
    { id: 'moridig', name: '【伝説レア】ただの森ディグ', rarity: 'legendary', icon: '🦔🌲' },
    { id: 'boss_moridig', name: '【ボス】森ディグ(アローラのすがた)', rarity: 'legendary', icon: '🦔🌴✨' },
    { id: 'index_neko', name: 'インデックスネコ', rarity: 'normal', icon: '🐱' },
    { id: 'asterisk', name: 'アスタリスクくん', rarity: 'rare', icon: '✳️' },
    { id: 'redis_dog', name: 'Redis犬', rarity: 'rare', icon: '🐕' },
    { id: 'transaction', name: 'トランザクション重装兵', rarity: 'super_rare', icon: '🛡️' },
    { id: 'boss_n1_emperor', name: '【中ボス】N+1大帝', rarity: 'super_rare', icon: '🐛👑⚡' },
    { id: 'legacy_server_boss', name: '【ラスボス】メインフレーム神', rarity: 'legendary', icon: '📠☠️⚡' }
  ];

  charList.forEach(item => {
    const card = document.createElement('div');
    card.className = `custom-card ${item.rarity}`;

    const img = CHAR_IMAGES[item.id];
    const hasCustomImg = img && img.src && (img.src.startsWith('data:') || (img.complete && img.naturalWidth > 0));

    card.innerHTML = `
      <div class="custom-preview-box" id="prev_box_${item.id}">
        ${hasCustomImg ? `<img class="custom-preview-img" src="${img.src}">` : `<span>${item.icon}</span>`}
      </div>
      <div>
        <strong style="font-size: 0.95rem;">${item.name}</strong>
        <div class="file-path-hint">images/${item.id}.png</div>
      </div>
      <input type="file" id="file_input_${item.id}" accept="image/*" style="display: none;">
      <div class="custom-card-actions">
        <button class="btn-upload-file" id="btn_up_${item.id}">📁 画像を選択</button>
        <button class="btn-reset-file" id="btn_reset_${item.id}" title="絵文字に戻す">🔄</button>
      </div>
    `;
    container.appendChild(card);

    // ファイル選択イベント
    const fileInput = card.querySelector(`#file_input_${item.id}`);
    const upBtn = card.querySelector(`#btn_up_${item.id}`);
    const resetBtn = card.querySelector(`#btn_reset_${item.id}`);

    upBtn.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target.result;
        localStorage.setItem('custom_img_' + item.id, base64);
        CHAR_IMAGES[item.id].src = base64;
        CHAR_IMAGES[item.id].onload = () => {
          renderCustomTab();
          renderDeckButtons();
          renderUnitsList();
        };
      };
      reader.readAsDataURL(file);
    };

    resetBtn.onclick = () => {
      localStorage.removeItem('custom_img_' + item.id);
      CHAR_IMAGES[item.id] = new Image();
      CHAR_IMAGES[item.id].src = `images/${item.id}.png`;
      renderCustomTab();
      renderDeckButtons();
      renderUnitsList();
    };
  });
}

// タブ切り替え
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(`${tabId}-tab`).classList.add('active');
  document.getElementById(`tab-btn-${tabId}`).classList.add('active');

  if (tabId === 'battle') {
    resizeCanvas();
  } else if (tabId === 'units') {
    renderUnitsList();
  } else if (tabId === 'custom') {
    renderCustomTab();
  }
}

// カメラ手動移動
function moveCamera(delta) {
  state.cameraX = Math.max(0, Math.min(state.worldWidth - canvas.width, state.cameraX + delta));
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', () => {
  // タブ
  document.getElementById('tab-btn-battle').onclick = () => switchTab('battle');
  document.getElementById('tab-btn-gacha').onclick = () => switchTab('gacha');
  document.getElementById('tab-btn-units').onclick = () => switchTab('units');
  document.getElementById('tab-btn-custom').onclick = () => switchTab('custom');

  // バトル操作
  document.getElementById('startBattleBtn').onclick = () => startBattle();
  document.getElementById('cpuBtn').onclick = () => state.upgradeCpu();
  document.getElementById('cannonBtn').onclick = () => fireDropTableCannon();
  document.getElementById('camLeftBtn').onclick = () => moveCamera(-200);
  document.getElementById('camRightBtn').onclick = () => moveCamera(200);

  // ガチャ
  document.getElementById('gachaSingleBtn').onclick = () => rollGacha(1);
  document.getElementById('gachaMultiBtn').onclick = () => rollGacha(10);
  document.getElementById('gachaCloseBtn').onclick = () => {
    document.getElementById('gachaModal').classList.remove('active');
  };

  // バトル結果
  document.getElementById('resultRetryBtn').onclick = () => {
    document.getElementById('battleResultModal').classList.remove('active');
    initBattle(false);
  };
  document.getElementById('resultGachaBtn').onclick = () => {
    document.getElementById('battleResultModal').classList.remove('active');
    switchTab('gacha');
  };

  // 初回待機状態（バトル開始ボタンを押すまで止まっている）
  initBattle(false);
  updateResourceUI();
  renderUnitsList();

  // ループ開始
  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;

    updateGame(dt);
    drawBattle();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
