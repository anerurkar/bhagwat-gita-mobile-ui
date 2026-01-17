import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from './features/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // ❌ NO API CALLS HERE
}
