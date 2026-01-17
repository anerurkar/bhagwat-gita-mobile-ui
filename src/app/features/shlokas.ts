import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Bookmark } from './bookmark';

interface Shloka {
  number: number;
  sanskrit: string;
  meaning: string;
  guidance: string;
}

@Component({
  selector: 'app-shlokas',
  standalone: true,
  imports: [CommonModule, RouterModule, Bookmark],
  templateUrl: './shlokas.html',
  styleUrls: ['./shlokas.css']
})
export class Shlokas implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  chapterId!: number;

  // 🔹 KEEP TEMPLATE COMPATIBILITY
  shlokaNo = 1;

  totalShlokas = 1;
  loading = true;
  shloka?: Shloka;

  
  
  ngOnInit(): void {

  let lastChapterId = 0;

  this.route.paramMap.subscribe(params => {
    const newChapterId = Number(params.get('id')) || 1;

    // Reset shlokaNo only if chapter changed
    if (newChapterId !== lastChapterId) {
      this.shlokaNo = 1;
      lastChapterId = newChapterId;
    }

    this.chapterId = newChapterId;

    // Load shloka
    this.loadShloka();
  });

  // 🔹 Resume / Go bookmark (query param)
  this.route.queryParamMap.subscribe(params => {
    const s = params.get('shloka');

    // Only set shlokaNo from query param if it is valid for current chapter
    if (s) {
      const sh = +s;
      if (sh >= 1 && sh <= this.totalShlokas) {
        this.shlokaNo = sh;
        this.loadShloka();
      }
    }
  });
}
  

  // ===============================
  // 🔹 LOAD SHLOKA
  // ===============================
  loadShloka() {
  this.loading = true;

  const body = {
    chapter: this.chapterId,
    number: this.shlokaNo
  };

  this.http.post<Shloka>(
    'https://kshna-svc-100157816972.asia-south1.run.app/api/gita/shloka',
    body
  ).subscribe({
    next: data => {
      this.shloka = data;

      // 🔹 Fetch total shlokas dynamically for this chapter
      this.http.get<number>(`http://localhost:8080/api/gita/chapter/${this.chapterId}/count`)
        .subscribe({
          next: count => {
            this.totalShlokas = count;  // dynamically set total
			console.log(this.totalShlokas);
            this.loading = false;        // ✅ move inside here
            this.cdr.markForCheck();
          },
          error: err => {
            console.error('TOTAL SHLOKAS FETCH FAILED', err);
            this.loading = false;
            this.cdr.markForCheck();
          }
        });

    },
    error: err => {
      console.error('SHLOKA LOAD FAILED', err);
      this.loading = false;
      this.cdr.markForCheck();
    }
  });
}

  // ===============================
  // 🔹 NAVIGATION (URL SYNC)
  // ===============================
  goToShloka(no: number) {
    if (no < 1 || no > this.totalShlokas) return;

    this.shlokaNo = no;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { shloka: no },
      queryParamsHandling: 'merge'
    });
  }

  nextShloka() {
    this.goToShloka(this.shlokaNo + 1);
  }

  prevShloka() {
    this.goToShloka(this.shlokaNo - 1);
  }

 /*  nextChapter() {
    this.router.navigate(['/chapter', this.chapterId + 1]);
  } */
  nextChapter() {
  this.router.navigate(['/chapter', this.chapterId + 1], {
    queryParams: {}   // 🔥 clears shloka
  });
}
prevChapter() {
  if (this.chapterId > 1) {
    this.router.navigate(['/chapter', this.chapterId - 1], {
      queryParams: {} // 🔥 clears shloka
    });
  }
}


 /*  prevChapter() {
    if (this.chapterId > 1) {
      this.router.navigate(['/chapter', this.chapterId - 1]);
    }
  } */
  
  

  // ===============================
  // 🔊 AUDIO CHANTING
  // ===============================
  playAudio() {
    if (!this.shloka) return;

    speechSynthesis.cancel();

    const lines = this.shloka.sanskrit
      .split('|')
      .map(l => l.trim())
      .filter(Boolean);

    const speakLine = (i: number) => {
      if (i >= lines.length) {
        const english = new SpeechSynthesisUtterance(
          `Meaning: ${this.shloka?.meaning}. Guidance: ${this.shloka?.guidance}`
        );
        english.lang = 'en-US';
        speechSynthesis.speak(english);
        return;
      }

      const u = new SpeechSynthesisUtterance(lines[i]);
      u.lang = 'hi-IN';
      u.rate = 0.85;
      u.pitch = 1.2;
      u.onend = () => setTimeout(() => speakLine(i + 1), 400);
      speechSynthesis.speak(u);
    };

    speakLine(0);
  }
}
