import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { obtenerNombreCompleto } from './core/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  readonly menuTiposPersona = [
    { tipo: 'profesores', etiqueta: 'Profesores' },
    { tipo: 'alumnos', etiqueta: 'Alumnos' },
  ];
  readonly accionesGestion = [
    { ruta: 'nuevo', etiqueta: 'Añadir' },
    { ruta: 'editar', etiqueta: 'Editar' },
    { ruta: 'borrar', etiqueta: 'Borrar' },
  ];
  tipoMenuAbierto: string | null = null;

  constructor(public sesionService: AuthService, private enrutador: Router) {}

  alternarMenu(tipoPersona: string, evento: Event): void {
    evento.stopPropagation();
    this.tipoMenuAbierto = this.tipoMenuAbierto === tipoPersona ? null : tipoPersona;
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  cerrar(): void {
    this.tipoMenuAbierto = null;
  }

  salir(): void {
    this.sesionService.logout();
    this.enrutador.navigate(['/login']);
  }
}
