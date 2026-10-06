import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    if (this._storage !== null) return;
    this._storage = await this.storage.create();
  }

  async set(key: string, value: any) {
    await this.init();
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    await this.init();
    return await this._storage?.get(key);
  }

  async remove(key: string) {
    await this.init();
    await this._storage?.remove(key);
  }
}