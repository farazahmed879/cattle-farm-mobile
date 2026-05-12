import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { COLORS, SPACING } from '../../theme';

interface TextAreaProps extends TextInputProps {
  control: any;
  name: string;
  label?: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ control, name, label, required, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.inputGroup}>
          {label && (
            <Text style={styles.label}>
              {label} {required && <Text style={styles.requiredAsterisk}>*</Text>}
            </Text>
          )}
          <TextInput
            style={[styles.input, error && styles.inputError, props.style]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value !== undefined ? String(value) : ''}
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            {...props}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
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
    fontSize: 16,
    color: COLORS.text,
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});

export default TextArea;
