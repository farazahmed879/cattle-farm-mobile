import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { animalService } from '../../api/animalService';
import { COLORS, SPACING } from '../../theme';

const PurchaseScreen = ({ route, navigation }: any) => {
  const { animalId } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('FULL'); // FULL, 3_MONTHS, 6_MONTHS

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const installments = selectedPlan === 'FULL' ? 1 : selectedPlan === '3_MONTHS' ? 3 : 6;
      await animalService.purchase(animalId, installments);
      Alert.alert('Success', 'Purchase initiated! Please upload payment proof.', [
        { text: 'OK', onPress: () => navigation.navigate('MyAnimals') },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to initiate purchase');
    } finally {
      setLoading(false);
    }
  };

  const PlanOption = ({ id, title, description }: any) => (
    <TouchableOpacity
      style={[styles.planCard, selectedPlan === id && styles.selectedPlan]}
      onPress={() => setSelectedPlan(id)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{title}</Text>
        <View style={[styles.radio, selectedPlan === id && styles.radioSelected]} />
      </View>
      <Text style={styles.planDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Payment Plan</Text>
        <Text style={styles.subtitle}>Choose a plan that fits your budget</Text>
      </View>

      <View style={styles.plans}>
        <PlanOption
          id="FULL"
          title="Full Payment"
          description="Pay 100% upfront and get ownership immediately after verification."
        />
        <PlanOption
          id="3_MONTHS"
          title="3 Months Installment"
          description="Pay in 3 equal monthly installments. Ownership after final payment."
        />
        <PlanOption
          id="6_MONTHS"
          title="6 Months Installment"
          description="Pay in 6 equal monthly installments. Most flexible option."
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Animal ID</Text>
          <Text>{animalId}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Plan Selected</Text>
          <Text>{selectedPlan.replace('_', ' ')}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handlePurchase}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  plans: {
    padding: SPACING.md,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: COLORS.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  planDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summary: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  confirmButton: {
    margin: SPACING.lg,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PurchaseScreen;
