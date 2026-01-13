import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const teamMembers = [
  {
    name: 'Dhanush',
    role: 'Team Lead & Developer',
    linkedin: 'https://www.linkedin.com/in/mr-j-dhanush/',
    github: 'https://github.com/dhnaush0745',
    color: '#0077B5',
  },
  {
    name: 'Keerthikeshan',
    role: 'Web Designer & Developer',
    linkedin: 'https://www.linkedin.com/in/keerthikeshan25/',
    github: 'https://github.com/Keerthikeshan2004',
    color: '#00A67E',
  },
  {
    name: 'Barath',
    role: 'Testing & Developer',
    linkedin: 'https://www.linkedin.com/in/baraths021/',
    github: 'https://github.com/Barath-200',
    color: '#FF6B6B',
  },
  {
    name: 'Loguesvaran',
    role: 'Logic & Developer',
    linkedin: 'https://www.linkedin.com/in/loguesvaran-logu-a67187353/',
    github: 'https://github.com/Loguesvaran01',
    color: '#4ECDC4',
  },
  {
    name: 'Krishnarajan',
    role: 'Data Analysis & Developer',
    linkedin: 'https://www.linkedin.com/in/krishnarajan-k-2146b3301/',
    github: 'https://github.com/Krishnarajan-K',
    color: '#95E1D3',
  },
];

export default function AboutCGPATracker() {
  const navigation = useNavigation();

  const handleSocialLink = (platform, url, name) => {
    Alert.alert(
      'Open External Link',
      `You are about to be redirected to ${name}'s ${platform} profile. Do you want to continue?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'Unable to open the link');
            });
          },
        },
      ]
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Bar - Syllabus Style */}
      <View style={styles.appBar}>
        <View style={styles.appBarTitleContainer}>
          <MaterialIcons name="info" size={20} color="#00d0ffff" />
          <Text style={styles.appBarTitle}>About CGPA Tracker</Text>
        </View>
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
            <Text style={styles.featureTitle}>Smooth Transition</Text>
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

        <Text style={styles.teamSectionTitle}>Meet the Hexonyx Team</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.teamScrollContainer}
          style={styles.teamScrollView}
        >
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamBox}>
              <View style={[styles.avatar, { backgroundColor: member.color }]}>
                <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
              </View>
              <Text style={styles.teamRole}>{member.role}</Text>
              <Text style={styles.teamName}>{member.name}</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#0077B5' }]}
                  onPress={() => handleSocialLink('LinkedIn', member.linkedin, member.name)}
                >
                  <MaterialIcons name="link" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#333' }]}
                  onPress={() => handleSocialLink('GitHub', member.github, member.name)}
                >
                  <MaterialIcons name="code" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Calculate Your CGPA?</Text>
          <Text style={styles.ctaDesc}>Join with thousands of students who trust our calculator for accurate grade calculations</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('CGPACalculator')}
          >
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
  teamSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  teamScrollView: {
    marginBottom: 20,
  },
  teamScrollContainer: {
    paddingRight: 14,
  },
  teamBox: {
    backgroundColor: '#fff',
    width: 160,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamRole: {
    color: '#232867',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  teamName: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBox: {
    backgroundColor: '#232867',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
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
