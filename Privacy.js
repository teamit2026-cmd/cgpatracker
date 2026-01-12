import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <View style={styles.appBarTitleContainer}>
          <MaterialIcons name="privacy-tip" size={20} color="#00d0ffff" />
          <Text style={styles.appBarTitle}>Privacy Policy</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.sectionContent}>
          We value your privacy and are committed to protecting your personal information. This privacy policy outlines how we collect, use, and safeguard your data when using the CGPA Tracker app.
        </Text>

        <Text style={styles.sectionTitle}>Information Collection</Text>
        <Text style={styles.sectionContent}>
          We collect minimal data necessary to provide the services, and all your data is stored locally on your device. We do not upload or share your data with third parties.
        </Text>

        <Text style={styles.sectionTitle}>Data Usage</Text>
        <Text style={styles.sectionContent}>
          Your data is used solely to calculate and track your academic grades and progress within the app.
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.sectionContent}>
          We implement industry-standard security measures to protect your data on your device. However, please ensure your device is secured with a passcode or biometric lock.
        </Text>

        <Text style={styles.sectionTitle}>Offline Usage</Text>
        <Text style={styles.sectionContent}>
          The app is fully functional offline. Your data remains on your device and is never transmitted over the internet.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          If you have any questions about this privacy policy, please contact us at team.it.2026@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  appBar: {
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  appBarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
    marginVertical: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
});
