/* ===== THREE.JS BACKGROUND ===== */
const BG = {
    init() {
        try {
            const canvas = document.getElementById('bgCanvas');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            // Particles
            const geo = new THREE.BufferGeometry();
            const count = 800;
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 40;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
                const c = new THREE.Color().setHSL(0.45 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.2);
                colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.6 });
            const points = new THREE.Points(geo, mat);
            scene.add(points);
            // Wireframe icosahedron
            const icoGeo = new THREE.IcosahedronGeometry(3, 1);
            const icoMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.08 });
            const ico = new THREE.Mesh(icoGeo, icoMat);
            scene.add(ico);
            camera.position.z = 12;
            let mx = 0, my = 0;
            document.addEventListener('mousemove', e => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; });
            window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
            const animate = () => {
                requestAnimationFrame(animate);
                points.rotation.y += 0.0005;
                points.rotation.x += 0.0002;
                ico.rotation.y += 0.002;
                ico.rotation.x += 0.001;
                camera.position.x += (mx * 0.5 - camera.position.x) * 0.02;
                camera.position.y += (-my * 0.5 - camera.position.y) * 0.02;
                renderer.render(scene, camera);
            };
            animate();
        } catch (e) { console.warn('Three.js failed:', e); }
    }
};

/* ===== TOAST ===== */
const Toast = {
    show(msg, type = 'info') {
        const c = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(60px)'; setTimeout(() => t.remove(), 400); }, 3000);
    }
};

/* ===== OTP MODULE ===== */
const OTP = {
    generatedOtp: '',
    sendOtp() {
        const phone = document.getElementById('phoneInput').value.trim();
        if (!/^\d{10}$/.test(phone)) { Toast.show('Enter valid 10-digit number', 'error'); return; }
        this.generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        document.getElementById('otpPhone').textContent = '+91 ' + phone.slice(0, 2) + '••••' + phone.slice(6);
        document.getElementById('phoneStep').classList.remove('active');
        document.getElementById('otpStep').classList.add('active');
        // Animated SMS
        setTimeout(() => {
            document.getElementById('smsOtpDisplay').textContent = this.generatedOtp;
            document.getElementById('smsAnim').classList.add('show');
        }, 800);
        // Auto-focus first OTP box
        const boxes = document.querySelectorAll('.otp-box');
        boxes[0].focus();
        boxes.forEach((b, i) => {
            b.addEventListener('input', () => { if (b.value && i < 5) boxes[i + 1].focus(); });
            b.addEventListener('keydown', e => { if (e.key === 'Backspace' && !b.value && i > 0) boxes[i - 1].focus(); });
        });
        if (typeof anime !== 'undefined') {
            anime({ targets: '.sms-bubble', scale: [0, 1], duration: 600, easing: 'easeOutElastic(1,.6)', delay: 800 });
        }
        Toast.show('OTP sent to your phone', 'success');
    },
    verifyOtp() {
        const boxes = document.querySelectorAll('.otp-box');
        const entered = Array.from(boxes).map(b => b.value).join('');
        if (entered === this.generatedOtp) {
            const phone = document.getElementById('phoneInput').value.trim();
            State.load(phone);
            // Only set user info if this is a brand new account (don't overwrite returning users)
            if (!State.get('user')) {
                State.set('user', { phone, name: 'Trader_' + phone.slice(-4), joined: Date.now() });
            }
            Toast.show('Welcome to PaperBull! 🎉', 'success');
            CloudSync.initSync().then(() => {
                // Re-init market with potentially updated price snapshots from cloud
                Market.init();
                if (State.get('introSeen')) { App.startDashboard(); } else { App.showIntro(); }
            });
        } else { Toast.show('Invalid OTP. Try again.', 'error'); }
    },
    resend() {
        this.generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        document.getElementById('smsOtpDisplay').textContent = this.generatedOtp;
        Toast.show('New OTP sent', 'info');
    },
    toggleRestore() {
        document.getElementById('restorePanel').classList.toggle('show');
    },
    async restoreFromCode() {
        const code = document.getElementById('restoreSyncCode').value.trim();
        if (!code) { Toast.show('Enter a sync code', 'error'); return; }
        Toast.show('Fetching data from cloud...', 'info');
        const data = await CloudSync.fetchByCode(code);
        if (data && data.user) {
            State.load(data.user.phone);
            State.data = { ...State.defaults(), ...data, cloudSyncId: code };
            State.save();
            // Re-init market engine with the restored price snapshots
            Market.init();
            Toast.show('Data restored! Welcome back.', 'success');
            App.startDashboard();
        } else { Toast.show('Invalid sync code or no data found', 'error'); }
    }
};

