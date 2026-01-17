import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookmarkService, BookmarkEntry } from './bookmark.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark.html',
  styleUrls: ['./bookmark.css']
})
export class Bookmark {

  @Input() chapter!: number;
  @Input() shloka!: number;

  private bookmarkService = inject(BookmarkService);
  private router = inject(Router);

  get allBookmarks(): BookmarkEntry[] {
    return this.bookmarkService.getAll();
  }

  get isBookmarked(): boolean {
    return this.bookmarkService.isBookmarked(this.chapter, this.shloka);
  }

  toggleBookmark() {
    if (this.isBookmarked) {
      this.bookmarkService.remove(this.chapter, this.shloka);
    } else {
      this.bookmarkService.save({ chapter: this.chapter, shloka: this.shloka });
    }
  }

  goToBookmark(entry: BookmarkEntry) {
    this.router.navigate(['/chapter', entry.chapter], {
      queryParams: { shloka: entry.shloka }
    });
  }

  resumeBookmark() {
    const last = this.bookmarkService.getLast();
    if (!last) return;
    this.router.navigate(['/chapter', last.chapter], {
      queryParams: { shloka: last.shloka }
    });
  }

  clearAll() {
    this.bookmarkService.clear();
  }
}
