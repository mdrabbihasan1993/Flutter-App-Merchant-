
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Truck, Wallet, User, Bell, Plus, 
  Clock, CheckCircle2, ArrowRightLeft, XCircle, RotateCcw, 
  RefreshCw, Zap, ArrowLeft, FileText, LifeBuoy, Settings, 
  AlertCircle, ShieldAlert, Activity, Info, Sparkles, ShieldCheck, 
  Loader2, Ban, History, ChevronDown, ChevronUp, ChevronRight,
  Camera, FilePlus, WandSparkles, Trophy, Filter, Calendar, X,
  Banknote, Receipt, CreditCard, TrendingUp
} from 'lucide-react';
import { COLORS, DASHBOARD_STATS, PAYMENT_STATS } from './constants';
import { TabType, StatItem } from './types';
import { analyzeBusinessPerformance, checkFraudRisk } from './geminiService';

// --- Helper Components ---

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.darkBlue }}>
      <span className="text-white font-black text-xl italic">7</span>
    </div>
    <div>
      <h2 className="text-lg font-black leading-none tracking-tighter" style={{ color: COLORS.darkBlue }}>
        ton<span style={{ color: COLORS.orange }}>Express</span>
      </h2>
      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Logistics Solutions</p>
    </div>
  </div>
);

