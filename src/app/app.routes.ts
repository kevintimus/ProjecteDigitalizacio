import { Routes } from '@angular/router';
import { AdminGuard, AuthGuard } from './core/guards';
import {ImportarArchivosComponent} from './pages/importar-archivos/importar-archivos.component';
import {EstadisticasComponent} from './pages/estadisticas/estadisticas.component';
import PersonaFormComponent from './pages/admin/persona-form.component';
import {FichaComponent} from './pages/ficha/ficha.component';
import {InicioComponent} from './pages/inicio/inicio.component';
import {LoginComponent} from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'Inicio',
    canActivate: [AuthGuard],
    component: InicioComponent,
  },
  // Solo admin: ficha completa (profesor o alumno) y formularios de gestión
  {
    path: 'ficha/:tipo/:id',
    title: 'Ficha',
    canActivate: [AdminGuard],
    component: FichaComponent,
  },
  {
    path: 'admin/:tipo/:accion',
    title: 'Gestión',
    canActivate: [AdminGuard],
    component: PersonaFormComponent,
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas generales',
    canActivate: [AdminGuard],
    component: EstadisticasComponent,
  },
  {
    path: 'admin/importar',
    title: 'Importar Archivos',
    canActivate: [AdminGuard],
    component: ImportarArchivosComponent,
  },
  { path: '**', redirectTo: '' },
];
