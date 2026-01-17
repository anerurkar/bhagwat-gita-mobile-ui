import { Injectable } from '@angular/core';

export interface BookmarkEntry {
  chapter: number;
  shloka: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private STORAGE_KEY = 'gita_bookmarks';

  getAll(): BookmarkEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  save(entry: BookmarkEntry) {
    const all = this.getAll();
    if (!all.find(e => e.chapter === entry.chapter && e.shloka === entry.shloka)) {
      all.push(entry);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
  }

  remove(chapter: number, shloka: number) {
    let all = this.getAll();
    all = all.filter(e => !(e.chapter === chapter && e.shloka === shloka));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  isBookmarked(chapter: number, shloka: number): boolean {
    return this.getAll().some(e => e.chapter === chapter && e.shloka === shloka);
  }

  getLast(): BookmarkEntry | null {
    const all = this.getAll();
    return all.length ? all[all.length - 1] : null;
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
