/* ===== STOCK DATA & SIMULATION ENGINE ===== */
const STOCKS = [
    { sym: 'RELIANCE', name: 'Reliance Industries', ex: 'NSE', sec: 'Energy', base: 2480, lot: 250, vol: 0.018 },
    { sym: 'TCS', name: 'Tata Consultancy', ex: 'NSE', sec: 'IT', base: 3920, lot: 150, vol: 0.014 },
    { sym: 'HDFCBANK', name: 'HDFC Bank', ex: 'NSE', sec: 'Banking', base: 1685, lot: 550, vol: 0.016 },
    { sym: 'INFY', name: 'Infosys', ex: 'NSE', sec: 'IT', base: 1580, lot: 300, vol: 0.017 },
    { sym: 'ICICIBANK', name: 'ICICI Bank', ex: 'NSE', sec: 'Banking', base: 1120, lot: 700, vol: 0.016 },
    { sym: 'HINDUNILVR', name: 'Hindustan Unilever', ex: 'NSE', sec: 'FMCG', base: 2540, lot: 300, vol: 0.012 },
    { sym: 'ITC', name: 'ITC Limited', ex: 'NSE', sec: 'FMCG', base: 458, lot: 1600, vol: 0.013 },
    { sym: 'SBIN', name: 'State Bank of India', ex: 'NSE', sec: 'Banking', base: 782, lot: 750, vol: 0.019 },
    { sym: 'BHARTIARTL', name: 'Bharti Airtel', ex: 'NSE', sec: 'IT', base: 1640, lot: 475, vol: 0.015 },
    { sym: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ex: 'NSE', sec: 'Banking', base: 1780, lot: 400, vol: 0.015 },
    { sym: 'LT', name: 'Larsen & Toubro', ex: 'NSE', sec: 'Infra', base: 3480, lot: 150, vol: 0.016 },
    { sym: 'AXISBANK', name: 'Axis Bank', ex: 'NSE', sec: 'Banking', base: 1078, lot: 625, vol: 0.018 },
    { sym: 'BAJFINANCE', name: 'Bajaj Finance', ex: 'NSE', sec: 'Banking', base: 6920, lot: 125, vol: 0.022 },
    { sym: 'MARUTI', name: 'Maruti Suzuki', ex: 'NSE', sec: 'Auto', base: 11450, lot: 100, vol: 0.016 },
    { sym: 'HCLTECH', name: 'HCL Technologies', ex: 'NSE', sec: 'IT', base: 1680, lot: 350, vol: 0.016 },
    { sym: 'SUNPHARMA', name: 'Sun Pharmaceutical', ex: 'NSE', sec: 'Pharma', base: 1780, lot: 350, vol: 0.017 },
    { sym: 'TITAN', name: 'Titan Company', ex: 'NSE', sec: 'FMCG', base: 3560, lot: 175, vol: 0.019 },
    { sym: 'ASIANPAINT', name: 'Asian Paints', ex: 'NSE', sec: 'FMCG', base: 2340, lot: 300, vol: 0.015 },
    { sym: 'ULTRACEMCO', name: 'UltraTech Cement', ex: 'NSE', sec: 'Cement', base: 10850, lot: 100, vol: 0.014 },
    { sym: 'WIPRO', name: 'Wipro', ex: 'NSE', sec: 'IT', base: 548, lot: 1500, vol: 0.018 },
    { sym: 'NESTLEIND', name: 'Nestle India', ex: 'NSE', sec: 'FMCG', base: 2280, lot: 200, vol: 0.011 },
    { sym: 'TATAMOTORS', name: 'Tata Motors', ex: 'NSE', sec: 'Auto', base: 745, lot: 1400, vol: 0.025 },
    { sym: 'TATASTEEL', name: 'Tata Steel', ex: 'NSE', sec: 'Metal', base: 142, lot: 6500, vol: 0.023 },
    { sym: 'POWERGRID', name: 'Power Grid Corp', ex: 'NSE', sec: 'Energy', base: 310, lot: 2800, vol: 0.012 },
    { sym: 'NTPC', name: 'NTPC Limited', ex: 'NSE', sec: 'Energy', base: 368, lot: 2400, vol: 0.013 },
    { sym: 'ONGC', name: 'Oil & Natural Gas', ex: 'NSE', sec: 'Energy', base: 258, lot: 3850, vol: 0.017 },
    { sym: 'JSWSTEEL', name: 'JSW Steel', ex: 'NSE', sec: 'Metal', base: 880, lot: 675, vol: 0.022 },
    { sym: 'M&M', name: 'Mahindra & Mahindra', ex: 'BSE', sec: 'Auto', base: 2780, lot: 350, vol: 0.018 },
    { sym: 'TECHM', name: 'Tech Mahindra', ex: 'BSE', sec: 'IT', base: 1680, lot: 600, vol: 0.019 },
    { sym: 'INDUSINDBK', name: 'IndusInd Bank', ex: 'BSE', sec: 'Banking', base: 968, lot: 900, vol: 0.024 },
    { sym: 'ADANIENT', name: 'Adani Enterprises', ex: 'BSE', sec: 'Infra', base: 2340, lot: 250, vol: 0.032 },
    { sym: 'ADANIPORTS', name: 'Adani Ports', ex: 'BSE', sec: 'Infra', base: 1285, lot: 400, vol: 0.020 },
    { sym: 'BAJAJFINSV', name: 'Bajaj Finserv', ex: 'BSE', sec: 'Banking', base: 1640, lot: 500, vol: 0.020 },
    { sym: 'DRREDDY', name: 'Dr Reddys Labs', ex: 'BSE', sec: 'Pharma', base: 1220, lot: 250, vol: 0.016 },
    { sym: 'CIPLA', name: 'Cipla', ex: 'BSE', sec: 'Pharma', base: 1490, lot: 650, vol: 0.016 },
    { sym: 'DIVISLAB', name: 'Divis Laboratories', ex: 'BSE', sec: 'Pharma', base: 5880, lot: 100, vol: 0.018 },
    { sym: 'GRASIM', name: 'Grasim Industries', ex: 'BSE', sec: 'Cement', base: 2580, lot: 250, vol: 0.016 },
    { sym: 'HEROMOTOCO', name: 'Hero MotoCorp', ex: 'BSE', sec: 'Auto', base: 4620, lot: 300, vol: 0.015 },
    { sym: 'EICHERMOT', name: 'Eicher Motors', ex: 'BSE', sec: 'Auto', base: 4780, lot: 150, vol: 0.017 },
    { sym: 'COALINDIA', name: 'Coal India', ex: 'BSE', sec: 'Energy', base: 388, lot: 2400, vol: 0.016 },
    { sym: 'BPCL', name: 'Bharat Petroleum', ex: 'BSE', sec: 'Energy', base: 318, lot: 2400, vol: 0.019 },
    { sym: 'BRITANNIA', name: 'Britannia Industries', ex: 'BSE', sec: 'FMCG', base: 5340, lot: 200, vol: 0.013 },
    { sym: 'APOLLOHOSP', name: 'Apollo Hospitals', ex: 'NSE', sec: 'Pharma', base: 6780, lot: 125, vol: 0.018 },
    { sym: 'SBILIFE', name: 'SBI Life Insurance', ex: 'NSE', sec: 'Banking', base: 1540, lot: 375, vol: 0.015 },
    { sym: 'TATACONSUM', name: 'Tata Consumer', ex: 'NSE', sec: 'FMCG', base: 1080, lot: 900, vol: 0.017 },
    { sym: 'HINDALCO', name: 'Hindalco Industries', ex: 'NSE', sec: 'Metal', base: 625, lot: 1075, vol: 0.022 },
    { sym: 'SHREECEM', name: 'Shree Cement', ex: 'NSE', sec: 'Cement', base: 26800, lot: 25, vol: 0.015 },
    { sym: 'DABUR', name: 'Dabur India', ex: 'NSE', sec: 'FMCG', base: 548, lot: 1250, vol: 0.013 },
    { sym: 'PIDILITIND', name: 'Pidilite Industries', ex: 'NSE', sec: 'FMCG', base: 2780, lot: 250, vol: 0.012 },
    { sym: 'BANKBARODA', name: 'Bank of Baroda', ex: 'BSE', sec: 'Banking', base: 245, lot: 2925, vol: 0.021 }
];

