"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AuthButton = () => {
    const { isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [cachedAuthStatus, setCachedAuthStatus] = useState<{
        authenticated: boolean;
        timestamp: number;
    } | null>(null);

    // Synchroniser l'état initial avec le cache
    useEffect(() => {
        const storedAuthStatus = localStorage.getItem('authStatus');
        if (storedAuthStatus) {
            const parsedStatus = JSON.parse(storedAuthStatus);
            const currentTime = new Date().getTime();

            // Vérifier si le cache est valide (10 minutes)
            if (currentTime - parsedStatus.timestamp < 10 * 60 * 1000) {
                setCachedAuthStatus(parsedStatus);
            } else {
                // Supprimer le cache expiré
                localStorage.removeItem('authStatus');
            }
        }
    }, []);

    // Mettre à jour le cache lorsque le statut d'authentification change
    useEffect(() => {
        if (isAuthenticated !== undefined) {
            const authStatus = {
                authenticated: isAuthenticated,
                timestamp: new Date().getTime()
            };

            localStorage.setItem('authStatus', JSON.stringify(authStatus));
            setCachedAuthStatus(authStatus);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('authStatus');
        router.push('/login');
        setIsMenuOpen(false);
    };

    // Gestion du clic en dehors du menu
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

    // Déterminer le statut d'authentification (privilégier le cache si disponible)
    const currentAuthStatus = cachedAuthStatus
        ? cachedAuthStatus.authenticated
        : isAuthenticated;

    // État de chargement
    if (isLoading) {
        return (
            <span
                className="text-sm text-white p-3 bg-black rounded-xl sm:texy-primary md:mt-0 font-semibold flex items-center gap-2"
            >
                Chargement...
            </span>
        );
    }

    // Bouton de connexion si non authentifié
    if (!currentAuthStatus) {
        return (
            <span
                onClick={() => router.push('/login')}
                className="text-sm text-white p-3 bg-black rounded-xl sm:texy-primary md:mt-0 font-semibold hover:text-primary cursor-pointer flex items-center gap-2"
            >
                Connexion
            </span>
        );
    }

    // Menu du compte authentifié
    return (
        <div className="relative -pr-2" ref={menuRef}>
            <span
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-sm text-white p-3 bg-black rounded-xl sm:texy-primary md:mt-0 font-semibold hover:text-primary cursor-pointer flex items-center gap-2 py-2"
            >
                Mon Espace
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                />
            </span>

            {isMenuOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
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
