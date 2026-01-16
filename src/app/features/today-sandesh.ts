import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-today-sandesh',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './today-sandesh.html',
  styleUrl: './today-sandesh.css'
})
export class TodaySandesh implements OnInit {

  private http = inject(HttpClient);

  shloka: any = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.http
      .get<any[]>('https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters')
      .subscribe({
        next: (chapters) => {
          const day = new Date().getDate();        // 1–31
          const chapterIndex = day % chapters.length;

          const shlokas = chapters[chapterIndex]?.shlokas;
          if (shlokas && shlokas.length > 0) {
            this.shloka = shlokas[0]; // daily shloka (stable)
          }

          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load today’s message';
          this.loading = false;
        }
      });
  }
}
