import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import client from '../../api/client';
import { COLORS, SPACING, SHADOW } from '../../theme';

const PaymentVerificationScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await client.get('/payment/pending');
      setPayments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (paymentId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await client.post(`/payment/${paymentId}/verify`, { status: action });
      Alert.alert('Success', `Payment ${action.toLowerCase()}d!`);
      fetchPayments();
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Verifications</Text>
      <FlatList
        data={payments}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.user}>{item.user.name}</Text>
              <Text style={styles.detail}>{item.animal.name} - {item.plan}</Text>
              <TouchableOpacity onPress={() => setSelectedProof(item.paymentProofUrl)}>
                <Text style={styles.viewProof}>View Proof</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.approveBtn]}
                onPress={() => handleAction(item.id, 'APPROVE')}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => handleAction(item.id, 'REJECT')}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={!!selectedProof} transparent={false}>
        <View style={styles.modal}>
          <Image source={{ uri: selectedProof || '' }} style={styles.fullImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedProof(null)}>
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, ...SHADOW },
  info: { marginBottom: SPACING.md },
  user: { fontSize: 18, fontWeight: 'bold' },
  detail: { color: COLORS.textSecondary, marginBottom: 4 },
  viewProof: { color: COLORS.accent, fontWeight: 'bold', textDecorationLine: 'underline' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: SPACING.md, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.error },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '100%', height: '80%' },
  closeBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, marginTop: SPACING.lg },
});

export default PaymentVerificationScreen;
