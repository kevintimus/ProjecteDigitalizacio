import { Injectable } from '@angular/core';
import { Alumno, Persona, Profesor, Salida, TipoPersona, obtenerNombreCompleto } from './models';

function crearFechaDeHoyConHora(hora: number, minuto: number): Date {
  const fecha = new Date();
  fecha.setHours(hora, minuto, 0, 0);
  return fecha;
}

/** Datos de prueba guardados en memoria. No conecta con el backend. */
@Injectable({ providedIn: 'root' })
export class DataService {
  profesores: Profesor[] = [
    { id: 1, nombre: 'Laura', apellido1: 'García', apellido2: 'Pons', email: 'laura@escuela.test', rol: 'admin', aula: '2.04', curso: '1º DAM' },
    { id: 2, nombre: 'Jordi', apellido1: 'Ferrer', apellido2: 'Vila', email: 'jordi@escuela.test', rol: 'profe', aula: '1.12', curso: '2º DAM' },
    { id: 3, nombre: 'Marta', apellido1: 'Soler', apellido2: 'Puig', email: 'marta@escuela.test',  rol: 'profe', aula: '0.07', curso: '1º ASIX' },
  ];

  alumnos: Alumno[] = [
    { id: 1, codigo: '1001', nombre: 'Pol', apellido1: 'Martí', apellido2: 'Roca', email: 'pol@alumnos.test', foto: "hola", susceptible: false },
    { id: 2, codigo: '1002', nombre: 'Núria', apellido1: 'Casals', apellido2: 'Bosch', email: 'nuria@alumnos.test', foto: "hola", susceptible: true },
    { id: 3, codigo: '1003', nombre: 'Àlex', apellido1: 'Vidal', apellido2: 'Serra', email: 'alex@alumnos.test', foto: "hola", susceptible: false },
    { id: 4, codigo: '1004', nombre: 'Aitana', apellido1: 'Ruiz', apellido2: 'Gil', email: 'aitana@alumnos.test', foto: "hola", susceptible: true },
    { id: 5, codigo: '1005', nombre: 'Hugo', apellido1: 'Molina', apellido2: 'Coll', email: 'hugo@alumnos.test', foto: "hola", susceptible: false },
    { id: 6, codigo: '1006', nombre: 'Carla', apellido1: 'Pujol', apellido2: 'Mas', email: 'carla@alumnos.test', foto: "hola", susceptible: false },
  ];

  salidas: Salida[] = this.crearSalidasDePrueba();

  get salidasAbiertas(): Salida[] {
    return this.salidas.filter((salida) => !salida.horaSalida);
  }

  get correos(): { email: string; etiqueta: string; tipo: TipoPersona; id: number }[] {
    const correosProfesores = this.profesores.map((profesor) => ({
      email: profesor.email, etiqueta: obtenerNombreCompleto(profesor), tipo: 'profesores' as TipoPersona, id: profesor.id,
    }));
    const correosAlumnos = this.alumnos.map((alumno) => ({
      email: alumno.email, etiqueta: obtenerNombreCompleto(alumno), tipo: 'alumnos' as TipoPersona, id: alumno.id,
    }));
    return [...correosProfesores, ...correosAlumnos];
  }

  alumno(idAlumno: number): Alumno | undefined {
    return this.alumnos.find((alumno) => alumno.id === idAlumno);
  }

  profesor(idProfesor: number): Profesor | undefined {
    return this.profesores.find((profesor) => profesor.id === idProfesor);
  }

  alumnoPorCodigo(codigoAlumno: string): Alumno | undefined {
    return this.alumnos.find((alumno) => alumno.codigo === codigoAlumno.trim());
  }

  codigoEnUso(codigoAlumno: string, idAlumnoExcluido?: number): boolean {
    return this.alumnos.some((alumno) => alumno.codigo === codigoAlumno.trim() && alumno.id !== idAlumnoExcluido);
  }

