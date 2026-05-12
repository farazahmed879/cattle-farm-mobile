import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { animalService } from '../../api/animalService';
import Input from '../../components/forms/Input';
import TextArea from '../../components/forms/TextArea';
import Select from '../../components/forms/Select';
import { COLORS, SPACING, SHADOW } from '../../theme';
import { API_URL } from '@env';

const DEFAULT_AVATAR = require('../../assets/images/animal_avatar.png');

const AnimalSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  type: Yup.string().trim().required('Type is required'),
  breed: Yup.string().trim().required('Breed is required'),
  price: Yup.number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
    .typeError('Price must be a valid number')
    .positive('Price must be positive')
    .required('Price is required'),
  age: Yup.number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
    .typeError('Age must be a valid number')
    .integer('Age must be an integer')
    .positive('Age must be a positive integer')
    .required('Age is required'),
  weight: Yup.number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
    .typeError('Weight must be a valid number')
    .positive('Weight must be positive')
    .required('Weight is required'),
  description: Yup.string().trim(),
});

const AddAnimalScreen = ({ navigation, route }: any) => {
  const editingAnimal = route.params?.animal;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(
    editingAnimal?.imageUrl 
      ? { uri: editingAnimal.imageUrl.startsWith('http') ? editingAnimal.imageUrl : `${API_URL.replace('/api/', '')}${editingAnimal.imageUrl}` } 
      : null
  );

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(AnimalSchema),
    defaultValues: {
      name: editingAnimal?.name || '',
      type: editingAnimal?.type || 'COW',
      breed: editingAnimal?.breed || '',
      price: editingAnimal?.price?.toString() || '',
      age: editingAnimal?.age?.toString() || '',
      weight: editingAnimal?.weight?.toString() || '',
      description: editingAnimal?.description || '',
    },
  });

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('breed', values.breed);
      formData.append('price', values.price.toString());
      formData.append('age', values.age.toString());
      formData.append('weight', values.weight.toString());
      formData.append('description', values.description || '');

      if (image && image.uri && !image.uri.startsWith('http')) {
        formData.append('image', {
          uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: image.fileName || 'animal.jpg',
        } as any);
      }

      if (editingAnimal) {
        await animalService.update(editingAnimal.id, formData);
      } else {
        await animalService.create(formData);
      }

      Alert.alert('Success', `Animal ${editingAnimal ? 'updated' : 'added'} successfully`);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving animal:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</Text>

        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Image source={DEFAULT_AVATAR} style={styles.image} />
          )}
        </TouchableOpacity>

            <View>
              <Input
                control={control}
                name="name"
                label="Name"
                placeholder="e.g. Daisy"
                required
              />

              <Select
                control={control}
                name="type"
                label="Type"
                required
                options={[
                  { label: 'Cow', value: 'COW' },
                  { label: 'Bull', value: 'BULL' },
                  { label: 'Calf', value: 'CALF' },
                ]}
              />

              <Input
                control={control}
                name="breed"
                label="Breed"
                placeholder="e.g. Holstein"
                required
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: SPACING.sm }}>
                  <Input
                    control={control}
                    name="price"
                    label="Price ($)"
                    placeholder="0.00"
                    keyboardType="numeric"
                    required
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Input
                    control={control}
                    name="age"
                    label="Age (Months)"
                    placeholder="0"
                    keyboardType="numeric"
                    required
                  />
                </View>
              </View>

              <Input
                control={control}
                name="weight"
                label="Weight (KG)"
                placeholder="0.00"
                keyboardType="numeric"
                required
              />

              <TextArea
                control={control}
                name="description"
                label="Description"
                placeholder="Tell us more about this animal..."
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit(handleSave)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingAnimal ? 'Update Animal' : 'Save Animal'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    ...SHADOW,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOW,
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAnimalScreen;
