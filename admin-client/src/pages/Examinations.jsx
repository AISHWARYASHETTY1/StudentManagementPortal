import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    } catch {
        throw new Error("Unable to connect to the server. Start the API on port 5000.");
    }
    const type = response.headers.get("content-type") || "";
    const data = type.includes("application/json") ? await response.json() : { message: await response.text() };
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
}

const initialForm = { courseId: "", examName: "", examDate: "", time: "", venue: "Main Hall" };
const formatExamTime = value => {
    if (!value) return "—";
    const text = String(value);
    if (text.includes("T")) return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
    return text.slice(0, 5);
};

const Examinations = ({ onLogout }) => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const [examData, courseData] = await Promise.all([apiFetch("/examinations"), apiFetch("/courses")]);
            setExams(examData || []);
            setCourses(courseData || []);
            setError("");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddExam = async event => {
        event.preventDefault();
        if (!formData.courseId) return setError("Choose a course before scheduling the exam.");
        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const data = await apiFetch("/examinations", { method: "POST", body: JSON.stringify({ ...formData, courseId: Number(formData.courseId) }) });
            setSuccess(data.message);
            setFormData(initialForm);
            setShowForm(false);
            await loadData();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="admin-page examinations-admin-page">
            <header className="admin-page-header">
                <div><p className="eyebrow">Academic calendar</p><h1>Examinations</h1><p className="page-subtitle">Schedule assessments with consistent course and venue details.</p></div>
                <div className="page-actions"><button className="button button-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button><button className="button button-primary" onClick={() => { setShowForm(value => !value); setError(""); }}>{showForm ? "Cancel" : "Add Examination"}</button><button className="button button-danger" onClick={onLogout}>Logout</button></div>
            </header>
            {(error || success) && <div className={error ? "notice notice-error" : "notice notice-success"}>{error || success}</div>}
            {showForm && <section className="standard-card exam-entry-card">
                <div className="card-heading"><div><h2>Schedule an examination</h2><p>New courses are available here automatically.</p></div><span className="card-badge">New schedule</span></div>
                <form onSubmit={handleAddExam}>
                    <div className="form-grid form-grid-four">
                        <label>Course<select value={formData.courseId} onChange={event => setFormData({ ...formData, courseId: event.target.value })} required><option value="">Select course code</option>{courses.map(course => <option key={course.CourseId} value={course.CourseId}>{course.CourseCode} · {course.CourseName}</option>)}</select></label>
                        <label>Assessment type<input value={formData.examName} onChange={event => setFormData({ ...formData, examName: event.target.value })} placeholder="e.g. End semester" required /></label>
                        <label>Date<input type="date" value={formData.examDate} onChange={event => setFormData({ ...formData, examDate: event.target.value })} required /></label>
                        <label>Time<input type="time" value={formData.time} onChange={event => setFormData({ ...formData, time: event.target.value })} required /></label>
                    </div>
                    <div className="form-grid form-grid-two"><label>Venue<input value={formData.venue} onChange={event => setFormData({ ...formData, venue: event.target.value })} placeholder="Main Hall" /></label></div>
                    <div className="form-footer"><span>All fields are saved to the examination calendar.</span><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save examination"}</button></div>
                </form>
            </section>}
            <section className="standard-card">
                <div className="card-heading"><div><h2>Scheduled examinations</h2><p>Upcoming assessments across all courses.</p></div><span className="card-badge">{exams.length} scheduled</span></div>
                {loading ? <p className="empty-state">Loading examinations…</p> : <div className="table-scroll"><table className="standard-table"><thead><tr><th>Course</th><th>Assessment</th><th>Date</th><th>Time</th><th>Venue</th></tr></thead><tbody>{exams.length === 0 ? <tr><td className="empty-state" colSpan="5">No examinations scheduled yet.</td></tr> : exams.map(exam => <tr key={exam.ExamId}><td><strong>{exam.CourseCode || `Course ${exam.CourseId}`}</strong><br /><small>{exam.CourseName || ""}</small></td><td>{exam.ExamName}</td><td>{new Date(exam.ExamDate).toLocaleDateString()}</td><td>{formatExamTime(exam.Time)}</td><td>{exam.Venue || "Main Hall"}</td></tr>)}</tbody></table></div>}
            </section>
        </main>
    );
};

export default Examinations;