const QUIZ_QUESTIONS = [
    { q: 'What does NSE stand for?', o: ['National Stock Exchange', 'National Securities Exchange', 'New Stock Exchange', 'North Stock Exchange'], a: 0 },
    { q: 'What is a Bull market?', o: ['Rising prices', 'Falling prices', 'Stagnant prices', 'Volatile prices'], a: 0 },
    { q: 'SEBI is the regulator of?', o: ['Indian banks', 'Indian securities market', 'Indian insurance', 'Indian telecom'], a: 1 },
    { q: 'What is P/E ratio?', o: ['Price to Earnings', 'Profit to Expense', 'Price to Equity', 'Profit to Earnings'], a: 0 },
    { q: 'Nifty 50 is an index of?', o: ['Top 50 BSE stocks', 'Top 50 NSE stocks', 'Top 50 mutual funds', 'Top 50 bonds'], a: 1 },
    { q: 'What is shorting a stock?', o: ['Buying for long term', 'Selling borrowed shares', 'Buying in bulk', 'Selling at a loss'], a: 1 },
    { q: 'What is SIP?', o: ['Systematic Investment Plan', 'Standard Investment Plan', 'Stock Investment Plan', 'Simple Investment Plan'], a: 0 },
    { q: 'Upper circuit means?', o: ['Stock hit maximum daily limit', 'Stock hit minimum daily limit', 'Stock delisted', 'Market closed'], a: 0 },
    { q: 'What is market capitalization?', o: ['Total revenue', 'Share price × total shares', 'Total profit', 'Total debt'], a: 1 },
    { q: 'What does IPO stand for?', o: ['Initial Public Offering', 'Indian Public Offering', 'Initial Private Offering', 'International Public Offering'], a: 0 },
    { q: 'What is a stop-loss order?', o: ['Order to buy at any price', 'Limit order to sell to cut losses', 'Order to hold', 'Order to double position'], a: 1 },
    { q: 'What is a blue-chip stock?', o: ['Cheap penny stock', 'Well-established large-cap company', 'New startup stock', 'Government bond'], a: 1 },
    { q: 'Sensex is an index of?', o: ['NSE top 30', 'BSE top 30', 'NSE top 50', 'BSE top 50'], a: 1 },
    { q: 'What is intraday trading?', o: ['Long-term investing', 'Buying and selling same day', 'Monthly trading', 'Yearly rebalancing'], a: 1 },
    { q: 'What is the settlement cycle for equities in India?', o: ['T+0', 'T+1', 'T+2', 'T+3'], a: 1 },
    { q: 'What is NAV?', o: ['Net Asset Value', 'National Asset Value', 'Net Annual Value', 'New Asset Volume'], a: 0 },
    { q: 'What is demat account?', o: ['Savings account', 'Account to hold shares electronically', 'Loan account', 'Insurance account'], a: 1 },
    { q: 'What is the face value of most Indian stocks?', o: ['₹1 or ₹10', '₹100', '₹1000', '₹500'], a: 0 },
    { q: 'What is dividend?', o: ['Share of company profit to shareholders', 'Interest on deposit', 'Loan from company', 'Tax refund'], a: 0 },
    { q: 'What is a 52-week high?', o: ['Highest price in last 52 weeks', 'Average price over 52 weeks', 'Lowest price in 52 weeks', 'Opening price 52 weeks ago'], a: 0 },
    { q: 'Options premium is affected by?', o: ['Only stock price', 'Time decay and volatility', 'Only volume', 'Only interest rate'], a: 1 },
    { q: 'What does FII stand for?', o: ['Foreign Institutional Investor', 'Federal Institutional Investor', 'Financial Institutional Investor', 'Foreign Individual Investor'], a: 0 },
    { q: 'What is EBITDA?', o: ['Earnings Before Interest Taxes Depreciation Amortization', 'Export Before Internal Tax Deduction', 'Equity Based Investment Tax Deduction', 'None of these'], a: 0 },
    { q: 'Circuit breakers are triggered when?', o: ['Volume is high', 'Index moves beyond set percentage', 'A company reports earnings', 'Market opens'], a: 1 },
    { q: 'What is book value?', o: ['Market price per share', 'Net asset value per share', 'Revenue per share', 'Dividend per share'], a: 1 }
];

