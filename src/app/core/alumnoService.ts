import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alumno } from './models';

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  private http = inject(HttpClient);

  crear(alumno: Alumno) {
    return this.http.post(
      'http://localhost:3000/api/AfegirAlumneAmbImport',
      alumno
    );
  }
}
