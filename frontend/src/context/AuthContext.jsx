import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage (email/password JWT OR Google user)
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // ── Email / Password login (existing JWT flow) ──────────────────────────
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // ── Google Sign-In via Firebase popup ───────────────────────────────────
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Get the Firebase ID token (can be sent to backend if needed later)
            const idToken = await firebaseUser.getIdToken();

            const userData = {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                uid: firebaseUser.uid,
                provider: 'google',
            };

            // Store in the same keys the JWT flow uses so ProtectedRoute works
            localStorage.setItem('token', idToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            // User closed the popup — not a real error
            if (err.code === 'auth/popup-closed-by-user') {
                return { success: false, cancelled: true };
            }
            return { success: false, error: err.message };
        }
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
        // Sign out of Firebase if user signed in via Google
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const u = JSON.parse(savedUser);
            if (u.provider === 'google') {
                await firebaseSignOut(auth).catch(() => { });
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
