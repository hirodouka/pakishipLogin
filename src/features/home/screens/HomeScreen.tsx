import React, { useState, useRef, forwardRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Package, HelpCircle, Bell, User, LogOut, Clock, ArrowRight, ChevronRight, Circle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TutorialModal from '@/features/home/components/TutorialModal';
import NotificationModal from '@/features/home/components/NotificationModal';

const logoImg = require('../../../../assets/logo.png');
const sendParcelIcon = { uri: "https://i.imgur.com/a6gHhtu.png" };
const trackPackageIcon = { uri: "https://i.imgur.com/HHNarFY.png" };
const historyIcon = { uri: "https://i.imgur.com/4Xgmx8D.png" };
const rateReviewIcon = { uri: "https://i.imgur.com/pvzfoIz.png" };

export default function App() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const actionCardsRef = useRef<View>(null);
  const sendParcelRef = useRef<View>(null);
  const trackPackageRef = useRef<View>(null);
  const historyRef = useRef<View>(null);
  const rateReviewRef = useRef<View>(null);
  const activeDeliveriesRef = useRef<View>(null);
  const guideButtonRef = useRef<View>(null);
  const rootRef = useRef<View>(null);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  return (
    <View style={styles.container} ref={rootRef} collapsable={false}>
      <StatusBar style="auto" />

      {showTutorial && (
        <Modal transparent animationType="fade" visible={true} statusBarTranslucent={true}>
          <TutorialModal
            step={tutorialStep}
            onNext={() => setTutorialStep(s => s + 1)}
            onPrev={() => setTutorialStep(s => s - 1)}
            onClose={handleCloseTutorial}
            actionCardsRef={actionCardsRef}
            sendParcelRef={sendParcelRef}
            trackPackageRef={trackPackageRef}
            historyRef={historyRef}
            rateReviewRef={rateReviewRef}
            activeDeliveriesRef={activeDeliveriesRef}
            guideButtonRef={guideButtonRef}
            scrollViewRef={scrollViewRef}
            rootRef={rootRef}
          />
        </Modal>
      )}
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Image source={logoImg} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotifications(true)}>
            <Bell size={20} color="#39B5A8" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <View ref={guideButtonRef} collapsable={false}>
            <TouchableOpacity 
              style={styles.iconBtnSecondary} 
              onPress={() => setShowTutorial(true)}
            >
              <HelpCircle size={20} color="#39B5A8" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.profileBtn} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <User size={20} color="#39B5A8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn}>
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Navigation Section */}
        <Text style={styles.sectionHeader}>
          Navigation Menu
        </Text>

        <View style={styles.grid} ref={actionCardsRef} collapsable={false}>
          <ActionCard ref={sendParcelRef} image={sendParcelIcon} title="Send Parcel" desc="Book a delivery" accentColor="rgba(253, 184, 51, 0.1)" onPress={() => navigation.navigate('SendParcel')} />
          <ActionCard ref={trackPackageRef} image={trackPackageIcon} title="Track Package" desc="Live tracking" accentColor="rgba(84, 160, 204, 0.1)" onPress={() => navigation.navigate('TrackPackage')} />
          <ActionCard ref={historyRef} image={historyIcon} title="History" desc="Past deliveries" accentColor="rgba(57, 181, 168, 0.1)" onPress={() => navigation.navigate('History')} />
          <ActionCard ref={rateReviewRef} image={rateReviewIcon} title="Rate & Review" desc="Give feedback" accentColor="rgba(166, 220, 214, 0.2)" onPress={() => navigation.navigate('RateReview')} />
        </View>

        {/* Active Deliveries Section */}
        <View style={styles.deliveriesHeader} ref={activeDeliveriesRef} collapsable={false}>
          <View>
            <Text style={styles.deliveriesTitle}>
              Active Deliveries
            </Text>
          </View>
          <TouchableOpacity style={styles.viewAllBtnRow}>
            <Text style={styles.viewAllBtn}>View All</Text>
            <ChevronRight size={14} color="#39B5A8" />
          </TouchableOpacity>
        </View>

        <DeliveryItem id="PKS-2024-001" location="Makati City" time="15 mins away" status="In Transit" statusColor="#54A0CC" statusBg="rgba(84, 160, 204, 0.1)" />
        <DeliveryItem id="PKS-2024-002" location="Quezon City" time="30 mins away" status="Out for Delivery" statusColor="#FDB833" statusBg="rgba(253, 184, 51, 0.1)" />
        
        <View style={styles.spacer} />
      </ScrollView>

      <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </View>
  );
}

// Sub-components
const ActionCard = forwardRef(({ image, title, desc, accentColor, onPress }: any, ref: any) => {
  return (
    <View ref={ref} collapsable={false} style={styles.actionCardWrapper}>
      <Pressable 
        style={({ pressed }) => [
          styles.actionCard, 
          { 
            backgroundColor: pressed ? 'rgba(57, 181, 168, 0.15)' : '#fff', // visible dark bluish/teal tap highlight
            borderColor: pressed ? '#39B5A8' : 'rgba(57, 181, 168, 0.15)'
          },
          pressed && { transform: [{ scale: 0.96 }] }
        ]} 
        onPress={onPress}
      >
        <View style={styles.actionCardContent}>
          <View style={styles.actionCardIndicator} />
          <Text style={styles.actionCardTitle}>{title}</Text>
          <Text style={styles.actionCardDesc}>{desc}</Text>
        </View>
      </Pressable>
      
      {image && (
        <View style={styles.actionCardImgWrapper} pointerEvents="none">
          <Image source={image} style={styles.actionCardImg} resizeMode="contain" />
        </View>
      )}
    </View>
  );
});

