import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPollResults } from "../../redux/admin_slice";
import { Download } from "lucide-react";
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
import api from "../../api"; // Direct api for download

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PollResults = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { pollResults, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchPollResults(id));
    }, [dispatch, id]);

    const handleDownloadCSV = async () => {
         try {
            const response = await api.get(`polls/${id}/export/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `poll_${id}_results.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading CSV", error);
        }
    };

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
        <div className="animate-fade-in max-w-5xl mx-auto" style={{ maxWidth: '64rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                     <h1 className="text-3xl font-bold">{pollResults.question}</h1>
                     <p className="text-gray-400 mt-2">Total Votes: {pollResults.total_votes}</p>
                </div>
                <button onClick={handleDownloadCSV} className="btn-primary" style={{ background: 'var(--success)' }}>
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="glass-card p-6" style={{ padding: '1.5rem' }}>
                    <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
                    <div style={{ height: '300px' }}>
                         <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }} />
                    </div>
                </div>

                <div className="glass-card p-6" style={{ padding: '1.5rem' }}>
                    <h3 className="text-xl font-semibold mb-4 text-center">Pie Chart</h3>
                     <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                         <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } } }} />
                    </div>
                </div>
            </div>

            <div className="glass-card mt-8 p-6" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pollResults.results.map((result) => (
                        <div key={result.option_id}>
                            <div className="flex justify-between mb-1" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span className="font-medium">{result.option_text}</span>
                                <span className="text-gray-400">{result.votes} votes ({result.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', height: '0.625rem' }}>
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ background: 'var(--accent-primary)', height: '100%', borderRadius: '9999px', width: `${result.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PollResults;
