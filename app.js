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
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const icon = icons[type] || icons.info;
        t.innerHTML = `<div class="toast-bar"></div><div class="toast-body"><span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span></div><div class="toast-progress"><div class="toast-progress-fill"></div></div>`;
        c.appendChild(t);
        setTimeout(() => { t.classList.add('toast-exit'); setTimeout(() => t.remove(), 400); }, 4000);
    }
};

/* ===== AUTH SYSTEM ===== */
const AuthUI = {
    _failedAttempts: {},
    _lockoutTimers: {},

    async _hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    _getUsers() {
        try { return JSON.parse(localStorage.getItem('paperbull_users') || '[]'); }
        catch (e) { return []; }
    },

    _saveUsers(users) {
        localStorage.setItem('paperbull_users', JSON.stringify(users));
    },

    _generateUserId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 12; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
        return id;
    },

    switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => { f.classList.remove('active'); f.classList.remove('auth-fade-in'); });
        const el = document.getElementById('authForm' + tab.charAt(0).toUpperCase() + tab.slice(1));
        if (el) { el.classList.add('active'); el.classList.add('auth-fade-in'); }
        const banner = document.getElementById('authErrorBanner');
        if (banner) banner.style.display = 'none';
        this._clearErrors();
    },

    _clearErrors() {
        document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
        document.querySelectorAll('.auth-input-wrap').forEach(w => w.classList.remove('field-invalid'));
    },

    _showFieldError(fieldId, errorId, msg) {
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = msg;
        const input = document.getElementById(fieldId);
        if (input) {
            const wrap = input.closest('.auth-input-wrap');
            if (wrap) { wrap.classList.add('field-invalid'); wrap.classList.add('shake-field'); setTimeout(() => wrap.classList.remove('shake-field'), 500); }
        }
    },

    _showBanner(msg, type = 'error') {
        const banner = document.getElementById('authErrorBanner');
        if (!banner) return;
        banner.className = 'auth-error-banner banner-' + type;
        banner.innerHTML = msg;
        banner.style.display = 'block';
        banner.classList.add('banner-slide-in');
    },

    toggleEye(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
        const btn = input.parentElement.querySelector('.eye-toggle i');
        if (btn) btn.className = input.type === 'password' ? 'ph ph-eye' : 'ph ph-eye-slash';
    },

    updatePasswordStrength() {
        const pw = document.getElementById('regPassword');
        if (!pw) return;
        const val = pw.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        const labels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981'];
        const fill = document.getElementById('regStrengthFill');
        const label = document.getElementById('regStrengthLabel');
        if (fill) { fill.style.width = (score * 25) + '%'; fill.style.background = colors[score] || '#ef4444'; }
        if (label) { label.textContent = val.length > 0 ? labels[score] : ''; label.style.color = colors[score] || ''; }
    },

    updateConfirmMatch() {
        const pw = document.getElementById('regPassword');
        const confirm = document.getElementById('regConfirm');
        const indicator = document.getElementById('regMatchIndicator');
        if (!pw || !confirm || !indicator) return;
        if (confirm.value.length === 0) { indicator.textContent = ''; return; }
        if (pw.value === confirm.value) { indicator.textContent = '✓'; indicator.className = 'match-indicator match-yes'; }
        else { indicator.textContent = '✕'; indicator.className = 'match-indicator match-no'; }
    },

    async register() {
        this._clearErrors();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        let valid = true;

        if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
            this._showFieldError('regName', 'regNameError', 'Min 3 chars, letters and spaces only'); valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this._showFieldError('regEmail', 'regEmailError', 'Enter a valid email address'); valid = false;
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            this._showFieldError('regPhone', 'regPhoneError', 'Must be exactly 10 digits'); valid = false;
        }
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
            this._showFieldError('regPassword', 'regPasswordError', 'Min 8 chars, 1 uppercase, 1 number, 1 special'); valid = false;
        }
        if (password !== confirm) {
            this._showFieldError('regConfirm', 'regConfirmError', 'Passwords do not match'); valid = false;
        }
        if (!valid) return;

        const users = this._getUsers();
        if (users.find(u => u.email === email)) {
            this._showBanner('⚠️ THIS EMAIL IS ALREADY REGISTERED — PLEASE LOGIN INSTEAD.', 'warning');
            setTimeout(() => this.switchTab('login'), 2000);
            return;
        }

        const userId = this._generateUserId();
        const passwordHash = await this._hashPassword(password);
        const user = { userId, name, email, phone: phone || '', passwordHash, joined: Date.now(), lastLogin: Date.now(), createdAt: new Date().toISOString() };
        users.push(user);
        this._saveUsers(users);

        sessionStorage.setItem('paperbull_session', JSON.stringify({ userId, email }));
        State.load(userId);
        State.set('user', { userId, name, email, phone: phone || '', joined: Date.now() });
        State.logActivity('register', `New user registered: ${name}`);
        CloudRegistry.reportUser({ userId, name, email, phone: phone || '' });
        Market.init();
        WelcomeAnim.play();
    },

    async login() {
        this._clearErrors();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email) { this._showFieldError('loginEmail', 'loginEmailError', 'Enter your email'); return; }
        if (!password) { this._showFieldError('loginPassword', 'loginPasswordError', 'Enter your password'); return; }

        // Check lockout
        if (this._lockoutTimers[email]) {
            return;
        }

        const users = this._getUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            this._showBanner('❌ NO ACCOUNT FOUND WITH THIS EMAIL — PLEASE REGISTER FIRST.');
            this._showFieldError('loginEmail', 'loginEmailError', 'Email not found');
            document.getElementById('authCard').classList.add('shake-card');
            setTimeout(() => document.getElementById('authCard').classList.remove('shake-card'), 500);
            return;
        }

        const hash = await this._hashPassword(password);
        if (hash !== user.passwordHash) {
            if (!this._failedAttempts[email]) this._failedAttempts[email] = 0;
            this._failedAttempts[email]++;

            if (this._failedAttempts[email] >= 5) {
                this._startLockout(email);
                return;
            }

            this._showBanner('❌ INCORRECT PASSWORD — PLEASE TRY AGAIN.');
            this._showFieldError('loginPassword', 'loginPasswordError', 'Wrong password');
            document.getElementById('loginPassword').value = '';
            document.getElementById('authCard').classList.add('shake-card');
            setTimeout(() => document.getElementById('authCard').classList.remove('shake-card'), 500);
            return;
        }

        this._failedAttempts[email] = 0;
        user.lastLogin = Date.now();
        this._saveUsers(users);

        sessionStorage.setItem('paperbull_session', JSON.stringify({ userId: user.userId, email: user.email }));
        State.load(user.userId);
        if (!State.get('user')) {
            State.set('user', { userId: user.userId, name: user.name, email: user.email, phone: user.phone || '', joined: user.joined });
        }
        State.logActivity('login', `User logged in: ${user.name}`);
        CloudRegistry.reportUser({ userId: user.userId, name: user.name, email: user.email, phone: user.phone || '' });
        Market.init();
        Theme.apply(State.get('theme'));
        WelcomeAnim.play();
    },

    _startLockout(email) {
        const loginBtn = document.getElementById('loginBtn');
        const lockoutEl = document.getElementById('loginLockout');
        if (loginBtn) loginBtn.disabled = true;
        if (lockoutEl) lockoutEl.style.display = 'flex';
        let remaining = 60;
        const timerEl = document.getElementById('lockoutTimer');
        this._lockoutTimers[email] = setInterval(() => {
            remaining--;
            if (timerEl) timerEl.textContent = remaining;
            if (remaining <= 0) {
                clearInterval(this._lockoutTimers[email]);
                this._lockoutTimers[email] = null;
                this._failedAttempts[email] = 0;
                if (loginBtn) loginBtn.disabled = false;
                if (lockoutEl) lockoutEl.style.display = 'none';
            }
        }, 1000);
    },

    initTickerStrip() {
        const strip = document.getElementById('authTickerStrip');
        if (!strip) return;
        const tickers = ['RELIANCE ₹2,920', 'TCS ₹3,850', 'INFY ₹1,580', 'HDFCBANK ₹1,680', 'SBIN ₹830', 'WIPRO ₹560', 'TITAN ₹3,520', 'MARUTI ₹12,800', 'ZOMATO ₹235', 'BAJFINANCE ₹7,200', 'LT ₹3,650', 'TATAMOTORS ₹940'];
        strip.innerHTML = '<div class="ticker-track">' + tickers.concat(tickers).map(t => `<span class="ticker-item">${t}</span>`).join('') + '</div>';
    }
};