/* ===== APP CONTROLLER ===== */
const App = {
    init() {
        State.load();
        BG.init();
        Market.init();
        Theme.apply(State.get('theme'));
        if (State.get('user')) {
            const phone = State.get('user').phone;
            State.load(phone);
            Market.init();
            Theme.apply(State.get('theme'));
            CloudSync.initSync().then(() => this.startDashboard());
        }
        try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch (e) { }
    },
    showIntro() {
        this._switchScreen('introScreen');
        State.set('introSeen', true);
        if (typeof anime !== 'undefined') {
            anime.timeline({ easing: 'easeOutExpo' })
                .add({ targets: '.intro-ticker', opacity: [0, 1], translateY: [30, 0], duration: 800 })
                .add({ targets: '.intro-title', opacity: [0, 1], translateY: [40, 0], duration: 800 }, '-=400')
                .add({ targets: '.intro-sub', opacity: [0, 1], translateY: [30, 0], duration: 600 }, '-=400')
                .add({ targets: '.intro-features', opacity: [0, 1], translateY: [30, 0], duration: 600 }, '-=300')
                .add({ targets: '.btn-glow', opacity: [0, 1], scale: [0.8, 1], duration: 500 }, '-=200');
        }
        // Ticker items
        const t = document.getElementById('introTicker');
        ['NIFTY +1.2%', 'SENSEX +0.8%', 'RELIANCE ₹2,480', 'TCS ₹3,920', 'INFY ₹1,580'].forEach(txt => {
            const d = document.createElement('div'); d.className = 'tick-item'; d.textContent = txt; t.appendChild(d);
        });
    },
    startDashboard() {
        this._switchScreen('dashboard');
        Market.start();
        MarketUI.init();
        PortfolioUI.init();
        ProfileUI.init();
        FnOUI.init();
        PredictUI.init();
        this._startClock();
        setInterval(() => { Trading.checkLimitOrders(); Trading.autoSquareOff(); PredictionEngine.resolve(); }, 5000);
        try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch (e) { }
    },
    logout() {
        if (!confirm('Logout and return to login screen?')) return;
        CloudSync.syncUp();
        Market.stop();
        State.currentPhone = null;
        document.getElementById('phoneInput').value = '';
        document.querySelectorAll('.otp-box').forEach(b => b.value = '');
        document.getElementById('smsAnim').classList.remove('show');
        document.getElementById('phoneStep').classList.add('active');
        document.getElementById('otpStep').classList.remove('active');
        document.getElementById('restorePanel').classList.remove('show');
        this._switchScreen('otpScreen');
        Toast.show('Logged out successfully', 'info');
    },
    _switchScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    _startClock() {
        const update = () => {
            const now = new Date();
            const el = document.getElementById('topbarTime');
            if (el) el.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
            const ms = document.getElementById('marketStatus');
            if (ms) {
                const open = Market.isMarketOpen();
                ms.className = 'market-status' + (open ? ' open' : '');
                ms.querySelector('.status-text').textContent = open ? 'Market Open' : 'Market Closed';
            }
            // Update header
            const cap = document.getElementById('headerCapital');
            if (cap) cap.textContent = State.get('capital').toLocaleString('en-IN');
            const lvl = document.getElementById('headerLevel');
            if (lvl) lvl.textContent = 'Lv ' + State.get('level');
            const xpFill = document.getElementById('headerXpFill');
            if (xpFill) { const pct = (State.get('xp') / (State.get('level') * 100)) * 100; xpFill.style.width = Math.min(100, pct) + '%'; }
        };
        update();
        setInterval(update, 1000);
    }
};

/* ===== UI: SIDEBAR & TABS ===== */
const UI = {
    showTab(tab) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const el = document.getElementById('tab-' + tab);
        if (el) el.classList.add('active');
        const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
        if (btn) btn.classList.add('active');
        if (tab === 'portfolio') PortfolioUI.refresh();
        if (tab === 'profile') ProfileUI.refresh();
        if (tab === 'predict') PredictUI.refresh();
        if (tab === 'orders') OrderUI.refresh();
        if (tab === 'fno') FnOUI.loadChain();
    },
    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }
};

/* ===== THEME ===== */
const Theme = {
    toggle() { const cur = document.documentElement.getAttribute('data-theme'); this.set(cur === 'dark' ? 'light' : 'dark'); },
    set(t) { document.documentElement.setAttribute('data-theme', t); State.set('theme', t); const sel = document.getElementById('themeSelect'); if (sel) sel.value = t; },
    apply(t) { document.documentElement.setAttribute('data-theme', t || 'dark'); }
};

