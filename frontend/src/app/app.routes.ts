import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'operations', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'admin/helicopters',
    loadComponent: () =>
      import('./pages/helicopters/helicopters').then((m) => m.HelicoptersPage),
  },
  {
    path: 'admin/crew',
    loadComponent: () => import('./pages/crew/crew').then((m) => m.CrewPage),
  },
  {
    path: 'admin/landing-sites',
    loadComponent: () =>
      import('./pages/landing-sites/landing-sites').then((m) => m.LandingSitesPage),
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/users/users').then((m) => m.UsersPage),
  },
  {
    path: 'operations',
    loadComponent: () =>
      import('./pages/operations/operations').then((m) => m.OperationsPage),
  },
  {
    path: 'flight-tickets',
    loadComponent: () =>
      import('./pages/flight-tickets/flight-tickets').then((m) => m.FlightTicketsPage),
  },
];
