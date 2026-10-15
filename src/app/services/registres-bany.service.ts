import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistreBany } from '../models/registre-bany';

@Injectable({ providedIn: 'root' })
export class RegistresBanyService {
  private apiUrl = 'http://localhost:3000/api'; // cambiar cuando haya backend

  constructor(private http: HttpClient) {}

  // Es crida quan l'alumne surt de classe (comença el temps)
  iniciar(alumneId: string, professorId: string): Observable<RegistreBany> {
    return this.http.post<RegistreBany>(this.apiUrl, { alumneId, professorId });
  }

  // Es crida quan l'alumne torna (para el temps → "SORTIR")
  finalitzar(registreId: string): Observable<RegistreBany> {
    return this.http.put<RegistreBany>(`${this.apiUrl}/${registreId}/finalitzar`, {});
  }

  getActius(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAlumnesPendents`);
  }

  getEstadistiquesGenerals(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/estadistiques`);
  }
}
