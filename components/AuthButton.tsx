// components/AuthButton.js

"use client"; // Ensure this component is client-side only

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13 app router

const AuthButton = () => {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <span
            onClick={isAuthenticated ? handleLogout : () => router.push('/login')}
            className="text-sm text-white font-semibold hover:text-gray-800 cursor-pointer"
        >
            {isAuthenticated ? "Se déconnecter" : "Se connecter"}
        </span>
    );
};

export default AuthButton;
