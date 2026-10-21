import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { Alumno, Profesor, formatearFecha, obtenerIniciales, obtenerNombreCompleto } from '../../core/models';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ficha.component.html',
})
export class FichaComponent {
  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  readonly obtenerIniciales = obtenerIniciales;
  readonly formatearFecha = formatearFecha;
  alumno?: Alumno;
  profesor?: Profesor;

  constructor(public datosService: DataService, rutaActual: ActivatedRoute) {
    const tipoPersona = rutaActual.snapshot.paramMap.get('tipo');
    const idPersona = Number(rutaActual.snapshot.paramMap.get('id'));
    if (tipoPersona === 'alumnos') this.alumno = this.datosService.alumno(idPersona);
    if (tipoPersona === 'profesores') this.profesor = this.datosService.profesor(idPersona);
  }
}
