import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import client from '../../api/client';
import { COLORS, SPACING, SHADOW } from '../../theme';

const AssignedAnimalsScreen = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [healthUpdate, setHealthUpdate] = useState('');

  const fetchAssigned = async () => {
    try {
      const response = await client.get('/worker/assigned');
      setAnimals(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const handleUpdate = async () => {
    try {
      await client.put(`/worker/animal/${selectedAnimal.id}/health`, { healthStatus: healthUpdate });
      Alert.alert('Success', 'Health status updated!');
      setModalVisible(false);
      fetchAssigned();
    } catch (error) {
      Alert.alert('Error', 'Failed to update health status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Animals</Text>
      <FlatList
        data={animals}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.type} • {item.breed}</Text>
              <Text style={styles.health}>Current Health: {item.healthStatus || 'N/A'}</Text>
            </View>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => {
                setSelectedAnimal(item);
                setHealthUpdate(item.healthStatus || '');
                setModalVisible(true);
              }}
            >
              <Text style={styles.updateBtnText}>Update Health</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Health Status</Text>
            <Text style={styles.modalSubtitle}>Animal: {selectedAnimal?.name}</Text>
            
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Describe current health, vaccinations, etc."
              value={healthUpdate}
              onChangeText={setHealthUpdate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, ...SHADOW },
  name: { fontSize: 18, fontWeight: 'bold' },
  detail: { color: COLORS.textSecondary, marginBottom: 4 },
  health: { fontSize: 14, color: COLORS.primary, marginTop: 4 },
  updateBtn: { backgroundColor: COLORS.primary, padding: SPACING.sm, borderRadius: 6, marginTop: SPACING.md, alignItems: 'center' },
  updateBtnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  input: { backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: 8, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: COLORS.border },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.lg },
  saveBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  cancelBtn: { backgroundColor: COLORS.textSecondary, padding: SPACING.md, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default AssignedAnimalsScreen;
