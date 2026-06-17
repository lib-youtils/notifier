import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const notifications = [
  {
    title: 'Build finished',
    detail: 'Android release bundle completed 2 minutes ago',
    tone: 'Success',
  },
  {
    title: 'Reminder queued',
    detail: 'Weekly digest will go out today at 6:30 PM',
    tone: 'Scheduled',
  },
  {
    title: 'Webhook retry',
    detail: 'Last delivery failed once and is retrying automatically',
    tone: 'Attention',
  },
  {
    title: 'Campaign approved',
    detail: 'Product launch push notification was approved by marketing',
    tone: 'Ready',
  },
  {
    title: 'Quiet hours enabled',
    detail: 'Night delivery suppression is active from 11:00 PM to 7:00 AM',
    tone: 'Policy',
  },
  {
    title: 'Segment refreshed',
    detail: 'Audience sync pulled in 412 newly active users',
    tone: 'Updated',
  },
];

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F1EA"
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>TEST UI</Text>
          <Text style={styles.heroTitle}>Notifier sandbox</Text>
          <Text style={styles.heroText}>
            A clean temporary screen with fake content for visual testing.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>128</Text>
              <Text style={styles.metricLabel}>Sent today</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>04</Text>
              <Text style={styles.metricLabel}>Queued</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>97%</Text>
              <Text style={styles.metricLabel}>Delivery rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.sectionCaption}>Mock data</Text>
        </View>

        {notifications.map(item => (
          <View key={item.title} style={styles.notificationCard}>
            <View style={styles.notificationTopRow}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationTone}>{item.tone}</Text>
            </View>
            <Text style={styles.notificationDetail}>{item.detail}</Text>
          </View>
        ))}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Next step</Text>
          <Text style={styles.footerText}>
            Replace this screen once the real notifier flows are ready.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#FFFDF8',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E7DED2',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#8A6B45',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#1F1A14',
  },
  heroText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: '#5D5348',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#EFE5D7',
    borderRadius: 20,
    padding: 16,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#241D15',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#65594D',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#221C16',
  },
  sectionCaption: {
    fontSize: 13,
    color: '#7F7367',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E9E1D7',
  },
  notificationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#201A14',
  },
  notificationTone: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A6B45',
  },
  notificationDetail: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#64584D',
  },
  footerCard: {
    marginTop: 6,
    backgroundColor: '#DCE9E0',
    borderRadius: 22,
    padding: 18,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#203328',
  },
  footerText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: '#3F5648',
  },
});

export default App;
