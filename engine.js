/* ===== STOCK DATA & SIMULATION ENGINE ===== */
const STOCKS = [
    { sym: 'RELIANCE', name: 'Reliance Industries', ex: 'NSE', sec: 'Energy', base: 2920, lot: 250, vol: 0.8 },
    { sym: 'TCS', name: 'Tata Consultancy', ex: 'NSE', sec: 'IT', base: 3850, lot: 150, vol: 0.5 },
    { sym: 'INFY', name: 'Infosys', ex: 'NSE', sec: 'IT', base: 1580, lot: 300, vol: 0.6 },
    { sym: 'HDFCBANK', name: 'HDFC Bank', ex: 'NSE', sec: 'Banking', base: 1680, lot: 550, vol: 0.65 },
    { sym: 'ICICIBANK', name: 'ICICI Bank', ex: 'NSE', sec: 'Banking', base: 1250, lot: 700, vol: 0.7 },
    { sym: 'SBIN', name: 'State Bank of India', ex: 'NSE', sec: 'Banking', base: 830, lot: 750, vol: 0.9 },
    { sym: 'WIPRO', name: 'Wipro', ex: 'NSE', sec: 'IT', base: 560, lot: 1500, vol: 0.8 },
    { sym: 'BAJFINANCE', name: 'Bajaj Finance', ex: 'NSE', sec: 'Banking', base: 7200, lot: 125, vol: 1.0 },
    { sym: 'ADANIPORTS', name: 'Adani Ports', ex: 'BSE', sec: 'Infra', base: 1380, lot: 400, vol: 1.1 },
    { sym: 'ADANIENT', name: 'Adani Enterprises', ex: 'BSE', sec: 'Infra', base: 2850, lot: 250, vol: 1.6 },
    { sym: 'MARUTI', name: 'Maruti Suzuki', ex: 'NSE', sec: 'Auto', base: 12800, lot: 100, vol: 0.7 },
    { sym: 'TATAMOTORS', name: 'Tata Motors', ex: 'NSE', sec: 'Auto', base: 940, lot: 1400, vol: 1.2 },
    { sym: 'SUNPHARMA', name: 'Sun Pharmaceutical', ex: 'NSE', sec: 'Pharma', base: 1750, lot: 350, vol: 0.7 },
    { sym: 'LT', name: 'Larsen & Toubro', ex: 'NSE', sec: 'Infra', base: 3650, lot: 150, vol: 0.65 },
    { sym: 'ASIANPAINT', name: 'Asian Paints', ex: 'NSE', sec: 'FMCG', base: 2380, lot: 300, vol: 0.6 },
    { sym: 'NESTLEIND', name: 'Nestle India', ex: 'NSE', sec: 'FMCG', base: 2240, lot: 200, vol: 0.4 },
    { sym: 'HINDUNILVR', name: 'Hindustan Unilever', ex: 'NSE', sec: 'FMCG', base: 2480, lot: 300, vol: 0.4 },
    { sym: 'TITAN', name: 'Titan Company', ex: 'NSE', sec: 'FMCG', base: 3520, lot: 175, vol: 0.8 },
    { sym: 'POWERGRID', name: 'Power Grid Corp', ex: 'NSE', sec: 'Energy', base: 340, lot: 2800, vol: 0.5 },
    { sym: 'NTPC', name: 'NTPC Limited', ex: 'NSE', sec: 'Energy', base: 385, lot: 2400, vol: 0.55 },
    { sym: 'COALINDIA', name: 'Coal India', ex: 'BSE', sec: 'Energy', base: 490, lot: 2400, vol: 0.7 },
    { sym: 'ONGC', name: 'Oil & Natural Gas', ex: 'NSE', sec: 'Energy', base: 280, lot: 3850, vol: 0.8 },
    { sym: 'BHARTIARTL', name: 'Bharti Airtel', ex: 'NSE', sec: 'IT', base: 1870, lot: 475, vol: 0.6 },
    { sym: 'HCLTECH', name: 'HCL Technologies', ex: 'NSE', sec: 'IT', base: 1540, lot: 350, vol: 0.6 },
    { sym: 'TECHM', name: 'Tech Mahindra', ex: 'BSE', sec: 'IT', base: 1720, lot: 600, vol: 0.8 },
    { sym: 'ULTRACEMCO', name: 'UltraTech Cement', ex: 'NSE', sec: 'Cement', base: 11900, lot: 100, vol: 0.6 },
    { sym: 'GRASIM', name: 'Grasim Industries', ex: 'BSE', sec: 'Cement', base: 2790, lot: 250, vol: 0.7 },
    { sym: 'CIPLA', name: 'Cipla', ex: 'BSE', sec: 'Pharma', base: 1620, lot: 650, vol: 0.65 },
    { sym: 'DRREDDY', name: 'Dr Reddys Labs', ex: 'BSE', sec: 'Pharma', base: 6200, lot: 250, vol: 0.7 },
    { sym: 'EICHERMOT', name: 'Eicher Motors', ex: 'BSE', sec: 'Auto', base: 5100, lot: 150, vol: 0.75 },
    { sym: 'BAJAJ-AUTO', name: 'Bajaj Auto', ex: 'NSE', sec: 'Auto', base: 9500, lot: 125, vol: 0.65 },
    { sym: 'HEROMOTOCO', name: 'Hero MotoCorp', ex: 'BSE', sec: 'Auto', base: 5400, lot: 300, vol: 0.6 },
    { sym: 'DIVISLAB', name: 'Divis Laboratories', ex: 'BSE', sec: 'Pharma', base: 5800, lot: 100, vol: 0.75 },
    { sym: 'BRITANNIA', name: 'Britannia Industries', ex: 'BSE', sec: 'FMCG', base: 5200, lot: 200, vol: 0.5 },
    { sym: 'APOLLOHOSP', name: 'Apollo Hospitals', ex: 'NSE', sec: 'Pharma', base: 7100, lot: 125, vol: 0.8 },
    { sym: 'TATACONSUM', name: 'Tata Consumer', ex: 'NSE', sec: 'FMCG', base: 1100, lot: 900, vol: 0.7 },
    { sym: 'HINDALCO', name: 'Hindalco Industries', ex: 'NSE', sec: 'Metal', base: 680, lot: 1075, vol: 1.0 },
    { sym: 'JSWSTEEL', name: 'JSW Steel', ex: 'NSE', sec: 'Metal', base: 960, lot: 675, vol: 1.1 },
    { sym: 'TATASTEEL', name: 'Tata Steel', ex: 'NSE', sec: 'Metal', base: 165, lot: 6500, vol: 1.2 },
    { sym: 'VEDL', name: 'Vedanta Limited', ex: 'NSE', sec: 'Metal', base: 470, lot: 1500, vol: 1.3 },
    { sym: 'BPCL', name: 'Bharat Petroleum', ex: 'BSE', sec: 'Energy', base: 340, lot: 2400, vol: 0.85 },
    { sym: 'IOC', name: 'Indian Oil Corp', ex: 'NSE', sec: 'Energy', base: 165, lot: 4800, vol: 0.8 },
    { sym: 'HPCL', name: 'Hindustan Petroleum', ex: 'NSE', sec: 'Energy', base: 390, lot: 2700, vol: 0.9 },
    { sym: 'M&M', name: 'Mahindra & Mahindra', ex: 'BSE', sec: 'Auto', base: 3100, lot: 350, vol: 0.8 },
    { sym: 'BAJAJFINSV', name: 'Bajaj Finserv', ex: 'BSE', sec: 'Banking', base: 1980, lot: 500, vol: 0.85 },
    { sym: 'SHRIRAMFIN', name: 'Shriram Finance', ex: 'NSE', sec: 'Banking', base: 650, lot: 800, vol: 0.9 },
    { sym: 'SBILIFE', name: 'SBI Life Insurance', ex: 'NSE', sec: 'Banking', base: 1650, lot: 375, vol: 0.6 },
    { sym: 'HDFCLIFE', name: 'HDFC Life Insurance', ex: 'NSE', sec: 'Banking', base: 700, lot: 1100, vol: 0.55 },
    { sym: 'ICICIPRULI', name: 'ICICI Prudential', ex: 'NSE', sec: 'Banking', base: 720, lot: 1000, vol: 0.6 },
    { sym: 'INDUSINDBK', name: 'IndusInd Bank', ex: 'BSE', sec: 'Banking', base: 1020, lot: 900, vol: 1.1 },
    { sym: 'AXISBANK', name: 'Axis Bank', ex: 'NSE', sec: 'Banking', base: 1190, lot: 625, vol: 0.75 },
    { sym: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ex: 'NSE', sec: 'Banking', base: 1980, lot: 400, vol: 0.65 },
    { sym: 'PIDILITIND', name: 'Pidilite Industries', ex: 'NSE', sec: 'FMCG', base: 3100, lot: 250, vol: 0.5 },
    { sym: 'SIEMENS', name: 'Siemens India', ex: 'NSE', sec: 'Infra', base: 7200, lot: 75, vol: 0.7 },
    { sym: 'HAVELLS', name: 'Havells India', ex: 'NSE', sec: 'Infra', base: 1820, lot: 500, vol: 0.65 },
    { sym: 'VOLTAS', name: 'Voltas Limited', ex: 'NSE', sec: 'Infra', base: 1680, lot: 500, vol: 0.7 },
    { sym: 'GODREJCP', name: 'Godrej Consumer', ex: 'NSE', sec: 'FMCG', base: 1320, lot: 500, vol: 0.55 },
    { sym: 'MARICO', name: 'Marico Limited', ex: 'NSE', sec: 'FMCG', base: 680, lot: 1200, vol: 0.5 },
    { sym: 'DABUR', name: 'Dabur India', ex: 'NSE', sec: 'FMCG', base: 530, lot: 1250, vol: 0.5 },
    { sym: 'COLPAL', name: 'Colgate Palmolive', ex: 'NSE', sec: 'FMCG', base: 2900, lot: 250, vol: 0.4 },
    { sym: 'BERGEPAINT', name: 'Berger Paints', ex: 'NSE', sec: 'FMCG', base: 560, lot: 1100, vol: 0.55 },
    { sym: 'AUROPHARMA', name: 'Aurobindo Pharma', ex: 'NSE', sec: 'Pharma', base: 1280, lot: 500, vol: 0.8 },
    { sym: 'BIOCON', name: 'Biocon Limited', ex: 'NSE', sec: 'Pharma', base: 380, lot: 1800, vol: 0.95 },
    { sym: 'TORNTPHARM', name: 'Torrent Pharma', ex: 'NSE', sec: 'Pharma', base: 3300, lot: 250, vol: 0.6 },
    { sym: 'LUPIN', name: 'Lupin Limited', ex: 'NSE', sec: 'Pharma', base: 2100, lot: 425, vol: 0.75 },
    { sym: 'ALKEM', name: 'Alkem Labs', ex: 'NSE', sec: 'Pharma', base: 5600, lot: 100, vol: 0.6 },
    { sym: 'ZYDUSLIFE', name: 'Zydus Lifesciences', ex: 'NSE', sec: 'Pharma', base: 1120, lot: 700, vol: 0.7 },
    { sym: 'LICHSGFIN', name: 'LIC Housing Finance', ex: 'NSE', sec: 'Banking', base: 710, lot: 1000, vol: 0.9 },
    { sym: 'RECLTD', name: 'REC Limited', ex: 'NSE', sec: 'Energy', base: 560, lot: 1000, vol: 0.85 },
    { sym: 'PFC', name: 'Power Finance Corp', ex: 'NSE', sec: 'Energy', base: 490, lot: 1200, vol: 0.85 },
    { sym: 'IRFC', name: 'Indian Railway Finance', ex: 'NSE', sec: 'Infra', base: 195, lot: 5000, vol: 1.0 },
    { sym: 'IRCTC', name: 'IRCTC Limited', ex: 'NSE', sec: 'Infra', base: 790, lot: 875, vol: 0.9 },
    { sym: 'CANBK', name: 'Canara Bank', ex: 'BSE', sec: 'Banking', base: 105, lot: 6750, vol: 1.2 },
    { sym: 'BANKBARODA', name: 'Bank of Baroda', ex: 'BSE', sec: 'Banking', base: 255, lot: 2925, vol: 1.1 },
    { sym: 'PNB', name: 'Punjab National Bank', ex: 'BSE', sec: 'Banking', base: 115, lot: 6000, vol: 1.3 },
    { sym: 'FEDERALBNK', name: 'Federal Bank', ex: 'NSE', sec: 'Banking', base: 205, lot: 5000, vol: 0.9 },
    { sym: 'IDFCFIRSTB', name: 'IDFC First Bank', ex: 'NSE', sec: 'Banking', base: 82, lot: 10000, vol: 1.2 },
    { sym: 'YESBANK', name: 'Yes Bank', ex: 'NSE', sec: 'Banking', base: 24, lot: 25000, vol: 1.8 },
    { sym: 'ZOMATO', name: 'Zomato Limited', ex: 'NSE', sec: 'IT', base: 235, lot: 3000, vol: 1.5 },
    { sym: 'PAYTM', name: 'One97 Communications', ex: 'NSE', sec: 'IT', base: 890, lot: 800, vol: 1.6 },
    { sym: 'NYKAA', name: 'FSN E-Commerce', ex: 'NSE', sec: 'FMCG', base: 185, lot: 5000, vol: 1.4 },
    { sym: 'POLICYBZR', name: 'PB Fintech', ex: 'NSE', sec: 'Banking', base: 1820, lot: 400, vol: 1.4 },
    { sym: 'DELHIVERY', name: 'Delhivery Limited', ex: 'NSE', sec: 'Infra', base: 390, lot: 1750, vol: 1.3 },
    { sym: 'TATAELXSI', name: 'Tata Elxsi', ex: 'NSE', sec: 'IT', base: 6200, lot: 125, vol: 1.1 },
    { sym: 'KPITTECH', name: 'KPIT Technologies', ex: 'NSE', sec: 'IT', base: 1580, lot: 500, vol: 1.2 },
    { sym: 'PERSISTENT', name: 'Persistent Systems', ex: 'NSE', sec: 'IT', base: 5800, lot: 100, vol: 1.0 },
    { sym: 'MPHASIS', name: 'Mphasis Limited', ex: 'NSE', sec: 'IT', base: 2900, lot: 350, vol: 0.9 },
    { sym: 'COFORGE', name: 'Coforge Limited', ex: 'NSE', sec: 'IT', base: 8100, lot: 75, vol: 0.95 },
    { sym: 'LTTS', name: 'L&T Technology', ex: 'NSE', sec: 'IT', base: 4900, lot: 150, vol: 0.85 },
    { sym: 'LTIM', name: 'LTIMindtree', ex: 'NSE', sec: 'IT', base: 5200, lot: 150, vol: 0.8 },
    { sym: 'NAUKRI', name: 'Info Edge India', ex: 'NSE', sec: 'IT', base: 7800, lot: 75, vol: 0.9 },
    { sym: 'ITC', name: 'ITC Limited', ex: 'NSE', sec: 'FMCG', base: 458, lot: 1600, vol: 0.45 },
    { sym: 'SHREECEM', name: 'Shree Cement', ex: 'NSE', sec: 'Cement', base: 26800, lot: 25, vol: 0.6 }
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

/* ===== GLOBAL FORMAT PRICE ===== */
function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ===== MARKET HOURS ===== */
const MarketHours = {
    // NSE 2025 holidays (month is 0-indexed)
    _holidays: [
        { m: 0, d: 26 }, // Republic Day
        { m: 2, d: 14 }, // Holi
        { m: 3, d: 14 }, // Ambedkar Jayanti
        { m: 3, d: 18 }, // Good Friday
        { m: 4, d: 1 },  // Maharashtra Day
        { m: 7, d: 15 }, // Independence Day
        { m: 7, d: 27 }, // Ganesh Chaturthi
        { m: 9, d: 2 },  // Gandhi Jayanti
        { m: 9, d: 20 }, // Diwali Laxmi Pujan
        { m: 9, d: 21 }, // Diwali Balipratipada
        { m: 10, d: 5 }, // Gurunanak Jayanti
        { m: 11, d: 25 } // Christmas
    ],

    _getIST() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utc + 5.5 * 3600000);
    },

    _isHoliday(ist) {
        const m = ist.getMonth();
        const d = ist.getDate();
        return this._holidays.some(h => h.m === m && h.d === d);
    },

    isOpen() {
        const ist = this._getIST();
        const day = ist.getDay();
        if (day === 0 || day === 6) return false;
        if (this._isHoliday(ist)) return false;
        const mins = ist.getHours() * 60 + ist.getMinutes();
        return mins >= 555 && mins <= 930; // 9:15 - 15:30
    },

    getStatus() {
        const ist = this._getIST();
        const day = ist.getDay();
        if (day === 0 || day === 6) return 'closed';
        if (this._isHoliday(ist)) return 'closed';
        const mins = ist.getHours() * 60 + ist.getMinutes();
        if (mins >= 540 && mins < 555) return 'pre-market'; // 09:00-09:14
        if (mins >= 555 && mins <= 930) return 'open'; // 09:15-15:30
        if (mins > 930 && mins <= 960) return 'post-market'; // 15:31-16:00
        return 'closed';
    },

    getNextOpenIST() {
        const ist = this._getIST();
        let candidate = new Date(ist);
        // If market is currently open, next open is tomorrow
        if (this.getStatus() === 'open') {
            candidate.setDate(candidate.getDate() + 1);
        }
        // Set to 9:15
        candidate.setHours(9, 15, 0, 0);
        // If today's open time already passed
        const nowMins = ist.getHours() * 60 + ist.getMinutes();
        if (candidate.getDate() === ist.getDate() && nowMins >= 555) {
            candidate.setDate(candidate.getDate() + 1);
        }
        // Skip weekends and holidays
        for (let i = 0; i < 10; i++) {
            const day = candidate.getDay();
            if (day === 0) { candidate.setDate(candidate.getDate() + 1); continue; }
            if (day === 6) { candidate.setDate(candidate.getDate() + 2); continue; }
            if (this._isHoliday(candidate)) { candidate.setDate(candidate.getDate() + 1); continue; }
            break;
        }
        candidate.setHours(9, 15, 0, 0);
        return candidate;
    },

    getNextOpenCountdown() {
        const ist = this._getIST();
        const next = this.getNextOpenIST();
        const diff = next.getTime() - ist.getTime();
        if (diff <= 0) return '00:00:00';
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    getISTString() {
        const ist = this._getIST();
        return ist.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    }
};

