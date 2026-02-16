import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPollDetail, votePoll, clearPollError } from "../../redux/poll_slice";
import { CheckCircle } from "lucide-react";

const PollDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentPoll, loading, error, voteSuccess } = useSelector((state) => state.polls);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        dispatch(fetchPollDetail(id));
        return () => dispatch(clearPollError());
    }, [dispatch, id]);

    // useEffect for voteSuccess redirect removed as per user request.

    const handleVote = () => {
        if (selectedOption) {
            dispatch(votePoll({ pollId: id, optionId: selectedOption }));
        }
    };

    if (loading) return <div>Loading poll...</div>;
    if (!currentPoll) return <div className="text-red-400">Poll not found</div>;

    return (
        <div className="animate-fade-in max-w-2xl mx-auto" style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="glass-card p-8" style={{ padding: '2rem' }}>
                <h1 className="text-2xl font-bold mb-6">{currentPoll.question}</h1>

                {error && (
                    <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-medium">
                            <span className="text-xl">⚠️</span> {error.error || "An error occurred"}
                        </div>
                        {error.error === "Already voted" && (
                            <button 
                                onClick={() => navigate(`/polls/${id}/results`)}
                                className="text-sm bg-red-500/20 hover:bg-red-500/30 text-white py-2 px-4 rounded w-fit transition self-start"
                            >
                                View Results &rarr;
                            </button>
                        )}
                    </div>
                )}
                {voteSuccess && (
                    <div className="p-4 mb-6 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg flex flex-col gap-2 animate-fade-in">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle size={20}/> Vote Submitted Successfully!
                        </div>
                        <button 
                            onClick={() => navigate(`/polls/${id}/results`)}
                            className="text-sm bg-green-500/20 hover:bg-green-500/30 text-white py-2 px-4 rounded w-fit transition self-start mt-2"
                        >
                            View Results &rarr;
                        </button>
                    </div>
                )}
                
                {/* View Results Button (Always visible if no error/success for quick access, or keep it always?) 
                    Actually, if success is shown, we give a button there. 
                    If error is already voted, we give a button there.
                    Let's keep the bottom one for general access.
                */}
                <div className="flex justify-end mb-4">
                     <button 
                        onClick={() => navigate(`/polls/${id}/results`)}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        View Current Results
                    </button>
                </div>

                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentPoll.options.map((option) => (
                        <label 
                            key={option.id} 
                            className={`flex items-center gap-4 p-4 rounded cursor-pointer transition border ${selectedOption === option.id ? 'bg-blue-600/20 border-blue-500' : 'hover:bg-white/5 border-transparent'}`}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem', 
                                padding: '1rem', 
                                borderRadius: '0.5rem',
                                border: selectedOption === option.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                background: selectedOption === option.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                            }}
                        >
                            <input 
                                type="radio" 
                                name="poll-option" 
                                value={option.id} 
                                onChange={() => setSelectedOption(option.id)}
                                className="w-5 h-5 text-blue-500 accent-blue-500"
                            />
                            <span className="text-lg">{option.text}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleVote}
                        disabled={!selectedOption || loading || voteSuccess}
                        className="btn-primary"
                        style={{ opacity: (!selectedOption || loading) ? 0.5 : 1, cursor: (!selectedOption || loading) ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? "Submitting..." : "Submit Vote"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PollDetail;
