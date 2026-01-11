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
  FlatList,
  SafeAreaView
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ResultService from './database/services/ResultService';
import UserService from './database/services/UserService';
import * as Print from 'expo-print';

const { width, height } = Dimensions.get('window');

const Download = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [currentTab, setCurrentTab] = useState(0); // 0: All Results, 1+: Department tabs

  const slideAnim = useRef(new Animated.Value(height)).current;
  const flatListRef = useRef(null);


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

  const handleTabPress = (index) => {
    setCurrentTab(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onMomentumScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== currentTab) {
      setCurrentTab(index);
    }
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

  const clearAllData = async () => {
    try {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete ALL your saved results? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete All',
            style: 'destructive',
            onPress: async () => {
              if (!currentUser) return;
              const success = await ResultService.deleteAllResults(currentUser.id);
              if (success) {
                // Success alert removed as requested
                loadResults();
              } else {
                Alert.alert('Info', 'No results to delete.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data.');
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    try {
      if (currentTabResults.length === 0) {
        Alert.alert('No Results', 'You have no results in this category to export.');
        return;
      }

      setIsExporting(true);

      // Generate HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #232867; padding-bottom: 15px; }
            .logo { font-size: 24px; font-weight: bold; color: #232867; }
            .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            
            .user-info { margin-bottom: 30px; background-color: #f8fafc; padding: 15px; border-radius: 8px; }
            .info-row { margin-bottom: 8px; }
            .label { font-weight: bold; width: 100px; display: inline-block; color: #555; }
            
            .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .summary-table th { background-color: #232867; color: white; padding: 10px; text-align: left; }
            .summary-table td { border-bottom: 1px solid #eee; padding: 10px; }
            
            .semester-section { margin-bottom: 10px; page-break-inside: avoid; }
            .semester-header { background-color: #e9edfa; padding: 10px 15px; border-left: 5px solid #232867; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .semester-title { font-weight: bold; font-size: 16px; color: #232867; }
            .semester-cgpa { font-weight: bold; background-color: #232867; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            
            .grades-table { width: 100%; border-collapse: collapse; font-size: 14px; }
            .grades-table th { border-bottom: 2px solid #ddd; text-align: left; padding: 8px; color: #555; }
            .grades-table td { border-bottom: 1px solid #eee; padding: 8px; }
            
            .grade-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; text-align: center; min-width: 25px; }
            
            .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PKIET CGPA TRACKER</div>
            <div class="subtitle">Official Academic Performance Report</div>
          </div>
          
          <div class="user-info">
            <div class="info-row">
              <span class="label">Name:</span> ${currentUser.name || 'Student'}
            </div>
            <div class="info-row">
              <span class="label">Reg. No:</span> ${currentUser.regNo || 'N/A'}
            </div>
            <div class="info-row">
              <span class="label">Department:</span> ${currentUser.department || 'N/A'}
            </div>
            <div class="info-row">
              <span class="label">Year:</span> ${currentUser.year || 'N/A'}
            </div>
            <div class="info-row">
              <span class="label">Date:</span> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <h3>Academic Summary</h3>
          <table class="summary-table">
            <tr>
              <th>Total Semesters</th>
              <th>Average CGPA</th>
              <th>Best CGPA</th>
            </tr>
            <tr>
              <td>${currentTabResults.length}</td>
              <td>${stats.averageCGPA}</td>
              <td>${stats.bestCGPA}</td>
            </tr>
          </table>
          
          <h3>Detailed Semester Records</h3>
          
          ${currentTabResults.map(result => `
            <div class="semester-section">
              <div class="semester-header">
                <span class="semester-title">Semester ${result.semester}</span>
                <span class="semester-cgpa">CGPA: ${result.value}</span>
              </div>
              
              <table class="grades-table">
                <thead>
                  <tr>
                    <th width="15%">Code</th>
                    <th width="65%">Subject</th>
                    <th width="20%">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  ${result.subjects.map(subject => `
                    <tr>
                      <td style="font-family: monospace; font-weight: bold;">${subject[0]}</td>
                      <td>${subject[1]}</td>
                      <td>
                        <span class="grade-badge" style="background-color: ${getGradeColor(subject[2])}">
                          ${subject[2]}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
          
          <div class="footer">
            Generated by PKIET CGPA Tracker App on ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `;

      // Open Print Dialog (works in Expo Go)
      await Print.printAsync({
        html: htmlContent,
      });

    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Export Failed', 'An error occurred while generating the PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'S': '#4CAF50',
      'A': '#8BC34A',
      'B': '#FFC107',
      'C': '#FF9800',
      'D': '#FF5722',
      'E': '#795548',
      'F': '#F44336'
    };
    return gradeColors[grade] || '#757575';
  };

  // Calculate unique departments from results
  const uniqueDepartments = React.useMemo(() => {
    const depts = [...new Set(results.map(r => r.department).filter(Boolean))];
    return depts.sort(); // Sort alphabetically
  }, [results]);

  // Create tabs array dynamically
  const tabs = React.useMemo(() => {
    const tabsArray = [{ id: 'all', name: 'All Results', department: null }];
    uniqueDepartments.forEach(dept => {
      tabsArray.push({ id: dept, name: dept, department: dept });
    });
    return tabsArray;
  }, [uniqueDepartments]);

  // Get results for a specific tab
  const getResultsForTab = (tabId) => {
    if (tabId === 'all') return results;
    return results.filter(r => r.department === tabId);
  };

  // Calculate stats for filtered results
  const calculateStatsForResults = (filteredResults) => {
    if (filteredResults.length === 0) return { averageCGPA: 0, bestCGPA: 0, totalResults: 0 };

    const totalCGPA = filteredResults.reduce((sum, result) => sum + parseFloat(result.value), 0);
    const averageCGPA = (totalCGPA / filteredResults.length).toFixed(2);
    const bestCGPA = Math.max(...filteredResults.map(result => parseFloat(result.value))).toFixed(2);

    return {
      averageCGPA,
      bestCGPA,
      totalResults: filteredResults.length
    };
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



  // Get current tab results and stats
  const currentTabResults = React.useMemo(() => {
    return getResultsForTab(tabs[currentTab]?.id);
  }, [tabs, currentTab, results]);

  const stats = calculateStatsForResults(currentTabResults);

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderTabContent = (tabId) => {
    const tabResults = getResultsForTab(tabId);
    const tabStats = calculateStatsForResults(tabResults);

    const renderHeader = () => (
      <>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tabStats.totalResults}</Text>
            <Text style={styles.statLabel}>Saved Results</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tabStats.averageCGPA}</Text>
            <Text style={styles.statLabel}>Avg CGPA</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tabStats.bestCGPA}</Text>
            <Text style={styles.statLabel}>Best CGPA</Text>
          </View>
        </View>

        {/* Overall Progress */}
        {tabResults.length > 0 && (
          <View style={styles.overallProgress}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Overall Academic Progress</Text>
              <Text style={styles.progressValue}>{tabStats.averageCGPA} / 10.0</Text>
            </View>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(tabStats.averageCGPA / 10) * 100}%` }
                ]}
              />
            </View>
          </View>
        )}
      </>
    );

    const renderFooter = () => (
      <>
        {/* Export Button */}
        {tabResults.length > 0 && (
          <TouchableOpacity
            style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
            onPress={exportToPDF}
            disabled={isExporting}
          >
            <Text style={styles.exportButtonText}>
              {isExporting ? '⏳ Generating PDF...' : `📄 Export ${tabs[currentTab]?.name} to PDF`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Clear All Results Button */}
        {results.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllData}
          >
            <Text style={styles.clearAllButtonText}>🗑️ Clear All History</Text>
          </TouchableOpacity>
        )}
      </>
    );

    const renderItem = ({ item: result }) => (
      <View style={styles.resultCard}>
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
    );

    const renderEmpty = () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No saved results yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Calculate your CGPA first and save the results to see them here.
        </Text>
      </View>
    );

    return (
      <FlatList
        style={styles.tabList}
        data={tabResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.tabListContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header - Matching Syllabus Style */}
        <View style={styles.headerBar}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="history-edu" size={24} color="#00d0ffff" />
            <Text style={styles.title}>CGPA History</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, currentTab === index && styles.activeTab]}
              onPress={() => handleTabPress(index)}
            >
              <Text style={[styles.tabText, currentTab === index && styles.activeTabText]}>
                {tab.name}
                {tab.id === 'all' && ` (${results.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sliding Content */}
        <View style={styles.contentContainer}>
          <FlatList
            ref={flatListRef}
            data={tabs}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width, flex: 1 }}>
                {renderTabContent(item.id)}
              </View>
            )}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(data, index) => (
              { length: width, offset: width * index, index }
            )}
            initialScrollIndex={0}
          />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#232867',
  },
  // Header
  headerBar: {
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#232867',
  },
  // Tab Navigation
  tabContainer: {
    backgroundColor: '#232867',
    flexGrow: 0,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: 10,
  },
  activeTab: {
    borderBottomColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  // Content Area
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  slidingContent: {
    flex: 1,
    flexDirection: 'row',
  },
  tabPage: {
    width: width,
    flex: 1,
  },
  tabList: {
    flex: 1,
  },
  tabListContent: {
    paddingBottom: 20,
    flexGrow: 1,
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
    borderWidth: 2,
    borderColor: '#87ceeb',
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232867',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#3a4285',
    fontWeight: '600',
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
    borderLeftWidth: 4,
    borderLeftColor: '#87ceeb',
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#87ceeb',
  },
  emptyStateText: {
    fontSize: 20,
    color: '#232867',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  // Export Button
  exportButton: {
    margin: 20,
    backgroundColor: '#232867',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#232867',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Clear All Button Style
  clearAllButton: {
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  clearAllButtonText: {
    color: '#f44336',
    fontSize: 14,
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
  exportButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#9ca3af',
  }
});

export default Download;