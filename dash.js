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
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
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
              onPress={() => navigateTo('Share')}
            >
              <MaterialIcons name="share" size={40} color="#fff" />
              <Text style={styles.cardTitle}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateTo('Download')}
            >
              <MaterialIcons name="download" size={40} color="#fff" />
              <Text style={styles.cardTitle}>Export as PDF</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingBottom: 30,
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#232867',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 18,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 140,
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
});
