import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const isInvalidCredentials = error === 'Invalid credentials' || error === 'User not found' || error === 'Wrong password';
    const isUserNotFound = error === 'User not found';
    const isWrongPassword = error === 'Wrong password';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Welcome Back</h2>

            {error && !isInvalidCredentials && <div className="mb-4 relative"><Alert message={error} onClose={() => setError('')} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (isInvalidCredentials) setError('');
                        }}
                        required
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white
                            ${isUserNotFound
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                            }`}
                    />
                    {isUserNotFound && (
                        <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">
                            Username doesn't exist
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (isInvalidCredentials) setError('');
                            }}
                            required
                            className={`w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white
                                ${isWrongPassword
                                    ? 'border-red-500 focus:ring-red-500/20'
                                    : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {isWrongPassword && (
                        <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">
                            Incorrect password
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                    Login
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;
