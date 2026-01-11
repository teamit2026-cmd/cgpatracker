import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SubjectCard({ subject, selectedGrade, onGradeChange, gradeOptions = ['S', 'A', 'B', 'C', 'D', 'E', 'F'] }) {
  if (!subject) return null;

  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectCode}>{subject.code}</Text>
        <Text style={styles.creditsText}>{subject.credits} Credits</Text>
      </View>

      <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">
        {subject.name}
      </Text>

      <View style={styles.gradeRow}>
        {gradeOptions.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[styles.gradeBtn, selectedGrade === grade && styles.selectedGrade]}
            onPress={() => onGradeChange && onGradeChange(grade)}
            activeOpacity={0.7}
          >
            <Text style={[styles.gradeText, selectedGrade === grade && styles.selectedGradeText]}>{grade}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subjectCard: {
    backgroundColor: '#232867',
    borderRadius: 20,
    marginVertical: 10,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectCode: {
    color: '#87CEEB',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
  },
  creditsText: {
    color: '#b3e5fc',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  subjectName: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  gradeBtn: {
    marginHorizontal: 2,
    padding: 0,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#87CEEB',
    backgroundColor: '#1a1f4f',
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.038,
    textAlign: 'center',
  },
  selectedGrade: {
    backgroundColor: '#fff',
    borderColor: '#232867',
  },
  selectedGradeText: {
    color: '#232867',
    fontWeight: 'bold',
  },
});
