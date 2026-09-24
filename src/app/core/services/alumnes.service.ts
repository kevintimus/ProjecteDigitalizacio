import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumne } from '../models/alumne.model';

@Injectable({ providedIn: 'root' })
export class AlumnesService {
  private apiUrl = '/api/alumnes'; // TODO: ajustar a la URL real del backend

  constructor(private http: HttpClient) {}

  getPerId(id: string): Observable<Alumne> {
    // id ve del lector de codi de barres
    return this.http.get<Alumne>(`${this.apiUrl}/${id}`);
  }

  cercarPerGmail(gmail: string): Observable<Alumne[]> {
    return this.http.get<Alumne[]>(`${this.apiUrl}?gmail=${gmail}`);
  }

  crear(alumne: Partial<Alumne>): Observable<Alumne> {
    return this.http.post<Alumne>(this.apiUrl, alumne);
  }

  editar(id: string, canvis: Partial<Alumne>): Observable<Alumne> {
    return this.http.put<Alumne>(`${this.apiUrl}/${id}`, canvis);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
