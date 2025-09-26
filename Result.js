import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get('window');

export default function Result() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get passed data from navigation
  const { cgpa, semester, totalSubjects, isCustom } = route.params;
  
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [saved, setSaved] = useState(false);
  const [gradeInfo, setGradeInfo] = useState({ grade: '', color: '' });

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    startPulse();
    setMotivation(cgpa);
    setGradeClassification(cgpa);
  }, [cgpa]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const setGradeClassification = (cgpaValue) => {
    if (cgpaValue >= 9.5) {
      setGradeInfo({ grade: 'O', color: '#10b981' });
    } else if (cgpaValue >= 9.0) {
      setGradeInfo({ grade: 'A+', color: '#059669' });
    } else if (cgpaValue >= 8.5) {
      setGradeInfo({ grade: 'A', color: '#0d9488' });
    } else if (cgpaValue >= 7.5) {
      setGradeInfo({ grade: 'B+', color: '#0891b2' });
    } else if (cgpaValue >= 6.5) {
      setGradeInfo({ grade: 'B', color: '#0284c7' });
    } else if (cgpaValue >= 5.5) {
      setGradeInfo({ grade: 'C', color: '#dc6803' });
    } else if (cgpaValue >= 4.5) {
      setGradeInfo({ grade: 'P', color: '#dc2626' });
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

  const saveCGPA = async () => {
    try {
      const cgpaData = {
        value: cgpa,
        semester: isCustom ? 'Custom' : semester,
        totalSubjects,
        isCustom,
        grade: gradeInfo.grade,
        timestamp: new Date().toISOString(),
        status: 'saved',
      };
      await AsyncStorage.setItem('savedCGPA', JSON.stringify(cgpaData));
      setSaved(true);
      
      // Navigate to Dashboard after a short delay
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 1500);
      
    } catch (error) {
      console.log('Error saving CGPA:', error);
    }
  };

  const calculatePercentage = (cgpaValue) => {
    return ((cgpaValue * 10) - 7.5).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000ff" />
      <LinearGradient
        colors={['#4facfe', '#f0f8ff', '#e6f2ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Semester and CGPA Display */}
          <View style={styles.infoContainer}>
            <Text style={styles.heading}>
              {isCustom ? 'CUSTOM SUBJECTS' : `SEMESTER: ${semester}`}
            </Text>
            <Text style={styles.cgpaText}>CGPA: {cgpa}</Text>
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

          {/* Save Button - Centered */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveCGPA} activeOpacity={0.8}>
              <LinearGradient
                colors={['#232867', '#4facfe']}
                style={styles.saveButton}
              >
                <Ionicons name="bookmark" size={20} color="#fff" />
                <Text style={styles.saveText}>Save Result</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Success Message */}
          {saved && (
            <Animated.View style={styles.successContainer}>
              <Text style={styles.saveMsg}>✅ CGPA Saved Successfully!</Text>
              <Text style={styles.redirectMsg}>Redirecting to Dashboard...</Text>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4facfe',
  },

  container: {
    flex: 1,
  },
  
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  cgpaText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#232867',
    marginBottom: 12,
    textAlign: 'center',
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
  
  buttonContainer: {
    alignItems: 'center',
    width: width * 0.9,
    marginBottom: 20,
  },
  
  saveButton: {
    borderRadius: 35,
    padding:20,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    // minWidth: width * 0.6,
  },
  
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  
  successContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },
  
  saveMsg: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 5,
  },
  
  redirectMsg: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    textAlign: 'center',
  },
});