function DeliveryItem({ id, location, time, status, statusColor, statusBg }: any) {
  const navigation = useNavigation<any>();
  
  return (
    <View style={styles.deliveryItem}>
      {/* Top half */}
      <View style={styles.deliveryTopRow}>
        <View style={styles.deliveryIconBox}>
          <Package size={24} color="#39B5A8" />
        </View>
        <View style={styles.deliveryDetails}>
          <View style={styles.deliveryIdRow}>
            <Text style={styles.deliveryId}>{id}</Text>
            <Circle size={6} color="#39B5A8" fill="#39B5A8" />
          </View>
          <Text style={styles.deliveryLoc}>{location}</Text>
          <View style={styles.deliveryTimeRow}>
            <Clock size={12} color="#39B5A8" />
            <Text style={styles.deliveryTime}>{time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.deliveryDivider} />

      {/* Bottom half */}
      <View style={styles.deliveryBottomRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{status.toUpperCase()}</Text>
        </View>

        <TouchableOpacity 
          style={styles.trackBtn} 
          onPress={() => navigation.navigate('TrackPackage')}
          activeOpacity={0.8}
        >
          <Text style={styles.trackBtnText}>TRACK</Text>
          <ArrowRight size={14} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F0F9F8'
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(57, 181, 168, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 50
  },
  logo: {
    height: 38, width: 114
  },
  headerActions: {
    flexDirection: 'row', alignItems: 'center', gap: 12
  },
  iconBtn: {
    alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)', position: 'relative'
  },
  iconBtnSecondary: {
    padding: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)', width: 40, height: 40, alignItems: 'center', justifyContent: 'center'
  },
  profileBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6F4F2', borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.3)', alignItems: 'center', justifyContent: 'center', marginLeft: 4
  },
  logoutBtn: {
    padding: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center'
  },
  badge: {
    position: 'absolute', top: -5, right: -5, width: 20, height: 20, backgroundColor: '#ef4444', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', zIndex: 10
  },
  badgeText: {
    color: 'white', fontSize: 10, fontWeight: '900'
  },
  scrollContainer: {
    flex: 1, width: '100%', paddingHorizontal: 16, paddingTop: 16
  },
  scrollContent: {
    paddingBottom: 350,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 16, fontWeight: '900', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8, marginBottom: 16
  },
  actionCardWrapper: {
    width: '47%',
    height: 124,
    marginTop: 48,
  },
  actionCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(57, 181, 168, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  actionCardImgWrapper: {
    position: 'absolute',
    top: -46,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    elevation: 10,
  },
  actionCardImg: {
    width: 100,
    height: 100,
  },
  actionCardContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  actionCardIndicator: {
    width: 24, height: 4, borderRadius: 2, backgroundColor: 'rgba(57, 181, 168, 0.3)', marginBottom: 8
  },
  actionCardTitle: {
    color: '#041614', fontWeight: '900', fontSize: 13
  },
  actionCardDesc: {
    color: '#9ca3af', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4
  },
  deliveriesHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  },
  deliveriesTitle: {
    fontSize: 22, fontWeight: '900', color: '#041614'
  },
  viewAllBtnRow: {
    flexDirection: 'row', alignItems: 'center', gap: 2
  },
  viewAllBtn: {
    color: '#39B5A8', fontWeight: 'bold', fontSize: 13
  },
  deliveryItem: {
    backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)', borderRadius: 24, padding: 18, marginBottom: 16, shadowColor: '#39B5A8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3
  },
  deliveryTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14
  },
  deliveryIconBox: {
    width: 52, height: 52, backgroundColor: '#E6F4F2', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.3)'
  },
  deliveryDetails: {
    flex: 1, justifyContent: 'center'
  },
  deliveryIdRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8
  },
  deliveryId: {
    color: '#041614', fontWeight: '900', fontSize: 15
  },
  deliveryLoc: {
    color: '#64748b', fontSize: 13, fontWeight: '500', marginTop: 2
  },
  deliveryTimeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4
  },
  deliveryTime: {
    color: '#39B5A8', fontSize: 11, fontWeight: '800'
  },
  deliveryDivider: {
    height: 1, backgroundColor: 'rgba(57, 181, 168, 0.1)', marginVertical: 16
  },
  deliveryBottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  statusBadge: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12
  },
  statusBadgeText: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1
  },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#39B5A8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 6,
    shadowColor: '#39B5A8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  trackBtnText: {
    color: '#ffffff', fontWeight: '900', fontSize: 12, letterSpacing: 1.5
  },
  spacer: {
    height: 40
  }
});
