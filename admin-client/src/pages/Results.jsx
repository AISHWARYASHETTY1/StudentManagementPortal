import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: { "Content-Type": "application/json", ...(options.headers || {}) }
        });
    } catch {
        throw new Error("Unable to connect to the server. Start the API on port 5000.");
    }
    const type = response.headers.get("content-type") || "";
    const data = type.includes("application/json") ? await response.json() : { message: await response.text() };
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
}

const today = new Date().toISOString().slice(0, 10);

const Results = ({ onLogout }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [courseId, setCourseId] = useState("");
    const [maxMarks, setMaxMarks] = useState("100");
    const [examType, setExamType] = useState("Exam");
    const [examDate, setExamDate] = useState(today);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadPage = async () => {
        try {
            setLoading(true);
            const [courseData, resultData] = await Promise.all([apiFetch("/courses"), apiFetch("/students/marks")]);
            setCourses(courseData || []);
            setResults(resultData || []);
            setError("");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPage(); }, []);

    const selectedCourse = courses.find(course => course.CourseId === Number(courseId));
    const average = useMemo(() => {
        if (!results.length) return 0;
        return Math.round(results.reduce((total, result) => total + (Number(result.MarksObtained) / Number(result.MaxMarks || 1)) * 100, 0) / results.length);
    }, [results]);

    const selectCourse = async value => {
        setCourseId(value);
        setStudents([]);
        setMarks({});
        setSuccess("");
        setError("");
        if (!value) return;
        try {
            setLoadingStudents(true);
            const data = await apiFetch(`/attendance/course/students?courseId=${encodeURIComponent(value)}`);
            setStudents(data.students || []);
            const initialMarks = {};
            (data.students || []).forEach(student => { initialMarks[student.StudentId] = ""; });
            setMarks(initialMarks);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoadingStudents(false);
        }
    };

    const saveResults = async event => {
        event.preventDefault();
        const maximum = Number(maxMarks);
        if (!courseId || !students.length) return setError("Select a course with enrolled students first.");
        if (!Number.isFinite(maximum) || maximum <= 0) return setError("Maximum marks must be greater than zero.");
        const entries = students.map(student => ({ studentId: student.StudentId, marks: marks[student.StudentId] }));
        if (entries.some(entry => entry.marks === "" || Number(entry.marks) < 0 || Number(entry.marks) > maximum)) return setError(`Enter marks between 0 and ${maximum} for every student.`);
        try {
            setSaving(true);
            setError("");
            const data = await apiFetch("/students/marks/bulk", { method: "POST", body: JSON.stringify({ courseId: Number(courseId), maxMarks: maximum, examType, examDate, results: entries }) });
            setSuccess(data.message);
            await loadPage();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="admin-page results-admin-page">
            <header className="admin-page-header">
                <div><p className="eyebrow">Academic records</p><h1>Results management</h1><p className="page-subtitle">Publish marks for a complete course in one step.</p></div>
                <div className="page-actions"><button className="button button-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button><button className="button button-danger" onClick={onLogout}>Logout</button></div>
            </header>
            {(error || success) && <div className={error ? "notice notice-error" : "notice notice-success"}>{error || success}</div>}
            <section className="results-stat-grid">
                <div className="standard-card"><span className="card-label">Courses</span><strong>{courses.length}</strong><small>Available for publishing</small></div>
                <div className="standard-card"><span className="card-label">Published records</span><strong>{results.length}</strong><small>All students and exams</small></div>
                <div className="standard-card"><span className="card-label">Average score</span><strong>{average}%</strong><small>Across published results</small></div>
            </section>
            <section className="standard-card result-entry-card">
                <div className="card-heading"><div><h2>Publish course results</h2><p>Select a course to load its enrolled students.</p></div><span className="card-badge">Bulk entry</span></div>
                <form onSubmit={saveResults}>
                    <div className="form-grid form-grid-four">
                        <label>Course<select value={courseId} onChange={event => selectCourse(event.target.value)}><option value="">Select course code</option>{courses.map(course => <option key={course.CourseId} value={course.CourseId}>{course.CourseCode} · {course.CourseName}</option>)}</select></label>
                        <label>Maximum marks<input type="number" min="1" step="0.01" value={maxMarks} onChange={event => setMaxMarks(event.target.value)} /></label>
                        <label>Assessment type<input value={examType} onChange={event => setExamType(event.target.value)} placeholder="e.g. Midterm" /></label>
                        <label>Assessment date<input type="date" value={examDate} onChange={event => setExamDate(event.target.value)} /></label>
                    </div>
                    {selectedCourse && <div className="selected-course"><strong>{selectedCourse.CourseCode}</strong><span>{selectedCourse.CourseName}</span><em>{students.length} enrolled</em></div>}
                    {loadingStudents && <p className="empty-state">Loading enrolled students…</p>}
                    {!loadingStudents && courseId && !students.length && <p className="empty-state">No active students are enrolled in this course.</p>}
                    {students.length > 0 && <>
                        <div className="table-scroll"><table className="standard-table"><thead><tr><th>#</th><th>Student</th><th>Student code</th><th>Marks / {maxMarks || "—"}</th><th>Percentage</th></tr></thead><tbody>{students.map((student, index) => { const value = marks[student.StudentId]; const percentage = value === "" || !maxMarks ? "—" : `${((Number(value) / Number(maxMarks)) * 100).toFixed(1)}%`; return <tr key={student.StudentId}><td>{index + 1}</td><td><strong>{student.FirstName} {student.LastName}</strong></td><td>{student.StudentCode}</td><td><input className="marks-input" type="number" min="0" max={maxMarks} step="0.01" value={value} onChange={event => setMarks(previous => ({ ...previous, [student.StudentId]: event.target.value }))} required /></td><td><span className="percentage-pill">{percentage}</span></td></tr>; })}</tbody></table></div>
                        <div className="form-footer"><span>Review all marks before publishing.</span><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Publishing…" : `Publish ${students.length} results`}</button></div>
                    </>}
                </form>
            </section>
            <section className="standard-card">
                <div className="card-heading"><div><h2>Published results</h2><p>Latest marks saved to the student portal.</p></div></div>
                {loading ? <p className="empty-state">Loading results…</p> : <div className="table-scroll"><table className="standard-table"><thead><tr><th>Student</th><th>Course</th><th>Assessment</th><th>Date</th><th>Score</th><th>Percentage</th></tr></thead><tbody>{results.length === 0 ? <tr><td className="empty-state" colSpan="6">No results published yet.</td></tr> : results.map(result => <tr key={result.MarkId}><td><strong>{result.StudentName || result.StudentCode || `Student ${result.StudentId}`}</strong></td><td>{result.CourseCode || `Course ${result.CourseId}`}</td><td>{result.ExamType || "Exam"}</td><td>{new Date(result.ExamDate).toLocaleDateString()}</td><td>{result.MarksObtained} / {result.MaxMarks}</td><td><span className="percentage-pill">{((Number(result.MarksObtained) / Number(result.MaxMarks || 1)) * 100).toFixed(1)}%</span></td></tr>)}</tbody></table></div>}
            </section>
        </main>
    );
};

export default Results;
