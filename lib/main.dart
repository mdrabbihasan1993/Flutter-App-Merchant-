
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:seven_ton_express/services/gemini_service.dart';
import 'package:seven_ton_express/models/stat_item.dart';
import 'package:intl/intl.dart';

void main() {
  runApp(const SevenTonExpress());
}

class SevenTonExpress extends StatelessWidget {
  const SevenTonExpress({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '7ton Express Logistics',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A3762),
          primary: const Color(0xFF1A3762),
          secondary: const Color(0xFFFF751F),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;
  bool _isStatsExpanded = false;
  bool _isPaymentExpanded = false;
  bool _isAiLoading = false;
  String? _aiInsight;

  final GeminiService _gemini = GeminiService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 24),
                  _buildGreeting(),
                  const SizedBox(height: 16),
                  _buildBalanceDashboard(),
                  const SizedBox(height: 16),
                  _buildProcessingSection(),
                  const SizedBox(height: 24),

                  _buildSectionHeader(
                    "Performance Dashboard", 
                    _isStatsExpanded, 
                    () => setState(() => _isStatsExpanded = !_isStatsExpanded)
                  ),
                  _buildStatsGrid(DashboardData.stats, _isStatsExpanded),
                  const SizedBox(height: 12),

                  _buildSectionHeader(
                    "Payment Details", 
                    _isPaymentExpanded, 
                    () => setState(() => _isPaymentExpanded = !_isPaymentExpanded)
                  ),
                  _buildStatsGrid(DashboardData.payments, _isPaymentExpanded),
                  const SizedBox(height: 24),
                  
                  _buildServiceHealthCard(),
                  const SizedBox(height: 16),
                  
                  _buildReturnApprovalBanner(),
                  const SizedBox(height: 24),
                  
                  _buildEntryShortcuts(),
                  const SizedBox(height: 24),
                  
                  _buildPickupCard(),
                  const SizedBox(height: 24),
                  
