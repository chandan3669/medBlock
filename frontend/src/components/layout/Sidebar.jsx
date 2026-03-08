import { NavLink, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    BeakerIcon,
    ClockIcon,
    ShieldCheckIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Symptom Check', path: '/predict', icon: BeakerIcon },
        { name: 'History', path: '/history', icon: ClockIcon },
        { name: 'Verify Record', path: '/verify', icon: ShieldCheckIcon },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <ShieldCheckIcon className="w-8 h-8" />
                    MedBlock
                </h1>
                <p className="text-sm text-slate-500 mt-1">Health AI System</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-100">
                <div className="mb-4 px-4">
                    <p className="text-sm font-medium text-slate-900 truncate">
                        {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                        {user?.email || ''}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    type="button"
                    aria-label="Logout"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};
