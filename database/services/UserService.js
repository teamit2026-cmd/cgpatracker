// database/services/UserService.js
import Realm from 'realm';
import RealmDB from '../RealmDB';

class UserService {
  constructor() {
    this.realm = null;
  }

  async ensureRealm() {
    if (!this.realm || (this.realm && this.realm.isClosed)) {
      this.realm = await RealmDB.getInstance().getRealmAsync();
    }
    return this.realm;
  }

  // Create or update user
  async saveUser(userData) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const now = new Date();
          const user = {
            id: userData.id || RealmDB.getInstance().generateId(),
            name: userData.name,
            email: userData.email,
            regNo: userData.regNo,
            department: userData.department,
            year: userData.year,
            phone: userData.phone,
            isActive: userData.isActive !== undefined ? userData.isActive : true, // HANDLE isActive
            createdAt: userData.createdAt || now,
            updatedAt: now,
            syncedWithMongo: false,
          };
          
          const savedUser = realm.create('User', user, Realm.UpdateMode.Modified);
          resolve(savedUser);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get current active user
  async getCurrentUser() {
    const realm = await this.ensureRealm();
    const users = realm.objects('User').filtered('isActive == true').sorted('updatedAt', true);
    if (users.length > 0) {
      const u = users[0];
      try {
        return JSON.parse(JSON.stringify(u));
      } catch (e) {
        // Fallback: build plain object
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          regNo: u.regNo,
          department: u.department,
          year: u.year,
          phone: u.phone,
          isActive: u.isActive,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          syncedWithMongo: u.syncedWithMongo,
          mongoId: u.mongoId,
        };
      }
    }
    return null;
  }

  // Get user by ID
  async getUserById(id) {
    const realm = await this.ensureRealm();
    const user = realm.objectForPrimaryKey('User', id);
    if (!user) return null;
    try {
      return JSON.parse(JSON.stringify(user));
    } catch (e) {
      return { ...user };
    }
  }

  // Get all users
  async getAllUsers() {
    const realm = await this.ensureRealm();
    const users = realm.objects('User').sorted('createdAt', true);
    try {
      return Array.from(users).map(u => JSON.parse(JSON.stringify(u)));
    } catch (e) {
      return Array.from(users).map(u => ({ ...u }));
    }
  }

  // Deactivate user (soft delete)
  async deactivateUser(id) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const user = realm.objectForPrimaryKey('User', id);
          if (user) {
            user.isActive = false;
            user.updatedAt = new Date();
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete user permanently
  async deleteUser(id) {
    const realm = await this.ensureRealm();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const user = realm.objectForPrimaryKey('User', id);
          if (user) {
            realm.delete(user);
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

  // Check if user exists
  async userExists(email) {
    const realm = await this.ensureRealm();
    const users = realm.objects('User').filtered('email == $0', email);
    return users.length > 0;
  }
}

export default new UserService();