// //user detail page 

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Animated,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    regNo: '123456',
    department: 'Information Technology',
    year: 'II',
    email: 'john.doe@example.com',
  });

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editProfile, setEditProfile] = useState(userProfile);
  
  // Error states for form validation
  const [errors, setErrors] = useState({
    name: '',
    regNo: '',
    department: '',
    year: '',
  });

  // Info popup state
  const [infoPopupVisible, setInfoPopupVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Toast notification states
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [toastAnimation] = useState(new Animated.Value(0));

  // Department options
  const departmentOptions = [
    { label: 'Information Technology (IT)', value: 'Information Technology' },
    { label: 'Computer Science Engineering (CSE)', value: 'Computer Science Engineering' },
    { label: 'Electronics & Communication Engineering (ECE)', value: 'Electronics & Communication Engineering' },
    { label: 'Electrical & Electronics Engineering (EEE)', value: 'Electrical & Electronics Engineering' },
    { label: 'Aeronautical & Civil Engineering (ACE)', value: 'Aeronautical & Civil Engineering' },
    { label: 'Information Science Engineering (ISE)', value: 'Information Science Engineering' },
    { label: 'Aerospace Engineering (ASE)', value: 'Aerospace Engineering' },
    { label: 'Petroleum & Chemical Engineering (PCE)', value: 'Petroleum & Chemical Engineering' },
  ];

  // Year options
  const yearOptions = [
    { label: 'I', value: 'I' },
    { label: 'II', value: 'II' },
    { label: 'III', value: 'III' },
    { label: 'IV', value: 'IV' },
  ];

  // Input validation functions
  const validateName = (name) => {
    const regex = /^[A-Za-z ]*$/;
    return regex.test(name);
  };

  const validateRegistrationNumber = (regno) => {
    const regex = /^\d*$/;
    return regex.test(regno);
  };

  // Dynamic field validation with specific error messages
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (!validateName(value)) {
          newErrors.name = 'Name can only contain letters and spaces';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          newErrors.name = '';
        }
        break;
        
      case 'regNo':
        if (!value.trim()) {
          newErrors.regNo = 'Registration number is required';
        } else if (!validateRegistrationNumber(value)) {
          newErrors.regNo = 'Registration number can only contain digits';
        } else if (value.length < 4) {
          newErrors.regNo = 'Registration number must be at least 4 digits';
        } else if (value.length > 12) {
          newErrors.regNo = 'Registration number cannot exceed 12 digits';
        } else {
          newErrors.regNo = '';
        }
        break;
        
      case 'department':
        newErrors.department = !value ? 'Please select a department' : '';
        break;
        
      case 'year':
        newErrors.year = !value ? 'Please select an academic year' : '';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[fieldName];
  };

  // Input change handlers with validation
  const handleNameChange = (text) => {
    if (validateName(text)) {
      setEditProfile({ ...editProfile, name: text });
    }
    validateField('name', text);
  };

  const handleRegNoChange = (text) => {
    if (validateRegistrationNumber(text)) {
      setEditProfile({ ...editProfile, regNo: text });
    }
    validateField('regNo', text);
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    Animated.timing(toastAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastVisible(false);
      });
    }, 3000);
  };

  const showInfoPopup = (message) => {
    setInfoMessage(message);
    setInfoPopupVisible(true);
  };

  const handleUpdateProfile = () => {
    const { email, ...editableProfile } = userProfile;
    setEditProfile(editableProfile);
    setErrors({ name: '', regNo: '', department: '', year: '' });
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    // Validate all fields
    const isNameValid = validateField('name', editProfile.name);
    const isRegNoValid = validateField('regNo', editProfile.regNo);
    const isDepartmentValid = validateField('department', editProfile.department);
    const isYearValid = validateField('year', editProfile.year);

    if (!isNameValid || !isRegNoValid || !isDepartmentValid || !isYearValid) {
      showToast('Please fix all errors before saving', 'error');
      return;
    }

    setUserProfile({ ...editProfile, email: userProfile.email });
    setEditModalVisible(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCancelEdit = () => {
    const { email, ...editableProfile } = userProfile;
    setEditProfile(editableProfile);
    setErrors({ name: '', regNo: '', department: '', year: '' });
    setEditModalVisible(false);
  };

  // Check if form has errors
  const hasErrors = () => {
    return Object.values(errors).some(error => error !== '');
  };

  const renderFormContent = () => (
    <ScrollView style={styles.editContainer} showsVerticalScrollIndicator={false}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={16} color="#87ceeb" style={styles.icon} />
          <TextInput
            style={[styles.input, errors.name ? styles.errorInput : null]}
            value={editProfile.name}
            onChangeText={handleNameChange}
            placeholder="Enter your full name"
            placeholderTextColor="#9ca3af"
            maxLength={50}
          />
        </View>
        {errors.name ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errors.name}</Text>
          </View>
        ) : null}
      </View>

      {/* Registration Number Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Registration Number *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={16} color="#87ceeb" style={styles.icon} />
          <TextInput
            style={[styles.input, errors.regNo ? styles.errorInput : null]}
            value={editProfile.regNo}
            onChangeText={handleRegNoChange}
            placeholder="Enter registration number"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            maxLength={12}
          />
        </View>
        {errors.regNo ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errors.regNo}</Text>
          </View>
        ) : null}
      </View>

      {/* Email field - not editable */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email (Not Editable)</Text>
        <View style={styles.disabledInputContainer}>
          <Ionicons name="mail-outline" size={16} color="#87ceeb" style={styles.icon} />
          <Text style={styles.disabledInputText}>{userProfile.email}</Text>
        </View>
      </View>

      {/* Department Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Department *</Text>
        <View style={[styles.pickerContainer, errors.department ? styles.errorInput : null]}>
          <Ionicons name="business-outline" size={16} color="#87ceeb" style={styles.pickerIcon} />
          <Picker
            selectedValue={editProfile.department}
            onValueChange={(itemValue) => {
              setEditProfile({ ...editProfile, department: itemValue });
              validateField('department', itemValue);
            }}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Department" value="" enabled={false} />
            {departmentOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        {errors.department ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errors.department}</Text>
          </View>
        ) : null}
      </View>

      {/* Year Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Academic Year *</Text>
        <View style={[styles.pickerContainer, errors.year ? styles.errorInput : null]}>
          <Ionicons name="school-outline" size={16} color="#87ceeb" style={styles.pickerIcon} />
          <Picker
            selectedValue={editProfile.year}
            onValueChange={(itemValue) => {
              setEditProfile({ ...editProfile, year: itemValue });
              validateField('year', itemValue);
            }}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Year" value="" enabled={false} />
            {yearOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        {errors.year ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errors.year}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.navigationSpace} />
      
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <View style={styles.profileContainer}>
            <View style={styles.header}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="person" size={16} color="#ffffff" />
              </View>
              <Text style={styles.headerTitle}>Basic User Details</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.profileLabel}>Name:</Text>
                <Text style={styles.value}>{userProfile.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.profileLabel}>Reg No:</Text>
                <Text style={styles.value}>{userProfile.regNo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.profileLabel}>Email:</Text>
                <Text style={styles.value}>{userProfile.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.profileLabel}>Department:</Text>
                <Text style={styles.value}>{userProfile.department}</Text>
              </View>
              <View style={[styles.detailRow, styles.lastRow]}>
                <Text style={styles.profileLabel}>Year:</Text>
                <Text style={styles.value}>{userProfile.year}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Ionicons name="create-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={() => 'main-content'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleSaveProfile} 
              style={[styles.saveButton, hasErrors() && styles.saveButtonDisabled]}
              disabled={hasErrors()}
            >
              <Text style={[styles.saveButtonText, hasErrors() && styles.saveButtonTextDisabled]}>Save</Text>
            </TouchableOpacity>
          </View>

          {renderFormContent()}
        </SafeAreaView>
      </Modal>

      {/* Info Popup Modal */}
      <Modal
        visible={infoPopupVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setInfoPopupVisible(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Ionicons name="information-circle" size={24} color="#5dade2" />
              <Text style={styles.infoModalTitle}>Information</Text>
            </View>
            <Text style={styles.infoModalMessage}>{infoMessage}</Text>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => setInfoPopupVisible(false)}
            >
              <Text style={styles.infoModalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: toastType === 'success' ? '#10b981' : '#ef4444',
              opacity: toastAnimation,
              transform: [
                {
                  translateY: toastAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons
            name={toastType === 'success' ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color="#ffffff"
            style={styles.toastIcon}
          />
          <Text style={styles.toastMessage}>{toastMessage}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  navigationSpace: {
    height: 40,
    backgroundColor: '#e3f2fd',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  profileContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bbdefb',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#87ceeb',
  },
  headerIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#232867',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e3f2fd',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  profileLabel: {
    fontSize: 15,
    color: '#3a4285',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#1a1f4d',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  updateButton: {
    backgroundColor: '#232867',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#232867',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#87ceeb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#3a4285',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#232867',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#5dade2',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonTextDisabled: {
    color: '#87ceeb',
  },
  editContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232867',
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
    minHeight: 52,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1f4d',
    paddingVertical: 14,
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  disabledInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bbdefb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#87ceeb',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  disabledInputText: {
    flex: 1,
    fontSize: 16,
    color: '#3a4285',
    paddingVertical: 14,
  },
  // Picker Styles (from your provided code)
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    paddingLeft: 16,
    minHeight: 52,
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 52,
    color: '#232867',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  // Info Modal Styles
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 40, 103, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#87ceeb',
  },
  infoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#232867',
    marginLeft: 8,
  },
  infoModalMessage: {
    fontSize: 16,
    color: '#3a4285',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoModalButton: {
    backgroundColor: '#5dade2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastMessage: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});