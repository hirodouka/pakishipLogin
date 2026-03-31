import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  return (
    <Modal visible animationType="fade">
      <View style={s.c}>
        <Text style={s.title}>Welcome to PakiSHIP! 🚀</Text>
        <Text style={s.sub}>Send, Track & Review your parcels seamlessly.</Text>
        <TouchableOpacity style={s.btn} onPress={onComplete}><Text style={s.btxt}>Get Started</Text></TouchableOpacity>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F0F9F8', justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 26, fontWeight: '900', color: '#041614', textAlign: 'center', marginBottom: 12 },
  sub: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 40 },
  btn: { backgroundColor: '#39B5A8', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30 },
  btxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
