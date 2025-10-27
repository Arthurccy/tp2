// src/app/lib/userIndex.ts
import { mockUsers } from './mockData';
export const userById = Object.fromEntries(
    mockUsers.map(u => [u.id, u.username])
) as Record<string, string>;