const ACHIEVEMENTS = [
    { id: 'first_trade', name: 'First Trade', icon: '🎯', desc: 'Place your first trade', check: s => s.totalTrades >= 1 },
    { id: 'ten_trades', name: '10 Trades', icon: '📊', desc: 'Complete 10 trades', check: s => s.totalTrades >= 10 },
    { id: 'fifty_trades', name: '50 Trades', icon: '🔥', desc: 'Complete 50 trades', check: s => s.totalTrades >= 50 },
    { id: 'first_profit', name: 'First Profit', icon: '💰', desc: 'Make your first profitable trade', check: s => s.profitableTrades >= 1 },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', desc: 'Score 10/10 in a quiz', check: s => s.perfectQuiz },
    { id: 'predictor', name: 'Predictor', icon: '🎯', desc: 'Make 10 correct predictions', check: s => s.correctPredictions >= 10 },
    { id: 'streak_5', name: 'Hot Streak', icon: '🔥', desc: '5 correct predictions in a row', check: s => s.maxStreak >= 5 },
    { id: 'level_10', name: 'Rising Star', icon: '⭐', desc: 'Reach Level 10', check: s => s.level >= 10 },
    { id: 'level_25', name: 'Market Pro', icon: '🏅', desc: 'Reach Level 25', check: s => s.level >= 25 },
    { id: 'level_50', name: 'Trading Legend', icon: '🏆', desc: 'Reach Level 50', check: s => s.level >= 50 },
    { id: 'diversified', name: 'Diversified', icon: '🎨', desc: 'Hold 5+ different stocks', check: s => s.uniqueHoldings >= 5 },
    { id: 'millionaire', name: 'Millionaire', icon: '💎', desc: 'Portfolio value exceeds ₹10,00,000', check: s => s.totalValue >= 1000000 }
];

