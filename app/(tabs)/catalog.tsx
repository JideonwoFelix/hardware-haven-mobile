import { View, Text, StyleSheet } from 'react-native';
import { PackageSearch } from 'lucide-react-native';

export default function CatalogScreen() {
  return (
    <View style={styles.container}>
      <PackageSearch size={64} color="#cbd5e1" strokeWidth={1} />
      <Text style={styles.title}>Inventory Management</Text>
      <Text style={styles.subtitle}>Phase 2: Link your PHP backend to manage your Abuja shop inventory here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 10, lineHeight: 20 },
});