/* ===== MARKET UI ===== */
const MarketUI = {
    init() { this.render(); this.renderTopMovers(); },
    render() {
        const body = document.getElementById('stockTableBody');
        if (!body) return;
        const ex = document.getElementById('exchangeFilter').value;
        const sec = document.getElementById('sectorFilter').value;
        const q = document.getElementById('stockSearch').value.toLowerCase();
        let stocks = Object.values(Market.stocks);
        if (ex !== 'all') stocks = stocks.filter(s => s.ex === ex);
        if (sec !== 'all') stocks = stocks.filter(s => s.sec === sec);
        if (q) stocks = stocks.filter(s => s.sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
        body.innerHTML = stocks.map(s => {
            const cls = s.change >= 0 ? 'pnl-pos' : 'pnl-neg';
            const arrow = s.change >= 0 ? '▲' : '▼';
            const selected = TradeUI.currentSym === s.sym ? 'stock-row-selected' : '';
            return `<tr class="${selected}" onclick="TradeUI.selectStock('${s.sym}')">
        <td><strong>${s.sym}</strong><br><small style="color:var(--text-muted)">${s.name}</small></td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:600">₹${s.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td class="${cls}" style="font-family:'JetBrains Mono',monospace">${arrow} ${Math.abs(s.change).toFixed(2)}</td>
        <td class="${cls}" style="font-family:'JetBrains Mono',monospace">${s.changePct >= 0 ? '+' : ''}${s.changePct.toFixed(2)}%</td>
        <td style="font-family:'JetBrains Mono',monospace">${(s.volume / 1000000).toFixed(2)}M</td>
      </tr>`;
        }).join('');
    },
    renderTopMovers() {
        const moversEl = document.getElementById('topMovers');
        if (!moversEl) return;
        const stocks = Object.values(Market.stocks);
        const sorted = [...stocks].sort((a, b) => b.changePct - a.changePct);
        const gainers = sorted.slice(0, 3);
        const losers = sorted.slice(-3).reverse();
        moversEl.innerHTML =
            `<div class="movers-section"><div class="movers-label">🔺 Top Gainers</div><div class="movers-cards">${gainers.map(s =>
                `<div class="mover-card mover-gain glass-card" onclick="TradeUI.selectStock('${s.sym}')">
                <span class="mover-sym">${s.sym}</span>
                <span class="mover-price">₹${s.ltp.toFixed(2)}</span>
                <span class="mover-chg pnl-pos">+${s.changePct.toFixed(2)}%</span>
            </div>`).join('')}</div></div>` +
            `<div class="movers-section"><div class="movers-label">🔻 Top Losers</div><div class="movers-cards">${losers.map(s =>
                `<div class="mover-card mover-loss glass-card" onclick="TradeUI.selectStock('${s.sym}')">
                <span class="mover-sym">${s.sym}</span>
                <span class="mover-price">₹${s.ltp.toFixed(2)}</span>
                <span class="mover-chg pnl-neg">${s.changePct.toFixed(2)}%</span>
            </div>`).join('')}</div></div>`;
    },
    refresh() {
        this.render();
        this.renderTopMovers();
        // Update indices
        const ni = Market.indices.nifty;
        document.getElementById('niftyVal').textContent = ni.val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const nChg = ((ni.val - ni.prev) / ni.prev * 100);
        const nEl = document.getElementById('niftyChg');
        nEl.textContent = (nChg >= 0 ? '+' : '') + nChg.toFixed(2) + '%';
        nEl.className = 'idx-chg ' + (nChg >= 0 ? 'pnl-pos' : 'pnl-neg');

        const si = Market.indices.sensex;
        document.getElementById('sensexVal').textContent = si.val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const sChg = ((si.val - si.prev) / si.prev * 100);
        const sEl = document.getElementById('sensexChg');
        sEl.textContent = (sChg >= 0 ? '+' : '') + sChg.toFixed(2) + '%';
        sEl.className = 'idx-chg ' + (sChg >= 0 ? 'pnl-pos' : 'pnl-neg');

        const bi = Market.indices.banknifty;
        document.getElementById('bniftyVal').textContent = bi.val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const bChg = ((bi.val - bi.prev) / bi.prev * 100);
        const bEl = document.getElementById('bniftyChg');
        bEl.textContent = (bChg >= 0 ? '+' : '') + bChg.toFixed(2) + '%';
        bEl.className = 'idx-chg ' + (bChg >= 0 ? 'pnl-pos' : 'pnl-neg');

        // Update detail panel if a stock is selected
        if (TradeUI.currentSym) TradeUI._refreshDetailPanel();
    },
    filterExchange() { this.render(); },
    filterSector() { this.render(); },
    search() { this.render(); }
};

/* ===== TRADE UI (Inline Detail Panel) ===== */
const TradeUI = {
    currentSym: null, side: 'BUY', mode: 'INTRADAY', orderType: 'MARKET', chartType: 'line',
    selectStock(sym) {
        this.currentSym = sym;
        const s = Market.stocks[sym];
        document.getElementById('detailPlaceholder').style.display = 'none';
        document.getElementById('detailContent').style.display = 'block';
        document.getElementById('detailSymbol').textContent = sym;
        document.getElementById('detailName').textContent = s.name;
        document.getElementById('detailExchange').textContent = s.ex;
        document.getElementById('tradeQty').value = 1;
        document.getElementById('tradePrice').value = s.ltp.toFixed(2);
        this.setSide('BUY');
        this._refreshDetailPanel();
        this.drawLineChart(sym);
        this.drawCandleChart(sym);
        this.updateSummary();
        // Re-render market list to show selection
        MarketUI.render();
    },
    // Backwards compat: openModal now redirects to selectStock
    openModal(sym) { this.selectStock(sym); },
    closeModal() { /* no-op for inline */ },
    _refreshDetailPanel() {
        const s = Market.stocks[this.currentSym]; if (!s) return;
        const ltpEl = document.getElementById('detailLtp');
        ltpEl.textContent = '₹' + s.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const chgEl = document.getElementById('detailChange');
        const sign = s.change >= 0 ? '+' : '';
        chgEl.textContent = sign + s.change.toFixed(2) + ' (' + sign + s.changePct.toFixed(2) + '%)';
        chgEl.className = 'detail-change ' + (s.change >= 0 ? 'pnl-pos' : 'pnl-neg');
        ltpEl.className = 'detail-ltp ' + (s.change >= 0 ? 'pnl-pos' : 'pnl-neg');
        document.getElementById('detailOpen').textContent = '₹' + s.open.toFixed(2);
        document.getElementById('detailHigh').textContent = '₹' + s.high.toFixed(2);
        document.getElementById('detailLow').textContent = '₹' + s.low.toFixed(2);
        document.getElementById('detailVol').textContent = (s.volume / 1000000).toFixed(2) + 'M';
        document.getElementById('detailBid').textContent = '₹' + s.bid.toFixed(2);
        document.getElementById('detailAsk').textContent = '₹' + s.ask.toFixed(2);
        this.drawLineChart(this.currentSym);
        this.drawCandleChart(this.currentSym);
        this.updateSummary();
    },
    setChartType(type) {
        this.chartType = type;
        document.querySelectorAll('.dct').forEach(b => b.classList.remove('active'));
        document.querySelector(`.dct:${type === 'line' ? 'first-child' : 'last-child'}`).classList.add('active');
        document.getElementById('detailLineChart').style.display = type === 'line' ? 'block' : 'none';
        document.getElementById('detailCandleChart').style.display = type === 'candle' ? 'block' : 'none';
    },
    setSide(side) {
        this.side = side;
        document.querySelectorAll('.tt').forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.tt[data-side="${side}"]`).forEach(b => b.classList.add('active'));
        const btn = document.getElementById('tradeExecBtn');
        btn.textContent = side; btn.className = 'btn-trade ' + (side === 'BUY' ? 'btn-buy' : 'btn-sell');
        this.updateSummary();
    },
    setMode(m) { this.mode = m; this.updateSummary(); },
    setOrderType(t) {
        this.orderType = t;
        document.getElementById('limitRow').style.display = t === 'LIMIT' ? 'flex' : 'none';
        this.updateSummary();
    },
    updateSummary() {
        const s = Market.stocks[this.currentSym]; if (!s) return;
        const qty = parseInt(document.getElementById('tradeQty').value) || 1;
        const price = this.orderType === 'LIMIT' ? parseFloat(document.getElementById('tradePrice').value) || s.ltp : s.ltp;
        const leverage = this.mode === 'INTRADAY' ? 5 : 1;
        const val = price * qty;
        document.getElementById('tradeEstValue').textContent = '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        document.getElementById('tradeMargin').textContent = '₹' + (val / leverage).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    },
    execute() {
        if (!this.currentSym) { Toast.show('Select a stock first', 'error'); return; }
        const qty = document.getElementById('tradeQty').value;
        const limitPrice = document.getElementById('tradePrice').value;
        const result = Trading.placeOrder(this.currentSym, this.side, qty, this.mode, this.orderType, limitPrice);
        if (result.ok) {
            Toast.show(`${this.side} ${qty} ${this.currentSym} @ ₹${result.order.price.toFixed(2)}`, 'success');
        } else {
            Toast.show(result.msg, 'error');
        }
    },
    drawLineChart(sym) {
        const canvas = document.getElementById('detailLineChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const s = Market.stocks[sym];
        const data = s.dayHistory.length > 2 ? s.dayHistory : [s.open, s.ltp];
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const pad = { l: 55, r: 10, t: 10, b: 25 };
        const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
        const min = Math.min(...data) * 0.999;
        const max = Math.max(...data) * 1.001;
        const range = max - min || 1;
        // Grid + Y labels
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + ch * i / 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
            ctx.fillText('₹' + (max - (max - min) * i / 4).toFixed(0), 2, y + 4);
        }
        // Line
        const up = data[data.length - 1] >= data[0];
        const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
        grad.addColorStop(0, up ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.l + i / (data.length - 1) * cw;
            const y = pad.t + ch - (v - min) / range * ch;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = up ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Fill
        const lastX = pad.l + cw;
        ctx.lineTo(lastX, h - pad.b);
        ctx.lineTo(pad.l, h - pad.b);
        ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
        // Current price line
        const curY = pad.t + ch - (s.ltp - min) / range * ch;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = up ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, curY); ctx.lineTo(w - pad.r, curY); ctx.stroke();
        ctx.setLineDash([]);
    },
    drawCandleChart(sym) {
        const canvas = document.getElementById('detailCandleChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const s = Market.stocks[sym];
        const candles = s.candles || [];
        if (candles.length < 2) return;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const pad = { l: 55, r: 10, t: 10, b: 25 };
        const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
        const allPrices = candles.flatMap(c => [c.h, c.l]);
        const min = Math.min(...allPrices) * 0.999;
        const max = Math.max(...allPrices) * 1.001;
        const range = max - min || 1;
        // Grid + Y labels
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + ch * i / 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
            ctx.fillText('₹' + (max - (max - min) * i / 4).toFixed(0), 2, y + 4);
        }
        // Candles
        const candleW = Math.max(3, cw / candles.length * 0.7);
        const gap = cw / candles.length;
        candles.forEach((c, i) => {
            const x = pad.l + i * gap + gap / 2;
            const up = c.c >= c.o;
            const color = up ? '#10b981' : '#ef4444';
            // Wick
            const highY = pad.t + ch - (c.h - min) / range * ch;
            const lowY = pad.t + ch - (c.l - min) / range * ch;
            ctx.strokeStyle = color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
            // Body
            const openY = pad.t + ch - (c.o - min) / range * ch;
            const closeY = pad.t + ch - (c.c - min) / range * ch;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(1, Math.abs(closeY - openY));
            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyHeight);
        });
    }
};

/* ===== PORTFOLIO UI ===== */
const PortfolioUI = {
    init() { this.refresh(); },
    refresh() {
        const d = State.data; if (!d) return;
        let invested = 0, current = 0, dayPnl = 0;
        // Holdings
        const hBody = document.getElementById('holdingsBody');
        if (hBody) {
            hBody.innerHTML = d.holdings.map(h => {
                const s = Market.stocks[h.sym]; if (!s) return '';
                const val = s.ltp * h.qty; const inv = h.avg * h.qty;
                const pnl = val - inv; invested += inv; current += val;
                dayPnl += (s.ltp - s.open) * h.qty;
                const cls = pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
                return `<tr><td>${h.sym}</td><td>${h.qty}</td><td>₹${h.avg.toFixed(2)}</td><td>₹${s.ltp.toFixed(2)}</td>
        <td class="${cls}">₹${pnl.toFixed(2)}</td>
        <td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${h.sym}';TradeUI.side='SELL';TradeUI.mode='CNC';TradeUI.selectStock('${h.sym}');UI.showTab('market')">Sell</button></td></tr>`;
            }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No holdings</td></tr>';
        }
        // Positions
        const pBody = document.getElementById('positionsBody');
        if (pBody) {
            pBody.innerHTML = d.positions.map(p => {
                const s = Market.stocks[p.sym]; if (!s) return '';
                const val = s.ltp * p.qty; const inv = p.avg * p.qty;
                const pnl = val - inv; invested += inv; current += val;
                const cls = pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
                return `<tr><td>${p.sym}</td><td>${p.qty}</td><td>₹${p.avg.toFixed(2)}</td><td>₹${s.ltp.toFixed(2)}</td>
        <td class="${cls}">₹${pnl.toFixed(2)}</td>
        <td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${p.sym}';TradeUI.side='SELL';TradeUI.mode='INTRADAY';TradeUI.selectStock('${p.sym}');UI.showTab('market')">Exit</button></td></tr>`;
            }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No positions</td></tr>';
        }
        const totalPnl = current - invested;
        const pEl = document.getElementById('pfInvested'); if (pEl) pEl.textContent = '₹' + invested.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        const cEl = document.getElementById('pfCurrent'); if (cEl) cEl.textContent = '₹' + current.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        const pnlEl = document.getElementById('pfPnl'); if (pnlEl) { pnlEl.textContent = (totalPnl >= 0 ? '+' : '') + '₹' + totalPnl.toFixed(0); pnlEl.className = 'pnl-val ' + (totalPnl >= 0 ? 'pnl-pos' : 'pnl-neg'); }
        const dpEl = document.getElementById('pfDayPnl'); if (dpEl) { dpEl.textContent = (dayPnl >= 0 ? '+' : '') + '₹' + dayPnl.toFixed(0); dpEl.className = 'pnl-val ' + (dayPnl >= 0 ? 'pnl-pos' : 'pnl-neg'); }
        this.drawPieChart(d);
        this.drawPortfolioChart(d);
        this.drawCandlestickPnL(d);
        this.drawAllocationBars(d);
    },
    drawPieChart(d) {
        const canvas = document.getElementById('pieChart'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const legend = document.getElementById('pieLegend'); if (!legend) return;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const sectors = {};
        d.holdings.forEach(h => {
            const s = Market.stocks[h.sym]; if (!s) return;
            const val = s.ltp * h.qty;
            sectors[s.sec] = (sectors[s.sec] || 0) + val;
        });
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];
        const entries = Object.entries(sectors);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 15, r = R * 0.55;
        if (entries.length === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '13px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('No holdings yet', cx, cy);
            legend.innerHTML = ''; return;
        }
        const total = entries.reduce((s, e) => s + e[1], 0);
        let angle = -Math.PI / 2;
        legend.innerHTML = '';
        entries.forEach(([sec, val], i) => {
            const pct = val / total;
            const sweep = pct * Math.PI * 2;
            const color = colors[i % colors.length];
            // Draw arc
            ctx.beginPath();
            ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            ctx.arc(cx, cy, R, angle, angle + sweep);
            ctx.arc(cx, cy, r, angle + sweep, angle, true);
            ctx.closePath();
            ctx.fillStyle = color; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
            // Stroke
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();
            angle += sweep;
            legend.innerHTML += `<div class="pie-legend-item"><span class="dot" style="background:${color}"></span>${sec} ${(pct * 100).toFixed(0)}%</div>`;
        });
        // Center text
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'bold 16px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText('₹' + (total / 1000).toFixed(1) + 'K', cx, cy - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter, sans-serif';
        ctx.fillText('Total Value', cx, cy + 14);
    },
    drawPortfolioChart(d) {
        const canvas = document.getElementById('portfolioChart'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = d.portfolioHistory.map(p => p.v);
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        if (data.length < 2) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '13px Inter'; ctx.textAlign = 'center';
            ctx.fillText('Make trades to see portfolio trend', w / 2, h / 2); return;
        }
        const pad = { l: 60, r: 10, t: 15, b: 30 };
        const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
        const min = Math.min(...data) * 0.98;
        const max = Math.max(...data) * 1.02;
        const range = max - min || 1;
        // Grid + labels
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + ch * i / 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
            ctx.fillText('₹' + ((max - (max - min) * i / 4) / 1000).toFixed(1) + 'K', 2, y + 4);
        }
        // Time labels
        const timestamps = d.portfolioHistory.map(p => p.t);
        const labelCount = Math.min(5, data.length);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'center';
        for (let i = 0; i < labelCount; i++) {
            const idx = Math.floor(i / (labelCount - 1) * (timestamps.length - 1));
            const x = pad.l + idx / (data.length - 1) * cw;
            const dt = new Date(timestamps[idx]);
            ctx.fillText(dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), x, h - 5);
        }
        // Line
        const up = data[data.length - 1] >= data[0];
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.l + i / (data.length - 1) * cw;
            const y = pad.t + ch - (v - min) / range * ch;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = up ? '#10b981' : '#ef4444'; ctx.lineWidth = 2.5; ctx.stroke();
        // Gradient fill
        const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
        grad.addColorStop(0, up ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.lineTo(pad.l + cw, h - pad.b); ctx.lineTo(pad.l, h - pad.b); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
        // End dot
        const lastY = pad.t + ch - (data[data.length - 1] - min) / range * ch;
        ctx.beginPath(); ctx.arc(pad.l + cw, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = up ? '#10b981' : '#ef4444'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    },
    drawCandlestickPnL(d) {
        const canvas = document.getElementById('pnlCandleChart'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        // Generate daily P&L candle-like data from portfolio history
        const hist = d.portfolioHistory;
        if (hist.length < 3) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '13px Inter'; ctx.textAlign = 'center';
            ctx.fillText('Trade to see P&L candles', w / 2, h / 2); return;
        }
        // Group into segments (simulate daily candles)
        const segSize = Math.max(2, Math.floor(hist.length / 20));
        const candles = [];
        for (let i = 0; i < hist.length; i += segSize) {
            const seg = hist.slice(i, i + segSize);
            const vals = seg.map(s => s.v);
            candles.push({
                o: vals[0], h: Math.max(...vals), l: Math.min(...vals), c: vals[vals.length - 1],
                t: seg[0].t
            });
        }
        if (candles.length < 2) return;
        const pad = { l: 60, r: 10, t: 15, b: 30 };
        const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
        const allVals = candles.flatMap(c => [c.h, c.l]);
        const min = Math.min(...allVals) * 0.98;
        const max = Math.max(...allVals) * 1.02;
        const range = max - min || 1;
        // Grid
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + ch * i / 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
            ctx.fillText('₹' + ((max - (max - min) * i / 4) / 1000).toFixed(1) + 'K', 2, y + 4);
        }
        // Candles
        const candleW = Math.max(4, cw / candles.length * 0.6);
        const gap = cw / candles.length;
        candles.forEach((c, i) => {
            const x = pad.l + i * gap + gap / 2;
            const up = c.c >= c.o;
            const color = up ? '#10b981' : '#ef4444';
            const highY = pad.t + ch - (c.h - min) / range * ch;
            const lowY = pad.t + ch - (c.l - min) / range * ch;
            ctx.strokeStyle = color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
            const openY = pad.t + ch - (c.o - min) / range * ch;
            const closeY = pad.t + ch - (c.c - min) / range * ch;
            const bodyTop = Math.min(openY, closeY);
            const bodyH = Math.max(2, Math.abs(closeY - openY));
            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
        });
    },
    drawAllocationBars(d) {
        const canvas = document.getElementById('allocationChart'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const holdings = d.holdings.map(hd => {
            const s = Market.stocks[hd.sym];
            return s ? { sym: hd.sym, value: s.ltp * hd.qty, pnl: (s.ltp - hd.avg) * hd.qty } : null;
        }).filter(Boolean).sort((a, b) => b.value - a.value);
        if (holdings.length === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '13px Inter'; ctx.textAlign = 'center';
            ctx.fillText('No holdings to display', w / 2, h / 2); return;
        }
        const total = holdings.reduce((s, h) => s + h.value, 0);
        const pad = { l: 90, r: 20, t: 15, b: 10 };
        const cw = w - pad.l - pad.r;
        const barH = Math.min(28, (h - pad.t - pad.b) / holdings.length - 6);
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];
        holdings.slice(0, 8).forEach((hd, i) => {
            const pct = hd.value / total;
            const y = pad.t + i * (barH + 6);
            const bw = pct * cw;
            // Label
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(hd.sym, pad.l - 8, y + barH / 2 + 4);
            // Bar background
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(pad.l, y, cw, barH);
            // Bar
            const color = colors[i % colors.length];
            const barGrad = ctx.createLinearGradient(pad.l, 0, pad.l + bw, 0);
            barGrad.addColorStop(0, color);
            barGrad.addColorStop(1, color + '88');
            ctx.fillStyle = barGrad;
            ctx.beginPath();
            ctx.roundRect(pad.l, y, bw, barH, 4);
            ctx.fill();
            // Percentage text
            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px JetBrains Mono'; ctx.textAlign = 'left';
            if (bw > 40) {
                ctx.fillText((pct * 100).toFixed(0) + '%', pad.l + bw - 32, y + barH / 2 + 4);
            } else {
                ctx.fillText((pct * 100).toFixed(0) + '%', pad.l + bw + 6, y + barH / 2 + 4);
            }
        });
    }
};