/* ===== STATE MANAGER ===== */
const State = {
    data: null,
    currentPhone: null,
    _key() {
        return this.currentPhone ? 'paperbull_' + this.currentPhone : 'paperbull_state';
    },
    defaults() {
        return {
            user: null,
            capital: 100000,
            holdings: [],
            positions: [],
            fnoPositions: [],
            orders: [],
            predictions: [],
            portfolioHistory: [{ t: Date.now(), v: 100000 }],
            xp: 0,
            level: 1,
            totalTrades: 0,
            profitableTrades: 0,
            perfectQuiz: false,
            correctPredictions: 0,
            maxStreak: 0,
            currentStreak: 0,
            achievements: [],
            theme: 'dark',
            autoRefresh: true,
            sound: false,
            introSeen: false,
            priceSnapshots: {},
            cloudSyncId: null,
            lastModified: Date.now()
        };
    },
    load(phone) {
        this.currentPhone = phone || null;
        try {
            const d = localStorage.getItem(this._key());
            this.data = d ? { ...this.defaults(), ...JSON.parse(d) } : this.defaults();
        } catch (e) { this.data = this.defaults(); }
        return this.data;
    },
    save() {
        this.data.lastModified = Date.now();
        try { localStorage.setItem(this._key(), JSON.stringify(this.data)); } catch (e) { }
        // Trigger cloud sync if available
        if (typeof CloudSync !== 'undefined' && CloudSync.debouncedSync) CloudSync.debouncedSync();
    },
    get(k) { return this.data[k]; },
    set(k, v) { this.data[k] = v; this.save(); },
    update(fn) { fn(this.data); this.save(); }
};

