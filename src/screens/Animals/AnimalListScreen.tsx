import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import client from '../../api/client';
import { COLORS, SPACING, SHADOW } from '../../theme';

interface Animal {
  id: string;
  name: string;
  type: 'COW' | 'SHEEP';
  breed: string;
  price: number;
  imageUrl: string;
  age: number;
  weight: number;
}

const AnimalListScreen = ({ navigation }: any) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAnimals = async () => {
    try {
      const response = await client.get('/animal');
      setAnimals(response.data);
    } catch (error) {
      console.error('Failed to fetch animals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.breed.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AnimalDetails', { animalId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.breed}>{item.type} • {item.breed}</Text>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Animals</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by breed, type..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredAnimals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  list: {
    padding: SPACING.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    width: '48%',
    ...SHADOW,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  breed: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimalListScreen;
