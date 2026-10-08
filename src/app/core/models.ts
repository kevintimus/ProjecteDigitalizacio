export type Rol = 'admin' | 'profe';
export type TipoPersona = 'profesores' | 'alumnos';

export interface Persona {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  /** Formato ISO yyyy-mm-dd (el que usa <input type="date">) */
  nacimiento: string;
}

export interface Profesor extends Persona {
  rol: Rol;
  aula: string;
  curso: string;
}

export interface Alumno extends Persona {
  codigo: string;
  susceptible: boolean;
}

export interface Salida {
  id: number;
  alumnoId: number;
  profesorId: number;
  /** Cuando el alumno sale de clase hacia el baño */
  horaEntrada: Date;
  /** Cuando vuelve. Si no existe, el alumno sigue en el baño */
  horaSalida?: Date;
}

export const nombreCompleto = (p: Persona): string =>
  [p.nombre, p.apellido1, p.apellido2].filter(Boolean).join(' ');

export const iniciales = (p: Persona): string =>
  ((p.nombre[0] ?? '') + (p.apellido1[0] ?? '')).toUpperCase();

export const fechaLarga = (iso: string): string => {
  if (!iso) return 'Sin indicar';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
