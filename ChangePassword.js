//change password page

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ResetPasswordScreen = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [dynamicErrors, setDynamicErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const fadeAnim = useRef(new Animated.Value(1)).current; // visible initially

  // Real-time validation for password match and old/new same
  useEffect(() => {
    const newDynamicErrors = {};
    if (newPassword && oldPassword && newPassword === oldPassword) {
      newDynamicErrors.newPassword = 'Enter a new password different from old password';
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      newDynamicErrors.confirmPassword = 'Passwords do not match';
    }
    setDynamicErrors(newDynamicErrors);
  }, [newPassword, confirmPassword, oldPassword]);

  const validateForm = () => {
    const currentErrors = {};
    if (!oldPassword.trim()) currentErrors.oldPassword = 'Please enter your old password';
    if (!newPassword.trim()) currentErrors.newPassword = 'Please enter new password';
    else if (newPassword.length < 6) currentErrors.newPassword = 'Password must be at least 6 characters';
    else if (newPassword === oldPassword) currentErrors.newPassword = 'Enter a new password different from old password';

    if (!confirmPassword.trim()) currentErrors.confirmPassword = 'Please confirm password';
    else if (newPassword !== confirmPassword) currentErrors.confirmPassword = 'Passwords do not match';

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const showMessage = (msg) => {
    setSuccessMessage(msg);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => setSuccessMessage(null));
      }, 3000);
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      showMessage('Password reset successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setDynamicErrors({});
    }
  };

  const disabled =
    !oldPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword ||
    oldPassword === newPassword;

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true, // Fix: useNativeDriver true for opacity
    }).start(() => {
      if (onClose) onClose();
      fadeAnim.setValue(1); // reset opacity for next time
    });
  };

  return (
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            accessible
            accessibilityLabel="Close Reset Password"
            accessibilityRole="button"
          >
            {/* <FontAwesome5 name="times" size={26} color="#232867" /> */}
          </TouchableOpacity>
        </View>

        {successMessage && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {['Old', 'New', 'Confirm'].map((label) => {
          const key = label.toLowerCase() + 'Password';
          const value = { oldPassword, newPassword, confirmPassword }[key];
          const setValue = { oldPassword: setOldPassword, newPassword: setNewPassword, confirmPassword: setConfirmPassword }[key];
          const showPassword = { oldPassword: showOldPassword, newPassword: showNewPassword, confirmPassword: showConfirmPassword }[key];
          const setShowPassword = { oldPassword: setShowOldPassword, newPassword: setShowNewPassword, confirmPassword: setShowConfirmPassword }[key];
          const error = errors[key] || dynamicErrors[key];

          return (
            <View style={styles.formGroup} key={key}>
              <Text style={styles.label}>{label} Password</Text>
              <View style={[styles.inputWrapper, error && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                //   placeholder={Enter your {label.toLowerCase()} password}
                  placeholderTextColor="#9aa0b0"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeIcon}
                //   accessibilityLabel={Toggle ${label} password visibility}
                  accessibilityRole="button"
                >
                  <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={20} color={error ? '#dc3545' : '#6ab0ff'} />
                </TouchableOpacity>
              </View>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.submitBtn, disabled && styles.submitBtnDisabled]}
          disabled={disabled}
          onPress={handleSubmit}
          accessibilityLabel="Reset Password"
          accessibilityRole="button"
        >
          <Text style={[styles.submitBtnText, disabled && { color: '#ccc' }]}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(34,41,76,0.19)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 36,
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#22294c',
    shadowRadius: 40,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 20 },
    elevation: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#232867',
  },
  closeBtn: {
    padding: 6,
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: 23,
  },
  label: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#29325a',
    marginBottom: 7,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fc',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#d5decf',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 52,
  },
  inputError: {
    borderColor: '#e45454',
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#3e4a81',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    padding: 6,
  },
  errorText: {
    color: '#e45454',
    fontSize: 14,
    marginTop: 3,
    marginLeft: 2,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  successText: {
    color: '#155724',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#273372',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnDisabled: {
    backgroundColor: '#a3b0d8',
  },
  submitBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.6,
  },
};

export default ResetPasswordScreen;