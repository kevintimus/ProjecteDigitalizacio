import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { TipoPersona, obtenerNombreCompleto } from '../../core/models';

type AccionGestion = 'nuevo' | 'editar' | 'borrar';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './persona-form.component.html',
})
class PersonaFormComponent {
  constructor(private datosService: DataService, private sesionService: AuthService, private rutaActual: ActivatedRoute, private enrutador: Router) {
    // Se actualiza el formulario si cambian la acción o el correo en la URL.
    this.rutaActual.paramMap.subscribe(() => this.cargarFormularioDesdeRuta());
    this.rutaActual.queryParamMap.subscribe(() => this.cargarFormularioDesdeRuta());
  }

  private cargarFormularioDesdeRuta(): void {
    const tipoPersona = this.rutaActual.snapshot.paramMap.get('tipo');
    const accionGestion = this.rutaActual.snapshot.paramMap.get('accion');

    if ((tipoPersona !== 'alumnos' && tipoPersona !== 'profesores') || !['nuevo', 'editar', 'borrar'].includes(accionGestion ?? '')) {
      this.enrutador.navigate(['/']);
      return;
    }

    this.tipoPersona = tipoPersona;
    this.accionGestion = accionGestion as AccionGestion;
    this.restablecerFormulario();

    const correoConsulta = this.rutaActual.snapshot.queryParamMap.get('correo');
    if (correoConsulta && this.accionGestion !== 'nuevo') {
      this.datosFormulario.email = correoConsulta;
      this.alCambiarCorreo();
    }
  }

  tipoPersona: TipoPersona = 'alumnos';
  accionGestion: AccionGestion = 'nuevo';
  datosFormulario: any = {};
  personaSeleccionada: any;

  mensajeEstado: { tipo: 'ok' | 'error'; texto: string } | null = null;
  requiereConfirmacion = false;
  archivoSeleccionado: File | null = null;
  arrastrandoArchivo = false;


  get nombreSingular(): string {
    return this.tipoPersona === 'alumnos' ? 'alumno' : 'profesor';
  }

  get tituloFormulario(): string {
    const textoAccion = { nuevo: 'Añadir', editar: 'Editar', borrar: 'Borrar' }[this.accionGestion];
    return `${textoAccion} ${this.nombreSingular}`;
  }

  get textoBotonPrincipal(): string {
    return {
      nuevo: `Crear ${this.nombreSingular}`,
      editar: 'Guardar cambios',
      borrar: 'Eliminar',
    }[this.accionGestion];
  }

  get personasDisponiblesPorCorreo() {
    return this.datosService.correos.filter((persona) => persona.tipo === this.tipoPersona);
  }

  get nombrePersonaSeleccionada(): string {
    return this.personaSeleccionada ? obtenerNombreCompleto(this.personaSeleccionada) : '';
  }

  alCambiarCorreo(): void {
    this.requiereConfirmacion = false;
    this.mensajeEstado = null;
    if (this.accionGestion === 'nuevo') return;

    const personaEncontrada = this.datosService.buscarPorCorreo(
      this.tipoPersona,
      this.datosFormulario.email ?? '',
    );
    this.personaSeleccionada = personaEncontrada;

    if (personaEncontrada && this.accionGestion === 'editar') {
      this.datosFormulario = { ...personaEncontrada };
    }
  }

  guardarFormulario(): void {
    this.mensajeEstado = null;

    if (this.accionGestion === 'borrar') {
      this.eliminarPersonaSeleccionada();
      return;
    }

    if (this.accionGestion === 'editar' && !this.personaSeleccionada) {
      this.mostrarError('Elige primero un correo de la lista.');
      return;
    }

    const datos = this.datosFormulario;
    const camposObligatorios = [datos.nombre, datos.apellido1, datos.email];
    if (!camposObligatorios.every((valor) => String(valor ?? '').trim())) {
      this.mostrarError('Rellena nombre, primer apellido y correo.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(String(datos.email).trim())) {
      this.mostrarError('El correo no tiene un formato válido.');
      return;
    }

    const idPersonaActual: number | undefined = this.personaSeleccionada?.id;
    const personaConEseCorreo = this.datosService.buscarPorCorreo(this.tipoPersona, datos.email);
    if (personaConEseCorreo && personaConEseCorreo.id !== idPersonaActual) {
      this.mostrarError('Ya existe alguien con ese correo.');
      return;
    }

    if (this.tipoPersona === 'alumnos') {
      if (!String(datos.codigo ?? '').trim()) {
        this.mostrarError('El alumno necesita un código.');
        return;
      }
      if (this.datosService.codigoEnUso(datos.codigo, idPersonaActual)) {
        this.mostrarError('Ese código ya lo tiene otro alumno.');
        return;
      }
    }

    const datosLimpios = Object.fromEntries(
      Object.entries(datos).map(([nombreCampo, valorCampo]) => [
        nombreCampo,
        typeof valorCampo === 'string' ? valorCampo.trim() : valorCampo,
      ]),
    );

    if (this.accionGestion === 'nuevo') {
      this.datosService.crear(this.tipoPersona, datosLimpios);
      const nombreCreado = datosLimpios['nombre'];
      this.restablecerFormulario();
      this.mensajeEstado = { tipo: 'ok', texto: `${nombreCreado} se ha creado.` };
      return;
    }

    this.datosService.actualizar(this.tipoPersona, idPersonaActual!, datosLimpios);
    this.mensajeEstado = { tipo: 'ok', texto: 'Cambios guardados.' };
  }

  private eliminarPersonaSeleccionada(): void {
    if (!this.personaSeleccionada) {
      this.mostrarError('Elige primero un correo de la lista.');
      return;
    }

    if (
      this.tipoPersona === 'profesores' &&
      this.personaSeleccionada.id === this.sesionService.user?.id
    ) {
      this.mostrarError('No puedes eliminar tu propio usuario.');
      return;
    }

    if (!this.requiereConfirmacion) {
      this.requiereConfirmacion = true;
      return;
    }

    const nombreEliminado = this.nombrePersonaSeleccionada;
    this.datosService.eliminar(this.tipoPersona, this.personaSeleccionada.id);
    this.restablecerFormulario();
    this.mensajeEstado = { tipo: 'ok', texto: `${nombreEliminado} se ha eliminado.` };
  }

  private mostrarError(textoError: string): void {
    this.mensajeEstado = { tipo: 'error', texto: textoError };
  }

  private restablecerFormulario(): void {
    this.personaSeleccionada = undefined;
    this.requiereConfirmacion = false;
    this.mensajeEstado = null;

    if (this.tipoPersona === 'alumnos') {
      this.datosFormulario = {
        nombre: '', apellido1: '', apellido2: '', email: '', codigo: '',
        nacimiento: '', susceptible: false,
      };
    } else {
      this.datosFormulario = {
        nombre: '', apellido1: '', apellido2: '', email: '', aula: '', curso: '',
        nacimiento: '', rol: 'profe',
      };
    }
  }
}

export default PersonaFormComponent;
