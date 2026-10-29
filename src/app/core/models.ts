export type TipoPersona = 'profesores' | 'alumnos';

export interface Persona {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  /** Formato ISO yyyy-mm-dd (el que usa <input type="date">) */
}

export interface Profesor extends Persona {
  admin: boolean;
  contrassenya: string;
}

export interface Alumno extends Persona {
  foto: string;
  susceptible: boolean;
  grup: string;
}

export interface Salida {
  id: number;
  alumnoId: number;
  profesorId: number;
  grupId: string;
  /** Fecha en la que el alumno ha ido al baño*/
  data: Date;
  /** Cuando el alumno sale de clase hacia el baño */
  horaEntrada: Date;
  /** Cuando vuelve. Si no existe, el alumno sigue en el baño */
  horaSalida?: Date;
}

export interface Grupo {
  id: string;
  curs: string;
  grup: string;
}

export const obtenerNombreCompleto = (persona: Persona): string =>
  [persona.nombre, persona.apellido1, persona.apellido2].filter(Boolean).join(' ');

export const obtenerIniciales = (persona: Persona): string =>
  ((persona.nombre[0] ?? '') + (persona.apellido1[0] ?? '')).toUpperCase();

export const formatearFecha = (fechaISO: string): string => {
  if (!fechaISO) return 'Sin indicar';
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
};
