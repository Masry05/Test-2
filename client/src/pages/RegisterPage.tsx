import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Single state for both fields
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const isPasswordMismatch = error === 'Passwords do not match';
    const isUserExists = error === 'User already exists';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError(''); // Clear any previous errors
        try {
            const res = await api.post('/auth/register', { username, password });
            login(res.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Create Account</h2>

            {error && !isPasswordMismatch && !isUserExists && <div className="mb-4 relative"><Alert message={error} onClose={() => setError('')} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (isUserExists) setError('');
                        }}
                        required
                        minLength={3}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white
                            ${isUserExists
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                            }`}
                    />
                    {isUserExists && (
                        <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">
                            User already exists
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
                                if (isPasswordMismatch) setError('');
                            }}
                            required
                            minLength={6}
                            className={`w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white
                                ${isPasswordMismatch
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
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (isPasswordMismatch) setError('');
                            }}
                            required
                            minLength={6}
                            className={`w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white
                                ${isPasswordMismatch
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
                    {isPasswordMismatch && (
                        <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">
                            Passwords do not match
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                    Register
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
