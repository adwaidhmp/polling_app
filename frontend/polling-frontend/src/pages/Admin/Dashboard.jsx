import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../redux/admin_slice";
import { Users, BarChart2, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { dashboardStats, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminDashboard());
    }, [dispatch]);

    if (loading) return <div className="text-white">Loading stats...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                Dashboard Overview
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Polls</p>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{dashboardStats?.total_polls || 0}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', color: '#60a5fa' }}>
                        <BarChart2 size={24} />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Polls</p>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{dashboardStats?.active_polls || 0}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '0.5rem', color: '#c084fc' }}>
                        <BarChart2 size={24} />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Votes</p>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{dashboardStats?.total_votes || 0}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '0.5rem', color: '#4ade80' }}>
                        <CheckCircle size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
