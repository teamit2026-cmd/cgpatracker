import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Keyboard,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Enhanced email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LENGTH = 100;
const MAX_FEEDBACK_LENGTH = 1000;

const FeedbackForm = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Enhanced validation
    const trimmedEmail = email.trim();
    const trimmedFeedback = feedback.trim();

    if (!trimmedEmail || !trimmedFeedback || rating === 0) {
      Alert.alert(
        'Incomplete Form',
        'Please provide your email address, a rating, and your feedback.'
      );
      return;
    }

    // Validate email format
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address (e.g., user@example.com)'
      );
      return;
    }

    // Validate email length
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      Alert.alert(
        'Email Too Long',
        `Email address cannot exceed ${MAX_EMAIL_LENGTH} characters.`
      );
      return;
    }

    // Validate feedback length
    if (trimmedFeedback.length > MAX_FEEDBACK_LENGTH) {
      Alert.alert(
        'Feedback Too Long',
        `Feedback cannot exceed ${MAX_FEEDBACK_LENGTH} characters.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Improved network check
      let isOnline = true;
      try {
        await fetch('https://www.google.com', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
      } catch (networkError) {
        isOnline = false;
      }

      if (!isOnline) {
        Alert.alert(
          'No Internet Connection',
          'Please connect to the internet to send your feedback.'
        );
        setIsSubmitting(false);
        return;
      }

      const recipientEmail = 'team.it.2026@gmail.com';
      const subject = `Feedback: PKIET CGPA Tracker - ${trimmedEmail}`;
      const mailBody = `Feedback from PKIET CGPA Tracker\n\nUser Email: ${trimmedEmail}\nRating: ${'⭐'.repeat(rating)} (${rating}/5)\n\nMessage:\n${trimmedFeedback}`;

      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      let canOpenEmail = false;
      try {
        canOpenEmail = await Linking.canOpenURL(mailtoUrl);
      } catch (linkError) {
        console.error('Error checking mailto support:', linkError);
        canOpenEmail = false;
      }

      if (canOpenEmail) {
        try {
          await Linking.openURL(mailtoUrl);
          setEmail('');
          setFeedback('');
          setRating(0);
          Alert.alert('Success', 'Email client opened. Please send your feedback.');
        } catch (openError) {
          console.error('Error opening email client:', openError);
          Alert.alert(
            'Error',
            `Could not open email client. Please contact us manually at: ${recipientEmail}`
          );
        }
      } else {
        Alert.alert(
          'Mail App Not Found',
          'Please contact us manually at: ' + recipientEmail
        );
      }
    } catch (error) {
      console.error('Feedback Submission Error:', error);
      Alert.alert(
        'Processing Error',
        'Something went wrong while processing your feedback. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          activeOpacity={0.7}
          style={styles.starTouch}
        >
          <MaterialIcons
            name={i <= rating ? 'star' : 'star-border'}
            size={40}
            color={i <= rating ? '#232867' : '#94a3b8'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#BEDFFA" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 80 }} />
          <View style={styles.formCard}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="feedback" size={30} color="#fff" />
              </View>
              <Text style={styles.title}>Send Feedback</Text>
              <Text style={styles.subtitle}>We value your suggestions</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  maxLength={100}
                />
              </View>
            </View>

            <View style={styles.ratingGroup}>
              <Text style={styles.label}>Rate our App</Text>
              <View style={styles.stars}>{renderStars()}</View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Message</Text>
              <TextInput
                style={styles.textArea}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Tell us what you think..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Feedback</Text>
              )}
            </TouchableOpacity>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                <Text style={styles.noteBold}>NOTE:</Text> any queries contact to this mail team.it.2026@gmail.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: '#BEDFFA',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  iconCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#232867',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232867',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#1e293b',
    fontSize: 16,
  },
  ratingGroup: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 5,
  },
  starTouch: {
    padding: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    height: 120,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    color: '#1e293b',
  },
  submitBtn: {
    backgroundColor: '#232867',
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContainer: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  noteText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  noteBold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default FeedbackForm;
