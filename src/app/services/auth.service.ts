import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from '../models/professor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // de momento hardcodeado para poder ver /admin, luego lo pone el login real
  professorActual = signal<Professor | null>({
    id: '0',
    nom: 'Prova',
    cognom1: 'Preview',
    cognom2: '',
    gmail: 'prova@example.com',
    isAdmin: true,
  });

  constructor(private http: HttpClient) {}

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
