import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
const semesterSubjects = { 1: 5, 2: 6, 3: 6, 4: 7, 5: 6, 6: 6, 7: 6, 8: 4 };
const subjectNames = [
  "Mathematics", "Physics", "Chemistry", "Engineering Graphics", "Computer Basics",
  "Programming in C", "Data Structures", "Digital Logic Design", "Computer Architecture",
  "Operating Systems", "Database Systems", "Computer Networks", "Software Engineering",
  "Artificial Intelligence", "Machine Learning", "Web Development", "Mobile Computing",
  "Cybersecurity", "Cloud Computing", "IoT Systems"
];
const gradeOptions = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

function StickyNavBar() {
  return (
    <View style={styles.stickyNavBar}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <View style={styles.navContent}>
        <Text style={styles.navTitle}>PKIET CGPA TRACKER</Text>
      </View>
    </View>
  );
}

function Snackbar({ visible, message, onDismiss }) {
  if (!visible) return null;
  return (
    <View style={styles.snackbar}>
      <Text style={styles.snackbarText}>{message}</Text>
      <TouchableOpacity style={{ marginLeft: 10 }} onPress={onDismiss}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

function SemesterSubjects({ semester, setSemester, grades, setGrades, navigation }) {
  const count = semesterSubjects[semester];

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.label}>Select Semester</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={semester}
          style={styles.picker}
          onValueChange={(value) => {
            if (value === 'custom') {
              navigation.navigate('CustomSubject');
            } else {
              setSemester(value);
            }
          }}
          mode="dropdown"
        >
          {semesters.map(s => (
            <Picker.Item key={s} label={`Semester ${s}`} value={s} />
          ))}
          <Picker.Item label="Custom Subjects" value="custom" />
        </Picker>
      </View>
      {Array.from({ length: count }).map((_, i) => {
        const code = `CS${semester}0${i + 1}`;
        const index = (semester - 1) * 6 + i;
        const name = subjectNames[index] || subjectNames[i % subjectNames.length];
        return (
          <View key={code} style={styles.subjectCard}>
            <Text style={styles.subjectCode}>{code}</Text>
            <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
            <View style={styles.gradeRow}>
              {gradeOptions.map(grade => (
                <TouchableOpacity
                  key={grade}
                  style={[styles.gradeBtn, grades[code] === grade && styles.selectedGrade]}
                  onPress={() => setGrades({ ...grades, [code]: grade })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.gradeText, grades[code] === grade && styles.selectedGradeText]}>
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function CalculateButton({ onCalculate }) {
  return (
    <TouchableOpacity style={styles.calcBtn} onPress={onCalculate} activeOpacity={0.8}>
      <Text style={styles.calcBtnText}>Calculate CGPA</Text>
    </TouchableOpacity>
  );
}

export default function CGPACalculator({ navigation }) {
  const [semester, setSemester] = useState(1);
  const [grades, setGrades] = useState({});
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const handleCalculate = () => {
    let totalPoints = 0, totalCredits = 0;
    const numSubjects = semesterSubjects[semester];

    for (let i = 0; i < numSubjects; i++) {
      const code = `CS${semester}0${i + 1}`;
      const credit = 4;
      const grade = grades[code];
      if (!grade) {
        showSnackbar(`Please select a grade for ${code}.`);
        return;
      }
      totalPoints += gradePoints[grade] * credit;
      totalCredits += credit;
    }
    const cgpaValue = totalCredits ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
    navigation.navigate('Result', {
      cgpa: cgpaValue,
      semester: semester,
      totalSubjects: numSubjects,
      isCustom: false
    });
  };

  function showSnackbar(msg) {
    setSnackbar({ visible: true, message: msg });
    setTimeout(() => setSnackbar({ visible: false, message: '' }), 3000);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StickyNavBar />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SemesterSubjects
          semester={semester}
          setSemester={setSemester}
          grades={grades}
          setGrades={setGrades}
          navigation={navigation}
        />
        <CalculateButton onCalculate={handleCalculate} />
      </ScrollView>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#e9edfa',
  },
  stickyNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecedf6',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#232867',
    textAlign: 'center',
  },
  container: {
    paddingHorizontal: '5%',
    paddingVertical: 20,
    alignItems: 'center',
    minHeight: '100%',
    marginTop: 0,
  },
  label: {
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: 6,
    color: '#232867',
    alignSelf: 'flex-start',
  },
  pickerWrapper: {
    backgroundColor: '#f6f7fb',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#87CEEB',
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  subjectCard: {
    backgroundColor: '#232867',
    borderRadius: 20,
    marginVertical: 10,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  subjectCode: {
    color: '#87CEEB',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: 4,
  },
  subjectName: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '600',
    marginBottom: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    marginTop: 20,
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
  calcBtn: {
    backgroundColor: '#232867',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 30,
    width: '90%',
    maxWidth: 370,
    alignItems: 'center',
    elevation: 6,
  },
  calcBtnText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  snackbar: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    bottom: 40,
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  snackbarText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