/* ===== MARKET ENGINE ===== */
const Market = {
    stocks: {},
    indices: { nifty: { val: 22450, open: 22450, prev: 22380 }, sensex: { val: 73800, open: 73800, prev: 73650 }, banknifty: { val: 47200, open: 47200, prev: 47050 } },
    interval: null,
    tickCount: 0,

    init() {
        const snap = State.get('priceSnapshots') || {};
        STOCKS.forEach(s => {
            const saved = snap[s.sym];
            const open = saved ? saved.open : s.base * (1 + (Math.random() - 0.5) * 0.01);
            const ltp = saved ? saved.ltp : open;
            this.stocks[s.sym] = {
                ...s,
                ltp: ltp,
                open: open,
                prev: saved ? saved.prev : s.base,
                high: saved ? saved.high : open,
                low: saved ? saved.low : open,
                change: 0, changePct: 0,
                volume: saved ? saved.volume : Math.floor(Math.random() * 5000000) + 500000,
                bid: 0, ask: 0,
                history: saved ? saved.history : [],
                dayHistory: saved ? saved.dayHistory : [],
                candles: saved && saved.candles ? saved.candles : this._generateHistoricalCandles(s.base, s.vol, 30),
                _candleOpen: ltp, _candleHigh: ltp, _candleLow: ltp, _candleTicks: 0
            };
            this._updateDerived(s.sym);
        });
    },

    _generateHistoricalCandles(basePrice, volatility, count) {
        const candles = [];
        let price = basePrice * (1 + (Math.random() - 0.5) * 0.05);
        const now = Date.now();
        for (let i = count; i > 0; i--) {
            const o = price;
            const move1 = price * volatility * (Math.random() - 0.5) * 2;
            const move2 = price * volatility * (Math.random() - 0.5) * 2;
            const h = Math.max(o, o + Math.abs(move1) * 1.5);
            const l = Math.min(o, o - Math.abs(move2) * 1.5);
            const c = o + (move1 + move2) * 0.3;
            price = c;
            candles.push({
                o: +o.toFixed(2), h: +h.toFixed(2), l: +l.toFixed(2), c: +c.toFixed(2),
                t: now - i * 20000, v: Math.floor(Math.random() * 100000) + 10000
            });
        }
        return candles;
    },

    _updateDerived(sym) {
        const s = this.stocks[sym];
        s.change = s.ltp - s.prev;
        s.changePct = (s.change / s.prev) * 100;
        const spread = s.ltp * 0.001;
        s.bid = +(s.ltp - spread / 2).toFixed(2);
        s.ask = +(s.ltp + spread / 2).toFixed(2);
        s.high = Math.max(s.high, s.ltp);
        s.low = Math.min(s.low, s.ltp);
    },

    isMarketOpen() {
        const now = new Date();
        const day = now.getDay();
        if (day === 0 || day === 6) return false;
        const mins = now.getHours() * 60 + now.getMinutes();
        return mins >= 555 && mins <= 930; // 9:15 - 15:30
    },

    tick() {
        this.tickCount++;
        const open = this.isMarketOpen();
        const drift = open ? 0.0001 : 0;
        Object.keys(this.stocks).forEach(sym => {
            const s = this.stocks[sym];
            const v = open ? s.vol : s.vol * 0.1;
            const r = (Math.random() - 0.5) * 2;
            const dS = s.ltp * (drift + v * r * Math.sqrt(1 / 390));
            s.ltp = Math.max(s.ltp * 0.7, +(s.ltp + dS).toFixed(2));
            if (open) s.volume += Math.floor(Math.random() * 50000);
            s.dayHistory.push(s.ltp);
            if (s.dayHistory.length > 200) s.dayHistory.shift();
            // Build candle data
            s._candleHigh = Math.max(s._candleHigh, s.ltp);
            s._candleLow = Math.min(s._candleLow, s.ltp);
            s._candleTicks++;
            if (s._candleTicks >= 10) {
                s.candles.push({
                    o: +s._candleOpen.toFixed(2), h: +s._candleHigh.toFixed(2),
                    l: +s._candleLow.toFixed(2), c: +s.ltp.toFixed(2),
                    t: Date.now(), v: Math.floor(Math.random() * 100000) + 10000
                });
                if (s.candles.length > 60) s.candles.shift();
                s._candleOpen = s.ltp; s._candleHigh = s.ltp; s._candleLow = s.ltp; s._candleTicks = 0;
            }
            this._updateDerived(sym);
        });
        // Update indices
        const nif = this._avgChange(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'ITC', 'SBIN', 'BHARTIARTL', 'LT', 'AXISBANK']);
        this.indices.nifty.val = +(this.indices.nifty.open * (1 + nif)).toFixed(2);
        const sen = this._avgChange(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'KOTAKBANK', 'BAJFINANCE', 'MARUTI', 'LT']);
        this.indices.sensex.val = +(this.indices.sensex.open * (1 + sen)).toFixed(2);
        const bn = this._avgChange(['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'BAJFINANCE', 'INDUSINDBK', 'BAJAJFINSV', 'BANKBARODA', 'SBILIFE']);
        this.indices.banknifty.val = +(this.indices.banknifty.open * (1 + bn)).toFixed(2);
        this._saveSnap();
    },

    _avgChange(syms) {
        let total = 0, count = 0;
        syms.forEach(s => { if (this.stocks[s]) { total += this.stocks[s].changePct / 100; count++; } });
        return count ? total / count : 0;
    },

    _saveSnap() {
        const snap = {};
        Object.keys(this.stocks).forEach(sym => {
            const s = this.stocks[sym];
            snap[sym] = { ltp: s.ltp, open: s.open, prev: s.prev, high: s.high, low: s.low, volume: s.volume, history: s.history, dayHistory: s.dayHistory.slice(-200), candles: s.candles.slice(-60) };
        });
        State.set('priceSnapshots', snap);
    },

    start() {
        this.interval = setInterval(() => {
            this.tick();
            if (typeof MarketUI !== 'undefined') MarketUI.refresh();
            if (typeof PortfolioUI !== 'undefined') PortfolioUI.refresh();
        }, 2000);
    },

    stop() { if (this.interval) clearInterval(this.interval); }
};

