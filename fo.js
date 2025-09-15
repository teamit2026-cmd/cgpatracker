// // graph page 
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

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
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  // CGPA data
  const cgpaData = [
    { semester: 'Sem 1', cgpa: 7.5 },
    { semester: 'Sem 2', cgpa: 3.0 },
    { semester: 'Sem 3', cgpa: 8.0 },
    { semester: 'Sem 4', cgpa: 8.2 },
    { semester: 'Sem 5', cgpa: 8.4 },
    { semester: 'Sem 6', cgpa: 2.5 },
    { semester: 'Sem 7', cgpa: 8.7 },
    { semester: 'Sem 8', cgpa: 8.8 },
  ];

  const pointSpacing = CHART_WIDTH / (cgpaData.length - 1);

  // Calculate stats
  const currentCGPA = cgpaData[cgpaData.length - 1].cgpa;
  const averageCGPA = cgpaData.reduce((sum, d) => sum + d.cgpa, 0) / cgpaData.length;
  const highestCGPA = Math.max(...cgpaData.map(d => d.cgpa));
  const lowestCGPA = Math.min(...cgpaData.map(d => d.cgpa));

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
        // linePath += M ${x} ${y};
        // areaPath += M ${x} ${CHART_HEIGHT} L ${x} ${y};
      } else {
        // Create smooth curves using quadratic bezier
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.lightBlue} barStyle="dark-content" />
      
      {/* Space for banner at top */}
      <View style={styles.topSpacePlaceholder}>
        <Text style={styles.placeholderText}>Space for Banner/Header</Text>
      </View>

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

              {/* Chart Area */}
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

                    return (
                      <View key={index} style={styles.pointWrapper} pointerEvents="box-none">
                        <TouchableOpacity
                          style={[styles.dataPointContainer, { left: x - 8, top: y - 8 }]}
                          onPress={() => handleDotPress(index)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.dataPoint, isSelected && styles.selectedDataPoint]} />
                        </TouchableOpacity>

                        {isSelected && (
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
                              <Text style={styles.tooltipCGPA}>CGPA: {data.cgpa}</Text>
                            </View>
                          </Animated.View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* X-axis labels - SIMPLE TEXT WITHOUT BOXES */}
                <View style={styles.xAxisContainer}>
                  {cgpaData.map((data, index) => (
                    <Text key={index} style={styles.xAxisLabel}>
                      {data.semester}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Average CGPA Card */}
            <View style={styles.averageCGPACard}>
              <Text style={styles.averageCGPALabel}>Average CGPA</Text>
              <Text style={styles.averageCGPAValue}>
                {averageCGPA.toFixed(1)}
              </Text>
            </View>

            {/* Stats Cards Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{highestCGPA.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Highest</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{lowestCGPA.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Lowest</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentCGPA.toFixed(1)}</Text>
                <Text style={styles.statLabel}>CurrentCGPA</Text>
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
  // Space at top for banner
  topSpacePlaceholder: {
    height: 100,
    backgroundColor: COLORS.lightBlueHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '600',
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
  chartArea: {
    height: 260, // REDUCED HEIGHT - removed excess space
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
  // SIMPLE X-AXIS LABELS - NO BOXES, MINIMAL SPACE
  xAxisContainer: {
    position: 'absolute',
    bottom: 5, // REDUCED from 20 to 5
    left: 52,
    right: 10,
    height: 25, // REDUCED from 60 to 25
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
    includeFontPadding: false, // Remove extra font padding
    paddingVertical: 0,
    marginVertical: 0,
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