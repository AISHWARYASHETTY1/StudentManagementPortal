import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const Profile = ({ student }) => {
    const [profile, setProfile] = useState(student);

    useEffect(() => {
        getStudentData("/profile").then(data => setProfile(data.student)).catch(console.error);
    }, []);
    return (
        <main className="dashboard-content profile-page">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>View your personal and academic information</p>
                </div>

                <div className="profile-status">
                    Active Student
                </div>
            </div>


            {/* PROFILE TOP SECTION */}
            <section className="profile-top">

                {/* PROFILE CARD */}
                <div className="profile-card">

                    <div className="large-avatar">
                        {profile?.FirstName?.charAt(0) || "S"}
                    </div>

                    <div className="profile-basic">

                        <h2>
                            {profile?.FirstName || "Student"}
                            {profile?.LastName
                                ? ` ${profile.LastName}`
                                : ""}
                        </h2>

                        <p>
                            {profile?.StudentCode || "Student Code"}
                        </p>

                        <span>
                            Computer Science & Engineering
                        </span>

                    </div>

                </div>


                {/* QUICK INFORMATION */}
                <div className="profile-summary">

                    <div className="summary-item">
                        <span>Current Semester</span>
                        <strong>Semester 5</strong>
                    </div>

                    <div className="summary-item">
                        <span>Academic Year</span>
                        <strong>2026 - 2027</strong>
                    </div>

                    <div className="summary-item">
                        <span>Program</span>
                        <strong>B.Tech</strong>
                    </div>

                    <div className="summary-item">
                        <span>Status</span>
                        <strong className="status-active">
                            Active
                        </strong>
                    </div>

                </div>

            </section>


            {/* INFORMATION GRID */}
            <section className="profile-information">

                {/* PERSONAL INFORMATION */}
                <div className="profile-info-card">

                    <div className="profile-card-heading">
                        <div>
                            <h3>Personal Information</h3>
                            <p>Your registered personal details</p>
                        </div>
                    </div>

                    <div className="details-grid">

                        <div className="detail-item">
                            <span>First Name</span>
                            <strong>
                                {profile?.FirstName || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Last Name</span>
                            <strong>
                                {profile?.LastName || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Student Code</span>
                            <strong>
                                {profile?.StudentCode || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Email</span>
                            <strong>
                                {profile?.Email || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>
                                {profile?.Phone || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Date of Birth</span>
                            <strong>
                                {student?.dateOfBirth || "Not available"}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* ACADEMIC INFORMATION */}
                <div className="profile-info-card">

                    <div className="profile-card-heading">
                        <div>
                            <h3>Academic Information</h3>
                            <p>Your current academic details</p>
                        </div>
                    </div>

                    <div className="details-grid">

                        <div className="detail-item">
                            <span>Department</span>
                            <strong>
                                {profile?.Department || "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Program</span>
                            <strong>
                                B.Tech Computer Science
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Semester</span>
                            <strong>
                                Semester 5
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Academic Year</span>
                            <strong>
                                2026 - 2027
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Admission Year</span>
                            <strong>
                                2022
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Student Status</span>
                            <strong className="status-active">
                                Active
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Profile;
