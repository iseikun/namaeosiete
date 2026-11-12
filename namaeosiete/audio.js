// audio.js - Web Audio API による効果音合成 & Web Speech API による音声再生

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.voices = [];
    this.lastInterviewTime = 0;
    this.lastAskNameTime = 0;
    this.initAudioContext();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 音声合成（日本語ボイス：ひらがなを渡して誤読を完全防止！）
  speak(text, { pitch = 1.0, rate = 1.0, volume = 1.0 } = {}) {
    if (this.isMuted) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // 前の音声を止める
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.pitch = pitch;
      utter.rate = rate;
      utter.volume = volume;

      // 日本語の音声を優先して探す
      const jaVoice = this.voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
      if (jaVoice) {
        utter.voice = jaVoice;
      }

      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // キャラごとの出陣ボイス
  playDeployVoice(charId) {
    if (charId === 'iseikun') {
      // いせいくん: れいしょう
      this.speak('れいしょう', { pitch: 0.7, rate: 0.9, volume: 1.0 });
    } else if (charId === 'yoshinori') {
      // よしのり: おはようございまーす
      this.speak('おはようございまーす！', { pitch: 1.35, rate: 1.2, volume: 1.0 });
    } else if (charId === 'souikun') {
      // そういくん: ねっけつ（ひらがなで確実に発音！）
      this.speak('ねっけつーーっ！', { pitch: 1.1, rate: 1.15, volume: 1.0 });
    } else if (charId === 'moridig') {
      // 森ディグ: サウンド・ボイスなし（画面表記のみ）
    } else if (charId === 'index_neko') {
      this.playCatMeow();
    } else if (charId === 'asterisk') {
      this.playLaser();
    } else if (charId === 'redis_dog') {
      this.playBite();
    }
  }

  // キャラごとの攻撃サウンド
  playAttackSound(charId) {
    this.ensureContext();

    if (charId === 'moridig') {
      // ただの森ディグ: サウンドなし（画面表記のみ）
    } else if (charId === 'souikun') {
      // そういくん: 炎の熱血ラッシュ音
      this.playFirePunch();
    } else if (charId === 'iseikun') {
      // いせいくん: 氷結破砕音
      this.playIceShatter();
    } else if (charId === 'yoshinori') {
      // よしのり: ソーラー極太レーザー
      this.playSolarBeam();
    } else if (charId === 'index_neko') {
      // インデックスネコ: ペシッ！
      this.playCatPaw();
    } else if (charId === 'asterisk') {
      // アスタリスクくん: ピシュン！
      this.playLaser();
    } else if (charId === 'redis_dog') {
      // Redis犬: ガブッ！
      this.playBite();
    } else if (charId === 'transaction') {
      // トランザクション: ズガァン！
      this.playIronSmash();
    } else {
      this.playHit();
    }
  }

  // ただの森ディグ専用：名前教えてサウンド
  playMoriAskName() {
    this.playHit();
    const now = Date.now();
    if (now - this.lastAskNameTime > 700) {
      this.lastAskNameTime = now;
      this.speak('なまえおしえて！', { pitch: 1.1, rate: 1.35, volume: 1.0 });
    }
  }

  // 森ディグ(アローラのすがた)ボス専用：サウンドなし（画面表記のみ）
  playMoriInterview() {
    // サウンドいったんなし（画面表記のみ）
  }

  // --- Web Audio API 効果音合成 ---

  // ネコパンチ（ペシッ）
  playCatPaw() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // ネコ鳴き声ピロ
  playCatMeow() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(750, now + 0.1);
    osc.frequency.linearRampToValueAtTime(600, now + 0.2);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 熱血炎パンチ（バキィン）
  playFirePunch() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 冷気・氷結破砕（ピキピキドォン）
  playIceShatter() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.2);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // ソーラービーム（ズドドドォォン）
  playSolarBeam() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 重打撃・鉄球（ズガァン）
  playIronSmash() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 汎用ヒット音
  playHit() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // レーザー音
  playLaser() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 噛みつき音
  playBite() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ボス出現警告サイレン音（ウ〜〜！ウ〜〜！）
  playWarningSiren() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const t = now + i * 0.35;
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.linearRampToValueAtTime(750, t + 0.18);
      osc.frequency.linearRampToValueAtTime(450, t + 0.32);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.33);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.33);
    }
  }

  // 出撃音
  playDeploy() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // DROP TABLE砲
  playDropTableCannon() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  // 爆発音
  playExplosion() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // ガチャ回転音
  playGachaRoll() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + i * 80, now + i * 0.06);
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + (i + 1) * 0.06);
    }
  }

  // 伝説ファンファーレ
  playLegendFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [261.6, 329.6, 392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // 勝利ファンファーレ
  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const melody = [523, 523, 523, 659, 783, 659, 783, 1046];
    const times = [0, 0.15, 0.3, 0.45, 0.65, 0.85, 1.05, 1.3];
    melody.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + times[i]);
      gain.gain.setValueAtTime(0.15, now + times[i]);
      gain.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + times[i]);
      osc.stop(now + times[i] + 0.25);
    });
  }
}

window.soundManager = new SoundManager();
