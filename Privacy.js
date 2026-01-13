import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PrivacyPolicy() {
  const navigation = useNavigation();
  const lastUpdated = "January 13, 2026";

  const renderSection = (icon, title, content) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Navigation Bar */}
      <View style={styles.appBar}>
        <View style={{ width: 40 }} />
        <View style={styles.appBarTitleContainer}>
          <MaterialIcons name="security" size={20} color="#00d0ffff" />
          <Text style={styles.appBarTitle}>Privacy Policy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Badge */}
        <View style={styles.headerBadge}>
          <MaterialCommunityIcons name="shield-check" size={48} color="#ffffff" />
          <Text style={styles.headerTitle}>Your Data is Secure</Text>
          <Text style={styles.headerSubtitle}>Last Updated: {lastUpdated}</Text>
        </View>

        <Text style={styles.introText}>
          At PKIET CGPA Tracker, we believe your academic data belongs to you. This policy outlines our commitment to your privacy.
        </Text>

        {renderSection(
          <Ionicons name="hardware-chip-outline" size={22} color="#232867" />,
          "Local Storage Only",
          "We collect minimal data necessary to provide our services. All your profiles, grades, and custom subjects are stored strictly on your device using a local Realm database. We do not have servers, and your data never leaves your phone."
        )}

        {renderSection(
          <MaterialCommunityIcons name="database-off" size={22} color="#232867" />,
          "No Data Collection",
          "We do not collect, transmit, or share your personal information with any third parties. There are no tracking analytics, advertising SDKs, or background data mining processes in this application."
        )}

        {renderSection(
          <MaterialIcons name="lock-outline" size={22} color="#232867" />,
          "Data Security",
          "Since data is stored locally, it is as secure as your device. We recommend keeping your device updated and securing it with a passcode or biometric lock to prevent unauthorized access to your academic records."
        )}

        {renderSection(
          <MaterialCommunityIcons name="wifi-off" size={22} color="#232867" />,
          "Offline Functionality",
          "The app is designed to work 100% offline. You can calculate CGPA, view charts, and manage your profile without an internet connection."
        )}

        {renderSection(
          <MaterialIcons name="contact-support" size={22} color="#232867" />,
          "Contact Us",
          "If you have any questions about this privacy policy or how your data is handled, please reach out to our development team at:\n\n📧 team.it.2026@gmail.com"
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Team Hexonyx. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  appBar: {
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebf0',
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  appBarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#232867',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBadge: {
    backgroundColor: '#232867',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#232867',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '500',
  },
  introText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#232867',
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    paddingLeft: 4,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 13,
  }
});
