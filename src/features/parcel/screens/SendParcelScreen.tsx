import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Dimensions, Pressable, LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin, Target, Navigation, Clock, ChevronLeft, ChevronRight,
  CheckCircle, Send, AlertCircle, ArrowLeft, X, User,
} from 'lucide-react-native';
import Svg, { Path, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PackageDetails, { PackageDetails as PackageDetailsType } from '@/features/parcel/components/PackageDetails';
import ParcelCart from '@/features/parcel/components/ParcelCart';
import DeliveryServiceSelector from '@/features/parcel/components/DeliveryServiceSelector';
import PaymentMethodSelector from '@/features/parcel/components/PaymentMethodSelector';
import LocationPickerModal from '@/features/parcel/components/LocationPickerModal';
import BookingConfirmationModal from '@/features/parcel/components/BookingConfirmationModal';
import DropOffPointSelector from '@/features/parcel/components/DropOffPointSelector';
import { ShieldCheck } from 'lucide-react-native';

interface CartItem extends PackageDetailsType { id: string; }

const stepTitles = ['Where to?', 'Add Parcels', 'Your Cart', 'Select Service', 'Contact Info'];

// ─────────────────────────────────────────────────────────────────────────────
// Route Map (SVG) — fills any container size via onLayout
// ─────────────────────────────────────────────────────────────────────────────
function RouteMap({
  hasPickup, hasDelivery, width, height,
}: { hasPickup: boolean; hasDelivery: boolean; width: number; height: number }) {
  if (width === 0 || height === 0) return null;

  const gridStep = 28;
  const gridLines: React.ReactNode[] = [];
  for (let x = 0; x < width; x += gridStep) {
    gridLines.push(<Line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(57,181,168,0.12)" strokeWidth={1} />);
  }
  for (let y = 0; y < height; y += gridStep) {
    gridLines.push(<Line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke="rgba(57,181,168,0.12)" strokeWidth={1} />);
  }

  const PX = 60, PY = height * 0.28;
  const DX = width - 70, DY = height * 0.55;
  const cp1x = PX + 80, cp1y = PY + 30;
  const cp2x = DX - 80, cp2y = DY - 30;
  const curvePath = `M ${PX} ${PY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${DX} ${DY}`;

  return (
    <Svg width={width} height={height}>
      {gridLines}

      {hasPickup && hasDelivery && (
        <Path d={curvePath} stroke="#B0CAC8" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeDasharray="0" />
      )}

      {/* Pickup pin */}
      <G x={PX - 30} y={PY - 28}>
        <Rect x={0} y={0} width={60} height={20} rx={10} fill="white" />
        <SvgText x={30} y={14} textAnchor="middle" fontSize={8} fontWeight="800" fill="#041614" letterSpacing={0.5}>PICKUP</SvgText>
      </G>
      <Circle cx={PX} cy={PY} r={13} fill="#39B5A8" />
      <Circle cx={PX} cy={PY} r={5} fill="white" />

      {/* Delivery pin */}
      <G x={DX - 35} y={DY - 28}>
        <Rect x={0} y={0} width={70} height={20} rx={10} fill="#1A5D56" />
        <SvgText x={35} y={14} textAnchor="middle" fontSize={8} fontWeight="800" fill="white" letterSpacing={0.5}>DELIVERY</SvgText>
      </G>
      <Circle cx={DX} cy={DY} r={13} fill="#1A5D56" />
      <Circle cx={DX} cy={DY} r={5} fill="white" />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SendParcel() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'pickup' | 'delivery' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const errorTimer = useRef<any>(null);

  // Map container dimensions
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const [pickupLocation, setPickupLocation] = useState<{ address: string } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{ address: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [servicePrice, setServicePrice] = useState(175);
  const [selectedDropOffPoint, setSelectedDropOffPoint] = useState<any>(null);

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingConfirmationData, setBookingConfirmationData] = useState<any>(null);
  const [showDropOffSelector, setShowDropOffSelector] = useState(false);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleContinueFromPackageDetails = (details: PackageDetailsType) => {
    // Check for existing item with same size, type, AND guarantee
    const idx = cartItems.findIndex(i => 
      i.size === details.size && 
      i.itemType === details.itemType &&
      i.deliveryGuarantee === details.deliveryGuarantee
    );

    if (idx !== -1) {
      const c = [...cartItems];
      c[idx].quantity += details.quantity;
      setCartItems(c);
    } else {
      setCartItems([...cartItems, { ...details, id: `${Date.now()}` }]);
    }
    setCurrentStep(3);
  };

  const handleSubmit = () => {
    if (!selectedPaymentMethod) { showError('Please select a payment method.'); return; }
    const trackingNumber = `PKS-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingConfirmationData({ trackingNumber, senderName, receiverName, servicePrice, totalCost: servicePrice });
    setShowBookingConfirmation(true);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!pickupLocation || !deliveryLocation)) { showError('Select both locations first.'); return; }
    if (currentStep === 3 && cartItems.length === 0) { showError('Add at least one parcel.'); return; }
    if (currentStep === 4 && !selectedService) { showError('Select a delivery service.'); return; }
    // Scroll to top on step change
    setCurrentStep(s => Math.min(s + 1, 5));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => currentStep === 1 ? navigation.goBack() : setCurrentStep(s => s - 1)}
        >
          <ArrowLeft size={18} color="#041614" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{stepTitles[currentStep - 1]}</Text>
          <Text style={styles.headerSub}>STEP {currentStep} OF {stepTitles.length}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Progress dots ─────────────────────────────────────────────── */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <View key={s} style={[
            styles.dot,
            s === currentStep ? styles.dotActive : s < currentStep ? styles.dotDone : styles.dotInact,
          ]} />
        ))}
      </View>

      {/* ── Error toast ───────────────────────────────────────────────── */}
      {errorMsg && (
        <View style={styles.toastWrap}>
          <View style={styles.toast}>
            <AlertCircle size={16} color="#ef4444" />
            <Text style={styles.toastText}>{errorMsg}</Text>
            <TouchableOpacity onPress={() => setErrorMsg(null)}>
              <X size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Main content ──────────────────────────────────────────────── */}
      <View style={styles.content}>

        {/* ── Step 1: Location ──────────────────────────────────────── */}
        {currentStep === 1 && (
          <View style={styles.step1Root}>
            {/* Section header */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionIcon}>
                <MapPin size={16} color="#39B5A8" />
              </View>
              <Text style={styles.sectionTitle}>Route Details</Text>
            </View>

            {/* Map card — flex:1 so it fills remaining space */}
            <View
              style={styles.mapCard}
              onLayout={(e: LayoutChangeEvent) => {
                const { width, height } = e.nativeEvent.layout;
                setMapSize({ width, height });
              }}
            >
              {/* SVG map fills container */}
              <View style={StyleSheet.absoluteFill}>
                <RouteMap
                  hasPickup={!!pickupLocation}
                  hasDelivery={!!deliveryLocation}
                  width={mapSize.width}
                  height={mapSize.height}
                />
              </View>

              {/* Distance/time chip — absolute top center */}
              {pickupLocation && deliveryLocation && (
                <View style={styles.chipWrap}>
                  <View style={styles.chip}>
                    <Navigation size={11} color="#39B5A8" />
                    <Text style={styles.chipText}>12.5 km</Text>
                    <View style={styles.chipDivider} />
                    <Clock size={11} color="#FDB833" />
                    <Text style={styles.chipText}>25 mins</Text>
                  </View>
                </View>
              )}

              {/* Address buttons — absolute bottom */}
              <View style={styles.addressOverlay}>
                {/* Pickup */}
                <Pressable
                  style={({ pressed }) => [styles.addrBtn, pressed && styles.addrBtnPressed]}
                  onPress={() => { setSelectingFor('pickup'); setShowLocationPicker(true); }}
                >
                  <View style={[styles.addrIcon, { backgroundColor: 'rgba(57,181,168,0.12)' }]}>
                    <MapPin size={16} color="#39B5A8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addrLabel, { color: '#39B5A8' }]}>PICKUP ADDRESS</Text>
                    <Text style={[styles.addrValue, !pickupLocation && styles.addrPlaceholder]} numberOfLines={1}>
                      {pickupLocation?.address || 'Tap to set pickup location'}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.addrDivider} />

                {/* Drop-off */}
                <Pressable
                  style={({ pressed }) => [styles.addrBtn, pressed && styles.addrBtnPressed]}
                  onPress={() => { setSelectingFor('delivery'); setShowLocationPicker(true); }}
                >
                  <View style={[styles.addrIcon, { backgroundColor: 'rgba(253,184,51,0.12)' }]}>
                    <Target size={16} color="#FDB833" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addrLabel, { color: '#FDB833' }]}>DROP-OFF ADDRESS</Text>
                    <Text style={[styles.addrValue, !deliveryLocation && styles.addrPlaceholder]} numberOfLines={1}>
                      {deliveryLocation?.address || 'Tap to set destination'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ── Step 2: Package Details ───────────────────────────────── */}
        {currentStep === 2 && (
          <PackageDetails onContinue={handleContinueFromPackageDetails} onBack={() => setCurrentStep(1)} />
        )}

        {/* ── Step 3: Cart ──────────────────────────────────────────── */}
        {currentStep === 3 && (
          <ParcelCart
            items={cartItems}
            onUpdateQuantity={(id, q) => setCartItems(p => p.map(i => i.id === id ? { ...i, quantity: q } : i))}
            onRemoveItem={(id) => setCartItems(p => p.filter(i => i.id !== id))}
            onContinue={() => cartItems.length > 0 ? setCurrentStep(4) : showError('Add a parcel first.')}
          />
        )}

        {/* ── Step 4: Service ───────────────────────────────────────── */}
        {currentStep === 4 && (
          <DeliveryServiceSelector
            distanceKm={12.5}
            onSelect={(id, price) => { setSelectedService(id); setServicePrice(price); }}
            selectedService={selectedService}
            totalParcels={cartItems.reduce((s, i) => s + i.quantity, 0)}
            packageSize={cartItems.some(i => i.size === 'XL') ? 'xl' : 'small'}
          />
        )}

        {/* ── Step 5: Contact Info ──────────────────────────────────── */}
        {currentStep === 5 && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {/* Frequent Recipients */}
            <View style={styles.frequentSection}>
              <View style={styles.frequentHeader}>
                 <View style={styles.fHeaderLine} />
                 <Text style={styles.fHeaderText}>FREQUENT RECIPIENTS</Text>
                 <View style={styles.fHeaderLine} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.frequentScroll}>
                {[
                  { id: 1, name: 'Alyssa', phone: '09171234567', initial: 'A' },
                  { id: 2, name: 'Mario', phone: '09187654321', initial: 'M' },
                  { id: 3, name: 'John', phone: '09191112233', initial: 'J' },
                ].map(item => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.frequentItem}
                    onPress={() => { setReceiverName(item.name); setReceiverPhone(item.phone); }}
                  >
                    <View style={styles.fAvatar}>
                      <Text style={styles.fAvatarText}>{item.initial}</Text>
                    </View>
                    <View>
                      <Text style={styles.fName}>{item.name}</Text>
                      <Text style={styles.fPhone}>{item.phone}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.contactFormCard}>
              <View style={styles.sectionIconRow}>
                <View style={[styles.sectionIconBox, { backgroundColor: '#F0F9F8' }]}>
                  <User size={18} color="#39B5A8" />
                </View>
                <Text style={styles.sectionHeaderTitle}>Recipient Info</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>RECIPIENT NAME</Text>
                <TextInput 
                  style={styles.inputField} 
                  value={receiverName} 
                  onChangeText={setReceiverName} 
                  placeholder="Enter name" 
                  placeholderTextColor="#9CA3AF" 
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <TextInput 
                  style={styles.inputField} 
                  value={receiverPhone} 
                  onChangeText={setReceiverPhone} 
                  placeholder="09XXXXXXXXX" 
                  placeholderTextColor="#9CA3AF" 
                  keyboardType="phone-pad" 
                />
              </View>

              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
              />

              <View style={styles.checkoutSummary}>
                <View style={styles.summaryHeaderRow}>
                   <Text style={styles.summaryTitleText}>SUMMARY</Text>
                   <Text style={styles.summaryValueSmall}>₱{servicePrice.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryTotalRow}>
                   <Text style={styles.totalDueText}>Total Due</Text>
                   <Text style={styles.totalDueValue}>₱{servicePrice.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

      </View>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      {currentStep !== 2 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {currentStep === 5 ? (
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentStep(4)}>
                <Text style={styles.secondaryTxt}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeBtn} onPress={handleSubmit}>
                <Text style={styles.completeTxt}>Complete</Text>
                <CheckCircle size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => currentStep === 1 ? navigation.goBack() : setCurrentStep(s => s - 1)}>
                <ChevronLeft size={18} color="#39B5A8" />
                <Text style={styles.secondaryTxt}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                <Text style={styles.primaryTxt}>Continue</Text>
                <ChevronRight size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <LocationPickerModal
        isOpen={showLocationPicker && selectingFor !== null}
        onClose={() => setShowLocationPicker(false)}
        onSelect={selectingFor === 'pickup' ? setPickupLocation : setDeliveryLocation}
        type={selectingFor || 'pickup'}
      />
      <BookingConfirmationModal
        isOpen={showBookingConfirmation}
        onClose={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        bookingDetails={bookingConfirmationData}
      />
      <DropOffPointSelector isOpen={showDropOffSelector} onClose={() => setShowDropOffSelector(false)} onSelect={setSelectedDropOffPoint} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: 'rgba(57,181,168,0.08)',
  },
  backCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F0F9F8', alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#041614' },
  headerSub: { fontSize: 10, fontWeight: '800', color: '#39B5A8', letterSpacing: 1.2, marginTop: 2 },

  // Progress
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: '#fff' },
  dot: { height: 4, borderRadius: 4 },
  dotActive: { width: 28, backgroundColor: '#39B5A8' },
  dotDone: { width: 8, backgroundColor: '#1A5D56' },
  dotInact: { width: 8, backgroundColor: 'rgba(57,181,168,0.2)' },

  // Error toast
  toastWrap: { position: 'absolute', top: 120, left: 0, right: 0, zIndex: 100, alignItems: 'center', paddingHorizontal: 16 },
  toast: {
    backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#ef4444',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, maxWidth: 400, width: '100%',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  toastText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#374151' },

  // Main content
  content: { flex: 1 },

  // Step 1
  step1Root: { flex: 1, padding: 16, gap: 12 },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(57,181,168,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#041614' },

  // Map card — takes all remaining space
  mapCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EAF6F5',
    borderWidth: 4,
    borderColor: '#fff',
    // Shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Distance chip
  chipWrap: { position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(26,93,86,0.9)',
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  chipText: { fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  chipDivider: { width: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Address overlay at the bottom of the map
  addressOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
    padding: 12,
  },
  addrCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  addrBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.12)',
    shadowColor: '#39B5A8', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  addrBtnPressed: { backgroundColor: '#F0F9F8' },
  addrIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  addrLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginBottom: 3, textTransform: 'uppercase' },
  addrValue: { fontSize: 13, fontWeight: '700', color: '#041614' },
  addrPlaceholder: { color: '#aaa', fontWeight: '500' },
  addrDivider: { height: 1, backgroundColor: 'rgba(57,181,168,0.1)', marginHorizontal: 16, marginBottom: 8 },

  // Step 5
  contactCard: {
    backgroundColor: '#fff', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.12)',
    padding: 20, gap: 16,
  },
  input: {
    backgroundColor: '#F8FFFE', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)',
    paddingHorizontal: 16, height: 48,
    fontSize: 14, fontWeight: '700', color: '#041614',
  },
  summaryCard: {
    backgroundColor: '#F8FFFE', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.12)',
    padding: 16,
  },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalDueText: { fontSize: 16, fontWeight: '900', color: '#041614' },
  totalDueValue: { fontSize: 24, fontWeight: '900', color: '#39B5A8' },

  // Frequent Recipients
  frequentSection: { marginBottom: 24 },
  frequentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  fHeaderLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(57,181,168,0.1)' },
  fHeaderText: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1.5 },
  frequentScroll: { gap: 12, paddingRight: 20 },
  frequentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', padding: 12, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(57,181,168,0.05)',
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  fAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F9F8', alignItems: 'center', justifyContent: 'center' },
  fAvatarText: { color: '#39B5A8', fontWeight: '900', fontSize: 16 },
  fName: { fontSize: 14, fontWeight: '800', color: '#1A5D56' },
  fPhone: { fontSize: 10, fontWeight: '700', color: '#9CA3AF' },

  // Contact Info Refinements
  contactFormCard: {
    backgroundColor: '#fff', borderRadius: 32, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, elevation: 2,
  },
  sectionIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  sectionIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionHeaderTitle: { fontSize: 20, fontWeight: '900', color: '#041614' },
  formGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  inputField: {
    height: 54, backgroundColor: '#F9FAFB', borderRadius: 16,
    paddingHorizontal: 16, fontSize: 15, fontWeight: '700', color: '#041614',
    borderWidth: 1.5, borderColor: '#F3F4F6',
  },
  checkoutSummary: {
    backgroundColor: '#F9FAFB', borderRadius: 24, padding: 20, marginTop: 24,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryTitleText: { fontSize: 11, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1 },
  summaryValueSmall: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },

  // Footer Buttons Refinement
  completeBtn: {
    flex: 1.2, height: 60, backgroundColor: '#111827', borderRadius: 20, // Navy/Black
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  completeTxt: { color: '#fff', fontWeight: '900', fontSize: 18 },

  // Footer
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: 'rgba(57,181,168,0.05)',
    paddingHorizontal: 24, paddingVertical: 20,
  },
  footerRow: { flexDirection: 'row', gap: 16 },
  primaryBtn: {
    flex: 1.2, height: 60, backgroundColor: '#39B5A8', borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#39B5A8', shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  primaryTxt: { color: '#fff', fontWeight: '900', fontSize: 18 },
  secondaryBtn: {
    flex: 1, height: 60, backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(57,181,168,0.2)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  secondaryTxt: { color: '#1A5D56', fontWeight: '900', fontSize: 18 },
});
