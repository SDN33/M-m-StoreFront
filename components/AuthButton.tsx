"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AuthButton = () => {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        router.push('/login');
        setIsMenuOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isAuthenticated) {
        return (
            <span
                onClick={() => router.push('/login')}
                className="text-sm text-white font-semibold hover:text-gray-800 cursor-pointer flex items-center gap-2"
            >
                <User size={16} />
                Se connecter
            </span>
        );
    }

    return (
        <div className="relative md:z-40" ref={menuRef}>
            <span
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sm text-primary md:text-white font-semibold hover:text-gray-800 cursor-pointer flex items-center gap-2"
            >
              <User size={16} />
              Mon compte
              <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </span>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                router.push('/profile');
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <User size={16} />
                            Mon profil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthButton;
