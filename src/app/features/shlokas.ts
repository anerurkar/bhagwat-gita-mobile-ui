import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Shloka {
  number: number;
  sanskrit: string;
  meaning: string;
  guidance: string;
}

@Component({
  selector: 'app-shlokas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shlokas.html',
  styleUrls: ['./shlokas.css']
})
export class Shlokas implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  chapterId!: number;
  shlokaNo = 1;
  totalShlokas = 18; // optionally fetch dynamically later

  loading = true;
  shloka?: Shloka;

  ngOnInit(): void {
    // Subscribe to route param changes to detect chapter change
    this.route.paramMap.subscribe(params => {
      this.chapterId = Number(params.get('id'));
      this.shlokaNo = 1; // Reset to first shloka when chapter changes
      this.loadShloka();
    });
  }

  loadShloka() {
    this.loading = true;

    const body = {
      chapter: this.chapterId,
      number: this.shlokaNo
    };

    console.log('Loading shloka:', body);

    this.http.post<Shloka>(
      'https://kshna-svc-100157816972.asia-south1.run.app/api/gita/shloka',
      body
    ).subscribe({
      next: data => {
        this.shloka = data;
        this.loading = false;
        this.cdr.markForCheck(); // trigger Angular change detection
      },
      error: err => {
        console.error('SHLOKA LOAD FAILED', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  nextShloka() {
    if (this.shlokaNo < this.totalShlokas) {
      this.shlokaNo++;
      this.loadShloka();
    }
  }

  prevShloka() {
    if (this.shlokaNo > 1) {
      this.shlokaNo--;
      this.loadShloka();
    }
  }

  nextChapter() {
    this.router.navigate(['/chapter', this.chapterId + 1]);
  }

  prevChapter() {
    if (this.chapterId > 1) {
      this.router.navigate(['/chapter', this.chapterId - 1]);
    }
  }
}