const StatCard: React.FC<{ item: StatItem }> = ({ item }) => (
  <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 transition-all hover:border-gray-200">
    <div className="flex justify-between items-start">
      <div 
        className="p-1.5 rounded-lg" 
        style={{ 
          backgroundColor: item.isOrange ? `${COLORS.orange}15` : `${COLORS.darkBlue}15`, 
          color: item.isOrange ? COLORS.orange : COLORS.darkBlue 
        }}
      >
        <item.icon size={16} />
      </div>
    </div>
    <div>
      <p className="text-[8px] text-gray-400 font-bold tracking-wider uppercase truncate">{item.title}</p>
      <p className="text-sm font-extrabold text-gray-900 leading-tight">{item.value}</p>
    </div>
  </div>
);

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-40'}`} 
    style={{ color: '#ffffff' }}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-[9px] font-black uppercase tracking-widest`}>{label}</span>
  </button>
);

// --- Filter Modal Component ---
const FilterModal = ({ activeFilter, onSelect, onClose, title }: { 
  activeFilter: string, 
  onSelect: (val: string) => void,
  onClose: () => void,
  title: string
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const options = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 60 Days', value: '60days' },
    { label: 'Last 90 Days', value: '90days' },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-sm bg-white rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-black text-gray-900 tracking-tight">{title} Filter</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Select time range</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); onClose(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeFilter === opt.value 
                  ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                  : 'text-gray-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span>{opt.label}</span>
              {activeFilter === opt.value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>
          ))}
          
          <div className="pt-2">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                showCustom ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-gray-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={14} />
                <span>Custom Range</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-300 ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            
            {showCustom && (
              <div className="p-4 space-y-4 bg-orange-50/30 rounded-2xl mt-2 animate-in slide-in-from-top-2 duration-300 border border-orange-50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">From Date</label>
                    <input type="date" className="w-full bg-white border border-orange-100 rounded-xl p-2.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">To Date</label>
                    <input type="date" className="w-full bg-white border border-orange-100 rounded-xl p-2.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </div>
                <button 
                  onClick={() => { onSelect('custom'); onClose(); }}
                  className="w-full bg-[#ff751f] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition-all"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>

        {!showCustom && (
           <div className="mt-6 pt-4 border-t border-gray-50">
              <button 
                onClick={onClose}
                className="w-full bg-[#1a3762] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 active:scale-95 transition-all"
              >
                Close Filters
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  
  const [statsFilter, setStatsFilter] = useState('30days');
  const [paymentFilter, setPaymentFilter] = useState('30days');
  
  const [showStatsFilterMenu, setShowStatsFilterMenu] = useState(false);
  const [showPaymentFilterMenu, setShowPaymentFilterMenu] = useState(false);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [fraudPhone, setFraudPhone] = useState('');
  const [fraudResult, setFraudResult] = useState<string | null>(null);

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleAnalyzeBusiness = async () => {
    setAiLoading(true);
    const context = "Total parcels: 1284, Pending: 342, Delivered: 942, Hold: 8, Success Rate: 94.2%, Return Rate: 3.8%, Invoices: 42 (Paid: 30, Unpaid: 12)";
    const result = await analyzeBusinessPerformance(context);
    setAiInsight(result);
    setAiLoading(false);
  };

  const handleFraudCheck = async () => {
    if (!fraudPhone) return;
    setAiLoading(true);
    const result = await checkFraudRisk(fraudPhone);
    setFraudResult(result);
    setAiLoading(false);
  };

  const renderHomeContent = () => (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-center pt-2">
        <Logo />
        <div className="flex items-center space-x-2">
          {/* AI Analysis Button relocated to Header */}
          <button 
            onClick={handleAnalyzeBusiness}
            className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95 transition-all"
          >
            <Sparkles size={18} />
          </button>
          <button className="relative p-2.5 bg-white rounded-full border border-gray-100 shadow-sm text-gray-500">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ff751f] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Simplified Greeting Section - With Growth Icon on Right */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-gray-50 shadow-sm flex justify-between items-center group">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-800 tracking-tight">
            HI, John
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
            Today is <span style={{ color: COLORS.orange }}>{currentDayName}</span>
          </p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
          <TrendingUp size={24} strokeWidth={3} />
        </div>
      </div>

      {aiInsight && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">AI Business Insight</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp size={16} className="text-indigo-600" />
              <button onClick={() => setAiInsight(null)} className="text-indigo-400 hover:text-indigo-600">
                <XCircle size={14} />
              </button>
            </div>
          </div>
          <div className="text-xs text-indigo-900 leading-relaxed font-medium whitespace-pre-line prose prose-sm">{aiInsight}</div>
        </div>
      )}

      {/* --- SLIM Unified Balance Dashboard Card --- */}
      <div className="rounded-[32px] shadow-xl shadow-blue-100/40 overflow-hidden flex flex-col">
        {/* Top Blue Part - Applied specifically to this section only */}
        <div className="bg-[#1a3762] px-6 py-4 text-center rounded-t-[32px]">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">Payable Balance</p>
          <h2 className="text-3xl font-black tracking-tighter text-white">৳45,600.00</h2>
        </div>
        
        {/* Bottom White Part - Removed blue bleed by making it its own container */}
        <div className="bg-white rounded-b-[32px] px-6 py-2.5 grid grid-cols-3 gap-2 text-[#1a3762]">
          {[
            { label: "Delivered", value: "৳85.0k", icon: Banknote },
            { label: "D. Charge", value: "৳5.4k", icon: Receipt },
            { label: "COD Charge", value: "৳1.2k", icon: CreditCard },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-0.5 text-orange-500"><item.icon size={11} /></div>
              <p className="text-[10px] font-black tracking-tight">{item.value}</p>
              <p className="text-[7px] font-black uppercase opacity-40 tracking-widest leading-none mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Grouped Stats Sections with EXTREMELY Tighter Spacing --- */}
      <div className="space-y-0.5">
        {/* Performance Dashboard */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Performance Dashboard</h3>
              <button 
                onClick={() => setShowStatsFilterMenu(true)}
                className="p-1.5 bg-white text-gray-400 border border-gray-100 rounded-lg hover:text-[#1a3762] hover:border-blue-100 transition-all active:scale-95"
              >
                <Filter size={12} />
              </button>
            </div>
            <button onClick={() => setIsStatsExpanded(!isStatsExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
              {isStatsExpanded ? 'Show Less' : 'Show All'}
              {isStatsExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          </div>

          <div 
            className="transition-all duration-700 ease-in-out overflow-hidden" 
            style={{ maxHeight: isStatsExpanded ? '500px' : '104px' }}
          >
            <div className="grid grid-cols-3 gap-2">
              {DASHBOARD_STATS.map((stat, index) => (
                <div 
                  key={index} 
                  className={`transition-opacity duration-500 ${!isStatsExpanded && index >= 3 ? 'opacity-0' : 'opacity-100'}`}
                >
                  <StatCard item={stat} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Details - Pulled much higher */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1 mt-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Payment Details</h3>
              <button 
                onClick={() => setShowPaymentFilterMenu(true)}
                className="p-1.5 bg-white text-gray-400 border border-gray-100 rounded-lg hover:text-[#1a3762] hover:border-blue-100 transition-all active:scale-95"
              >
                <Filter size={12} />
              </button>
            </div>
            <button onClick={() => setIsPaymentExpanded(!isPaymentExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
              {isPaymentExpanded ? 'Show Less' : 'Show All'}
              {isPaymentExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          </div>

          <div 
            className="transition-all duration-700 ease-in-out overflow-hidden" 
            style={{ maxHeight: isPaymentExpanded ? '500px' : '104px' }}
          >
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_STATS.map((stat, index) => (
                <div 
                  key={index} 
                  className={`transition-opacity duration-500 ${!isPaymentExpanded && index >= 3 ? 'opacity-0' : 'opacity-100'}`}
                >
                  <StatCard item={stat} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity size={80} className="text-[#1a3762]" />
        </div>
        <div className="flex items-center space-x-2 relative z-10">
          <div className="p-1.5 bg-blue-50 rounded-lg text-[#1a3762]"><Activity size={16} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Service Health</span>
        </div>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Success Rate</p>
            </div>
            <h2 className="text-3xl font-black text-[#1a3762] tracking-tight">94.2%</h2>
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end space-x-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Returned Rate</p>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff751f]"></div>
            </div>
            <h2 className="text-3xl font-black text-[#1a3762] tracking-tight">3.8%</h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-[#ff751f] rounded-2xl group-hover:bg-[#ff751f] group-hover:text-white transition-colors">
            <RotateCcw size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1a3762] tracking-tight">Return Approval</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review pending return requests</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 text-white text-[10px] font-black h-6 w-6 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">5</div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-1">
        {[
          { icon: FilePlus, label: "Manual Entry", color: "blue", bg: "bg-blue-100", text: "text-blue-700" },
          { icon: WandSparkles, label: "AI Entry", color: "indigo", bg: "bg-indigo-100", text: "text-indigo-700" },
          { icon: Camera, label: "Camera Entry", color: "orange", bg: "bg-orange-100", text: "text-[#ff751f]" },
        ].map((item, i) => (
          <button 
            key={i} 
            className="flex flex-col items-center justify-center space-y-2 bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100 shadow-sm active:scale-95 transition-all hover:border-blue-200 hover:bg-blue-100/50"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.text}`}>
              <item.icon size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* --- Pickup and History Card --- */}
      <div className="bg-white p-5 rounded-[28px] border border-[#ff751f] shadow-sm grid grid-cols-2 divide-x divide-gray-100">
        <div className="pr-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Pickup</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 text-[#ff751f] rounded-xl"><Clock size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762] leading-none">12</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Request Pending</p>
            </div>
          </div>
        </div>
        <div className="pl-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">History</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-[#1a3762] rounded-xl"><History size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762] leading-none">45</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Picked yesterday</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Ban, label: "No Entry", color: "slate", action: () => {} },
          { icon: Zap, label: "Quick Booking", color: "orange", action: () => {} },
          { icon: Trophy, label: "Reward Board", color: "blue", action: () => {} },
          { icon: Truck, label: "Pickup", color: "orange", action: () => setActiveTab('pickup') },
          { icon: LifeBuoy, label: "Support", color: "green", action: () => {} },
          { icon: Settings, label: "Settings", color: "slate", action: () => {} },
          { icon: ShieldAlert, label: "✨ Fraud Check", color: "red", action: () => setActiveTab('fraud_check') },
          { icon: Info, label: "Latest Updates", color: "indigo", action: () => {} },
        ].map((btn, i) => (
          <button 
            key={i} 
            onClick={btn.action}
            className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all hover:bg-slate-50"
          >
            <div className={`p-2 rounded-lg bg-${btn.color}-50 text-${btn.color === 'orange' ? '[#ff751f]' : btn.color + '-600'}`}>
              <btn.icon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-700">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFraudCheck = () => (
    <div className="space-y-6 pb-32 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center space-x-4 pt-2">
        <button onClick={() => { setActiveTab('home'); setFraudResult(null); }} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-[#1a3762]" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">✨ Smart Fraud Check</h1>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <p className="text-xs text-gray-500 font-medium">Verify customer credibility using AI analyzing historical logistics behavior across Bangladesh.</p>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Customer Phone Number</label>
          <div className="flex space-x-2">
            <input 
              type="tel" 
              placeholder="017XXXXXXXX" 
              value={fraudPhone} 
              onChange={(e) => setFraudPhone(e.target.value)} 
              className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#ff751f] font-bold text-sm outline-none" 
            />
            <button 
              onClick={handleFraudCheck} 
              disabled={aiLoading || !fraudPhone} 
              className="bg-[#1a3762] text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
            </button>
          </div>
        </div>
        {fraudResult && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mt-4 animate-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <ShieldAlert size={16} />
              <span className="text-[10px] font-black uppercase">AI Risk Report</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed font-bold italic">{fraudResult}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeContent();
      case 'fraud_check': return renderFraudCheck();
      default:
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
            <Clock size={48} className="text-[#1a3762] animate-pulse" />
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900">Module Under Construction</h2>
              <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">We're loading something awesome!</p>
            </div>
            <button onClick={() => setActiveTab('home')} className="mt-4 px-6 py-2 bg-[#1a3762] text-white rounded-full font-bold text-xs">Back Home</button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#f8fafc] min-h-screen relative selection:bg-[#ff751f]/20">
      <div className="h-4"></div>
      
      {aiLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center space-y-4 animate-in zoom-in-95">
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="bg-white p-4 rounded-3xl shadow-lg relative z-10">
                  <Loader2 size={48} className="text-indigo-600 animate-spin" />
                </div>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 animate-bounce">AI is Thinking...</p>
               <p className="text-[8px] text-gray-400 mt-1 uppercase">Analyzing Logistics Data</p>
             </div>
          </div>
        </div>
      )}

      <main className="px-5 pb-32">{renderContent()}</main>

      <nav 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-5 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-15px_50px_rgba(26,55,98,0.25)] border-t border-white/5"
        style={{ backgroundColor: COLORS.darkBlue }}
      >
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={LayoutDashboard} label="Home" />
        <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={Package} label="Parcels" />
        
        <button 
          className="w-12 h-12 rounded-2xl bg-[#ff751f] flex items-center justify-center shadow-lg active:scale-90 transition-all group overflow-hidden"
        >
          <Plus size={24} className="text-white group-hover:rotate-90 transition-transform" strokeWidth={3} />
        </button>

        <NavButton active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} icon={FileText} label="Invoices" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Account" />
      </nav>
    </div>
  );
};

export default App;
