// components/CustomSubject.js - UPDATED VERSION
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { departmentSubjectsCredits } from './data/DepartmentData';
import CustomSubjectService from './database/services/CustomSubjectService';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';
import SubjectCard from './components/SubjectCard';
import PreviewCard from './components/PreviewCard';
import PrimaryButton from './components/PrimaryButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Main Combined Component
export default function CombinedCGPATracker({ navigation }) {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('input');
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState({
    name: '',
    code: '',
    credits: '',
  });
  // Grade management state
  const [grades, setGrades] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSemester, setCurrentSemester] = useState('Custom');
  const [currentDepartment, setCurrentDepartment] = useState('Custom');

  // Multi-select for pre-filling subjects
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState(1);

  // Use same grade scale & UI as CGPA Calculator (S, A, B, C, D, E, F)
  // Standard Grade Scale (S, A, B, C, D, E, F)
  const gradePoints = useMemo(() => ({
    S: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    F: 0,
  }), []);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);
      if (user?.department) {
        setCurrentDepartment(user.department);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }, []);

  // Add subject function
  const addSubject = useCallback(() => {
    if (!currentSubject.name || !currentSubject.credits) {
      Alert.alert('Error', 'Please fill at least Subject Name and Credits');
      return;
    }
    const creditsNum = parseInt(currentSubject.credits, 10);
    if (isNaN(creditsNum) || creditsNum <= 0) {
      Alert.alert('Error', 'Credits must be a valid positive integer');
      return;
    }
    const timestamp = Date.now().toString();
    const newSubject = {
      id: timestamp,
      name: currentSubject.name.trim(),
      code: currentSubject.code.trim() || `CUST-${timestamp.slice(-4)}`,
      credits: creditsNum,
    };
    setSubjects(prev => [...prev, newSubject]);
    setCurrentSubject({ name: '', code: '', credits: '' });
    Keyboard.dismiss();
  }, [currentSubject]);

  // Import subjects from department/semester
  const importSubjectsFromDepartment = useCallback(() => {
    const deptSubs = departmentSubjectsCredits[selectedDept]?.[selectedSem];
    if (!deptSubs || deptSubs.length === 0) {
      Alert.alert('Info', 'No subjects found for the selected department and semester.');
      return;
    }

    const newSubjects = deptSubs.map(s => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: s.name,
      code: s.code,
      credits: s.credits,
    }));

    setSubjects(prev => [...prev, ...newSubjects]);
  }, [selectedDept, selectedSem]);

  // Remove subject function
  const removeSubject = useCallback((id) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    setGrades(prev => {
      const newGrades = { ...prev };
      delete newGrades[id];
      return newGrades;
    });
  }, []);

  const clearAllSubjects = useCallback(() => {
    if (subjects.length === 0) return;
    Alert.alert(
      'Clear All',
      'Are you sure you want to remove all added subjects?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setSubjects([]);
            setGrades({});
          }
        }
      ]
    );
  }, [subjects.length]);

  // Navigate to grade selection
  const proceedToGrades = useCallback(() => {
    if (subjects.length === 0) {
      Alert.alert('Error', 'Please add at least one subject');
      return;
    }
    setCurrentScreen('grades');
  }, [subjects.length]);

  // Update grade function
  const updateGrade = useCallback((subjectId, grade) => {
    setGrades(prev => ({
      ...prev,
      [subjectId]: grade,
    }));
  }, []);

  // Calculate current CGPA for results
  const currentCGPA = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(subject => {
      const grade = grades[subject.id];
      const points = gradePoints[grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  }, [subjects, grades, gradePoints]);

  // Calculate CGPA function - save then navigate to shared Result screen
  const calculateCGPA = useCallback(async () => {
    if (!currentUser || !currentUser.name) {
      Alert.alert(
        'Profile Required',
        'Please set up your profile first to calculate and save your CGPA.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set up Profile', onPress: () => navigation.navigate('ViewProfile') }
        ]
      );
      return;
    }

    const subjectsWithoutGrades = subjects.filter(subject => !grades[subject.id]);

    if (subjectsWithoutGrades.length > 0) {
      Alert.alert(
        'Missing Grades',
        `Please select grades for all subjects. Missing: ${subjectsWithoutGrades.map(s => s.name).join(', ')}`
      );
      return;
    }

    navigation.navigate('Result', {
      cgpa: parseFloat(currentCGPA),
      semester: currentSemester,
      department: currentDepartment,
      totalSubjects: subjects.length,
      isCustom: true,
      subjects: subjects.map(s => {
        const selectedGrade = grades[s.id];
        return {
          id: s.id,
          code: s.code,
          name: s.name,
          credits: s.credits,
          grade: selectedGrade,
          gradePoints: gradePoints[selectedGrade] || 0
        };
      })
    });
  }, [subjects, grades, currentCGPA, navigation, currentSemester, currentDepartment, gradePoints]);

  // Render header
  const renderHeader = () => {
    let title = '';
    let subtitle = '';
    switch (currentScreen) {
      case 'input':
        title = 'Add Custom Subjects';
        subtitle = 'Create your personalized subject list';
        break;
      case 'grades':
        title = 'Select Grades';
        subtitle = 'Choose grades for each subject';
        break;
    }
    return (
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="graduation-cap" size={24} color="#232867" />
          </View>
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    );
  };

  // Subject Input Screen Content
  const renderSubjectInput = () => (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={subjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PreviewCard
            subject={item}
            onRemove={() => removeSubject(item.id)}
          />
        )}
        ListHeaderComponent={(
          <View style={styles.screenContent}>
            {/* Quick Pre-fill Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.sectionTitle}>Pre-fill from Syllabus</Text>
              <Text style={styles.subtitle}>Quickly add subjects from official curriculum</Text>

              <View style={styles.pickerRow}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedDept}
                    onValueChange={(val) => setSelectedDept(val)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="CSE" value="CSE" />
                    <Picker.Item label="IT" value="IT" />
                    <Picker.Item label="EEE" value="EEE" />
                  </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedSem}
                    onValueChange={(val) => setSelectedSem(val)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <Picker.Item key={s} label={`Sem ${s}`} value={s} />
                    ))}
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={styles.loadButton}
                onPress={importSubjectsFromDepartment}
              >
                <Ionicons name="download-outline" size={18} color="#fff" style={styles.loadIcon} />
                <Text style={styles.loadButtonText}>Load Subjects</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Subject Details</Text>
                {subjects.length > 0 && (
                  <TouchableOpacity onPress={clearAllSubjects}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Subject Name (e.g. Mathematics)"
                value={currentSubject.name}
                onChangeText={(text) => setCurrentSubject(prev => ({ ...prev, name: text }))}
                placeholderTextColor="#999"
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Subject Code (Optional)"
                value={currentSubject.code}
                onChangeText={(text) => setCurrentSubject(prev => ({ ...prev, code: text }))}
                placeholderTextColor="#999"
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Credits (e.g. 4)"
                value={currentSubject.credits}
                onChangeText={(text) => {
                  // Only allow digits (no decimals, no special chars)
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setCurrentSubject(prev => ({ ...prev, credits: cleaned }));
                }}
                keyboardType="numeric"
                placeholderTextColor="#999"
                returnKeyType="done"
                onSubmitEditing={addSubject}
              />
              <PrimaryButton
                title="Add Subject"
                iconName="plus"
                onPress={addSubject}
                style={styles.addButton}
                textStyle={styles.addButtonText}
              />
            </View>
            {subjects.length > 0 && (
              <Text style={styles.sectionTitle}>Added Subjects ({subjects.length})</Text>
            )}
          </View>
        )}
        ListFooterComponent={subjects.length > 0 ? (
          <View style={styles.footerContainer}>
            <PrimaryButton
              title="Proceed to Grade Selection"
              iconName="arrow-right"
              onPress={proceedToGrades}
              style={styles.proceedButtonLarge}
              textStyle={styles.proceedButtonText}
            />
          </View>
        ) : null}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );

  // Grade Selection Screen Content
  const renderGradeSelection = () => (
    <FlatList
      data={subjects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <SubjectCard
          subject={item}
          selectedGrade={grades[item.id]}
          onGradeChange={(grade) => updateGrade(item.id, grade)}
        />
      )}
      ListHeaderComponent={(
        <View style={styles.screenContent}>
          <View style={styles.gradesHeader}>
            <Text style={styles.sectionTitle}>Select Grades</Text>
            <Text style={styles.subtitle}>Tap on the grade for each subject</Text>
          </View>
        </View>
      )}
      ListFooterComponent={(
        <View style={styles.calculateContainer}>
          <PrimaryButton
            title="Calculate CGPA"
            iconName="calculator"
            onPress={calculateCGPA}
            style={styles.calcBtn}
            textStyle={styles.calcBtnText}
          />

          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('input')}>
            <Ionicons name="arrow-back" size={18} color="#232867" style={styles.buttonIcon} />
            <Text style={styles.backButtonText}>Back to Subjects</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.stickyNavBar}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
        <View style={styles.navContent}>
          <Text style={styles.navTitle}>Custom CGPA Calculator</Text>
        </View>
      </View>

      {renderHeader()}

      {currentScreen === 'input' && renderSubjectInput()}
      {currentScreen === 'grades' && renderGradeSelection()}
    </SafeAreaView>
  );
}

// --- IMPROVED STYLES ---
const styles = StyleSheet.create({
  // Layout
  root: {
    flex: 1,
    backgroundColor: '#e9edfa'
  },
  exportButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#9ca3af',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  loadButton: {
    backgroundColor: '#232867',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  loadIcon: {
    marginRight: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  flex1: {
    flex: 1,
  },

  // Navigation
  stickyNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecedf6',
    justifyContent: 'space-between',
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232867',
    textAlign: 'center'
  },

  // Header
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#3a4285',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },

  // Scroll & Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  screenContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  footerContainer: {
    marginTop: 10,
  },

  // Input Section
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232867',
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#fdfdfd',
    color: '#232867',
  },
  addButton: {
    backgroundColor: '#232867',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // Preview Section
  previewList: {
    marginBottom: 16,
  },
  proceedButtonLarge: {
    backgroundColor: '#4facfe',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // Grade Selection
  gradesHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectsContainer: {
    marginBottom: 20,
  },
  calculateContainer: {
    alignItems: 'center',
    paddingBottom: 30,
    marginTop: 10,
  },
  calcBtn: {
    backgroundColor: '#232867',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  calcBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  backButtonText: {
    color: '#232867',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Common
  buttonIcon: {
    marginRight: 8,
  },
});