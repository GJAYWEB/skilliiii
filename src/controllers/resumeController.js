const resumeSchema = require("../models/Resume_Schema");
const user_jwt_schema = require("../models/User_JWT_Schema");

exports.savePersonalInformation = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    dateOfBirth,
    nationality,
    languages,
  } = req.body;
  
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      user.personalInformation = {
        firstName: firstName || user.personalInformation.firstName,
        lastName: lastName || user.personalInformation.lastName,
        email: email || user.personalInformation.email,
        phone: phone || user.personalInformation.phone,
        address: address || user.personalInformation.address,
        dateOfBirth: dateOfBirth || user.personalInformation.dateOfBirth,
        nationality: nationality || user.personalInformation.nationality,
        languages: languages || user.personalInformation.languages,
      };
      await user.save();
      res.status(200).json({
        message: "Personal information updated successfully",
        info: user.personalInformation,
      });
    } else {
      const personalData = new resumeSchema({
        personalInformation: {
          firstName,
          lastName,
          email,
          phone,
          address,
          dateOfBirth,
          nationality,
          languages,
        },
        userId: req.user.id,
      });

      await personalData.save();
      res.status(200).json({ message: "Personal information saved successfully" });
    }
  } catch (error) {
    next(error);
  }
};

exports.saveEducationInformation = async (req, res, next) => {
  const { degree, major, institution, graduationYear, GPA } = req.body;
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      user.education = user.education || [];
      user.education[0] = {
        degree,
        major,
        institution,
        graduationYear,
        GPA,
      };

      await user.save();
      res.status(200).json({ message: "Education information saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.saveExperienceInformation = async (req, res, next) => {
  const { company, position, startDate, endDate, responsibilities } = req.body;
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      user.experience = user.experience || [];
      user.experience[0] = {
        company,
        position,
        startDate,
        endDate,
        responsibilities,
      };

      await user.save();
      res.status(200).json({ message: "Experience information saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.saveSkillsInformation = async (req, res, next) => {
  const { skills } = req.body;
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      user.skills = skills;

      await user.save();
      res.status(200).json({ message: "Skills information saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.saveProjectsInformation = async (req, res, next) => {
  const { title, description, technologiesUsed, role } = req.body;
  const tech = technologiesUsed.split(',').map(tech => tech.trim());
  
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      user.projects = user.projects || [];
      user.projects[0] = {
        title,
        description,
        technologiesUsed: tech,
        role,
      };

      await user.save();
      res.status(200).json({ message: "Projects information saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.entireResumeData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Resume data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.personalData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user.personalInformation || {});
    } else {
      res.status(404).json({ message: "Personal data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.educationData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user.education || []);
    } else {
      res.status(404).json({ message: "Education data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.experienceData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user.experience || []);
    } else {
      res.status(404).json({ message: "Experience data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.skillsData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user.skills || []);
    } else {
      res.status(404).json({ message: "Skills data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.projectsData = async (req, res, next) => {
  try {
    const user = await resumeSchema.findOne({ userId: req.user.id });
    if (user) {
      res.status(200).json(user.projects || []);
    } else {
      res.status(404).json({ message: "Projects data is not available" });
    }
  } catch (error) {
    next(error);
  }
};

exports.removeResume = async (req, res, next) => {
  try {
    const result = await resumeSchema.deleteOne({ userId: req.user.id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
