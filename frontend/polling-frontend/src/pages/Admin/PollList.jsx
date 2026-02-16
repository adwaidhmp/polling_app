import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPolls } from "../../redux/admin_slice";
import { Link } from "react-router-dom";
import { Trash2, BarChart, PlusCircle } from "lucide-react";

const AdminPollList = () => {
    const dispatch = useDispatch();
    const { polls, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminPolls());
    }, [dispatch]);

    if (loading) return <div>Loading polls...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Manage Polls</h1>
                <Link to="/admin/polls/create" className="btn-primary" style={{ textDecoration: 'none' }}>
                    <PlusCircle size={20} /> Create New Poll
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {polls.map((poll) => (
                    <div key={poll.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{poll.question}</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
                                <span style={{ color: poll.is_active ? 'var(--success)' : 'var(--danger)' }}>
                                    {poll.is_active ? "Active" : "Closed"}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link 
                                to={`/admin/polls/${poll.id}/results`}
                                style={{ 
                                    padding: '0.5rem', 
                                    background: 'rgba(59, 130, 246, 0.2)', 
                                    color: '#60a5fa', 
                                    borderRadius: '0.25rem', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.2s' 
                                }}
                                title="View Results"
                            >
                                <BarChart size={20} />
                            </Link>
                            {/* Delete functionality to be implemented if needed */}
                        </div>
                    </div>
                ))}
                {polls.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                        No polls found. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPollList;
