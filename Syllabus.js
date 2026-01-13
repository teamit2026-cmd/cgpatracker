import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useWindowDimensions,
    Platform,
    StatusBar,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { departmentSubjectsCredits } from './data/DepartmentData';



/* ===================== DEPARTMENT PAGE ===================== */
const DepartmentPage = React.memo(({ deptKey }) => {
    const semesters = useMemo(
        () => Object.entries(departmentSubjectsCredits[deptKey]),
        [deptKey]
    );

    // Removed helper as we now map directly in renderSemester to avoid nested list overhead


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

                <View style={styles.subjectsContainer}>
                    {subjects.map((item) => (
                        <View key={item.code} style={styles.tableRow}>
                            <View style={[styles.tableCell, { flex: 2 }]}>
                                <Text style={styles.subjectCode}>{item.code}</Text>
                            </View>
                            <View style={[styles.tableCell, { flex: 5 }]}>
                                <Text style={styles.subjectName}>{item.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
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
    const [activeTab, setActiveTab] = useState(0);
    const flatListRef = useRef(null);

    const routes = useMemo(
        () => [
            { key: 'IT', title: 'IT' },
            { key: 'CSE', title: 'CSE' },
            { key: 'EEE', title: 'EEE' },
        ],
        []
    );

    const handleTabPress = (index) => {
        setActiveTab(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const onMomentumScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / layout.width);
        if (index !== activeTab) {
            setActiveTab(index);
        }
    };

    const renderPage = ({ item, index }) => {
        // Lazy loading: Only render the department if it's the active tab or was previously active
        const isSelected = index === activeTab;

        return (
            <View style={{ width: layout.width, flex: 1 }}>
                {isSelected ? (
                    <DepartmentPage deptKey={item.key} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Loading {item.title}...</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.appBar}>
                <View style={styles.appBarTitleContainer}>
                    <MaterialIcons name="calendar-today" size={20} color="#00d0ffff" />
                    <Text style={styles.appBarTitle}>Syllabus Calendar</Text>
                </View>
            </View>

            {/* Custom Tab Bar */}
            <View style={styles.tabBarContainer}>
                {routes.map((route, index) => {
                    const isActive = index === activeTab;
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[styles.tabItem, isActive && styles.tabItemActive]}
                            onPress={() => handleTabPress(index)}
                        >
                            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                                {route.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.tabsWrapper}>
                <FlatList
                    ref={flatListRef}
                    data={routes}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={renderPage}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    getItemLayout={(data, index) => (
                        { length: layout.width, offset: layout.width * index, index }
                    )}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={2}
                    removeClippedSubviews={Platform.OS === 'android'}
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

    /* Custom Tab Bar Styles */
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#232867',
        elevation: 4,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: '#ffffff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    tabTextActive: {
        color: '#ffffff',
        fontWeight: '700',
    },

    tabsWrapper: {
        flex: 1,
        backgroundColor: '#f3f4f6',
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
        color: '#1f2937',
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
        color: '#374151',
    },
    subjectCode: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
    },
    subjectName: {
        fontSize: 12,
        color: '#374151',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#6b7280',
        fontSize: 14,
    },
    subjectsContainer: {
        marginTop: 0,
    },
});
