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

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await client.get('/user');
      setUsers(response.data);
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
      await client.put(`/user/${userId}/role`, { role: nextRole });
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.roleBtn}
              onPress={() => toggleRole(item.id, item.role)}
            >
              <Text style={styles.roleBtnText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm, ...SHADOW },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: COLORS.textSecondary },
  role: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  roleBtn: { backgroundColor: COLORS.secondary, padding: SPACING.sm, borderRadius: 4 },
  roleBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' },
});

export default UserManagementScreen;
