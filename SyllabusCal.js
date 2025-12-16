import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, TabBar } from 'react-native-tab-view';
import { MaterialIcons } from '@expo/vector-icons';

/* ===================== SYLLABUS DATA ===================== */
const syllabus = {
  IT: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 },
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    3: [
      { code: 'ECA133', name: 'Electronic Circuits', credits: 3 },
      { code: 'ITA101', name: 'Digital System Design', credits: 4 },
      { code: 'ITA102', name: 'Data Structures', credits: 3 },
      { code: 'ITA103', name: 'Object Oriented Programming using C++ & Java', credits: 3 },
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ITA104', name: 'Digital Laboratory', credits: 1.5 },
      { code: 'ITA105', name: 'Data Structures Laboratory', credits: 1.5 },
      { code: 'ITA106', name: 'Object Oriented Programming Lab using C++ & Java ', credits: 1.5 },
    ],
    4: [
      { code: 'MAA106', name: 'Mathematics for Computing', credits: 4 },
      { code: 'ITA107', name: 'Operating Systems', credits: 3 },
      { code: 'ITA108', name: 'Computer Architecture', credits: 3 },
      { code: 'ITA109', name: 'Microprocessors and Applications', credits: 3 },
      { code: 'ITA110', name: 'Design and Analysis of Algorithms', credits: 3 },
      { code: 'ITA111', name: 'Operating Systems Laboratory with Linux', credits: 1.5 },
      { code: 'ITA112', name: 'Microprocessor Laboratory', credits: 1.5 },
      { code: 'ITA113', name: 'Algorithms Laboratory', credits: 1.5 },
    ],
    5: [
      { code: 'ITA114', name: 'Database Management System', credits: 3 },
      { code: 'ITA115', name: 'Object Oriented Analysis and Design', credits: 4 },
      { code: 'ITA116', name: 'Computer Networks', credits: 4 },
      { code: 'ITA117', name: 'Information Coding Techniques', credits: 3 },
      { code: 'ITA2X1', name: 'Program Elective - I', credits: 3 },
      { code: 'ITA118', name: 'Database Management System Laboratory', credits: 1.5 },
      { code: 'ITA119', name: 'Computer Networks Laboratory', credits: 1.5 },
      { code: 'ITA120', name: 'Information Coding Laboratory', credits: 1.5 },
    ],
    6: [
      { code: 'ITA121', name: 'Software Engineering', credits: 3 },
      { code: 'ITA122', name: 'Automata and Formal Languages', credits: 4 },
      { code: 'ITA123', name: 'Web Technology', credits: 3 },
      { code: 'ITA2X2', name: 'Program Elective - II', credits: 3 },
      { code: 'ITA2X3', name: 'Program Elective - III', credits: 3 },
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'ITA124', name: 'Web Technology Laboratory', credits: 1.5 },
      { code: 'ITA125', name: 'Software Engineering Laboratory', credits: 1.5 },
    ],
    7: [
      { code: 'ITA126', name: 'Artificial Intelligence', credits: 4 },
      { code: 'ITA127', name: 'Full Stack Development', credits: 3 },
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'ITA2X4', name: 'Program Elective - IV', credits: 3 },
      { code: 'ITA2X5', name: 'Program Elective - V', credits: 3 },
      { code: 'ITA128', name: 'Artificial Intelligence Laboratory', credits: 1.5 },
      { code: 'ITA129', name: 'Full Stack Development Laboratory', credits: 1.5 },
      { code: 'ITA130', name: 'Seminar', credits: 1 },
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'ITA132', name: 'Comprehensive Test', credits: 1 },
      { code: 'ITA133', name: 'Internship', credits: 2 },
      { code: 'ITA134', name: 'Project Work', credits: 8 },
    ],
  },

  CSE: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 },
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    3: [
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ECA135', name: 'Electronic Devices and Digital Systems', credits: 3 },
      { code: 'CSA103', name: 'Computer Organization and Architecture', credits: 4 },
      { code: 'CSA104', name: 'Data Structures', credits: 3 },
      { code: 'CSA105', name: 'Object Oriented Programming Languages', credits: 3 },
      { code: 'ECA136', name: 'Electronic Devices and Digital Systems Laboratory', credits: 1.5 },
      { code: 'CSA106', name: 'Data Structures Laboratory', credits: 1.5 },
      { code: 'CSA107', name: 'Object Oriented Programming Languages Laboratory', credits: 1.5 },
    ],
    4: [
      { code: 'MAA106', name: 'Mathematics for Computing', credits: 4 },
      { code: 'CSA108', name: 'Operating Systems', credits: 3 },
      { code: 'CSA109', name: 'Design and Analysis of Algorithms', credits: 3 },
      { code: 'CSA110', name: 'Database Management Systems', credits: 3 },
      { code: 'CSA111', name: 'Software Engineering', credits: 4 },
      { code: 'CSA112', name: 'Operating System Laboratory', credits: 1.5 },
      { code: 'CSA113', name: 'Design and Analysis of Algorithms Laboratory', credits: 1.5 },
      { code: 'CSA114', name: 'Database Management Systems Laboratory', credits: 1.5 },
    ],
    5: [
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'CSA115', name: 'Platform Technologies', credits: 3 },
      { code: 'CSA116', name: 'Computer Networks', credits: 3 },
      { code: 'CSA117', name: 'Automata Theory and Compiler Design', credits: 4 },
      { code: 'CSA2X1', name: 'Professional Elective Course - I', credits: 3 },
      { code: 'CSA118', name: 'Platform Technologies Laboratory', credits: 1.5 },
      { code: 'CSA119', name: 'Computer Networks Laboratory', credits: 1.5 },
    ],
    6: [
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'CSA120', name: 'Microprocessors and Microcontrollers', credits: 3 },
      { code: 'CSA121', name: 'Web Technologies', credits: 3 },
      { code: 'CSA122', name: 'Information Security', credits: 4 },
      { code: 'CSA2X2', name: 'Professional Elective Course - II', credits: 3 },
      { code: 'CSA2X3', name: 'Professional Elective Course - III', credits: 3 },
      { code: 'CSA123', name: 'Microprocessors and Microcontrollers Laboratory', credits: 1.5 },
      { code: 'CSA124', name: 'Web Technologies Laboratory ', credits: 1.5 },
    ],
    7: [
      { code: 'CSA125', name: 'Artificial Intelligence', credits: 3 },
      { code: 'CSA126', name: 'Parallel and Distributed Systems', credits: 4 },
      { code: 'CSA127', name: 'Data Science Essentials', credits: 4 },
      { code: 'CSA2X4', name: 'Professional Elective Course - IV', credits: 3 },
      { code: 'CSA2X5', name: 'Professional Elective Course - V', credits: 3 },
      { code: 'CSA128', name: 'Artificial Intelligence Laboratory', credits: 1.5 },
      { code: 'CSA129', name: 'Seminar', credits: 1 },
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'CSA131', name: 'Comprehensive Test', credits: 1 },
      { code: 'CSA132', name: 'Internship', credits: 2 },
      { code: 'CSA133', name: 'Project Work', credits: 8 },
    ],
  },

  EEE: {
    1: [
      { code: 'MAA101', name: 'Mathematics I', credits: 4 },
      { code: 'EEA101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'CSA101', name: 'Programming for Problem Solving', credits: 3 },
      { code: 'MEA102', name: 'Engineering Graphics and Computer Aided Drawing', credits: 3 },
      { code: 'EEA102', name: 'Basic Electrical Engineering Laboratory', credits: 1.5 },
      { code: 'CSA102', name: 'Programming Laboratory', credits: 1.5 },
    ],
    2: [
      { code: 'MAA102', name: 'Mathematics II', credits: 4 },
      { code: 'PHA101', name: 'Physics', credits: 4 },
      { code: 'CYA101', name: 'Chemistry', credits: 4 },
      { code: 'HSA101', name: 'English for Communication', credits: 3 },
      { code: 'MEA101', name: 'Workshop and Manufacturing Practice', credits: 1.5 },
      { code: 'PHA102', name: 'Physics Laboratory', credits: 1.5 },
      { code: 'CYA102', name: 'Chemistry Laboratory', credits: 1.5 },
    ],
    3: [
      { code: 'MAA105', name: 'Linear Algebra, Numerical Methods and Random Processes', credits: 4 },
      { code: 'ECA101', name: 'Circuits and Networks', credits: 3 },
      { code: 'ECA102', name: 'Electronic Devices and Circuits', credits: 3 },
      { code: 'ECA103', name: 'Electromagnetic Waves and Fields', credits: 3 },
      { code: 'ECA104', name: 'Digital System Design', credits: 3 },
      { code: 'CSA134', name: 'Data Structures and Object-Oriented Programming', credits: 3 },
      { code: 'ECA105', name: 'Electronic Devices and Networks Laboratory', credits: 1.5 },
      { code: 'CSA135', name: 'Data Structures and OOP Laboratory', credits: 1.5 },
      { code: 'ZZA3X1', name: 'Open Elective', credits: 3 },
    ],
    4: [
      { code: 'ECA106', name: 'Transmission Lines and Waveguides', credits: 3 },
      { code: 'ECA107', name: 'Electronic Circuit Design', credits: 3 },
      { code: 'ECA108', name: 'Signals and Systems', credits: 4 },
      { code: 'ECA109', name: 'Analog Communication', credits: 3 },
      { code: 'ECA2X1', name: 'Professional Elective - I', credits: 3 },
      { code: 'SHA101', name: 'Biology for Engineers', credits: 2 },
      { code: 'ECA110', name: 'Digital System Design Laboratory', credits: 1.5 },
      { code: 'ECA111', name: 'Electronic Circuit Design Laboratory', credits: 1.5 },
      { code: 'ECA112', name: 'Analog Communication Laboratory', credits: 1.5 },
      { code: 'ZZA3X2', name: 'Open Elective', credits: 3 },
    ],
    5: [
      { code: 'ECA113', name: 'Digital Signal Processing and DSP Processors', credits: 4 },
      { code: 'ECA114', name: 'Digital Communication', credits: 3 },
      { code: 'ECA2X2', name: 'Professional Elective - II', credits: 3 },
      { code: 'CSA136', name: 'Microprocessors and Microcontrollers', credits: 3 },
      { code: 'EPA101', name: 'Entrepreneurship', credits: 2 },
      { code: 'ECA115', name: 'DSP Laboratory', credits: 1.5 },
      { code: 'ECA116', name: 'Digital Communication Laboratory', credits: 1.5 },
      { code: 'CSA137', name: 'Microprocessors and Microcontrollers Laboratory', credits: 1.5 },
      { code: 'ZZA3X3', name: 'Open Elective', credits: 3 },
    ],
    6: [
      { code: 'ECA117', name: 'Microwave and Optical Engineering', credits: 3 },
      { code: 'ECA118', name: 'Data Communication Networks', credits: 3 },
      { code: 'ECA119', name: 'VLSI Design', credits: 3 },
      { code: 'ECA2X3', name: 'Professional Elective - III', credits: 3 },
      { code: 'HSA102', name: 'Industrial Economics and Management', credits: 3 },
      { code: 'ECA120', name: 'Microwave & Optical Engg Laboratory', credits: 1.5 },
      { code: 'ECA121', name: 'Data Communication Networks Laboratory', credits: 1.5 },
      { code: 'CSA122', name: 'VLSI Design Laboratory', credits: 1.5 },
      { code: 'ZZA3X5', name: 'Open Elective', credits: 3 },
    ],
    7: [
      { code: 'ECA123', name: 'Wireless Communication', credits: 3 },
      { code: 'ECA124', name: 'Information Theory and Coding', credits: 3 },
      { code: 'ECA125', name: 'Embedded System', credits: 3 },
      { code: 'ECA2X4', name: 'Professional Elective - IV', credits: 3 },
      { code: 'ECA2X5', name: 'Professional Elective - V', credits: 3 },
      { code: 'ECA126', name: 'Wireless Communication Laboratory', credits: 1.5 },
      { code: 'ECA127', name: 'Embedded System Laboratory', credits: 1.5 },
      { code: 'CSA128', name: 'Mini Project', credits: 1 },
      { code: 'ZZA3X6', name: 'Open Elective', credits: 3 },
    ],
    8: [
      { code: 'SWA3X1', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'SWA3X2', name: 'Open Elective through SWAYAM', credits: 2 },
      { code: 'ECA131', name: 'Comprehensive Test', credits: 1 },
      { code: 'ECA132', name: 'Internship', credits: 2 },
      { code: 'ECA133', name: 'Project Work', credits: 8 },
    ],
  },
};

