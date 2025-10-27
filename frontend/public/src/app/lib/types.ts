export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    sujet?: string;
    pp?: string;
    role: "admin" | "user";
}

export interface Article {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    articleId: string;
    authorId: string;
    content: string;
    createdAt: string;
}
