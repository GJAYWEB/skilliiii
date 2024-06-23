const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas
const educationSchema = new Schema({
  degree: String,
  major: String,
  institution: String,
  graduationYear: String,
  GPA: String
});

const experienceSchema = new Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  responsibilities: [String]
});

const projectSchema = new Schema({
  title: String,
  description: String,
  technologiesUsed: [String],
  role: String
});

const contactDetailsSchema = new Schema({
  email: String,
  phone: String,
  website: String,
  linkedin: String,
  github: String
});

// Define main schema
const resumeSchema = new Schema({
  personalInformation: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    dateOfBirth: Date,
    nationality: String,
    languages: [String]
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],
  projects: [projectSchema],
  contactDetails: contactDetailsSchema,
  userId: mongoose.Schema.Types.ObjectId
});

// Create model from schema
const Resume = mongoose.model('resume_Schema', resumeSchema);

module.exports = Resume;
