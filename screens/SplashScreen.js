import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Add this import

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  const navigation = useNavigation(); // Add navigation hook
  
  // Animation values
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const backgroundGradient = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  
  // Text animation state
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'CGPA Tracker';
  
  // Individual character animations
  const charAnimations = useRef(
    Array.from({ length: fullText.length }, () => new Animated.Value(0))
  ).current;
  
  // Glow animation
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();

    return () => {
      containerOpacity.stopAnimation();
      logoScale.stopAnimation();
      fadeOut.stopAnimation();
      charAnimations.forEach(anim => anim.stopAnimation());
      particleAnim.stopAnimation();
      glowAnim.stopAnimation();
      progress.stopAnimation();
    };
  }, []);

  const startAnimation = () => {
    // Background gradient animation
    Animated.timing(backgroundGradient, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Container fade & scale in
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle rotation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulsing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate text appearance
    setTimeout(() => {
      animateText();
    }, 800);

    // Fade out and navigate to Auth screen
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Call the callback if provided
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        // Navigate to Auth screen after animation completes
        navigation.replace('Auth');
      });
    }, 4500);
  };

  const animateText = () => {
    charAnimations.forEach((anim, i) => {
      setTimeout(() => {
        setDisplayText(fullText.slice(0, i + 1));
        setCurrentIndex(i);
        Animated.sequence([
          Animated.spring(anim, {
            toValue: 1.3,
            tension: 120,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.spring(anim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, i * 150);
    });
  };

  const interpolatedBackground = backgroundGradient.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1a1a2e', '#16213e'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: interpolatedBackground },
        ]}
      />

      {/* Particle Layer */}
      <Animated.View
        style={[
          styles.particleContainer,
          {
            opacity: particleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            transform: [
              {
                rotate: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: Animated.multiply(containerOpacity, fadeOut),
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.textContainer,
            {
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
            },
          ]}
        >
          <View style={styles.handwritingWrapper}>
            {fullText.split('').map((char, i) => (
              <Animated.Text
                key={i}
                style={[
                  styles.handwritingChar,
                  char === ' ' ? styles.spaceChar : {},
                  {
                    opacity: i <= currentIndex ? 1 : 0,
                    transform: [
                      {
                        scale: charAnimations[i]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }) || 0.3,
                      },
                      {
                        translateY: charAnimations[i]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }) || 30,
                      },
                      {
                        rotateZ: charAnimations[i]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['5deg', '0deg'],
                        }) || '5deg',
                      },
                    ],
                  },
                ]}
              >
                {char}
              </Animated.Text>
            ))}
          </View>
          <Animated.View
            style={[
              styles.underline,
              {
                width: 200,
                opacity: containerOpacity,
              },
            ]}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: containerOpacity,
              transform: [
                {
                  translateY: containerOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }), 
                },
              ],
            },
          ]}
        >
          Developed by Team Hexonyx.
        </Animated.Text>
      </Animated.View>

      {/* Loading bar container */}
      <Animated.View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              transform: [
                {
                  scaleX: progress,
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

// Keep all your existing styles - they're perfect!
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64b5f6',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 15,
  },
  handwritingWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  handwritingChar: {
    fontSize: Platform.OS === 'ios' ? 58 : 52,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'sans-serif-condensed',
    textShadowColor: '#64b5f6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  spaceChar: { width: 20 },
  underline: { height: 3, backgroundColor: '#64b5f6', marginTop: 10, borderRadius: 2 },
  tagline: {
    fontSize: 16,
    color: '#b3e5fc',
    fontWeight: '400',
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
  },
  particleContainer: { position: 'absolute', width: screenWidth, height: screenHeight },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#64b5f6',
    borderRadius: 2,
    opacity: 0.6,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    position: 'absolute',
    height: '100%',
    width: 100,
    backgroundColor: '#64b5f6',
    borderRadius: 2,
    transformOrigin: 'left',
  },
});

export default SplashScreen;
