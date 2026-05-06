import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOW } from '../../theme';

const FinanceDashboard = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Dashboard</Text>
      <Text style={styles.role}>Logged in as: {user?.name}</Text>
      
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('VerifyPayments')}
        >
          <Text style={styles.menuText}>💳 Verify Payments</Text>
          <Text style={styles.menuSubtitle}>Review and approve pending proof of payments</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  role: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FinanceDashboard;
