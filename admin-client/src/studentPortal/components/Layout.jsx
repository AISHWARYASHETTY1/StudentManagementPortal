import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ student, onLogout }) {
    return (
        <div className="dashboard-layout">

           <Sidebar onLogout={onLogout} />

            <div className="dashboard-main">

                <Navbar
                    student={student}
                />

                <Outlet />

            </div>

        </div>
    );
}

export default Layout;