/* ===== OTP MODULE ===== */
const OTP = {
    generatedOtp: '',
    _resendTimer: null,
    _resendCount: 30,

    sendOtp() {
        const phone = document.getElementById('phoneInput').value.trim();
        if (!/^\d{10}$/.test(phone)) { Toast.show('Enter valid 10-digit number', 'error'); return; }
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        this.generatedOtp = String(100000 + (arr[0] % 900000));
        document.getElementById('otpPhone').textContent = '+91 ' + phone.slice(0, 2) + '••••' + phone.slice(6);
        document.getElementById('phoneStep').classList.remove('active');
        document.getElementById('otpStep').classList.add('active');

        // Typewriter OTP display
        const smsEl = document.getElementById('smsOtpDisplay');
        smsEl.textContent = '';
        const smsAnim = document.getElementById('smsAnim');
        smsAnim.classList.add('show');
        let idx = 0;
        const typeInterval = setInterval(() => {
            if (idx < this.generatedOtp.length) {
                smsEl.textContent += this.generatedOtp[idx];
                idx++;
            } else { clearInterval(typeInterval); }
        }, 80);

        // Auto-focus first OTP box
        const boxes = document.querySelectorAll('#otpDigits .otp-box');
        setTimeout(() => boxes[0].focus(), 300);
        this._setupOtpBoxes(boxes);
        this._startResendTimer();
        Toast.show('OTP sent to your phone', 'success');
    },

    _setupOtpBoxes(boxes) {
        boxes.forEach((b, i) => {
            b.value = '';
            b.addEventListener('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value && i < 5) boxes[i + 1].focus();
            });
            b.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && !this.value && i > 0) boxes[i - 1].focus();
            });
            b.addEventListener('paste', function (e) {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                paste.split('').forEach((ch, ci) => { if (boxes[ci]) boxes[ci].value = ch; });
                if (paste.length === 6) boxes[5].focus();
            });
        });
    },

    _startResendTimer() {
        this._resendCount = 30;
        const resendBtn = document.getElementById('resendBtn');
        const timerEl = document.getElementById('otpResendTimer');
        if (resendBtn) resendBtn.disabled = true;
        if (this._resendTimer) clearInterval(this._resendTimer);
        this._resendTimer = setInterval(() => {
            this._resendCount--;
            if (timerEl) timerEl.textContent = this._resendCount > 0 ? `Resend in ${this._resendCount}s` : '';
            if (this._resendCount <= 0) {
                clearInterval(this._resendTimer);
                if (resendBtn) resendBtn.disabled = false;
            }
        }, 1000);
    },

    verifyOtp() {
        const boxes = document.querySelectorAll('#otpDigits .otp-box');
        const entered = Array.from(boxes).map(b => b.value).join('');
        const errEl = document.getElementById('otpError');

        if (entered !== this.generatedOtp) {
            if (errEl) errEl.textContent = '❌ INCORRECT OTP — PLEASE CHECK THE CODE DISPLAYED ABOVE.';
            document.getElementById('otpDigits').classList.add('shake-field');
            setTimeout(() => document.getElementById('otpDigits').classList.remove('shake-field'), 500);
            boxes.forEach(b => b.value = '');
            boxes[0].focus();
            return;
        }
        if (errEl) errEl.textContent = '';

        const phone = document.getElementById('phoneInput').value.trim();
        const users = AuthUI._getUsers();
        let user = users.find(u => u.phone === phone);

        if (user) {
            user.lastLogin = Date.now();
            AuthUI._saveUsers(users);
            sessionStorage.setItem('paperbull_session', JSON.stringify({ userId: user.userId, email: user.email || '' }));
            State.load(user.userId);
            if (!State.get('user')) {
                State.set('user', { userId: user.userId, name: user.name, email: user.email || '', phone, joined: user.joined });
            }
            State.logActivity('login', `OTP login: ${user.name}`);
            CloudRegistry.reportUser({ userId: user.userId, name: user.name, email: user.email || '', phone });
        } else {
            const userId = AuthUI._generateUserId();
            const name = 'Trader_' + phone.slice(-4);
            user = { userId, name, email: '', phone, passwordHash: '', joined: Date.now(), lastLogin: Date.now(), createdAt: new Date().toISOString() };
            users.push(user);
            AuthUI._saveUsers(users);
            sessionStorage.setItem('paperbull_session', JSON.stringify({ userId, email: '' }));
            State.load(userId);
            State.set('user', { userId, name, email: '', phone, joined: Date.now() });
            State.logActivity('register', `New OTP user: ${name}`);
            CloudRegistry.reportUser({ userId, name, email: '', phone });
        }

        Market.init();
        Theme.apply(State.get('theme'));
        CloudSync.initSync().then(() => {
            Market.init();
            WelcomeAnim.play();
        });
    },

    resend() {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        this.generatedOtp = String(100000 + (arr[0] % 900000));
        const smsEl = document.getElementById('smsOtpDisplay');
        smsEl.textContent = '';
        let idx = 0;
        const typeInterval = setInterval(() => {
            if (idx < this.generatedOtp.length) { smsEl.textContent += this.generatedOtp[idx]; idx++; }
            else clearInterval(typeInterval);
        }, 80);
        this._startResendTimer();
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
            const userId = data.user.userId || AuthUI._generateUserId();
            State.load(userId);
            State.data = { ...State.defaults(), ...data, cloudSyncId: code };
            State.save();
            sessionStorage.setItem('paperbull_session', JSON.stringify({ userId, email: data.user.email || '' }));
            Market.init();
            Toast.show('Data restored! Welcome back.', 'success');
            WelcomeAnim.play();
        } else { Toast.show('Invalid sync code or no data found', 'error'); }
    }
};

