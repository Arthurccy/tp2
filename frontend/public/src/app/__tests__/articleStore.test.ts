import { act } from "react";
import { useArticleStore } from "@/app/store/articleStore";
import type { Article } from "@/app/lib/types";

describe("🧪 ArticleStore", () => {
  // ⚙️ Nettoyage avant chaque test
  beforeEach(() => {
    const store = useArticleStore.getState();
    store.reset(); // remet le store dans son état initial
  });

  it("doit ajouter un article", () => {
    const { add, articles } = useArticleStore.getState();

    act(() => {
      add({
        title: "Mon premier article",
        content: "Ceci est un test d'article",
        authorId: "123",
      });
    });

    const updatedArticles = useArticleStore.getState().articles;
    expect(updatedArticles.length).toBe(articles.length + 1);

    const newArticle = updatedArticles[updatedArticles.length - 1];
    expect(newArticle.title).toBe("Mon premier article");
    expect(newArticle.authorId).toBe("123");
    expect(newArticle.createdAt).toBeDefined();
  });

  it("doit mettre à jour un article existant", () => {
    const { add, update, articles } = useArticleStore.getState();

    // Crée un article à modifier
    let articleId = "";
    act(() => {
      add({
        title: "Ancien titre",
        content: "Ancien contenu",
        authorId: "1",
      });
      articleId = useArticleStore.getState().articles.slice(-1)[0].id;
    });

    act(() => {
      update(articleId, { title: "Nouveau titre" });
    });

    const updated = useArticleStore
      .getState()
      .articles.find((a) => a.id === articleId);

    expect(updated).toBeDefined();
    expect(updated?.title).toBe("Nouveau titre");
  });

  it("doit supprimer un article existant", () => {
    const { add, remove } = useArticleStore.getState();

    let articleId = "";
    act(() => {
      add({
        title: "Article à supprimer",
        content: "Contenu inutile",
        authorId: "456",
      });
      articleId = useArticleStore.getState().articles.slice(-1)[0].id;
    });

    act(() => {
      remove(articleId);
    });

    const remaining = useArticleStore.getState().articles;
    expect(remaining.find((a) => a.id === articleId)).toBeUndefined();
  });

  it("doit réinitialiser les articles à l'état par défaut", () => {
    const { add, reset } = useArticleStore.getState();

    act(() => {
      add({
        title: "Temporaire",
        content: "Pour le test",
        authorId: "999",
      });
    });

    const beforeReset = useArticleStore.getState().articles.length;
    expect(beforeReset).toBeGreaterThan(0);

    act(() => {
      reset();
    });

    const afterReset = useArticleStore.getState().articles;
    expect(afterReset.length).toBeGreaterThan(0); // mockArticles sont restaurés
  });
});
