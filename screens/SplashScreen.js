import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  useWindowDimensions,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const SplashScreen = ({ onAnimationComplete, isDatabaseReady, databaseError }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();

  // States for logic
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [showError, setShowError] = useState(false);

  // Animation values
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  // Removed backgroundAnim color interpolation to fix lag (requires JS driver)
  const fadeOut = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Text animation state
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'CGPA Tracker';

  const charAnimations = useRef(
    Array.from({ length: fullText.length }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Start initial animations
    startEntranceAnimation();

    // Minimum wait time
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500);

    // Maximum wait time - show error if database failed after 15 seconds
    const maxTimer = setTimeout(() => {
      if (databaseError) {
        console.error('⚠️ Database error detected, showing error screen');
        setShowError(true);
      } else if (!isDatabaseReady) {
        console.warn('⚠️ Maximum splash wait time exceeded, forcing navigation');
        if (!animationFinished) {
          finishLoadingAndExit();
        }
      }
    }, 15000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  // Watch for readiness to exit
  useEffect(() => {
    // Don't navigate if there's a database error
    if (databaseError) {
      setShowError(true);
      return;
    }

    if (minTimeElapsed && isDatabaseReady && !animationFinished) {
      finishLoadingAndExit();
    }
  }, [minTimeElapsed, isDatabaseReady, databaseError, animationFinished]);

  const startEntranceAnimation = () => {
    // Container, Logo, Text
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Progress bar slow start
      Animated.timing(progress, {
        toValue: 0.7,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Particles - Smooth loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(particleAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Glow - Smooth loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Text typing effect
    setTimeout(() => {
      animateText();
    }, 500);
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
      }, i * 100);
    });
  };

  const finishLoadingAndExit = () => {
    setAnimationFinished(true);

    // 1. Finish progress bar fast
    Animated.timing(progress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // 2. Fade out everything
      Animated.parallel([
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onAnimationComplete) onAnimationComplete();
        navigation.replace('Dashboard');
      });
    });
  };

  // Show error screen if database initialization failed
  if (showError && databaseError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a1a2e' }]} />

        <View style={styles.content}>
          <MaterialIcons name="error-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorTitle}>Database Error</Text>
          <Text style={styles.errorMessage}>
            {databaseError}
          </Text>
          <Text style={styles.errorHint}>
            Please try restarting the app. If the problem persists, try reinstalling the application.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              console.log('User requested app restart');
              setShowError(false);
              // User should manually restart the app
              // On production, you might want to use expo-updates or similar
            }}
          >
            <Text style={styles.retryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Background is now static color to avoid JS-driver lag */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a1a2e' }]} />

      {/* Particles */}
      <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
        <Animated.View
          style={[
            styles.particleContainer,
            {
              width: screenWidth,
              height: screenHeight,
              opacity: particleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }),
            },
          ]}
        >
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>

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

      {/* Loading Bar */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeOut }]}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              transform: [{ scaleX: progress }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  content: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64b5f6', // Light Blue shadow
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
    fontSize: Platform.OS === 'ios' ? 48 : 42,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'sans-serif-condensed',
    textShadowColor: '#64b5f6', // Light Blue Glow
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  spaceChar: { width: 20 },
  underline: {
    height: 3,
    backgroundColor: '#64b5f6', // Light Blue
    marginTop: 10,
    borderRadius: 2,
    shadowColor: '#64b5f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#b3e5fc', // Light Blue text
    fontWeight: '400',
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
  },
  particleContainer: { position: 'absolute' },
  particle: {
    position: 'absolute',
    backgroundColor: '#64b5f6', // Light Blue particles
    borderRadius: 50,
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
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#64b5f6', // Light Blue
    borderRadius: 2,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6b6b',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#b3e5fc',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 15,
    lineHeight: 24,
  },
  errorHint: {
    fontSize: 13,
    color: '#87ceeb',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#64b5f6',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#64b5f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default SplashScreen;