/* ===== ORDER UI ===== */
const OrderUI = {
    currentSub: 'open',
    showSub(sub) {
        this.currentSub = sub;
        document.querySelectorAll('.ot').forEach(b => b.classList.remove('active'));
        document.querySelector(`.ot:nth-child(${sub === 'open' ? 1 : sub === 'executed' ? 2 : 3})`).classList.add('active');
        this.refresh();
    },
    refresh() {
        const orders = State.get('orders') || [];
        let filtered = orders;
        if (this.currentSub === 'open') filtered = orders.filter(o => o.status === 'OPEN');
        if (this.currentSub === 'executed') filtered = orders.filter(o => o.status === 'EXECUTED');
        const body = document.getElementById('ordersBody');
        if (!body) return;
        body.innerHTML = filtered.slice(0, 50).map(o => {
            const sCls = o.status === 'OPEN' ? 'status-open' : o.status === 'EXECUTED' ? 'status-executed' : 'status-cancelled';
            return `<tr>
        <td>${o.time}<br><small>${o.date}</small></td>
        <td><strong>${o.sym}</strong></td>
        <td class="${o.side === 'BUY' ? 'pnl-pos' : 'pnl-neg'}">${o.side}</td>
        <td>${o.mode}</td><td>${o.type}</td><td>${o.qty}</td>
        <td style="font-family:'JetBrains Mono',monospace">₹${o.price.toFixed(2)}</td>
        <td><span class="status-badge ${sCls}">${o.status}${o.auto ? ' (Auto)' : ''}</span></td>
      </tr>`;
        }).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px">No orders</td></tr>';
    }
};

