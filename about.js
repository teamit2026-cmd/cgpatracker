import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutCGPATracker() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Bar with bottom shadow only */}
      <View style={styles.navBar}>
        <Text style={styles.titleHeaderText}>About CGPA Tracker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Smart CGPA Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Empowering students with accurate, fast, and reliable grade calculations for academic success
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionContent}>
            We believe every student deserves easy access to accurate academic calculations. Our CGPA Calculator was built to eliminate the confusion and errors in manual grade calculations, helping students focus on what matters most - their education and growth.
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Lightning Fast</Text>
            <Text style={styles.featureDesc}>Calculate your CGPA instantly with our optimized algorithms</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Mobile Friendly</Text>
            <Text style={styles.featureDesc}>Works perfectly on all devices - desktop, tablet, and mobile</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Privacy First</Text>
            <Text style={styles.featureDesc}>All data stored locally in your browser - no server uploads</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Custom Subjects</Text>
            <Text style={styles.featureDesc}>Add unlimited custom subjects with flexible credit systems</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Grade Tracking</Text>
            <Text style={styles.featureDesc}>Monitor your academic progress semester by semester</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Works Offline</Text>
            <Text style={styles.featureDesc}>Calculate grades even without internet connection</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Meet the Team</Text>
        <View style={styles.teamBox}>
          <Text style={styles.teamRole}>Lead Developer</Text>
          <Text style={styles.teamDesc}>Full Stack Development & Architecture</Text>
        </View>
        <View style={styles.teamBox}>
          <Text style={styles.teamRole}>Web Designer</Text>
          <Text style={styles.teamDesc}>User Interface & Experience Design</Text>
        </View>
        <View style={styles.teamBox}>
          <Text style={styles.teamRole}>Quality Assurance</Text>
          <Text style={styles.teamDesc}>Testing & Bug Detection</Text>
        </View>
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Calculate Your CGPA?</Text>
          <Text style={styles.ctaDesc}>Join with thousands of students who trust our calculator for accurate grade calculations</Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>START CALCULATING</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#BEDFFA',
  },
  // Navigation bar style with bottom shadow only
  navBar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#fff',

    // iOS shadow (bottom only)
    shadowColor: '#232867',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 }, // Only bottom
    shadowRadius: 7,

    // Android shadow (bottom only)
    elevation: 10,
    zIndex: 1,
    marginTop: 0,
  },
  titleHeaderText: {
    color: '#232867',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 5,
    marginBottom: 4,
    textAlign: 'center',
  },
  container: {
    padding: 14,
    paddingBottom: 24,
  },
  headerBox: {
    backgroundColor: '#232867',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#ffffffff',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
    elevation: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#d8dbf2',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000000ff',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureBox: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000000ff',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  featureTitle: {
    fontWeight: '700',
    color: '#232867',
    marginBottom: 5,
    fontSize: 17,
  },
  featureDesc: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  teamBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  teamRole: {
    color: '#232867',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  teamDesc: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  ctaBox: {
    backgroundColor: '#232867',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 10,
  },
  ctaDesc: {
    color: '#d8dbf2',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#232867',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 22,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});
