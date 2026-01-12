import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import HexonyxFooter from './components/HexonyxFooter';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;

const DEVELOPER_MESSAGES = [
  {
    name: 'Loguesvaran',
    role: 'Tech Innovator',
    message: 'Dedicated to providing the best tracking experience for PKIETians.',
    color: '#232867',
    gradient: ['#ffffff', '#e3f2fd'],
    avatar: '👨‍💻',
    rating: 5,
  },
  {
    name: 'Dhanush',
    role: 'Lead Architect',
    message: 'Focusing on clean code and accurate calculations for every department.',
    color: '#232867',
    gradient: ['#ffffff', '#e3f2fd'],
    avatar: '🚀',
    rating: 5,
  },
  {
    name: 'Keerthikeshan',
    role: 'Backend Architect',
    message: 'We aim to make academic progress tracking seamless and efficient.',
    color: '#232867',
    gradient: ['#ffffff', '#e3f2fd'],
    avatar: '🎨',
    rating: 5,
  },
  {
    name: 'Krishnarajan',
    role: 'UI/UX Designer',
    message: 'Innovation in education through technology is our core mission.',
    color: '#232867',
    gradient: ['#ffffff', '#e3f2fd'],
    avatar: '💡',
    rating: 5,
  },
  {
    name: 'Barath',
    role: 'Logic Specialist',
    message: 'Helping students stay ahead with real-time GCPA insights.',
    color: '#232867',
    gradient: ['#ffffff', '#e3f2fd'],
    avatar: '📊',
    rating: 5,
  },
];

// Get proper status bar height for different platforms
const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  return Constants.statusBarHeight || 44;
};

