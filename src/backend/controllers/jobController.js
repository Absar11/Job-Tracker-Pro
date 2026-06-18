import { dbService } from "../services/dbService.js";
import { JobStatus, JobType } from "../models/Job.js";

// Create Job
export const createJob = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized login required." });
  }

  const { company, role, salary, location, status, notes, applicationDate, jobUrl, jobType } = req.body;

  if (!company || !role) {
    return res.status(400).json({ success: false, message: "Company name and role are required." });
  }

  // Validate status
  if (status && !Object.values(JobStatus).includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status option. Must be one of: ${Object.values(JobStatus).join(", ")}` });
  }

  // Validate Job Type
  if (jobType && !Object.values(JobType).includes(jobType)) {
    return res.status(400).json({ success: false, message: `Invalid job type option. Must be one of: ${Object.values(JobType).join(", ")}` });
  }

  try {
    const job = await dbService.createJob({
      userId: req.user.id,
      company,
      role,
      salary: salary || "",
      location: location || "",
      status: status || JobStatus.APPLIED,
      notes: notes || "",
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      jobUrl: jobUrl || "",
      jobType: jobType || JobType.FULL_TIME,
    });

    return res.status(201).json({
      success: true,
      message: "Job application added successfully.",
      job,
    });
  } catch (error) {
    console.error("Create job failure:", error);
    return res.status(500).json({ success: false, message: "Error adding job application." });
  }
};

// Get List of Jobs with Filters, Search, and Pagination
export const getJobs = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const { search, status, company, sort, page, limit } = req.query;

  try {
    const results = await dbService.findJobs(req.user.id, {
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      company: company ? String(company) : undefined,
      sort: sort ? String(sort) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Get jobs failure:", error);
    return res.status(500).json({ success: false, message: "Error fetching job applications." });
  }
};

// View Individual Job Details
export const getJobById = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const { id } = req.params;

  try {
    const job = await dbService.findJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job application not found." });
    }

    if (String(job.userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to view this application." });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error retrieving job details." });
  }
};

// Edit Job Application
export const updateJob = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const { id } = req.params;
  const { company, role, salary, location, status, notes, applicationDate, jobUrl, jobType } = req.body;

  try {
    const job = await dbService.findJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job application not found" });
    }

    if (String(job.userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized modification attempt." });
    }

    // Validate Status
    if (status && !Object.values(JobStatus).includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value provided" });
    }

    const updatedFields = {};
    if (company) updatedFields.company = company;
    if (role) updatedFields.role = role;
    if (salary !== undefined) updatedFields.salary = salary;
    if (location !== undefined) updatedFields.location = location;
    if (status) updatedFields.status = status;
    if (notes !== undefined) updatedFields.notes = notes;
    if (applicationDate) updatedFields.applicationDate = new Date(applicationDate);
    if (jobUrl !== undefined) updatedFields.jobUrl = jobUrl;
    if (jobType) updatedFields.jobType = jobType;

    const updatedJob = await dbService.updateJob(id, req.user.id, updatedFields);

    return res.status(200).json({
      success: true,
      message: "Job details updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job failure:", error);
    return res.status(500).json({ success: false, message: "Error updating job application" });
  }
};

// Delete Job Application
export const deleteJob = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const { id } = req.params;

  try {
    const job = await dbService.findJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job application not found" });
    }

    if (String(job.userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized deletion attempt" });
    }

    await dbService.deleteJob(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Job application deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting job application" });
  }
};

// Dashboard stats endpoints
export const getDashboardAnalytics = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const analytics = await dbService.getDashboardAnalytics(req.user.id);
    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Failed loading dashboard metrics:", error);
    return res.status(500).json({ success: false, message: "Server error compiling dashboard analytics" });
  }
};
