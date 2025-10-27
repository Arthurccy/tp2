/**
 * @file commentStore.test.ts
 * 🧪 Tests unitaires du store Zustand : useCommentStore
 */

import { act } from "react";
import { useCommentStore } from "../store/commentStore";

// Mock de localStorage (important pour éviter les erreurs dans Jest)
beforeAll(() => {
  const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
});

describe("🧩 useCommentStore", () => {
  beforeEach(() => {
    useCommentStore.getState().reset();
  });

  it("✅ doit ajouter un commentaire", () => {
    act(() => {
      useCommentStore.getState().add({
        articleId: "a1",
        author: "Alice",
        content: "Super article !",
      });
    });

    const comments = useCommentStore.getState().comments;
    expect(comments.length).toBe(1);
    expect(comments[0].content).toBe("Super article !");
    expect(comments[0].articleId).toBe("a1");
  });

  it("✅ doit supprimer un commentaire par id", () => {
    let idToRemove = "";

    act(() => {
      useCommentStore.getState().add({
        articleId: "a1",
        author: "Bob",
        content: "Intéressant !",
      });
      idToRemove = useCommentStore.getState().comments[0].id;
    });

    act(() => {
      useCommentStore.getState().remove(idToRemove);
    });

    const comments = useCommentStore.getState().comments;
    expect(comments.length).toBe(0);
  });

  it("✅ doit retourner les commentaires d’un article précis", () => {
    act(() => {
      useCommentStore.getState().add({
        articleId: "a1",
        author: "User1",
        content: "Commentaire 1",
      });
      useCommentStore.getState().add({
        articleId: "a2",
        author: "User2",
        content: "Commentaire 2",
      });
      useCommentStore.getState().add({
        articleId: "a1",
        author: "User3",
        content: "Commentaire 3",
      });
    });

    const commentsA1 = useCommentStore.getState().getByArticle("a1");
    const commentsA2 = useCommentStore.getState().getByArticle("a2");

    expect(commentsA1.length).toBe(2);
    expect(commentsA2.length).toBe(1);
    expect(commentsA1[0].articleId).toBe("a1");
  });

  it("✅ doit réinitialiser tous les commentaires", () => {
    act(() => {
      useCommentStore.getState().add({
        articleId: "a3",
        author: "Testeur",
        content: "Reset test",
      });
    });

    expect(useCommentStore.getState().comments.length).toBe(1);

    act(() => {
      useCommentStore.getState().reset();
    });

    expect(useCommentStore.getState().comments.length).toBe(0);
  });
});
