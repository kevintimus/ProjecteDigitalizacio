import { DatePipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Alumno, formatearFecha, obtenerIniciales, obtenerNombreCompleto, Salida } from '../../core/models';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  codigoAlumno = '';
  correoBuscado = '';
  alumnoSeleccionado: Alumno | null = null;
  mensajeError = '';
  mensajeAviso = '';
  errorBusquedaCorreo = '';

  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  readonly obtenerIniciales = obtenerIniciales;
  readonly formatearFecha = formatearFecha;

  constructor(public sesionService: AuthService, public datosService: DataService, private enrutador: Router) {}

  get salidaAbiertaAlumno(): Salida | undefined {
    return this.alumnoSeleccionado ? this.datosService.salidaAbierta(this.alumnoSeleccionado.id) : undefined;
  }

  get alumnosEnBano(): { salida: Salida; alumno: Alumno; minutosFuera: number }[] {
    return this.datosService.salidasAbiertas
      .map((salida) => {
        const alumno = this.datosService.alumno(salida.alumnoId);
        if (!alumno) return null;
        const minutosFuera = Math.max(0, Math.floor((Date.now() - salida.horaEntrada.getTime()) / 60000));
        return { salida, alumno, minutosFuera };
      })
      .filter((registro): registro is { salida: Salida; alumno: Alumno; minutosFuera: number } => registro !== null);
  }

  @HostListener('document:keydown.escape')
  alPulsarEscape(): void {
    if (this.alumnoSeleccionado) this.limpiarFormulario();
  }

  buscarAlumnoPorCodigo(): void {
    const codigoIntroducido = this.codigoAlumno.trim();
    if (!codigoIntroducido) return;

    this.mensajeAviso = '';
    const alumnoEncontrado = this.datosService.alumnoPorCodigo(codigoIntroducido);
    if (!alumnoEncontrado) {
      this.alumnoSeleccionado = null;
      this.mensajeError = `No hay ningún alumno con el código ${codigoIntroducido}. Revisa el número e inténtalo de nuevo.`;
      this.codigoAlumno = '';
      return;
    }

    this.mensajeError = '';
    this.alumnoSeleccionado = alumnoEncontrado;
  }

  confirmarAccionAlumno(): void {
    const alumno = this.alumnoSeleccionado;
    const profesorActual = this.sesionService.user;
    if (!alumno || !profesorActual) return;

    const salidaAbierta = this.datosService.salidaAbierta(alumno.id);
    if (salidaAbierta) {
      this.datosService.registrarSalida(salidaAbierta.id);
      this.mensajeAviso = `Salida registrada: ${alumno.nombre} ha vuelto a clase.`;
    } else {
      this.datosService.enviarAlBano(alumno.id, profesorActual.id);
      this.mensajeAviso = `${alumno.nombre} está en el baño.`;
    }
    this.limpiarFormulario(false);
  }

  registrarVuelta(idSalida: number, nombreAlumno: string): void {
    this.datosService.registrarSalida(idSalida);
    this.mensajeAviso = `Salida registrada: ${nombreAlumno} ha vuelto a clase.`;
  }

  limpiarFormulario(borrarAviso = true): void {
    this.codigoAlumno = '';
    this.alumnoSeleccionado = null;
    this.mensajeError = '';
    if (borrarAviso) this.mensajeAviso = '';
  }

  irAFichaPorCorreo(): void {
    const correoNormalizado = this.correoBuscado.trim().toLowerCase();
    if (!correoNormalizado) return;
    const personaEncontrada = this.datosService.correos.find((persona) => persona.email.toLowerCase() === correoNormalizado);
    if (!personaEncontrada) {
      this.errorBusquedaCorreo = 'No hay ningún profesor ni alumno con ese correo.';
      return;
    }
    this.errorBusquedaCorreo = '';
    this.enrutador.navigate(['/ficha', personaEncontrada.tipo, personaEncontrada.id]);
  }
}
