import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { animalService } from '../../api/animalService';
import { COLORS, SPACING } from '../../theme';
import { API_URL } from '@env';

const AnimalDetailsScreen = ({ route, navigation }: any) => {
  const { animalId } = route.params;
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await animalService.getById(animalId);
        setAnimal(response.data.data);
      } catch (error) {
        console.error('Failed to fetch details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [animalId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!animal) return <View style={styles.center}><Text>Animal not found</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ 
          uri: animal.imageUrl 
            ? (animal.imageUrl.startsWith('http') ? animal.imageUrl : `${API_URL.replace('/api/', '')}${animal.imageUrl}`)
            : 'https://via.placeholder.com/150' 
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{animal.name}</Text>
        <Text style={styles.type}>{animal.type} • {animal.breed}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${animal.price.toLocaleString()}</Text>
          <Text style={styles.status}>{animal.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Details</Text>
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{animal.age} Months</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{animal.weight} KG</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Vaccination</Text>
          {animal.healthStatus ? (
             <Text style={styles.text}>{animal.healthStatus}</Text>
          ) : (
             <Text style={styles.text}>No health records available yet.</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate('Purchase', { animalId: animal.id })}
        >
          <Text style={styles.buyButtonText}>Purchase Animal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: SPACING.lg,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  type: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  status: {
    backgroundColor: COLORS.success + '20',
    color: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimalDetailsScreen;