/* ===== TRADING ENGINE ===== */
const Trading = {
    placeOrder(sym, side, qty, mode, type, limitPrice) {
        const stock = Market.stocks[sym];
        if (!stock) return { ok: false, msg: 'Stock not found' };
        qty = parseInt(qty);
        if (!qty || qty < 1) return { ok: false, msg: 'Invalid quantity' };

        const price = type === 'LIMIT' ? parseFloat(limitPrice) : (side === 'BUY' ? stock.ask : stock.bid);
        if (type === 'LIMIT' && (!price || price <= 0)) return { ok: false, msg: 'Invalid limit price' };

        const leverage = mode === 'INTRADAY' ? 5 : 1;
        const value = price * qty;
        const margin = value / leverage;

        if (side === 'BUY' && margin > State.get('capital')) return { ok: false, msg: 'Insufficient capital. Need ₹' + margin.toFixed(0) };

        const order = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
            date: new Date().toLocaleDateString('en-IN'),
            sym, side, mode, type, qty, price,
            status: type === 'LIMIT' ? 'OPEN' : 'EXECUTED',
            value, margin
        };

        State.update(d => { d.orders.unshift(order); });

        if (order.status === 'EXECUTED') {
            this._executeOrder(order);
        }

        return { ok: true, order };
    },

    _executeOrder(order) {
        State.update(d => {
            if (order.side === 'BUY') {
                d.capital -= order.margin;
                const list = order.mode === 'CNC' ? d.holdings : d.positions;
                const existing = list.find(h => h.sym === order.sym && h.mode === order.mode);
                if (existing) {
                    const totalQty = existing.qty + order.qty;
                    existing.avg = ((existing.avg * existing.qty) + (order.price * order.qty)) / totalQty;
                    existing.qty = totalQty;
                } else {
                    list.push({ sym: order.sym, qty: order.qty, avg: order.price, mode: order.mode });
                }
            } else { // SELL
                const list = order.mode === 'CNC' ? d.holdings : d.positions;
                const existing = list.find(h => h.sym === order.sym);
                if (existing) {
                    const pnl = (order.price - existing.avg) * order.qty;
                    d.capital += order.price * order.qty;
                    if (pnl > 0) d.profitableTrades++;
                    existing.qty -= order.qty;
                    if (existing.qty <= 0) {
                        const idx = list.indexOf(existing);
                        list.splice(idx, 1);
                    }
                }
            }
            d.totalTrades++;
            d.xp += 25;
            this._checkLevelUp(d);
            // Portfolio history
            const totalVal = this._calcTotalValue(d);
            d.portfolioHistory.push({ t: Date.now(), v: totalVal });
            if (d.portfolioHistory.length > 500) d.portfolioHistory = d.portfolioHistory.slice(-500);
        });
    },

    _calcTotalValue(d) {
        let val = d.capital;
        d.holdings.forEach(h => { const s = Market.stocks[h.sym]; if (s) val += s.ltp * h.qty; });
        d.positions.forEach(p => { const s = Market.stocks[p.sym]; if (s) val += s.ltp * p.qty; });
        return val;
    },

    _checkLevelUp(d) {
        const xpForLevel = (lvl) => lvl * 100;
        while (d.xp >= xpForLevel(d.level) && d.level < 50) {
            d.xp -= xpForLevel(d.level);
            d.level++;
            d.capital += 50000;
        }
    },

    checkLimitOrders() {
        State.update(d => {
            d.orders.forEach(o => {
                if (o.status !== 'OPEN') return;
                const s = Market.stocks[o.sym];
                if (!s) return;
                if (o.side === 'BUY' && s.ask <= o.price) { o.status = 'EXECUTED'; o.price = s.ask; this._executeOrder(o); }
                if (o.side === 'SELL' && s.bid >= o.price) { o.status = 'EXECUTED'; o.price = s.bid; this._executeOrder(o); }
            });
        });
    },

    autoSquareOff() {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        if (mins >= 915 && mins <= 916) { // 3:15 PM
            State.update(d => {
                d.positions.forEach(p => {
                    const s = Market.stocks[p.sym];
                    if (s) {
                        const pnl = (s.bid - p.avg) * p.qty;
                        d.capital += s.bid * p.qty;
                        if (pnl > 0) d.profitableTrades++;
                        d.orders.unshift({
                            id: Date.now().toString(36), time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
                            date: new Date().toLocaleDateString('en-IN'),
                            sym: p.sym, side: 'SELL', mode: 'INTRADAY', type: 'MARKET', qty: p.qty, price: s.bid,
                            status: 'EXECUTED', value: s.bid * p.qty, margin: 0, auto: true
                        });
                    }
                });
                d.positions = [];
            });
        }
    },

    placeFnOOrder(contract, type, side, lots, price) {
        const lotSize = contract.lot || 50;
        const qty = lots * lotSize;
        const margin = price * qty * 0.2;
        if (side === 'BUY' && margin > State.get('capital')) return { ok: false, msg: 'Insufficient margin' };
        State.update(d => {
            if (side === 'BUY') {
                d.capital -= margin;
                d.fnoPositions.push({
                    contract: contract.name, type, lots, lotSize, avg: price,
                    sym: contract.underlying, expiry: contract.expiry, strike: contract.strike || null,
                    optType: contract.optType || null, margin
                });
            } else {
                const idx = d.fnoPositions.findIndex(p => p.contract === contract.name);
                if (idx >= 0) {
                    const pos = d.fnoPositions[idx];
                    const pnl = (price - pos.avg) * pos.lots * pos.lotSize;
                    d.capital += pos.margin + pnl;
                    d.fnoPositions.splice(idx, 1);
                }
            }
            d.totalTrades++;
            d.xp += 35;
            this._checkLevelUp(d);
        });
        return { ok: true };
    }
};

