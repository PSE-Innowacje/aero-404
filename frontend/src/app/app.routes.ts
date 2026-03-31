import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/helicopters/helicopters').then((m) => m.HelicoptersPage),
  },
  {
    path: 'admin/helicopters/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/helicopter-add/helicopter-add').then((m) => m.HelicopterAddPage),
  },
  {
    path: 'admin/helicopters/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/helicopter-edit/helicopter-edit').then((m) => m.HelicopterEditPage),
  },
  {
    path: 'admin/crew',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/crew/crew').then((m) => m.CrewPage),
  },
  {
    path: 'admin/crew/add',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/crew-add/crew-add').then((m) => m.CrewAddPage),
  },
  {
    path: 'admin/crew/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/crew-edit/crew-edit').then((m) => m.CrewEditPage),
  },
  {
    path: 'admin/landing-sites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/landing-sites/landing-sites').then((m) => m.LandingSitesPage),
  },
  {
    path: 'admin/landing-sites/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/landing-site-add/landing-site-add').then((m) => m.LandingSiteAddPage),
  },
  {
    path: 'admin/landing-sites/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/landing-site-edit/landing-site-edit').then((m) => m.LandingSiteEditPage),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/users').then((m) => m.UsersPage),
  },
  {
    path: 'admin/users/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-add/user-add').then((m) => m.UserAddPage),
  },
  {
    path: 'admin/users/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-edit/user-edit').then((m) => m.UserEditPage),
  },
  {
    path: 'operations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/operations/operations').then((m) => m.OperationsPage),
  },
  {
    path: 'operations/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/operation-add/operation-add').then((m) => m.OperationAddPage),
  },
  {
    path: 'operations/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/operation-edit/operation-edit').then((m) => m.OperationEditPage),
  },
  {
    path: 'flight-tickets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/flight-tickets/flight-tickets').then((m) => m.FlightTicketsPage),
  },
];
