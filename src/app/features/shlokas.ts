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
  totalShlokas = 18; // will update dynamically once backend returns

  loading = true;
  shloka?: Shloka;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chapterId = Number(params.get('id'));
      this.shlokaNo = 1; // reset to first shloka on chapter change
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
        // dynamically update total shlokas if available
        if ((data as any).totalNoOfShlokas) {
          this.totalShlokas = (data as any).totalNoOfShlokas;
        }
        this.loading = false;
        this.cdr.markForCheck();
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

  // 🎵 Play spiritual chanting
  playAudio() {
    if (!this.shloka) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Split Sanskrit by '|' to read each line with pause
    const sanskritLines = this.shloka.sanskrit
      .split('|')
      .map(line => line.trim())
      .filter(l => l);

    const speakLine = (index: number) => {
      if (index >= sanskritLines.length) {
        // After Sanskrit, speak English meaning + guidance
        const englishText = `Meaning: ${this.shloka?.meaning}. Guidance: ${this.shloka?.guidance}`;
        const english = new SpeechSynthesisUtterance(englishText);
        english.lang = 'en-US';
        english.rate = 0.95;
        english.pitch = 1.0;
        speechSynthesis.speak(english);
        return;
      }

      const utter = new SpeechSynthesisUtterance(sanskritLines[index]);
      utter.lang = 'hi-IN'; // gives a Sanskrit/Hindi-like feel
      utter.rate = 0.85;    // slower for chanting
      utter.pitch = 1.2;
      utter.onend = () => setTimeout(() => speakLine(index + 1), 400); // 0.4s pause
      speechSynthesis.speak(utter);
    };

    // Start chanting from first line
    speakLine(0);
  }
}