/* ===== STATE MANAGER ===== */
const State = {
    data: null,
    currentUserId: null,
    _key() {
        return this.currentUserId ? 'paperbull_state_' + this.currentUserId : 'paperbull_state';
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
            lastModified: Date.now(),
            activityLog: []
        };
    },
    load(userId) {
        this.currentUserId = userId || null;
        try {
            const d = localStorage.getItem(this._key());
            this.data = d ? { ...this.defaults(), ...JSON.parse(d) } : this.defaults();
        } catch (e) { this.data = this.defaults(); }
        return this.data;
    },
    save() {
        this.data.lastModified = Date.now();
        try { localStorage.setItem(this._key(), JSON.stringify(this.data)); } catch (e) { }
        if (typeof CloudSync !== 'undefined' && CloudSync.debouncedSync) CloudSync.debouncedSync();
    },
    get(k) { return this.data ? this.data[k] : undefined; },
    set(k, v) { if (this.data) { this.data[k] = v; this.save(); } },
    update(fn) { if (this.data) { fn(this.data); this.save(); } },
    logActivity(type, detail) {
        if (!this.data) return;
        if (!this.data.activityLog) this.data.activityLog = [];
        this.data.activityLog.unshift({
            ts: Date.now(),
            type: type,
            detail: detail,
            user: this.data.user ? this.data.user.name : 'Unknown',
            email: this.data.user ? this.data.user.email : ''
        });
        if (this.data.activityLog.length > 500) this.data.activityLog = this.data.activityLog.slice(0, 500);
        this.save();
    }
};

