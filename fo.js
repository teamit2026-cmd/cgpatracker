import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// Theme colors
const COLORS = {
  primary: '#232867',
  primaryLight: '#3a4285',
  primaryDark: '#1a1f4d',
  secondary: '#87ceeb',
  accent: '#5dade2',
  lightBlue: '#e3f2fd',
  lightBlueHover: '#bbdefb',
};

// Chart constants
const CHART_HEIGHT = 200;
const CHART_WIDTH = screenWidth - 140;
const MAX_CGPA = 10;
const Y_AXIS_SCALE = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

const CGPAProgressChart = () => {
  const [selectedDot, setSelectedDot] = useState(null);
  const [cgpaData, setCgpaData] = useState([]);
  const [overallCGPA, setOverallCGPA] = useState(0);
  const [loading, setLoading] = useState(true);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  // Load CGPA data from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      loadCGPAData();
    }, [])
  );

  const loadCGPAData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('cgpaHistory');
      
      if (data) {
        const history = JSON.parse(data);
        
        // Create array for 8 semesters with 0 for uncalculated ones
        const semesterData = Array.from({ length: 8 }, (_, index) => {
          const semesterNum = index + 1;
          // Find CGPA for this semester (excluding custom entries)
          const semesterRecord = history.find(
            record => !record.isCustom && record.semester === semesterNum
          );
          
          return {
            semester: `Sem ${semesterNum}`,
            cgpa: semesterRecord ? semesterRecord.value : 0,
            hasData: !!semesterRecord,
          };
        });
        
        setCgpaData(semesterData);
        
        // Calculate overall CGPA (only from semesters with data)
        const semestersWithData = semesterData.filter(sem => sem.hasData);
        if (semestersWithData.length > 0) {
          const total = semestersWithData.reduce((sum, sem) => sum + sem.cgpa, 0);
          const average = total / semestersWithData.length;
          setOverallCGPA(parseFloat(average.toFixed(2)));
        } else {
          setOverallCGPA(0);
        }
      } else {
        // No data - show all semesters with 0 CGPA
        const emptySemesterData = Array.from({ length: 8 }, (_, index) => ({
          semester: `Sem ${index + 1}`,
          cgpa: 0,
          hasData: false,
        }));
        setCgpaData(emptySemesterData);
        setOverallCGPA(0);
      }
    } catch (error) {
      console.log('Error loading CGPA data:', error);
      // Show empty data on error
      const emptySemesterData = Array.from({ length: 8 }, (_, index) => ({
        semester: `Sem ${index + 1}`,
        cgpa: 0,
        hasData: false,
      }));
      setCgpaData(emptySemesterData);
      setOverallCGPA(0);
    } finally {
      setLoading(false);
    }
  };

  const pointSpacing = CHART_WIDTH / (cgpaData.length - 1);

  // Calculate stats (only from semesters with data)
  const semestersWithData = cgpaData.filter(sem => sem.hasData);
  const currentCGPA = semestersWithData.length > 0 
    ? semestersWithData[semestersWithData.length - 1].cgpa 
    : 0;
  const highestCGPA = semestersWithData.length > 0 
    ? Math.max(...semestersWithData.map(d => d.cgpa)) 
    : 0;
  const lowestCGPA = semestersWithData.length > 0 
    ? Math.min(...semestersWithData.map(d => d.cgpa)) 
    : 0;

  // Map CGPA to Y coordinate
  const mapCGPAToY = (cgpa) => ((MAX_CGPA - cgpa) / MAX_CGPA) * CHART_HEIGHT;

  // Generate smooth curved path
  const generateCurvePath = () => {
    if (cgpaData.length === 0) return { linePath: '', areaPath: '' };

    let linePath = '';
    let areaPath = '';

    cgpaData.forEach((data, index) => {
      const x = index * pointSpacing;
      const y = mapCGPAToY(data.cgpa);

      if (index === 0) {
        linePath = `M ${x} ${y}`;
        areaPath = `M ${x} ${CHART_HEIGHT} L ${x} ${y}`;
      } else {
        const prevX = (index - 1) * pointSpacing;
        const prevY = mapCGPAToY(cgpaData[index - 1].cgpa);
        const cpX = prevX + (x - prevX) / 2;

        linePath += ` Q ${cpX} ${prevY} ${x} ${y}`;
        areaPath += ` Q ${cpX} ${prevY} ${x} ${y}`;
      }

      if (index === cgpaData.length - 1) {
        areaPath += ` L ${x} ${CHART_HEIGHT} Z`;
      }
    });

    return { linePath, areaPath };
  };

  // Handle dot press
  const handleDotPress = (index) => {
    // Don't show tooltip for semesters without data
    if (!cgpaData[index].hasData) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (selectedDot === index) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSelectedDot(null));
    } else {
      setSelectedDot(index);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setSelectedDot(null));
      }, 3000);
    }
  };

  // Hide on outside tap
  const handleOutsideTap = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (selectedDot !== null) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSelectedDot(null));
    }
  };

  const { linePath, areaPath } = generateCurvePath();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading CGPA Data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.lightBlue} barStyle="dark-content" />

      <TouchableWithoutFeedback onPress={handleOutsideTap} accessible={false}>
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centeredContent}>
            {/* Chart Container */}
            <View style={styles.chartCard}>
              {/* Header */}
              <View style={styles.chartHeader}>
                <Ionicons name="trending-up" size={20} color={COLORS.primaryDark} />
                <Text style={styles.headerTitle}>CGPA Progress Analysis</Text>
              </View>

              {/* No Data Message */}
              {semestersWithData.length === 0 && (
                <View style={styles.noDataContainer}>
                  <Ionicons name="analytics-outline" size={48} color={COLORS.primaryLight} />
                  <Text style={styles.noDataText}>No CGPA data available yet</Text>
                  <Text style={styles.noDataSubtext}>Calculate your CGPA to see the progress chart</Text>
                </View>
              )}

              {/* Chart Area */}
              {semestersWithData.length > 0 && (
                <View style={styles.chartArea}>
                  {/* Y-axis labels (0-10 scale) */}
                  <View style={styles.yAxisContainer}>
                    {Y_AXIS_SCALE.map((value) => (
                      <Text key={value} style={styles.yAxisLabel}>
                        {value}.0
                      </Text>
                    ))}
                  </View>

                  {/* Chart Container */}
                  <View style={styles.chartContainer}>
                    {/* Grid lines */}
                    {Y_AXIS_SCALE.map((value, index) => (
                      <View
                        key={value}
                        style={[
                          styles.gridLine,
                          { top: (index / (Y_AXIS_SCALE.length - 1)) * CHART_HEIGHT }
                        ]}
                      />
                    ))}

                    {/* SVG Chart */}
                    <Svg height={CHART_HEIGHT} width={CHART_WIDTH} style={styles.svgChart}>
                      <Defs>
                        <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
                          <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.05} />
                        </LinearGradient>
                      </Defs>
                      
                      <Path d={areaPath} fill="url(#chartGradient)" />
                      <Path
                        d={linePath}
                        stroke={COLORS.primary}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>

                    {/* Data points */}
                    {cgpaData.map((data, index) => {
                      const x = index * pointSpacing;
                      const y = mapCGPAToY(data.cgpa);
                      const isSelected = selectedDot === index;
                      const hasData = data.hasData;

                      return (
                        <View key={index} style={styles.pointWrapper} pointerEvents="box-none">
                          <TouchableOpacity
                            style={[styles.dataPointContainer, { left: x - 8, top: y - 8 }]}
                            onPress={() => handleDotPress(index)}
                            activeOpacity={hasData ? 0.7 : 1}
                            disabled={!hasData}
                          >
                            <View style={[
                              styles.dataPoint, 
                              isSelected && styles.selectedDataPoint,
                              !hasData && styles.noDataPoint
                            ]} />
                          </TouchableOpacity>

                          {isSelected && hasData && (
                            <Animated.View
                              style={[
                                styles.tooltipContainer,
                                {
                                  left: x - 40,
                                  top: y - 65,
                                  opacity: fadeAnimation,
                                  transform: [
                                    {
                                      translateY: fadeAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                      }),
                                    },
                                    {
                                      scale: fadeAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1],
                                      }),
                                    },
                                  ],
                                },
                              ]}
                              pointerEvents="none"
                            >
                              <View style={styles.tooltip}>
                                <Text style={styles.tooltipSemester}>{data.semester}</Text>
                                <Text style={styles.tooltipCGPA}>CGPA: {data.cgpa.toFixed(2)}</Text>
                              </View>
                            </Animated.View>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* X-axis labels */}
                  <View style={styles.xAxisContainer}>
                    {cgpaData.map((data, index) => (
                      <Text 
                        key={index} 
                        style={[
                          styles.xAxisLabel,
                          !data.hasData && styles.xAxisLabelNoData
                        ]}
                      >
                        {data.semester}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Overall CGPA Card */}
            <View style={styles.averageCGPACard}>
              <Text style={styles.averageCGPALabel}>Overall CGPA</Text>
              <Text style={styles.averageCGPAValue}>
                {overallCGPA.toFixed(2)}
              </Text>
              <Text style={styles.averageCGPASubtext}>
                {semestersWithData.length} semester{semestersWithData.length !== 1 ? 's' : ''} completed
              </Text>
            </View>

            {/* Stats Cards Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{highestCGPA.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Highest</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{lowestCGPA.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Lowest</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentCGPA.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Current</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  centeredContent: {
    paddingHorizontal: 20,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginTop: 16,
  },
  noDataSubtext: {
    fontSize: 14,
    color: COLORS.primaryLight,
    marginTop: 8,
    textAlign: 'center',
  },
  chartArea: {
    height: 260,
    flexDirection: 'row',
    position: 'relative',
  },
  yAxisContainer: {
    width: 40,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    marginTop: 20,
  },
  yAxisLabel: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '500',
    textAlign: 'right',
  },
  chartContainer: {
    flex: 1,
    height: CHART_HEIGHT,
    marginLeft: 12,
    marginTop: 20,
    marginRight: 10,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.lightBlue,
  },
  svgChart: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pointWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  dataPointContainer: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  noDataPoint: {
    backgroundColor: COLORS.lightBlueHover,
    borderColor: COLORS.lightBlue,
    opacity: 0.5,
  },
  selectedDataPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 5,
  },
  tooltipContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  tooltipSemester: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  tooltipCGPA: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  xAxisContainer: {
    position: 'absolute',
    bottom: 5,
    left: 52,
    right: 10,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    includeFontPadding: false,
    paddingVertical: 0,
    marginVertical: 0,
  },
  xAxisLabelNoData: {
    opacity: 0.4,
  },
  averageCGPACard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  averageCGPALabel: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },
  averageCGPAValue: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  averageCGPASubtext: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 8,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
});

export default CGPAProgressChart;
