import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPoll, clearAdminState } from "../../redux/admin_slice";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, successMessage } = useSelector((state) => state.admin);

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [expiryDate, setExpiryDate] = useState("");

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, ""]);
    
    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out empty options
        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            alert("Please provide at least 2 options.");
            return;
        }

        const payload = {
            question,
            options: validOptions,
            expiry_date: expiryDate || null
        };

        dispatch(createPoll(payload)).then((res) => {
            if (!res.error) {
                setTimeout(() => {
                    dispatch(clearAdminState());
                    navigate("/admin/polls");
                }, 1500);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1 className="text-3xl font-bold mb-8">Create New Poll</h1>

            <div className="glass-card p-8" style={{ padding: '2rem' }}>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{JSON.stringify(error)}</div>}
                {successMessage && <div className="bg-green-500/20 text-green-300 p-3 rounded mb-4">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="block text-gray-400 mb-2">Poll Question</label>
                        <input 
                            type="text" 
                            className="glass-input text-lg" 
                            placeholder="e.g., What is your favorite programming language?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Options</label>
                        <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        className="glass-input" 
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required
                                    />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded">
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addOption} className="mt-3 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Plus size={16} /> Add Another Option
                        </button>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Expiry Date (Optional)</label>
                        <input 
                            type="datetime-local" 
                            className="glass-input"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10" style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                        <button type="submit" className="btn-primary w-full justify-center" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? "Creating Poll..." : "Create Poll"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
