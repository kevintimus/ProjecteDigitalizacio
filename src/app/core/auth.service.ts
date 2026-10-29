import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Profesor } from './models';

const CLAVE_SESION = 'bany-profesor-id';

/** Gestiona el inicio y cierre de sesión de demostración. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private idUsuarioSesion: number | null;

  constructor(private datosService: DataService) {
    this.idUsuarioSesion = this.recuperarIdSesion();
  }

  get user(): Profesor | null {
    if (this.idUsuarioSesion === null) return null;
    return this.datosService.profesor(this.idUsuarioSesion) ?? null;
  }

  get esAdmin(): boolean {
    return this.user?.admin === true;
  }

  login(correo: string): boolean {
    const profesor = this.datosService.buscarPorCorreo('profesores', correo) as Profesor | undefined;
    if (!profesor) return false;
    this.idUsuarioSesion = profesor.id;
    try { sessionStorage.setItem(CLAVE_SESION, String(profesor.id)); } catch { /* El navegador puede bloquear el almacenamiento. */ }
    return true;
  }

  logout(): void {
    this.idUsuarioSesion = null;
    try { sessionStorage.removeItem(CLAVE_SESION); } catch { /* El navegador puede bloquear el almacenamiento. */ }
  }

  private recuperarIdSesion(): number | null {
    try {
      const idGuardado = Number(sessionStorage.getItem(CLAVE_SESION));
      return idGuardado > 0 ? idGuardado : null;
    } catch {
      return null;
    }
  }
}
