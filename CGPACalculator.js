import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const departmentSubjectsCredits = {
  IT: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 }
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    3: [
      { code: 'ECA133', name: 'Electronic Circuits', credits: 3 },
      { code: 'ITA101', name: 'Digital System Design', credits: 4 },
      { code: 'ITA102', name: 'Data Structures', credits: 3 },
      { code: 'ITA103', name: 'Object Oriented Programming using C++ & Java', credits: 3 },
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ITA104', name: 'Digital Laboratory', credits: 1.5 },
      { code: 'ITA105', name: 'Data Structures Laboratory', credits: 1.5 },
      { code: 'ITA106', name: 'Object Oriented Programming Lab using C++ & Java ', credits: 1.5 }
    ],
    4: [
      { code: 'MAA106 ', name: 'Mathematics for Computing', credits: 4 },
      { code: 'ITA107', name: 'Operating Systems', credits: 3 },
      { code: 'ITA108', name: 'Computer Architecture', credits: 3 },
      { code: 'ITA109', name: 'Microprocessors and Applications', credits: 3 },
      { code: 'ITA110', name: 'Design and Analysis of Algorithms', credits: 3 },
      { code: 'ITA111', name: 'Operating Systems Laboratory with Linux', credits: 1.5 },
      { code: 'ITA112', name: 'Microprocessor Laboratory', credits: 1.5 },
      { code: 'ITA113', name: 'Algorithms Laboratory', credits: 1.5 }
    ],
    5: [
      { code: 'ITA114', name: 'Database Management System', credits: 3 },
      { code: 'ITA115', name: 'Object Oriented Analysis and Design', credits: 4 },
      { code: 'ITA116', name: 'Computer Networks', credits: 4 },
      { code: 'ITA117', name: 'Information Coding Techniques', credits: 3 },
      { code: 'ITA2X1', name: 'Program Elective - I', credits: 3 },
      { code: 'ITA118', name: 'Database Management System Laboratory', credits: 1.5 },
      { code: 'ITA119', name: 'Computer Networks Laboratory', credits: 1.5 },
      { code: 'ITA120', name: 'Information Coding Laboratory', credits: 1.5 }
    ],
    6: [
      { code: 'ITA121', name: 'Software Engineering', credits: 3 },
      { code: 'ITA122', name: 'Automata and Formal Languages', credits: 4 },
      { code: 'ITA123', name: 'Web Technology', credits: 3 },
      { code: 'ITA2X2', name: 'Program Elective - II', credits: 3 },
      { code: 'ITA2X3', name: 'Program Elective - III', credits: 3 },
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'ITA124', name: 'Web Technology Laboratory', credits: 1.5 },
      { code: 'ITA125', name: 'Software Engineering Laboratory', credits: 1.5 }
    ],
    7: [
      { code: 'ITA126', name: 'Artificial Intelligence', credits: 4 },
      { code: 'ITA127', name: 'Full Stack Development', credits: 3 },
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'ITA2X4', name: 'Program Elective - IV', credits: 3 },
      { code: 'ITA2X5', name: 'Program Elective - V', credits: 3 },
      { code: 'ITA128', name: 'Artificial Intelligence Laboratory', credits: 1.5 },
      { code: 'ITA129', name: 'Full Stack Development Laboratory', credits: 1.5 },
      { code: 'ITA130', name: 'Seminar', credits: 1 }
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'ITA132', name: 'Comprehensive Test', credits: 1 },
      { code: 'ITA133', name: 'Internship', credits: 2 },
      { code: 'ITA134', name: 'Project Work', credits: 8 },
    ]
  },

  CSE: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 }
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    3: [
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ECA135', name: 'Electronic Devices and Digital Systems', credits: 3 },
      { code: 'CSA103', name: 'Computer Organization and Architecture', credits: 4 },
      { code: 'CSA104', name: 'Data Structures', credits: 3 },
      { code: 'CSA105', name: 'Object Oriented Programming Languages', credits: 3 },
      { code: 'ECA136', name: 'Electronic Devices and Digital Systems Laboratory', credits: 1.5 },
      { code: 'CSA106', name: 'Data Structures Laboratory', credits: 1.5 },
      { code: 'CSA107', name: 'Object Oriented Programming Languages Laboratory', credits: 1.5 }
    ],
    4: [
      { code: 'MAA106', name: 'Mathematics for Computing', credits: 4 },
      { code: 'CSA108', name: 'Operating Systems', credits: 3 },
      { code: 'CSA109', name: 'Design and Analysis of Algorithms', credits: 3 },
      { code: 'CSA110', name: 'Database Management Systems', credits: 3 },
      { code: 'CSA111', name: 'Software Engineering', credits: 4 },
      { code: 'CSA112', name: 'Operating System Laboratory', credits: 1.5 },
      { code: 'CSA113', name: 'Design and Analysis of Algorithms Laboratory', credits: 1.5 },
      { code: 'CSA114', name: 'Database Management Systems Laboratory', credits: 1.5 }
    ],
    5: [
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'CSA115', name: 'Platform Technologies', credits: 3 },
      { code: 'CSA116', name: 'Computer Networks', credits: 3 },
      { code: 'CSA117', name: 'Automata Theory and Compiler Design', credits: 4 },
      { code: 'CSA2X1', name: 'Professional Elective Course - I', credits: 3 },
      { code: 'CSA118', name: 'Platform Technologies Laboratory', credits: 1.5 },
      { code: 'CSA119', name: 'Computer Networks Laboratory', credits: 1.5 }
    ],
    6: [
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'CSA120', name: 'Microprocessors and Microcontrollers', credits: 3 },
      { code: 'CSA121', name: 'Web Technologies', credits: 3 },
      { code: 'CSA122', name: 'Information Security', credits: 4 },
      { code: 'CSA2X2', name: 'Professional Elective Course - II', credits: 3 },
      { code: 'CSA2X3', name: 'Professional Elective Course - III', credits: 3 },
      { code: 'CSA123', name: 'Microprocessors and Microcontrollers Laboratory', credits: 1.5 },
      { code: 'CSA124', name: 'Web Technologies Laboratory ', credits: 1.5 }
    ],
    7: [
      { code: 'CSA125', name: 'Artificial Intelligence', credits: 3 },
      { code: 'CSA126', name: 'Parallel and Distributed Systems', credits: 4 },
      { code: 'CSA127', name: 'Data Science Essentials', credits: 4 },
      { code: 'CSA2X4', name: 'Professional Elective Course - IV', credits: 3 },
      { code: 'CSA2X5', name: 'Professional Elective Course - V', credits: 3 },
      { code: 'CSA128', name: 'Artificial Intelligence Laboratory', credits: 1.5 },
      { code: 'CSA129', name: 'Seminar', credits: 1 }
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'CSA131', name: 'Comprehensive Test', credits: 1 },
      { code: 'CSA132', name: 'Internship', credits: 2 },
      { code: 'CSA133', name: 'Project Work', credits: 8 },
    ]

  },
  EEE: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 }
    ],
    3: [
      { code: 'MAA105', name: 'Linear Algebra, Numerical Methods and Random Processes', credits: 4 },
      { code: 'ECA101', name: 'Circuits and Networks', credits: 3 },
      { code: 'ECA102', name: 'Electronic Devices and Circuits', credits: 3 },
      { code: 'ECA103', name: 'Electromagnetic Waves and Fields', credits: 3 },
      { code: 'ECA104', name: 'Digital System Design', credits: 3 },
      { code: 'CSA134', name: 'Data Structures and Object-Oriented Programming', credits: 3 },
      { code: 'ECA105', name: 'Electronic Devices and Networks Laboratory', credits: 1.5 },
      { code: 'CSA135', name: 'Data Structures and OOP Laboratory', credits: 1.5 },
      { code: 'ZZA3X1', name: 'Open Elective', credits: 3 }
    ],
    4: [
      { code: 'ECA106', name: 'Transmission Lines and Waveguides', credits: 3 },
      { code: 'ECA107', name: 'Electronic Circuit Design', credits: 3 },
      { code: 'ECA108', name: 'Signals and Systems', credits: 4 },
      { code: 'ECA109', name: 'Analog Communication', credits: 3 },
      { code: 'ECA2X1', name: 'Professional Elective - I', credits: 3 },
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ECA110', name: 'Digital System Design Laboratory', credits: 1.5 },
      { code: 'ECA111', name: 'Electronic Circuit Design Laboratory', credits: 1.5 },
      { code: 'ECA112', name: 'Analog Communication Laboratory', credits: 1.5 },
      { code: 'ZZA3X2', name: 'Open Elective', credits: 3 },
    ],
    5: [
      { code: 'ECA113', name: 'Digital Signal Processing and DSP Processors', credits: 4 },
      { code: 'ECA114', name: 'Digital Communication', credits: 3 },
      { code: 'ECA2X2', name: 'Professional Elective - II', credits: 3 },
      { code: 'CSA136', name: 'Microprocessors and Microcontrollers', credits: 3 },
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'ECA115', name: 'DSP Laboratory', credits: 1.5 },
      { code: 'ECA116', name: 'Digital Communication Laboratory', credits: 1.5 },
      { code: 'CSA137', name: 'Microprocessors and Microcontrollers Laboratory', credits: 1.5 },
      { code: 'ZZA3X3', name: 'Open Elective', credits: 3 },
    ],
    5: [
      { code: 'ECA113', name: 'Digital Signal Processing and DSP Processors', credits: 4 },
      { code: 'ECA114', name: 'Digital Communication', credits: 3 },
      { code: 'ECA2X2', name: 'Professional Elective - II', credits: 3 },
      { code: 'CSA136', name: 'Microprocessors and Microcontrollers', credits: 3 },
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'ECA115', name: 'DSP Laboratory', credits: 1.5 },
      { code: 'ECA116', name: 'Digital Communication Laboratory', credits: 1.5 },
      { code: 'CSA137', name: 'Microprocessors and Microcontrollers Laboratory', credits: 1.5 },
      { code: 'ZZA3X4', name: 'Open Elective', credits: 3 },
    ],
    6: [
      { code: 'ECA117', name: 'Microwave and Optical Engineering', credits: 3 },
      { code: 'ECA118', name: 'Data Communication Networks', credits: 3 },
      { code: 'ECA119', name: 'VLSI Design', credits: 3 },
      { code: 'ECA2X3', name: 'Professional Elective - III', credits: 3 },
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'ECA120', name: 'Microwave & Optical Engg Laboratory', credits: 1.5 },
      { code: 'ECA121', name: 'Data Communication Networks Laboratory', credits: 1.5 },
      { code: 'CSA122', name: 'VLSI Design Laboratory', credits: 1.5 },
      { code: 'ZZA3X5', name: 'Open Elective', credits: 3 },
    ],
    7: [
      { code: 'ECA123', name: 'Wireless Communication', credits: 3 },
      { code: 'ECA124', name: 'Information Theory and Coding', credits: 3 },
      { code: 'ECA125', name: 'Embedded System', credits: 3 },
      { code: 'ECA2X4', name: 'Professional Elective - IV', credits: 3 },
      { code: 'ECA2X5', name: 'Professional Elective - V', credits: 3 },
      { code: 'ECA126', name: 'Wireless Communication Laboratory', credits: 1.5 },
      { code: 'ECA127', name: 'Embedded System Laboratory', credits: 1.5 },
      { code: 'CSA128', name: 'Mini Project', credits: 1 },
      { code: 'ZZA3X6', name: 'Open Elective', credits: 3 },
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'ECA131', name: 'Comprehensive Test', credits: 1 },
      { code: 'ECA132', name: 'Internship', credits: 2 },
      { code: 'ECA133', name: 'Project Work', credits: 8 },
    ]

  }
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

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

