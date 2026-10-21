import { Routes } from '@angular/router';
import { AdminGuard, AuthGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    loadComponent: () => import('./pages/login/login.component').then((modulo) => modulo.LoginComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'Inicio',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/inicio/inicio.component').then((modulo) => modulo.InicioComponent),
  },
  // Solo admin: ficha completa (profesor o alumno) y formularios de gestión
  {
    path: 'ficha/:tipo/:id',
    title: 'Ficha',
    canActivate: [AdminGuard],
    loadComponent: () => import('./pages/ficha/ficha.component').then((modulo) => modulo.FichaComponent),
  },
  {
    path: 'admin/:tipo/:accion',
    title: 'Gestión',
    canActivate: [AdminGuard],
    loadComponent: () => import('./pages/admin/persona-form.component').then((modulo) => modulo.default),
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas generales',
    canActivate: [AdminGuard],
    loadComponent: () => import('./pages/estadisticas/estadisticas.component').then((modulo) => modulo.EstadisticasComponent),
  },
  { path: '**', redirectTo: '' },
];
