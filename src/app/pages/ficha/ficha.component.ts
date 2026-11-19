import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { Alumno, Profesor, formatearFecha, obtenerIniciales, obtenerNombreCompleto } from '../../core/models';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './ficha.component.html',
})
export class FichaComponent {
  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  readonly obtenerIniciales = obtenerIniciales;
  readonly formatearFecha = formatearFecha;
  alumno?: Alumno;
  profesor?: Profesor;
  mostrarPassword: Boolean = false;

  constructor(public datosService: DataService, rutaActual: ActivatedRoute) {
    const tipoPersona = rutaActual.snapshot.paramMap.get('tipo');
    const idPersona = Number(rutaActual.snapshot.paramMap.get('id'));
    if (tipoPersona === 'alumnos') this.alumno = this.datosService.alumno(idPersona);
    if (tipoPersona === 'profesores') this.profesor = this.datosService.profesor(idPersona);
  }
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