/* ===== MARKET ENGINE ===== */
const Market = {
    stocks: {},
    indices: { nifty: { val: 22450, open: 22450, prev: 22380 }, sensex: { val: 73800, open: 73800, prev: 73650 }, banknifty: { val: 47200, open: 47200, prev: 47050 } },
    interval: null,
    tickCount: 0,
    _prevStatus: null,

    init() {
        const snap = (State.data && State.get('priceSnapshots')) ? State.get('priceSnapshots') : {};
        STOCKS.forEach(s => {
            const saved = snap[s.sym];
            const open = saved ? saved.open : s.base * (1 + (Math.random() - 0.5) * 0.01);
            const ltp = saved ? saved.ltp : open;
            this.stocks[s.sym] = {
                ...s,
                ltp: ltp,
                open: open,
                prevClose: saved ? saved.prevClose : s.base,
                prev: saved ? saved.prev : s.base,
                high: saved ? saved.high : Math.max(open, ltp),
                low: saved ? saved.low : Math.min(open, ltp),
                change: 0, changePct: 0,
                volume: saved ? saved.volume : Math.floor(Math.random() * 5000000) + 500000,
                bid: 0, ask: 0,
                history: saved ? saved.history : [],
                dayHistory: saved ? saved.dayHistory : [],
                candles: saved && saved.candles ? saved.candles : this._generateHistoricalCandles(s.base, s.vol, 30),
                _candleOpen: ltp, _candleHigh: ltp, _candleLow: ltp, _candleTicks: 0,
                _sessionOpen: open
            };
            this._updateDerived(s.sym);
        });
    },

    _generateHistoricalCandles(basePrice, volatility, count) {
        const candles = [];
        let price = basePrice * (1 + (Math.random() - 0.5) * 0.05);
        const now = Date.now();
        const volFactor = (volatility || 0.8) / 100;
        for (let i = count; i > 0; i--) {
            const o = price;
            const move1 = price * volFactor * (Math.random() - 0.5) * 2;
            const move2 = price * volFactor * (Math.random() - 0.5) * 2;
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
        s.changePct = s.prev ? (s.change / s.prev) * 100 : 0;
        const spread = s.ltp * 0.001;
        s.bid = +(s.ltp - spread / 2).toFixed(2);
        s.ask = +(s.ltp + spread / 2).toFixed(2);
        s.high = Math.max(s.high, s.ltp);
        s.low = Math.min(s.low, s.ltp);
    },

    isMarketOpen() {
        return MarketHours.isOpen();
    },

    _getVolumeMultiplier() {
        const ist = MarketHours._getIST();
        const mins = ist.getHours() * 60 + ist.getMinutes();
        // Higher volume at open (9:15-10:00) and close (14:30-15:30)
        if (mins >= 555 && mins <= 600) return 2.5; // 9:15-10:00
        if (mins >= 870 && mins <= 930) return 2.0; // 14:30-15:30
        if (mins >= 720 && mins <= 810) return 0.6; // 12:00-13:30 midday lull
        return 1.0;
    },

    tick() {
        this.tickCount++;
        const currentStatus = MarketHours.getStatus();
        const open = currentStatus === 'open';

        // Detect market open transition (apply opening gap)
        if (open && this._prevStatus && this._prevStatus !== 'open') {
            // Market just opened — apply opening gap
            Object.keys(this.stocks).forEach(sym => {
                const s = this.stocks[sym];
                const gapPct = (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1); // ±0.5% to ±1.5%
                const newOpen = +(s.prevClose * (1 + gapPct)).toFixed(2);
                s.open = newOpen;
                s.ltp = newOpen;
                s.high = newOpen;
                s.low = newOpen;
                s._sessionOpen = newOpen;
                s.dayHistory = [newOpen];
                s.volume = Math.floor(Math.random() * 500000) + 100000;
                this._updateDerived(sym);
            });
        }
        this._prevStatus = currentStatus;

        // If market is not open, skip all price updates
        if (!open) {
            return;
        }

        const volMultiplier = this._getVolumeMultiplier();

        Object.keys(this.stocks).forEach(sym => {
            const s = this.stocks[sym];
            const volatility = (s.vol || 0.8) / 100; // Convert to percentage scale
            const maxMovePct = 0.0015; // ±0.15% max per tick

            // Mean-reverting random walk
            let drift = 0;
            const deviationFromOpen = (s.ltp - s._sessionOpen) / s._sessionOpen;
            if (Math.abs(deviationFromOpen) > 0.015) {
                // If moved more than 1.5% from session open, increase reversion probability
                drift = -deviationFromOpen * 0.3;
            }

            const r = (Math.random() - 0.5) * 2; // -1 to 1
            let movePct = drift + r * volatility * maxMovePct;
            // Clamp to max move
            movePct = Math.max(-maxMovePct, Math.min(maxMovePct, movePct));

            const dS = s.ltp * movePct;
            s.ltp = Math.max(s.ltp * 0.5, +(s.ltp + dS).toFixed(2));

            // Volume
            const avgDailyVol = s.lot * 5000; // Approximate average daily volume
            const tickVol = Math.floor((Math.random() * avgDailyVol / 250) * volMultiplier);
            s.volume += tickVol;

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
            snap[sym] = { ltp: s.ltp, open: s.open, prev: s.prev, prevClose: s.prevClose || s.prev, high: s.high, low: s.low, volume: s.volume, history: s.history, dayHistory: s.dayHistory.slice(-200), candles: s.candles.slice(-60) };
        });
        if (State.data) State.set('priceSnapshots', snap);
    },

    start() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.tick();
            if (typeof MarketUI !== 'undefined') MarketUI.refresh();
            if (typeof PortfolioUI !== 'undefined') PortfolioUI.refresh();
        }, 1500); // 1.5 second tick interval
    },

    stop() { if (this.interval) { clearInterval(this.interval); this.interval = null; } }
};

