import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { paymentService } from '../../api/paymentService';
import { COLORS, SPACING, SHADOW } from '../../theme';
import { API_URL } from '@env';

interface Purchase {
  id: string;
  animal: {
    name: string;
    type: string;
    imageUrl: string;
  };
  plan: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentProofUrl?: string;
}

const MyAnimalsScreen = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const response = await paymentService.getMyPurchases();
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to fetch purchases', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleUploadProof = async (purchaseId: string) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('proof', {
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName,
    } as any);

    try {
      setLoading(true);
      await paymentService.uploadProof(purchaseId, formData);
      Alert.alert('Success', 'Payment proof uploaded successfully!');
      fetchPurchases();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload proof');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Purchase }) => (
    <View style={styles.card}>
      <Image 
        source={{ 
          uri: item.animal.imageUrl 
            ? (item.animal.imageUrl.startsWith('http') ? item.animal.imageUrl : `${API_URL.replace('/api/', '')}${item.animal.imageUrl}`)
            : 'https://via.placeholder.com/150' 
        }} 
        style={styles.animalImage} 
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.animal.name}</Text>
        <Text style={styles.plan}>Plan: {item.plan}</Text>
        <View style={[styles.badge, styles[item.status]]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        
        {!item.paymentProofUrl && item.status === 'PENDING' && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUploadProof(item.id)}
          >
            <Text style={styles.uploadButtonText}>Upload Payment Proof</Text>
          </TouchableOpacity>
        )}

        {item.paymentProofUrl && (
          <Text style={styles.uploadedText}>Proof Uploaded ✓</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Animals</Text>
      <FlatList
        data={purchases}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No animals purchased yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    ...SHADOW,
  },
  animalImage: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  details: {
    flex: 1,
    padding: SPACING.md,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  plan: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  PENDING: { backgroundColor: '#FFF3E0' },
  APPROVED: { backgroundColor: '#E8F5E9' },
  REJECTED: { backgroundColor: '#FFEBEE' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  uploadButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.sm,
    borderRadius: 6,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  uploadButtonText: { color: '#fff', fontWeight: 'bold' },
  uploadedText: { color: COLORS.success, marginTop: SPACING.md, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: SPACING.xl, color: COLORS.textSecondary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MyAnimalsScreen;
