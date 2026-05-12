import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import client from '../../api/client';
import { COLORS, SPACING, SHADOW } from '../../theme';
import ViewSwitcher from '../../components/common/ViewSwitcher';

const UserManagementScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const fetchUsers = async () => {
    try {
      const response = await client.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const roles = ['USER', 'ADMIN', 'FINANCE', 'WORKER'];
    const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];

    try {
      await client.patch(`/users/${userId}`, { role: nextRole });
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const renderUserItem = ({ item }: any) => {
    const initials = item.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    
    if (viewMode === 'grid') {
      return (
        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Profile', { userId: item.id })}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.gridRole}>{item.role}</Text>
          <TouchableOpacity
            style={styles.gridRoleBtn}
            onPress={() => toggleRole(item.id, item.role)}
          >
            <Text style={styles.roleBtnText}>Change Role</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Profile', { userId: item.id })}
      >
        <View style={styles.listInfo}>
          <View style={[styles.avatarCircle, { width: 40, height: 40, marginRight: SPACING.md }]}>
            <Text style={[styles.avatarText, { fontSize: 14 }]}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.roleBtn}
          onPress={() => toggleRole(item.id, item.role)}
        >
          <Text style={styles.roleBtnText}>Change Role</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <ViewSwitcher currentMode={viewMode} onModeChange={setViewMode} />
      </View>

      <FlatList
        key={viewMode}
        data={users}
        keyExtractor={(item: any) => item.id}
        renderItem={renderUserItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.row : null}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOW,
    marginBottom: SPACING.sm,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  listContent: { padding: SPACING.md },
  row: { justifyContent: 'space-between' },
  card: { 
    backgroundColor: COLORS.surface, 
    padding: SPACING.md, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.md, 
    ...SHADOW 
  },
  listInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gridCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    width: '48%',
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOW,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  gridName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  email: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  role: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  gridRole: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginTop: 2, marginBottom: SPACING.md },
  roleBtn: { backgroundColor: COLORS.secondary, padding: SPACING.sm, borderRadius: 8 },
  gridRoleBtn: { 
    backgroundColor: COLORS.secondary, 
    padding: SPACING.sm, 
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  roleBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' },
});

export default UserManagementScreen;
