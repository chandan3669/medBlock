import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { ShieldCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Verify = () => {
    const [searchParams] = useSearchParams();
    const initialHash = searchParams.get('hash') || '';

    const [hash, setHash] = useState(initialHash);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (initialHash) {
            handleVerify(initialHash);
        }
    }, [initialHash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (hash.trim()) {
            handleVerify(hash.trim());
        }
    };

    const handleVerify = async (hashToVerify) => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.get(`/verify/${hashToVerify}`);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. The hash might be invalid or not exist on the blockchain.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 mt-10">
            <div className="text-center">
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" aria-hidden="true" />
                <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
                    Blockchain Verification
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Verify the authenticity and integrity of a prescription record using its blockchain hash.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-100">
                <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-center">
                    <div className="w-full sm:max-w-xl">
                        <label htmlFor="hash" className="sr-only">
                            Prescription Hash
                        </label>
                        <input
                            type="text"
                            name="hash"
                            id="hash"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            className="px-4 py-3 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md bg-slate-50 border"
                            placeholder="Enter prescription hash (e.g. 0x...)"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !hash.trim()}
                        className={`mt-3 w-full inline-flex items-center justify-center px-4 py-3 border border-transparent shadow-sm font-medium rounded-md text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${loading || !hash.trim()
                                ? 'bg-primary-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                            }`}
                    >
                        {loading ? (
                            'Verifying...'
                        ) : (
                            <>
                                <MagnifyingGlassIcon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                                Verify Record
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="mt-8 border-t border-slate-200 pt-6 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Valid Record Found
                        </h3>

                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 bg-slate-50 rounded-lg p-6 border border-slate-200">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-slate-500">Predicted Disease</dt>
                                <dd className="mt-1 text-sm text-slate-900 font-semibold">{result.disease}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-slate-500">Confidence</dt>
                                <dd className="mt-1 text-sm text-slate-900">{Math.round((result.confidence || 0) * 100)}%</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-slate-500">Timestamp</dt>
                                <dd className="mt-1 text-sm text-slate-900">{new Date(result.timestamp).toLocaleString()}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-slate-500">Symptoms</dt>
                                <dd className="mt-1 text-sm text-slate-900">{result.symptoms?.join(', ')}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-slate-500">Medicines</dt>
                                <dd className="mt-1 text-sm text-slate-900">
                                    <ul className="list-disc pl-5">
                                        {result.medicines?.map((med, idx) => (
                                            <li key={idx}>{med}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
};
