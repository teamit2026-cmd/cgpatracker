// services/CustomSubjectService.js - EXTENDED VERSION
import Realm from 'realm';
import RealmDB from '../RealmDB';

class CustomSubjectService {
  constructor() {
    this.realm = null;
  }

  async ensureRealm() {
    if (!this.realm || (this.realm && this.realm.isClosed)) {
      this.realm = await RealmDB.getInstance().getRealmAsync();
    }
    return this.realm;
  }

  // ============ EXISTING METHODS ============

  // Save Custom Subject
// REPLACE YOUR saveCustomSubject METHOD with this:
async saveCustomSubject(subjectData) {
  const realm = await this.ensureRealm();
  return new Promise((resolve, reject) => {
    try {
      // CRITICAL VALIDATION - PREVENT UNDEFINED DATA
      if (!subjectData) {
        throw new Error('Subject data is undefined');
      }
      
      if (!subjectData.userId) {
        throw new Error('userId is required');
      }
      
      if (!subjectData.name || !subjectData.name.trim()) {
        throw new Error('Subject name is required');
      }
      
      realm.write(() => {
        const now = new Date();
        const subject = {
          id: subjectData.id || RealmDB.getInstance().generateId(),
          userId: subjectData.userId,
          name: subjectData.name.trim(),
          code: subjectData.code?.trim() || `CUST-${Date.now()}`,
          credits: subjectData.credits ? parseFloat(subjectData.credits) : 1,
          grade: subjectData.grade || null,
          gradePoints: subjectData.gradePoints || null,
          semester: subjectData.semester || 'Custom',
          department: subjectData.department || 'Custom',
          obtainedMarks: subjectData.obtainedMarks || null,
          totalMarks: subjectData.totalMarks || null,
          createdAt: subjectData.createdAt || now,
          updatedAt: now,
          syncedWithMongo: false,
          mongoId: null,
        };
        
        console.log('✅ Saving validated subject:', subject);
        const savedSubject = realm.create('CustomSubject', subject, Realm.UpdateMode.Modified);
        resolve(savedSubject);
      });
    } catch (error) {
      console.error('❌ Error saving custom subject:', error);
      reject(error);
    }
  });
}
  // Get all custom subjects for user
  async getCustomSubjectsByUserId(userId) {
    const realm = await this.ensureRealm();
    const subjects = realm.objects('CustomSubject')
      .filtered('userId == $0', userId)
      .sorted('createdAt', true);
    try {
      return Array.from(subjects).map(s => JSON.parse(JSON.stringify(s)));
    } catch (e) {
      return Array.from(subjects).map(s => ({ ...s }));
    }
  }

  // Delete custom subject
  async deleteCustomSubject(id) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const subject = realm.objectForPrimaryKey('CustomSubject', id);
          if (subject) {
            realm.delete(subject);
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

  // ============ NEW METHODS FOR Result.js ============

  // Get custom subjects by semester and department
  async getCustomSubjectsBySemester(userId, semester, department) {
    const realm = await this.ensureRealm();
    const subjects = realm.objects('CustomSubject')
      .filtered('userId == $0 AND semester == $1 AND department == $2', userId, semester, department)
      .sorted('createdAt', true);
    try {
      return Array.from(subjects).map(s => JSON.parse(JSON.stringify(s)));
    } catch (e) {
      return Array.from(subjects).map(s => ({ ...s }));
    }
  }

  // Update custom subject
  async updateCustomSubject(subjectId, updatedData) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const subject = realm.objectForPrimaryKey('CustomSubject', subjectId);
          if (subject) {
            Object.keys(updatedData).forEach(key => {
              if (key !== 'id' && key !== 'userId') {
                subject[key] = updatedData[key];
              }
            });
            subject.updatedAt = new Date();
            resolve(subject);
          } else {
            reject(new Error('Subject not found'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============ CALCULATION HELPERS ============

  // Calculate GPA from custom subjects array
  calculateGPA(subjects) {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      totalGradePoints += subject.gradePoints * subject.credits;
      totalCredits += subject.credits;
    });

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    return {
      totalGradePoints,
      totalCredits,
      gpa: parseFloat(gpa.toFixed(2)),
      totalSubjects: subjects.length
    };
  }

  // Get grade from marks (consistent with your system)
  getGradeFromMarks(obtained, total) {
    const percentage = (obtained / total) * 100;
    
    // Match your existing grading system
    if (percentage >= 90) return { grade: 'O', points: 10.0 };
    if (percentage >= 80) return { grade: 'A+', points: 9.0 };
    if (percentage >= 70) return { grade: 'A', points: 8.0 };
    if (percentage >= 60) return { grade: 'B+', points: 7.0 };
    if (percentage >= 55) return { grade: 'B', points: 6.0 };
    if (percentage >= 50) return { grade: 'C', points: 5.0 };
    if (percentage >= 45) return { grade: 'P', points: 4.0 };
    return { grade: 'F', points: 0.0 };
  }
}

export default new CustomSubjectService();