/* ===== WELCOME ANIMATION ===== */
const WelcomeAnim = {
    play() {
        const overlay = document.getElementById('welcomeOverlay');
        if (!overlay) { App.startDashboard(); return; }
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1)';

        // Draw animated candlesticks
        this._drawCandles();
        // Typewriter text
        this._typeText();
        // Particles
        this._spawnParticles();
        // Progress bar
        const fill = document.getElementById('welcomeProgressFill');
        if (fill) { fill.style.transition = 'width 2.8s cubic-bezier(0.4, 0, 0.2, 1)'; setTimeout(() => fill.style.width = '100%', 50); }
        // Sub text fade in
        setTimeout(() => { const sub = document.getElementById('welcomeSub'); if (sub) sub.style.opacity = '1'; }, 600);
        // Dismiss after 2.8s
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(1.05)';
            setTimeout(() => { overlay.style.display = 'none'; App.startDashboard(); }, 400);
        }, 2800);
    },

    _drawCandles() {
        const svg = document.getElementById('welcomeChart');
        if (!svg) return;
        svg.innerHTML = '';
        // Baseline
        const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        baseline.setAttribute('x1', '20'); baseline.setAttribute('y1', '150');
        baseline.setAttribute('x2', '300'); baseline.setAttribute('y2', '150');
        baseline.setAttribute('stroke', 'rgba(255,255,255,0.1)'); baseline.setAttribute('stroke-width', '1');
        svg.appendChild(baseline);

        const candleData = [
            { h: 60, color: '#10b981' }, { h: 40, color: '#ef4444' }, { h: 70, color: '#10b981' },
            { h: 35, color: '#ef4444' }, { h: 55, color: '#10b981' }, { h: 45, color: '#ef4444' },
            { h: 65, color: '#10b981' }, { h: 90, color: '#10b981' }
        ];
        candleData.forEach((c, i) => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const x = 30 + i * 35;
            rect.setAttribute('x', x);
            rect.setAttribute('y', 150);
            rect.setAttribute('width', '20');
            rect.setAttribute('height', '0');
            rect.setAttribute('fill', c.color);
            rect.setAttribute('rx', '2');
            svg.appendChild(rect);
            setTimeout(() => {
                rect.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                rect.setAttribute('y', 150 - c.h);
                rect.setAttribute('height', c.h);
            }, 200 + i * 150);
        });
    },

    _typeText() {
        const el = document.getElementById('welcomeText');
        if (!el) return;
        const text = 'WELCOME TO YOUR TRADING JOURNEY 🚀';
        el.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) { el.textContent += text[i]; i++; }
            else clearInterval(interval);
        }, 60);
    },

    _spawnParticles() {
        const container = document.getElementById('welcomeParticles');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#10b981', '#f59e0b', '#3b82f6'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'welcome-particle';
            p.style.background = colors[i % 3];
            p.style.left = '50%';
            p.style.top = '50%';
            const angle = (Math.PI * 2 * i) / 40;
            const dist = 80 + Math.random() * 120;
            p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            p.style.animationDelay = (Math.random() * 0.3) + 's';
            container.appendChild(p);
        }
    }
};

/* ===== APP CONTROLLER ===== */
const App = {
    init() {
        BG.init();
        AuthUI.initTickerStrip();

        // Check for existing session
        const session = sessionStorage.getItem('paperbull_session');
        if (session) {
            try {
                const s = JSON.parse(session);
                State.load(s.userId);
                Market.init();
                Theme.apply(State.get('theme'));
                this.startDashboard();
                return;
            } catch (e) { sessionStorage.removeItem('paperbull_session'); }
        }

        // Setup auth event listeners
        const regPw = document.getElementById('regPassword');
        if (regPw) { regPw.addEventListener('input', () => AuthUI.updatePasswordStrength()); }
        const regConfirm = document.getElementById('regConfirm');
        if (regConfirm) { regConfirm.addEventListener('input', () => AuthUI.updateConfirmMatch()); }
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
        const t = document.getElementById('introTicker');
        if (t && t.children.length === 0) {
            ['NIFTY +1.2%', 'SENSEX +0.8%', 'RELIANCE ₹2,920', 'TCS ₹3,850', 'INFY ₹1,580'].forEach(txt => {
                const d = document.createElement('div'); d.className = 'tick-item'; d.textContent = txt; t.appendChild(d);
            });
        }
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
        this._updateMarketStatusUI();
        setInterval(() => { Trading.checkLimitOrders(); Trading.autoSquareOff(); PredictionEngine.resolve(); }, 5000);
        setInterval(() => this._updateMarketStatusUI(), 60000);
    },

    logout() {
        if (!confirm('Logout and return to login screen?')) return;
        if (typeof CloudSync !== 'undefined') CloudSync.syncUp();
        Market.stop();
        sessionStorage.removeItem('paperbull_session');
        State.currentUserId = null;
        State.data = null;
        this._switchScreen('authScreen');
        AuthUI.switchTab('login');
        Toast.show('Logged out successfully', 'info');
    },

    _switchScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    },

    _startClock() {
        const update = () => {
            const now = new Date();
            const el = document.getElementById('topbarTime');
            if (el) el.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
            // Header updates
            if (State.data) {
                const cap = document.getElementById('headerCapital');
                if (cap) cap.textContent = State.get('capital').toLocaleString('en-IN');
                const lvl = document.getElementById('headerLevel');
                if (lvl) lvl.textContent = 'Lv ' + State.get('level');
                const xpFill = document.getElementById('headerXpFill');
                if (xpFill) { const pct = (State.get('xp') / (State.get('level') * 100)) * 100; xpFill.style.width = Math.min(100, pct) + '%'; }
            }
        };
        update();
        setInterval(update, 1000);
    },

    _updateMarketStatusUI() {
        const status = MarketHours.getStatus();
        const ms = document.getElementById('marketStatus');
        if (ms) {
            const statusMap = {
                'open': { cls: 'open', text: 'MARKET OPEN', dotCls: 'dot-green' },
                'pre-market': { cls: 'pre-market', text: 'PRE-MARKET', dotCls: 'dot-amber' },
                'post-market': { cls: 'post-market', text: 'POST-MARKET', dotCls: 'dot-amber' },
                'closed': { cls: '', text: 'MARKET CLOSED', dotCls: 'dot-red' }
            };
            const s = statusMap[status] || statusMap.closed;
            ms.className = 'market-status ' + s.cls;
            ms.querySelector('.status-text').textContent = s.text;
            ms.querySelector('.status-dot').className = 'status-dot ' + s.dotCls;
        }

        // Disable trade buttons when closed
        const tradeBtn = document.getElementById('tradeExecBtn');
        if (tradeBtn) {
            if (!MarketHours.isOpen()) {
                tradeBtn.disabled = true;
                tradeBtn.title = 'Trading hours: Mon–Fri 9:15 AM – 3:30 PM IST';
            } else {
                tradeBtn.disabled = false;
                tradeBtn.title = '';
            }
        }
    }
};

