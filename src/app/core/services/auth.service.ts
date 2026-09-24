import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from '../models/professor.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Professor actualment loguejat (o null si ningú ha entrat encara)
  professorActual = signal<Professor | null>(null);

  constructor(private http: HttpClient) {}

  // TODO: connectar amb el backend (login amb gmail + contrasenya del profe)
  login(gmail: string, contrasenya: string) {
    // aquí es cridarà l'endpoint d'autenticació i s'omplirà professorActual amb la resposta
  }

  logout() {
    this.professorActual.set(null);
  }

  esAdmin(): boolean {
    return this.professorActual()?.isAdmin ?? false;
  }
}
