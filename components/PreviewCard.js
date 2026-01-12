import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PreviewCard = ({ subject, onRemove }) => {
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewContent}>
        <Text style={styles.previewName}>{subject.name}</Text>
        <Text style={styles.previewDetails}>{subject.code} • {subject.credits} credits</Text>
      </View>
      {onRemove ? (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove} activeOpacity={0.7}>
          <Text style={styles.removeButtonText}>X</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default memo(PreviewCard);

const styles = StyleSheet.create({
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  previewDetails: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DC3545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});