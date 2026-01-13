// database/RealmDB.js
import Realm from 'realm';
import { UserSchema } from './schemas/UserSchema';
import { GradeSchema } from './schemas/GradeSchema';
import { ResultSchema } from './schemas/ResultSchema';
import { CustomSubjectSchema } from './schemas/CustomSubjectSchema';

class RealmDB {
  static instance = null;

  static getInstance() {
    if (!RealmDB.instance) {
      RealmDB.instance = new RealmDB();
    }
    return RealmDB.instance;
  }

  constructor() {
    this.realm = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return this.realm;
    }

    try {
      console.log('🔄 Initializing Realm Database...');

      this.realm = await Realm.open({
        path: 'cgpa-calculator.realm',
        schema: [
          UserSchema,
          GradeSchema,
          ResultSchema,
          CustomSubjectSchema
        ],
        schemaVersion: 5,
        migration: (oldRealm, newRealm) => {
          console.log('🔄 Running Realm migration...');

          // Migration from version 1 to 2 (original migration)
          if (oldRealm.schemaVersion < 2) {
            console.log('🔄 Migrating from version 1 to 2...');

            const oldUsers = oldRealm.objects('User');
            const newUsers = newRealm.objects('User');

            const oldResults = oldRealm.objects('Result');
            const newResults = newRealm.objects('Result');

            // Migrate Users
            for (let i = 0; i < oldUsers.length; i++) {
              const oldUser = oldUsers[i];
              const newUser = newUsers[i];

              // Copy regno to regNo
              if (oldUser.regno) {
                newUser.regNo = oldUser.regno;
              }
              // Set default year
              newUser.year = '2026';
              // Set default isActive (added in v3)
              newUser.isActive = true;
            }

            // Migrate Results
            for (let i = 0; i < oldResults.length; i++) {
              const oldResult = oldResults[i];
              const newResult = newResults[i];

              // Convert semester from int to string
              if (oldResult.semester) {
                newResult.semester = oldResult.semester.toString();
              }

              // Map old fields to new structure
              newResult.value = oldResult.cgpa || oldResult.sgpa || 0;
              newResult.department = 'Unknown';
              newResult.totalSubjects = 0;
              newResult.isCustom = false;

              // Calculate grade from CGPA
              const cgpa = oldResult.cgpa || oldResult.sgpa || 0;
              if (cgpa >= 9.0) newResult.grade = 'S';
              else if (cgpa >= 8.0) newResult.grade = 'A';
              else if (cgpa >= 7.0) newResult.grade = 'B';
              else if (cgpa >= 6.0) newResult.grade = 'C';
              else if (cgpa >= 5.0) newResult.grade = 'D';
              else if (cgpa >= 4.0) newResult.grade = 'E';
              else newResult.grade = 'F';

              // Set grade color
              const gradeColors = {
                'S': '#4CAF50', 'A': '#4CAF50', 'B': '#8BC34A',
                'C': '#FFC107', 'D': '#FF9800', 'E': '#FF5722',
                'F': '#F44336'
              };
              newResult.gradeColor = gradeColors[newResult.grade] || '#757575';

              // Set timestamps
              const now = new Date();
              newResult.timestamp = now;
              newResult.dateFormatted = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              newResult.timeFormatted = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          }

          // Migration from version 2 to 3 (for isActive property)
          if (oldRealm.schemaVersion < 3) {
            console.log('🔄 Migrating from version 2 to 3 (adding isActive)...');

            const oldUsers = oldRealm.objects('User');
            const newUsers = newRealm.objects('User');

            // Add isActive property to all existing users
            for (let i = 0; i < oldUsers.length; i++) {
              const newUser = newUsers[i];
              newUser.isActive = true; // Set all existing users as active
            }

            console.log(`✅ Added isActive to ${oldUsers.length} users`);
          }

          // Migration from version 3 to 4: add subjectsJSON to Result and migrate if possible
          if (oldRealm.schemaVersion < 4) {
            console.log('🔄 Migrating from version 3 to 4 (adding subjectsJSON to Result)...');
            const oldResults = oldRealm.objects('Result');
            const newResults = newRealm.objects('Result');
            for (let i = 0; i < oldResults.length; i++) {
              const oldR = oldResults[i];
              const newR = newResults[i];
              try {
                // If old result had a subjects array (unlikely), stringify it; otherwise default to empty array
                if (oldR.subjects) {
                  newR.subjectsJSON = JSON.stringify(oldR.subjects || []);
                } else {
                  newR.subjectsJSON = '[]';
                }
              } catch (e) {
                newR.subjectsJSON = '[]';
              }
            }
            console.log('✅ Migration to v4 completed for results');
          }

          console.log('✅ Migration completed successfully');
        },
      });

      this.isInitialized = true;
      console.log('✅ Realm database initialized successfully');
      return this.realm;

    } catch (error) {
      console.error('❌ Failed to initialize Realm database:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  // Keep your existing methods
  async getRealmAsync() {
    if (this.realm) {
      return this.realm;
    }
    return await this.initialize();
  }

  // Improved ID generation to prevent collisions
  generateId() {
    // Create a more robust UUID-like ID
    const timestamp = Date.now().toString(36);
    const randomPart1 = Math.random().toString(36).substr(2, 9);
    const randomPart2 = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${randomPart1}-${randomPart2}`;
  }

  // Close Realm instance
  close() {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
      this.isInitialized = false;
    }
  }
}

export default RealmDB;