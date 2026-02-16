import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/user_slices";
import { LogOut, PlusCircle, BarChart2, LayoutDashboard, Shield } from "lucide-react";

const AdminLayout = () => {
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
                    <Shield size={28} className="text-purple-500" />
                    Admin Panel
                </div>
                
                <nav className="flex flex-col gap-2">
                    <NavLink 
                        to="/admin/dashboard" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink 
                        to="/admin/polls" 
                        end // Exact match for list to avoid highlighting when in sub-routes like create? No, usually list is /polls, create is /polls/create. 
                        // Actually 'end' is not needed if paths are distinct. 
                        // But wait, /admin/polls/create matches /admin/polls if we use startsWith logic, but NavLink uses exact/end prop for that.
                        // Let's stick to standard behavior.
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <BarChart2 size={20} /> Manage Polls
                    </NavLink>
                    <NavLink 
                        to="/admin/polls/create" 
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <PlusCircle size={20} /> Create Poll
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-badge">
                        <div className="user-avatar">
                            A
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

export default AdminLayout;