                  _buildUtilityGrid(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
          if (_isAiLoading) _buildAiLoader(),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: const Color(0xFFFF751F),
        elevation: 8,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: const Icon(LucideIcons.plus, color: Colors.white, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildSectionHeader(String title, bool isExpanded, VoidCallback onToggle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.2)),
          TextButton.icon(
            onPressed: onToggle,
            label: Text(isExpanded ? 'SHOW LESS' : 'SHOW ALL', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF1A3762))),
            icon: Icon(isExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown, size: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(List<StatItem> items, bool isExpanded) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: isExpanded ? items.length : 3,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 1.1),
      itemBuilder: (context, index) {
        final item = items[index];
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade100)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(item.icon, size: 16, color: item.isOrange ? const Color(0xFFFF751F) : const Color(0xFF1A3762)),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.title.toUpperCase(), style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold), maxLines: 1),
                  Text(item.value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(width: 40, height: 40, decoration: BoxDecoration(color: const Color(0xFF1A3762), borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('7', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)))),
            const SizedBox(width: 10),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              RichText(text: const TextSpan(style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF1A3762)), children: [TextSpan(text: 'ton'), TextSpan(text: 'Express', style: TextStyle(color: Color(0xFFFF751F)))])),
              const Text('LOGISTICS SOLUTIONS', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.5)),
            ]),
          ],
        ),
        Row(children: [
          IconButton(onPressed: () {}, icon: Container(padding: const EdgeInsets.all(8), decoration: const BoxDecoration(gradient: LinearGradient(colors: [Colors.indigo, Colors.purple]), shape: BoxShape.circle), child: const Icon(LucideIcons.sparkles, color: Colors.white, size: 16))),
          const Icon(LucideIcons.bell, color: Colors.grey),
        ]),
      ],
    );
  }

  Widget _buildGreeting() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade50)),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('HI, John', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF1A3762))),
          const SizedBox(height: 4),
          RichText(text: TextSpan(style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.5), children: [const TextSpan(text: 'TODAY IS '), TextSpan(text: DateFormat('EEEE').format(DateTime.now()).toUpperCase(), style: const TextStyle(color: Color(0xFFFF751F)))])),
        ]),
        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(16)), child: Icon(LucideIcons.trendingUp, color: Colors.green.shade600, size: 24)),
      ]),
    );
  }

  Widget _buildBalanceDashboard() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(32), boxShadow: [BoxShadow(color: const Color(0xFF1A3762).withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))]),
      child: Column(children: [
        Container(width: double.infinity, padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24), decoration: const BoxDecoration(color: Color(0xFF1A3762), borderRadius: BorderRadius.vertical(top: Radius.circular(32))), child: const Column(children: [Text('PAYABLE BALANCE', style: TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 2.5)), SizedBox(height: 4), Text('৳45,600.00', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900))])),
        Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(bottom: Radius.circular(32))), child: const Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [_MiniStat(label: 'Delivered', val: '৳85.0k', icon: LucideIcons.banknote), _MiniStat(label: 'D. Charge', val: '৳5.4k', icon: LucideIcons.receipt), _MiniStat(label: 'COD Charge', val: '৳1.2k', icon: LucideIcons.creditCard)])),
      ]),
    );
  }

  Widget _buildProcessingSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(28), border: Border.all(color: const Color(0xFFFF751F).withOpacity(0.3), width: 2)),
      child: Row(children: [
        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: const Color(0xFFFF751F).withOpacity(0.1), borderRadius: BorderRadius.circular(16)), child: const Icon(LucideIcons.refreshCw, color: Color(0xFFFF751F), size: 24)),
        const SizedBox(width: 16),
        const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('PROCESSING BALANCE', style: TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.w900)), Text('৳12,000.00', style: TextStyle(color: Color(0xFF1A3762), fontSize: 20, fontWeight: FontWeight.w900))])),
        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(20)), child: Text('IN AUDIT', style: TextStyle(color: Colors.blue.shade600, fontSize: 8, fontWeight: FontWeight.w900))),
      ]),
    );
  }

  Widget _buildServiceHealthCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), border: Border.all(color: Colors.grey.shade100)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Row(children: [Icon(LucideIcons.activity, size: 16, color: Colors.blue), SizedBox(width: 8), Text('SERVICE HEALTH', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.5))]),
        const SizedBox(height: 24),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.green, shape: BoxShape.circle)), SizedBox(width: 6), Text('SUCCESS RATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey))]),
            SizedBox(height: 4),
            Text('94.2%', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF1A3762))),
          ]),
          Container(width: 1, height: 40, color: Colors.grey.shade100),
          const Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Row(children: [Text('RETURNED RATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)), SizedBox(width: 6), Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.orange, shape: BoxShape.circle))]),
            SizedBox(height: 4),
            Text('3.8%', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF1A3762))),
          ]),
        ]),
      ]),
    );
  }

  Widget _buildReturnApprovalBanner() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(28), border: Border.all(color: Colors.grey.shade50), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)]),
      child: Row(children: [
        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(16)), child: const Icon(LucideIcons.rotateCcw, color: Colors.orange, size: 20)),
        const SizedBox(width: 16),
        const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Return Approval', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14)), Text('REVIEW PENDING RETURN REQUESTS', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey))])),
        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(8)), child: const Text('5', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 10))),
        const SizedBox(width: 12),
        const Icon(LucideIcons.chevronRight, color: Colors.grey, size: 18),
      ]),
    );
  }

  Widget _buildEntryShortcuts() {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      _EntryBtn(label: 'MANUAL ENTRY', icon: LucideIcons.filePlus, color: const Color(0xFF2B59C3), iconBg: const Color(0xFFDCE9FF)),
      _EntryBtn(label: 'AI ENTRY', icon: LucideIcons.wandSparkles, color: const Color(0xFF5C6BC0), iconBg: const Color(0xFFE6E9FF)),
      _EntryBtn(label: 'CAMERA ENTRY', icon: LucideIcons.camera, color: const Color(0xFFFF751F), iconBg: const Color(0xFFFFEAD2)),
    ]);
  }

  Widget _buildPickupCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(28), border: Border.all(color: const Color(0xFFFF751F), width: 2)),
      child: const Row(children: [
        Expanded(child: _PickupStat(title: 'PICKUP', val: '12', sub: 'REQUEST PENDING', icon: LucideIcons.clock)),
        SizedBox(height: 40, child: VerticalDivider(color: Color(0xFFE2E8F0))),
        Expanded(child: _PickupStat(title: 'HISTORY', val: '45', sub: 'PICKED YESTERDAY', icon: LucideIcons.history)),
      ]),
    );
  }

  Widget _buildUtilityGrid() {
    final utils = [
      {'icon': LucideIcons.ban, 'label': 'No Entry', 'color': Colors.grey},
      {'icon': LucideIcons.zap, 'label': 'Quick Booking', 'color': Colors.orange},
      {'icon': LucideIcons.trophy, 'label': 'Reward Board', 'color': Colors.blue},
      {'icon': LucideIcons.truck, 'label': 'Pickup', 'color': Colors.orange},
      {'icon': LucideIcons.lifeBuoy, 'label': 'Support', 'color': Colors.green},
      {'icon': LucideIcons.settings, 'label': 'Settings', 'color': Colors.grey},
      {'icon': LucideIcons.shieldCheck, 'label': '✨ Fraud Check', 'color': Colors.red},
      {'icon': LucideIcons.info, 'label': 'Latest Updates', 'color': Colors.indigo},
    ];
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: utils.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 2.5),
      itemBuilder: (context, i) {
        final item = utils[i];
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade50)),
          child: Row(children: [
            Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: (item['color'] as Color).withOpacity(0.05), borderRadius: BorderRadius.circular(10)), child: Icon(item['icon'] as IconData, size: 16, color: item['color'] as Color)),
            const SizedBox(width: 12),
            Expanded(child: Text(item['label'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: -0.2), overflow: TextOverflow.ellipsis)),
          ]),
        );
      },
    );
  }

  Widget _buildBottomNav() {
    return BottomAppBar(color: const Color(0xFF1A3762), shape: const AutomaticNotchedShape(RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24)))), notchMargin: 8, child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [_navItem(LucideIcons.layoutDashboard, 'Home', 0), _navItem(LucideIcons.package, 'Parcels', 1), const SizedBox(width: 48), _navItem(LucideIcons.fileText, 'Invoices', 2), _navItem(LucideIcons.user, 'Account', 3)]));
  }

  Widget _navItem(IconData icon, String label, int index) {
    final active = _currentIndex == index;
    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(icon, color: Colors.white.withOpacity(active ? 1.0 : 0.4), size: 22), Text(label.toUpperCase(), style: TextStyle(color: Colors.white.withOpacity(active ? 1.0 : 0.4), fontSize: 8, fontWeight: FontWeight.w900))]),
    );
  }

  Widget _buildAiLoader() { return Container(color: Colors.black26, child: Center(child: Container(padding: const EdgeInsets.all(32), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)), child: const Column(mainAxisSize: MainAxisSize.min, children: [CircularProgressIndicator(), SizedBox(height: 16), Text('AI PROCESSING...', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.indigo))])))); }
}

