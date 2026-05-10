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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { animalService } from '../../api/animalService';
import { COLORS, SPACING, SHADOW } from '../../theme';
import { API_URL } from '@env';

const AnimalSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  breed: Yup.string().required('Breed is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  age: Yup.number().integer().positive('Age must be a positive integer').required('Age is required'),
  weight: Yup.number().positive('Weight must be positive').required('Weight is required'),
  description: Yup.string(),
});

const AddAnimalScreen = ({ navigation, route }: any) => {
  const editingAnimal = route.params?.animal;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(
    editingAnimal?.imageUrl 
      ? { uri: editingAnimal.imageUrl.startsWith('http') ? editingAnimal.imageUrl : `${API_URL.replace('/api/', '')}${editingAnimal.imageUrl}` } 
      : null
  );

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
      formData.append('type', 'COW'); // Default for now
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
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>📷 Select Animal Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Formik
          initialValues={{
            name: editingAnimal?.name || '',
            breed: editingAnimal?.breed || '',
            price: editingAnimal?.price?.toString() || '',
            age: editingAnimal?.age?.toString() || '',
            weight: editingAnimal?.weight?.toString() || '',
            description: editingAnimal?.description || '',
          }}
          validationSchema={AnimalSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  placeholder="e.g. Daisy"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name as string}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Breed</Text>
                <TextInput
                  style={[styles.input, touched.breed && errors.breed && styles.inputError]}
                  placeholder="e.g. Holstein"
                  onChangeText={handleChange('breed')}
                  onBlur={handleBlur('breed')}
                  value={values.breed}
                />
                {touched.breed && errors.breed && <Text style={styles.errorText}>{errors.breed as string}</Text>}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                  <Text style={styles.label}>Price ($)</Text>
                  <TextInput
                    style={[styles.input, touched.price && errors.price && styles.inputError]}
                    placeholder="0.00"
                    keyboardType="numeric"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                  />
                  {touched.price && errors.price && <Text style={styles.errorText}>{errors.price as string}</Text>}
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Age (Months)</Text>
                  <TextInput
                    style={[styles.input, touched.age && errors.age && styles.inputError]}
                    placeholder="0"
                    keyboardType="numeric"
                    onChangeText={handleChange('age')}
                    onBlur={handleBlur('age')}
                    value={values.age}
                  />
                  {touched.age && errors.age && <Text style={styles.errorText}>{errors.age as string}</Text>}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (KG)</Text>
                <TextInput
                  style={[styles.input, touched.weight && errors.weight && styles.inputError]}
                  placeholder="0.00"
                  keyboardType="numeric"
                  onChangeText={handleChange('weight')}
                  onBlur={handleBlur('weight')}
                  value={values.weight}
                />
                {touched.weight && errors.weight && <Text style={styles.errorText}>{errors.weight as string}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Tell us more about this animal..."
                  multiline
                  numberOfLines={4}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={() => handleSubmit()}
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
          )}
        </Formik>
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
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
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
