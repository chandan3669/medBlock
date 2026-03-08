import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/history/${user?.id || 'me'}`);
                setHistory(data.records || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load history');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    if (loading) {
        return <div className="text-slate-500">Loading history...</div>;
    }

    if (error) {
        return <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Consultation History</h2>
                <p className="mt-1 text-sm text-slate-500">
                    A log of all your AI-powered symptom analyses and suggested prescriptions.
                </p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-100">
                <ul className="divide-y divide-slate-200">
                    {history.length === 0 ? (
                        <li className="p-6 text-center text-slate-500">No history records found.</li>
                    ) : (
                        history.map((record) => (
                            <li key={record.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-600 truncate">
                                            {record.disease}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Confidence: {Math.round((record.confidence || 0) * 100)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-500">
                                            <p className="flex items-center">
                                                <span className="font-medium mr-1">Symptoms:</span>
                                                {record.symptoms?.join(', ')}
                                            </p>
                                            {record.prescriptionHash && (
                                                <p className="flex items-center mt-2 sm:mt-0 text-slate-600">
                                                    <ShieldCheckIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                                                    <span className="truncate max-w-[200px] lg:max-w-[300px]" title={record.prescriptionHash}>
                                                        Hash: {record.prescriptionHash}
                                                    </span>
                                                    <Link to={`/verify?hash=${record.prescriptionHash}`} className="ml-2 text-primary-600 hover:text-primary-800 text-xs">
                                                        Verify
                                                    </Link>
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                                            <p>
                                                {new Date(record.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};
