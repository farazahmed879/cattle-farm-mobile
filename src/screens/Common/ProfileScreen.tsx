import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOW } from '../../theme';

const ProfileScreen = ({ route }: any) => {
  const { userId } = route.params || {};
  const currentUser = useAuthStore(state => state.user);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const endpoint = userId ? `/users/${userId}` : '/users/me';
      const response = await client.get(endpoint);
      setUser(response.data.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found</Text>
      </View>
    );
  }

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: COLORS.secondary }]}>
          <Text style={styles.roleText}>{user.role}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Status</Text>
          <Text style={[styles.value, { color: user.isActive ? COLORS.success : COLORS.error }]}>
            {user.isActive ? 'Active' : 'Deactivated'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {user.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        )}
      </View>

      {(!userId || userId === currentUser?.id) && (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'Feature coming soon!')}
        >
          <Text style={styles.editButtonText}>Edit Profile Settings</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...SHADOW,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 36,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  roleText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoSection: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    borderRadius: 15,
    ...SHADOW,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  editButton: {
    margin: SPACING.xl,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOW,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
