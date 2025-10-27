// src/app/lib/mockData.ts
import { User, Article } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    sujet: "all",
    pp: "/img/users/admin_pp.png",
    role: "admin"
  },
  {
    id: "2",
    username: "alice",
    email: "alice@example.com",
    password: "password",
    sujet: "quotidien",
    pp: "/img/users/alice_pp.png",
    role: "user"
  },
];

export const mockArticles: Article[] = [
  {
    id: "101",
    title: "Bienvenue sur le blog",
    content: "Ceci est le premier article de démonstration.",
    authorId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "102",
    title: "Un autre article",
    content: "Un petit article de test pour la gestion de contenu.",
    authorId: "2",
    createdAt: new Date().toISOString(),
  },
];
