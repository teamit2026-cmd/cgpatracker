import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Expo vector icons for star icons

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animation values for engagement
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const onFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const onBlur = () => {
    setFocusedInput(null);
  };

  const handleSubmit = () => {
    console.log('Feedback submitted:', { name, email, feedback, rating });
    alert(`Thanks for your feedback and rating of ${rating} stars!`);
    setName('');
    setEmail('');
    setFeedback('');
    setRating(0);
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
          <MaterialIcons
            name={i <= rating ? 'star' : 'star-border'}
            size={36}
            color={i <= rating ? '#232867' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.header}>
            <View style={{ marginTop: 8, marginLeft: 10 }}>
              <MaterialIcons name="feedback" size={26} color="#232867" style={{ marginRight: 10 }} />
            </View>
            Feedback
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
            onFocus={() => onFocus('name')}
            onBlur={onBlur}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>

          <Text style={styles.label}>Feedback</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea, focusedInput === 'feedback' && styles.inputFocused]}
            onFocus={() => onFocus('feedback')}
            onBlur={onBlur}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Write your feedback here"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BEDFFA',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#232867',
    marginBottom: 20,
    textAlign: 'center',
  },


  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#232867',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,

  },
  star: {
    marginHorizontal: 4,
    color: '#ffbb00ff',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#232867',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#232867',
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: '#5256F1',
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#232867',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FeedbackForm;
