import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import client from '../../api/client';
import { COLORS, SPACING, SHADOW } from '../../theme';

const AnimalManagementScreen = () => {
  const [animals, setAnimals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'COW',
    breed: '',
    price: '',
    age: '',
    weight: '',
    imageUrl: '',
  });

  const fetchAnimals = async () => {
    try {
      const response = await client.get('/animal');
      setAnimals(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch animals');
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleSave = async () => {
    try {
      if (editingAnimal) {
        await client.put(`/animal/${editingAnimal.id}`, formData);
      } else {
        await client.post('/animal', formData);
      }
      setModalVisible(false);
      fetchAnimals();
      setEditingAnimal(null);
      setFormData({ name: '', type: 'COW', breed: '', price: '', age: '', weight: '', imageUrl: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to save animal');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await client.delete(`/animal/${id}`);
          fetchAnimals();
        },
        style: 'destructive',
      },
    ]);
  };

  const openEdit = (animal: any) => {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      price: animal.price.toString(),
      age: animal.age.toString(),
      weight: animal.weight.toString(),
      imageUrl: animal.imageUrl || '',
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => {
        setEditingAnimal(null);
        setFormData({ name: '', type: 'COW', breed: '', price: '', age: '', weight: '', imageUrl: '' });
        setModalVisible(true);
      }}>
        <Text style={styles.addButtonText}>+ Add New Animal</Text>
      </TouchableOpacity>

      <FlatList
        data={animals}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>{item.type} • {item.breed}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)}>
                <Text style={styles.editAction}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteAction}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingAnimal ? 'Edit Animal' : 'Add Animal'}</Text>
          
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={formData.name}
            onChangeText={(t) => setFormData({...formData, name: t})}
          />
          <TextInput
            placeholder="Breed"
            style={styles.input}
            value={formData.breed}
            onChangeText={(t) => setFormData({...formData, breed: t})}
          />
          <TextInput
            placeholder="Price"
            style={styles.input}
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(t) => setFormData({...formData, price: t})}
          />
          <TextInput
            placeholder="Age (Months)"
            style={styles.input}
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(t) => setFormData({...formData, age: t})}
          />
          <TextInput
            placeholder="Weight (KG)"
            style={styles.input}
            keyboardType="numeric"
            value={formData.weight}
            onChangeText={(t) => setFormData({...formData, weight: t})}
          />
          <TextInput
            placeholder="Image URL"
            style={styles.input}
            value={formData.imageUrl}
            onChangeText={(t) => setFormData({...formData, imageUrl: t})}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  addButton: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm, ...SHADOW },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDetail: { color: COLORS.textSecondary },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editAction: { color: COLORS.primary, marginRight: SPACING.md },
  deleteAction: { color: COLORS.error },
  modalContent: { padding: SPACING.lg },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: SPACING.lg },
  input: { backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.lg },
  saveBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  cancelBtn: { backgroundColor: COLORS.textSecondary, padding: SPACING.md, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default AnimalManagementScreen;
