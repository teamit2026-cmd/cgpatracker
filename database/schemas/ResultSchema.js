// database/schemas/ResultSchema.js
export const ResultSchema = {
  name: 'Result',
  primaryKey: 'id',
  properties: {
    id: 'string',
    userId: { type: 'string', indexed: true }, // Indexed for filtering by user
    value: 'double', // CGPA value
    semester: { type: 'string', indexed: true }, // Indexed for semester filtering
    department: { type: 'string', optional: true, indexed: true }, // Fixed: use optional: true
    totalSubjects: 'int',
    isCustom: { type: 'bool', default: false, indexed: true }, // Indexed for custom/standard filtering
    grade: { type: 'string', optional: true },
    gradeColor: { type: 'string', optional: true },
    subjectsJSON: { type: 'string', optional: true }, // JSON string storing subject list with grades
    timestamp: { type: 'date', indexed: true }, // Indexed for sorting by date
    dateFormatted: 'string',
    timeFormatted: 'string',
    createdAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: { type: 'string', optional: true },
  },
};