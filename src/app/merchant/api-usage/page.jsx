"use client";
import { useState, useEffect } from 'react';
import styles from '../merchant.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Check, AlertCircle, TrendingUp, CreditCard, ShoppingBag, Eye, Activity, Package, Users, Star, Shield } from 'lucide-react';
/* ── Static demo data ── */
const DAILY = [
    { d: 'Aug 17', t: 42, conv: 9 },
    { d: 'Aug 18', t: 67, conv: 14 },
    { d: 'Aug 19', t: 51, conv: 8 },
    { d: 'Aug 20', t: 89, conv: 19 },
    { d: 'Aug 21', t: 73, conv: 13 },
    { d: 'Aug 22', t: 112, conv: 24 },
    { d: 'Aug 23', t: 95, conv: 18 },
    { d: 'Aug 24', t: 148, conv: 31 },
];
const PRODUCT_USAGE = [
    { name: 'Linen Blazer – Ivory', tries: 312, converted: 67, convRate: 21.5, credits: 312, color: '#6366f1' },
    { name: 'Silk Wrap Dress', tries: 267, converted: 48, convRate: 18.0, credits: 267, color: '#8b5cf6' },
    { name: 'Premium Cotton Kurta', tries: 198, converted: 34, convRate: 17.2, credits: 198, color: '#06b6d4' },
    { name: 'Embroidered Palazzo Set', tries: 143, converted: 19, convRate: 13.3, credits: 143, color: '#10b981' },
    { name: 'Floral Midi Dress', tries: 89, converted: 9, convRate: 10.1, credits: 89, color: '#f59e0b' },
];
const LOG = [
    { id: 'VT-9821', product: 'Linen Blazer – Ivory', user: 'u_***2af', result: 'converted', time: '2 min ago' },
    { id: 'VT-9820', product: 'Silk Wrap Dress', user: 'u_***7bc', result: 'browsed', time: '4 min ago' },
    { id: 'VT-9819', product: 'Linen Blazer – Ivory', user: 'u_***4de', result: 'browsed', time: '7 min ago' },
    { id: 'VT-9818', product: 'Premium Cotton Kurta', user: 'u_***1fg', result: 'converted', time: '12 min ago' },
    { id: 'VT-9817', product: 'Embroidered Palazzo Set', user: 'u_***9gh', result: 'browsed', time: '18 min ago' },
    { id: 'VT-9816', product: 'Silk Wrap Dress', user: 'u_***3ij', result: 'converted', time: '25 min ago' },
    { id: 'VT-9815', product: 'Floral Midi Dress', user: 'u_***5kl', result: 'browsed', time: '31 min ago' },
    { id: 'VT-9814', product: 'Linen Blazer – Ivory', user: 'u_***7mn', result: 'converted', time: '40 min ago' },
];
const PLANS = [
    {
        name: 'Starter', price: 'Free', credits: 200, overage: '$0.05',
        icon: Package, color: '#6b7280',
        features: ['200 try-ons/month', 'Basic analytics', 'Email support', '1 store'],
    },
    {
        name: 'Growth', price: '$29', credits: 2000, overage: '$0.03',
        icon: TrendingUp, color: '#6366f1',
        features: ['2,000 try-ons/month', 'Full analytics dashboard', 'Priority support', 'Credit rollover', '3 stores'],
    },
    {
        name: 'Pro', price: '$99', credits: 10000, overage: '$0.02',
        icon: Star, color: '#8b5cf6',
        features: ['10,000 try-ons/month', 'Advanced analytics', 'Dedicated account support', 'API access', 'Custom branding', 'Unlimited stores'],
        popular: true,
    },
    {
        name: 'Enterprise', price: 'Custom', credits: 0, overage: 'Negotiated',
        icon: Shield, color: '#0ea5e9',
        features: ['Unlimited try-ons', 'White-label solution', 'SLA guarantee', 'Custom API integration', 'Dedicated account manager'],
    },
];
const TOPUP_PACKS = [
    { credits: 500, price: '$10', perCredit: '$0.02', label: '⚡ Starter Pack' },
    { credits: 1500, price: '$25', perCredit: '$0.017', label: '🔥 Growth Pack', popular: true },
    { credits: 3500, price: '$50', perCredit: '$0.014', label: '💎 Pro Pack' },
];
const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length)
        return null;
    return (<div style={{
            background: 'var(--d-panel)', border: '1px solid var(--d-border)',
            borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', marginBottom: 6, fontWeight: 700 }}>{label}</div>
      {payload.map((p, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill || p.color }}/>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--d-t1)' }}>
            {p.value} {p.dataKey === 't' ? 'try-ons' : 'conversions'}
          </span>
        </div>))}
    </div>);
};
export default function ApiUsagePage() {
    const [tab, setTab] = useState('overview');
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [credits, setCredits] = useState({
        total: 2000, used: 1621, remaining: 379, plan: 'Growth'
    });
    useEffect(() => {
        fetch('/api/merchant/credits')
            .then(r => r.json())
            .then(d => { if (d.success && d.credits)
            setCredits(d.credits); })
            .catch(() => { });
    }, []);
    const handleTopup = async (amount) => {
        setLoading(true);
        try {
            const res = await fetch('/api/merchant/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'topup', topupAmount: amount })
            });
            const data = await res.json();
            if (data.success && data.credits) {
                setCredits(data.credits);
                setShowTopupModal(false);
            }
        }
        catch (e) { }
        setLoading(false);
    };
    const handlePlanSwitch = async (planName) => {
        setLoading(true);
        try {
            const res = await fetch('/api/merchant/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'upgrade_plan', planName })
            });
            const data = await res.json();
            if (data.success && data.credits)
                setCredits(data.credits);
        }
        catch (e) { }
        setLoading(false);
    };
    const usedPct = Math.min(100, Math.round((credits.used / credits.total) * 100));
    const R = 56;
    const circ = 2 * Math.PI * R;
    const dashOffset = circ * (1 - usedPct / 100);
    const isLow = usedPct >= 80;
    return (<>
      {/* ── TOP BAR ── */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
        }}>
              <Zap size={16} color="#fff"/>
            </div>
            Virtual Try-On Credits & Analytics
          </div>
          <div className={styles.pageSubtitle}>
            Track credit usage, per-product performance, and manage your subscription
          </div>
        </div>
        <div className={styles.topbarRight}>
          <button onClick={() => setShowTopupModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.84rem',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            transition: 'all 0.2s'
        }}>
            <Zap size={15}/> Top Up Credits
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>

        {/* ── KPI ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
          {/* Credits Used */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIconWrap} style={{ background: '#e0e7ff' }}>
                <Zap size={18} color="#4338ca"/>
              </div>
              <span className={`${styles.kpiTrend} ${styles.trendUp}`}>↑ 34%</span>
            </div>
            <div className={styles.kpiLabel}>Try-Ons This Month</div>
            <div className={styles.kpiValue}>{credits.used.toLocaleString()}</div>
            <div className={styles.kpiSub}>+34% vs last month</div>
          </div>

          {/* Credits Remaining */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIconWrap} style={{ background: isLow ? '#fee2e2' : '#dcfce7' }}>
                <AlertCircle size={18} color={isLow ? '#dc2626' : '#16a34a'}/>
              </div>
              <span className={`${styles.kpiTrend} ${isLow ? styles.trendDown : styles.trendUp}`}>
                {100 - usedPct}% left
              </span>
            </div>
            <div className={styles.kpiLabel}>Credits Remaining</div>
            <div className={styles.kpiValue} style={{ color: isLow ? '#dc2626' : 'var(--d-t1)' }}>
              {credits.remaining.toLocaleString()}
            </div>
            <div className={styles.kpiSub}>{credits.used} of {credits.total.toLocaleString()} used</div>
          </div>

          {/* Conversion Rate */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIconWrap} style={{ background: '#dcfce7' }}>
                <TrendingUp size={18} color="#16a34a"/>
              </div>
              <span className={`${styles.kpiTrend} ${styles.trendUp}`}>↑ 2.1%</span>
            </div>
            <div className={styles.kpiLabel}>Try-On Conversion Rate</div>
            <div className={styles.kpiValue}>18.4%</div>
            <div className={styles.kpiSub}>Shoppers who purchased after try-on</div>
          </div>

          {/* Active Plan */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIconWrap} style={{ background: '#f3e8ff' }}>
                <CreditCard size={18} color="#7e22ce"/>
              </div>
              <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: 99,
            background: '#ede9fe', color: '#7c3aed',
            display: 'inline-flex', alignItems: 'center'
        }}>Active</span>
            </div>
            <div className={styles.kpiLabel}>Current Plan</div>
            <div className={styles.kpiValue}>{credits.plan}</div>
            <div className={styles.kpiSub}>{credits.total.toLocaleString()} credits / month</div>
          </div>
        </div>

        {/* ── MAIN PANEL ── */}
        <div className={styles.panel}>
          {/* Tab Nav */}
          <div className={styles.tabs}>
            {[
            { key: 'overview', label: 'Usage Overview', icon: Activity },
            { key: 'products', label: 'Per-Product Breakdown', icon: ShoppingBag },
            { key: 'logs', label: 'Live Session Logs', icon: Eye },
            { key: 'plans', label: 'Subscription Plans', icon: CreditCard },
        ].map(({ key, label, icon: Icon }) => (<button key={key} onClick={() => setTab(key)} className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14}/>
                {label}
              </button>))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (<div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Row 1: Chart + Credit Meter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '1.25rem' }}>

                {/* Bar Chart */}
                <div style={{ background: 'var(--d-card)', borderRadius: 14, border: '1px solid var(--d-border)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--d-t1)' }}>Daily Try-On Sessions</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--d-t4)', marginTop: 2 }}>Last 8 days · sessions & conversions</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', fontWeight: 700, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--d-t3)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: '#6366f1' }}/> Try-ons
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--d-t3)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }}/> Conversions
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={DAILY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--d-border2)" vertical={false}/>
                      <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'var(--d-t3)' }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize: 11, fill: 'var(--d-t3)' }} axisLine={false} tickLine={false}/>
                      <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--d-hover)' }}/>
                      <Bar dataKey="t" fill="#6366f1" opacity={0.88} radius={[6, 6, 0, 0]} barSize={20}/>
                      <Bar dataKey="conv" fill="#10b981" opacity={0.88} radius={[6, 6, 0, 0]} barSize={20}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Credit Ring Meter */}
                <div style={{
                background: 'var(--d-card)', borderRadius: 14,
                border: `1px solid ${isLow ? '#fca5a5' : 'var(--d-border)'}`,
                padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
            }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Monthly Credit Meter
                  </div>

                  <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--d-border2)" strokeWidth="11"/>
                      <circle cx="70" cy="70" r={R} fill="none" stroke={isLow ? 'url(#ringRed)' : 'url(#ringPurple)'} strokeWidth="11" strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1s ease' }}/>
                      <defs>
                        <linearGradient id="ringPurple" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1"/>
                          <stop offset="100%" stopColor="#a78bfa"/>
                        </linearGradient>
                        <linearGradient id="ringRed" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ef4444"/>
                          <stop offset="100%" stopColor="#f97316"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                      <div style={{ fontSize: '1.7rem', fontWeight: 900, color: isLow ? '#dc2626' : 'var(--d-t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {usedPct}%
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--d-t4)', fontWeight: 600, marginTop: 2 }}>used</div>
                    </div>
                  </div>

                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--d-t3)', fontWeight: 600 }}>Used</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--d-t1)' }}>{credits.used.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--d-t3)', fontWeight: 600 }}>Remaining</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isLow ? '#dc2626' : '#16a34a' }}>{credits.remaining.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--d-t3)', fontWeight: 600 }}>Total</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--d-t1)' }}>{credits.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {isLow && (<div style={{
                    width: '100%', padding: '0.6rem 0.9rem',
                    background: '#fee2e2', border: '1px solid #fca5a5',
                    borderRadius: 9, fontSize: '0.75rem', color: '#b91c1c',
                    fontWeight: 700, textAlign: 'center'
                }}>
                      ⚠️ Running low! Only {credits.remaining} credits left
                    </div>)}

                  <button onClick={() => setShowTopupModal(true)} style={{
                width: '100%', padding: '0.6rem', borderRadius: 9,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', border: 'none', fontWeight: 700,
                fontSize: '0.82rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
                    <Zap size={13}/> Buy Top-Up Pack
                  </button>
                </div>
              </div>

              {/* Row 2: Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                { label: 'Total Sessions (All Time)', value: '4,812', sub: 'Since store launch', icon: Activity, bg: '#e0e7ff', color: '#4338ca' },
                { label: 'Revenue Attributed to Try-On', value: '$12,430', sub: '18.4% of total GMV', icon: TrendingUp, bg: '#dcfce7', color: '#16a34a' },
                { label: 'Unique Shoppers Who Tried', value: '3,241', sub: 'Across all products', icon: Users, bg: '#fef3c7', color: '#d97706' },
            ].map(s => (<div key={s.label} style={{
                    background: 'var(--d-card)', borderRadius: 12,
                    border: '1px solid var(--d-border)',
                    padding: '1.1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: s.bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                      <s.icon size={20} color={s.color}/>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--d-t1)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', marginTop: 2 }}>{s.sub}</div>
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* ── PER-PRODUCT BREAKDOWN TAB ── */}
          {tab === 'products' && (<div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)', marginBottom: '0.25rem' }}>
                Performance breakdown for each product listing where virtual try-on is enabled.
              </div>
              {PRODUCT_USAGE.map((p) => {
                const maxTries = PRODUCT_USAGE[0].tries;
                const barWidth = Math.round((p.tries / maxTries) * 100);
                return (<div key={p.name} style={{
                        background: 'var(--d-card)', border: '1px solid var(--d-border2)',
                        borderRadius: 14, padding: '1.1rem 1.4rem',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0, boxShadow: `0 0 0 3px ${p.color}25` }}/>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--d-t1)' }}>{p.name}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Try-Ons</div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--d-t1)' }}>{p.tries}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Converted</div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#16a34a' }}>{p.converted}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Rate</div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: p.color }}>{p.convRate}%</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Credits</div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1' }}>{p.credits}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 8, background: 'var(--d-border2)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{
                        height: '100%', width: `${barWidth}%`,
                        background: `linear-gradient(90deg, ${p.color}cc, ${p.color})`,
                        borderRadius: 99,
                        transition: 'width 0.8s cubic-bezier(0.34,1,0.64,1)'
                    }}/>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)' }}>
                      {p.converted} purchases directly driven by virtual try-on &nbsp;·&nbsp; {p.credits} credits consumed
                    </div>
                  </div>);
            })}
            </div>)}

          {/* ── LIVE SESSION LOGS TAB ── */}
          {tab === 'logs' && (<div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--d-border2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--d-t3)' }}>Real-time virtual try-on session audit trail</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)', animation: 'pulse 2s infinite' }}/>
                  Live
                </div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Product</th>
                    <th>Shopper Hash</th>
                    <th>Outcome</th>
                    <th>Credits</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {LOG.map(l => (<tr key={l.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#6366f1', fontWeight: 700 }}>
                          {l.id}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--d-t1)', fontSize: '0.84rem' }}>{l.product}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--d-t4)' }}>{l.user}</td>
                      <td>
                        {l.result === 'converted' ? (<span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 9px', borderRadius: 99,
                        background: '#dcfce7', color: '#15803d',
                        fontSize: '0.72rem', fontWeight: 700
                    }}>
                            <Check size={10}/> Converted Purchase
                          </span>) : (<span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 9px', borderRadius: 99,
                        background: '#f3f4f6', color: '#6b7280',
                        fontSize: '0.72rem', fontWeight: 700
                    }}>
                            <Eye size={10}/> Browsed Try-On
                          </span>)}
                      </td>
                      <td>
                        <span style={{ color: '#6366f1', fontWeight: 800, fontSize: '0.82rem' }}>−1 credit</span>
                      </td>
                      <td style={{ color: 'var(--d-t4)', fontSize: '0.78rem' }}>{l.time}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}

          {/* ── SUBSCRIPTION PLANS TAB ── */}
          {tab === 'plans' && (<div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--d-t3)' }}>
                  Choose the plan that fits your store's try-on volume. You're currently on the <strong style={{ color: '#6366f1' }}>{credits.plan}</strong> plan.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {PLANS.map(p => {
                const isActive = credits.plan === p.name;
                return (<div key={p.name} style={{
                        background: isActive ? 'linear-gradient(160deg,#f1f3ff,#eef2ff)' : 'var(--d-card)',
                        border: isActive ? '2px solid #6366f1' : p.popular ? '2px solid #8b5cf6' : '1px solid var(--d-border)',
                        borderRadius: 16, padding: '1.5rem 1.25rem',
                        display: 'flex', flexDirection: 'column', gap: '0.4rem',
                        position: 'relative', transition: 'all 0.2s',
                    }}>
                      {p.popular && !isActive && (<div style={{
                            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                            background: '#8b5cf6', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                            padding: '3px 12px', borderRadius: 99, whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(139,92,246,0.3)'
                        }}>
                          ⭐ MOST POPULAR
                        </div>)}
                      {isActive && (<div style={{
                            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                            background: '#6366f1', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                            padding: '3px 12px', borderRadius: 99, whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(99,102,241,0.35)'
                        }}>
                          ✓ CURRENT PLAN
                        </div>)}

                      <div style={{
                        width: 36, height: 36, borderRadius: 10, marginBottom: 4,
                        background: `${p.color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <p.icon size={18} color={p.color}/>
                      </div>

                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.name}</div>

                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--d-t1)', letterSpacing: '-0.04em', lineHeight: 1, margin: '0.25rem 0' }}>
                        {p.price}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', marginBottom: '0.35rem' }}>
                        {p.price === 'Free' ? 'forever' : p.price === 'Custom' ? 'contact sales' : '/month'}
                      </div>

                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: p.color, marginBottom: '0.25rem' }}>
                        {p.credits > 0 ? `${p.credits.toLocaleString()} try-ons/month` : 'Unlimited try-ons'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', marginBottom: '0.75rem' }}>
                        Overage: {p.overage}/credit
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem', flex: 1 }}>
                        {p.features.map(f => (<div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: 'var(--d-t2)' }}>
                            <Check size={12} color="#16a34a" style={{ flexShrink: 0 }}/>
                            {f}
                          </div>))}
                      </div>

                      <button disabled={loading || isActive} onClick={() => handlePlanSwitch(p.name)} style={{
                        padding: '0.6rem', borderRadius: 9, fontWeight: 700,
                        fontSize: '0.8rem', cursor: isActive ? 'default' : 'pointer',
                        border: isActive ? 'none' : `1.5px solid ${p.color}`,
                        background: isActive ? '#6366f1' : 'transparent',
                        color: isActive ? '#fff' : p.color,
                        transition: 'all 0.15s', opacity: loading ? 0.7 : 1
                    }} onMouseEnter={e => { if (!isActive) {
                    e.target.style.background = p.color;
                    e.target.style.color = '#fff';
                } }} onMouseLeave={e => { if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = p.color;
                } }}>
                        {isActive ? '✓ Current Plan' : `Switch to ${p.name}`}
                      </button>
                    </div>);
            })}
              </div>

              {/* Overage note */}
              <div style={{
                marginTop: '1.5rem', padding: '1rem 1.25rem',
                background: 'var(--d-card)', border: '1px solid var(--d-border)',
                borderRadius: 12, fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.5
            }}>
                💡 <strong style={{ color: 'var(--d-t1)' }}>Overage credits</strong> are automatically billed at the per-credit rate for your plan if you exceed your monthly allocation.
                You can also buy one-time credit top-up packs at any time — they never expire.
              </div>
            </div>)}
        </div>
      </div>

      {/* ── TOP-UP CREDITS MODAL ── */}
      {showTopupModal && (<div className={styles.overlay} onClick={() => setShowTopupModal(false)}>
          <div className={styles.modal} style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={18} color="#6366f1"/> Instant Credit Top-Up
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--d-t4)', marginTop: 3 }}>
                  Credits are added instantly and never expire
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowTopupModal(false)}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Current balance indicator */}
              <div style={{
                background: '#f5f3ff', border: '1px solid #ddd6fe',
                borderRadius: 10, padding: '0.85rem 1rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span style={{ fontSize: '0.8rem', color: '#5b21b6', fontWeight: 600 }}>Current Balance</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1' }}>
                  {credits.remaining} / {credits.total} credits
                </span>
              </div>

              {TOPUP_PACKS.map(pack => (<div key={pack.credits} style={{
                    background: 'var(--d-card)',
                    border: pack.popular ? '2px solid #6366f1' : '1px solid var(--d-border)',
                    borderRadius: 14, padding: '1.1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'relative'
                }}>
                  {pack.popular && (<div style={{
                        position: 'absolute', top: -10, left: 16,
                        background: '#6366f1', color: '#fff',
                        fontSize: '0.6rem', fontWeight: 800, padding: '2px 9px', borderRadius: 99
                    }}>
                      MOST POPULAR
                    </div>)}
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--d-t1)', marginBottom: 2 }}>
                      {pack.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--d-t3)' }}>
                      {pack.credits.toLocaleString()} credits &nbsp;·&nbsp; {pack.perCredit}/credit
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--d-t1)' }}>{pack.price}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--d-t4)' }}>one-time</div>
                    </div>
                    <button disabled={loading} onClick={() => handleTopup(pack.credits)} style={{
                    padding: '0.55rem 1.1rem', borderRadius: 9,
                    background: pack.popular ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--d-panel)',
                    color: pack.popular ? '#fff' : 'var(--d-t1)',
                    border: pack.popular ? 'none' : '1px solid var(--d-border)',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    boxShadow: pack.popular ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                    opacity: loading ? 0.7 : 1, transition: 'all 0.15s'
                }}>
                      {loading ? '...' : 'Buy Now'}
                    </button>
                  </div>
                </div>))}

              <div style={{ fontSize: '0.74rem', color: 'var(--d-t4)', textAlign: 'center', paddingTop: '0.25rem' }}>
                🔒 Secure checkout powered by Stripe · Credits never expire
              </div>
            </div>
          </div>
        </div>)}
    </>);
}
