import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shlokas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Shlokas – Chapter {{ chapter }}</h3>

    <div *ngIf="error" style="color:red">{{ error }}</div>

    <div *ngFor="let s of shlokas">
      <p><b>{{ s.number }}</b>. {{ s.sanskrit }}</p>
      <p><i>{{ s.meaning }}</i></p>
      <hr />
    </div>
  `
})
export class Shlokas {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  chapter!: number;
  shlokas: any[] = [];
  error = '';

 /*  ngOnInit(): void {
    this.chapter = Number(this.route.snapshot.paramMap.get('chapter'));

    this.http
      .get<any[]>('https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters')
      .subscribe({
        next: (data) => {
          const chapterData = data.find(c => c.chapter === this.chapter);
          this.shlokas = chapterData?.shlokas || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load shlokas';
          this.cdr.detectChanges();
        }
      });
  } */
  
  ngOnInit(): void {
  // Subscribe to route param changes
  this.route.paramMap.subscribe(params => {
    this.chapter = Number(params.get('chapter'));

    // Fetch chapters and filter for this chapter
    this.http
      .get<any[]>('https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters')
      .subscribe({
        next: (data) => {
          const chapterData = data.find(c => c.chapter === this.chapter);
          this.shlokas = chapterData?.shlokas || [];
          this.error = chapterData ? '' : 'Chapter not found';
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load shlokas';
          this.cdr.detectChanges();
        }
      });
  });
}
}
