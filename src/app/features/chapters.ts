import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chapters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h3>Chapters</h3>

    <div *ngIf="chapters.length === 0">Loading chapters...</div>

    <ul *ngIf="chapters.length > 0">
      <li *ngFor="let c of chapters">
        <a [routerLink]="['/chapter', c.chapter]">
          Chapter {{ c.chapter }} – {{ c.title }}
        </a>
      </li>
    </ul>
  `
})
export class Chapters implements OnChanges {

  @Input() chapters: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chapters']) {
      console.log('INPUT chapters updated:', this.chapters.length);
    }
  }
}
