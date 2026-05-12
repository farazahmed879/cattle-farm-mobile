import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { COLORS, SPACING } from '../../theme';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  control: any;
  name: string;
  label?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  control,
  name,
  label,
  required,
  options,
  placeholder = 'Select an option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        return (
          <View style={styles.inputGroup}>
            {label && (
              <Text style={styles.label}>
                {label} {required && <Text style={styles.requiredAsterisk}>*</Text>}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.input, error && styles.inputError]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={selectedOption ? styles.inputText : styles.placeholderText}>
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            <Modal visible={modalVisible} transparent animationType="fade">
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.optionItem,
                              value === item.value && styles.selectedOptionItem,
                            ]}
                            onPress={() => {
                              onChange(item.value);
                              setModalVisible(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                value === item.value && styles.selectedOptionText,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  requiredAsterisk: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    height: 52, // Typical TextInput height
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  optionItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOptionItem: {
    backgroundColor: COLORS.primary + '10', // Light primary background
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default Select;
