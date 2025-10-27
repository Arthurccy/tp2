import { redirect } from "next/navigation";

export default function HomePage() {
  // ✅ redirige immédiatement côté serveur
  redirect("/pages/auth/login");
}