/* ===================== DEPARTMENT PAGE ===================== */
const DepartmentPage = React.memo(({ deptKey }) => {
  const semesters = React.useMemo(
    () => Object.entries(syllabus[deptKey]),
    [deptKey]
  );

  const renderSubjectRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.subjectCode}>{item.code}</Text>
      </View>
      <View style={[styles.tableCell, { flex: 5 }]}>
        <Text style={styles.subjectName}>{item.name}</Text>
      </View>
    </View>
  );

  const renderSemester = ({ item }) => {
    const [sem, subjects] = item;
    return (
      <View style={styles.semesterCard}>
        <Text style={styles.semesterTitle}>Semester {sem}</Text>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>
            <Text style={styles.headerText}>Code</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, { flex: 5 }]}>
            <Text style={styles.headerText}>Subject</Text>
          </View>
        </View>

        <FlatList
          data={subjects}
          keyExtractor={sub => sub.code}
          renderItem={renderSubjectRow}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={semesters}
      keyExtractor={([sem]) => String(sem)}
      contentContainerStyle={styles.semesterList}
      renderItem={renderSemester}
    />
  );
});

// ===================== MAIN SCREEN =====================
export default function SyllabusScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const routes = React.useMemo(
    () => [
      { key: 'IT', title: 'IT' },
      { key: 'CSE', title: 'CSE' },
      { key: 'EEE', title: 'EEE' },
    ],
    []
  );

  const renderScene = React.useCallback(
    ({ route }) => {
      switch (route.key) {
        case 'IT':
          return <DepartmentPage deptKey="IT" />;
        case 'CSE':
          return <DepartmentPage deptKey="CSE" />;
        case 'EEE':
          return <DepartmentPage deptKey="EEE" />;
        default:
          return null;
      }
    },
    []
  );

  return (
    <SafeAreaView
      style={styles.safeArea}  
    >
      <View style={styles.appBar}>
        <View style={styles.appBarTitleContainer}>
          <MaterialIcons name="calendar-today" size={20} color="#00d0ffff" />
          <Text style={styles.appBarTitle}>Syllabus Calendar</Text>
        </View>
      </View>

      <View style={styles.tabsWrapper}>
        <TabView
          style={styles.tabView}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy
          swipeEnabled
          animationEnabled
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              tabStyle={styles.tabStyle}
              indicatorStyle={styles.indicator}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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

  tabsWrapper: {
    flex: 1,
    backgroundColor: '#232867',
  },
  tabView: {
    flex: 1,
  },

  tabBar: {
    backgroundColor: '#232867',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabStyle: {
    flex: 1,                      // each tab takes equal width
    justifyContent: 'center',     // center label in tab
  },
  indicator: {
    backgroundColor: '#ffffff',
    height: 3,
    borderRadius: 1.5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',          // center text inside label
  },


semesterList: {
  padding: 12,
    paddingBottom: 24,
      backgroundColor: '#e5e7eb',
  },
semesterCard: {
  backgroundColor: '#f9fafb',
    borderRadius: 8,
      padding: 12,
        marginBottom: 16,
          borderWidth: 1,
            borderColor: '#d1d5db',
  },
semesterTitle: {
  fontSize: 16,
    fontWeight: '700',
      marginBottom: 8,
  },

tableRow: {
  flexDirection: 'row',
  },
tableCell: {
  borderWidth: 1,
    borderColor: '#d1d5db',
      padding: 8,
        backgroundColor: '#fff',
  },
headerCell: {
  backgroundColor: '#e5e7eb',
  },
headerText: {
  fontWeight: '700',
    fontSize: 12,
  },
subjectCode: {
  fontSize: 12,
    fontWeight: '600',
  },
subjectName: {
  fontSize: 12,
  },
});
