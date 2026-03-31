import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star, MessageSquare, Zap, ShieldCheck, UserCheck, Package, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react-native';
import { CustomerPageHeader } from '@/features/shared/components/CustomerPageHeader';

const MASCOTS: Record<number, { src: string; label: string }> = {
  1: { src: 'https://i.imgur.com/yBvmbRD.png', label: 'Poor' },
  2: { src: 'https://i.imgur.com/PKTxvFR.png', label: 'Fair' },
  3: { src: 'https://i.imgur.com/cFzyyZ4.png', label: 'Good' },
  4: { src: 'https://i.imgur.com/C1jpIzN.png', label: 'Very Good' },
  5: { src: 'https://i.imgur.com/jknPCsk.png', label: 'Excellent' },
};

const quickTags = [
  { id: 'fast', label: 'Fast', Icon: Zap },
  { id: 'secured', label: 'Secured', Icon: ShieldCheck },
  { id: 'friendly', label: 'Friendly', Icon: UserCheck },
  { id: 'perfect', label: 'Perfect', Icon: Package },
  { id: 'ontime', label: 'On Time', Icon: Clock },
];

const recentFeedback = [
  { id: 'PKS-002', text: 'Excellent service! Driver was professional.', tag: 'SECURED' },
  { id: 'PKS-003', text: 'On time and very polite rider.', tag: 'FAST' },
  { id: 'PKS-004', text: 'Package handled with great care.', tag: 'PERFECT' },
];

