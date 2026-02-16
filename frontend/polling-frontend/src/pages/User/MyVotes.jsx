import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyVotes } from "../../redux/poll_slice";

const MyVotes = () => {
    const dispatch = useDispatch();
    const { myVotes, loading, error } = useSelector((state) => state.polls);

    useEffect(() => {
        dispatch(fetchMyVotes());
    }, [dispatch]);

    if (loading) return <div>Loading history...</div>;

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">My Voting History</h1>

            <div className="overflow-x-auto glass-card rounded-xl">
                <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="border-b border-white/10" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th className="p-4 text-gray-400 font-medium">Question</th>
                            <th className="p-4 text-gray-400 font-medium">Selected Option</th>
                            <th className="p-4 text-gray-400 font-medium">Date Voted</th>
                            <th className="p-4 text-gray-400 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myVotes.map((vote, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td className="p-4">{vote.question}</td>
                                <td className="p-4 text-blue-400">{vote.selected_option}</td>
                                <td className="p-4 text-gray-400">{new Date(vote.voted_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${vote.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {vote.is_active ? "Active" : "Closed"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myVotes.length === 0 && <div className="p-8 text-center text-gray-500">You haven't voted in any polls yet.</div>}
            </div>
        </div>
    );
};

export default MyVotes;
