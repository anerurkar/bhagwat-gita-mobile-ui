import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shlokas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shlokas.html',
  styleUrl: './shlokas.css'
})
export class Shlokas implements OnInit {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  chapterNumber!: number;
  shlokas: any[] = [];
  error = '';

  ngOnInit(): void {
    this.chapterNumber = Number(this.route.snapshot.paramMap.get('chapter'));

    this.http
      .get<any[]>('https://kshna-svc-100157816972.asia-south1.run.app/api/gita/chapters')
      .subscribe({
        next: chapters => {
          const chapter = chapters.find(c => c.chapter === this.chapterNumber);
          this.shlokas = chapter?.shlokas || [];
        },
        error: () => this.error = 'Failed to load shlokas'
      });
  }
}
