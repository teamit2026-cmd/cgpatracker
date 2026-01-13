import Realm from 'realm';
import RealmDB from '../RealmDB';

// CORRECTED grade points mapping - S, A, B, C, D, E, F Standard
const gradePointsMapping = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0
};

class ResultService {
  constructor() {
    this.realm = null;
  }

  async ensureRealm() {
    if (!this.realm || (this.realm && this.realm.isClosed)) {
      this.realm = await RealmDB.getInstance().getRealmAsync();
    }
    return this.realm;
  }

  // ADD THIS METHOD TO YOUR ResultService.js
  getGradeColor(grade) {
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
  }

  // 🚀 NEW: Universal GPA calculator that works for both department and custom subjects
  calculateUniversalGPA(subjects, grades = null) {
    try {
      // Enhanced input validation
      if (!subjects) {
        // console.warn('calculateUniversalGPA: subjects is null or undefined');
        return {
          gpa: 0,
          totalGradePoints: 0,
          totalCredits: 0,
          totalSubjects: 0,
          grade: 'F'
        };
      }

      if (!Array.isArray(subjects)) {
        console.error('calculateUniversalGPA: subjects is not an array:', typeof subjects);
        return {
          gpa: 0,
          totalGradePoints: 0,
          totalCredits: 0,
          totalSubjects: 0,
          grade: 'F'
        };
      }

      if (subjects.length === 0) {
        // console.warn('calculateUniversalGPA: subjects array is empty');
        return {
          gpa: 0,
          totalGradePoints: 0,
          totalCredits: 0,
          totalSubjects: 0,
          grade: 'F'
        };
      }

      let totalGradePoints = 0;
      let totalCredits = 0;
      let validSubjects = 0;

      subjects.forEach((subject, index) => {
        // Validate subject structure
        if (!subject || typeof subject !== 'object') {
          console.warn(`calculateUniversalGPA: Invalid subject at index ${index}:`, subject);
          return; // Skip this subject
        }

        let gradePoints = 0;
        let credits = 0;

        // Handle department subjects (from CGPACalculator with grades object)
        if (grades && subject.code) {
          const gradeData = grades[subject.code];
          if (gradeData && gradeData.grade) {
            gradePoints = gradePointsMapping[gradeData.grade] || 0;
            credits = subject.credits || 0;
          }
        }
        // Handle custom subjects (from Realm with gradePoints property)
        else if (subject.gradePoints !== undefined && subject.credits) {
          gradePoints = subject.gradePoints;
          credits = subject.credits;
        }
        // Handle direct subject objects with grade property
        else if (subject.grade && subject.credits) {
          gradePoints = gradePointsMapping[subject.grade] || 0;
          credits = subject.credits;
        }

        // Validate credits is a positive number
        if (typeof credits !== 'number' || isNaN(credits) || credits <= 0) {
          console.warn(`calculateUniversalGPA: Invalid credits for subject at index ${index}:`, credits);
          return; // Skip this subject
        }

        // Check if we have both points (can be 0 for F) and credits
        if (credits > 0) {
          totalGradePoints += gradePoints * credits;
          totalCredits += credits;
          validSubjects++;
        }
      });

      const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
      const grade = this.getGradeFromGPA(gpa);

      return {
        gpa: parseFloat(gpa.toFixed(2)),
        totalGradePoints: parseFloat(totalGradePoints.toFixed(2)),
        totalCredits: parseFloat(totalCredits.toFixed(2)),
        totalSubjects: validSubjects,
        grade: grade
      };
    } catch (error) {
      console.error('❌ Critical error in calculateUniversalGPA:', error);
      return {
        gpa: 0,
        totalGradePoints: 0,
        totalCredits: 0,
        totalSubjects: 0,
        grade: 'F'
      };
    }
  }

  // 🚀 NEW: Helper method to get grade from GPA value
  getGradeFromGPA(gpa) {
    if (gpa >= 9.0) return 'S';
    if (gpa >= 8.0) return 'A';
    if (gpa >= 7.0) return 'B';
    if (gpa >= 6.0) return 'C';
    if (gpa >= 5.0) return 'D';
    if (gpa >= 4.0) return 'E';
    return 'F';
  }

  // Save CGPA Result
  async saveResult(resultData) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const now = new Date();
          // Coerce and validate fields to match Realm schema types
          const userId = resultData.userId !== undefined && resultData.userId !== null
            ? String(resultData.userId)
            : '';
          const value = resultData.value !== undefined && resultData.value !== null
            ? parseFloat(resultData.value)
            : 0;
          const semester = resultData.semester !== undefined && resultData.semester !== null
            ? String(resultData.semester)
            : '';
          const department = resultData.department !== undefined && resultData.department !== null
            ? String(resultData.department)
            : null;
          const totalSubjects = Number.isInteger(resultData.totalSubjects)
            ? resultData.totalSubjects
            : parseInt(resultData.totalSubjects) || 0;
          const isCustom = !!resultData.isCustom;
          const grade = resultData.grade !== undefined && resultData.grade !== null
            ? String(resultData.grade)
            : null;
          const gradeColor = resultData.gradeColor !== undefined && resultData.gradeColor !== null
            ? String(resultData.gradeColor)
            : null;

