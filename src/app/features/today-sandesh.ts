import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-today-sandesh',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Today's Sandesh</h3>

    <div *ngIf="message; else noMessage">
      {{ message }}
    </div>

    <ng-template #noMessage>
      <div>No message for today.</div>
    </ng-template>
  `
})
export class TodaySandesh {
  @Input() message: string = 'Start your day with positive thoughts and actions!';
}
