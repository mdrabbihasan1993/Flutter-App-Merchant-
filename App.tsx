
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Truck, User, Bell, Plus, 
  Clock, CheckCircle2, ArrowRightLeft, XCircle, RotateCcw, 
  RefreshCw, ArrowLeft, FileText, Settings, 
  AlertCircle, ShieldAlert, Sparkles, ShieldCheck, 
  Loader2, History, ChevronDown, ChevronUp, ChevronRight,
  Camera, FilePlus, WandSparkles, Trophy, Banknote, Receipt, 
  CreditCard, TrendingUp, Activity, Zap, LifeBuoy, Info, Ban
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

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-40'}`} 
    style={{ color: '#ffffff' }}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-[9px] font-black uppercase tracking-widest`}>{label}</span>
  </button>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [fraudPhone, setFraudPhone] = useState('');
  const [fraudResult, setFraudResult] = useState<string | null>(null);

  const handleAnalyzeBusiness = async () => {
    setAiLoading(true);
    const result = await analyzeBusinessPerformance("Context stats...");
    setAiInsight(result);
    setAiLoading(false);
  };

  const renderHomeContent = () => (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-center pt-2">
        <Logo />
        <div className="flex items-center space-x-2">
          <button onClick={handleAnalyzeBusiness} className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white shadow-lg">
            <Sparkles size={18} />
          </button>
          <button className="relative p-2.5 bg-white rounded-full border border-gray-100 shadow-sm text-gray-500">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ff751f] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="bg-white px-5 py-4 rounded-2xl border border-gray-50 shadow-sm flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-800 tracking-tight">HI, John</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Today is <span style={{ color: COLORS.orange }}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span></p>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
          <TrendingUp size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Payable Balance Card */}
      <div className="rounded-[32px] shadow-xl shadow-blue-100/40 overflow-hidden flex flex-col">
        <div className="bg-[#1a3762] px-6 py-5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">Payable Balance</p>
          <h2 className="text-3xl font-black tracking-tighter text-white">৳45,600.00</h2>
        </div>
        <div className="bg-white px-6 py-4 grid grid-cols-3 gap-2 text-[#1a3762]">
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

      {/* Processing Balance Section */}
      <div className="bg-white p-5 rounded-[28px] border-2 border-dashed border-orange-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Processing Balance</p>
            <h4 className="text-xl font-black text-[#1a3762]">৳12,000.00</h4>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-full">In Audit</span>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className="space-y-0.5">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Performance Dashboard</h3>
            <button onClick={() => setIsStatsExpanded(!isStatsExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
              {isStatsExpanded ? 'Show Less' : 'Show All'}
              {isStatsExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          </div>
          <div className="transition-all duration-700 ease-in-out overflow-hidden" style={{ maxHeight: isStatsExpanded ? '500px' : '104px' }}>
            <div className="grid grid-cols-3 gap-2">
              {DASHBOARD_STATS.map((stat, index) => (
                <div key={index} className={`transition-opacity duration-500 ${!isStatsExpanded && index >= 3 ? 'opacity-0' : 'opacity-100'}`}>
                  <StatCard item={stat} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Payment Details</h3>
            <button onClick={() => setIsPaymentExpanded(!isPaymentExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
              {isPaymentExpanded ? 'Show Less' : 'Show All'}
              {isPaymentExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>
          </div>
          <div className="transition-all duration-700 ease-in-out overflow-hidden" style={{ maxHeight: isPaymentExpanded ? '500px' : '104px' }}>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_STATS.map((stat, index) => (
                <div key={index} className={`transition-opacity duration-500 ${!isPaymentExpanded && index >= 3 ? 'opacity-0' : 'opacity-100'}`}>
                  <StatCard item={stat} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Health Card */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Activity size={16} />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Health</span>
        </div>
        <div className="absolute top-4 right-4 opacity-10">
          <Activity size={80} strokeWidth={1} className="text-gray-400" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Success Rate</span>
            </div>
            <p className="text-2xl font-black text-[#1a3762]">94.2%</p>
          </div>
          <div className="w-[1px] h-10 bg-gray-100"></div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end space-x-1.5">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Returned Rate</span>
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            </div>
            <p className="text-2xl font-black text-[#1a3762]">3.8%</p>
          </div>
        </div>
      </div>

      {/* Return Approval Banner */}
      <button className="w-full bg-white p-5 rounded-[28px] border border-gray-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
            <RotateCcw size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-[#1a3762]">Return Approval</h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Review pending return requests</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-red-200">5</span>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </button>

      {/* Entry Buttons - Color Updated to match image */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FilePlus, label: "Manual Entry", bg: "bg-[#dce9ff]", color: "text-[#2b59c3]" },
          { icon: WandSparkles, label: "AI Entry", bg: "bg-[#e6e9ff]", color: "text-[#5c6bc0]" },
          { icon: Camera, label: "Camera Entry", bg: "bg-[#ffead2]", color: "text-[#ff751f]" },
        ].map((item, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-4 bg-[#f0f7ff] rounded-[24px] border border-[#e0f0ff] shadow-sm space-y-3 active:scale-95 transition-all">
            <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon size={22} />
            </div>
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight text-center leading-none px-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Pickup/History Card */}
      <div className="bg-white p-5 rounded-[28px] border-2 border-orange-500 shadow-sm grid grid-cols-2 divide-x divide-gray-100">
        <div className="pr-4 space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Clock size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762]">12</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Request Pending</p>
            </div>
          </div>
        </div>
        <div className="pl-4 space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">History</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><History size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762]">45</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Picked yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Grid */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        {[
          { icon: Ban, label: "No Entry", bg: "bg-slate-50", color: "text-slate-600" },
          { icon: Zap, label: "Quick Booking", bg: "bg-orange-50", color: "text-orange-500" },
          { icon: Trophy, label: "Reward Board", bg: "bg-blue-50", color: "text-blue-600" },
          { icon: Truck, label: "Pickup", bg: "bg-orange-50", color: "text-orange-500" },
          { icon: LifeBuoy, label: "Support", bg: "bg-green-50", color: "text-green-600" },
          { icon: Settings, label: "Settings", bg: "bg-slate-50", color: "text-slate-600" },
          { icon: ShieldCheck, label: "✨ Fraud Check", bg: "bg-red-50", color: "text-red-500", action: () => setActiveTab('fraud_check') },
          { icon: Info, label: "Latest Updates", bg: "bg-indigo-50", color: "text-indigo-600" },
        ].map((btn, i) => (
          <button 
            key={i} 
            onClick={btn.action}
            className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm active:scale-95 transition-all hover:bg-slate-50"
          >
            <div className={`p-2 rounded-lg ${btn.bg} ${btn.color}`}>
              <btn.icon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-700 tracking-tight">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeContent();
      case 'fraud_check': return <div className="pt-4"><button onClick={() => setActiveTab('home')} className="mb-4 flex items-center text-xs font-bold"><ArrowLeft size={16} className="mr-1"/> Back</button><h2 className="text-2xl font-black mb-4">Fraud Check</h2><div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><input type="tel" placeholder="Phone number..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none mb-4 font-bold" value={fraudPhone} onChange={e=>setFraudPhone(e.target.value)} /><button onClick={async ()=>{setAiLoading(true); setFraudResult(await checkFraudRisk(fraudPhone)); setAiLoading(false)}} className="w-full bg-[#1a3762] text-white p-4 rounded-2xl font-black">Verify Customer</button>{fraudResult && <p className="mt-4 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl italic">{fraudResult}</p>}</div></div>;
      default: return renderHomeContent();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#f8fafc] min-h-screen relative">
      <div className="h-4"></div>
      {aiLoading && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm"><div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center space-y-4"><Loader2 size={48} className="text-indigo-600 animate-spin" /><p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">AI Processing...</p></div></div>}
      <main className="px-5 pb-32">{renderContent()}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-5 flex justify-between items-center z-50 rounded-t-[32px] shadow-[0_-15px_50px_rgba(26,55,98,0.2)]" style={{ backgroundColor: COLORS.darkBlue }}>
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={LayoutDashboard} label="Home" />
        <NavButton active={activeTab === 'orders'} onClick={() => {}} icon={Package} label="Parcels" />
        <button className="w-12 h-12 rounded-2xl bg-[#ff751f] flex items-center justify-center shadow-lg active:scale-90 transition-all"><Plus size={24} className="text-white" strokeWidth={3} /></button>
        <NavButton active={activeTab === 'invoices'} onClick={() => {}} icon={FileText} label="Invoices" />
        <NavButton active={activeTab === 'profile'} onClick={() => {}} icon={User} label="Account" />
      </nav>
    </div>
  );
};

export default App;
