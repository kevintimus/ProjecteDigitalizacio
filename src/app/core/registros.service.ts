import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Alumno, Grupo, Profesor} from './models';

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  private http = inject(HttpClient);
  obtenerAlumnos() {
    return this.http.get<any[]>('http://localhost:3000/api/getAlumnes');
  }

  obtenerProfesores() {
    return this.http.get<any[]>('http://localhost:3000/api/getProfe');
  }

  obtenerGrupos() {
    return this.http.get<any[]>('http://localhost:3000/api/getGrups');
  }

  obtenerRegistros() {
    return this.http.get<any[]>('http://localhost:3000/api/getRegistreLavabo');
  }
}

