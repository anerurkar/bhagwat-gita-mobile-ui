import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/* -------------------- Interfaces -------------------- */

interface Chapter {
  chapter: number;
  title: string;
}

interface ChapterGroup {
  title: string;
  open: boolean;
  chapters: Chapter[];
}

/* -------------------- Component -------------------- */

@Component({
  selector: 'app-chapters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chapters.html',
  styleUrl: './chapters.css'
})
export class Chapters implements OnInit {

  /* -------------------- DI -------------------- */

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  /* -------------------- State -------------------- */

  loading = true;

  groups: ChapterGroup[] = [
    { title: 'Foundational Wisdom', open: true, chapters: [] },
    { title: 'Devotional Wisdom', open: false, chapters: [] },
    { title: 'Liberation Wisdom', open: false, chapters: [] }
  ];

  /* -------------------- Lifecycle -------------------- */

  ngOnInit(): void {
    console.log('CHAPTERS INIT');

    this.http
      .get<Chapter[]>(
        'https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters'
      )
      .subscribe({
        next: (chapters) => {
          console.log('CHAPTERS LOADED:', chapters.length);

          this.groups[0].chapters = chapters.filter(c => c.chapter <= 6);
          this.groups[1].chapters = chapters.filter(c => c.chapter >= 7 && c.chapter <= 12);
          this.groups[2].chapters = chapters.filter(c => c.chapter >= 13);

          this.loading = false;

          // 🔥 IMPORTANT: Force UI refresh
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('CHAPTER API FAILED', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* -------------------- UI Actions -------------------- */

 
  toggleGroup(selected: ChapterGroup): void {
  this.groups.forEach(group => {
    group.open = group === selected ? !group.open : false;
  });
}
}