/* ===== UI: SIDEBAR & TABS ===== */
const UI = {
    showTab(tab) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
        const el = document.getElementById('tab-' + tab);
        if (el) el.classList.add('active');
        const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
        if (btn) btn.classList.add('active');
        const bnav = document.querySelector(`.bottom-nav-item[data-tab="${tab}"]`);
        if (bnav) bnav.classList.add('active');
        if (tab === 'portfolio') PortfolioUI.refresh();
        if (tab === 'profile') ProfileUI.refresh();
        if (tab === 'predict') PredictUI.refresh();
        if (tab === 'orders') OrderUI.refresh();
        if (tab === 'fno') FnOUI.loadChain();
        this.closeSidebar();
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        sidebar.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('show');
    },

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('show');
    },

    toggleMobileDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        if (!drawer) return;
        if (drawer.style.display === 'none' || !drawer.style.display) {
            drawer.style.display = 'block';
            // Update drawer info
            if (State.data) {
                const db = document.getElementById('drawerBalance');
                if (db) db.textContent = State.get('capital').toLocaleString('en-IN');
                const dx = document.getElementById('drawerXP');
                if (dx) dx.textContent = State.get('xp') + ' XP';
                const dl = document.getElementById('drawerLevel');
                if (dl) dl.textContent = 'Level ' + State.get('level');
            }
            const dms = document.getElementById('drawerMarketStatus');
            if (dms) dms.textContent = MarketHours.getStatus().replace('-', ' ').toUpperCase();
        } else {
            drawer.style.display = 'none';
        }
    },

    showMarketClosedModal() {
        const modal = document.getElementById('marketClosedModal');
        if (!modal) return;
        modal.style.display = 'flex';
        const istEl = document.getElementById('modalIstTime');
        if (istEl) istEl.textContent = 'Current IST: ' + MarketHours.getISTString();
        const statusMap = { 'pre-market': 'Pre-Market Hours', 'post-market': 'After Hours', 'closed': 'Weekend / Holiday / Closed' };
        const statusEl = document.getElementById('modalStatusText');
        const status = MarketHours.getStatus();
        if (statusEl) statusEl.textContent = 'Status: ' + (statusMap[status] || 'Closed');

        // Start countdown
        if (this._countdownInterval) clearInterval(this._countdownInterval);
        const countdownEl = document.getElementById('modalCountdown');
        const updateCountdown = () => {
            if (countdownEl) countdownEl.textContent = MarketHours.getNextOpenCountdown();
        };
        updateCountdown();
        this._countdownInterval = setInterval(updateCountdown, 1000);
    },

    closeMarketClosedModal() {
        const modal = document.getElementById('marketClosedModal');
        if (modal) modal.style.display = 'none';
        if (this._countdownInterval) clearInterval(this._countdownInterval);
    },

    _countdownInterval: null
};

/* ===== THEME ===== */
const Theme = {
    toggle() { const cur = document.documentElement.getAttribute('data-theme'); this.set(cur === 'dark' ? 'light' : 'dark'); },
    set(t) { document.documentElement.setAttribute('data-theme', t); if (State.data) State.set('theme', t); const sel = document.getElementById('themeSelect'); if (sel) sel.value = t; },
    apply(t) { document.documentElement.setAttribute('data-theme', t || 'dark'); }
};

/* ===== MARKET UI ===== */
const MarketUI = {
    init() { this.render(); this.renderTopMovers(); },
    render() {
        const body = document.getElementById('stockTableBody');
        if (!body) return;
        const ex = document.getElementById('exchangeFilter') ? document.getElementById('exchangeFilter').value : 'all';
        const sec = document.getElementById('sectorFilter') ? document.getElementById('sectorFilter').value : 'all';
        const q = document.getElementById('stockSearch') ? document.getElementById('stockSearch').value.toLowerCase() : '';
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
        <td style="font-family:'JetBrains Mono',monospace;font-weight:600">${formatPrice(s.ltp)}</td>
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
            `<div class="movers-section"><div class="movers-label"><i class="ph ph-trend-up"></i> Top Gainers</div><div class="movers-cards">${gainers.map(s =>
                `<div class="mover-card mover-gain glass-card" onclick="TradeUI.selectStock('${s.sym}')">
                <span class="mover-sym">${s.sym}</span>
                <span class="mover-price">${formatPrice(s.ltp)}</span>
                <span class="mover-chg pnl-pos">+${s.changePct.toFixed(2)}%</span>
            </div>`).join('')}</div></div>` +
            `<div class="movers-section"><div class="movers-label"><i class="ph ph-trend-down"></i> Top Losers</div><div class="movers-cards">${losers.map(s =>
                `<div class="mover-card mover-loss glass-card" onclick="TradeUI.selectStock('${s.sym}')">
                <span class="mover-sym">${s.sym}</span>
                <span class="mover-price">${formatPrice(s.ltp)}</span>
                <span class="mover-chg pnl-neg">${s.changePct.toFixed(2)}%</span>
            </div>`).join('')}</div></div>`;
    },
    refresh() {
        this.render();
        this.renderTopMovers();
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
        if (TradeUI.currentSym) TradeUI._refreshDetailPanel();
    },
    filterExchange() { this.render(); },
    filterSector() { this.render(); },
    search() { this.render(); }
};