/* ===== PREDICTION ENGINE ===== */
const PredictionEngine = {
    submit(sym, direction) {
        const stock = Market.stocks[sym];
        if (!stock) return { ok: false, msg: 'Select a stock' };
        const existing = State.get('predictions').find(p => p.sym === sym && p.status === 'PENDING');
        if (existing) return { ok: false, msg: 'Already have a pending prediction for ' + sym };

        State.update(d => {
            d.predictions.unshift({
                id: Date.now(), sym, direction, priceAt: stock.ltp,
                time: new Date().toLocaleString('en-IN'), status: 'PENDING'
            });
        });
        return { ok: true };
    },

    resolve() {
        State.update(d => {
            d.predictions.forEach(p => {
                if (p.status !== 'PENDING') return;
                const stock = Market.stocks[p.sym];
                if (!stock) return;
                const diff = stock.ltp - p.priceAt;
                const actual = diff >= 0 ? 'UP' : 'DOWN';
                if (Math.abs(diff) < p.priceAt * 0.001) return; // Not enough movement
                p.status = actual === p.direction ? 'CORRECT' : 'WRONG';
                p.resolvedPrice = stock.ltp;
                if (p.status === 'CORRECT') {
                    d.correctPredictions++;
                    d.currentStreak++;
                    d.maxStreak = Math.max(d.maxStreak, d.currentStreak);
                    d.xp += 50 + (d.currentStreak * 10);
                    Trading._checkLevelUp(d);
                } else {
                    d.currentStreak = 0;
                }
            });
        });
    }
};

