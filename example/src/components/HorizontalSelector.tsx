import { useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Option<T> {
  label: string;
  value: T;
}

interface HorizontalSelectorProps<T> {
  options: Option<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  defaultSelected?: T;
  disabled?: boolean;
}

export function HorizontalSelector<T>({
  options,
  selectedValue,
  onSelect,
  defaultSelected,
  disabled = false,
}: HorizontalSelectorProps<T>) {
  useEffect(() => {
    if (defaultSelected !== undefined && selectedValue === undefined) {
      onSelect(defaultSelected);
    }
  }, [defaultSelected, selectedValue, onSelect]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map(option => (
        <TouchableOpacity
          key={String(option.value)}
          style={[
            styles.option,
            selectedValue === option.value && styles.selectedOption,
            disabled && styles.disabledOption,
          ]}
          onPress={() => !disabled && onSelect(option.value)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.optionText,
              selectedValue === option.value && styles.selectedOptionText,
              disabled && styles.disabledOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledOptionText: {
    color: '#999',
  },
});