/* ===== F&O UI ===== */
const FnOUI = {
    type: 'FUT',
    init() { this.loadChain(); },
    setType(t) {
        this.type = t;
        document.querySelectorAll('.fno-type-btns button').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('fnoFutPanel').style.display = t === 'FUT' ? 'block' : 'none';
        document.getElementById('fnoOptPanel').style.display = t === 'OPT' ? 'block' : 'none';
        this.loadChain();
    },
    loadChain() {
        const underlying = document.getElementById('fnoUnderlying').value;
        const expiry = document.getElementById('fnoExpiry').value;
        if (this.type === 'FUT') {
            const data = FnO.getChain(underlying, expiry, 'FUT');
            document.getElementById('futBody').innerHTML = data.map(f => {
                const cls = f.change >= 0 ? 'pnl-pos' : 'pnl-neg';
                return `<tr><td><strong>${f.name}</strong></td><td>${f.lot}</td>
        <td style="font-family:'JetBrains Mono',monospace">₹${f.ltp.toFixed(2)}</td>
        <td class="${cls}">${f.change >= 0 ? '+' : ''}${f.change.toFixed(2)}</td>
        <td>${(f.oi / 1000).toFixed(0)}K</td>
        <td><button class="btn-sm btn-buy" onclick="FnOUI.trade('${f.name}','${underlying}','${expiry}',${f.lot},${f.ltp},'FUT')">Buy</button></td></tr>`;
            }).join('');
        } else {
            const data = FnO.getChain(underlying, expiry, 'OPT');
            document.getElementById('optBody').innerHTML = data.map(s => {
                return `<tr>
          <td style="font-family:'JetBrains Mono',monospace">₹${s.call.ltp.toFixed(2)}</td>
          <td>${s.call.delta}</td><td>${(s.call.oi / 1000).toFixed(0)}K</td>
          <td class="strike-col" style="font-family:'JetBrains Mono',monospace;font-weight:700">${s.strike}</td>
          <td>${(s.put.oi / 1000).toFixed(0)}K</td><td>${s.put.delta}</td>
          <td style="font-family:'JetBrains Mono',monospace">₹${s.put.ltp.toFixed(2)}</td>
          <td>
            <button class="btn-sm btn-buy" style="margin:1px" onclick="FnOUI.trade('${s.call.name}','${underlying}','${expiry}',${s.lot},${s.call.ltp},'CE')">C</button>
            <button class="btn-sm btn-sell" style="margin:1px" onclick="FnOUI.trade('${s.put.name}','${underlying}','${expiry}',${s.lot},${s.put.ltp},'PE')">P</button>
          </td></tr>`;
            }).join('');
        }
        this.refreshPositions();
    },
    trade(name, underlying, expiry, lot, ltp, optType) {
        const contract = { name, underlying, expiry, lot, optType, strike: null };
        const result = Trading.placeFnOOrder(contract, optType === 'FUT' ? 'FUT' : 'OPT', 'BUY', 1, ltp);
        if (result.ok) Toast.show('F&O order placed: ' + name, 'success');
        else Toast.show(result.msg, 'error');
        this.refreshPositions();
    },
    refreshPositions() {
        const body = document.getElementById('fnoPositionsBody');
        if (!body) return;
        const positions = State.get('fnoPositions') || [];
        body.innerHTML = positions.map((p, i) => {
            return `<tr>
        <td>${p.contract}</td><td>${p.type || 'FUT'}</td><td>${p.lots}</td>
        <td>₹${p.avg.toFixed(2)}</td><td>₹${(p.avg * 1.01).toFixed(2)}</td>
        <td class="pnl-pos">₹${(p.avg * 0.01 * p.lots * p.lotSize).toFixed(0)}</td>
        <td><button class="btn-sm btn-sell" onclick="FnOUI.exitPosition(${i})">Exit</button></td></tr>`;
        }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px">No F&O positions</td></tr>';
    },
    exitPosition(idx) {
        const d = State.data;
        const pos = d.fnoPositions[idx];
        if (!pos) return;
        const exitPrice = pos.avg * (1 + (Math.random() - 0.45) * 0.02);
        const pnl = (exitPrice - pos.avg) * pos.lots * pos.lotSize;
        State.update(d => { d.capital += pos.margin + pnl; d.fnoPositions.splice(idx, 1); d.totalTrades++; });
        Toast.show(`F&O position exited. P&L: ₹${pnl.toFixed(0)}`, 'success');
        this.refreshPositions();
    }
};

/* ===== PREDICT UI ===== */
const PredictUI = {
    init() {
        const sel = document.getElementById('predStock');
        if (!sel) return;
        sel.innerHTML = '<option value="">Select Stock</option>' +
            Object.keys(Market.stocks).slice(0, 30).map(s => `<option value="${s}">${s}</option>`).join('');
        this.refresh();
    },
    refresh() {
        const d = State.data; if (!d) return;
        const preds = d.predictions || [];
        const correct = preds.filter(p => p.status === 'CORRECT').length;
        const total = preds.filter(p => p.status !== 'PENDING').length;
        document.getElementById('predTotal').textContent = total;
        document.getElementById('predCorrect').textContent = correct;
        document.getElementById('predAccuracy').textContent = total ? (correct / total * 100).toFixed(0) + '%' : '0%';
        document.getElementById('predStreak').textContent = '🔥 ' + d.currentStreak;
        const hist = document.getElementById('predHistory'); if (!hist) return;
        hist.innerHTML = preds.slice(0, 20).map(p => {
            const icon = p.status === 'CORRECT' ? '✅' : p.status === 'WRONG' ? '❌' : '⏳';
            const dir = p.direction === 'UP' ? '📈' : '📉';
            return `<div class="pred-item"><span>${p.sym} ${dir} ${p.direction}</span><span>₹${p.priceAt.toFixed(2)}</span><span>${icon} ${p.status}</span></div>`;
        }).join('') || '<p style="color:var(--text-muted);text-align:center">No predictions yet</p>';
    }
};
const Predict = {
    submit(dir) {
        const sym = document.getElementById('predStock').value;
        if (!sym) { Toast.show('Select a stock first', 'error'); return; }
        const result = PredictionEngine.submit(sym, dir);
        if (result.ok) { Toast.show(`Predicted ${sym} will go ${dir}`, 'success'); PredictUI.refresh(); }
        else Toast.show(result.msg, 'error');
    }
};

/* ===== QUIZ ===== */
const Quiz = {
    questions: [], current: 0, score: 0, answered: false,
    start() {
        const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
        this.questions = shuffled; this.current = 0; this.score = 0;
        document.getElementById('quizStart').style.display = 'none';
        document.getElementById('quizResult').style.display = 'none';
        document.getElementById('quizActive').style.display = 'block';
        this.showQuestion();
    },
    showQuestion() {
        this.answered = false;
        const q = this.questions[this.current];
        document.getElementById('quizQNum').textContent = (this.current + 1) + '/' + this.questions.length;
        document.getElementById('quizFill').style.width = ((this.current) / this.questions.length * 100) + '%';
        document.getElementById('quizQ').textContent = q.q;
        const opts = document.getElementById('quizOpts');
        opts.innerHTML = q.o.map((o, i) => `<button class="quiz-opt" onclick="Quiz.answer(${i})">${o}</button>`).join('');
    },
    answer(idx) {
        if (this.answered) return;
        this.answered = true;
        const q = this.questions[this.current];
        const btns = document.querySelectorAll('.quiz-opt');
        btns[q.a].classList.add('correct');
        if (idx === q.a) { this.score++; } else { btns[idx].classList.add('wrong'); }
        setTimeout(() => {
            this.current++;
            if (this.current < this.questions.length) { this.showQuestion(); }
            else { this.finish(); }
        }, 1200);
    },
    finish() {
        const xpEarned = this.score * 50;
        State.update(d => {
            d.xp += xpEarned;
            if (this.score === 10) d.perfectQuiz = true;
            Trading._checkLevelUp(d);
        });
        document.getElementById('quizActive').style.display = 'none';
        document.getElementById('quizResult').style.display = 'block';
        document.getElementById('quizScore').textContent = this.score;
        document.getElementById('quizXpEarned').textContent = '+' + xpEarned + ' XP';
        Toast.show(`Quiz done! +${xpEarned} XP`, 'success');
    }
};

/* ===== PROFILE UI ===== */
const ProfileUI = {
    init() { this.refresh(); },
    refresh() {
        const d = State.data; if (!d) return;
        const user = d.user || {};
        document.getElementById('profileName').textContent = user.name || 'Trader';
        document.getElementById('profilePhone').textContent = user.phone ? '+91 ' + user.phone.slice(0, 2) + '••••' + user.phone.slice(6) : '';
        document.getElementById('profileLevel').textContent = 'Level ' + d.level;
        const xpNeeded = d.level * 100;
        document.getElementById('profileXpFill').style.width = (d.xp / xpNeeded * 100) + '%';
        document.getElementById('profileXpText').textContent = d.xp + ' / ' + xpNeeded + ' XP';
        document.getElementById('statCapital').textContent = '₹' + d.capital.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        document.getElementById('statTrades').textContent = d.totalTrades;
        const preds = (d.predictions || []).filter(p => p.status !== 'PENDING');
        const correct = preds.filter(p => p.status === 'CORRECT').length;
        document.getElementById('statPredAcc').textContent = preds.length ? (correct / preds.length * 100).toFixed(0) + '%' : '0%';
        document.getElementById('statXp').textContent = d.xp;
        // Achievements
        const grid = document.getElementById('badgeGrid'); if (!grid) return;
        const stats = {
            totalTrades: d.totalTrades, profitableTrades: d.profitableTrades, perfectQuiz: d.perfectQuiz,
            correctPredictions: d.correctPredictions, maxStreak: d.maxStreak, level: d.level,
            uniqueHoldings: new Set(d.holdings.map(h => h.sym)).size,
            totalValue: Trading._calcTotalValue(d)
        };
        grid.innerHTML = ACHIEVEMENTS.map(a => {
            const earned = a.check(stats);
            if (earned && !d.achievements.includes(a.id)) { State.update(dd => dd.achievements.push(a.id)); }
            return `<div class="badge-item ${earned ? 'earned' : 'locked'}">
        <div class="badge-icon">${a.icon}</div>
        <div class="badge-name">${a.name}</div>
      </div>`;
        }).join('');
    }
};

/* ===== SETTINGS ===== */
const Settings = {
    toggleRefresh() { const v = document.getElementById('autoRefresh').checked; State.set('autoRefresh', v); if (v) Market.start(); else Market.stop(); },
    toggleSound() { State.set('sound', document.getElementById('soundFx').checked); },
    exportData() {
        const blob = new Blob([JSON.stringify(State.data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'paperbull_backup.json'; a.click();
        Toast.show('Data exported', 'success');
    },
    importData(e) {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                State.data = { ...State.defaults(), ...data }; State.save();
                Toast.show('Data imported! Refreshing...', 'success');
                setTimeout(() => location.reload(), 1000);
            } catch (err) { Toast.show('Invalid file', 'error'); }
        };
        reader.readAsText(file);
    },
    resetAll() {
        if (confirm('Delete all data? This cannot be undone.')) {
            localStorage.removeItem(State._key());
            location.reload();
        }
    }
};

/* ===== CLOUD SYNC (jsonblob.com) ===== */
const CloudSync = {
    baseUrl: 'https://jsonblob.com/api/jsonBlob',
    syncTimeout: null,
    async createBlob(data) {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const loc = res.headers.get('Location');
            return loc ? loc.split('/').pop() : null;
        } catch (e) { console.warn('Cloud create failed:', e); return null; }
    },
    async getBlob(id) {
        try {
            const res = await fetch(this.baseUrl + '/' + id);
            if (res.ok) return await res.json();
        } catch (e) { console.warn('Cloud fetch failed:', e); }
        return null;
    },
    async updateBlob(id, data) {
        try {
            await fetch(this.baseUrl + '/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) { console.warn('Cloud update failed:', e); }
    },
    async syncUp() {
        const syncId = State.get('cloudSyncId');
        if (!syncId) return;
        this._setStatus('syncing', '☁️ Syncing...');
        await this.updateBlob(syncId, State.data);
        this._setStatus('synced', '✅ Synced just now');
    },
    async initSync() {
        const existing = State.get('cloudSyncId');
        if (existing) {
            this._setStatus('syncing', '☁️ Checking cloud...');
            const cloudData = await this.getBlob(existing);
            if (cloudData && cloudData.user) {
                const cloudTime = cloudData.lastModified || 0;
                const localTime = State.get('lastModified') || 0;
                if (cloudTime > localTime) {
                    // Cloud has newer data — pull it down
                    State.data = { ...State.defaults(), ...cloudData, cloudSyncId: existing };
                    // Save locally without triggering another cloud sync
                    State.data.lastModified = cloudTime;
                    try { localStorage.setItem(State._key(), JSON.stringify(State.data)); } catch (e) { }
                    Toast.show('Data synced from cloud ☁️', 'success');
                } else if (localTime > cloudTime) {
                    // Local is newer — push to cloud
                    await this.updateBlob(existing, State.data);
                }
            }
            this._setStatus('synced', '✅ Connected');
        } else {
            const id = await this.createBlob(State.data);
            if (id) {
                State.set('cloudSyncId', id);
                Toast.show('Cloud sync enabled', 'success');
            }
        }
        this._updateUI();
    },
    async fetchByCode(code) {
        return await this.getBlob(code);
    },
    async forceSync() {
        Toast.show('Syncing...', 'info');
        await this.syncUp();
        Toast.show('Sync complete', 'success');
    },
    copyCode() {
        const code = State.get('cloudSyncId');
        if (code) {
            navigator.clipboard.writeText(code).then(() => Toast.show('Sync code copied!', 'success'))
                .catch(() => { Toast.show('Code: ' + code, 'info'); });
        }
    },
    debouncedSync() {
        clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => this.syncUp(), 8000);
    },
    _setStatus(cls, text) {
        const el = document.getElementById('syncStatusText');
        if (el) { el.className = 'sync-status ' + cls; el.textContent = text; }
    },
    _updateUI() {
        const code = State.get('cloudSyncId');
        const el = document.getElementById('syncCodeText');
        if (el) el.textContent = code || 'Not synced';
    }
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => App.init());
document.addEventListener('input', e => {
    if (e.target.id === 'tradeQty' || e.target.id === 'tradePrice') TradeUI.updateSummary();
});