/* ===== TRADING ENGINE ===== */
const Trading = {
    placeOrder(sym, side, qty, mode, type, limitPrice) {
        // Market hours check
        if (!MarketHours.isOpen()) {
            if (typeof UI !== 'undefined' && UI.showMarketClosedModal) UI.showMarketClosedModal();
            return { ok: false, msg: 'Market is closed' };
        }
        const stock = Market.stocks[sym];
        if (!stock) return { ok: false, msg: 'Stock not found' };
        qty = parseInt(qty);
        if (!qty || qty < 1) return { ok: false, msg: 'Invalid quantity' };

        const price = type === 'LIMIT' ? parseFloat(limitPrice) : (side === 'BUY' ? stock.ask : stock.bid);
        if (type === 'LIMIT' && (!price || price <= 0)) return { ok: false, msg: 'Invalid limit price' };

        const leverage = mode === 'INTRADAY' ? 5 : 1;
        const value = price * qty;
        const margin = value / leverage;

        if (side === 'BUY' && margin > State.get('capital')) return { ok: false, msg: 'Insufficient capital. Need ' + formatPrice(margin) };

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

        // Log activity
        State.logActivity(side === 'BUY' ? 'buy_order' : 'sell_order', `${side} ${qty} ${sym} @ ${formatPrice(price)}`);

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
            } else {
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
        if (!MarketHours.isOpen()) return;
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
        if (!MarketHours.isOpen()) return;
        const ist = MarketHours._getIST();
        const mins = ist.getHours() * 60 + ist.getMinutes();
        if (mins >= 915 && mins <= 916) {
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
        if (!MarketHours.isOpen()) {
            if (typeof UI !== 'undefined' && UI.showMarketClosedModal) UI.showMarketClosedModal();
            return { ok: false, msg: 'Market is closed' };
        }
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
        State.logActivity('fno_order', `F&O ${side} ${contract.name} @ ${formatPrice(price)}`);
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
                if (Math.abs(diff) < p.priceAt * 0.001) return;
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
        const stock = Market.stocks[underlying] || { ltp: 22450, vol: 0.8 };
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
        const volFactor = (stock.vol || 0.8) / 100;
        const step = underlying === 'NIFTY' ? 50 : underlying === 'BANKNIFTY' ? 100 :
            spotPrice > 5000 ? 100 : spotPrice > 1000 ? 50 : 10;
        const atm = Math.round(spotPrice / step) * step;
        const strikes = [];
        for (let i = -5; i <= 5; i++) {
            const strike = atm + i * step;
            const d1 = this._d1(spotPrice, strike, 0.07, volFactor || 0.02, 30 / 365);
            const callPrice = Math.max(0.05, +(this._bsCall(spotPrice, strike, 0.07, volFactor || 0.02, 30 / 365)).toFixed(2));
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

/* ===== CLOUD USER REGISTRY (for GitHub Pages live tracking) ===== */
const CloudRegistry = {
    // Shared registry bin — all users from the live site get recorded here
    _registryBinId: null, // Will be created on first use
    _apiKey: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    _baseUrl: 'https://api.jsonbin.io/v3/b/',
    _registryKey: 'paperbull_registry_bin_id',

    async _getOrCreateBin() {
        // Check if we already have a registry bin ID stored
        let binId = localStorage.getItem(this._registryKey);
        if (binId) {
            this._registryBinId = binId;
            return binId;
        }

        // Create a new registry bin
        try {
            const res = await fetch(this._baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this._apiKey,
                    'X-Bin-Name': 'paperbull_user_registry',
                    'X-Bin-Private': 'false'
                },
                body: JSON.stringify({ users: [], createdAt: new Date().toISOString() })
            });
            const json = await res.json();
            if (json && json.metadata && json.metadata.id) {
                binId = json.metadata.id;
                this._registryBinId = binId;
                localStorage.setItem(this._registryKey, binId);
                return binId;
            }
        } catch (e) { console.warn('CloudRegistry: Failed to create bin', e); }
        return null;
    },

    async reportUser(userData) {
        try {
            const binId = await this._getOrCreateBin();
            if (!binId) return;

            // Fetch current registry
            const res = await fetch(this._baseUrl + binId + '/latest', {
                headers: { 'X-Master-Key': this._apiKey }
            });
            const json = await res.json();
            let registry = (json && json.record) ? json.record : { users: [] };
            if (!Array.isArray(registry.users)) registry.users = [];

            // Deduplicate by userId
            const existingIdx = registry.users.findIndex(u => u.userId === userData.userId);
            const entry = {
                userId: userData.userId,
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                joined: userData.joined || Date.now(),
                lastLogin: Date.now(),
                lastActive: new Date().toISOString(),
                userAgent: navigator.userAgent.slice(0, 100)
            };

            if (existingIdx >= 0) {
                registry.users[existingIdx] = { ...registry.users[existingIdx], ...entry };
            } else {
                registry.users.push(entry);
            }

            registry.lastUpdated = new Date().toISOString();
            registry.totalUsers = registry.users.length;

            // Save back
            await fetch(this._baseUrl + binId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Master-Key': this._apiKey },
                body: JSON.stringify(registry)
            });
        } catch (e) { console.warn('CloudRegistry: Report failed', e); }
    },

    async fetchAllUsers() {
        try {
            const binId = this._registryBinId || localStorage.getItem(this._registryKey);
            if (!binId) return [];
            const res = await fetch(this._baseUrl + binId + '/latest', {
                headers: { 'X-Master-Key': this._apiKey }
            });
            const json = await res.json();
            if (json && json.record && Array.isArray(json.record.users)) {
                return json.record.users;
            }
        } catch (e) { console.warn('CloudRegistry: Fetch failed', e); }
        return [];
    },

    getRegistryBinId() {
        return this._registryBinId || localStorage.getItem(this._registryKey) || null;
    }
};
