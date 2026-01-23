
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

  Future<void> _handleAnalyze() async {
    setState(() => _isAiLoading = true);
    final insight = await _gemini.analyzeBusinessPerformance(
      "Total parcels: 1284, Pending: 342, Delivered: 942, Success Rate: 94.2%"
    );
    setState(() {
      _aiInsight = insight;
      _isAiLoading = false;
    });
  }

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
                  if (_aiInsight != null) _buildAiInsightBox(),
                  const SizedBox(height: 16),
                  
                  // SLIM Unified Balance Dashboard
                  _buildBalanceDashboard(),
                  const SizedBox(height: 24),

                  _buildSectionHeader(
                    "Performance Dashboard", 
                    _isStatsExpanded, 
                    () => setState(() => _isStatsExpanded = !_isStatsExpanded)
                  ),
                  _buildStatsGrid(DashboardData.stats, _isStatsExpanded),
                  
                  // MINIMAL SPACE HERE
                  const SizedBox(height: 2),

                  _buildSectionHeader(
                    "Payment Details", 
                    _isPaymentExpanded, 
                    () => setState(() => _isPaymentExpanded = !_isPaymentExpanded)
                  ),
                  _buildStatsGrid(DashboardData.payments, _isPaymentExpanded),
                  const SizedBox(height: 24),

                  // Pickup Card
                  _buildPickupCard(),
                  const SizedBox(height: 100), // Spacer for bottom nav
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

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFF1A3762),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text('7', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: const TextSpan(
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF1A3762)),
                    children: [
                      TextSpan(text: 'ton'),
                      TextSpan(text: 'Express', style: TextStyle(color: Color(0xFFFF751F))),
                    ],
                  ),
                ),
                const Text('LOGISTICS SOLUTIONS', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.5)),
              ],
            ),
          ],
        ),
        Row(
          children: [
            IconButton(
              onPressed: _handleAnalyze,
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.indigo, Colors.purple]),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.sparkles, color: Colors.white, size: 16),
              ),
            ),
            const Icon(LucideIcons.bell, color: Colors.grey),
          ],
        ),
      ],
    );
  }

  Widget _buildGreeting() {
    final dayName = DateFormat('EEEE').format(DateTime.now());
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade50),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'HI, John',
                style: TextStyle(
                  fontSize: 22, 
                  fontWeight: FontWeight.w900, 
                  color: Color(0xFF1A3762),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              RichText(
                text: TextSpan(
                  style: const TextStyle(
                    fontSize: 10, 
                    fontWeight: FontWeight.bold, 
                    color: Colors.grey,
                    letterSpacing: 1.5,
                  ),
                  children: [
                    const TextSpan(text: 'TODAY IS '),
                    TextSpan(
                      text: dayName.toUpperCase(),
                      style: const TextStyle(color: Color(0xFFFF751F)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(LucideIcons.trendingUp, color: Colors.green.shade600, size: 24),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isExpanded, VoidCallback onToggle, {String altLabel = 'SHOW ALL'}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4), // Further reduced bottom padding
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.2)),
          TextButton.icon(
            onPressed: onToggle,
            label: Text(isExpanded ? 'SHOW LESS' : altLabel, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF1A3762))),
            icon: Icon(isExpanded ? LucideIcons.chevronUp : LucideIcons.chevronDown, size: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceDashboard() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1A3762).withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          )
        ],
      ),
      child: Column(
        children: [
          // Top Part (Blue)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            decoration: const BoxDecoration(
              color: Color(0xFF1A3762),
              borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'PAYABLE BALANCE',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2.5,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  '৳45,600.00',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
          // Bottom Part (White) - Removed blue background bleed
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMiniStat('Delivered', '৳85.0k', LucideIcons.banknote),
                _buildMiniStat('D. Charge', '৳5.4k', LucideIcons.receipt),
                _buildMiniStat('COD Charge', '৳1.2k', LucideIcons.creditCard),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 11, color: const Color(0xFFFF751F)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(color: Color(0xFF1A3762), fontSize: 10, fontWeight: FontWeight.w900)),
        const SizedBox(height: 1),
        Text(label.toUpperCase(), style: TextStyle(color: Colors.grey.shade400, fontSize: 7, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
      ],
    );
  }

  Widget _buildStatsGrid(List<StatItem> items, bool isExpanded) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: isExpanded ? items.length : 3,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          childAspectRatio: 1.1,
        ),
        itemBuilder: (context, index) {
          final item = items[index];
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade100),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(item.icon, size: 16, color: item.isOrange ? const Color(0xFFFF751F) : const Color(0xFF1A3762)),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.title.toUpperCase(), style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                    Text(item.value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildPickupCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFFF751F), width: 1),
      ),
      child: const Row(
        children: [
          Expanded(child: _PickupInfo(title: 'PICKUP', count: '12', sub: 'Request Pending', icon: LucideIcons.clock)),
          VerticalDivider(color: Color(0xFFE2E8F0)),
          Expanded(child: _PickupInfo(title: 'HISTORY', count: '45', sub: 'Picked yesterday', icon: LucideIcons.history)),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomAppBar(
      color: const Color(0xFF1A3762),
      shape: const AutomaticNotchedShape(
        RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      ),
      notchMargin: 8,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _navItem(LucideIcons.layoutDashboard, 'Home', 0),
          _navItem(LucideIcons.package, 'Parcels', 1),
          const SizedBox(width: 48), // Space for FAB
          _navItem(LucideIcons.fileText, 'Invoices', 2),
          _navItem(LucideIcons.user, 'Account', 3),
        ],
      ),
    );
  }

  Widget _navItem(IconData icon, String label, int index) {
    final active = _currentIndex == index;
    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white.withOpacity(active ? 1.0 : 0.4), size: 22),
          Text(label.toUpperCase(), style: TextStyle(color: Colors.white.withOpacity(active ? 1.0 : 0.4), fontSize: 8, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildAiInsightBox() {
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.indigo.shade50,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.indigo.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(LucideIcons.sparkles, size: 14, color: Colors.indigo),
              SizedBox(width: 8),
              Text('AI BUSINESS INSIGHT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.indigo)),
            ],
          ),
          const SizedBox(height: 8),
          Text(_aiInsight!, style: const TextStyle(fontSize: 12, color: Color(0xFF1A3762), fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildAiLoader() {
    return Container(
      color: Colors.black.withOpacity(0.2),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
          child: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: Colors.indigo),
              SizedBox(height: 16),
              Text('AI IS THINKING...', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.indigo, letterSpacing: 2)),
            ],
          ),
        ),
      ),
    );
  }
}

class _PickupInfo extends StatelessWidget {
  final String title, count, sub;
  final IconData icon;
  const _PickupInfo({required this.title, required this.count, required this.sub, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey)),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(icon, size: 16, color: const Color(0xFFFF751F)),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(count, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                Text(sub, style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ],
    );
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

  static const balanceBreakdown = [
    StatItem(title: "Delivered", value: "৳85,000", icon: LucideIcons.banknote, isOrange: false),
    StatItem(title: "D. Charge", value: "৳5,400", icon: LucideIcons.receipt, isOrange: true),
    StatItem(title: "COD Charge", value: "৳1,200", icon: LucideIcons.creditCard, isOrange: false),
  ];
}
