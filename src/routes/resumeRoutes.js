const { Router } = require("express");
const route = Router();

const is_Authorized = require('../middlewares/is_Authorized');

const resumeController = require('../controllers/resumeController');

route.get("/api/resume", is_Authorized, resumeController.entireResumeData);

route.get("/api/resume/personal", is_Authorized, resumeController.personalData);

route.get("/api/resume/education", is_Authorized, resumeController.educationData);

route.get("/api/resume/experience", is_Authorized, resumeController.experienceData);

route.get("/api/resume/skills", is_Authorized, resumeController.skillsData);

route.get("/api/resume/projects", is_Authorized, resumeController.projectsData);

route.post("/api/resume/personal", is_Authorized, resumeController.savePersonalInformation)

route.post("/api/resume/education", is_Authorized, resumeController.saveEducationInformation);

route.post("/api/resume/experience", is_Authorized, resumeController.saveExperienceInformation);

route.post("/api/resume/skills", is_Authorized, resumeController.saveSkillsInformation);

route.post("/api/resume/projects", is_Authorized, resumeController.saveProjectsInformation);

route.delete("/api/resume/delete", is_Authorized, resumeController.removeResume);

module.exports = route;

