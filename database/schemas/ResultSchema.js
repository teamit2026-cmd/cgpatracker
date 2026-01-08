// database/schemas/ResultSchema.js
export const ResultSchema = {
  name: 'Result',
  primaryKey: 'id',
  properties: {
    id: 'string',
    userId: 'string',
    value: 'double', // ADDED (CGPA value)
    semester: 'string', // CHANGED from int to string
    department: 'string?', // ADDED
    totalSubjects: 'int', // ADDED
    isCustom: { type: 'bool', default: false }, // ADDED
    grade: 'string?', // ADDED
    gradeColor: 'string?', // ADDED
      subjectsJSON: 'string?', // Optional JSON string storing subject list with grades
    timestamp: 'date', // ADDED
    dateFormatted: 'string', // ADDED
    timeFormatted: 'string', // ADDED
    createdAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: 'string?',
  },
};