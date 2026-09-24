import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin-profe/admin-profe.component').then((m) => m.AdminProfeComponent),
    children: [
      {
        path: 'professors',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin-profe/gestio-professors/gestio-professors.component').then(
            (m) => m.GestioProfessorsComponent
          ),
      },
      {
        path: 'alumnes',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin-profe/gestio-alumnes/gestio-alumnes.component').then(
            (m) => m.GestioAlumnesComponent
          ),
      },
      {
        path: 'lector',
        loadComponent: () =>
          import('./features/lector-codi-barres/lector-codi-barres.component').then(
            (m) => m.LectorCodiBarresComponent
          ),
      },
      {
        path: 'buscador',
        loadComponent: () =>
          import('./features/buscador/buscador.component').then((m) => m.BuscadorComponent),
      },
      {
        path: 'estadistiques',
        loadComponent: () =>
          import('./features/estadistiques-generals/estadistiques-generals.component').then(
            (m) => m.EstadistiquesGeneralsComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
