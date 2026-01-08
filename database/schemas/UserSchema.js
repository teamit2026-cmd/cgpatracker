// database/schemas/UserSchema.js
export const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    email: 'string',
    regNo: 'string?',
    department: 'string',
    year: 'string?',
    phone: 'string?',
    isActive: { type: 'bool', default: true }, // ADD THIS PROPERTY
    createdAt: 'date',
    updatedAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: 'string?',
  },
};