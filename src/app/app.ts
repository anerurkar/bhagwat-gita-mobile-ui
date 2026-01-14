import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chapters } from './features/chapters';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Chapters, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  chapters: any[] = [];
  error = '';

  ngOnInit(): void {
    console.log('APP INIT – ngOnInit called');
    console.log('CALLING API:', 'https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters');

    this.http
      .get<any[]>('https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters')
      .subscribe({
        next: (data) => {
          console.log('API SUCCESS – total chapters:', data.length);
          this.chapters = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API FAILED', err);
          this.error = 'API failed';
          this.cdr.detectChanges();
        }
      });
  }
}
