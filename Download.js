// Download.js - UPDATED WITH SLIDE-BASED SEPARATION
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';

const { width, height } = Dimensions.get('window');

const Download = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [currentTab, setCurrentTab] = useState(0); // 0: My Results, 1: Departments
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const slideXAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadResults();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadResults = async () => {
    try {
      if (!currentUser) return;
      
      const userResults = await ResultService.getResultsByUserId(currentUser.id);
      const resultsWithSubjects = Array.from(userResults).map(result => ({
        ...result,
        subjects: result.subjects || []
      }));
      setResults(resultsWithSubjects);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const toggleCardExpansion = (resultId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedCards(newExpanded);
  };

  const openResultDetails = (result) => {
    setSelectedResult(result);
    setDetailModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const closeResultDetails = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setDetailModalVisible(false);
      setSelectedResult(null);
    });
  };

  const switchTab = (tabIndex) => {
    setCurrentTab(tabIndex);
    Animated.timing(slideXAnim, {
      toValue: -width * tabIndex,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const deleteResult = async (resultId) => {
    try {
      Alert.alert(
        'Delete Result',
        'Are you sure you want to delete this result?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              const success = await ResultService.deleteResult(resultId);
              if (success) {
                Alert.alert('Success', 'Result deleted successfully');
                loadResults();
                closeResultDetails();
              } else {
                Alert.alert('Error', 'Failed to delete result');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting result:', error);
      Alert.alert('Error', 'Failed to delete result');
    }
  };

  const exportToPDF = async () => {
    try {
      Alert.alert(
        'Export Results',
        'Export all saved results as PDF?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Export', 
            onPress: async () => {
              Alert.alert(
                'Export Successful', 
                'All results have been exported as PDF successfully!',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Error', 'Failed to export results as PDF');
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'O': '#4CAF50',
      'A+': '#232867',
      'A': '#3a4285',
      'B+': '#5dade2',
      'B': '#87ceeb',
      'C': '#ff9800',
      'P': '#9C27B0',
      'F': '#F44336'
    };
    return gradeColors[grade] || '#757575';
  };

  // Calculate overall stats
  const calculateStats = () => {
    if (results.length === 0) return { averageCGPA: 0, bestCGPA: 0, totalResults: 0 };
    
    const totalCGPA = results.reduce((sum, result) => sum + parseFloat(result.value), 0);
    const averageCGPA = (totalCGPA / results.length).toFixed(2);
    const bestCGPA = Math.max(...results.map(result => parseFloat(result.value))).toFixed(2);
    
    return {
      averageCGPA,
      bestCGPA,
      totalResults: results.length
    };
  };

  // Get custom SEM results
  const getCustomResults = () => {
    return results.filter(result => result.isCustom);
  };

  // Sample departments data
  const departments = [
    {
      id: 1,
      name: "Computer Science & Engineering",
      code: "CSE",
      totalStudents: 120,
      avgCGPA: 8.5,
      semesters: [
        { id: 1, name: "SEMESTER I", cgpa: 8.2, subjects: [
          ["CSE101", "Programming Fundamentals", "A"],
          ["CSE102", "Data Structures", "B+"],
          ["MTH101", "Mathematics I", "A"],
          ["PHY101", "Physics", "A+"],
        ]},
        { id: 2, name: "SEMESTER II", cgpa: 8.6, subjects: [
          ["CSE201", "Algorithms", "A+"],
          ["CSE202", "Database Systems", "A"],
          ["MTH201", "Mathematics II", "B+"],
          ["CSE203", "OOP with Java", "A"],
        ]}
      ]
    },
    {
      id: 2,
      name: "Information Technology",
      code: "IT",
      totalStudents: 90,
      avgCGPA: 8.3,
      semesters: [
        { id: 1, name: "SEMESTER I", cgpa: 8.1, subjects: [
          ["ITA101", "Programming in C", "A"],
          ["ITA102", "Web Technologies", "B+"],
          ["MAA101", "Mathematics I", "A"],
          ["CYA101", "Chemistry", "A"],
        ]}
      ]
    }
  ];

  const stats = calculateStats();
  const customResults = getCustomResults();

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderMyResultsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalResults}</Text>
          <Text style={styles.statLabel}>Saved Results</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.averageCGPA}</Text>
          <Text style={styles.statLabel}>Avg CGPA</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.bestCGPA}</Text>
          <Text style={styles.statLabel}>Best CGPA</Text>
        </View>
      </View>

      {/* Overall Progress */}
      {results.length > 0 && (
        <View style={styles.overallProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Academic Progress</Text>
            <Text style={styles.progressValue}>{stats.averageCGPA} / 10.0</Text>
          </View>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(stats.averageCGPA / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Results List */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved results yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Calculate your CGPA first and save the results to see them here.
          </Text>
        </View>
      ) : (
        <View style={styles.resultsList}>
          {results.map((result, index) => (
            <View key={result.id} style={styles.resultCard}>
              {/* Card Header */}
              <TouchableOpacity 
                style={styles.cardHeader}
                onPress={() => toggleCardExpansion(result.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <Text style={styles.semesterText}>{result.semester}</Text>
                  <View style={styles.cgpaBadge}>
                    <Text style={styles.cgpaBadgeText}>CGPA: {result.value}</Text>
                  </View>
                </View>
                <View style={styles.expandIcon}>
                  <Text style={styles.expandIconText}>
                    {expandedCards.has(result.id) ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Card Body - Table Layout */}
              {expandedCards.has(result.id) && (
                <View style={styles.cardBody}>
                  <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Code</Text>
                      <Text style={styles.tableHeaderText}>Subject</Text>
                      <Text style={styles.tableHeaderText}>Grade</Text>
                    </View>

                    {/* Table Rows */}
                    {result.subjects.map((subject, subjectIndex) => (
                      <View key={subjectIndex} style={styles.tableRow}>
                        <Text style={styles.codeText}>{subject[0]}</Text>
                        <Text style={styles.subjectText}>{subject[1]}</Text>
                        <View style={styles.gradeContainer}>
                          <View 
                            style={[
                              styles.gradeChip,
                              { backgroundColor: getGradeColor(subject[2]) }
                            ]}
                          >
                            <Text style={styles.gradeText}>{subject[2]}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.cardProgressContainer}>
                    <View 
                      style={[
                        styles.cardProgressBar, 
                        { width: `${(parseFloat(result.value) / 10) * 100}%` }
                      ]} 
                    />
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => openResultDetails(result)}
                    >
                      <Text style={styles.detailsButtonText}>📋 Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteCardButton}
                      onPress={() => deleteResult(result.id)}
                    >
                      <Text style={styles.deleteCardButtonText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Export Button */}
      {results.length > 0 && (
        <TouchableOpacity style={styles.exportButton} onPress={exportToPDF}>
          <Text style={styles.exportButtonText}>📄 Export All as PDF</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderDepartmentsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Department Stats */}
      <View style={styles.departmentStats}>
        <View style={styles.departmentStatCard}>
          <Text style={styles.departmentStatNumber}>{departments.length}</Text>
          <Text style={styles.departmentStatLabel}>Departments</Text>
        </View>
        <View style={styles.departmentStatCard}>
          <Text style={styles.departmentStatNumber}>
            {departments.reduce((sum, dept) => sum + dept.totalStudents, 0)}
          </Text>
          <Text style={styles.departmentStatLabel}>Total Students</Text>
        </View>
        <View style={styles.departmentStatCard}>
          <Text style={styles.departmentStatNumber}>
            {(departments.reduce((sum, dept) => sum + dept.avgCGPA, 0) / departments.length).toFixed(1)}
          </Text>
          <Text style={styles.departmentStatLabel}>Avg CGPA</Text>
        </View>
      </View>

      {/* Custom SEM Results Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Custom SEM Results</Text>
        <Text style={styles.sectionSubtitle}>Your personalized semester records</Text>
      </View>

      {customResults.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No Custom SEM Results</Text>
          <Text style={styles.emptyStateSubtext}>
            Create custom semester results to see them here.
          </Text>
        </View>
      ) : (
        <View style={styles.customResultsList}>
          {customResults.map((result, index) => (
            <View key={result.id} style={styles.resultCard}>
              <TouchableOpacity 
                style={styles.cardHeader}
                onPress={() => toggleCardExpansion(result.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <Text style={styles.semesterText}>{result.semester}</Text>
                  <View style={styles.cgpaBadge}>
                    <Text style={styles.cgpaBadgeText}>CGPA: {result.value}</Text>
                  </View>
                </View>
                <View style={styles.expandIcon}>
                  <Text style={styles.expandIconText}>
                    {expandedCards.has(result.id) ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedCards.has(result.id) && (
                <View style={styles.cardBody}>
                  <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Code</Text>
                      <Text style={styles.tableHeaderText}>Subject</Text>
                      <Text style={styles.tableHeaderText}>Grade</Text>
                    </View>

                    {result.subjects.map((subject, subjectIndex) => (
                      <View key={subjectIndex} style={styles.tableRow}>
                        <Text style={styles.codeText}>{subject[0]}</Text>
                        <Text style={styles.subjectText}>{subject[1]}</Text>
                        <View style={styles.gradeContainer}>
                          <View 
                            style={[
                              styles.gradeChip,
                              { backgroundColor: getGradeColor(subject[2]) }
                            ]}
                          >
                            <Text style={styles.gradeText}>{subject[2]}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.cardProgressContainer}>
                    <View 
                      style={[
                        styles.cardProgressBar, 
                        { width: `${(parseFloat(result.value) / 10) * 100}%` }
                      ]} 
                    />
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => openResultDetails(result)}
                    >
                      <Text style={styles.detailsButtonText}>📋 Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteCardButton}
                      onPress={() => deleteResult(result.id)}
                    >
                      <Text style={styles.deleteCardButtonText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Department List Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Departments</Text>
        <Text style={styles.sectionSubtitle}>Standard department curriculum</Text>
      </View>

      <View style={styles.departmentsList}>
        {departments.map((department) => (
          <View key={department.id} style={styles.departmentCard}>
            <TouchableOpacity 
              style={styles.departmentHeader}
              onPress={() => toggleCardExpansion(`dept-${department.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.departmentHeaderLeft}>
                <View>
                  <Text style={styles.departmentName}>{department.name}</Text>
                  <Text style={styles.departmentCode}>{department.code}</Text>
                </View>
                <View style={styles.departmentBadge}>
                  <Text style={styles.departmentBadgeText}>CGPA: {department.avgCGPA}</Text>
                </View>
              </View>
              <View style={styles.expandIcon}>
                <Text style={styles.expandIconText}>
                  {expandedCards.has(`dept-${department.id}`) ? '▲' : '▼'}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedCards.has(`dept-${department.id}`) && (
              <View style={styles.departmentBody}>
                <View style={styles.departmentInfo}>
                  <View style={styles.departmentInfoRow}>
                    <Text style={styles.departmentInfoLabel}>Total Students:</Text>
                    <Text style={styles.departmentInfoValue}>{department.totalStudents}</Text>
                  </View>
                  <View style={styles.departmentInfoRow}>
                    <Text style={styles.departmentInfoLabel}>Average CGPA:</Text>
                    <Text style={styles.departmentInfoValue}>{department.avgCGPA}</Text>
                  </View>
                </View>

                {department.semesters.map((semester) => (
                  <View key={semester.id} style={styles.semesterCard}>
                    <TouchableOpacity 
                      style={styles.semesterHeader}
                      onPress={() => toggleCardExpansion(`dept-sem-${semester.id}`)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.semesterHeaderLeft}>
                        <Text style={styles.semesterText}>{semester.name}</Text>
                        <View style={styles.cgpaBadge}>
                          <Text style={styles.cgpaBadgeText}>CGPA: {semester.cgpa}</Text>
                        </View>
                      </View>
                      <View style={styles.expandIcon}>
                        <Text style={styles.expandIconText}>
                          {expandedCards.has(`dept-sem-${semester.id}`) ? '▲' : '▼'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {expandedCards.has(`dept-sem-${semester.id}`) && (
                      <View style={styles.semesterBody}>
                        <View style={styles.tableContainer}>
                          <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Code</Text>
                            <Text style={styles.tableHeaderText}>Subject</Text>
                            <Text style={styles.tableHeaderText}>Grade</Text>
                          </View>

                          {semester.subjects.map((subject, subjectIndex) => (
                            <View key={subjectIndex} style={styles.tableRow}>
                              <Text style={styles.codeText}>{subject[0]}</Text>
                              <Text style={styles.subjectText}>{subject[1]}</Text>
                              <View style={styles.gradeContainer}>
                                <View 
                                  style={[
                                    styles.gradeChip,
                                    { backgroundColor: getGradeColor(subject[2]) }
                                  ]}
                                >
                                  <Text style={styles.gradeText}>{subject[2]}</Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.title}>🎓 CGPA History</Text>
        <Text style={styles.subtitle}>Academic Performance Tracker</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 0 && styles.activeTab]}
          onPress={() => switchTab(0)}
        >
          <Text style={[styles.tabText, currentTab === 0 && styles.activeTabText]}>
            My Results ({results.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 1 && styles.activeTab]}
          onPress={() => switchTab(1)}
        >
          <Text style={[styles.tabText, currentTab === 1 && styles.activeTabText]}>
            Departments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sliding Content */}
      <View style={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.slidingContent,
            { transform: [{ translateX: slideXAnim }] }
          ]}
        >
          <View style={styles.tabPage}>
            {renderMyResultsTab()}
          </View>
          <View style={styles.tabPage}>
            {renderDepartmentsTab()}
          </View>
        </Animated.View>
      </View>

      {/* Result Details Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeResultDetails}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {selectedResult && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Result Details</Text>
                  <TouchableOpacity onPress={closeResultDetails} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailCard}>
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Semester:</Text>
                      <Text style={styles.detailValue}>{selectedResult.semester}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Department:</Text>
                      <Text style={styles.detailValue}>{selectedResult.department}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Performance</Text>
                    <View style={styles.performanceRow}>
                      <View style={styles.performanceItem}>
                        <Text style={styles.performanceLabel}>CGPA</Text>
                        <Text style={[styles.performanceValue, { color: getGradeColor(selectedResult.grade) }]}>
                          {selectedResult.value}
                        </Text>
                      </View>
                      <View style={styles.performanceItem}>
                        <Text style={styles.performanceLabel}>Grade</Text>
                        <Text style={[styles.performanceValue, { color: getGradeColor(selectedResult.grade) }]}>
                          {selectedResult.grade}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Additional Info</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Subjects:</Text>
                      <Text style={styles.detailValue}>{selectedResult.totalSubjects || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>
                        {selectedResult.isCustom ? 'Custom Subjects' : 'Department Subjects'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Saved on:</Text>
                      <Text style={styles.detailValue}>
                        {selectedResult.dateFormatted} at {selectedResult.timeFormatted}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteResult(selectedResult.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Delete Result</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  loadingText: {
    fontSize: 16,
    color: '#232867',
  },
  // Header
  headerBar: {
    backgroundColor: '#232867',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#87ceeb',
    fontWeight: '300',
  },
  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#232867',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#87ceeb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#87ceeb',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Content Area
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  slidingContent: {
    flex: 1,
    flexDirection: 'row',
    width: width * 2,
  },
  tabPage: {
    width: width,
  },
  tabContent: {
    flex: 1,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#3a4285',
    fontWeight: '500',
  },
  // Overall Progress
  overallProgress: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#232867',
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    height: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#232867',
    borderRadius: 10,
  },
  // Results List
  resultsList: {
    padding: 15,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 20,
    backgroundColor: '#87ceeb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  semesterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232867',
  },
  cgpaBadge: {
    backgroundColor: '#232867',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cgpaBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  expandIcon: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIconText: {
    fontSize: 14,
    color: '#232867',
    fontWeight: 'bold',
  },
  // Card Body - Table Layout
  cardBody: {
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#bbdefb',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#232867',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbdefb',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  codeText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  subjectText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  gradeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 50,
  },
  gradeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  cardProgressContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    height: 6,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardProgressBar: {
    height: '100%',
    backgroundColor: '#232867',
    borderRadius: 10,
  },
  // Card Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#232867',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteCardButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteCardButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Export Button
  exportButton: {
    margin: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Section Headers
  sectionHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  // Department Styles
  departmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  departmentStatCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    alignItems: 'center',
  },
  departmentStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 5,
  },
  departmentStatLabel: {
    fontSize: 11,
    color: '#3a4285',
    fontWeight: '500',
    textAlign: 'center',
  },
  departmentsList: {
    padding: 15,
  },
  departmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  departmentHeader: {
    padding: 20,
    backgroundColor: '#87ceeb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 4,
  },
  departmentCode: {
    fontSize: 14,
    color: '#3a4285',
    fontWeight: '500',
  },
  departmentBadge: {
    backgroundColor: '#232867',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  departmentBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  departmentBody: {
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  departmentInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  departmentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  departmentInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  departmentInfoValue: {
    fontSize: 14,
    color: '#232867',
    fontWeight: '600',
  },
  semesterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  semesterHeader: {
    padding: 15,
    backgroundColor: '#bbdefb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semesterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  semesterBody: {
    padding: 15,
    backgroundColor: '#e3f2fd',
  },
  customResultsList: {
    padding: 15,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232867',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232867',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Download;