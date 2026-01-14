import { Routes } from '@angular/router';
import { Chapters } from './features/chapters';
import { Shlokas } from './features/shlokas';
import { TodaySandesh } from './features/today-sandesh';
export const routes: Routes = [
  { path: '', component: Chapters },
  { path: 'chapter/:chapter', component: Shlokas },
  { path: 'today-sandesh', component: TodaySandesh }
];



