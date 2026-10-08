import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { nombreCompleto } from './core/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    @if (auth.user(); as u) {
      <header class="topbar">
        <a routerLink="/" class="marca" aria-label="Ir al inicio">
          <!-- Sustituye este SVG por tu logo -->
          <svg class="marca-logo" viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="#A4D279" />
            <rect x="11" y="8" width="18" height="24" rx="3" fill="#1C541D" />
            <circle cx="25" cy="21" r="1.8" fill="#E0D0A3" />
          </svg>
          <span>Baño</span>
        </a>

        @if (auth.esAdmin()) {
          <nav class="admin-nav" aria-label="Administración">
            @for (m of menus; track m.tipo) {
              <div class="menu">
                <button
                  type="button"
                  class="btn btn-claro"
                  aria-haspopup="true"
                  [attr.aria-expanded]="abierto() === m.tipo"
                  (click)="alternar(m.tipo, $event)"
                >
                  {{ m.etiqueta }}
                </button>
                @if (abierto() === m.tipo) {
                  <div class="menu-lista">
                    @for (a of acciones; track a.ruta) {
                      <a [routerLink]="['/admin', m.tipo, a.ruta]" (click)="cerrar()">{{ a.etiqueta }}</a>
                    }
                  </div>
                }
              </div>
            }
          </nav>
        }

        <div class="usuario">
          <span class="usuario-nombre">{{ nombre(u) }}</span>
          <span class="chip chip-rol">{{ auth.esAdmin() ? 'Admin' : 'Profesor' }}</span>
          <button type="button" class="btn btn-claro" (click)="salir()">Salir</button>
        </div>
      </header>
    }
    <router-outlet />
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  readonly nombre = nombreCompleto;
  readonly menus = [
    { tipo: 'profesores', etiqueta: 'Profesores' },
    { tipo: 'alumnos', etiqueta: 'Alumnos' },
  ];
  readonly acciones = [
    { ruta: 'nuevo', etiqueta: 'Añadir' },
    { ruta: 'editar', etiqueta: 'Editar' },
    { ruta: 'borrar', etiqueta: 'Borrar' },
  ];
  abierto = signal<string | null>(null);

  alternar(tipo: string, ev: Event): void {
    ev.stopPropagation();
    this.abierto.update((a) => (a === tipo ? null : tipo));
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  cerrar(): void {
    this.abierto.set(null);
  }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
