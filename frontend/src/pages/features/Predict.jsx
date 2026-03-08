import { useState } from 'react';
import api from '../../services/api';
import { BeakerIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const Predict = () => {
    const [symptomInput, setSymptomInput] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleAddSymptom = (e) => {
        e.preventDefault();
        if (symptomInput.trim() && !symptoms.includes(symptomInput.trim().toLowerCase())) {
            setSymptoms([...symptoms, symptomInput.trim().toLowerCase()]);
            setSymptomInput('');
        }
    };

    const removeSymptom = (symptomToRemove) => {
        setSymptoms(symptoms.filter((s) => s !== symptomToRemove));
    };

    const handleSubmit = async () => {
        if (symptoms.length === 0) {
            return setError('Please enter at least one symptom');
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/predict', { symptoms });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze symptoms');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Symptom Analysis</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Enter your symptoms below to receive an AI-powered diagnostic prediction.
                </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border border-slate-100">
                <form onSubmit={handleAddSymptom} className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="symptom" className="sr-only">Add Symptom</label>
                        <input
                            type="text"
                            id="symptom"
                            value={symptomInput}
                            onChange={(e) => setSymptomInput(e.target.value)}
                            placeholder="e.g., headache, fever, nausea"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                        Add
                    </button>
                </form>

                <div className="mt-6 flex flex-wrap gap-2">
                    {symptoms.map((sym, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center py-1.5 pl-3 pr-2 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                        >
                            {sym}
                            <button
                                type="button"
                                onClick={() => removeSymptom(sym)}
                                className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                            >
                                <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </span>
                    ))}
                </div>

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={symptoms.length === 0 || loading}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${symptoms.length === 0 || loading
                                ? 'bg-primary-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700'
                            }`}
                    >
                        {loading ? (
                            'Analyzing...'
                        ) : (
                            <>
                                <BeakerIcon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                                Analyze Symptoms
                            </>
                        )}
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-white shadow rounded-lg p-6 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-medium text-slate-900 border-b pb-4 mb-4">
                        Analysis Results
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Predicted Disease</p>
                            <p className="mt-1 text-xl font-semibold text-slate-900">{result.disease}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">Confidence Score</p>
                            <div className="mt-2 flex items-center pr-12">
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div
                                        className="bg-primary-600 h-2.5 rounded-full"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                                <span className="ml-3 font-medium text-slate-700">
                                    {Math.round(result.confidence * 100)}%
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-slate-500 mb-2">Suggested Medicines</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                {result.medicines?.map((med, idx) => (
                                    <li key={idx}>{med}</li>
                                ))}
                            </ul>
                        </div>

                        {result.prescriptionHash && (
                            <div className="md:col-span-2 mt-4 p-4 bg-slate-50 rounded-md border border-slate-200 break-all">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Blockchain Prescription Hash</p>
                                <code className="text-sm text-slate-800 mt-1 block font-mono">{result.prescriptionHash}</code>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
