import React, { useState } from 'react';
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
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Preview Card Component (embedded)
const PreviewCard = ({ subject, onRemove }) => (
  <View style={styles.previewCard}>
    <View style={styles.previewContent}>
      <Text style={styles.previewName}>{subject.name}</Text>
      <Text style={styles.previewDetails}>{subject.code} • {subject.credits} credits</Text>
    </View>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={styles.removeButtonText}>X</Text>
    </TouchableOpacity>
  </View>
);

// Grade Selection Card Component (embedded)
const GradeCard = ({ subject, selectedGrade, onGradeChange, gradeOptions }) => (
  <View style={styles.gradeCard}>
    <View style={styles.subjectInfo}>
      <Text style={styles.subjectName}>{subject.name}</Text>
      <Text style={styles.subjectDetails}>{subject.code} • {subject.credits} credits</Text>
    </View>
    <View style={styles.gradeButtonsContainer}>
      {gradeOptions.map((grade) => (
        <TouchableOpacity
          key={grade}
          style={[
            styles.gradeButton,
            selectedGrade === grade && styles.gradeButtonSelected
          ]}
          onPress={() => onGradeChange(grade)}>
          <Text style={[
            styles.gradeButtonText,
            selectedGrade === grade && styles.gradeButtonTextSelected
          ]}>
            {grade}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Main Combined Component
export default function CombinedCGPATracker() {
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
  // Fixed: Moved isSaved to top level to fix hooks error
  const [isSaved, setIsSaved] = useState(false);
  // Grade points mapping
  const gradePoints = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0,
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
      code: currentSubject.code,
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
    setGrades({
      ...grades,
      [subjectId]: grade,
    });
  };

  // Calculate CGPA function
  const calculateCGPA = () => {
    const subjectsWithoutGrades = subjects.filter(subject => !grades[subject.id]);
    if (subjectsWithoutGrades.length > 0) {
      Alert.alert(
        'Missing Grades',
        `Please select grades for all subjects. Missing: ${subjectsWithoutGrades.map(s => s.name).join(', ')}`
      );
      return;
    }
    setCurrentScreen('results');
  };

  // Reset all data
  const resetData = () => {
    setSubjects([]);
    setCurrentSubject({ name: '', code: '', credits: '' });
    setGrades({});
    setCurrentScreen('input');
    setIsSaved(false);
  };

  // Calculate current CGPA for results
  const calculateCurrentCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(subject => {
      const grade = grades[subject.id];
      const points = gradePoints[grade];
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
      case 'results':
        title = 'CGPA Results';
        subtitle = 'Your academic performance summary';
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
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.scrollContent}>
        <View style={styles.screenContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Subject Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject Name"
              value={currentSubject.name}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, name: text })}
              placeholderTextColor="#555555ff" // Set your preferred color here
            />

            <TextInput
              style={styles.input}
              placeholder="Subject Code"
              value={currentSubject.code}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, code: text })}
              placeholderTextColor="#555555ff" 
            />
            <TextInput
              style={styles.input}
              placeholder="Credits"
              value={currentSubject.credits}
              onChangeText={(text) => setCurrentSubject({ ...currentSubject, credits: text })}
              keyboardType="numeric"
              placeholderTextColor="#555555ff" 
            />
            <TouchableOpacity style={styles.addButton} onPress={addSubject}>
              <FontAwesome5 name="plus" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Add Subject</Text>
            </TouchableOpacity>
          </View>
          {subjects.length > 0 && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionTitle}>Preview ({subjects.length} subjects)</Text>
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
              />
              <TouchableOpacity style={styles.proceedButton} onPress={proceedToGrades}>
                <FontAwesome5 name="arrow-right" size={16} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.proceedButtonText}>Proceed to Grade Selection</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );

  // Grade Selection Screen Content
  const renderGradeSelection = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.scrollContent}>
        <View style={styles.screenContent}>
          <View style={styles.subjectsContainer}>
            {subjects.map((subject) => (
              <GradeCard
                key={subject.id}
                subject={subject}
                selectedGrade={grades[subject.id]}
                onGradeChange={(grade) => updateGrade(subject.id, grade)}
                gradeOptions={Object.keys(gradePoints)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateCGPA}>
            <FontAwesome5 name="calculator" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.calculateButtonText}>Calculate CGPA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Results Screen Content - Gradient background only
  const renderResults = () => {
    const cgpa = calculateCurrentCGPA();
    const renderFloatingElements = () => (
      <View style={celebratoryStyles.floatingContainer}>
        <View style={[celebratoryStyles.floatingElement, { top: '15%', left: '25%' }]}>
          <FontAwesome5 name="star" size={12} color="#FFD700" />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '20%', right: '20%' }]}>
          <FontAwesome5 name="star" size={10} color="#FF69B4" />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '35%', left: '15%' }]}>
          <View style={[celebratoryStyles.diamond, { backgroundColor: '#00CED1' }]} />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '25%', right: '30%' }]}>
          <View style={[celebratoryStyles.diamond, { backgroundColor: '#FFD700' }]} />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '30%', left: '35%' }]}>
          <FontAwesome5 name="star" size={8} color="#00CED1" />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '40%', right: '25%' }]}>
          <View style={[celebratoryStyles.diamond, { backgroundColor: '#FF69B4' }]} />
        </View>
        <View style={[celebratoryStyles.floatingElement, { top: '65%', left: '20%' }]}>
          <FontAwesome5 name="star" size={14} color="#FFD700" />
        </View>
      </View>
    );

    return (
      <LinearGradient
        colors={['#78c8e7ff', '#d5e8ebff', '#e9f3f7ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={celebratoryStyles.gradientContainer}
      >
        {renderFloatingElements()}
        <View style={celebratoryStyles.contentContainer}>
          {/* Semester Display */}
          <Text style={celebratoryStyles.semesterText}>
            Custom Subject CGPA
          </Text>
          {/* CGPA Display */}
          <Text style={celebratoryStyles.cgpaText}>
            CGPA: {cgpa}
          </Text>
          {/* Congratulatory Message */}
          <View style={celebratoryStyles.messageContainer}>
            <FontAwesome5 name="trophy" size={22} color="#FFD700" style={celebratoryStyles.trophyIcon} />
            <Text style={celebratoryStyles.congratsMessage}>
              Great job! Your hard work is paying off!
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  // Apply gradient background to all screens
  if (currentScreen === 'results') {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        {renderResults()}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.containerTransparent}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      {renderHeader()}
      {currentScreen === 'input' && renderSubjectInput()}
      {currentScreen === 'grades' && renderGradeSelection()}
    </SafeAreaView>
  );
}

// --- styles objects (styles and celebratoryStyles) remain unchanged from your snippet above ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  containerTransparent: {
    flex: 1,
    backgroundColor: 'transparent',
    backgroundColor: '#BEDFFA',
  },
  headerContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#3a4285',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  navigationButtons: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  screenContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#232867',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#232867',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
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
  proceedButton: {
    backgroundColor: '#28A745',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subjectsContainer: {
    marginBottom: 30,
  },
  gradeCard: {
    backgroundColor: 'rgba(35, 40, 103, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectInfo: {
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 21,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  subjectDetails: {
    fontSize: 15,
    color: '#BEDFFA',
  },
  gradeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  gradeButton: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  gradeButtonSelected: {
    backgroundColor: '#232867',
    borderRadius: 25,
    borderColor: 'cyan',
    borderWidth: 2,
  },
  gradeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#232867',
  },
  gradeButtonTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  calculateButton: {
    backgroundColor: 'rgba(35, 40, 103, 0.95)',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


// Fixed Celebratory Styles - Gradient only
const celebratoryStyles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  floatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  diamond: {
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
  },
  jellyfishContainer: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    zIndex: 2,
  },
  jellyfish: {
    alignItems: 'center',
  },
  leftJellyfish: {
    marginLeft: -20,
  },
  rightJellyfish: {
    marginRight: -20,
  },
  jellyfishHead: {
    width: 50,
    height: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  jellyfishTentacles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 50,
    marginTop: -5,
  },
  tentacle: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  contentContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  semesterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 20,
    letterSpacing: 1,
  },
  cgpaText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 40,
    letterSpacing: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
    marginTop: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '90%',
  },
  trophyIcon: {
    marginRight: 10,
  },
  congratsMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
});
