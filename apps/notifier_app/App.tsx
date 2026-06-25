import './global.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  ArchiveX,
  ArrowRight,
  Bell,
  BellOff,
  BellRing,
  Camera,
  Check,
  ChevronLeft,
  Compass,
  Download,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PhoneOff,
  Plus,
  QrCode,
  ScanLine,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  Smartphone,
  Users,
  X,
  Zap,
} from 'lucide-react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/store';
import { cn, timeAgo } from './src/lib/utils';
import { AppEvent, NotificationImportance } from './src/types';

type TabKind = 'home' | 'dashboard' | 'notifications' | 'settings';
type RouteKind = 'main' | 'onboard' | 'test' | 'notifying';

const ink = '#3A312A';
const muted = '#8B7C71';
const sage = '#6B7A65';
const urgent = '#D97E69';
const slate = '#8A95A5';

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F0EBE1" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const [route, setRoute] = useState<RouteKind>('main');

  if (route === 'onboard') return <Onboarding onDone={() => setRoute('main')} />;
  if (route === 'test') return <TestRoute navigate={setRoute} />;
  if (route === 'notifying') return <Notifying onDismiss={() => setRoute('test')} />;
  return <MainApp navigate={setRoute} />;
}

function MainApp({ navigate }: { navigate: (route: RouteKind) => void }) {
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState<TabKind>('home');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [qrType, setQrType] = useState<'scan' | 'show' | null>(null);
  const [qrEventId, setQrEventId] = useState<string | null>(null);
  const { setQuickTriggerEventId } = useApp();

  const slide = useRef(new Animated.Value(0)).current;
  const lastIndex = useRef(0);
  const tabOrder: TabKind[] = ['home', 'dashboard', 'notifications', 'settings'];

  const changeTab = (tab: TabKind) => {
    const nextIndex = tabOrder.indexOf(tab);
    const direction = nextIndex > lastIndex.current ? 1 : -1;
    slide.setValue(direction * 36);
    setCurrentTab(tab);
    lastIndex.current = nextIndex;
    Animated.spring(slide, {
      toValue: 0,
      useNativeDriver: true,
      stiffness: 260,
      damping: 30,
      mass: 0.8,
    }).start();
  };

  return (
    <View className="flex-1 bg-shell items-center">
      <View className="w-full max-w-md flex-1 bg-paper overflow-hidden shadow-xl">
        <Animated.View
          className="flex-1"
          style={{ transform: [{ translateX: slide }] }}
        >
          {currentTab === 'home' && <QuickTrigger onScanQR={() => setQrType('scan')} />}
          {currentTab === 'dashboard' && (
            <Dashboard
              onEditEvent={id => {
                setEditingEventId(id);
                setCreateOpen(true);
              }}
              onShowQR={id => {
                setQrEventId(id);
                setQrType('show');
              }}
              onQuickTriggerSetup={id => {
                setQuickTriggerEventId(id);
                changeTab('home');
              }}
            />
          )}
          {currentTab === 'notifications' && <Notifications />}
          {currentTab === 'settings' && <SettingsScreen navigate={navigate} />}
        </Animated.View>

        {currentTab !== 'settings' && (
          <Pressable
            onPress={() => setCreateOpen(true)}
            className="absolute right-6 z-40 rounded-2xl bg-ink p-4 shadow-xl"
            style={{ bottom: insets.bottom + 110 }}
          >
            <Plus color="#FFFFFF" size={24} strokeWidth={2.5} />
          </Pressable>
        )}

        <View
          pointerEvents="box-none"
          className="absolute left-0 right-0 z-50"
          style={{ bottom: insets.bottom }}
        >
          <BottomNav currentTab={currentTab} onChange={changeTab} />
        </View>

        <CreateEventModal
          visible={createOpen}
          editingEventId={editingEventId}
          onClose={() => {
            setCreateOpen(false);
            setEditingEventId(null);
          }}
        />
        <QRModal
          type={qrType}
          initialEventId={qrEventId}
          onClose={() => {
            setQrType(null);
            setQrEventId(null);
          }}
        />
      </View>
    </View>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const contentStyle = useMemo(
    () => [
      styles.screenContent,
      {
        paddingTop: Math.max(insets.top + 28, 48),
        paddingBottom: Math.max(insets.bottom + 142, 164),
      },
    ],
    [insets.bottom, insets.top],
  );

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

function Header({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View className="mb-8 flex-row items-end justify-between">
      <View className="flex-1">
        <Text className="text-3xl font-extrabold tracking-tight text-ink">{title}</Text>
        {subtitle && (
          <Text className="mt-1 text-sm font-medium text-muted">{subtitle}</Text>
        )}
      </View>
      {right}
    </View>
  );
}

function BottomNav({
  currentTab,
  onChange,
}: {
  currentTab: TabKind;
  onChange: (tab: TabKind) => void;
}) {
  const tabs = [
    { id: 'home', label: 'Trigger', icon: Home },
    { id: 'dashboard', label: 'Events', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <View className="mx-4 mb-6 h-[76px] flex-row items-center justify-around rounded-[32px] border border-line/60 bg-white/90 px-2 shadow-xl">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = currentTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className="h-full flex-1 items-center justify-center"
          >
            <View className="relative h-8 w-12 items-center justify-center">
              {active && (
                <View className="absolute inset-0 rounded-full bg-[#EFEBE4]" />
              )}
              <Icon
                color={active ? ink : '#A89F95'}
                size={20}
                strokeWidth={active ? 2.5 : 2}
              />
            </View>
            <Text
              className={cn(
                'mt-1.5 text-[10px] font-bold tracking-wide',
                active ? 'text-ink' : 'text-[#A89F95]',
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function QuickTrigger({ onScanQR }: { onScanQR: () => void }) {
  const {
    events,
    currentUser,
    triggerNotification,
    quickTriggerEventId,
    setQuickTriggerEventId,
  } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    quickTriggerEventId,
  );
  const [importance, setImportance] =
    useState<NotificationImportance>('REGULAR');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );

  const joinedEvents = events.filter(
    e => e.subscribers.includes(currentUser.id) && !e.isArchived,
  );
  const selectedEvent = events.find(e => e.id === selectedEventId);

  useEffect(() => {
    if (quickTriggerEventId) {
      setSelectedEventId(quickTriggerEventId);
      setQuickTriggerEventId(null);
    }
  }, [quickTriggerEventId, setQuickTriggerEventId]);

  useEffect(() => {
    if (selectedEvent) {
      setImportance(selectedEvent.defaultMode || 'REGULAR');
      setMessage(selectedEvent.defaultMessage || '');
    }
  }, [selectedEvent]);

  const handleTrigger = () => {
    if (!selectedEventId || status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      const ok = Math.random() > 0.1;
      if (ok) {
        triggerNotification(selectedEventId, message || 'Ping!', importance);
        setMessage('');
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1200);
  };

  return (
    <View className="flex-1">
      <Screen>
        <Header
          title="Quick Trigger"
          subtitle="Send an alert instantly"
          right={
            <Pressable
              onPress={onScanQR}
              className="rounded-full border border-line bg-white p-3 shadow-sm"
            >
              <ScanLine color="#5C6956" size={20} strokeWidth={2.5} />
            </Pressable>
          }
        />

        <SectionTitle>TARGET EVENT</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-6 mb-4"
          contentContainerStyle={styles.eventRailContent}
        >
          {joinedEvents.map(event => {
            const selected = selectedEventId === event.id;
            return (
              <Pressable
                key={event.id}
                onPress={() => setSelectedEventId(event.id)}
                className={cn(
                  'w-36 rounded-[24px] px-4 py-5 shadow-sm',
                  selected
                    ? 'bg-sage shadow-lg'
                    : 'border border-line bg-white',
                )}
              >
                <Text
                  numberOfLines={2}
                  className={cn(
                    'text-[15px] font-bold leading-snug',
                    selected ? 'text-paper' : 'text-ink',
                  )}
                >
                  {event.name}
                </Text>
                <Text
                  className={cn(
                    'mt-2 text-xs font-semibold',
                    selected ? 'text-[#E6EBE4]' : 'text-[#A89F95]',
                  )}
                >
                  {event.subscribers.length} subs
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedEventId && (
          <View className="gap-8">
            <View>
              <SectionTitle>ACTION TYPE</SectionTitle>
              <View className="flex-row gap-3">
                {(['SILENT', 'REGULAR', 'URGENT'] as NotificationImportance[]).map(
                  type => (
                    <ModeButton
                      key={type}
                      mode={type}
                      active={importance === type}
                      onPress={() => setImportance(type)}
                    />
                  ),
                )}
              </View>
            </View>

            <View>
              <SectionTitle>MESSAGE</SectionTitle>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="What's happening?"
                placeholderTextColor="#B5AFA6"
                multiline
                textAlignVertical="top"
                className="h-28 rounded-[24px] border border-line bg-white p-5 text-[15px] font-medium text-ink shadow-sm"
              />
            </View>

            <Pressable
              disabled={status !== 'idle'}
              onPress={handleTrigger}
              className={cn(
                'w-full flex-row items-center justify-center gap-2 rounded-[24px] border py-5 shadow-xl',
                importance === 'URGENT'
                  ? 'border-[#C8735F] bg-urgent'
                  : importance === 'REGULAR'
                    ? 'border-[#5E6A59] bg-sage'
                    : 'border-[#7D8896] bg-slateping',
                status !== 'idle' && 'opacity-0',
              )}
            >
              <Zap color="#FFFFFF" size={20} fill="#FFFFFF" />
              <Text className="text-[15px] font-bold text-white">
                Fire Notification
              </Text>
            </Pressable>
          </View>
        )}
      </Screen>
      {status !== 'idle' && <StatusOverlay status={status} />}
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-4 text-sm font-bold tracking-wide text-muted">
      {children}
    </Text>
  );
}

function ModeButton({
  mode,
  active,
  onPress,
}: {
  mode: NotificationImportance;
  active: boolean;
  onPress: () => void;
}) {
  const activeClass =
    mode === 'URGENT'
      ? 'border-urgent bg-urgent'
      : mode === 'REGULAR'
        ? 'border-sage bg-sage'
        : 'border-slateping bg-slateping';
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 rounded-[20px] border py-3.5',
        active ? activeClass : 'border-line bg-white shadow-sm',
      )}
    >
      <Text
        className={cn(
          'text-center text-xs font-bold',
          active ? 'text-white' : 'text-[#7A6A5E]',
        )}
      >
        {mode}
      </Text>
    </Pressable>
  );
}

function StatusOverlay({
  status,
}: {
  status: 'loading' | 'success' | 'error';
}) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'loading') {
      const loop = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [rotate, status]);

  const icon =
    status === 'loading' ? (
      <Animated.View
        style={{
          transform: [
            {
              rotate: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <Settings color={muted} size={40} />
      </Animated.View>
    ) : status === 'success' ? (
      <Check color="#FFFFFF" size={48} strokeWidth={3} />
    ) : (
      <AlertCircle color="#FFFFFF" size={48} strokeWidth={2.5} />
    );

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-paper/95 px-8">
      <View className="items-center gap-6">
        <View
          className={cn(
            'h-24 w-24 items-center justify-center rounded-[32px] shadow-2xl',
            status === 'loading'
              ? 'bg-line'
              : status === 'success'
                ? 'bg-sage'
                : 'bg-urgent',
          )}
        >
          {icon}
        </View>
        <View className="items-center">
          <Text
            className={cn(
              'text-xl font-extrabold',
              status === 'loading'
                ? 'text-ink'
                : status === 'success'
                  ? 'text-sage'
                  : 'text-urgent',
            )}
          >
            {status === 'loading'
              ? 'Sending Alert...'
              : status === 'success'
                ? 'Ping Delivered'
                : 'Failed to Send'}
          </Text>
          <Text className="mt-2 text-center text-sm font-medium text-muted">
            {status === 'loading'
              ? 'Encrypting payload and dispatching'
              : status === 'success'
                ? 'All channel members have been notified'
                : 'Network interruption detected'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Dashboard({
  onEditEvent,
  onShowQR,
  onQuickTriggerSetup,
}: {
  onEditEvent: (id: string) => void;
  onShowQR: (id: string) => void;
  onQuickTriggerSetup: (id: string) => void;
}) {
  const { events, currentUser, leaveEvent } = useApp();
  const [activeTab, setActiveTab] = useState<'joined' | 'my_events'>('joined');
  const [viewingEventId, setViewingEventId] = useState<string | null>(null);
  const [warning, setWarning] = useState(false);
  const viewingEvent = events.find(e => e.id === viewingEventId);
  const myEvents = events.filter(e => e.creatorId === currentUser.id && !e.isArchived);
  const joinedEvents = events.filter(
    e => e.subscribers.includes(currentUser.id) && e.creatorId !== currentUser.id,
  );
  const displayed = activeTab === 'my_events' ? myEvents : joinedEvents;

  if (viewingEvent) {
    return (
      <View className="flex-1">
        <Screen>
          <Pressable
            onPress={() => setViewingEventId(null)}
            className="mb-6 w-24 flex-row items-center gap-2 rounded-xl bg-line px-4 py-2"
          >
            <ChevronLeft color={muted} size={18} />
            <Text className="text-sm font-bold tracking-wide text-muted">BACK</Text>
          </Pressable>
          <View className="mb-6 flex-row items-start justify-between">
            <Text className="flex-1 pr-4 text-3xl font-extrabold tracking-tight text-ink">
              {viewingEvent.name}
            </Text>
            <View className="flex-row gap-2">
              <RoundIcon onPress={() => onShowQR(viewingEvent.id)}>
                <QrCode color={muted} size={20} />
              </RoundIcon>
              {viewingEvent.creatorId === currentUser.id && (
                <RoundIcon onPress={() => onEditEvent(viewingEvent.id)}>
                  <Settings2 color={muted} size={20} />
                </RoundIcon>
              )}
            </View>
          </View>

          <View className="gap-6">
            <View className="rounded-[24px] border border-line bg-white p-6 shadow-sm">
              <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                Description
              </Text>
              <Text className="text-[15px] font-medium leading-relaxed text-ink">
                {viewingEvent.description || 'No description provided.'}
              </Text>
            </View>
            <View className="flex-row gap-4">
              <StatCard
                icon={<Users color={sage} size={24} />}
                value={`${viewingEvent.subscribers.length}`}
                label="Members"
              />
              <StatCard
                icon={<BellRing color={modeColor(viewingEvent.defaultMode)} size={24} />}
                value={viewingEvent.defaultMode}
                label="Default Mode"
                small
              />
            </View>
            {viewingEvent.creatorId === currentUser.id ? (
              <Pressable
                onPress={() => onQuickTriggerSetup(viewingEvent.id)}
                className="flex-row items-center justify-center gap-2 rounded-[20px] bg-sage py-4 shadow-lg"
              >
                <Zap color="#FFFFFF" size={20} />
                <Text className="text-[15px] font-bold text-white">
                  Add to Quick trigger
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setWarning(true)}
                className="flex-row items-center justify-center gap-2 rounded-[20px] border border-[#E8D9D5] bg-white py-4 shadow-sm"
              >
                <LogOut color="#9E4D36" size={20} />
                <Text className="text-[15px] font-bold text-[#9E4D36]">
                  Unsubscribe
                </Text>
              </Pressable>
            )}
          </View>
        </Screen>
        <ConfirmModal
          visible={warning}
          title="Unsubscribe?"
          body={`You will no longer receive updates or pings from ${viewingEvent.name}. You'll need an invite code to join again.`}
          action="Unsubscribe"
          onCancel={() => setWarning(false)}
          onAction={() => {
            leaveEvent(viewingEvent.id);
            setViewingEventId(null);
            setWarning(false);
          }}
        />
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Events" subtitle="Manage your connections" />
      <View className="mb-8 flex-row rounded-2xl bg-line p-1.5">
        <Segment
          label="Joined"
          active={activeTab === 'joined'}
          onPress={() => setActiveTab('joined')}
        />
        <Segment
          label="Created by Me"
          active={activeTab === 'my_events'}
          onPress={() => setActiveTab('my_events')}
        />
      </View>
      <View className="gap-4">
        {displayed.length === 0 ? (
          <Text className="py-12 text-center text-[15px] font-medium text-muted">
            No events found.
          </Text>
        ) : (
          displayed.map(event => (
            <EventCard
              key={event.id}
              event={event}
              subscribed={activeTab === 'joined'}
              onPress={() => setViewingEventId(event.id)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function Segment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn('flex-1 rounded-xl py-2.5', active && 'bg-white shadow-sm')}
    >
      <Text
        className={cn(
          'text-center text-[15px] font-bold',
          active ? 'text-ink' : 'text-muted',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function EventCard({
  event,
  subscribed,
  onPress,
}: {
  event: AppEvent;
  subscribed?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-[24px] border border-line bg-white p-5 shadow-sm"
    >
      <View className="mb-2 flex-row items-start justify-between gap-3">
        <Text numberOfLines={1} className="flex-1 text-lg font-extrabold text-ink">
          {event.name}
        </Text>
        {subscribed && (
          <Text className="rounded-lg border border-[#6B7A65]/20 bg-[#F5F7F4] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-sage">
            Subscribed
          </Text>
        )}
      </View>
      <Text numberOfLines={2} className="mb-5 text-[15px] font-medium leading-relaxed text-[#7A6A5E]">
        {event.description}
      </Text>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <Users color={muted} size={16} />
          <Text className="text-xs font-bold text-[#A89F95]">
            {event.subscribers.length}{' '}
            {event.subscribers.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
        <ModePill mode={event.defaultMode} />
      </View>
    </Pressable>
  );
}

function Notifications() {
  const { notifications, events, users, currentUser } = useApp();
  const myNotifications = notifications.filter(n => {
    const event = events.find(e => e.id === n.eventId);
    return event?.subscribers.includes(currentUser.id);
  });

  return (
    <Screen>
      <Header
        title="Notifications"
        subtitle="Recent pings from your events"
        right={
          <Text className="rounded-full bg-line px-4 py-1.5 text-xs font-bold text-[#5C4D43]">
            {myNotifications.length} New
          </Text>
        }
      />
      <View className="gap-4">
        {myNotifications.length === 0 ? (
          <Text className="py-12 text-center text-[15px] font-medium text-muted">
            All caught up!
          </Text>
        ) : (
          myNotifications.map(notif => {
            const event = events.find(e => e.id === notif.eventId);
            const user = users.find(u => u.id === notif.triggerUserId);
            const isUrgent = notif.importance === 'URGENT';
            const isSilent = notif.importance === 'SILENT';
            return (
              <View
                key={notif.id}
                className={cn(
                  'relative flex-row gap-4 overflow-hidden rounded-[24px] border p-5 shadow-sm',
                  isUrgent ? 'border-[#D97E69]/30 bg-[#FDF7F5]' : 'border-line bg-white',
                )}
              >
                {isUrgent && (
                  <View className="absolute bottom-0 left-0 top-0 w-1.5 bg-urgent" />
                )}
                <Avatar name={user?.name || '?'} />
                <View className="flex-1">
                  <View className="mb-1.5 flex-row justify-between gap-3">
                    <Text className="flex-1 text-[11px] font-bold uppercase tracking-widest text-muted">
                      {event?.name}
                    </Text>
                    <Text className="text-[11px] font-bold text-[#A89F95]">
                      {timeAgo(notif.timestamp)}
                    </Text>
                  </View>
                  <Text
                    className={cn(
                      'mb-2 text-[15px] font-medium leading-relaxed text-ink',
                      isUrgent && 'font-bold text-[#9E4D36]',
                    )}
                  >
                    {notif.message}
                  </Text>
                  <View className="mt-3 flex-row items-center gap-2">
                    <Text className="text-[12px] font-bold text-muted">{user?.name}</Text>
                    {isUrgent && (
                      <View className="flex-row items-center rounded-md bg-[#FCECE8] px-2 py-0.5">
                        <ShieldAlert color="#9E4D36" size={14} strokeWidth={2.5} />
                        <Text className="ml-1 text-[10px] font-extrabold tracking-wide text-[#9E4D36]">
                          URGENT
                        </Text>
                      </View>
                    )}
                    {isSilent && <ModePill mode="SILENT" />}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </Screen>
  );
}

function SettingsScreen({ navigate }: { navigate: (route: RouteKind) => void }) {
  const { currentUser, events } = useApp();
  const [archived, setArchived] = useState(false);
  const archivedEvents = events.filter(
    e => e.creatorId === currentUser.id && e.isArchived,
  );

  if (archived) {
    return (
      <Screen>
        <Pressable
          onPress={() => setArchived(false)}
          className="mb-8 w-44 flex-row items-center gap-2 rounded-xl bg-line px-4 py-2"
        >
          <ChevronLeft color={muted} size={20} />
          <Text className="text-sm font-bold tracking-wide text-muted">
            BACK TO SETTINGS
          </Text>
        </Pressable>
        <Header title="Archived Events" subtitle="Events you have archived" />
        <View className="gap-4">
          {archivedEvents.length === 0 ? (
            <Text className="py-12 text-center text-[15px] font-medium text-muted">
              No archived events.
            </Text>
          ) : (
            archivedEvents.map(event => (
              <View key={event.id} className="opacity-70">
                <EventCard event={event} />
              </View>
            ))
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Settings" />
      <View className="mb-8 flex-row items-center gap-5 rounded-[28px] border border-line bg-white p-6 shadow-sm">
        <Avatar name={currentUser.name} large />
        <View>
          <Text className="text-xl font-extrabold text-ink">{currentUser.name}</Text>
          <Text className="text-[15px] font-bold text-muted">{currentUser.handle}</Text>
        </View>
      </View>
      <View className="overflow-hidden rounded-[28px] border border-line bg-white shadow-sm">
        <SettingsRow
          icon={<BellOff color={sage} size={20} />}
          iconClass="bg-[#F5F7F4]"
          title="Push Preferences"
          subtitle="Manage alert behaviors"
        />
        <SettingsRow
          icon={<Shield color={urgent} size={20} />}
          iconClass="bg-[#FFF6F3]"
          title="Privacy & Security"
          subtitle="Control who can ping you"
        />
        <SettingsRow
          icon={<ArchiveX color={muted} size={20} />}
          title="Archived Events"
          subtitle="View and manage older events"
          onPress={() => setArchived(true)}
        />
        <SettingsRow
          icon={<Smartphone color={muted} size={20} />}
          title="Device Settings"
          subtitle="Vibration & System sounds"
        />
        <SettingsRow
          icon={<Smartphone color={ink} size={20} />}
          title="Debug & Testing"
          subtitle="Test routes and components"
          onPress={() => navigate('test')}
          last
        />
      </View>
      <Pressable className="mt-6 flex-row items-center justify-center rounded-[24px] border border-line bg-white py-5 shadow-sm">
        <LogOut color={urgent} size={20} />
        <Text className="ml-2 text-[15px] font-bold text-urgent">Sign Out</Text>
      </Pressable>
    </Screen>
  );
}

function CreateEventModal({
  visible,
  onClose,
  editingEventId,
}: {
  visible: boolean;
  onClose: () => void;
  editingEventId?: string | null;
}) {
  const { createEvent, updateEvent, events } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [defaultMode, setDefaultMode] =
    useState<NotificationImportance>('REGULAR');
  const [recurrence, setRecurrence] =
    useState<AppEvent['recurrence']>('none');

  useEffect(() => {
    if (!visible) return;
    const event = events.find(e => e.id === editingEventId);
    setName(event?.name || '');
    setDescription(event?.description || '');
    setDefaultMessage(event?.defaultMessage || '');
    setDefaultMode(event?.defaultMode || 'REGULAR');
    setRecurrence(event?.recurrence || 'none');
  }, [editingEventId, events, visible]);

  const save = () => {
    if (!name.trim()) return;
    const data = {
      name,
      description,
      defaultMessage,
      defaultMode,
      isPublic: true,
      recurrence,
    };
    if (editingEventId) updateEvent(editingEventId, data);
    else createEvent(data);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-[#2B231D]/40">
        <View className="max-h-[90%] rounded-t-[32px] bg-paper p-6 shadow-2xl">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-extrabold text-ink">
              {editingEventId ? 'Edit Event' : 'New Event'}
            </Text>
            <Pressable onPress={onClose} className="rounded-full bg-line p-2.5">
              <X color="#7A6A5E" size={20} />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalFormContent}
          >
            <Field label="Title">
              <Input value={name} onChangeText={setName} placeholder="e.g. Server Alerts" bold />
            </Field>
            <Field label="Description (Optional)">
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="What is this event for?"
                multiline
              />
            </Field>
            <Field label="Default Message (Optional)">
              <Input
                value={defaultMessage}
                onChangeText={setDefaultMessage}
                placeholder="e.g. Server is down, please join call"
                bold
              />
            </Field>
            <Field label="Recurrence">
              <View className="flex-row gap-3">
                {(['none', 'daily', 'weekly'] as AppEvent['recurrence'][]).map(item => (
                  <Pressable
                    key={item}
                    onPress={() => setRecurrence(item)}
                    className={cn(
                      'flex-1 rounded-xl border py-3',
                      recurrence === item ? 'border-sage bg-[#F5F7F4]' : 'border-line bg-white',
                    )}
                  >
                    <Text className="text-center text-sm font-bold capitalize text-ink">
                      {item === 'none' ? 'Once' : item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>
            <Field label="Default Mode">
              <View className="flex-row gap-3">
                {(['SILENT', 'REGULAR', 'URGENT'] as NotificationImportance[]).map(
                  mode => (
                    <ModeButton
                      key={mode}
                      mode={mode}
                      active={defaultMode === mode}
                      onPress={() => setDefaultMode(mode)}
                    />
                  ),
                )}
              </View>
            </Field>
            <Pressable
              onPress={save}
              className="mt-2 rounded-[20px] bg-sage py-5 shadow-xl"
            >
              <Text className="text-center text-[15px] font-bold text-white">
                {editingEventId ? 'Save Changes' : 'Create Event'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function QRModal({
  type,
  onClose,
  initialEventId,
}: {
  type: 'scan' | 'show' | null;
  onClose: () => void;
  initialEventId?: string | null;
}) {
  const { currentUser, events } = useApp();
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || '');
  const scanLine = useRef(new Animated.Value(0)).current;
  const userEvents = events.filter(
    e => e.creatorId === currentUser.id || e.subscribers.includes(currentUser.id),
  );

  useEffect(() => {
    if (initialEventId) setSelectedEventId(initialEventId);
    else if (userEvents.length && !selectedEventId) setSelectedEventId(userEvents[0].id);
  }, [initialEventId, selectedEventId, userEvents]);

  useEffect(() => {
    if (type !== 'scan') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine, type]);

  return (
    <Modal transparent visible={!!type} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-[#2B231D]/80 p-6">
        {type === 'scan' ? (
          <View className="w-full max-w-sm items-center">
            <Pressable onPress={onClose} className="mb-8 self-end rounded-full bg-white/20 p-3">
              <X color="#FFFFFF" size={24} />
            </Pressable>
            <View className="aspect-square w-full overflow-hidden rounded-[32px] border-[3px] border-sage bg-ink">
              <View className="flex-1 items-center justify-center">
                <Camera color={muted} size={48} />
              </View>
              <Animated.View
                className="absolute left-0 right-0 top-0 h-1 bg-[#85A090]"
                style={{
                  transform: [
                    {
                      translateY: scanLine.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 320],
                      }),
                    },
                  ],
                }}
              />
            </View>
            <Text className="mt-8 text-3xl font-extrabold text-paper">Scan Code</Text>
            <Text className="mt-3 text-center text-[15px] font-medium text-[#A89F95]">
              Position the QR within the frame to join a Ping channel.
            </Text>
          </View>
        ) : (
          <View className="w-full max-w-sm rounded-[32px] bg-paper p-6 shadow-2xl">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-extrabold text-ink">Event QR</Text>
              <Pressable onPress={onClose} className="rounded-full bg-line p-2.5">
                <X color="#7A6A5E" size={20} />
              </Pressable>
            </View>
            <View className="mb-6 rounded-xl border border-line bg-white p-4">
              <Text className="text-[15px] font-bold text-ink">
                {userEvents.find(e => e.id === selectedEventId)?.name ||
                  'No events available'}
              </Text>
            </View>
            <View className="mb-6 aspect-square items-center justify-center rounded-3xl border-[3px] border-line bg-white">
              <QrCode color={ink} size={128} strokeWidth={0.5} />
            </View>
            <Text className="mb-8 text-center text-[15px] font-medium leading-relaxed text-muted">
              Share this code to quickly invite others to join your alert channel.
            </Text>
            <Pressable className="flex-row items-center justify-center gap-2 rounded-[20px] bg-sage py-4 shadow-xl">
              <Download color="#FFFFFF" size={20} />
              <Text className="text-[15px] font-bold text-white">Save to Gallery</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const slides = [
    {
      title: 'Connect with Groups',
      description:
        'Create or join event channels with your friends, family, or team using QR codes.',
      icon: <Users color={muted} size={56} />,
      color: 'bg-line',
    },
    {
      title: 'Reach Them Instantly',
      description:
        'Send silent pings or break through DND modes with urgent full-screen alerts.',
      icon: <BellRing color="#9E4D36" size={56} />,
      color: 'bg-[#FCECE8]',
    },
    {
      title: 'Quick Actions',
      description:
        'Set up quick triggers to notify your circle in seconds when you need them most.',
      icon: <Zap color={sage} size={56} />,
      color: 'bg-[#E9EDE7]',
    },
  ];
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const done = current === slides.length - 1;

  return (
    <View className="flex-1 items-center bg-shell">
      <View className="w-full max-w-md flex-1 bg-paper">
        <View className="z-20 items-end p-6">
          <Pressable onPress={onDone} className="px-4 py-2">
            <Text className="text-sm font-bold uppercase tracking-wide text-muted">
              Skip
            </Text>
          </Pressable>
        </View>
        <View className="-mt-16 flex-1 items-center justify-center p-8">
          <View className={cn('mb-8 h-32 w-32 items-center justify-center rounded-full', slide.color)}>
            {slide.icon}
          </View>
          <Text className="mb-4 text-center text-3xl font-extrabold text-ink">
            {slide.title}
          </Text>
          <Text className="max-w-[280px] text-center text-lg font-medium leading-relaxed text-muted">
            {slide.description}
          </Text>
        </View>
        <View className="p-8 pb-12">
          <View className="mb-10 flex-row justify-center gap-2">
            {slides.map((_, i) => (
              <View
                key={i}
                className={cn(
                  'h-2.5 rounded-full',
                  i === current ? 'w-8 bg-ink' : 'w-2.5 bg-line',
                )}
              />
            ))}
          </View>
          <Pressable
            onPress={() => (done ? onDone() : setCurrent(s => s + 1))}
            className="flex-row items-center justify-center gap-2 rounded-[20px] bg-ink py-4 shadow-xl"
          >
            <Text className="text-lg font-bold text-white">
              {done ? 'Get Started' : 'Continue'}
            </Text>
            {done ? <Check color="#FFFFFF" size={20} /> : <ArrowRight color="#FFFFFF" size={20} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function TestRoute({ navigate }: { navigate: (route: RouteKind) => void }) {
  return (
    <View className="flex-1 items-center bg-shell">
      <View className="w-full max-w-md flex-1 bg-paper px-6 pb-24 pt-12">
        <Pressable
          onPress={() => navigate('main')}
          className="mb-8 w-24 flex-row items-center gap-2 rounded-xl bg-line px-4 py-2"
        >
          <ChevronLeft color={muted} size={20} />
          <Text className="text-sm font-bold tracking-wide text-muted">BACK</Text>
        </Pressable>
        <Header title="Test Routes" subtitle="Navigate to different standalone modes" />
        <View className="gap-4">
          <RouteCard
            icon={<Compass color={sage} size={24} />}
            title="Onboarding Flow"
            subtitle="View the 3-step intro sliders"
            onPress={() => navigate('onboard')}
          />
          <RouteCard
            icon={<BellRing color="#9E4D36" size={24} />}
            title="Urgent Notify Page"
            subtitle="Simulate an incoming urgent SOS"
            onPress={() => navigate('notifying')}
            warm
          />
        </View>
      </View>
    </View>
  );
}

function Notifying({ onDismiss }: { onDismiss: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [
      { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) },
    ],
  };

  return (
    <View className="flex-1 items-center bg-[#9E4D36]">
      <Animated.View
        className="absolute top-1/2 h-64 w-64 rounded-full border-4 border-white/20"
        style={ringStyle}
      />
      <View className="z-10 flex-1 items-center justify-center p-6 pt-20">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-2xl">
          <Text className="text-4xl font-black text-white">S</Text>
        </View>
        <Text className="mb-2 text-xl font-bold uppercase tracking-widest text-white/80">
          Incoming Ping
        </Text>
        <Text className="mb-6 text-5xl font-black text-white">Mom</Text>
        <View className="mx-4 rounded-2xl border border-white/20 bg-white/10 px-6 py-4">
          <Text className="text-center text-lg font-medium leading-relaxed text-white">
            "Are you free right now? Please call back when you see this."
          </Text>
        </View>
      </View>
      <View className="z-10 flex-row items-center justify-center gap-12 p-8 pb-16">
        <NotifyAction
          label="Dismiss"
          icon={<PhoneOff color="#9E4D36" size={24} />}
          onPress={onDismiss}
        />
        <NotifyAction
          label="Reply"
          dark
          icon={<MessageSquare color="#FFFFFF" size={24} />}
          onPress={onDismiss}
        />
      </View>
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
        {label}
      </Text>
      {children}
    </View>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
  bold,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  bold?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#B5AFA6"
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      className={cn(
        'rounded-xl border border-line bg-white px-5 py-4 text-[15px] text-ink',
        bold ? 'font-bold' : 'font-medium',
        multiline && 'h-24',
      )}
    />
  );
}

function Avatar({ name, large }: { name: string; large?: boolean }) {
  return (
    <View
      className={cn(
        'items-center justify-center rounded-full border border-line bg-[#F3EFEA]',
        large ? 'h-16 w-16' : 'h-12 w-12',
      )}
    >
      <Text className={cn('font-extrabold text-muted', large ? 'text-xl' : 'text-base')}>
        {name.slice(0, 1)}
      </Text>
    </View>
  );
}

function RoundIcon({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="rounded-full border border-line bg-white p-2.5 shadow-sm">
      {children}
    </Pressable>
  );
}

function StatCard({
  icon,
  value,
  label,
  small,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <View className="flex-1 items-center justify-center rounded-[24px] border border-line bg-white p-5 text-center shadow-sm">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-[#F5F7F4]">
        {icon}
      </View>
      <Text className={cn('font-extrabold text-ink', small ? 'text-lg' : 'text-2xl')}>
        {value}
      </Text>
      <Text className="text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </Text>
    </View>
  );
}

function ModePill({ mode }: { mode: NotificationImportance }) {
  return (
    <Text
      className={cn(
        'rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide',
        mode === 'URGENT'
          ? 'bg-[#FCECE8] text-[#9E4D36]'
          : mode === 'REGULAR'
            ? 'bg-[#F5F7F4] text-[#4F644B]'
            : 'bg-[#F5F6F8] text-slateping',
      )}
    >
      {mode}
    </Text>
  );
}

function modeColor(mode: NotificationImportance) {
  if (mode === 'URGENT') return '#9E4D36';
  if (mode === 'REGULAR') return '#4F644B';
  return slate;
}

function SettingsRow({
  icon,
  iconClass = 'bg-[#EFEBE4]',
  title,
  subtitle,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  iconClass?: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn('flex-row items-center px-5 py-5', !last && 'border-b border-line/50')}
    >
      <View className={cn('mr-4 h-10 w-10 items-center justify-center rounded-xl', iconClass)}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-ink">{title}</Text>
        <Text className="mt-0.5 text-xs font-medium text-muted">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function ConfirmModal({
  visible,
  title,
  body,
  action,
  onCancel,
  onAction,
}: {
  visible: boolean;
  title: string;
  body: string;
  action: string;
  onCancel: () => void;
  onAction: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl">
          <View className="mx-auto mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#FCECE8]">
            <AlertTriangle color="#9E4D36" size={24} />
          </View>
          <Text className="mb-2 text-center text-xl font-extrabold text-ink">{title}</Text>
          <Text className="mb-6 text-center text-[15px] font-medium leading-relaxed text-muted">
            {body}
          </Text>
          <View className="flex-row gap-3">
            <Pressable onPress={onCancel} className="flex-1 rounded-xl bg-[#F5F6F8] py-3.5">
              <Text className="text-center text-[15px] font-bold text-ink">Cancel</Text>
            </Pressable>
            <Pressable onPress={onAction} className="flex-1 rounded-xl bg-urgent py-3.5 shadow-lg">
              <Text className="text-center text-[15px] font-bold text-white">{action}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function RouteCard({
  icon,
  title,
  subtitle,
  onPress,
  warm,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  warm?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-[24px] border border-line bg-white p-6 shadow-sm"
    >
      <View className={cn('h-12 w-12 items-center justify-center rounded-xl', warm ? 'bg-[#FCECE8]' : 'bg-[#E9EDE7]')}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-extrabold text-ink">{title}</Text>
        <Text className="text-sm font-medium text-muted">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function NotifyAction({
  icon,
  label,
  onPress,
  dark,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  dark?: boolean;
}) {
  return (
    <View className="items-center gap-3">
      <Pressable
        onPress={onPress}
        className={cn('h-16 w-16 items-center justify-center rounded-full shadow-xl', dark ? 'bg-ink' : 'bg-white')}
      >
        {icon}
      </Pressable>
      <Text className="text-sm font-bold tracking-wide text-white/80">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 24,
  },
  eventRailContent: {
    gap: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  modalFormContent: {
    gap: 20,
  },
});

export default App;
