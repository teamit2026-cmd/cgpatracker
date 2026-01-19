// database/schemas/UserSchema.js
export const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    email: { type: 'string', indexed: true }, // Indexed for faster email lookups
    regNo: { type: 'string', optional: true, indexed: true }, // Fixed: use optional: true instead of ?
    department: 'string',
    regulation: { type: 'string', optional: true, default: 'R2022_23' },
    year: { type: 'string', optional: true },
    phone: { type: 'string', optional: true },
    isActive: { type: 'bool', default: true, indexed: true }, // Indexed for active user queries
    createdAt: 'date',
    updatedAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: { type: 'string', optional: true },
  },
};