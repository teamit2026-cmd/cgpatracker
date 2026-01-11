// database/services/GradeService.js - UPDATED
import Realm from 'realm';
import RealmDB from '../RealmDB';

// Define grade points mapping
// IN GradeService.js, UPDATE the gradePoints mapping at the top:

// CORRECTED grade points mapping - S, A, B, C, D, E, F Standard
const gradePoints = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0
};

class GradeService {
  constructor() {
    this.realm = null;
  }

  async ensureRealm() {
    if (!this.realm || (this.realm && this.realm.isClosed)) {
      this.realm = await RealmDB.getInstance().getRealmAsync();
    }
    return this.realm;
  }

  // Save department grades - FIXED: Ensure semester is stored as string
  // IN GradeService.js, UPDATE the saveGrade method:

  async saveGrade(gradeData) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        // VALIDATE REQUIRED FIELDS BEFORE REALM WRITE
        if (!gradeData.userId) throw new Error('userId is required');
        if (!gradeData.subjectCode) throw new Error('subjectCode is required');
        if (!gradeData.subjectName) throw new Error('subjectName is required');
        if (!gradeData.grade) throw new Error('grade is required');

        realm.write(() => {
          const now = new Date();
          const grade = {
            id: gradeData.id || RealmDB.getInstance().generateId(),
            userId: gradeData.userId,
            subjectCode: gradeData.subjectCode,
            subjectName: gradeData.subjectName,
            credits: gradeData.credits ? parseFloat(gradeData.credits) : 1,
            grade: gradeData.grade,
            gradePoints: gradeData.gradePoints || this.calculateGradePoints(gradeData.grade),
            semester: gradeData.semester ? gradeData.semester.toString() : '1',
            department: gradeData.department || 'Unknown',
            createdAt: gradeData.createdAt || now,
            updatedAt: now,
            syncedWithMongo: false,
            mongoId: null,
          };

          console.log('💾 Saving grade to Realm:', grade);
          const savedGrade = realm.create('Grade', grade, Realm.UpdateMode.Modified);
          resolve(savedGrade);
        });
      } catch (error) {
        console.error('❌ Error in saveGrade:', error);
        reject(error);
      }
    });
  }
  // Get grades by semester and department - FIXED: Use string for semester
  async getGradesByUserDepartmentSemester(userId, department, semester) {
    const realm = await this.ensureRealm();
    const semesterStr = semester.toString(); // CONVERT TO STRING
    const grades = realm.objects('Grade')
      .filtered('userId == $0 AND department == $1 AND semester == $2',
        userId, department, semesterStr);
    try {
      return Array.from(grades).map(g => JSON.parse(JSON.stringify(g)));
    } catch (e) {
      return Array.from(grades).map(g => ({ ...g }));
    }
  }

  // Get all grades for user
  async getGradesByUserId(userId) {
    const realm = await this.ensureRealm();
    const grades = realm.objects('Grade')
      .filtered('userId == $0', userId)
      .sorted('semester', true);
    try {
      return Array.from(grades).map(g => JSON.parse(JSON.stringify(g)));
    } catch (e) {
      return Array.from(grades).map(g => ({ ...g }));
    }
  }

  // Delete grades for a semester - FIXED: Use string for semester
  async deleteGradesBySemester(userId, department, semester) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const semesterStr = semester.toString(); // CONVERT TO STRING
          const grades = realm.objects('Grade')
            .filtered('userId == $0 AND department == $1 AND semester == $2',
              userId, department, semesterStr);
          realm.delete(grades);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete single grade
  async deleteGrade(id) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const grade = realm.objectForPrimaryKey('Grade', id);
          if (grade) {
            realm.delete(grade);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // REPLACE THE convertToRealmGrades METHOD in GradeService.js with this:

  // Helper method to convert grades object to Realm format - FIXED VERSION
  convertToRealmGrades(gradesObj, userId, department, semester, subjects) {
    const realmGrades = [];

    // CRITICAL: Validate all inputs
    if (!gradesObj || typeof gradesObj !== 'object') {
      console.error('❌ Invalid grades object:', gradesObj);
      return realmGrades;
    }

    if (!userId || !department) {
      console.error('❌ Missing required parameters - userId:', userId, 'department:', department);
      return realmGrades;
    }

    const semesterStr = semester ? semester.toString() : '1';

    // CRITICAL: Validate subjects array
    if (!subjects || !Array.isArray(subjects)) {
      console.error('❌ Invalid subjects array:', subjects);
      return realmGrades;
    }

    Object.keys(gradesObj).forEach((subjectCode) => {
      const gradeData = gradesObj[subjectCode];

      // Validate grade data exists
      if (!gradeData || !gradeData.grade) {
        console.warn(`⚠️ Missing grade data for subject: ${subjectCode}`);
        return;
      }

      // Find the subject with PROPER validation
      const subject = subjects.find(sub => sub && sub.code === subjectCode);
      if (!subject) {
        console.warn(`⚠️ Subject not found for code: ${subjectCode}`);
        return;
      }

      // VALIDATE ALL REQUIRED FIELDS BEFORE CREATING OBJECT
      if (!subject.name || !subject.credits) {
        console.warn(`⚠️ Invalid subject data for: ${subjectCode}`, subject);
        return;
      }

      const gradePointsValue = this.calculateGradePoints(gradeData.grade);

      // CREATE VALIDATED REALM OBJECT
      const realmGrade = {
        id: RealmDB.getInstance().generateId(), // ADD MISSING ID
        userId: userId,
        subjectCode: subjectCode,
        subjectName: subject.name.trim(),
        credits: parseFloat(subject.credits), // ENSURE NUMBER
        grade: gradeData.grade,
        gradePoints: gradePointsValue,
        semester: semesterStr,
        department: department.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        syncedWithMongo: false,
        mongoId: null,
      };

      console.log('✅ Creating validated grade:', realmGrade);
      realmGrades.push(realmGrade);
    });

    console.log(`✅ Converted ${realmGrades.length} valid grades for Realm`);
    return realmGrades;
  }

  // Helper method to calculate grade points from grade
  calculateGradePoints(grade) {
    return gradePoints[grade] || 0;
  }
}

export default new GradeService();