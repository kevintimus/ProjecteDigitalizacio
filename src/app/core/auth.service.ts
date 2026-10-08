import { Injectable, computed, inject, signal } from '@angular/core';
import { DataService } from './data.service';

const CLAVE = 'bany-profesor-id';

/**
 * Sesión de demostración: se elige un profesor por correo.
 * TODO: sustituir por login real contra tu API (token/cookie).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private data = inject(DataService);
  private userId = signal<number | null>(this.recuperar());

  readonly user = computed(() => {
    const id = this.userId();
    return id === null ? null : (this.data.profesor(id) ?? null);
  });
  readonly esAdmin = computed(() => this.user()?.rol === 'admin');

  login(email: string): boolean {
    const p = this.data.buscarPorCorreo('profesores', email);
    if (!p) return false;
    this.userId.set(p.id);
    try { sessionStorage.setItem(CLAVE, String(p.id)); } catch { /* sin almacenamiento */ }
    return true;
  }

  logout(): void {
    this.userId.set(null);
    try { sessionStorage.removeItem(CLAVE); } catch { /* sin almacenamiento */ }
  }

  private recuperar(): number | null {
    try {
      const v = Number(sessionStorage.getItem(CLAVE));
      return v > 0 ? v : null;
    } catch {
      return null;
    }
  }
}