class _MiniStat extends StatelessWidget {
  final String label, val; final IconData icon;
  const _MiniStat({required this.label, required this.val, required this.icon});
  @override
  Widget build(BuildContext context) { return Column(children: [Icon(icon, size: 12, color: Colors.orange), const SizedBox(height: 4), Text(val, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF1A3762))), Text(label.toUpperCase(), style: const TextStyle(fontSize: 7, color: Colors.grey, fontWeight: FontWeight.bold))]); }
}

class _EntryBtn extends StatelessWidget {
  final String label; final IconData icon; final Color color; final Color iconBg;
  const _EntryBtn({required this.label, required this.icon, required this.color, required this.iconBg});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: (MediaQuery.of(context).size.width - 64) / 3,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFFF0F7FF), borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE0F0FF))),
      child: Column(children: [
        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(16)), child: Icon(icon, color: color, size: 22)),
        const SizedBox(height: 12),
        Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.black87)),
      ]),
    );
  }
}

class _PickupStat extends StatelessWidget {
  final String title, val, sub; final IconData icon;
  const _PickupStat({required this.title, required this.val, required this.sub, required this.icon});
  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.grey)),
      const SizedBox(height: 8),
      Row(children: [
        Icon(icon, size: 16, color: Colors.orange),
        const SizedBox(width: 8),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(val, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
          Text(sub, style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold)),
        ]),
      ]),
    ]);
  }
}

class DashboardData {
  static const stats = [
    StatItem(title: "Total parcels", value: "1,284", icon: LucideIcons.package, isOrange: false),
    StatItem(title: "Delivery pending", value: "342", icon: LucideIcons.truck, isOrange: true),
    StatItem(title: "Delivered", value: "942", icon: LucideIcons.checkCircle2, isOrange: false),
    StatItem(title: "Hold", value: "08", icon: LucideIcons.clock, isOrange: true),
  ];

  static const payments = [
    StatItem(title: "COD Collected", value: "৳1,20,400", icon: LucideIcons.banknote, isOrange: false),
    StatItem(title: "Paid Amount", value: "৳84,200", icon: LucideIcons.checkCircle2, isOrange: true),
    StatItem(title: "Unpaid Amount", value: "৳36,200", icon: LucideIcons.alertCircle, isOrange: false),
  ];
}
