import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor.model';

@Injectable({ providedIn: 'root' })
export class ProfessorsService {
  private apiUrl = '/api/professors'; // TODO: ajustar a la URL real del backend

  constructor(private http: HttpClient) {}

  getTots(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl);
  }

  cercarPerGmail(gmail: string): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}?gmail=${gmail}`);
  }

  crear(professor: Partial<Professor>): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, professor);
  }

  editar(id: string, canvis: Partial<Professor>): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/${id}`, canvis);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
