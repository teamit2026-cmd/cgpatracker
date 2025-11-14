import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function App() {
  const [cgpaHistory, setCgpaHistory] = useState([]);
  const [latestCGPA, setLatestCGPA] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("cgpaHistory");
        if (storedHistory) {
          setCgpaHistory(JSON.parse(storedHistory));
        }

        const storedLatest = await AsyncStorage.getItem("latestCGPA");
        if (storedLatest) {
          setLatestCGPA(JSON.parse(storedLatest));
        }
      } catch (error) {
        console.log("Error loading CGPA from storage", error);
      }
    })();
  }, []);

  // Calculate overall average CGPA & semesters count
  const avgCGPA =
    cgpaHistory.length > 0
      ? (
          cgpaHistory.reduce((sum, record) => sum + record.value, 0) /
          cgpaHistory.length
        ).toFixed(2)
      : "-";
  const numSemesters = cgpaHistory.length;

  const exportPDF = async () => {
    if (!cgpaHistory || cgpaHistory.length === 0) {
      Alert.alert("No Data", "No CGPA data to export.");
      return;
    }
    setIsDownloading(true);

    let html = `
      <h1 style="text-align:center; color: #232867;">Semester-wise CGPA Report</h1>
      <p style="text-align:center;">
        <strong>Overall Average CGPA:</strong> ${avgCGPA} <br/>
        <strong>Number of Semesters:</strong> ${numSemesters}
      </p>
      <table style="width:100%;border-collapse:collapse; margin-top: 20px;">
        <tr style="background:#bbdefb;">
          <th style="padding: 10px; border: 1px solid #232867;">Semester</th>
          <th style="padding: 10px; border: 1px solid #232867;">CGPA</th>
        </tr>
        ${cgpaHistory
          .map(
            (record, idx) => `
          <tr style="background: white;">
            <td style="padding: 10px; border: 1px solid #232867; text-align: center;">
              ${record.semester && record.semester !== 'Custom' ? 'Semester ' + record.semester : 'Custom Subjects'}
            </td>
            <td style="padding: 10px; border: 1px solid #232867; text-align: center;">
              ${record.value.toFixed(2)}
            </td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .split("T")[0];
      const filename = `CGPA_History_${timestamp}.pdf`;

      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Storage permission denied");
        }
        const destPath =
          FileSystem.ExternalDirectoryPath +
          `/Download/${filename}`; // Save to Download folder
        await FileSystem.copyAsync({
          from: uri,
          to: destPath,
        });
        const asset = await MediaLibrary.createAssetAsync(destPath);
        let album = await MediaLibrary.getAlbumAsync("Download");
        if (!album) {
          album = await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        Alert.alert(
          "Saved Successfully! ✅",
          `PDF saved to Downloads folder!\n\nFilename: ${filename}`
        );
      } else {
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        Alert.alert(
          "Saved Successfully! ✅",
          `PDF saved to device.\n\nFilename: ${filename}`
        );
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      Alert.alert(
        "Save Failed ❌",
        "Failed to save PDF. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>🎓 CGPA History</Text>
        <Text style={styles.subtitle}>Academic Performance Tracker</Text>
      </View>

      {latestCGPA && (
        <View style={styles.latestContainer}>
          <Text style={styles.latestText}>
            Latest CGPA: {latestCGPA.value.toFixed(2)} {latestCGPA.semester && latestCGPA.semester !== 'Custom' ? `(Semester: ${latestCGPA.semester})` : '(Custom Subjects)'}
          </Text>
        </View>
      )}

      {/* Show overall average and semester count */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Overall Average CGPA: {avgCGPA}
        </Text>
        <Text style={styles.statsText}>
          Number of Semesters: {numSemesters}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {cgpaHistory.map((record, idx) => (
          <View key={idx} style={styles.cgpaRow}>
            <Text style={styles.semesterText}>
              {record.semester && record.semester !== 'Custom'
                ? `Semester ${record.semester}:`
                : 'Custom Subjects:'}
            </Text>
            <Text style={styles.cgpaText}>{record.value.toFixed(2)}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.downloadButton,
            isDownloading && styles.downloadButtonDisabled,
          ]}
          onPress={exportPDF}
          activeOpacity={0.8}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <AntDesign
                name="loading1"
                size={20}
                color="#ffffff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Saving to Downloads...</Text>
            </>
          ) : (
            <>
              <AntDesign
                name="download"
                size={20}
                color="#ffffff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Save to Downloads</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
  latestContainer: {
    backgroundColor: "#bbdefb",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  latestText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#232867",
  },
  statsContainer: {
    backgroundColor: "#e6f2ff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#232867",
    marginHorizontal: 8
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 25,
  },
  cgpaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#bbdefb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  semesterText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#232867",
  },
  cgpaText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#232867",
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
