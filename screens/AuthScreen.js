import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regno, setRegno] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Visibility toggles
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  
  // Icon press states
  const [iconPressed, setIconPressed] = useState({ google: false, linkedin: false });
  
  // Password strength state
  const [strengthPercent, setStrengthPercent] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Password strength');
  const [strengthColor, setStrengthColor] = useState('#999');
  const [showStrength, setShowStrength] = useState(false);
  
  // Password requirements checklist state
  const [checks, setChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  
  // Loading states
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Notifications and messages
  const [notification, setNotification] = useState(null);
  const [signupMessage, setSignupMessage] = useState({ text: '', type: '' });
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' });
  
  // Simplified animations
  const notificationAnim = useRef(new Animated.Value(-100)).current;
  
  // Add forgot password handler
  const handleForgotPassword = () => {
    navigation.navigate('OtpScreen', { email: loginEmail });
  };
  
  // Notification animation
  useEffect(() => {
    if (notification) {
      Animated.sequence([
        Animated.spring(notificationAnim, {
          toValue: Platform.OS === 'android' ? 60 : 90,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.delay(3000),
        Animated.spring(notificationAnim, {
          toValue: -100,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
      ]).start(() => {
        setNotification(null);
        setIconPressed({ google: false, linkedin: false });
      });
    }
  }, [notification]);
  
  // Password strength logic
  useEffect(() => {
    if (password.length === 0) {
      setShowStrength(false);
      return;
    }
    setShowStrength(true);
    const lengthCheck = password.length >= 8;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /\d/.test(password);
    const specialCheck = /[^a-zA-Z0-9]/.test(password);
    
    setChecks({
      length: lengthCheck,
      lowercase: lowercaseCheck,
      uppercase: uppercaseCheck,
      number: numberCheck,
      special: specialCheck,
    });
    
    let strength = 0;
    if (lengthCheck) strength += 20;
    if (lowercaseCheck) strength += 20;
    if (uppercaseCheck) strength += 20;
    if (numberCheck) strength += 20;
    if (specialCheck) strength += 20;
    
    setStrengthPercent(strength);
    
    if (strength < 40) {
      setStrengthLabel('Weak');
      setStrengthColor('#ff6b6b');
    } else if (strength < 80) {
      setStrengthLabel('Good');
      setStrengthColor('#ffa726');
    } else {
      setStrengthLabel('Strong');
      setStrengthColor('#66bb6a');
    }
  }, [password]);
  
  // Utility functions
  const isValidEmail = (mail) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(mail);
  };
  
  // Notifications handler
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  const showFormMessage = (form, message, type) => {
    if (form === 'signup') {
      setSignupMessage({ text: message, type });
    } else {
      setLoginMessage({ text: message, type });
    }
  };
  
  const clearFormMessage = (form) => {
    if (form === 'signup') {
      setSignupMessage({ text: '', type: '' });
    } else {
      setLoginMessage({ text: '', type: '' });
    }
  };
  
  // Form clearing functions
  const clearSignUpForm = () => {
    setName('');
    setEmail('');
    setRegno('');
    setDepartment('');
    setPassword('');
    setConfirmPassword('');
    setShowStrength(false);
    clearFormMessage('signup');
  };
  
  const clearLoginForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    clearFormMessage('login');
  };
  
  // Handle submissions with navigation
  const handleSignup = () => {
    clearFormMessage('signup');
    if (!name || !email || !regno || !department || !password || !confirmPassword) {
      showFormMessage('signup', 'All fields are required!', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFormMessage('signup', 'Please enter a valid email address!', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showFormMessage('signup', 'Passwords do not match!', 'error');
      return;
    }
    if (password.length < 8) {
      showFormMessage('signup', 'Password must be at least 8 characters long!', 'error');
      return;
    }
    
    setSignupLoading(true);
    setTimeout(() => {
      setSignupLoading(false);
      showFormMessage('signup', 'Account created successfully!', 'success');
      showNotification('Account created successfully! Welcome aboard!', 'success');
      console.log('Department selected:', department);
      clearSignUpForm();
      
      // Navigate to Dashboard after successful signup
      setTimeout(() => {
        navigation.replace('Dashboard', {
          userEmail: email,
          userName: name,
          userDepartment: department,
          userRegno: regno,
          isNewUser: true,
          loginTime: new Date().toISOString(),
        });
      }, 1000);
    }, 1400);
  };
  
  const handleLogin = () => {
    clearFormMessage('login');
    if (!loginEmail || !loginPassword) {
      showFormMessage('login', 'Please enter both email and password!', 'error');
      return;
    }
    if (!isValidEmail(loginEmail)) {
      showFormMessage('login', 'Please enter a valid email address!', 'error');
      return;
    }
    
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      showFormMessage('login', 'Welcome back!', 'success');
      showNotification('Login successful! Welcome back!', 'success');
      clearLoginForm();
      
      // Navigate to Dashboard after successful login
      setTimeout(() => {
        navigation.replace('Dashboard', {
          userEmail: loginEmail,
          loginTime: new Date().toISOString(),
          isNewUser: false,
        });
      }, 500);
    }, 1050);
  };
  
  // Social login handler
  const handleSocialLogin = (platform) => {
    const iconKey = platform.toLowerCase();
    setIconPressed(prev => ({ ...prev, [iconKey]: true }));
    showNotification(`Redirecting to ${platform} OAuth...`, 'success');
    
    // Simulate social login success and navigate to dashboard
    setTimeout(() => {
      navigation.replace('Dashboard', {
        userEmail: `user@${platform.toLowerCase()}.com`,
        socialLogin: platform,
        loginTime: new Date().toISOString(),
        isNewUser: false,
      });
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#bbdefb" barStyle="dark-content" />
      
      {/* Notification */}
      {notification && (
        <Animated.View
          style={[
            styles.notification,
            notification.type === 'success' ? styles.successNotif : styles.errorNotif,
            { transform: [{ translateY: notificationAnim }] }
          ]}
        >
          <View style={styles.notificationContent}>
            <FontAwesome5
              name={notification.type === 'success' ? 'check-circle' : 'exclamation-triangle'}
              size={20}
              color="#fff"
            />
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        </Animated.View>
      )}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="graduation-cap" size={26} color="#232867" />
          </View>
          <Text style={styles.appTitle}>CGPA Tracker</Text>
          <Text style={styles.welcomeSubtitle}>
            {isSignUp ? 'Create your account to get started' : 'Sign in to continue to your account'}
          </Text>
        </View>
        
        {/* Form Container */}
        <View style={styles.formCard}>
          {/* Sign In Form */}
          {!isSignUp && (
            <View>
              <Text style={styles.formTitle}>Welcome Back</Text>
              {loginMessage.text ? (
                <View style={[styles.messageContainer, styles[loginMessage.type]]}>
                  <Text style={styles.messageText}>{loginMessage.text}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="envelope" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="lock" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!loginPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => setLoginPasswordVisible(!loginPasswordVisible)}>
                    <FontAwesome5
                      name={loginPasswordVisible ? 'eye-slash' : 'eye'}
                      size={16}
                      color="#87ceeb"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Forgot Password Link */}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.primaryButton, loginLoading && styles.buttonLoading]}
                onPress={handleLogin}
                disabled={loginLoading}
              >
                <View style={styles.buttonContent}>
                  {loginLoading && <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />}
                  <Text style={styles.buttonText}>
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.socialSection}>
                <TouchableOpacity
                  style={[styles.socialButton, iconPressed.google ? styles.socialButtonPressed : styles.socialButtonDefault]}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <FontAwesome5 name="google" size={20} color={iconPressed.google ? '#87ceeb' : '#232867'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, iconPressed.linkedin ? styles.socialButtonPressed : styles.socialButtonDefault]}
                  onPress={() => handleSocialLogin('LinkedIn')}
                >
                  <FontAwesome5 name="linkedin" size={20} color={iconPressed.linkedin ? '#87ceeb' : '#232867'} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.switchLink} 
                onPress={() => {
                  clearFormMessage('login');
                  clearLoginForm();
                  setIsSignUp(true);
                }}
              >
                <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Sign Up Form */}
          {isSignUp && (
            <View>
              <Text style={styles.formTitle}>Create Account</Text>
              {signupMessage.text ? (
                <View style={[styles.messageContainer, styles[signupMessage.type]]}>
                  <Text style={styles.messageText}>{signupMessage.text}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="user" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="envelope" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Registration Number</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="id-card" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={regno}
                    onChangeText={setRegno}
                    placeholder="Enter registration number"
                    autoCapitalize="characters"
                  />
                </View>
              </View>
              
              {/* Department Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Department</Text>
                <View style={styles.pickerContainer}>
                  <FontAwesome5 name="building" size={16} color="#87ceeb" style={styles.pickerIcon} />
                  <Picker
                    selectedValue={department}
                    onValueChange={(itemValue) => setDepartment(itemValue)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Department" value="" enabled={false} />
                    <Picker.Item label="Information Technology (IT)" value="IT" />
                    <Picker.Item label="Computer Science Engineering (CSE)" value="CSE" />
                    <Picker.Item label="Electronics & Communication Engineering (ECE)" value="ECE" />
                    <Picker.Item label="Electrical & Electronics Engineering (EEE)" value="EEE" />
                    <Picker.Item label="Aeronautical & Civil Engineering (ACE)" value="ACE" />
                    <Picker.Item label="Information Science Engineering (ISE)" value="ISE" />
                    <Picker.Item label="Aerospace Engineering (ASE)" value="ASE" />
                    <Picker.Item label="Petroleum & Chemical Engineering (PCE)" value="PCE" />
                  </Picker>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="lock" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <FontAwesome5
                      name={passwordVisible ? 'eye-slash' : 'eye'}
                      size={16}
                      color="#87ceeb"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Password Strength */}
              {showStrength && (
                <View style={styles.strengthSection}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: `${strengthPercent}%`, backgroundColor: strengthColor }]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                </View>
              )}
              
              {/* Password Requirements */}
              {password.length > 0 && (
                <View style={styles.requirementsSection}>
                  {[
                    { key: 'length', label: 'At least 8 characters' },
                    { key: 'lowercase', label: 'One lowercase letter' },
                    { key: 'uppercase', label: 'One uppercase letter' },
                    { key: 'number', label: 'One number' },
                    { key: 'special', label: 'One special character' },
                  ].map(({ key, label }) => (
                    <View key={key} style={styles.requirementItem}>
                      <FontAwesome5
                        name={checks[key] ? 'check-circle' : 'times-circle'}
                        size={12}
                        color={checks[key] ? '#66bb6a' : '#ff6b6b'}
                      />
                      <Text style={[styles.requirementText, { color: checks[key] ? '#66bb6a' : '#ff6b6b' }]}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputContainer, confirmPassword && (password === confirmPassword ? styles.successBorder : styles.errorBorder)]}>
                  <FontAwesome5 name="lock" size={16} color="#87ceeb" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry={!confirmPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    <FontAwesome5
                      name={confirmPasswordVisible ? 'eye-slash' : 'eye'}
                      size={16}
                      color="#87ceeb"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.primaryButton, signupLoading && styles.buttonLoading]}
                onPress={handleSignup}
                disabled={signupLoading}
              >
                <View style={styles.buttonContent}>
                  {signupLoading && <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />}
                  <Text style={styles.buttonText}>
                    {signupLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.socialSection}>
                <TouchableOpacity
                  style={[styles.socialButton, iconPressed.google ? styles.socialButtonPressed : styles.socialButtonDefault]}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <FontAwesome5 name="google" size={20} color={iconPressed.google ? '#87ceeb' : '#232867'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, iconPressed.linkedin ? styles.socialButtonPressed : styles.socialButtonDefault]}
                  onPress={() => handleSocialLogin('LinkedIn')}
                >
                  <FontAwesome5 name="linkedin" size={20} color={iconPressed.linkedin ? '#87ceeb' : '#232867'} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.switchLink} 
                onPress={() => {
                  clearFormMessage('signup');
                  clearSignUpForm();
                  setIsSignUp(false);
                }}
              >
                <Text style={styles.switchText}>Already have an account? Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#bbdefb',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 2,
    borderColor: '#87ceeb',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#232867',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#3a4285',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#232867',
    textAlign: 'center',
    marginBottom: 24,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#e8f5e8',
    borderColor: '#66bb6a',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#ffebee',
    borderColor: '#ff6b6b',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232867',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    paddingHorizontal: 16,
    minHeight: 50,
  },
  successBorder: {
    borderColor: '#66bb6a',
  },
  errorBorder: {
    borderColor: '#ff6b6b',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#232867',
    paddingVertical: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#232867',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    paddingLeft: 16,
    minHeight: 50,
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#232867',
  },
  strengthSection: {
    marginBottom: 16,
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  strengthFill: {
    height: 6,
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  requirementsSection: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#232867',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonLoading: {
    backgroundColor: '#3a4285',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3f2fd',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#87ceeb',
    fontWeight: '500',
  },
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  socialButtonDefault: {
    backgroundColor: '#f8f9ff',
    borderWidth: 2,
    borderColor: '#232867',
  },
  socialButtonPressed: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#87ceeb',
  },
  switchLink: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e3f2fd',
    marginTop: 8,
  },
  switchText: {
    fontSize: 15,
    color: '#232867',
    fontWeight: '600',
  },
  notification: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  successNotif: {
    backgroundColor: '#66bb6a',
  },
  errorNotif: {
    backgroundColor: '#ff6b6b',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  notificationText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});

export default AuthScreen;
