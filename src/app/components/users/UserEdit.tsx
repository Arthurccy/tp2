import { useEffect, useState } from "react";
import type { User } from "../../lib/types";
import { UserCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";

interface UserEditProps {
  user?: User;
  onClose: () => void;
  onSave?: (user: User) => void;
}

export default function UserEdit({ user, onClose, onSave }: UserEditProps) {
  const [form, setForm] = useState<User>({
    id: user?.id || "",
    username: user?.username || "",
    role: user?.role || "user",
    email: user?.email || "",
    password: user?.password || "",
    sujet: user?.sujet || "",
    pp: user?.pp || "",
  });

  const [error, setError] = useState<string | null>(null);

  // ✅ synchronise si le user prop change
  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        password: user.password,
        sujet: user.sujet || "",
        pp: user.pp || "",
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, pp: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("Merci de remplir tous les champs obligatoires !");
      return;
    }

    // ✅ Toujours renvoyer un user complet avec id
    if (onSave) onSave({ ...form, id: user?.id || form.id });

    setTimeout(onClose, 200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-lg font-semibold leading-7 text-white text-center">
        {user ? "Modifier l’utilisateur" : "Ajouter un utilisateur"}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-400 text-center">
        Ces informations seront liées à votre profil.
      </p>

      <div className="mt-10 space-y-8">
        {/* Photo de profil */}
        <div className="flex flex-col items-center gap-4">
          {form.pp ? (
            <img
              src={form.pp}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-md"
            />
          ) : (
            <UserCircleIcon className="w-24 h-24 text-gray-600" />
          )}

          <label className="mt-2 flex flex-col items-center cursor-pointer">
            <span className="flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-400">
              <PhotoIcon className="w-5 h-5" />
              Sélectionner une image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium leading-6">
            Nom d’utilisateur
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium leading-6">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium leading-6">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* Sujet préféré */}
        <div>
          <label className="block text-sm font-medium leading-6">
            Sujet préféré
          </label>
          <select
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" className="bg-gray-900 text-white">
              Sélectionner...
            </option>
            <option value="all" className="bg-gray-900 text-white">
              Tous
            </option>
            <option value="quotidien" className="bg-gray-900 text-white">
              Quotidien
            </option>
            <option value="tech" className="bg-gray-900 text-white">
              Tech
            </option>
            <option value="autre" className="bg-gray-900 text-white">
              Autre
            </option>
          </select>
        </div>

        {/* Message d’erreur */}
        {error && (
          <p className="text-red-400 text-sm text-center mt-2">{error}</p>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md"
        >
          {user ? "Enregistrer" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
