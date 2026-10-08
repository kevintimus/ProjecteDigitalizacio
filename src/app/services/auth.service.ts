import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from '../models/professor';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // de momento hardcodeado para poder ver /admin; cuando el login real funcione, ponlo en null
  professorActual = signal<Professor | null>({
    id: '0', nom: 'Prova', cognom1: 'Preview', cognom2: '',
    gmail: 'prova@example.com', isAdmin: true,
  });

  loginConGoogle(credential: string) {
    return this.http.post<Professor>('http://localhost:3000/api/auth/google', { credential }).pipe(
      tap((profe) => this.professorActual.set(profe)),
    );
  }

  login(gmail: string, contrasenya: string) {
    // falta conectar con el backend
  }

  logout() {
    this.professorActual.set(null);
  }

  esAdmin(): boolean {
    return this.professorActual()?.isAdmin ?? false;
  }
}
