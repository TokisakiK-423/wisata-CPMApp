import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function WisataScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📍 Daftar Wisata</Text>
      <Text style={styles.desc}>Buka tab Home untuk melihat daftar wisata.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 },
  desc: { fontSize: 16, color: '#666', textAlign: 'center' },
});