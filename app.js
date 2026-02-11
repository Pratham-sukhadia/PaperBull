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
            State.set('user', { phone, name: 'Trader_' + phone.slice(-4), joined: Date.now() });
            Toast.show('Welcome to PaperBull! 🎉', 'success');
            CloudSync.initSync().then(() => {
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
    init() { this.render(); },
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
            return `<tr onclick="TradeUI.openModal('${s.sym}')">
        <td><strong>${s.sym}</strong><br><small style="color:var(--text-muted)">${s.name}</small></td>
        <td><span style="font-size:0.75rem;padding:2px 6px;border-radius:4px;background:${s.ex === 'NSE' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)'};color:${s.ex === 'NSE' ? 'var(--accent-blue)' : 'var(--accent-purple)'}">${s.ex}</span></td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:600">₹${s.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td class="${cls}" style="font-family:'JetBrains Mono',monospace">${arrow} ${Math.abs(s.change).toFixed(2)}</td>
        <td class="${cls}" style="font-family:'JetBrains Mono',monospace">${s.changePct >= 0 ? '+' : ''}${s.changePct.toFixed(2)}%</td>
        <td style="font-family:'JetBrains Mono',monospace">₹${s.open.toFixed(2)}</td>
        <td style="font-family:'JetBrains Mono',monospace">₹${s.high.toFixed(2)}</td>
        <td style="font-family:'JetBrains Mono',monospace">₹${s.low.toFixed(2)}</td>
        <td style="font-family:'JetBrains Mono',monospace">${(s.volume / 1000000).toFixed(2)}M</td>
        <td><button class="btn-sm btn-buy" onclick="event.stopPropagation();TradeUI.openModal('${s.sym}')">Trade</button></td>
      </tr>`;
        }).join('');
    },
    refresh() {
        this.render();
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
    },
    filterExchange() { this.render(); },
    filterSector() { this.render(); },
    search() { this.render(); }
};

