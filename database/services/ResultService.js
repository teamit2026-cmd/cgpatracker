import Realm from 'realm';
import RealmDB from '../RealmDB';

// ADD THIS CONSTANT AT THE TOP
const gradePointsMapping = {
  'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0
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
      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
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

      subjects.forEach(subject => {
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

        if (gradePoints > 0 && credits > 0) {
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
      console.error('❌ Error in calculateUniversalGPA:', error);
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
          const id = resultData.id || RealmDB.getInstance().generateId();
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
            subjectsJSON: resultData.subjects ? JSON.stringify(resultData.subjects) : (resultData.subjectsJSON || '[]'),
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

  // Get all results for user
  async getResultsByUserId(userId) {
    try {
      const realm = await this.ensureRealm();
      const results = realm.objects('Result')
        .filtered('userId == $0', userId)
        .sorted('timestamp', true);
      try {
        return Array.from(results).map(r => {
          const obj = JSON.parse(JSON.stringify(r));
          try {
            obj.subjects = obj.subjectsJSON ? JSON.parse(obj.subjectsJSON) : (obj.subjects || []);
          } catch (e) {
            obj.subjects = obj.subjects || [];
          }
          return obj;
        });
      } catch (e) {
        return Array.from(results).map(r => {
          const obj = { ...r };
          try {
            obj.subjects = obj.subjectsJSON ? JSON.parse(obj.subjectsJSON) : (obj.subjects || []);
          } catch (e) {
            obj.subjects = obj.subjects || [];
          }
          return obj;
        });
      }
    } catch (error) {
      console.error('❌ Error getting results by user ID:', error);
      return [];
    }
  }

  // Get latest result for user
  async getLatestResult(userId) {
    try {
      const realm = await this.ensureRealm();
      const results = realm.objects('Result')
        .filtered('userId == $0', userId)
        .sorted('timestamp', true);
      if (!results || results.length === 0) return null;
      try {
        return JSON.parse(JSON.stringify(results[0]));
      } catch (e) {
        return { ...results[0] };
      }
    } catch (error) {
      console.error('❌ Error getting latest result:', error);
      return null;
    }
  }

  // Get results for chart data (fo.js)
  async getResultsForChart(userId, department = null) {
    try {
      const realm = await this.ensureRealm();
      // Get only non-custom results for semester-wise chart
      // If department is provided, filter by it
      let results;
      if (department) {
        results = realm.objects('Result')
          .filtered('userId == $0 AND isCustom == false AND department == $1', userId, department)
          .sorted('semester', true);
      } else {
        results = realm.objects('Result')
          .filtered('userId == $0 AND isCustom == false', userId)
          .sorted('semester', true);
      }

      try {
        return Array.from(results).map(r => JSON.parse(JSON.stringify(r)));
      } catch (e) {
        return Array.from(results).map(r => ({ ...r }));
      }
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
}

export default new ResultService();