import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const OtpInput = React.forwardRef(({ value, onChange, onKeyPress, isFocused }, ref) => (
  <TextInput
    ref={ref}
    value={value}
    onChangeText={onChange}
    onKeyPress={onKeyPress}
    keyboardType="number-pad"
    maxLength={1}
    style={[styles.otpBox, isFocused && styles.otpBoxFocused]}
    autoFocus={isFocused}
    textContentType="oneTimeCode"
    caretHidden={false}
    selectionColor="#273361"
    textAlign="center"
  />
));

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputs = useRef([]);

  const focusInput = (index) => {
    if (index >= 0 && index < 6) {
      inputs.current[index].focus();
      setFocusedIndex(index);
    }
  };

  const handleChange = (text, idx) => {
    if (/^\d?$/.test(text)) {
      const otpCopy = [...otp];
      otpCopy[idx] = text;
      setOtp(otpCopy);
      setError("");

      if (text && idx < otp.length - 1) focusInput(idx + 1);
    }
  };

  const handleKeyPress = ({ nativeEvent }, idx) => {
    if (nativeEvent.key === "Backspace") {
      if (otp[idx] === "") {
        if (idx > 0) {
          const otpCopy = [...otp];
          otpCopy[idx - 1] = "";
          setOtp(otpCopy);
          focusInput(idx - 1);
        }
      } else {
        const otpCopy = [...otp];
        otpCopy[idx] = "";
        setOtp(otpCopy);
      }
    }
  };

  const onSubmit = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      console.log("OTP Verified:", code);
      
      // Show success and navigate back to auth screen
      // You can navigate to password reset screen instead if you have one
      navigation.goBack();
      
    }, 2000);
  };

  const handleResendOtp = () => {
    setResendLoading(true);
    setError("");
    
    // Simulate resend OTP
    setTimeout(() => {
      setResendLoading(false);
      // Clear existing OTP
      setOtp(Array(6).fill(""));
      focusInput(0);
      console.log("OTP resent to:", email);
    }, 1500);
  };

  const disabled = otp.some((d) => d === "") || loading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="shield-alt" size={40} color="#273361" />
          </View>
          
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit code sent to{'\n'}
            <Text style={styles.emailText}>{email || 'your email'}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => focusInput(idx)}
                activeOpacity={1}
                style={{ flex: 1 }}
              >
                <OtpInput
                  ref={(r) => (inputs.current[idx] = r)}
                  value={digit}
                  onChange={(text) => handleChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  isFocused={focusedIndex === idx}
                />
              </TouchableOpacity>
            ))}
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.verifyBtn, disabled && styles.disabledBtn]}
            disabled={disabled}
            onPress={onSubmit}
            accessibilityLabel="Verify OTP"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.verifyBtnText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendLoading}
              style={styles.resendButton}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#273361" />
              ) : (
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Login Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={16} color="#273361" style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#bbdefb',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#22294c',
    shadowRadius: 20,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#232867',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 15,
    color: '#5a6280',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#273361',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  otpBox: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    width: 45,
    height: 55,
    fontSize: 20,
    fontWeight: '600',
    color: '#273361',
    textAlign: 'center',
    marginHorizontal: 3,
  },
  otpBoxFocused: {
    borderColor: '#232867',
    backgroundColor: '#fff',
    shadowColor: '#232867',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  error: {
    color: '#e45454',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  verifyBtn: {
    backgroundColor: '#273361',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledBtn: {
    backgroundColor: '#a2b1da',
  },
  verifyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  resendText: {
    fontSize: 14,
    color: '#5a6280',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#273361',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e3f2fd',
    marginTop: 10,
  },
  backButtonText: {
    color: '#273361',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OtpScreen;
