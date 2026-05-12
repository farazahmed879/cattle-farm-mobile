import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';

interface ViewSwitcherProps {
  currentMode: 'list' | 'grid';
  onModeChange: (mode: 'list' | 'grid') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentMode, onModeChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentMode === 'list' && styles.activeButton]}
        onPress={() => onModeChange('list')}
      >
        <Text style={[styles.text, currentMode === 'list' && styles.activeText]}>
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, currentMode === 'grid' && styles.activeButton]}
        onPress={() => onModeChange('grid')}
      >
        <Text style={[styles.text, currentMode === 'grid' && styles.activeText]}>
          Grid
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeText: {
    color: '#FFFFFF',
  },
});

export default ViewSwitcher;
