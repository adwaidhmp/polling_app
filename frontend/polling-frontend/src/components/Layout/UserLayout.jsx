import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/user_slices";
import { LogOut, Vote, List, PieChart } from "lucide-react";

const UserLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <PieChart size={28} className="text-blue-500" />
                    Polling App
                </div>
                
                <nav className="flex flex-col gap-2">
                    <NavLink 
                        to="/polls" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <List size={20} /> Active Polls
                    </NavLink>
                    <NavLink 
                        to="/my-votes" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <Vote size={20} /> My Votes
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-badge">
                        <div className="user-avatar">
                            {user?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{user?.full_name}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="nav-item nav-item-danger w-full justify-start"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
