import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Alumno, Grupo, Profesor} from './models';

@Injectable({ providedIn: 'root' })
export class Importacion {
  private http = inject(HttpClient);

  crearAlum(alumno: Alumno) {
    return this.http.post(
      'http://localhost:3000/api/AfegirAlumneAmbImport',
      alumno
    );
  }

  crearProf(prof: Profesor) {
    return this.http.post(
      'http://localhost:3000/api/AfegirProfeAmbImport',
      prof
    );
  }

  crearGrup(grup: Grupo) {
    return this.http.post(
      'http://localhost:3000/api/AfegirGrupAmbImport',
      grup
    );
  }

  subirFotos(fotos: File[]) {
    const formData = new FormData();
    for (const foto of fotos) {
      formData.append('fotos', foto);
    }
    return this.http.post<{ subidas: string[] }>(
      'http://localhost:3000/api/SubirFotos',
      formData
    );
  }

}