/* ===== TRADE UI ===== */
const TradeUI = {
    currentSym: null, side: 'BUY', mode: 'INTRADAY', orderType: 'MARKET',
    openModal(sym) {
        this.currentSym = sym;
        const s = Market.stocks[sym];
        document.getElementById('tradeSymbol').textContent = sym;
        document.getElementById('tradeLtp').textContent = '₹' + s.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        document.getElementById('tradeLtp').className = 'trade-ltp ' + (s.change >= 0 ? 'pnl-pos' : 'pnl-neg');
        document.getElementById('tradeQty').value = 1;
        document.getElementById('tradePrice').value = s.ltp.toFixed(2);
        this.setSide('BUY');
        this.drawChart(sym);
        this.updateSummary();
        document.getElementById('tradeModal').classList.add('open');
    },
    closeModal() { document.getElementById('tradeModal').classList.remove('open'); },
    setSide(side) {
        this.side = side;
        document.querySelectorAll('.tt').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tt[data-side="${side}"]`).classList.add('active');
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
        const qty = document.getElementById('tradeQty').value;
        const limitPrice = document.getElementById('tradePrice').value;
        const result = Trading.placeOrder(this.currentSym, this.side, qty, this.mode, this.orderType, limitPrice);
        if (result.ok) {
            Toast.show(`${this.side} ${qty} ${this.currentSym} @ ₹${result.order.price.toFixed(2)}`, 'success');
            this.closeModal();
        } else {
            Toast.show(result.msg, 'error');
        }
    },
    drawChart(sym) {
        const canvas = document.getElementById('tradeChart');
        const ctx = canvas.getContext('2d');
        const s = Market.stocks[sym];
        const data = s.dayHistory.length > 2 ? s.dayHistory : [s.open, s.ltp];
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const min = Math.min(...data) * 0.999;
        const max = Math.max(...data) * 1.001;
        const range = max - min || 1;
        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, h * i / 4); ctx.lineTo(w, h * i / 4); ctx.stroke(); }
        // Line
        const up = data[data.length - 1] >= data[0];
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, up ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        data.forEach((v, i) => { const x = i / (data.length - 1) * w; const y = h - (v - min) / range * h; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = up ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Fill
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
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
        <td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${h.sym}';TradeUI.side='SELL';TradeUI.mode='CNC';TradeUI.openModal('${h.sym}')">Sell</button></td></tr>`;
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
        <td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${p.sym}';TradeUI.side='SELL';TradeUI.mode='INTRADAY';TradeUI.openModal('${p.sym}')">Exit</button></td></tr>`;
            }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No positions</td></tr>';
        }
        const totalPnl = current - invested;
        const pEl = document.getElementById('pfInvested'); if (pEl) pEl.textContent = '₹' + invested.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        const cEl = document.getElementById('pfCurrent'); if (cEl) cEl.textContent = '₹' + current.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        const pnlEl = document.getElementById('pfPnl'); if (pnlEl) { pnlEl.textContent = (totalPnl >= 0 ? '+' : '') + '₹' + totalPnl.toFixed(0); pnlEl.className = 'pnl-val ' + (totalPnl >= 0 ? 'pnl-pos' : 'pnl-neg'); }
        const dpEl = document.getElementById('pfDayPnl'); if (dpEl) { dpEl.textContent = (dayPnl >= 0 ? '+' : '') + '₹' + dayPnl.toFixed(0); dpEl.className = 'pnl-val ' + (dayPnl >= 0 ? 'pnl-pos' : 'pnl-neg'); }
        this.drawPieChart(d);
        this.drawPortfolioChart(d);
    },
    drawPieChart(d) {
        const svg = document.getElementById('pieChart'); if (!svg) return;
        const legend = document.getElementById('pieLegend'); if (!legend) return;
        const sectors = {};
        d.holdings.forEach(h => {
            const s = Market.stocks[h.sym]; if (!s) return;
            const val = s.ltp * h.qty;
            sectors[s.sec] = (sectors[s.sec] || 0) + val;
        });
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];
        const entries = Object.entries(sectors);
        if (entries.length === 0) { svg.innerHTML = '<text x="100" y="105" fill="var(--text-muted)" text-anchor="middle" font-size="12">No holdings</text>'; legend.innerHTML = ''; return; }
        const total = entries.reduce((s, e) => s + e[1], 0);
        let angle = 0; svg.innerHTML = ''; legend.innerHTML = '';
        entries.forEach(([sec, val], i) => {
            const pct = val / total;
            const a1 = angle; const a2 = angle + pct * Math.PI * 2;
            const x1 = 100 + 80 * Math.cos(a1); const y1 = 100 + 80 * Math.sin(a1);
            const x2 = 100 + 80 * Math.cos(a2); const y2 = 100 + 80 * Math.sin(a2);
            const large = pct > 0.5 ? 1 : 0;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M100,100 L${x1},${y1} A80,80 0 ${large},1 ${x2},${y2} Z`);
            path.setAttribute('fill', colors[i % colors.length]);
            path.setAttribute('opacity', '0.85');
            svg.appendChild(path);
            angle = a2;
            legend.innerHTML += `<div class="pie-legend-item"><span class="dot" style="background:${colors[i % colors.length]}"></span>${sec} ${(pct * 100).toFixed(0)}%</div>`;
        });
    },
    drawPortfolioChart(d) {
        const canvas = document.getElementById('portfolioChart'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = d.portfolioHistory.map(p => p.v);
        if (data.length < 2) return;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const min = Math.min(...data) * 0.98;
        const max = Math.max(...data) * 1.02;
        const range = max - min || 1;
        // Grid + labels
        ctx.fillStyle = 'var(--text-muted)'; ctx.font = '10px JetBrains Mono';
        for (let i = 0; i < 5; i++) {
            const y = h * i / 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            ctx.fillText('₹' + (max - (max - min) * i / 4).toFixed(0), 2, y + 12);
        }
        // Line
        const up = data[data.length - 1] >= data[0];
        ctx.beginPath();
        data.forEach((v, i) => { const x = i / (data.length - 1) * w; const y = h - (v - min) / range * h; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = up ? '#10b981' : '#ef4444'; ctx.lineWidth = 2; ctx.stroke();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
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
                if ((cloudData.totalTrades || 0) > (State.get('totalTrades') || 0) ||
                    (cloudData.orders || []).length > (State.get('orders') || []).length) {
                    State.data = { ...State.defaults(), ...cloudData, cloudSyncId: existing };
                    State.save();
                    Toast.show('Data synced from cloud ☁️', 'success');
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
