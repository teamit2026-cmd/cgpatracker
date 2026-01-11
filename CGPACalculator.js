import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services & Data
import GradeService from './database/services/GradeService';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';
import CustomSubjectService from './database/services/CustomSubjectService';
import { departmentSubjectsCredits } from './data/DepartmentData';

// Components
import SubjectCard from './components/SubjectCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

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

function SemesterSubjects({ department, setDepartment, semester, setSemester, grades, setGrades, navigation, customSubjects }) {
  const subjects = semester === 'custom'
    ? customSubjects
    : departmentSubjectsCredits[department]?.[semester] || [];

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

      <View style={{ width: '100%' }}>
        {semester === 'custom' && subjects.length === 0 && (
          <View style={{ padding: 12 }}>
            <Text style={{ color: '#666' }}>No custom subjects found. Add them from the Custom Subjects screen.</Text>
          </View>
        )}

        {subjects.map((subject) => (
          <SubjectCard
            key={subject.code || subject.id}
            subject={subject}
            selectedGrade={grades[subject.code]?.grade}
            onGradeChange={(grade) => setGrades((prev) => ({
              ...prev,
              [subject.code]: { name: subject.name, grade, credits: subject.credits },
            }))}
          />
        ))}
      </View>
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
  const [currentUser, setCurrentUser] = useState(null);
  const [realmReady, setRealmReady] = useState(false);
  const [customSubjects, setCustomSubjects] = useState([]);

  useEffect(() => {
    initializeUserAndData();
  }, []);

  useEffect(() => {
    if (realmReady && currentUser) {
      loadGradesFromRealm();
      if (semester === 'custom') {
        loadCustomSubjects();
      }
    }
  }, [department, semester, realmReady, currentUser]);

  const initializeUserAndData = async () => {
    try {
      const user = await UserService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setRealmReady(true);
      } else {
        Alert.alert(
          'Profile Required',
          'Please set up your profile first to use the CGPA Calculator.',
          [
            {
              text: 'Go to Profile',
              onPress: () => navigation.navigate('ViewProfile')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      setSnackbar({ visible: true, message: 'Error loading user data' });
    }
  };

  const loadGradesFromRealm = async () => {
    if (!currentUser) return;

    try {
      const realmGrades = await GradeService.getGradesByUserDepartmentSemester(
        currentUser.id,
        department,
        semester
      );

      if (!realmGrades) {
        setGrades({});
        return;
      }

      const gradesObject = {};
      realmGrades.forEach(grade => {
        if (grade && grade.subjectCode) {
          gradesObject[grade.subjectCode] = {
            name: grade.subjectName,
            grade: grade.grade,
            credits: grade.credits
          };
        }
      });

      setGrades(gradesObject);
    } catch (error) {
      console.error('Error loading grades from Realm:', error);
      setGrades({});
    }
  };

  const loadCustomSubjects = async () => {
    if (!currentUser) return;
    try {
      const subs = await CustomSubjectService.getCustomSubjectsBySemester(
        currentUser.id,
        'Custom',
        department
      );

      const subsArray = Array.isArray(subs) ? subs : Array.from(subs || []);
      setCustomSubjects(subsArray);

      const newGrades = { ...grades };
      subsArray.forEach((s) => {
        if (s && s.code && s.grade) {
          newGrades[s.code] = { name: s.name, grade: s.grade, credits: s.credits };
        }
      });
      setGrades(newGrades);
    } catch (error) {
      console.error('Error loading custom subjects:', error);
      setCustomSubjects([]);
    }
  };

  const saveGradesToRealm = async () => {
    try {
      if (!currentUser || !grades || Object.keys(grades).length === 0) return;

      await GradeService.deleteGradesBySemester(currentUser.id, department, semester);

      const subjects = semester === 'custom'
        ? customSubjects
        : departmentSubjectsCredits[department]?.[semester] || [];

      if (!subjects || subjects.length === 0) return;

      const realmGrades = GradeService.convertToRealmGrades(
        grades,
        currentUser.id,
        department,
        semester,
        subjects
      );

      if (!realmGrades || realmGrades.length === 0) return;

      for (const gradeData of realmGrades) {
        try {
          await GradeService.saveGrade(gradeData);
        } catch (gradeError) {
          console.error('❌ Failed to save grade:', gradeData.subjectCode, gradeError);
        }
      }
    } catch (error) {
      console.error('❌ Error saving grades to Realm:', error);
      setSnackbar({ visible: true, message: 'Error saving grades: ' + error.message });
    }
  };

  const handleCalculate = async () => {
    if (!currentUser) {
      showSnackbar('Please set up your profile first');
      return;
    }

    const subjects = semester === 'custom'
      ? customSubjects
      : departmentSubjectsCredits[department]?.[semester] || [];

    if (!subjects || subjects.length === 0) {
      showSnackbar('No subjects found for the selected department and semester');
      return;
    }

    for (const { code, name } of subjects) {
      const subjectGradeObj = grades[code];
      if (!subjectGradeObj || !subjectGradeObj.grade) {
        showSnackbar(`Please select a grade for ${code} - ${name}`);
        return;
      }
    }

    try {
      await saveGradesToRealm();

      const result = ResultService.calculateUniversalGPA(subjects, grades);

      // Format subjects for storage: [code, name, grade]
      const formattedSubjects = subjects.map(subject => [
        subject.code,
        subject.name,
        grades[subject.code]?.grade || 'N/A'
      ]);

      const resultData = {
        userId: currentUser.id,
        value: result.gpa,
        semester: (typeof semester === 'string' ? semester : semester.toString()),
        department: department,
        totalSubjects: result.totalSubjects,
        isCustom: semester === 'custom',
        grade: result.grade,
        gradeColor: ResultService.getGradeColor(result.grade),
        subjects: formattedSubjects, // Add subjects array here
      };

      await ResultService.saveResult(resultData);

      navigation.navigate('Result', {
        cgpa: result.gpa,
        semester,
        department,
        totalSubjects: result.totalSubjects,
        isCustom: semester === 'custom',
      });
    } catch (error) {
      console.error('Error saving calculation result:', error);
      showSnackbar('Error saving calculation result');
    }
  };

  function showSnackbar(msg) {
    setSnackbar({ visible: true, message: msg });
    setTimeout(() => setSnackbar({ visible: false, message: '' }), 3000);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StickyNavBar />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!currentUser && (
          <View style={styles.profileWarning}>
            <Text style={styles.warningText}>Please set up your profile to use the calculator</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('ViewProfile')}
            >
              <Text style={styles.profileButtonText}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <SemesterSubjects
          department={department}
          setDepartment={setDepartment}
          semester={semester}
          setSemester={setSemester}
          grades={grades}
          setGrades={setGrades}
          navigation={navigation}
          customSubjects={customSubjects}
        />

        {currentUser && (
          <CalculateButton onCalculate={handleCalculate} />
        )}
      </ScrollView>
      <Snackbar visible={snackbar.visible} message={snackbar.message} onDismiss={() => setSnackbar({ visible: false, message: '' })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e9edfa' }, // Original background
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
  // Note: subjectCard styles not needed here anymore as they are in SubjectCard.js, 
  // but kept calcBtn and others that are used here.
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
    letterSpacing: 1
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
    fontWeight: '600',
    flex: 1,
  },
  profileWarning: {
    width: '100%',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffecb5',
  },
  warningText: {
    color: '#856404',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileButton: {
    backgroundColor: '#232867',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});