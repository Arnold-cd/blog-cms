import type { UploadedAsset } from '../types';

const DB_NAME = 'blog_cms_idb_v1';
const STORE_NAME = 'draft_assets';
const DB_VERSION = 1;

interface StoredAssetRecord {
  name: string;
  size: number;
  type: 'image' | 'pdf';
  cmsPath: string;
  blob: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save one or more assets to IndexedDB
 */
export async function saveStoredAssets(assets: UploadedAsset[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const asset of assets) {
      const record: StoredAssetRecord = {
        name: asset.name,
        size: asset.size,
        type: asset.type,
        cmsPath: asset.cmsPath,
        blob: asset.file,
      };
      store.put(record);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save asset to IndexedDB:', err);
  }
}

/**
 * Retrieve all persisted assets and reconstruct File + Blob URLs
 */
export async function getAllStoredAssets(): Promise<UploadedAsset[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const records: StoredAssetRecord[] = request.result || [];
        const assets: UploadedAsset[] = records.map((rec) => {
          const mimeType = rec.blob.type || (rec.name.endsWith('.png') ? 'image/png' : 'image/jpeg');
          const file = new File([rec.blob], rec.name, { type: mimeType });
          const previewUrl = URL.createObjectURL(file);
          return {
            name: rec.name,
            size: rec.size,
            type: rec.type,
            cmsPath: rec.cmsPath,
            file,
            previewUrl,
          };
        });
        resolve(assets);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load assets from IndexedDB:', err);
    return [];
  }
}

/**
 * Remove an asset from IndexedDB
 */
export async function removeStoredAsset(name: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(name);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to remove asset from IndexedDB:', err);
  }
}

/**
 * Clear all assets from IndexedDB (e.g. on new post)
 */
export async function clearAllStoredAssets(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear assets in IndexedDB:', err);
  }
}