  buscarPorCorreo(tipoPersona: TipoPersona, correo: string): Persona | undefined {
    const correoNormalizado = correo.trim().toLowerCase();
    const personas: Persona[] = tipoPersona === 'alumnos' ? this.alumnos : this.profesores;
    return personas.find((persona) => persona.email.toLowerCase() === correoNormalizado);
  }

  salidaAbierta(idAlumno: number): Salida | undefined {
    return this.salidas.find((salida) => salida.alumnoId === idAlumno && !salida.horaSalida);
  }

  totalSalidasDe(idAlumno: number): number {
    return this.salidas.filter((salida) => salida.alumnoId === idAlumno).length;
  }

  enviarAlBano(idAlumno: number, idProfesor: number): void {
    const nuevoId = Math.max(0, ...this.salidas.map((salida) => salida.id)) + 1;
    this.salidas = [...this.salidas, { id: nuevoId, alumnoId: idAlumno, profesorId: idProfesor, horaEntrada: new Date() }];
  }

  registrarSalida(idSalida: number): void {
    this.salidas = this.salidas.map((salida) =>
      salida.id === idSalida ? { ...salida, horaSalida: new Date() } : salida,
    );
  }

  crear(tipoPersona: TipoPersona, datosPersona: any): void {
    if (tipoPersona === 'alumnos') {
      const nuevoId = Math.max(0, ...this.alumnos.map((alumno) => alumno.id)) + 1;
      this.alumnos = [...this.alumnos, { ...datosPersona, id: nuevoId }];
    } else {
      const nuevoId = Math.max(0, ...this.profesores.map((profesor) => profesor.id)) + 1;
      this.profesores = [...this.profesores, { ...datosPersona, id: nuevoId }];
    }
  }

  actualizar(tipoPersona: TipoPersona, idPersona: number, datosActualizados: any): void {
    if (tipoPersona === 'alumnos') {
      this.alumnos = this.alumnos.map((alumno) => alumno.id === idPersona ? { ...alumno, ...datosActualizados, id: idPersona } : alumno);
    } else {
      this.profesores = this.profesores.map((profesor) => profesor.id === idPersona ? { ...profesor, ...datosActualizados, id: idPersona } : profesor);
    }
  }

  eliminar(tipoPersona: TipoPersona, idPersona: number): void {
    if (tipoPersona === 'alumnos') {
      this.alumnos = this.alumnos.filter((alumno) => alumno.id !== idPersona);
      this.salidas = this.salidas.filter((salida) => salida.alumnoId !== idPersona);
    } else {
      this.profesores = this.profesores.filter((profesor) => profesor.id !== idPersona);
    }
  }

  private crearSalidasDePrueba(): Salida[] {
    const datosDePrueba: [number, number, number, number, number][] = [
      [1, 2, 8, 20, 4], [2, 1, 8, 45, 7], [2, 3, 9, 30, 9], [3, 2, 9, 50, 3],
      [4, 1, 10, 10, 6], [2, 2, 10, 40, 8], [5, 3, 11, 5, 5], [4, 2, 11, 25, 10],
      [6, 1, 11, 50, 4], [2, 1, 12, 15, 7], [1, 3, 12, 40, 3], [4, 3, 13, 5, 9],
    ];
    const salidasCerradas = datosDePrueba.map(([alumnoId, profesorId, hora, minuto, duracionMinutos], indice) => {
      const horaEntrada = crearFechaDeHoyConHora(hora, minuto);
      return { id: indice + 1, alumnoId, profesorId, horaEntrada, horaSalida: new Date(horaEntrada.getTime() + duracionMinutos * 60000) };
    });
    const salidaAbierta: Salida = { id: salidasCerradas.length + 1, alumnoId: 3, profesorId: 2, horaEntrada: new Date(Date.now() - 4 * 60000) };
    return [...salidasCerradas, salidaAbierta];
  }
}
