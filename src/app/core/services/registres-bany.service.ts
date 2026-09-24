import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistreBany } from '../models/registre-bany.model';

@Injectable({ providedIn: 'root' })
export class RegistresBanyService {
  private apiUrl = '/api/registres-bany'; // TODO: ajustar a la URL real del backend

  constructor(private http: HttpClient) {}

  // Es crida quan l'alumne surt de classe (comença el temps)
  iniciar(alumneId: string, professorId: string): Observable<RegistreBany> {
    return this.http.post<RegistreBany>(this.apiUrl, { alumneId, professorId });
  }

  // Es crida quan l'alumne torna (para el temps → "SORTIR")
  finalitzar(registreId: string): Observable<RegistreBany> {
    return this.http.put<RegistreBany>(`${this.apiUrl}/${registreId}/finalitzar`, {});
  }

  getActius(): Observable<RegistreBany[]> {
    return this.http.get<RegistreBany[]>(`${this.apiUrl}?actiu=true`);
  }

  getEstadistiquesGenerals(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/estadistiques`);
  }
}