export default function RateReview() {
  const navigation = useNavigation<any>();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleTag = (label: string) => {
    setSelectedTags(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);
  };

  const handleSubmit = () => {
    if (rating === 0) { showToast('Please select a star rating.', 'error'); return; }
    if (!trackingNumber.trim()) { showToast('Please enter your tracking number.', 'error'); return; }
    showToast('Feedback submitted! Thank you! 🎉', 'success');
    setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }), 2200);
  };

  return (
    <View style={styles.container}>
      <CustomerPageHeader title="Rate & Review" subtitle="Help us improve" icon={MessageSquare as any} onBack={() => navigation.goBack()} />

      {/* Toast */}
      {toast && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          {toast.type === 'error' ? <AlertCircle size={16} color="#ef4444" /> : <CheckCircle2 size={16} color="#39B5A8" />}
          <Text style={styles.toastText}>{toast.message}</Text>
          <TouchableOpacity onPress={() => setToast(null)}><X size={14} color="#aaa" /></TouchableOpacity>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Delivery Feedback</Text>
            <Text style={styles.formSubtitle}>Rate your recent PKS experience.</Text>
          </View>

          {/* Tracking Number */}
          <Text style={styles.fieldLabel}>TRACKING #</Text>
          <TextInput
            style={styles.textInput}
            placeholder="PKS-2024-001"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            autoCapitalize="characters"
          />

          {/* Star Rating */}
          <Text style={styles.fieldLabel}>RATING</Text>
          <View style={styles.ratingBox}>
            {rating > 0 && (
              <Image source={{ uri: MASCOTS[rating].src }} style={styles.mascot} resizeMode="contain" />
            )}
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star size={32} color="#39B5A8" fill={star <= rating ? '#39B5A8' : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingLabel}>{rating === 0 ? 'Tap to Rate' : MASCOTS[rating].label}</Text>
          </View>

          {/* Quick Tags */}
          <Text style={styles.fieldLabel}>WHAT WENT WELL?</Text>
          <View style={styles.tagsRow}>
            {quickTags.map(tag => {
              const Icon = tag.Icon;
              const sel = selectedTags.includes(tag.label);
              return (
                <TouchableOpacity key={tag.id} style={[styles.tagChip, sel && styles.tagChipActive]} onPress={() => toggleTag(tag.label)}>
                  <Icon size={12} color={sel ? '#fff' : '#888'} />
                  <Text style={[styles.tagText, sel && styles.tagTextActive]}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Review */}
          <View style={styles.reviewHeader}>
            <Text style={styles.fieldLabel}>REVIEW</Text>
            <Text style={styles.charCount}>{review.length}/500</Text>
          </View>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience..."
            value={review}
            onChangeText={t => t.length <= 500 && setReview(t)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent feedback */}
        <Text style={styles.recentTitle}>RECENT FEEDBACK</Text>
        {recentFeedback.map((item, idx) => (
          <View key={idx} style={styles.feedbackCard}>
            <View style={styles.feedbackTop}>
              <Text style={styles.feedbackId}>{item.id}</Text>
              <View style={styles.starsRowSmall}>
                {[1,2,3,4,5].map(s => <Star key={s} size={10} color="#39B5A8" fill="#39B5A8" />)}
              </View>
            </View>
            <Text style={styles.feedbackText}>"{item.text}"</Text>
            <View style={styles.feedbackTag}><Text style={styles.feedbackTagText}>{item.tag}</Text></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 4, borderRadius: 14, padding: 12, borderWidth: 1 },
  toastError: { backgroundColor: '#fff', borderColor: '#fecaca' },
  toastSuccess: { backgroundColor: '#fff', borderColor: 'rgba(57,181,168,0.3)' },
  toastText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#374151' },
  formCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(57,181,168,0.15)', marginBottom: 20 },
  formHeader: { borderLeftWidth: 4, borderLeftColor: '#39B5A8', paddingLeft: 12, marginBottom: 18 },
  formTitle: { fontSize: 20, fontWeight: '900', color: '#1A5D56' },
  formSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  fieldLabel: { fontSize: 9, fontWeight: '900', color: '#39B5A8', letterSpacing: 1.5, marginBottom: 6, marginTop: 14 },
  textInput: { backgroundColor: '#F0F9F8', borderRadius: 12, borderWidth: 2, borderColor: 'rgba(57,181,168,0.15)', paddingHorizontal: 14, height: 46, fontSize: 14, fontWeight: '700', color: '#041614' },
  ratingBox: { alignItems: 'center', backgroundColor: '#F0F9F8', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(57,181,168,0.1)' },
  mascot: { width: 72, height: 72, marginBottom: 8 },
  starsRow: { flexDirection: 'row', gap: 8 },
  ratingLabel: { fontSize: 10, fontWeight: '800', color: '#1A5D56', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb' },
  tagChipActive: { backgroundColor: '#39B5A8', borderColor: '#39B5A8' },
  tagText: { fontSize: 11, fontWeight: '700', color: '#888' },
  tagTextActive: { color: '#fff' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  charCount: { fontSize: 10, color: '#aaa', fontWeight: '700' },
  reviewInput: { backgroundColor: '#F0F9F8', borderRadius: 12, borderWidth: 2, borderColor: 'rgba(57,181,168,0.15)', padding: 14, fontSize: 13, fontWeight: '600', color: '#041614', minHeight: 100 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#888', fontWeight: '800', fontSize: 14 },
  submitBtn: { flex: 2, height: 48, borderRadius: 14, backgroundColor: '#39B5A8', alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  recentTitle: { fontSize: 9, fontWeight: '900', color: '#aaa', letterSpacing: 2, marginBottom: 12 },
  feedbackCard: { backgroundColor: '#1A5D56', borderRadius: 18, padding: 14, marginBottom: 10 },
  feedbackTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  feedbackId: { fontSize: 9, fontWeight: '900', color: '#39B5A8', letterSpacing: 1 },
  starsRowSmall: { flexDirection: 'row', gap: 2 },
  feedbackText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 18 },
  feedbackTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(57,181,168,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8, borderWidth: 1, borderColor: 'rgba(57,181,168,0.3)' },
  feedbackTagText: { fontSize: 8, fontWeight: '900', color: '#39B5A8', letterSpacing: 1 },
});
