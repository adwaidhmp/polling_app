import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPolls } from "../../redux/poll_slice";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { polls, loading, error } = useSelector((state) => state.polls);

    useEffect(() => {
        dispatch(fetchUserPolls());
    }, [dispatch]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Active Polls</h1>

            {loading && <div className="text-gray-400">Loading polls...</div>}
            {error && <div className="text-red-400">{JSON.stringify(error)}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {polls.map((poll) => (
                   poll.is_active && (
                    <Link to={`/polls/${poll.id}`} key={poll.id} style={{ textDecoration: 'none' }}>
                        <div className="glass-card p-6 h-full hover:bg-white/5 transition duration-200" style={{ padding: '1.5rem' }}>
                            <h3 className="text-xl font-semibold mb-3 text-white">{poll.question}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                <Clock size={16} />
                                <span>Expires: {poll.expiry_date ? new Date(poll.expiry_date).toLocaleDateString() : "Never"}</span>
                            </div>
                            <div className="mt-4 text-blue-400 text-sm font-medium">Vote Now →</div>
                        </div>
                    </Link>
                   )
                ))}
                {!loading && polls.length === 0 && (
                    <p className="text-gray-400">No active polls at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
