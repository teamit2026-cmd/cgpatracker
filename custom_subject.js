// components/CustomSubject.js - UPDATED VERSION
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Use same grade scale & UI as CGPA Calculator (S, A, B, C, D, E, F)
  const gradePoints = {
    S: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    F: 0,
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);
      if (user?.department) {
        setCurrentDepartment(user.department);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  // Add subject function
  const addSubject = () => {
    if (!currentSubject.name || !currentSubject.code || !currentSubject.credits) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (isNaN(currentSubject.credits) || parseFloat(currentSubject.credits) <= 0) {
      Alert.alert('Error', 'Credits must be a valid positive number');
      return;
    }
    const newSubject = {
      id: Date.now().toString(),
      name: currentSubject.name,
      code: currentSubject.code || `CUST-${Date.now()}`,
      credits: parseFloat(currentSubject.credits),
    };
    setSubjects([...subjects, newSubject]);
    setCurrentSubject({ name: '', code: '', credits: '' });
  };

  // Remove subject function
  const removeSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    const newGrades = { ...grades };
    delete newGrades[id];
    setGrades(newGrades);
  };

  // Navigate to grade selection
  const proceedToGrades = () => {
    if (subjects.length === 0) {
      Alert.alert('Error', 'Please add at least one subject');
      return;
    }
    setCurrentScreen('grades');
  };

  // Update grade function
  const updateGrade = (subjectId, grade) => {
    // find subject to determine key (prefer code for consistency with other screens)
    const subject = subjects.find(s => s.id === subjectId);
    const key = subject && subject.code ? subject.code : subjectId;
    setGrades(prev => ({
      ...prev,
      [key]: grade,
    }));
  };

  // Calculate CGPA function - save then navigate to shared Result screen
  const calculateCGPA = async () => {
    const subjectsWithoutGrades = subjects.filter(subject => {
      const key = subject.code || subject.id;
      return !grades[key];
    });
    if (subjectsWithoutGrades.length > 0) {
      Alert.alert(
        'Missing Grades',
        `Please select grades for all subjects. Missing: ${subjectsWithoutGrades.map(s => s.name).join(', ')}`
      );
      return;
    }

    // Calculate CGPA first
    const cgpa = calculateCurrentCGPA();
    
    // Navigate directly to Result screen without saving first
    navigation.navigate('Result', {
      cgpa: parseFloat(cgpa),
      semester: currentSemester,
      department: currentDepartment,
      totalSubjects: subjects.length,
      isCustom: true,
        // Pass subjects data for display in Result screen
        subjects: subjects.map(s => {
          const key = s.code || s.id;
          const selectedGrade = grades[key] || null;
          return {
            id: s.id || (s.code || '') + '-' + (s.name || '').slice(0,4),
            code: s.code || '',
            name: s.name || '',
            credits: s.credits || 0,
            grade: selectedGrade,
            gradePoints: selectedGrade ? (gradePoints[selectedGrade] || 0) : (s.gradePoints || 0)
          };
        })
    });
  };

  // Calculate current CGPA for results
  const calculateCurrentCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(subject => {
      const key = subject.code || subject.id;
      const grade = grades[key];
      const points = gradePoints[grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screenContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Subject Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject Name"
              value={currentSubject.name}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, name: text })}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Subject Code"
              value={currentSubject.code}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, code: text })}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Credits"
              value={currentSubject.credits}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, credits: text })}
              keyboardType="numeric"
              placeholderTextColor="#666"
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
            <View style={styles.previewContainer}>
              <Text style={styles.sectionTitle}>Added Subjects ({subjects.length})</Text>
              
              <FlatList
                data={subjects}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <PreviewCard
                    subject={item}
                    onRemove={() => removeSubject(item.id)}
                  />
                )}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                style={styles.previewList}
              />
              
              <PrimaryButton
                title="Proceed to Grade Selection"
                iconName="arrow-right"
                onPress={proceedToGrades}
                style={styles.proceedButtonLarge}
                textStyle={styles.proceedButtonText}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Grade Selection Screen Content
  const renderGradeSelection = () => (
    <ScrollView 
      style={styles.scrollView} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.screenContent}>
        <View style={styles.subjectsContainer}>
          <Text style={styles.sectionTitle}>Select Grades</Text>
          <Text style={styles.subtitle}>Tap on the grade for each subject</Text>
          
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              selectedGrade={grades[subject.id]}
              onGradeChange={(grade) => updateGrade(subject.id, grade)}
            />
          ))}
        </View>
        
        <View style={styles.calculateContainer}>
          <PrimaryButton
            title="Calculate CGPA"
            iconName="calculator"
            onPress={calculateCGPA}
            style={styles.calcBtn}
            textStyle={styles.calcBtnText}
          />
          
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('input')}>
            <FontAwesome5 name="arrow-left" size={14} color="#232867" style={styles.buttonIcon} />
            <Text style={styles.backButtonText}>Back to Subjects</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    flexGrow: 1,
    paddingBottom: 30,
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Input Section
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#232867',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#232867',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Preview Section
  previewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  previewList: {
    marginBottom: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  previewContent: {
    flex: 1,
    marginRight: 12,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewDetails: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC3545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButtonLarge: {
    backgroundColor: '#28A745',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Grade Selection
  subjectsContainer: {
    marginBottom: 20,
  },
  calculateContainer: {
    alignItems: 'center',
    gap: 16,
  },
  calcBtn: {
    backgroundColor: '#232867',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    padding: 12,
  },
  backButtonText: {
    color: '#232867',
    fontSize: 14,
    fontWeight: '600',
  },

  // Common
  buttonIcon: {
    marginRight: 8,
  },
});