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
      // console.log('Debug info removed for release');('🔄 Initializing Realm Database...');

      this.realm = await Realm.open({
        path: 'cgpa-calculator.realm',
        schema: [
          UserSchema,
          GradeSchema,
          ResultSchema,
          CustomSubjectSchema
        ],
        schemaVersion: 6,
        // Since this is the first release, we don't need complex migrations yet.
        // We keep version 6 to match your current development state.
        migration: (oldRealm, newRealm) => {
          // Future migrations will go here
        },
      });

      this.isInitialized = true;
      // console.log('Debug info removed for release');('✅ Realm database initialized successfully');
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