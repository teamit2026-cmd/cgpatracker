import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const { width } = Dimensions.get("window");

export default function App() {
  const [openSemester, setOpenSemester] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // ... (keep all your semester data the same)
  const semesters = [
    {
      id: 1,
      name: "SEMESTER I",
      cgpa: 8.2,
      subjects: [
        ["ITA101", "Programming in C", "A"],
        ["MAA101", "Mathematics I", "B+"],
        ["PHA101", "Physics", "A+"],
        ["CYA101", "Chemistry", "A"],
        ["HUA101", "English", "B"],
      ],
    },
    {
      id: 2,
      name: "SEMESTER II",
      cgpa: 8.5,
      subjects: [
        ["ITA102", "Data Structures", "A+"],
        ["MAA102", "Mathematics II", "A"],
        ["EEA101", "Basic Electrical", "B+"],
        ["ITA103", "OOP with Java", "A"],
      ],
    },
    {
      id: 3,
      name: "SEMESTER III",
      cgpa: 8.7,
      subjects: [
        ["ITA201", "Computer Networks", "A+"],
        ["ITA202", "Database Systems", "A"],
        ["MAA201", "Discrete Mathematics", "B+"],
        ["ITA203", "Software Engg.", "A"],
      ],
    },
    {
      id: 4,
      name: "SEMESTER IV",
      cgpa: 8.9,
      subjects: [
        ["ITA204", "Operating Systems", "A+"],
        ["ITA205", "Theory of Computation", "A"],
        ["ITA206", "Web Technologies", "A+"],
        ["ITA207", "Design & Analysis of Algo", "A"],
      ],
    },
    {
      id: 5,
      name: "SEMESTER V",
      cgpa: 9.0,
      subjects: [
        ["ITA301", "Compiler Design", "A+"],
        ["ITA302", "Machine Learning", "A+"],
        ["ITA303", "Cloud Computing", "A"],
        ["ITA304", "IoT Fundamentals", "B+"],
      ],
    },
    {
      id: 6,
      name: "SEMESTER VI",
      cgpa: 9.1,
      subjects: [
        ["ITA305", "Artificial Intelligence", "A+"],
        ["ITA306", "Mobile Computing", "A"],
        ["ITA307", "Data Mining", "A+"],
        ["ITA308", "Big Data Analytics", "A"],
      ],
    },
    {
      id: 7,
      name: "SEMESTER VII",
      cgpa: 9.2,
      subjects: [
        ["ITA401", "Deep Learning", "A+"],
        ["ITA402", "Cyber Security", "A"],
        ["ITA403", "Blockchain", "A"],
        ["ITA404", "Elective I", "B+"],
      ],
    },
    {
      id: 8,
      name: "SEMESTER VIII",
      cgpa: 9.3,
      subjects: [
        ["ITA405", "Project Work", "A+"],
        ["ITA406", "Elective II", "A"],
        ["ITA407", "Elective III", "A+"],
        ["ITA408", "Internship", "A"],
      ],
    },
  ];

  // Function to get grade color
  const getGradeColor = (grade) => {
    if (grade.includes("A+")) return "#232867";
    if (grade.includes("A")) return "#3a4285";
    if (grade.includes("B+")) return "#5dade2";
    return "#87ceeb";
  };

  // Function to show download confirmation
  const showDownloadConfirmation = () => {
    Alert.alert(
      "Save PDF to Downloads",
      "Do you want to save your CGPA History PDF directly to Downloads folder?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save to Downloads",
          onPress: exportPDF,
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  // Direct save to Downloads function
  const exportPDF = async () => {
    setIsDownloading(true);
    
    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align:center; color: #232867; margin-bottom: 30px;">CGPA History Report</h1>
        <div style="text-align: center; margin-bottom: 20px; color: #3a4285;">
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Overall Average CGPA: ${(semesters.reduce((acc, sem) => acc + sem.cgpa, 0) / semesters.length).toFixed(2)}</p>
        </div>
    `;

    semesters.forEach((sem) => {
      html += `
        <div style="margin-bottom: 30px; border: 2px solid #232867; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
          <h2 style="background: #232867; color: white; padding: 15px; margin: 0; text-align: center;">
            ${sem.name}
          </h2>
          <div style="padding: 15px; background: #e3f2fd;">
            <h3 style="color: #232867; margin: 0 0 15px 0;">CGPA: ${sem.cgpa}</h3>
            <table border="1" style="width:100%; border-collapse:collapse; border: 1px solid #232867;">
              <tr style="background: #bbdefb;">
                <th style="padding: 10px; border: 1px solid #232867;">Code</th>
                <th style="padding: 10px; border: 1px solid #232867;">Subject</th>
                <th style="padding: 10px; border: 1px solid #232867;">Grade</th>
              </tr>
      `;
      sem.subjects.forEach((s) => {
        html += `
          <tr style="background: white;">
            <td style="padding: 10px; border: 1px solid #232867; text-align: center;">${s[0]}</td>
            <td style="padding: 10px; border: 1px solid #232867;">${s[1]}</td>
            <td style="padding: 10px; border: 1px solid #232867; text-align: center; font-weight: bold;">${s[2]}</td>
          </tr>
        `;
      });
      html += `</table></div></div>`;
    });

    html += `
        <div style="margin-top: 40px; padding: 20px; border: 1px solid #bbdefb; border-radius: 10px; background: #e3f2fd;">
          <h3 style="color: #232867; margin: 0 0 15px 0;">Academic Summary</h3>
          <p><strong>Total Semesters Completed:</strong> ${semesters.length}</p>
          <p><strong>Highest CGPA:</strong> ${Math.max(...semesters.map(s => s.cgpa)).toFixed(1)}</p>
          <p><strong>Average CGPA:</strong> ${(semesters.reduce((acc, sem) => acc + sem.cgpa, 0) / semesters.length).toFixed(2)}</p>
        </div>
      </div>
    `;

    try {
      // Generate PDF
      const { uri } = await Print.printToFileAsync({ 
        html,
        base64: false
      });
      
      // Get current timestamp for unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = `CGPA_History_${timestamp}.pdf`;
      
      // Try to save directly to Downloads
      if (Platform.OS === 'android') {
        try {
          // Request permissions for Android
          const { status } = await MediaLibrary.requestPermissionsAsync();
          
          if (status === 'granted') {
            // Create asset and save to Downloads
            const asset = await MediaLibrary.createAssetAsync(uri);
            
            // Get or create Downloads album
            let album = await MediaLibrary.getAlbumAsync('Download');
            if (album == null) {
              album = await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            
            Alert.alert(
              "Saved Successfully! ✅",
              `PDF saved to Downloads folder!\n\nFilename: ${filename}\n\nLocation: Downloads folder\n\nYou can find it in your device's Downloads folder or Files app.`,
              [{ text: "Great!", style: "default" }]
            );
          } else {
            throw new Error('Permission denied');
          }
        } catch (androidError) {
          console.log('Android save error:', androidError);
          // Fallback for Android
          const fileUri = FileSystem.documentDirectory + filename;
          await FileSystem.moveAsync({ from: uri, to: fileUri });
          
          Alert.alert(
            "Saved to App Storage 📱",
            `PDF saved successfully!\n\nFilename: ${filename}\n\nLocation: App Documents\n\nNote: For Downloads folder access, please use a development build instead of Expo Go.`,
            [{ text: "OK", style: "default" }]
          );
        }
      } else {
        // iOS - Save to app documents (iOS restricts direct Downloads access)
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        
        Alert.alert(
          "Saved Successfully! ✅",
          `PDF saved to device!\n\nFilename: ${filename}\n\nLocation: Files app → On My iPhone → Expo Go\n\nYou can move it to Downloads from the Files app.`,
          [{ text: "Perfect!", style: "default" }]
        );
      }
      
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert(
        "Save Failed ❌",
        "Unable to save PDF to Downloads folder.\n\nThis might be due to:\n• Expo Go limitations\n• Storage permissions\n• Insufficient storage space\n\nTry using a development build for full Downloads access.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.headerBar}>
        <Text style={styles.title}>🎓 CGPA History</Text>
        <Text style={styles.subtitle}>Academic Performance Tracker</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {semesters.length}
            </Text>
            <Text style={styles.statLabel}>Semesters</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {(semesters.reduce((acc, sem) => acc + sem.cgpa, 0) / semesters.length).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Avg CGPA</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.max(...semesters.map(s => s.cgpa)).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Best CGPA</Text>
          </View>
        </View>

        {/* Semester Cards */}
        {semesters.map((sem) => (
          <View key={sem.id} style={styles.card}>
            <TouchableOpacity
              style={styles.header}
              onPress={() =>
                setOpenSemester(openSemester === sem.id ? null : sem.id)
              }
              activeOpacity={0.8}
            >
              <View style={styles.headerLeft}>
                <Text style={styles.headerText}>{sem.name}</Text>
                <View style={styles.cgpaBadge}>
                  <Text style={styles.cgpaBadgeText}>{sem.cgpa}</Text>
                </View>
              </View>
              <View style={styles.expandIcon}>
                <AntDesign
                  name={openSemester === sem.id ? "up" : "down"}
                  size={22}
                  color="#232867"
                />
              </View>
            </TouchableOpacity>

            {openSemester === sem.id && (
              <View style={styles.body}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Code</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Subject</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Grade</Text>
                  </View>

                  {sem.subjects.map((subj, i) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={[styles.tableCell, { flex: 1.2 }]}>{subj[0]}</Text>
                      <Text style={[styles.tableCell, { flex: 2.5, textAlign: 'left' }]}>
                        {subj[1]}
                      </Text>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <View style={[styles.gradeChip, { backgroundColor: getGradeColor(subj[2]) }]}>
                          <Text style={styles.gradeText}>{subj[2]}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Direct Save Button */}
        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} 
          onPress={showDownloadConfirmation}
          activeOpacity={0.8}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <AntDesign name="loading1" size={20} color="#ffffff" style={[styles.buttonIcon]} />
              <Text style={styles.buttonText}>Saving to Downloads...</Text>
            </>
          ) : (
            <>
              <AntDesign name="download" size={20} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Save to Downloads</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ... (keep all your existing styles exactly the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  headerBar: {
    width: "100%",
    backgroundColor: "#232867",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#87ceeb",
    textAlign: "center",
    fontWeight: "300",
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 25,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232867",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#3a4285",
    fontWeight: "500",
  },
  card: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#87ceeb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232867",
    marginRight: 15,
  },
  cgpaBadge: {
    backgroundColor: "#232867",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cgpaBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  expandIcon: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    padding: 20,
    backgroundColor: "#e3f2fd",
  },
  tableContainer: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#232867",
    paddingVertical: 15,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#bbdefb",
    paddingVertical: 15,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 14,
    textAlign: "center",
    color: "#232867",
    paddingHorizontal: 5,
  },
  gradeChip: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 40,
    alignItems: "center",
  },
  gradeText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
  downloadButton: {
    backgroundColor: "#232867",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadButtonDisabled: {
    backgroundColor: "#3a4285",
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