function SemesterSubjects({ department, setDepartment, semester, setSemester, grades, setGrades, navigation }) {
  const subjects = departmentSubjectsCredits[department]?.[semester] || [];

  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.label}>Select Department</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={department}
          style={[styles.picker, { color: 'black' }]}
          itemStyle={{ color: 'black' }}
          onValueChange={(value) => {
            setDepartment(value);
            setGrades({});
          }}
          mode="dropdown"
        >
          <Picker.Item label="Computer Science Engineering" value="CSE" />
          <Picker.Item label="Information Technology" value="IT" />
          <Picker.Item label="Electrical & Electronics Engineering" value="EEE" />
        </Picker>
      </View>

      <Text style={styles.label}>Select Semester</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={semester}
          style={[styles.picker, { color: 'black' }]}
          itemStyle={{ color: 'black' }}
          onValueChange={(value) => {
            if (value === 'custom') {
              navigation.navigate('CustomSubject');
            } else {
              setSemester(value);
              setGrades({});
            }
          }}
          mode="dropdown"
        >
          {semesters.map((s) => (
            <Picker.Item key={s} label={`Semester ${s}`} value={s} />
          ))}
          <Picker.Item label="Custom Subjects" value="custom" />
        </Picker>
      </View>

      {semester !== 'custom' && subjects.map(({ code, name }) => (
        <View key={code} style={styles.subjectCard}>
          <Text style={styles.subjectCode}>{code}</Text>
          <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <View style={styles.gradeRow}>
            {gradeOptions.map((grade) => (
              <TouchableOpacity
                key={grade}
                style={[styles.gradeBtn, grades[code]?.grade === grade && styles.selectedGrade]}
                onPress={() =>
                  setGrades((prev) => ({
                    ...prev,
                    [code]: { name, grade },
                  }))
                }
                activeOpacity={0.7}
              >
                <Text style={[styles.gradeText, grades[code]?.grade === grade && styles.selectedGradeText]}>
                  {grade}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
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
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState(1);
  const [grades, setGrades] = useState({});
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    const loadGradesFromStorage = async () => {
      try {
        const savedGrades = await AsyncStorage.getItem(`grades_${department}_${semester}`);
        if (savedGrades) setGrades(JSON.parse(savedGrades));
        else setGrades({});
      } catch (e) {
        // error handling
      }
    };
    loadGradesFromStorage();
  }, [department, semester]);

  useEffect(() => {
    const saveGradesToStorage = async () => {
      try {
        await AsyncStorage.setItem(`grades_${department}_${semester}`, JSON.stringify(grades));
      } catch (e) {
        // error handling
      }
    };
    saveGradesToStorage();
  }, [grades]);

  const handleCalculate = () => {
    let totalPoints = 0,
      totalCredits = 0;
    const subjects = departmentSubjectsCredits[department]?.[semester] || [];

    for (const { code, credits } of subjects) {
      const subjectGradeObj = grades[code];
      if (!subjectGradeObj || !subjectGradeObj.grade) {
        showSnackbar(`Please select a grade for ${code}.`);
        return;
      }
      totalPoints += gradePoints[subjectGradeObj.grade] * credits;
      totalCredits += credits;
    }

    const cgpaValue = totalCredits ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;

    navigation.navigate('Result', {
      cgpa: cgpaValue,
      semester,
      department,
      totalSubjects: subjects.length,
      isCustom: false,
    });
  };

  function showSnackbar(msg) {
    setSnackbar({ visible: true, message: msg });
    setTimeout(() => setSnackbar({ visible: false, message: '' }), 3000);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StickyNavBar />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SemesterSubjects
          department={department}
          setDepartment={setDepartment}
          semester={semester}
          setSemester={setSemester}
          grades={grades}
          setGrades={setGrades}
          navigation={navigation}
        />
        <CalculateButton onCalculate={handleCalculate} />
      </ScrollView>
      <Snackbar visible={snackbar.visible} message={snackbar.message} onDismiss={() => setSnackbar({ visible: false, message: '' })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e9edfa' },
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
  navContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navTitle: { flex: 1, fontSize: 19, fontWeight: 'bold', color: '#232867', textAlign: 'center' },
  container: { paddingHorizontal: '5%', paddingVertical: 20, alignItems: 'center', minHeight: '100%', marginTop: 0 },
  label: { fontWeight: 'bold', fontSize: SCREEN_WIDTH * 0.045, marginBottom: 6, marginTop: 8, color: '#232867', alignSelf: 'flex-start' },
  pickerWrapper: {
    backgroundColor: '#f6f7fb',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#87CEEB',
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
  },
  picker: { height: 50, width: '100%' },
  subjectCard: { backgroundColor: '#232867', borderRadius: 20, marginVertical: 10, padding: 16, width: '100%', maxWidth: 400 },
  subjectCode: { color: '#87CEEB', fontWeight: 'bold', fontSize: SCREEN_WIDTH * 0.045, marginBottom: 4 },
  subjectName: { color: '#fff', fontSize: SCREEN_WIDTH * 0.05, fontWeight: '600', marginBottom: 8 },
  gradeRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' },
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
  gradeText: { color: '#fff', fontWeight: 'bold', fontSize: SCREEN_WIDTH * 0.038, textAlign: 'center' },
  selectedGrade: { backgroundColor: '#fff', borderColor: '#232867' },
  selectedGradeText: { color: '#232867', fontWeight: 'bold' },
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
  calcBtnText: { color: '#fff', fontSize: SCREEN_WIDTH * 0.06, fontWeight: 'bold', letterSpacing: 1 },
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
  snackbarText: { color: '#fff', fontSize: SCREEN_WIDTH * 0.045, fontWeight: '500', letterSpacing: 0.3 },
});
