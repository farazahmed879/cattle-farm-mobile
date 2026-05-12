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
import ViewSwitcher from '../../components/common/ViewSwitcher';

const DEFAULT_AVATAR = require('../../assets/images/animal_avatar.png');

import { useFocusEffect } from '@react-navigation/native';

const AnimalManagementScreen = ({ navigation }: any) => {
  const [animals, setAnimals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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

  const renderItem = ({ item }: any) => {
    if (viewMode === 'grid') {
      return (
        <View style={styles.gridCard}>
          <Image
            source={item.imageUrl
              ? { uri: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL.replace('/api/', '')}${item.imageUrl}` }
              : DEFAULT_AVATAR
            }
            style={styles.gridImage}
          />
          <View style={styles.gridContent}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.itemDetail} numberOfLines={1}>{item.type} • {item.breed}</Text>
            <View style={styles.gridActions}>
              <TouchableOpacity onPress={() => navigation.navigate('AddAnimal', { animal: item })}>
                <Text style={styles.editAction}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteAction}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.item}>
        <View style={styles.itemInfo}>
          <Image 
            source={item.imageUrl
              ? { uri: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL.replace('/api/', '')}${item.imageUrl}` }
              : DEFAULT_AVATAR
            }
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.countText}>{animals.length} Animals found</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('AddAnimal')}
          >
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerBottom}>
          <ViewSwitcher currentMode={viewMode} onModeChange={setViewMode} />
        </View>
      </View>

      <FlatList
        key={viewMode}
        data={animals}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        onRefresh={fetchAnimals}
        refreshing={refreshing}
        contentContainerStyle={styles.listContent}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.row : null}
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
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOW,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerBottom: {
    alignItems: 'flex-start',
  },
  countText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addButton: { 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: SPACING.md, 
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
  row: {
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    width: '48%',
    ...SHADOW,
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridContent: {
    padding: SPACING.sm,
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
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
    fontSize: 16, 
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemDetail: { 
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
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
    fontSize: 12,
  },
  deleteAction: { 
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default AnimalManagementScreen;
