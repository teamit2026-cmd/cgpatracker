import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Services & Data
import GradeService from './database/services/GradeService';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';
import CustomSubjectService from './database/services/CustomSubjectService';
import { departmentSubjectsCredits, departmentOptions } from './data/DepartmentData';

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

function Notification({ visible, message, type, onDismiss, animation }) {
  if (!visible) return null;
  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          backgroundColor: type === "success" ? "#10b981" : "#ef4444",
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons
        name={type === "success" ? "checkmark-circle" : "warning"}
        size={20}
        color="#ffffff"
        style={styles.notificationIcon}
      />
      <Text style={styles.notificationText}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
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
          {departmentOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
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
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });
  const [currentUser, setCurrentUser] = useState(null);
  const [realmReady, setRealmReady] = useState(false);
  const [customSubjects, setCustomSubjects] = useState([]);
  const [hasShownProfileWarning, setHasShownProfileWarning] = useState(false);
  const notificationAnimation = React.useRef(new Animated.Value(0)).current;

  // Use focus effect to re-check user profile when returning to this screen
  useFocusEffect(
    React.useCallback(() => {
      checkUserStatus();
    }, [hasShownProfileWarning])
  );

  useEffect(() => {
    if (realmReady && currentUser) {
      loadGradesFromRealm();
      if (semester === 'custom') {
        loadCustomSubjects();
      }
    }
  }, [department, semester, realmReady, currentUser]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ visible: true, message: msg, type });
    Animated.timing(notificationAnimation, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Auto-dismiss for success messages
    if (type === 'success') {
      setTimeout(() => hideNotification(), 3000);
    }
  };

  const hideNotification = () => {
    Animated.timing(notificationAnimation, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    });
  };

  const checkUserStatus = async () => {
    try {
      const user = await UserService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.department && !currentUser) { // Only set department if not already set manually
          setDepartment(user.department);
        }
        setRealmReady(true);
      } else if (!hasShownProfileWarning) {
        showNotification('Please set up your profile first to use the CGPA Calculator.', 'error');
        setHasShownProfileWarning(true);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const initializeUserAndData = async () => {
    try {
      const user = await UserService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.department) {
          setDepartment(user.department);
        }
        setRealmReady(true);
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      showNotification('Error loading user data', 'error');
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
      showNotification('Error saving grades: ' + error.message, 'error');
    }
  };

  const handleCalculate = async () => {
    if (!currentUser || !currentUser.name) {
      showNotification('Please set up your profile first to use the CGPA Calculator.', 'error');
      return;
    }

    // Get subjects based on semester type
    const subjects = semester === 'custom'
      ? customSubjects
      : departmentSubjectsCredits[department]?.[semester] || [];

    // Validate subjects structure and data integrity
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      showNotification('No subjects found for the selected department and semester', 'error');
      return;
    }

    // Validate each subject has required properties
    const invalidSubjects = subjects.filter(s => !s || !s.code || !s.name || typeof s.credits !== 'number' || s.credits <= 0);
    if (invalidSubjects.length > 0) {
      showSnackbar('Some subjects have invalid data. Please contact support.');
      console.error('Invalid subjects detected:', invalidSubjects);
      return;
    }

    // Validate all grades are selected and valid
    const validGrades = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
    for (const { code, name } of subjects) {
      const subjectGradeObj = grades[code];
      if (!subjectGradeObj || !subjectGradeObj.grade) {
        showNotification(`Please select a grade for ${code} - ${name}`, 'error');
        return;
      }
      // Validate grade is one of the valid values
      if (!validGrades.includes(subjectGradeObj.grade)) {
        showNotification(`Invalid grade "${subjectGradeObj.grade}" for ${name}. Please select a valid grade (S, A, B, C, D, E, F)`, 'error');
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

      navigation.navigate('Result', {
        cgpa: result.gpa,
        semester,
        department,
        totalSubjects: result.totalSubjects,
        isCustom: semester === 'custom',
        historySubjects: formattedSubjects, // Pass formatted subjects [code, name, grade]
      });
    } catch (error) {
      console.error('Error in CGPA calculation:', error);
      showNotification(error.message || 'Error calculating CGPA. Please try again.', 'error');
      // Log detailed error information for debugging
      console.error('Error details:', {
        semester,
        department,
        subjectsCount: subjects?.length || 0,
        gradesCount: Object.keys(grades).length,
        error: error.toString()
      });
    }
  };

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
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onDismiss={hideNotification}
        animation={notificationAnimation}
      />
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
  notificationContainer: {
    position: 'absolute',
    top: 60,
    left: '5%',
    right: '5%',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationText: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
    fontSize: 14,
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