import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import '../models/product.dart';
import 'tryon_screen.dart';
import 'packing_planner_screen.dart';
import 'styling_screen.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final Set<String> _readNotificationIds = {};

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);

    // Build notifications list
    final List<NotificationItem> allNotifications = [
      // 1. Weather notification (dynamic)
      NotificationItem(
        id: 'weather_1',
        title: 'Today\'s Weather Recommendation',
        body: 'It\'s 24°C & Sunny! Try on the suggested Structured Wool Blazer look.',
        icon: Icons.wb_sunny_outlined,
        iconColor: Colors.orange,
        time: '1h ago',
        isUnread: !_readNotificationIds.contains('weather_1'),
        onTap: () {
          // Preload with Structured Wool Blazer (ID 1)
          final blazer = Product.dummyProducts.firstWhere(
            (p) => p.id == '1',
            orElse: () => Product.dummyProducts.first,
          );
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TryOnScreen(product: blazer),
            ),
          );
        },
      ),
      // 2. Try-on Ready notification (Boyfriend Jeans)
      NotificationItem(
        id: 'tryon_jeans',
        title: 'Vendor Demo Video Ready',
        body: 'New demo video uploaded for Boyfriend Mid Rise Cropped Turn Up Jeans. Tap to see the fit!',
        icon: Icons.play_circle_outline,
        iconColor: AppTheme.primaryColor,
        time: '3h ago',
        isUnread: !_readNotificationIds.contains('tryon_jeans'),
        onTap: () {
          final jeans = Product.dummyProducts.firstWhere(
            (p) => p.id == '8',
            orElse: () => Product.dummyProducts.first,
          );
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TryOnScreen(product: jeans),
            ),
          );
        },
      ),
      // 3. Trip Checklist reminder (dynamic based on active trip plans)
      if (provider.tripPlans.isNotEmpty)
        NotificationItem(
          id: 'trip_reminder',
          title: 'Packing Planner Update',
          body: 'Upcoming trip to ${provider.tripPlans.first.destination} starts soon! Double-check your outfit calendar.',
          icon: Icons.luggage_outlined,
          iconColor: Colors.deepPurple,
          time: '5h ago',
          isUnread: !_readNotificationIds.contains('trip_reminder'),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const PackingPlannerScreen(),
              ),
            );
          },
        )
      else
        NotificationItem(
          id: 'trip_suggestion',
          title: 'Trip Packing Planner',
          body: 'Planning a getaway? Design and pack outfits day-by-day in the Trip Packing screen.',
          icon: Icons.add_road_outlined,
          iconColor: Colors.blueGrey,
          time: '1d ago',
          isUnread: !_readNotificationIds.contains('trip_suggestion'),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const PackingPlannerScreen(),
              ),
            );
          },
        ),
      // 4. Custom garment cutout notification (dynamic based on custom garments)
      if (provider.customGarments.isNotEmpty)
        NotificationItem(
          id: 'garment_cutout',
          title: 'AI Background Cutout Complete',
          body: 'Background removed successfully for "${provider.customGarments.first.name}". Ready to style!',
          icon: Icons.auto_fix_high_outlined,
          iconColor: Colors.teal,
          time: '1d ago',
          isUnread: !_readNotificationIds.contains('garment_cutout'),
          onTap: () {
            // Direct to styling board
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const StylingScreen(),
              ),
            );
          },
        ),
      // 5. Community post like
      NotificationItem(
        id: 'like_alert',
        title: 'Community Post Interaction',
        body: 'ChloeStyle and 14 other creators liked your shared community look!',
        icon: Icons.favorite_outline,
        iconColor: Colors.redAccent,
        time: '2d ago',
        isUnread: !_readNotificationIds.contains('like_alert'),
      ),
      // 6. Welcome / onboarding tips
      NotificationItem(
        id: 'welcome_onboarding',
        title: 'Complete Your Try-on Avatar',
        body: 'Make sure to capture/upload a portrait photo in Onboarding for optimal try-on precision.',
        icon: Icons.face_retouching_natural,
        iconColor: AppTheme.primaryColor,
        time: '3d ago',
        isUnread: !_readNotificationIds.contains('welcome_onboarding'),
      ),
    ];

    final unreadCount = allNotifications.where((n) => n.isUnread).length;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppTheme.textColorPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            const Text(
              'NOTIFICATIONS',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                letterSpacing: 1.5,
                color: AppTheme.textColorPrimary,
              ),
            ),
            if (unreadCount > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$unreadCount new',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: AppTheme.textColorSecondary,
          indicatorColor: AppTheme.primaryColor,
          indicatorWeight: 2.5,
          tabs: const [
            Tab(text: 'All Activity'),
            Tab(text: 'System Alerts'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNotificationList(allNotifications),
          _buildNotificationList(
            allNotifications.where((n) => n.id.startsWith('weather_') || n.id.startsWith('tryon_') || n.id == 'welcome_onboarding').toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationList(List<NotificationItem> list) {
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.notifications_off_outlined, size: 48, color: Colors.grey),
            SizedBox(height: 12),
            Text(
              'All caught up!',
              style: TextStyle(color: AppTheme.textColorSecondary, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      itemCount: list.length,
      padding: const EdgeInsets.symmetric(vertical: 8),
      separatorBuilder: (context, index) => const Divider(height: 1, indent: 72),
      itemBuilder: (context, index) {
        final item = list[index];

        return InkWell(
          onTap: () {
            setState(() {
              _readNotificationIds.add(item.id);
            });
            if (item.onTap != null) {
              item.onTap!();
            }
          },
          child: Container(
            color: item.isUnread ? AppTheme.secondaryColor.withOpacity(0.12) : Colors.transparent,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon block
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: item.iconColor.withOpacity(0.08),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(item.icon, color: item.iconColor, size: 22),
                ),
                const SizedBox(width: 16),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              item.title,
                              style: TextStyle(
                                fontWeight: item.isUnread ? FontWeight.bold : FontWeight.w600,
                                fontSize: 13.5,
                                color: AppTheme.textColorPrimary,
                              ),
                            ),
                          ),
                          Text(
                            item.time,
                            style: const TextStyle(
                              color: AppTheme.textColorSecondary,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.body,
                        style: TextStyle(
                          fontSize: 12,
                          height: 1.35,
                          color: item.isUnread ? AppTheme.textColorPrimary : AppTheme.textColorSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                // Unread dot indicator
                if (item.isUnread) ...[
                  const SizedBox(width: 12),
                  Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(top: 6),
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}

class NotificationItem {
  final String id;
  final String title;
  final String body;
  final IconData icon;
  final Color iconColor;
  final String time;
  final bool isUnread;
  final VoidCallback? onTap;

  NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.icon,
    required this.iconColor,
    required this.time,
    this.isUnread = false,
    this.onTap,
  });
}
