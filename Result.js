// Result.js - UPDATED VERSION (No Success Popup + Improved UI)
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// CORRECT PATHS - services are in ./database/services/
import CustomSubjectService from './database/services/CustomSubjectService';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';

const { width, height } = Dimensions.get('window');

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [currentUser, setCurrentUser] = useState(null);
  const [customSubjects, setCustomSubjects] = useState([]);
  const [currentSemester, setCurrentSemester] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);

  // UI States from beautiful design
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [saved, setSaved] = useState(false);
  const [gradeInfo, setGradeInfo] = useState({ grade: '', color: '' });

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && route.params) {
      const {
        semester,
        department,
        subjects,
        calculationType,
        cgpa,
        totalSubjects,
        totalCredits,
        isCustom,
      } = route.params;

      setCurrentSemester(semester);
      setCurrentDepartment(department);

      // If subjects array provided by caller, prefer it (handles both department & custom flows)
      if (subjects && Array.isArray(subjects) && subjects.length > 0) {
        if (calculationType === 'custom' || isCustom === true) {
          calculateCustomResult(subjects);
        } else {
          calculateDepartmentResult(subjects, semester, department);
        }
        return;
      }

      // If caller specified custom calculation but did NOT pass subjects, load custom subjects from DB
      if (calculationType === 'custom' || isCustom === true) {
        loadCustomSubjects(semester, department);
        return;
      }

      // If caller provided a summary (cgpa etc.), build the calculationResult from those values
      if (cgpa !== undefined && cgpa !== null) {
        const grade = ResultService.getGradeFromGPA
          ? ResultService.getGradeFromGPA(parseFloat(cgpa))
          : (route.params.grade || 'F');
        const gradeColor = ResultService.getGradeColor(grade);

        setCalculationResult({
          gpa: parseFloat(cgpa),
          totalSubjects: totalSubjects || 0,
          totalCredits: totalCredits || 0,
          grade: grade,
          gradeColor: gradeColor,
          semester,
          department,
          isCustom: !!isCustom,
        });
        return;
      }

      // Fallback: no usable data provided
      console.warn('No subjects or summary provided to Result screen');
      Alert.alert('Error', 'No subject data found for calculation');
    }
  }, [currentUser, route.params]);

  // Start pulse animation when result is calculated
  useEffect(() => {
    if (calculationResult) {
      startPulse();
      setMotivation(calculationResult.gpa);
      setGradeClassification(calculationResult.gpa);
    }
  }, [calculationResult]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const setGradeClassification = (cgpaValue) => {
    if (cgpaValue >= 9.0) {
      setGradeInfo({ grade: 'S', color: '#10b981' });
    } else if (cgpaValue >= 8.0) {
      setGradeInfo({ grade: 'A', color: '#059669' });
    } else if (cgpaValue >= 7.0) {
      setGradeInfo({ grade: 'B', color: '#0d9488' });
    } else if (cgpaValue >= 6.0) {
      setGradeInfo({ grade: 'C', color: '#0891b2' });
    } else if (cgpaValue >= 5.0) {
      setGradeInfo({ grade: 'D', color: '#0284c7' });
    } else if (cgpaValue >= 4.0) {
      setGradeInfo({ grade: 'E', color: '#dc6803' });
    } else {
      setGradeInfo({ grade: 'F', color: '#991b1b' });
    }
  };

  const setMotivation = (cgpaValue) => {
    if (cgpaValue >= 9.5) {
      setMessage('🔥 Absolutely Outstanding! You\'re destined for greatness!');
      setEmoji('👑');
    } else if (cgpaValue >= 9) {
      setMessage('⭐ Exceptional performance! You\'re built for success!');
      setEmoji('🏆');
    } else if (cgpaValue >= 8.5) {
      setMessage('🌟 Excellent work! Keep shining bright!');
      setEmoji('✨');
    } else if (cgpaValue >= 8) {
      setMessage('🎉 Great job! Your hard work is paying off!');
      setEmoji('🎊');
    } else if (cgpaValue >= 7.5) {
      setMessage('🚀 You\'re doing great! Aim even higher!');
      setEmoji('🌈');
    } else if (cgpaValue >= 7) {
      setMessage('💫 Good progress! You\'re one step away from brilliance!');
      setEmoji('⭐');
    } else if (cgpaValue >= 6.5) {
      setMessage('💪 Keep pushing! Your potential is unlimited!');
      setEmoji('🔥');
    } else if (cgpaValue >= 6) {
      setMessage('🌱 Stay determined! Growth is a journey!');
      setEmoji('💪');
    } else if (cgpaValue >= 5) {
      setMessage('📈 Every step counts! Keep moving forward!');
      setEmoji('🌟');
    } else if (cgpaValue >= 3) {
      setMessage('🌱 Growth takes time. Believe in your journey!');
      setEmoji('📈');
    } else if (cgpaValue >= 1) {
      setMessage('💪 Don\'t give up! Every expert was once a beginner!');
      setEmoji('🔥');
    } else {
      setMessage('🚀 Your journey starts now! Believe in yourself!');
      setEmoji('🌟');
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadCustomSubjects = async (semester, department) => {
    try {
      if (!currentUser) return;
      const subjects = await CustomSubjectService.getCustomSubjectsBySemester(
        currentUser.id,
        semester,
        department
      );
      // calculate result from stored custom subjects; do not render per-subject UI here
      calculateCustomResult(Array.from(subjects));
    } catch (error) {
      console.error('Error loading custom subjects:', error);
    }
  };

  const calculateDepartmentResult = (subjects, semester, department) => {
    try {
      if (!subjects || !Array.isArray(subjects)) {
        console.error('Invalid subjects data:', subjects);
        Alert.alert('Error', 'No subject data found for calculation');
        return;
      }

      const result = ResultService.calculateUniversalGPA(subjects);
      const gradeColor = ResultService.getGradeColor(result.grade);

      setCalculationResult({
        ...result,
        semester,
        department,
        isCustom: false,
        grade: result.grade,
        gradeColor: gradeColor
      });

      console.log('✅ Department result calculated successfully:', result);
    } catch (error) {
      console.error('❌ Error calculating department result:', error);
      Alert.alert('Calculation Error', 'Failed to calculate department result');
    }
  };

  const calculateCustomResult = (subjects) => {
    try {
      if (!subjects || !Array.isArray(subjects)) {
        console.error('Invalid custom subjects data:', subjects);
        Alert.alert('Error', 'No custom subject data found for calculation');
        return;
      }

      const result = ResultService.calculateUniversalGPA(subjects);
      const gradeColor = ResultService.getGradeColor(result.grade);

      setCalculationResult({
        ...result,
        semester: currentSemester,
        department: currentDepartment,
        isCustom: true,
        grade: result.grade,
        gradeColor: gradeColor,
        subjects: subjects
      });

      console.log('✅ Custom result calculated successfully:', result);
    } catch (error) {
      console.error('❌ Error calculating custom result:', error);
      Alert.alert('Calculation Error', 'Failed to calculate custom result');
    }
  };



  const saveResult = async () => {
    try {
      if (!calculationResult || !currentUser) {
        Alert.alert('Error', 'No result to save or user not found');
        return;
      }

      const resultData = {
        userId: currentUser.id,
        value: calculationResult.gpa,
        semester: calculationResult.semester,
        department: calculationResult.department,
        totalSubjects: calculationResult.totalSubjects,
        isCustom: calculationResult.isCustom,
        grade: calculationResult.grade,
        gradeColor: calculationResult.gradeColor,
        subjects: calculationResult.subjects || route.params.historySubjects // Pass full subject data
      };

      await ResultService.saveResult(resultData);
      setSaved(true);

      // Navigate back to Dashboard after a brief delay so the user sees the "Saved" state
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error saving result:', error);
      Alert.alert('Error', 'Failed to save result');
    }
  };



  const calculatePercentage = (cgpaValue) => {
    return ((cgpaValue * 10) - 7.5).toFixed(1);
  };

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!calculationResult) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Calculating result...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#232867" />
      <LinearGradient
        colors={['#4facfe', '#f0f8ff', '#e6f2ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Department and Semester Display */}
            <View style={styles.infoContainer}>
              {currentDepartment && (
                <Text style={styles.departmentText}>
                  {currentDepartment === 'CSE' ? 'Computer Science Engineering' :
                    currentDepartment === 'IT' ? 'Information Technology' :
                      currentDepartment === 'EEE' ? 'Electrical & Electronics Engineering' :
                        currentDepartment}
                </Text>
              )}
              <Text style={styles.heading}>
                {calculationResult.isCustom ? 'CUSTOM SUBJECTS' : `SEMESTER ${currentSemester}`}
              </Text>
              <Text style={styles.cgpaText}>CGPA: {calculationResult.gpa}</Text>
              {/* Grade badge removed from Result UI per design */}
            </View>

            {/* Animated Emoji */}
            <Animated.Text
              style={[
                styles.emoji,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {emoji}
            </Animated.Text>

            {/* Motivation Message */}
            <View style={styles.messageBox}>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Additional Info */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="book-outline" size={20} color="#232867" />
                <Text style={styles.statText}>{calculationResult.totalSubjects} Subjects</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up-outline" size={20} color="#232867" />
                <Text style={styles.statText}>{calculatePercentage(calculationResult.gpa)}%</Text>
              </View>
            </View>

            {/* Per-subject details removed from Result page */}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* Add Subject removed from Result page */}

              <TouchableOpacity onPress={saveResult} activeOpacity={0.8} disabled={saved}>
                <LinearGradient
                  colors={saved ? ['#10b981', '#059669'] : ['#232867', '#4facfe']}
                  style={styles.saveButton}
                >
                  <Ionicons name={saved ? "checkmark-circle" : "bookmark"} size={20} color="#fff" />
                  <Text style={styles.saveText}>
                    {saved ? 'Saved!' : 'Save to History'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Success Message - Only shows briefly before redirect */}
            {saved && (
              <View style={styles.successContainer}>
                <Text style={styles.saveMsg}>✅ CGPA Saved Successfully!</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Add Subject modal removed from Result screen */}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#232867',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    minHeight: height,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  departmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
    marginBottom: 8,
    textAlign: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#232867',
    marginBottom: 12,
    textAlign: 'center',
  },
  cgpaText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#232867',
    marginBottom: 16,
    textAlign: 'center',
  },
  gradeBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 8,
  },
  gradeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emoji: {
    fontSize: 80,
    marginVertical: 20,
    textShadowColor: 'rgba(212, 233, 251, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: 'rgba(79,172,254,0.3)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#232867',
    fontWeight: '500',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.9,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232867',
  },
  subjectsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 16,
    width: width * 0.9,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(79,172,254,0.2)',
  },
  subjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
  },
  subjectsCount: {
    fontSize: 12,
    color: '#666',
  },
  subjectItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  subjectDetails: {
    fontSize: 12,
    color: '#666',
  },
  moreText: {
    fontSize: 12,
    color: '#4facfe',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    width: width * 0.9,
    marginBottom: 20,
    gap: 12,
  },
  saveButton: {
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    minWidth: width * 0.6,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#232867',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#232867',
    fontWeight: '600',
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    marginTop: 10,
  },
  saveMsg: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Result;