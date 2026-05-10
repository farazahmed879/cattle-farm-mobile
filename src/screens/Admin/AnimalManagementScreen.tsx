import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { animalService } from '../../api/animalService';
import { COLORS, SPACING, SHADOW } from '../../theme';
import { API_URL } from '@env';

import { useFocusEffect } from '@react-navigation/native';

const AnimalManagementScreen = ({ navigation }: any) => {
  const [animals, setAnimals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnimals = async () => {
    try {
      setRefreshing(true);
      const response = await animalService.getAll();
      setAnimals(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch animals');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAnimals();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to remove this animal?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await animalService.delete(id);
            fetchAnimals();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete animal');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Image 
          source={{ 
            uri: item.imageUrl 
              ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL.replace('/api/', '')}${item.imageUrl}`)
              : 'https://via.placeholder.com/100' 
          }} 
          style={styles.thumbnail} 
        />
        <View style={styles.details}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetail}>{item.type} • {item.breed}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.navigate('AddAnimal', { animal: item })}
        >
          <Text style={styles.editAction}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteAction}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>{animals.length} Animals found</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddAnimal')}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={animals}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        onRefresh={fetchAnimals}
        refreshing={refreshing}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOW,
  },
  countText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addButton: { 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.sm, 
    borderRadius: 8, 
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: SPACING.md,
  },
  item: { 
    backgroundColor: COLORS.surface, 
    padding: SPACING.md, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: SPACING.md, 
    ...SHADOW 
  },
  itemInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  details: {
    justifyContent: 'center',
  },
  itemName: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemDetail: { 
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  itemPrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  actions: { 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconButton: {
    paddingVertical: SPACING.xs,
  },
  editAction: { 
    color: COLORS.primary, 
    fontWeight: '600',
  },
  deleteAction: { 
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default AnimalManagementScreen;
