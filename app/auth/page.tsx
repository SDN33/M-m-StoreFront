'use client';

import { useState, useEffect } from 'react';
import { login, register } from '../../pages/api/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await register({ username, email, password });
      window.location.href = '/auth'; // Redirige après l'inscription
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-600">
      <div className="bg-white px-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Se Connecter' : 'S\'inscrire'}</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-fit bg-black text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {isLogin ? 'Se Connecter' : 'S\'inscrire'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? 'Pas encore inscrit ?' : 'Déjà inscrit ?'}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline ml-1">
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
