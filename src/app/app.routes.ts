import { Routes } from '@angular/router';
import { TodaySandesh } from './features/today-sandesh';
import { Chapters } from './features/chapters';
import { Shlokas } from './features/shlokas';

export const routes: Routes = [
  { path: '', component: TodaySandesh },
  { path: 'chapters', component: Chapters },
  { path: 'chapter/:id', component: Shlokas }
];


