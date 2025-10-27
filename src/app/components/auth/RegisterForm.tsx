"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useAuthStore } from "@/app/store/authStore";
import { Mail, Lock, User as UserIcon, UserPlus, CheckCircle } from "lucide-react";

export const RegisterForm = () => {
  const router = useRouter();
  const addUser = useUserStore((state) => state.addUser);

  useEffect(() => {
    const { user } = useAuthStore.getState();
    if (user) router.push("/pages/articles");
  }, [router]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password } = form;
    if (!username || !email || !password) {
      alert("Merci de remplir tous les champs !");
      return;
    }

    addUser({
      username,
      email,
      password,
    });

    alert("Inscription réussie !");
    router.push("/pages/auth/login");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Créer un compte
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Rejoignez notre communauté de créateurs de contenu
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <div className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom d&apos;utilisateur
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                name="username"
                placeholder="johndoe"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Minimum 8 caractères recommandés
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Créer mon compte
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Déjà inscrit ?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/pages/auth/login"
          className="block text-center py-3 px-4 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-semibold rounded-xl transition-all"
        >
          Se connecter
        </Link>
      </form>

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        En créant un compte, vous acceptez nos{" "}
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          conditions d&apos;utilisation
        </span>
      </p>
    </div>
  );
};