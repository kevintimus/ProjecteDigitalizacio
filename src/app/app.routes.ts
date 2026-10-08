import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'Inicio',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  // Solo admin: ficha completa (profesor o alumno) y formularios de gestión
  {
    path: 'ficha/:tipo/:id',
    title: 'Ficha',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/ficha/ficha.component').then((m) => m.FichaComponent),
  },
  {
    path: 'admin/:tipo/:accion',
    title: 'Gestión',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/persona-form.component').then((m) => m.PersonaFormComponent),
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas generales',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent),
  },
  { path: '**', redirectTo: '' },
];