const Dashboard = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(
    DEVELOPER_MESSAGES.map(() => new Animated.Value(0))
  ).current;

  // StatusBar setup (global)
  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#ffffff', true);
      StatusBar.setTranslucent(false);
    }
  }, []);

  // Back button handler - active only when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (menuVisible) {
          setMenuVisible(false);
          return true; // handled here: close menu
        }
        if (profileVisible) {
          setProfileVisible(false);
          return true; // handled here: close profile dropdown
        }

        BackHandler.exitApp(); // exit app if no modals open
        return true; // prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove(); // cleanup when screen loses focus
    }, [menuVisible, profileVisible])
  );

  const navigateTo = (screen) => {
    setMenuVisible(false);
    setProfileVisible(false);

    switch (screen) {
      case 'About':
      case 'Feedback':
      case 'Privacy':
      case 'CGPAProgressAnalysis':
      case 'PrivacyPolicy':
      case 'ViewProfile':
      case 'CGPACalculator':
      case 'Download':
      case 'Syllabus':
        navigation.navigate(screen);
        break;
      case 'Logout':
        alert('Logout functionality to be implemented');
        break;
      default:
        alert(`Navigate to: ${screen}`);
        break;
    }
  };

  const WelcomeSection = ({ userName }) => {
    const waveAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation, {
            toValue: 0,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [waveAnimation]);

    const waveInterpolate = waveAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '20deg'],
    });

    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.textContainer}>
          <View style={styles.greetingRow}>
            <Text style={styles.welcomeText}>Welcome , </Text>
            <Animated.Text
              style={[
                styles.wavingHand,
                { transform: [{ rotate: waveInterpolate }] },
              ]}
            >
              👋
            </Animated.Text>
          </View>
          <Text style={styles.welcomeSubtitle}>
            Ready to check your{' '}
            <Text style={styles.highlight}>CGPA progress</Text> today?
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2919/2919600.png',
          }}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />

      {/* Fixed Navigation Bar */}
      <SafeAreaView>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.navButton}
          >
            <MaterialIcons name="menu" size={24} color="#232867" />
          </TouchableOpacity>

          <View style={styles.navTitleContainer}>
            <Ionicons
              name="school"
              size={24}
              color="#64b5f6"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.navTitle}>PKIET CGPA Tracker</Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setProfileVisible(!profileVisible)}
          >
            <Ionicons name="person-circle" size={24} color="#232867" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <WelcomeSection userName="Robert" />

        {/* Dashboard Cards */}
        <View style={styles.content}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('CGPACalculator')}
            >
              <MaterialIcons name="calculate" size={40} color="#fff" />
              <Text style={styles.cardTitle}>CGPA Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('CGPAProgressAnalysis')}
            >
              <Ionicons name="stats-chart-outline" size={40} color="#fff" />
              <Text style={styles.cardTitle}>CGPA Progress Analysis</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('Syllabus')}
            >
              <MaterialIcons name="menu-book" size={40} color="#fff" />
              <Text style={styles.cardTitle}>Syllabus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('Download')}
            >
              <MaterialIcons name="download" size={40} color="#fff" />
              <Text style={styles.cardTitle}>Export as PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Messages and Reviews Section */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>Developer's Messages & Reviews</Text>
                {/* <Text style={styles.sectionSubtitle}>From our development team</Text> */}
              </View>
              <View style={styles.cardIndicatorContainer}>
                {DEVELOPER_MESSAGES.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.cardIndicator,
                      activeCardIndex === index && styles.cardIndicatorActive,
                    ]}
                  />
                ))}
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}
              contentContainerStyle={styles.reviewList}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                  listener: (event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / (CARD_WIDTH + 16));
                    setActiveCardIndex(index);
                  },
                }
              )}
              scrollEventThrottle={16}
            >
              {DEVELOPER_MESSAGES.map((msg, index) => {
                const inputRange = [
                  (index - 1) * CARD_WIDTH,
                  index * CARD_WIDTH,
                  (index + 1) * CARD_WIDTH,
                ];

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.9, 1, 0.9],
                  extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.6, 1, 0.6],
                  extrapolate: 'clamp',
                });

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.95}
                    onPressIn={() => {
                      Animated.spring(cardAnimations[index], {
                        toValue: 1,
                        useNativeDriver: true,
                        friction: 3,
                      }).start();
                    }}
                    onPressOut={() => {
                      Animated.spring(cardAnimations[index], {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 3,
                      }).start();
                    }}
                  >
                    <Animated.View
                      style={[
                        styles.reviewCard,
                        {
                          transform: [
                            { scale },
                            {
                              scale: cardAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.97],
                              }),
                            },
                          ],
                          opacity,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={[...msg.gradient, msg.gradient[0]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBackground}
                      >
                        {/* Decorative Elements */}
                        <View style={styles.decorativeCircle1} />
                        <View style={styles.decorativeCircle2} />

                        {/* Avatar Badge */}
                        <View style={styles.avatarContainer}>
                          <View style={[styles.avatarBadge, { borderColor: msg.color }]}>
                            <Text style={styles.avatarEmoji}>{msg.avatar}</Text>
                          </View>
                          <View style={styles.avatarInfo}>
                            <Text style={styles.developerName}>{msg.name}</Text>
                            <Text style={styles.developerRole}>{msg.role}</Text>
                          </View>
                        </View>

                        {/* Message Content */}
                        <View style={styles.messageContainer}>
                          <MaterialIcons
                            name="format-quote"
                            size={28}
                            color="rgba(35, 40, 103, 0.15)"
                            style={styles.quoteIconTop}
                          />
                          <Text style={styles.reviewText}>{msg.message}</Text>
                          <MaterialIcons
                            name="format-quote"
                            size={28}
                            color="rgba(35, 40, 103, 0.15)"
                            style={styles.quoteIconBottom}
                          />
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <HexonyxFooter />
      </View>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('About')}
            >
              <Entypo name="info-with-circle" size={18} color="#232867" />
              <Text style={styles.menuText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('Feedback')}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={18}
                color="#232867"
              />
              <Text style={styles.menuText}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('Privacy')}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#232867"
              />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Dropdown Modal */}
      <Modal
        transparent={true}
        visible={profileVisible}
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setProfileVisible(false)}
        >
          <View style={[styles.menu, styles.profileMenu]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('ViewProfile')}
            >
              <Ionicons name="person-outline" size={18} color="#232867" />
              <Text style={styles.menuText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12, // Responsive vertical padding
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  navTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  navTitle: {
    color: '#232867',
    fontWeight: 'bold',
    fontSize: 18,
  },

  contentArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#232867',
    shadowColor: '#4646ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  wavingHand: {
    fontSize: 26,
  },

  welcomeSubtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#dcdcff',
    lineHeight: 22,
  },

  highlight: {
    fontWeight: '800',
    color: '#fff',
    textDecorationLine: 'underline',
  },

  iconImage: {
    width: 85,
    height: 85,
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    paddingTop: 56, // Height of navbar
  },

  menu: {
    position: 'absolute',
    top: 56,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: width * 0.45,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  profileMenu: {
    right: 16,
    left: undefined,
    minWidth: width * 0.42,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  menuText: {
    color: '#232867',
    fontSize: 15,
    marginLeft: 12,
    fontWeight: '500',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#232867',
    borderRadius: 16,
    paddingVertical: 35,
    paddingHorizontal: 18,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 130,
    justifyContent: 'center',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },

  // Review Section Styles
  reviewSection: {
    marginTop: 0,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#232867',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64b5f6',
    marginTop: 1,
  },
  cardIndicatorContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  cardIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  cardIndicatorActive: {
    backgroundColor: '#64b5f6',
    width: 24,
  },
  reviewList: {
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 2,
  },
  reviewCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientBackground: {
    padding: 12,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 181, 246, 0.1)',
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(35, 40, 103, 0.05)',
    bottom: -15,
    left: -15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  avatarInfo: {
    marginLeft: 8,
    flex: 1,
  },
  developerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#232867',
  },
  developerRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
  messageContainer: {
    backgroundColor: 'rgba(100, 181, 246, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.2)',
    zIndex: 2,
  },
  quoteIconTop: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  quoteIconBottom: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    transform: [{ rotate: '180deg' }],
  },
  reviewText: {
    color: '#232867',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
