import { useAuth } from '../../context/AuthContext';
import { ArrowTrendingUpIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name || 'User'}!</h1>
                <p className="mt-2 text-sm text-slate-500">
                    This is your MedBlock dashboard. Manage your health records securely via Blockchain & AI.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Quick Action: Predict */}
                <div className="bg-white overflow-hidden shadow rounded-xl border border-slate-100 hover:border-primary-300 transition-colors">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-50 p-3 rounded-lg">
                                <IdentificationIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-500 truncate">
                                        Check Symptoms
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-slate-900">
                                            Predict Disease
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                        <div className="text-sm">
                            <Link to="/predict" className="font-medium text-primary-600 hover:text-primary-900 transition-colors">
                                Start Analysis Setup &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Action: History */}
                <div className="bg-white overflow-hidden shadow rounded-xl border border-slate-100 hover:border-primary-300 transition-colors">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-50 p-3 rounded-lg">
                                <ArrowTrendingUpIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-500 truncate">
                                        Patient Records
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-slate-900">
                                            View History
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                        <div className="text-sm">
                            <Link to="/history" className="font-medium text-primary-600 hover:text-primary-900 transition-colors">
                                View Past Consultations &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
