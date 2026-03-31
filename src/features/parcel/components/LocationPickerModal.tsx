import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Search, X, MapPin } from 'lucide-react-native';

const SAMPLE_LOCATIONS = [
  'Makati City', 'Quezon City', 'BGC, Taguig', 'Pasig City',
  'Mandaluyong', 'Manila', 'Parañaque', 'Alabang', 'Caloocan City',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (loc: { address: string; details?: string }) => void;
  type: 'pickup' | 'delivery';
}

export default function LocationPickerModal({ isOpen, onClose, onSelect, type }: Props) {
  const [query, setQuery] = useState('');
  const filtered = SAMPLE_LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{type === 'pickup' ? 'Set Pickup' : 'Set Drop-off'} Location</Text>
          <TouchableOpacity onPress={onClose}><X size={22} color="#555" /></TouchableOpacity>
        </View>
        <View style={styles.searchRow}>
          <Search size={16} color="#aaa" />
          <TextInput style={styles.input} placeholder="Search location..." value={query} onChangeText={setQuery} />
        </View>
        <ScrollView style={{ flex: 1 }}>
          {filtered.map(loc => (
            <TouchableOpacity key={loc} style={styles.item} onPress={() => { onSelect({ address: loc }); onClose(); }}>
              <MapPin size={16} color="#39B5A8" />
              <Text style={styles.itemText}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(57,181,168,0.1)' },
  title: { fontSize: 17, fontWeight: '800', color: '#041614' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)' },
  input: { flex: 1, fontSize: 14, color: '#041614' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', marginBottom: 2 },
  itemText: { fontSize: 14, fontWeight: '700', color: '#1A5D56' },
});
