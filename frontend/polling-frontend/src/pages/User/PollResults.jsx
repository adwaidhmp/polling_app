import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPollResults } from "../../redux/poll_slice"; // Import from poll_slice
import { ArrowLeft } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserPollResults = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pollResults, loading } = useSelector((state) => state.polls); // Use polls state

    useEffect(() => {
        dispatch(fetchPollResults(id));
    }, [dispatch, id]);

    if (loading) return <div>Loading results...</div>;
    if (!pollResults) return <div>No results found</div>;

    const chartData = {
        labels: pollResults.chart_labels,
        datasets: [
            {
                label: 'Votes',
                data: pollResults.chart_data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(139, 92, 246, 0.6)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="mb-8 text-center">
                 <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{pollResults.question}</h1>
                 <p className="text-gray-400 mt-2">Total Votes: {pollResults.total_votes}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
                    <div style={{ height: '300px' }}>
                         <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }} />
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Pie Chart</h3>
                     <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                         <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } } }} />
                    </div>
                </div>
            </div>

            <div className="glass-card mt-8 p-6">
                <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
                <div className="space-y-4">
                    {pollResults.results.map((result) => (
                        <div key={result.option_id}>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">{result.option_text}</span>
                                <span className="text-gray-400">{result.votes} votes ({result.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ background: 'var(--accent-primary)', width: `${result.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserPollResults;
