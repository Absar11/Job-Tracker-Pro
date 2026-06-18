import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jobApi } from "../services/api.js";
import { useToast } from "../components/Toast.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { JobStatus, JobType } from "../types.js";
import {
  ArrowLeft,
  Building2,
  Bookmark,
  MapPin,
  CircleDollarSign,
  Link2,
  Calendar,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

export const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(JobStatus.APPLIED);
  const [jobType, setJobType] = useState(JobType.FULL_TIME);
  const [notes, setNotes] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [applicationDate, setApplicationDate] = useState("");

  const fetchJobDetails = async () => {
    if (!id) return;
    try {
      const res = await jobApi.getById(id);
      if (res.success && res.job) {
        const j = res.job;
        setCompany(j.company);
        setRole(j.role);
        setSalary(j.salary || "");
        setLocation(j.location || "");
        setStatus(j.status);
        setJobType(j.jobType || JobType.FULL_TIME);
        setNotes(j.notes || "");
        setJobUrl(j.jobUrl || "");
        setApplicationDate(new Date(j.applicationDate).toISOString().split("T")[0]);
      } else {
        toast(res.message || "Could not retrieve application details.", "error");
        navigate("/jobs");
      }
    } catch (err) {
      toast(err.message || "Failed loading job info. Redirecting...", "error");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) return;
    if (!company || !role) {
      toast("Please core company name and role designation.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await jobApi.update(id, {
        company,
        role,
        salary,
        location,
        status,
        notes,
        applicationDate: new Date(applicationDate).toISOString(),
        jobUrl,
        jobType,
      });

      if (res.success) {
        toast("Application updated successfully!", "success");
        navigate("/jobs");
      } else {
        toast(res.message || "Could not compile updates.", "error");
      }
    } catch (err) {
      toast(err.message || "Network write error", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back link */}
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Application Directory
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-16 shadow-sm text-center flex flex-col items-center justify-center min-h-[350px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <span className="text-slate-500 font-semibold text-sm">Querying application files...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-205 rounded-2xl shadow-sm p-6 lg:p-8"
          >
            <div className="mb-6 pb-5 border-b border-slate-105">
              <h2 className="text-xl font-bold text-slate-850 tracking-tight">Modify Job Application</h2>
              <p className="text-xs text-slate-400 font-medium">Update the progression details of your career track</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Job Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-755 uppercase tracking-wide mb-1.5">
                    Job Designation <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455">
                      <Bookmark className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Job Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Remote"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Salary Package */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Salary Package Offered
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                      <CircleDollarSign className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $120k/yr"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-755 uppercase tracking-wide mb-1.5">
                    Active Pipeline Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer text-slate-800"
                  >
                    {Object.values(JobStatus).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job type selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Job Schedule Class
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer text-slate-800"
                  >
                    {Object.values(JobType).map((jt) => (
                      <option key={jt} value={jt}>
                        {jt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Application Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Application Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      type="date"
                      value={applicationDate}
                      onChange={(e) => setApplicationDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Job url */}
                <div>
                  <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                    Job Details URL
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                      <Link2 className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-750 uppercase tracking-wide mb-1.5">
                  Notes & Interview Highlights
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-slate-450">
                    <FileText className="w-4 h-4" />
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record notes..."
                    className="w-full pl-10 pr-4 py-3 h-32 rounded-xl border border-slate-205 text-sm font-medium focus:ring-2 focus:ring-blue-105 focus:border-blue-500 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Submit banner */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <Link
                  to="/jobs"
                  className="px-5 py-2.5 rounded-xl border border-slate-205 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Updates
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-white border-blue-500 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Application Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};