          const timestamp = resultData.timestamp instanceof Date ? resultData.timestamp : now;
          const dateFormatted = resultData.dateFormatted && typeof resultData.dateFormatted === 'string'
            ? resultData.dateFormatted
            : now.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          const timeFormatted = resultData.timeFormatted && typeof resultData.timeFormatted === 'string'
            ? resultData.timeFormatted
            : now.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            });

          // 🔄 OVERWRITE LOGIC: Check if a result already exists for this user/semester/department
          let id = resultData.id;

          if (!id && !isCustom) { // Only overwrite for official semesters, not custom ones
            const existing = realm.objects('Result').filtered(
              'userId == $0 AND semester == $1 AND department == $2',
              userId, semester, department
            );

            if (existing.length > 0) {
              id = existing[0].id;
              // console.log('Debug info removed for release');(`♻️ Overwriting existing result for Sem ${semester}, Dept ${department}`);
            } else {
              id = RealmDB.getInstance().generateId();
            }
          } else if (!id) {
            id = RealmDB.getInstance().generateId();
          }

          const result = {
            id,
            userId,
            value,
            semester,
            department,
            totalSubjects,
            isCustom,
            grade,
            gradeColor,
            subjectsJSON: (() => {
              try {
                return resultData.subjects ? JSON.stringify(resultData.subjects) : (resultData.subjectsJSON || '[]');
              } catch (jsonError) {
                console.error('❌ Error stringifying subjects:', jsonError);
                return '[]';
              }
            })(),
            timestamp,
            dateFormatted,
            timeFormatted,
            createdAt: now,
            syncedWithMongo: false,
          };

          const savedResult = realm.create('Result', result, Realm.UpdateMode.Modified);
          resolve(savedResult);
        });
      } catch (error) {
        console.error('❌ Error saving result:', error);
        reject(error);
      }
    });
  }

  // OPTIMIZED: Get all results for user using improved memory mapping
  async getResultsByUserId(userId) {
    try {
      const realm = await this.ensureRealm();
      const results = realm.objects('Result')
        .filtered('userId == $0', userId)
        .sorted('timestamp', true);

      // Map manually to avoid JSON.parse(JSON.stringify(r)) overhead
      // This creates lightweight plain JS objects
      return results.map(r => {
        let subjects = [];
        try {
          subjects = r.subjectsJSON ? JSON.parse(r.subjectsJSON) : [];
        } catch (e) {
          subjects = [];
        }

        return {
          id: r.id,
          userId: r.userId,
          value: r.value,
          semester: r.semester,
          department: r.department,
          totalSubjects: r.totalSubjects,
          isCustom: r.isCustom,
          grade: r.grade,
          gradeColor: r.gradeColor,
          subjects: subjects,
          timestamp: r.timestamp,
          dateFormatted: r.dateFormatted,
          timeFormatted: r.timeFormatted,
          createdAt: r.createdAt
        };
      });
    } catch (error) {
      console.error('❌ Error getting results by user ID:', error);
      return [];
    }
  }

  // OPTIMIZED: Get latest result for user
  async getLatestResult(userId) {
    try {
      const realm = await this.ensureRealm();
      const results = realm.objects('Result')
        .filtered('userId == $0', userId)
        .sorted('timestamp', true);

      if (!results || results.length === 0) return null;

      const r = results[0];

      // Manual mapping
      let subjects = [];
      try {
        subjects = r.subjectsJSON ? JSON.parse(r.subjectsJSON) : [];
      } catch (e) {
        subjects = [];
      }

      return {
        id: r.id,
        userId: r.userId,
        value: r.value,
        semester: r.semester,
        department: r.department,
        totalSubjects: r.totalSubjects,
        isCustom: r.isCustom,
        grade: r.grade,
        gradeColor: r.gradeColor,
        subjects: subjects,
        timestamp: r.timestamp,
        dateFormatted: r.dateFormatted,
        timeFormatted: r.timeFormatted,
        createdAt: r.createdAt
      };
    } catch (error) {
      console.error('❌ Error getting latest result:', error);
      return null;
    }
  }

  // OPTIMIZED: Get results for chart data
  async getResultsForChart(userId, department = null) {
    try {
      const realm = await this.ensureRealm();
      let results;

      // Using query builder for cleaner filtering
      let query = 'userId == $0 AND isCustom == false';
      let args = [userId];

      if (department) {
        query += ' AND department == $1';
        args.push(department);
      }

      results = realm.objects('Result')
        .filtered(query, ...args)
        .sorted('semester', true); // Note: String sort on 'Sem 1', 'Sem 2' might be imperfect but logic handles it elsewhere

      // Lightweight mapping - we only need basic fields for charts
      return results.map(r => ({
        id: r.id,
        value: r.value,
        semester: r.semester,
        department: r.department,
        grade: r.grade,
        timestamp: r.timestamp
      }));
    } catch (error) {
      console.error('❌ Error getting results for chart:', error);
      return [];
    }
  }

  // Delete result
  async deleteResult(id) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const result = realm.objectForPrimaryKey('Result', id);
          if (result) {
            realm.delete(result);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        console.error('❌ Error deleting result:', error);
        reject(error);
      }
    });
  }

  // Delete all results for user
  async deleteAllResults(userId) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const results = realm.objects('Result').filtered('userId == $0', userId);
          if (results.length > 0) {
            realm.delete(results);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        console.error('❌ Error deleting all results:', error);
        reject(error);
      }
    });
  }

  // Delete results by department
  async deleteResultsByDepartment(userId, department) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const results = realm.objects('Result').filtered(
            'userId == $0 AND department == $1 AND isCustom == false',
            userId, department
          );
          if (results.length > 0) {
            realm.delete(results);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        console.error('❌ Error deleting department results:', error);
        reject(error);
      }
    });
  }

  // Delete all custom results
  async deleteCustomResults(userId) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const results = realm.objects('Result').filtered(
            'userId == $0 AND isCustom == true',
            userId
          );
          if (results.length > 0) {
            realm.delete(results);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        console.error('❌ Error deleting custom results:', error);
        reject(error);
      }
    });
  }
}

export default new ResultService();