/* ===== TRADE UI ===== */
const TradeUI = {
    currentSym: null, currentSide: 'BUY', currentMode: 'INTRADAY', currentType: 'MARKET', chartType: 'line',
    selectStock(sym) {
        this.currentSym = sym;
        document.getElementById('detailPlaceholder').style.display = 'none';
        document.getElementById('detailContent').style.display = 'block';
        this._refreshDetailPanel();
        this.render();
        MarketUI.render();
    },
    _refreshDetailPanel() {
        const s = Market.stocks[this.currentSym];
        if (!s) return;
        document.getElementById('detailSymbol').textContent = s.sym;
        document.getElementById('detailName').textContent = s.name;
        document.getElementById('detailExchange').textContent = s.ex;
        document.getElementById('detailLtp').textContent = formatPrice(s.ltp);
        const cls = s.change >= 0 ? 'pnl-pos' : 'pnl-neg';
        document.getElementById('detailChange').className = 'detail-change ' + cls;
        document.getElementById('detailChange').textContent = `${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)} (${s.changePct >= 0 ? '+' : ''}${s.changePct.toFixed(2)}%)`;
        document.getElementById('detailOpen').textContent = formatPrice(s.open);
        document.getElementById('detailHigh').textContent = formatPrice(s.high);
        document.getElementById('detailLow').textContent = formatPrice(s.low);
        document.getElementById('detailVol').textContent = (s.volume / 1000000).toFixed(2) + 'M';
        document.getElementById('detailBid').textContent = formatPrice(s.bid);
        document.getElementById('detailAsk').textContent = formatPrice(s.ask);
        this._drawChart();
        this._updateTradeSummary();
    },
    setSide(side) {
        this.currentSide = side;
        document.querySelectorAll('.tt').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tt[data-side="${side}"]`).classList.add('active');
        const btn = document.getElementById('tradeExecBtn');
        if (btn) { btn.textContent = side; btn.className = 'btn-trade ' + (side === 'BUY' ? 'btn-buy' : 'btn-sell'); }
        this._updateTradeSummary();
    },
    setMode(m) { this.currentMode = m; this._updateTradeSummary(); },
    setOrderType(t) {
        this.currentType = t;
        document.getElementById('limitRow').style.display = t === 'LIMIT' ? 'flex' : 'none';
        this._updateTradeSummary();
    },
    setChartType(type) {
        this.chartType = type;
        document.querySelectorAll('.dct').forEach(b => b.classList.remove('active'));
        document.querySelector(`.dct:nth-child(${type === 'line' ? 1 : 2})`).classList.add('active');
        document.getElementById('detailLineChart').style.display = type === 'line' ? 'block' : 'none';
        document.getElementById('detailCandleChart').style.display = type === 'candle' ? 'block' : 'none';
        this._drawChart();
    },
    _updateTradeSummary() {
        const s = Market.stocks[this.currentSym];
        if (!s) return;
        const qty = parseInt(document.getElementById('tradeQty').value) || 1;
        const price = this.currentType === 'LIMIT' ? (parseFloat(document.getElementById('tradePrice').value) || s.ltp) : (this.currentSide === 'BUY' ? s.ask : s.bid);
        const value = price * qty;
        const leverage = this.currentMode === 'INTRADAY' ? 5 : 1;
        document.getElementById('tradeEstValue').textContent = formatPrice(value);
        document.getElementById('tradeMargin').textContent = formatPrice(value / leverage);
    },
    _drawChart() {
        if (this.chartType === 'line') this._drawLineChart();
        else this._drawCandleChart();
    },
    _drawLineChart() {
        const canvas = document.getElementById('detailLineChart');
        const ctx = canvas.getContext('2d');
        const s = Market.stocks[this.currentSym];
        if (!s || !s.dayHistory.length) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const data = s.dayHistory;
        const min = Math.min(...data) * 0.999;
        const max = Math.max(...data) * 1.001;
        const range = max - min || 1;
        const xStep = w / (data.length - 1 || 1);
        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        const isUp = data[data.length - 1] >= data[0];
        grad.addColorStop(0, isUp ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((v, i) => { const x = i * xStep; const y = h - ((v - min) / range) * (h - 20) - 10; ctx.lineTo(x, y); });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        // Line
        ctx.beginPath();
        data.forEach((v, i) => { const x = i * xStep; const y = h - ((v - min) / range) * (h - 20) - 10; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Current price dot
        const lastY = h - ((data[data.length - 1] - min) / range) * (h - 20) - 10;
        ctx.beginPath();
        ctx.arc(w, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = isUp ? '#10b981' : '#ef4444';
        ctx.fill();
    },
    _drawCandleChart() {
        const canvas = document.getElementById('detailCandleChart');
        const ctx = canvas.getContext('2d');
        const s = Market.stocks[this.currentSym];
        if (!s || !s.candles.length) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const candles = s.candles.slice(-30);
        const allPrices = candles.flatMap(c => [c.h, c.l]);
        const min = Math.min(...allPrices) * 0.999;
        const max = Math.max(...allPrices) * 1.001;
        const range = max - min || 1;
        const cw = (w - 20) / candles.length;
        candles.forEach((c, i) => {
            const x = 10 + i * cw + cw / 2;
            const oY = h - ((c.o - min) / range) * (h - 20) - 10;
            const cY = h - ((c.c - min) / range) * (h - 20) - 10;
            const hY = h - ((c.h - min) / range) * (h - 20) - 10;
            const lY = h - ((c.l - min) / range) * (h - 20) - 10;
            const isGreen = c.c >= c.o;
            ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, hY); ctx.lineTo(x, lY); ctx.stroke();
            ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
            const bodyTop = Math.min(oY, cY);
            const bodyH = Math.max(1, Math.abs(oY - cY));
            ctx.fillRect(x - cw * 0.35, bodyTop, cw * 0.7, bodyH);
        });
    },
    execute() {
        if (!this.currentSym) { Toast.show('Select a stock first', 'error'); return; }
        const qty = parseInt(document.getElementById('tradeQty').value);
        const limitPrice = parseFloat(document.getElementById('tradePrice').value);
        const result = Trading.placeOrder(this.currentSym, this.currentSide, qty, this.currentMode, this.currentType, limitPrice);
        if (result.ok) {
            Toast.show(`${this.currentSide} ${qty} ${this.currentSym} @ ${formatPrice(result.order.price)}`, 'success');
            this._updateTradeSummary();
        } else { Toast.show(result.msg, 'error'); }
    },
    render() { if (this.currentSym) this._refreshDetailPanel(); }
};

/* ===== PORTFOLIO UI ===== */
const PortfolioUI = {
    init() { this.refresh(); },
    refresh() {
        if (!State.data) return;
        const holdings = State.get('holdings') || [];
        const positions = State.get('positions') || [];
        let totalInvested = 0, totalCurrent = 0, dayPnl = 0;
        // Holdings
        const hBody = document.getElementById('holdingsBody');
        if (hBody) {
            hBody.innerHTML = holdings.length ? holdings.map(h => {
                const s = Market.stocks[h.sym];
                const ltp = s ? s.ltp : h.avg;
                const pnl = (ltp - h.avg) * h.qty;
                totalInvested += h.avg * h.qty;
                totalCurrent += ltp * h.qty;
                if (s) dayPnl += (ltp - s.prev) * h.qty;
                const cls = pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
                return `<tr><td><strong>${h.sym}</strong></td><td>${h.qty}</td><td>${formatPrice(h.avg)}</td><td>${formatPrice(ltp)}</td><td class="${cls}">${formatPrice(pnl)}</td><td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${h.sym}';TradeUI.currentMode='CNC';TradeUI.currentSide='SELL';TradeUI.execute()">Sell</button></td></tr>`;
            }).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No holdings yet</td></tr>';
        }
        // Positions
        const pBody = document.getElementById('positionsBody');
        if (pBody) {
            pBody.innerHTML = positions.length ? positions.map(p => {
                const s = Market.stocks[p.sym];
                const ltp = s ? s.ltp : p.avg;
                const pnl = (ltp - p.avg) * p.qty;
                const cls = pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
                return `<tr><td><strong>${p.sym}</strong></td><td>${p.qty}</td><td>${formatPrice(p.avg)}</td><td>${formatPrice(ltp)}</td><td class="${cls}">${formatPrice(pnl)}</td><td><button class="btn-sm btn-sell" onclick="TradeUI.currentSym='${p.sym}';TradeUI.currentMode='INTRADAY';TradeUI.currentSide='SELL';TradeUI.execute()">Exit</button></td></tr>`;
            }).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No open positions</td></tr>';
        }
        // Summary
        const totalPnl = totalCurrent - totalInvested;
        const pfI = document.getElementById('pfInvested'); if (pfI) pfI.textContent = formatPrice(totalInvested);
        const pfC = document.getElementById('pfCurrent'); if (pfC) pfC.textContent = formatPrice(totalCurrent);
        const pfP = document.getElementById('pfPnl'); if (pfP) { pfP.textContent = formatPrice(totalPnl); pfP.className = totalPnl >= 0 ? 'pnl-pos' : 'pnl-neg'; }
        const pfDP = document.getElementById('pfDayPnl'); if (pfDP) { pfDP.textContent = formatPrice(dayPnl); pfDP.className = dayPnl >= 0 ? 'pnl-pos' : 'pnl-neg'; }
        this._drawPieChart(holdings);
        this._drawPortfolioChart();
    },
    _drawPieChart(holdings) {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!holdings.length) { ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(140, 140, 100, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#8b949e'; ctx.font = '14px Inter'; ctx.textAlign = 'center'; ctx.fillText('No holdings', 140, 145); return; }
        const secMap = {};
        holdings.forEach(h => {
            const s = Market.stocks[h.sym];
            const val = (s ? s.ltp : h.avg) * h.qty;
            const sec = s ? s.sec : 'Other';
            secMap[sec] = (secMap[sec] || 0) + val;
        });
        const sectors = Object.entries(secMap);
        const total = sectors.reduce((a, b) => a + b[1], 0);
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'];
        let angle = -Math.PI / 2;
        sectors.forEach(([sec, val], i) => {
            const slice = (val / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(140, 140);
            ctx.arc(140, 140, 100, angle, angle + slice);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            angle += slice;
        });
        // Inner circle (donut)
        ctx.beginPath();
        ctx.arc(140, 140, 55, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card-solid').trim() || '#161b22';
        ctx.fill();
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e6edf3';
        ctx.font = 'bold 16px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(formatPrice(total), 140, 140);
        ctx.font = '11px Inter';
        ctx.fillStyle = '#8b949e';
        ctx.fillText('Total Value', 140, 158);
        // Legend
        const legend = document.getElementById('pieLegend');
        if (legend) {
            legend.innerHTML = sectors.map(([sec, val], i) => `<div class="pie-legend-item"><div class="dot" style="background:${colors[i % colors.length]}"></div>${sec} (${((val / total) * 100).toFixed(1)}%)</div>`).join('');
        }
    },
    _drawPortfolioChart() {
        const canvas = document.getElementById('portfolioChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const history = State.get('portfolioHistory') || [];
        if (history.length < 2) return;
        const vals = history.map(p => p.v);
        const min = Math.min(...vals) * 0.995;
        const max = Math.max(...vals) * 1.005;
        const range = max - min || 1;
        const xStep = w / (vals.length - 1 || 1);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(16,185,129,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.moveTo(0, h);
        vals.forEach((v, i) => { ctx.lineTo(i * xStep, h - ((v - min) / range) * (h - 30) - 15); });
        ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath();
        vals.forEach((v, i) => { const y = h - ((v - min) / range) * (h - 30) - 15; i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * xStep, y); });
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.stroke();
    }
};

/* ===== ORDER UI ===== */
const OrderUI = {
    currentFilter: 'open',
    showSub(f) {
        this.currentFilter = f;
        document.querySelectorAll('.ot').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        this.refresh();
    },
    refresh() {
        const body = document.getElementById('ordersBody');
        if (!body || !State.data) return;
        let orders = State.get('orders') || [];
        if (this.currentFilter === 'open') orders = orders.filter(o => o.status === 'OPEN');
        else if (this.currentFilter === 'executed') orders = orders.filter(o => o.status === 'EXECUTED');
        body.innerHTML = orders.length ? orders.map(o => {
            const sideCls = o.side === 'BUY' ? 'pnl-pos' : 'pnl-neg';
            const statusCls = o.status === 'OPEN' ? 'status-open' : o.status === 'EXECUTED' ? 'status-executed' : 'status-cancelled';
            return `<tr><td>${o.time}</td><td><strong>${o.sym}</strong></td><td class="${sideCls}">${o.side}</td><td>${o.mode}</td><td>${o.type}</td><td>${o.qty}</td><td>${formatPrice(o.price)}</td><td><span class="status-badge ${statusCls}">${o.status}</span></td></tr>`;
        }).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px">No orders found</td></tr>';
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
            const chain = FnO.getChain(underlying, expiry, 'FUT');
            const body = document.getElementById('futBody');
            if (body) {
                body.innerHTML = chain.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.lot}</td><td style="font-family:'JetBrains Mono',monospace">${formatPrice(c.ltp)}</td><td class="${c.change >= 0 ? 'pnl-pos' : 'pnl-neg'}" style="font-family:'JetBrains Mono',monospace">${c.change >= 0 ? '+' : ''}${c.change.toFixed(2)}</td><td>${(c.oi / 1000).toFixed(0)}K</td><td><button class="btn-sm btn-buy" onclick="FnOUI.trade('${c.name}','${underlying}','${expiry}','FUT',${c.ltp},${c.lot},'BUY')">Buy</button> <button class="btn-sm btn-sell" onclick="FnOUI.trade('${c.name}','${underlying}','${expiry}','FUT',${c.ltp},${c.lot},'SELL')">Sell</button></td></tr>`).join('');
            }
        } else {
            const chain = FnO.getChain(underlying, expiry, 'OPT');
            const body = document.getElementById('optBody');
            if (body) {
                body.innerHTML = chain.map(s => `<tr><td style="font-family:'JetBrains Mono',monospace;color:var(--accent)">${formatPrice(s.call.ltp)}</td><td>${s.call.delta}</td><td>${(s.call.oi / 1000).toFixed(0)}K</td><td class="strike-col">${s.strike.toLocaleString('en-IN')}</td><td>${(s.put.oi / 1000).toFixed(0)}K</td><td>${s.put.delta}</td><td style="font-family:'JetBrains Mono',monospace;color:var(--accent-red)">${formatPrice(s.put.ltp)}</td><td><button class="btn-sm btn-buy" onclick="FnOUI.trade('${s.call.name}','${underlying}','${expiry}','CE',${s.call.ltp},${s.lot},'BUY')">C</button> <button class="btn-sm btn-sell" onclick="FnOUI.trade('${s.put.name}','${underlying}','${expiry}','PE',${s.put.ltp},${s.lot},'BUY')">P</button></td></tr>`).join('');
            }
        }
        this._refreshPositions();
    },
    trade(name, underlying, expiry, type, price, lot, side) {
        const contract = { name, underlying, expiry, lot, optType: type === 'CE' || type === 'PE' ? type : null };
        const result = Trading.placeFnOOrder(contract, type, side, 1, price);
        if (result.ok) { Toast.show(`${side} ${name} @ ${formatPrice(price)}`, 'success'); this.loadChain(); }
        else Toast.show(result.msg, 'error');
    },
    _refreshPositions() {
        const body = document.getElementById('fnoPositionsBody');
        if (!body || !State.data) return;
        const positions = State.get('fnoPositions') || [];
        body.innerHTML = positions.length ? positions.map(p => {
            const ltp = Math.abs(p.avg * (1 + (Math.random() - 0.5) * 0.02));
            const pnl = (ltp - p.avg) * p.lots * p.lotSize;
            const cls = pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
            return `<tr><td><strong>${p.contract}</strong></td><td>${p.type}</td><td>${p.lots}</td><td>${formatPrice(p.avg)}</td><td>${formatPrice(ltp)}</td><td class="${cls}">${formatPrice(pnl)}</td><td><button class="btn-sm btn-sell" onclick="FnOUI.exitPosition('${p.contract}',${ltp})">Exit</button></td></tr>`;
        }).join('') : '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px">No F&O positions</td></tr>';
    },
    exitPosition(name, price) {
        const contract = { name };
        const result = Trading.placeFnOOrder(contract, '', 'SELL', 1, price);
        if (result.ok) { Toast.show('Position exited', 'success'); this.loadChain(); }
    }
};

/* ===== PREDICT UI ===== */
const PredictUI = {
    init() {
        const sel = document.getElementById('predStock');
        if (sel && sel.options.length <= 1) {
            Object.keys(Market.stocks).forEach(sym => {
                const opt = document.createElement('option');
                opt.value = sym; opt.textContent = sym;
                sel.appendChild(opt);
            });
        }
        this.refresh();
    },
    refresh() {
        if (!State.data) return;
        const preds = State.get('predictions') || [];
        document.getElementById('predTotal').textContent = preds.length;
        document.getElementById('predCorrect').textContent = State.get('correctPredictions');
        const acc = preds.filter(p => p.status !== 'PENDING').length;
        document.getElementById('predAccuracy').textContent = acc ? Math.round((State.get('correctPredictions') / acc) * 100) + '%' : '0%';
        document.getElementById('predStreak').textContent = '🔥 ' + State.get('currentStreak');
        const hist = document.getElementById('predHistory');
        if (hist) {
            hist.innerHTML = preds.slice(0, 20).map(p => {
                const icon = p.status === 'PENDING' ? '⏳' : p.status === 'CORRECT' ? '✅' : '❌';
                const cls = p.status === 'CORRECT' ? 'pnl-pos' : p.status === 'WRONG' ? 'pnl-neg' : '';
                return `<div class="pred-item"><div>${icon} <strong>${p.sym}</strong> ${p.direction} @ ${formatPrice(p.priceAt)}</div><div class="${cls}">${p.status}${p.resolvedPrice ? ' → ' + formatPrice(p.resolvedPrice) : ''}</div></div>`;
            }).join('') || '<p style="color:var(--text-muted)">No predictions yet</p>';
        }
    }
};

const Predict = {
    submit(dir) {
        const sym = document.getElementById('predStock').value;
        const result = PredictionEngine.submit(sym, dir);
        if (result.ok) { Toast.show(`Predicted ${sym} will go ${dir}`, 'success'); PredictUI.refresh(); }
        else Toast.show(result.msg, 'error');
    }
};

/* ===== QUIZ ===== */
const Quiz = {
    questions: [], current: 0, score: 0, answered: false,
    start() {
        const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
        this.questions = shuffled.slice(0, 10);
        this.current = 0; this.score = 0; this.answered = false;
        document.getElementById('quizStart').style.display = 'none';
        document.getElementById('quizResult').style.display = 'none';
        document.getElementById('quizActive').style.display = 'block';
        this._show();
    },
    _show() {
        const q = this.questions[this.current];
        document.getElementById('quizQNum').textContent = `${this.current + 1}/10`;
        document.getElementById('quizFill').style.width = ((this.current + 1) / 10 * 100) + '%';
        document.getElementById('quizQ').textContent = q.q;
        const opts = document.getElementById('quizOpts');
        opts.innerHTML = q.o.map((o, i) => `<button class="quiz-opt" onclick="Quiz.answer(${i})">${o}</button>`).join('');
        this.answered = false;
    },
    answer(idx) {
        if (this.answered) return;
        this.answered = true;
        const q = this.questions[this.current];
        const buttons = document.querySelectorAll('.quiz-opt');
        buttons[q.a].classList.add('correct');
        if (idx === q.a) {
            this.score++;
            State.update(d => { d.xp += 50; Trading._checkLevelUp(d); });
        } else { buttons[idx].classList.add('wrong'); }
        setTimeout(() => {
            this.current++;
            if (this.current < 10) this._show();
            else this._finish();
        }, 1200);
    },
    _finish() {
        document.getElementById('quizActive').style.display = 'none';
        document.getElementById('quizResult').style.display = 'block';
        document.getElementById('quizScore').textContent = this.score;
        const xpEarned = this.score * 50;
        document.getElementById('quizXpEarned').textContent = '+' + xpEarned;
        if (this.score === 10) State.update(d => { d.perfectQuiz = true; });
        State.logActivity('quiz', `Quiz completed: ${this.score}/10`);
    }
};

/* ===== PROFILE UI ===== */
const ProfileUI = {
    init() { this.refresh(); },
    refresh() {
        if (!State.data) return;
        const u = State.get('user');
        if (u) {
            document.getElementById('profileName').textContent = u.name || 'Trader';
            document.getElementById('profilePhone').textContent = u.phone ? '+91 ' + u.phone.slice(0, 2) + '••••' + u.phone.slice(6) : '';
            const emailEl = document.getElementById('profileEmail');
            if (emailEl) emailEl.textContent = u.email || '';
        }
        document.getElementById('profileLevel').textContent = 'Level ' + State.get('level');
        const xpNeeded = State.get('level') * 100;
        const xpPct = Math.min(100, (State.get('xp') / xpNeeded) * 100);
        document.getElementById('profileXpFill').style.width = xpPct + '%';
        document.getElementById('profileXpText').textContent = State.get('xp') + ' / ' + xpNeeded + ' XP';
        document.getElementById('statCapital').textContent = formatPrice(State.get('capital'));
        document.getElementById('statTrades').textContent = State.get('totalTrades');
        const preds = State.get('predictions') || [];
        const resolved = preds.filter(p => p.status !== 'PENDING').length;
        document.getElementById('statPredAcc').textContent = resolved ? Math.round((State.get('correctPredictions') / resolved) * 100) + '%' : '0%';
        document.getElementById('statXp').textContent = State.get('xp') + (State.get('level') - 1) * 100;
        this._renderBadges();
    },
    _renderBadges() {
        const grid = document.getElementById('badgeGrid');
        if (!grid) return;
        const earned = State.get('achievements') || [];
        const stats = {
            totalTrades: State.get('totalTrades'), profitableTrades: State.get('profitableTrades'),
            perfectQuiz: State.get('perfectQuiz'), correctPredictions: State.get('correctPredictions'),
            maxStreak: State.get('maxStreak'), level: State.get('level'),
            uniqueHoldings: (State.get('holdings') || []).length,
            totalValue: Trading._calcTotalValue(State.data)
        };
        grid.innerHTML = ACHIEVEMENTS.map(a => {
            const isEarned = earned.includes(a.id) || a.check(stats);
            if (a.check(stats) && !earned.includes(a.id)) {
                State.update(d => { d.achievements.push(a.id); });
                Toast.show(`🏆 Achievement Unlocked: ${a.name}!`, 'success');
            }
            return `<div class="badge-item ${isEarned ? 'earned' : 'locked'}"><div class="badge-icon">${a.icon}</div><div class="badge-name">${a.name}</div><div style="font-size:0.65rem;color:var(--text-muted);margin-top:4px">${a.desc}</div></div>`;
        }).join('');
    }
};

/* ===== SETTINGS ===== */
const Settings = {
    toggleRefresh() { const v = document.getElementById('autoRefresh').checked; State.set('autoRefresh', v); if (v) Market.start(); else Market.stop(); },
    toggleSound() { State.set('sound', document.getElementById('soundFx').checked); },
    exportData() {
        const blob = new Blob([JSON.stringify(State.data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'paperbull_data_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        Toast.show('Data exported', 'success');
    },
    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = f => {
            try {
                const data = JSON.parse(f.target.result);
                State.data = { ...State.defaults(), ...data };
                State.save();
                Market.init();
                Toast.show('Data imported successfully', 'success');
            } catch (err) { Toast.show('Invalid JSON file', 'error'); }
        };
        reader.readAsText(file);
    },
    resetAll() {
        if (!confirm('⚠️ This will delete ALL your data. Continue?')) return;
        if (!confirm('Are you REALLY sure? This cannot be undone!')) return;
        const userId = State.currentUserId;
        if (userId) localStorage.removeItem('paperbull_state_' + userId);
        State.data = State.defaults();
        State.save();
        Market.init();
        Toast.show('All data reset', 'info');
        PortfolioUI.refresh(); ProfileUI.refresh();
    }
};

/* ===== CLOUD SYNC ===== */
const CloudSync = {
    _binId: null,
    _apiKey: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    _baseUrl: 'https://api.jsonbin.io/v3/b/',
    _debounceTimer: null,

    async initSync() {
        const syncId = State.get('cloudSyncId');
        if (syncId) {
            this._binId = syncId;
            await this.syncDown();
        }
    },

    async syncUp() {
        if (!State.data) return;
        try {
            if (this._binId) {
                await fetch(this._baseUrl + this._binId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-Master-Key': this._apiKey },
                    body: JSON.stringify(State.data)
                });
            } else {
                const res = await fetch(this._baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Master-Key': this._apiKey, 'X-Bin-Name': 'paperbull_' + (State.currentUserId || 'anon') },
                    body: JSON.stringify(State.data)
                });
                const json = await res.json();
                if (json && json.metadata) {
                    this._binId = json.metadata.id;
                    State.set('cloudSyncId', this._binId);
                }
            }
            const el = document.getElementById('syncCodeText');
            if (el) el.textContent = this._binId || 'Not synced';
            const statusEl = document.getElementById('syncStatusText');
            if (statusEl) { statusEl.textContent = 'Last synced: ' + new Date().toLocaleTimeString(); statusEl.className = 'sync-status synced'; }
        } catch (e) { console.warn('Sync failed:', e); }
    },

    async syncDown() {
        if (!this._binId) return;
        try {
            const res = await fetch(this._baseUrl + this._binId + '/latest', {
                headers: { 'X-Master-Key': this._apiKey }
            });
            const json = await res.json();
            if (json && json.record) {
                const remote = json.record;
                if (remote.lastModified && remote.lastModified > (State.data.lastModified || 0)) {
                    State.data = { ...State.defaults(), ...remote };
                    State.save();
                }
            }
        } catch (e) { console.warn('Sync down failed:', e); }
    },

    async fetchByCode(code) {
        try {
            const res = await fetch(this._baseUrl + code + '/latest', {
                headers: { 'X-Master-Key': this._apiKey }
            });
            const json = await res.json();
            return json && json.record ? json.record : null;
        } catch (e) { return null; }
    },

    copyCode() {
        const code = this._binId || '';
        if (!code) { Toast.show('No sync code yet. Click Sync Now.', 'info'); return; }
        navigator.clipboard.writeText(code).then(() => Toast.show('Sync code copied!', 'success')).catch(() => Toast.show('Copy failed', 'error'));
    },

    forceSync() { this.syncUp(); Toast.show('Sync started...', 'info'); },

    debouncedSync() {
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => this.syncUp(), 5000);
    }
};

/* ===== INIT ===== */
/* ===== SECRET ADMIN ACCESS ===== */
const AdminAccess = {
    _buffer: '',
    _secret: 'admin',
    _iframeOpen: false,

    init() {
        // Listen for secret keyword typed anywhere
        document.addEventListener('keydown', (e) => {
            // Don't capture when typing in an input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            this._buffer += e.key.toLowerCase();
            if (this._buffer.length > 20) this._buffer = this._buffer.slice(-20);
            if (this._buffer.includes(this._secret)) {
                this._buffer = '';
                this.openAdmin();
            }
        });

        // Console command
        window.openAdmin = () => this.openAdmin();
    },

    openAdmin() {
        if (this._iframeOpen) { this.closeAdmin(); return; }
        this._iframeOpen = true;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'adminOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;justify-content:center;align-items:center;animation:fadeIn 0.3s ease';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Close Admin';
        closeBtn.style.cssText = 'position:absolute;top:16px;right:20px;background:rgba(239,68,68,0.9);color:#fff;border:none;padding:8px 20px;border-radius:8px;font-weight:700;cursor:pointer;z-index:10001;font-size:0.9rem';
        closeBtn.onclick = () => this.closeAdmin();
        overlay.appendChild(closeBtn);

        // Iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'admin.html';
        iframe.style.cssText = 'width:95%;height:90%;border:none;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5)';
        overlay.appendChild(iframe);

        // Click outside to close
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeAdmin(); });

        document.body.appendChild(overlay);
        Toast.show('🔐 Admin panel opened', 'info');
    },

    closeAdmin() {
        const overlay = document.getElementById('adminOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
            setTimeout(() => overlay.remove(), 300);
        }
        this._iframeOpen = false;
    }
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    AdminAccess.init();

    // Auto-update trade summary on qty/price change
    const qtyInput = document.getElementById('tradeQty');
    if (qtyInput) qtyInput.addEventListener('input', () => TradeUI._updateTradeSummary());
    const priceInput = document.getElementById('tradePrice');
    if (priceInput) priceInput.addEventListener('input', () => TradeUI._updateTradeSummary());
});
