"use client";
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AuthButton = () => {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Utilisez un délai minimal pour permettre le rendu initial
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        // Ajout de l'écouteur d'événements pour les clics en dehors
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
        setIsMenuOpen(false);
    };

    const handleMenuItemClick = (path: string) => {
        router.push(path);
        setIsMenuOpen(false);
    };

    // Gérer le cas de chargement
    if (isLoading) {
        return null; // ou un spinner de chargement si vous préférez
    }

    // Si non authentifié, rediriger
    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-sm !text-white p-3 bg-black rounded-xl sm:text-primary md:mt-0 font-semibold hover:text-primary cursor-pointer flex items-center gap-2 py-2"
            >
                Mon compte
                <ChevronDown size={16} />
            </button>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10"
                >
                    <button
                        onClick={() => handleMenuItemClick('/profile')}
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
            )}
        </div>
    );
};

export default AuthButton;
