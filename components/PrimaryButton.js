import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PrimaryButton({ title, onPress, iconName, iconColor = '#fff', style, textStyle, disabled }) {
  return (
    <TouchableOpacity style={[styles.button, style, disabled && styles.disabled]} onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      {iconName ? (
        <FontAwesome5 name={iconName} size={16} color={iconColor} style={styles.icon} />
      ) : null}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  }
});