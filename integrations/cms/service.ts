/**
 * API-based CRUD service — talks to Astro API routes backed by SQLite.
 */

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

const BASE = '/api';

export class BaseCrudService {
  static async getAll<T extends { _id: string }>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions,
    filters?: Record<string, string>
  ): Promise<PaginatedResult<T>> {
    const params = new URLSearchParams();
    if (filters) Object.entries(filters).forEach(([k, v]) => params.set(k, v));

    const res = await fetch(`${BASE}/${collectionId}?${params}`);
    if (!res.ok) throw new Error(`Failed to fetch ${collectionId}`);
    const items: T[] = await res.json();

    const limit = pagination?.limit ?? 50;
    const skip = pagination?.skip ?? 0;
    const sliced = items.slice(skip, skip + limit);

    return {
      items: sliced,
      totalCount: items.length,
      hasNext: skip + limit < items.length,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: skip + limit < items.length ? skip + limit : null,
    };
  }

  static async getById<T extends { _id: string }>(
    collectionId: string,
    itemId: string,
  ): Promise<T | null> {
    const res = await fetch(`${BASE}/${collectionId}/${itemId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch ${collectionId}/${itemId}`);
    return res.json();
  }

  static async create<T extends { _id?: string }>(
    collectionId: string,
    itemData: Partial<T>
  ): Promise<T> {
    const res = await fetch(`${BASE}/${collectionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error(`Failed to create ${collectionId}`);
    return res.json();
  }

  static async update<T extends { _id: string }>(
    collectionId: string,
    itemData: Partial<T> & { _id: string }
  ): Promise<T> {
    const { _id, ...rest } = itemData;
    const res = await fetch(`${BASE}/${collectionId}/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });
    if (!res.ok) throw new Error(`Failed to update ${collectionId}/${_id}`);
    return res.json();
  }

  static async delete<T extends { _id: string }>(
    collectionId: string,
    itemId: string
  ): Promise<T> {
    const res = await fetch(`${BASE}/${collectionId}/${itemId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete ${collectionId}/${itemId}`);
    return res.json();
  }
}
