//schemas/GradeSchema.js
export const GradeSchema = {
  name: 'Grade',
  primaryKey: 'id',
  properties: {
    id: 'string',
    userId: 'string',
    subjectCode: 'string',
    subjectName: 'string',
    credits: 'double',
    grade: 'string',
    gradePoints: 'double', // This will store the numerical value (10 for S, 9 for A, etc.)
    semester: 'string',
    department: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    syncedWithMongo: { type: 'bool', default: false },
    mongoId: 'string?',
  },
};