/* ===== F&O ENGINE ===== */
const FnO = {
    getChain(underlying, expiry, type) {
        const stock = Market.stocks[underlying] || { ltp: 22450, vol: 0.02 };
        const spotPrice = underlying === 'NIFTY' ? Market.indices.nifty.val :
            underlying === 'BANKNIFTY' ? Market.indices.banknifty.val : stock.ltp;
        const lotSize = underlying === 'NIFTY' ? 50 : underlying === 'BANKNIFTY' ? 25 :
            (Market.stocks[underlying] ? Market.stocks[underlying].lot : 100);
        if (type === 'FUT') {
            const futurePrice = +(spotPrice * 1.002).toFixed(2);
            return [{
                name: underlying + ' FUT ' + expiry, underlying, expiry, lot: lotSize,
                ltp: futurePrice, change: +(futurePrice - spotPrice * 1.001).toFixed(2),
                oi: Math.floor(Math.random() * 500000) + 50000
            }];
        }
        // Options chain
        const step = underlying === 'NIFTY' ? 50 : underlying === 'BANKNIFTY' ? 100 :
            spotPrice > 5000 ? 100 : spotPrice > 1000 ? 50 : 10;
        const atm = Math.round(spotPrice / step) * step;
        const strikes = [];
        for (let i = -5; i <= 5; i++) {
            const strike = atm + i * step;
            const d1 = this._d1(spotPrice, strike, 0.07, stock.vol || 0.02, 30 / 365);
            const callPrice = Math.max(0.05, +(this._bsCall(spotPrice, strike, 0.07, stock.vol || 0.02, 30 / 365)).toFixed(2));
            const putPrice = Math.max(0.05, +(callPrice - spotPrice + strike * Math.exp(-0.07 * 30 / 365)).toFixed(2));
            const delta = +(this._normCdf(d1)).toFixed(3);
            strikes.push({
                strike, underlying, expiry, lot: lotSize,
                call: {
                    ltp: callPrice, delta, oi: Math.floor(Math.random() * 200000) + 10000,
                    name: underlying + ' ' + strike + ' CE ' + expiry, optType: 'CE'
                },
                put: {
                    ltp: Math.max(0.05, putPrice), delta: +(delta - 1).toFixed(3), oi: Math.floor(Math.random() * 200000) + 10000,
                    name: underlying + ' ' + strike + ' PE ' + expiry, optType: 'PE'
                }
            });
        }
        return strikes;
    },

    _d1(S, K, r, v, t) { return (Math.log(S / K) + (r + v * v / 2) * t) / (v * Math.sqrt(t)); },
    _normCdf(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = x < 0 ? -1 : 1; x = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * x);
        const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x); return 0.5 * (1 + sign * y);
    },
    _bsCall(S, K, r, v, t) {
        const d1 = this._d1(S, K, r, v, t); const d2 = d1 - v * Math.sqrt(t);
        return S * this._normCdf(d1) - K * Math.exp(-r * t) * this._normCdf(d2);
    }
};
