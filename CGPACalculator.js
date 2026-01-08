import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

// Realm Services
import GradeService from './database/services/GradeService';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';
import CustomSubjectService from './database/services/CustomSubjectService';
import SubjectCard from './components/SubjectCard';

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

      {semester !== 'custom' && subjects.map((subject) => (
        <SubjectCard
          key={subject.code}
          subject={subject}
          selectedGrade={grades[subject.code]?.grade}
          onGradeChange={(grade) => setGrades((prev) => ({
            ...prev,
            [subject.code]: { name: subject.name, grade, credits: subject.credits },
          }))}
        />
      ))}
    </View>
  );
}

function CustomSubjectsList({ customSubjects, setCustomSubjects, grades, setGrades }) {
  return (
    <View style={{ width: '100%' }}>
      <Text style={styles.label}>Custom Subjects</Text>
      {customSubjects.length === 0 && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: '#666' }}>No custom subjects found. Add them from the Custom Subjects screen.</Text>
        </View>
      )}

      {customSubjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          selectedGrade={grades[subject.code]?.grade}
          onGradeChange={(grade) => setGrades((prev) => ({
            ...prev,
            [subject.code]: { name: subject.name, grade, credits: subject.credits },
          }))}
        />
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
  const [currentUser, setCurrentUser] = useState(null);
  const [realmReady, setRealmReady] = useState(false);
  const [customSubjects, setCustomSubjects] = useState([]);

  // Get current user and load grades on component mount
  useEffect(() => {
    initializeUserAndData();
  }, []);

  // Load grades when department/semester changes
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

      // Add null check for realmGrades
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

      // Merge any saved grades from custom subjects into grades state
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

  // Save grades to Realm whenever grades change
  // useEffect(() => {
  //   if (currentUser && Object.keys(grades).length > 0 && realmReady) {
  //     saveGradesToRealm();
  //   }
  // }, [grades]);

// IN CGPACalculator.js, REPLACE the saveGradesToRealm function:

const saveGradesToRealm = async () => {
  try {
    if (!currentUser) {
      console.warn('❌ No current user found');
      return;
    }

    // VALIDATE grades object
    if (!grades || Object.keys(grades).length === 0) {
      console.log('ℹ️ No grades to save');
      return;
    }

    // First, clear existing grades for this semester
    await GradeService.deleteGradesBySemester(currentUser.id, department, semester);

    // Convert grades object to Realm format with VALIDATION
    const subjects = semester === 'custom'
      ? customSubjects
      : departmentSubjectsCredits[department]?.[semester] || [];
    
    // CRITICAL: Validate subjects array
    if (!subjects || subjects.length === 0) {
      console.error('❌ No subjects found for department/selection:', department, semester);
      return;
    }

    const realmGrades = GradeService.convertToRealmGrades(
      grades, 
      currentUser.id, 
      department, 
      semester, 
      subjects
    );

    // VALIDATE realmGrades before saving
    if (!realmGrades || realmGrades.length === 0) {
      console.warn('⚠️ No valid grades to save after conversion');
      return;
    }

    // Save each grade to Realm with ERROR HANDLING
    for (const gradeData of realmGrades) {
      try {
        await GradeService.saveGrade(gradeData);
        console.log('✅ Grade saved successfully:', gradeData.subjectCode);
      } catch (gradeError) {
        console.error('❌ Failed to save grade:', gradeData.subjectCode, gradeError);
      }
    }

    console.log('🎉 All grades saved to Realm successfully');
  } catch (error) {
    console.error('❌ Error saving grades to Realm:', error);
    setSnackbar({ visible: true, message: 'Error saving grades: ' + error.message });
  }
};

// INSTEAD: Modify the handleCalculate function to save grades:
// IN CGPACalculator.js - SIMPLIFY THE handleCalculate FUNCTION:

const handleCalculate = async () => {
  if (!currentUser) {
    showSnackbar('Please set up your profile first');
    return;
  }

  const subjects = departmentSubjectsCredits[department]?.[semester] || [];

  if (!subjects || subjects.length === 0) {
    showSnackbar('No subjects found for the selected department and semester');
    return;
  }

  // Validate that all subjects have grades
  for (const { code, name } of subjects) {
    const subjectGradeObj = grades[code];
    if (!subjectGradeObj || !subjectGradeObj.grade) {
      showSnackbar(`Please select a grade for ${code} - ${name}`);
      return;
    }
  }

  try {
    // Save grades to Realm
    await saveGradesToRealm();
    
    // FIX: Use universal GPA calculator with grades data
   // IN CGPACalculator.js - IN handleCalculate FUNCTION, REPLACE THIS PART:

// ✅ USE THE NEW UNIVERSAL CALCULATOR WITH GRADES
const result = ResultService.calculateUniversalGPA(subjects, grades);

console.log('✅ CGPA calculated:', result);
    // Save result to Realm
    const resultData = {
      userId: currentUser.id,
      value: result.gpa,
      semester: (typeof semester === 'string' ? semester : semester.toString()),
      department: department,
      totalSubjects: result.totalSubjects,
      isCustom: semester === 'custom',
      grade: result.grade,
      gradeColor: ResultService.getGradeColor(result.grade),
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
  const calculateGradeClassification = (cgpaValue) => {
    if (cgpaValue >= 9.5) {
      return { grade: 'O', color: '#10b981' };
    } else if (cgpaValue >= 9.0) {
      return { grade: 'A+', color: '#059669' };
    } else if (cgpaValue >= 8.5) {
      return { grade: 'A', color: '#0d9488' };
    } else if (cgpaValue >= 7.5) {
      return { grade: 'B+', color: '#0891b2' };
    } else if (cgpaValue >= 6.5) {
      return { grade: 'B', color: '#0284c7' };
    } else if (cgpaValue >= 5.5) {
      return { grade: 'C', color: '#dc6803' };
    } else if (cgpaValue >= 4.5) {
      return { grade: 'P', color: '#dc2626' };
    } else {
      return { grade: 'F', color: '#991b1b' };
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
        
        {semester === 'custom' ? (
          <CustomSubjectsList
            customSubjects={customSubjects}
            setCustomSubjects={setCustomSubjects}
            grades={grades}
            setGrades={setGrades}
          />
        ) : (
          <SemesterSubjects
            department={department}
            setDepartment={setDepartment}
            semester={semester}
            setSemester={setSemester}
            grades={grades}
            setGrades={setGrades}
            navigation={navigation}
          />
        )}
        
        {currentUser && (
          <CalculateButton onCalculate={handleCalculate} />
        )}
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
  subjectCard: { 
    backgroundColor: '#232867', 
    borderRadius: 20, 
    marginVertical: 10, 
    padding: 16, 
    width: '100%', 
    maxWidth: 400 
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
    fontSize: SCREEN_WIDTH * 0.045 
  },
  creditsText: {
    color: '#b3e5fc',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  subjectName: { 
    color: '#fff', 
    fontSize: SCREEN_WIDTH * 0.05, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  gradeRow: { 
    flexDirection: 'row', 
    marginTop: 20, 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexWrap: 'nowrap' 
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
    textAlign: 'center' 
  },
  selectedGrade: { 
    backgroundColor: '#fff', 
    borderColor: '#232867' 
  },
  selectedGradeText: { 
    color: '#232867', 
    fontWeight: 'bold' 
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
    fontSize: SCREEN_WIDTH * 0.045, 
    fontWeight: '500', 
    letterSpacing: 0.3 
  },
  profileWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  warningText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  profileButton: {
    backgroundColor: '#232867',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});