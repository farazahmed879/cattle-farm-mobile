import React, { useEffect, useState, useRef } from 'react';
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
import { animalService } from '../../api/animalService';
import { COLORS, SPACING, SHADOW } from '../../theme';
import { API_URL } from '@env';
import ViewSwitcher from '../../components/common/ViewSwitcher';

const DEFAULT_AVATAR = require('../../assets/images/animal_avatar.png');

interface Animal {
  id: string;
  name: string;
  type?: string;
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
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const flatListRef = useRef<FlatList>(null);
  const scrollOffset = useRef(0);

  const fetchAnimals = async () => {
    try {
      const response = await animalService.getAll();
      setAnimals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch animals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        scrollOffset.current += 1;
        flatListRef.current?.scrollToOffset({
          offset: scrollOffset.current,
          animated: false,
        });
      }, 30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoScrolling]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
    if (!isAutoScrolling) {
      // Reset to top when starting or just continue from current?
      // Let's just continue.
    }
  };

  const filteredAnimals = animals.filter(
    a =>
      (a.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (a.type?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (a.breed?.toLowerCase() || '').includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Animal }) => {
    return (
      <TouchableOpacity
        style={viewMode === 'grid' ? styles.card : styles.listCard}
        onPress={() =>
          navigation.navigate('AnimalDetails', { animalId: item.id })
        }
      >
        <Image
          source={item.imageUrl
            ? { uri: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL.replace('/api/', '')}${item.imageUrl}` }
            : DEFAULT_AVATAR
          }
          style={viewMode === 'grid' ? styles.image : styles.listImage}
        />
        <View style={viewMode === 'grid' ? styles.cardContent : styles.listCardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.breed}>
            {item.type} • {item.breed}
          </Text>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />
          <ViewSwitcher currentMode={viewMode} onModeChange={setViewMode} />
          <TouchableOpacity
            style={[styles.autoScrollBtn, isAutoScrolling && styles.autoScrollBtnActive]}
            onPress={toggleAutoScroll}
          >
            <Text style={styles.autoScrollBtnText}>
              {isAutoScrolling ? '⏹' : '▶'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        key={viewMode} // Re-mount when numColumns changes
        data={filteredAnimals}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.row : null}
        onScroll={(e) => {
          scrollOffset.current = e.nativeEvent.contentOffset.y;
        }}
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
    flex: 1,
    marginRight: SPACING.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoScrollBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  autoScrollBtnActive: {
    backgroundColor: COLORS.accent,
  },
  autoScrollBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW,
  },
  listImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  listCardContent: {
    flex: 1,
    padding: SPACING.md,
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
