// schemas/CustomSubjectSchema.js
export const CustomSubjectSchema = {
  name: 'CustomSubject',
  primaryKey: 'id',
  properties: {
    id: 'string',
    userId: 'string', // Reference to User
    name: 'string',
    code: 'string',
    credits: 'double',
    grade: 'string?',
    gradePoints: 'double?',
    // ADD THESE FIELDS FOR Result.js INTEGRATION:
    semester: 'string?', // For filtering by semester
    department: 'string?', // For filtering by department  
    obtainedMarks: 'double?', // For manual grade calculation
    totalMarks: 'double?', // For manual grade calculation
    createdAt: 'date',
    updatedAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: 'string?',
  },
};