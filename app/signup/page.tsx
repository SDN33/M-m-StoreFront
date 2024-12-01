"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import zod from "zod";

// Schéma de validation avancé
const SignupSchema = zod.object({
  username: zod.string()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" }),

  email: zod.string()
    .email({ message: "Format d'email invalide" })
    .max(100, { message: "L'email est trop long" }),

  password: zod.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Le mot de passe doit contenir au moins un caractère spécial"
    })
});

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Analyse de la force du mot de passe
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    return strength;
  }, [formData.password]);

  // Fonction de validation
  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    try {
      // Valide les champs principaux
      SignupSchema.parse({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } catch (validationError) {
      if (validationError instanceof zod.ZodError) {
        validationError.errors.forEach((err) => {
          newErrors[err.path[0] as keyof typeof errors] = err.message;
        });
      }
    }

    // Validation du mot de passe confirmé
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gestion du changement d'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur spécifique lors de la modification
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Soumission du formulaire
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation complète
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Appel API pour l'inscription
      await axios.post('/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Redirection après inscription réussie
      router.push("/login");
    } catch (err: unknown) {
      // Gestion des erreurs serveur
      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 409:
            setErrors({
              email: "Un compte avec cet email existe déjà",
              username: "Ce nom d'utilisateur est déjà utilisé"
            });
            break;
          case 400:
            setErrors({
              general: "Données d'inscription invalides"
            });
            break;
          default:
            setErrors({
              general: "Erreur de serveur. Veuillez réessayer."
            });
        }
      } else {
        setErrors({
          general: "Problème de connexion. Vérifiez votre réseau."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-24">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Créer un Compte
        </h2>

        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Champ Nom d'Utilisateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom d&apos;Utilisateur
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                ${errors.username ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Choisissez un nom d'utilisateur"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Champ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Votre adresse email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Champ Mot de Passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de Passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                ${errors.password ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Créez un mot de passe sécurisé"
            />
            {/* Indicateur de force du mot de passe */}
            <div className="mt-1 h-1 w-full bg-gray-200 rounded">
              <div
                className={`h-1 rounded transition-all duration-300
                  ${passwordStrength <= 2 ? 'bg-red-500' :
                    passwordStrength <= 4 ? 'bg-yellow-500' :
                    'bg-green-500'}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmation Mot de Passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmez le Mot de Passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Répétez votre mot de passe"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary
              text-white rounded-md hover:from-red-500 hover:to-rose-800
              focus:outline-none focus:ring-2 focus:ring-primary
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p className="italic mb-2">
            En vous inscrivant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
          </p>
          <a href="/login" className="text-primary hover:underline">
            Vous avez déjà un compte ? Connectez-vous
          </a>
        </div>
      </div>
      <br /><br />
    </div>
  );
}
