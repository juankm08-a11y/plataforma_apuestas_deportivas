import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { MatchesComponent } from '../pages/matches/matches.component';

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'matches', component: MatchesComponent },
  { path: '**', redirectTo: '/dashboard' },
];
