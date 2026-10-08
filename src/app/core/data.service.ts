import { Injectable, computed, signal } from '@angular/core';
import { Alumno, Persona, Profesor, Salida, TipoPersona, nombreCompleto } from './models';

const hoy = (h: number, m: number): Date => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

/**
 * Datos de demostración en memoria.
 * TODO: sustituir cada método por una llamada HttpClient a tu API (Express + Sequelize).
 * Las firmas están pensadas para que el cambio no afecte a los componentes.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  readonly profesores = signal<Profesor[]>([
    { id: 1, nombre: 'Laura', apellido1: 'García', apellido2: 'Pons', email: 'laura@escuela.test', nacimiento: '1982-03-14', rol: 'admin', aula: '2.04', curso: '1º DAM' },
    { id: 2, nombre: 'Jordi', apellido1: 'Ferrer', apellido2: 'Vila', email: 'jordi@escuela.test', nacimiento: '1978-11-02', rol: 'profe', aula: '1.12', curso: '2º DAM' },
    { id: 3, nombre: 'Marta', apellido1: 'Soler', apellido2: 'Puig', email: 'marta@escuela.test', nacimiento: '1990-07-21', rol: 'profe', aula: '0.07', curso: '1º ASIX' },
  ]);

  readonly alumnos = signal<Alumno[]>([
    { id: 1, codigo: '1001', nombre: 'Pol', apellido1: 'Martí', apellido2: 'Roca', email: 'pol@alumnos.test', nacimiento: '2006-05-09', susceptible: false },
    { id: 2, codigo: '1002', nombre: 'Núria', apellido1: 'Casals', apellido2: 'Bosch', email: 'nuria@alumnos.test', nacimiento: '2005-12-30', susceptible: true },
    { id: 3, codigo: '1003', nombre: 'Àlex', apellido1: 'Vidal', apellido2: 'Serra', email: 'alex@alumnos.test', nacimiento: '2006-02-17', susceptible: false },
    { id: 4, codigo: '1004', nombre: 'Aitana', apellido1: 'Ruiz', apellido2: 'Gil', email: 'aitana@alumnos.test', nacimiento: '2006-09-03', susceptible: true },
    { id: 5, codigo: '1005', nombre: 'Hugo', apellido1: 'Molina', apellido2: 'Coll', email: 'hugo@alumnos.test', nacimiento: '2005-06-25', susceptible: false },
    { id: 6, codigo: '1006', nombre: 'Carla', apellido1: 'Pujol', apellido2: 'Mas', email: 'carla@alumnos.test', nacimiento: '2006-01-11', susceptible: false },
  ]);

  readonly salidas = signal<Salida[]>(this.salidasDemo());

  readonly fuera = computed(() => this.salidas().filter((s) => !s.horaSalida));

  /** Lista unificada para los buscadores por correo */
  readonly correos = computed(() => [
    ...this.profesores().map((p) => ({ email: p.email, etiqueta: nombreCompleto(p), tipo: 'profesores' as TipoPersona, id: p.id })),
    ...this.alumnos().map((a) => ({ email: a.email, etiqueta: nombreCompleto(a), tipo: 'alumnos' as TipoPersona, id: a.id })),
  ]);

  alumno(id: number): Alumno | undefined {
    return this.alumnos().find((a) => a.id === id);
  }

  profesor(id: number): Profesor | undefined {
    return this.profesores().find((p) => p.id === id);
  }

  alumnoPorCodigo(codigo: string): Alumno | undefined {
    return this.alumnos().find((a) => a.codigo === codigo.trim());
  }

  codigoEnUso(codigo: string, exceptoId?: number): boolean {
    return this.alumnos().some((a) => a.codigo === codigo.trim() && a.id !== exceptoId);
  }

  buscarPorCorreo(tipo: TipoPersona, email: string): Persona | undefined {
    const e = email.trim().toLowerCase();
    const lista: Persona[] = tipo === 'alumnos' ? this.alumnos() : this.profesores();
    return lista.find((p) => p.email.toLowerCase() === e);
  }

  salidaAbierta(alumnoId: number): Salida | undefined {
    return this.salidas().find((s) => s.alumnoId === alumnoId && !s.horaSalida);
  }

  totalSalidasDe(alumnoId: number): number {
    return this.salidas().filter((s) => s.alumnoId === alumnoId).length;
  }

  enviarAlBano(alumnoId: number, profesorId: number): void {
    const id = Math.max(0, ...this.salidas().map((s) => s.id)) + 1;
    this.salidas.update((l) => [...l, { id, alumnoId, profesorId, horaEntrada: new Date() }]);
  }

  registrarSalida(salidaId: number): void {
    this.salidas.update((l) => l.map((s) => (s.id === salidaId ? { ...s, horaSalida: new Date() } : s)));
  }

  crear(tipo: TipoPersona, datos: any): void {
    const lista: Persona[] = tipo === 'alumnos' ? this.alumnos() : this.profesores();
    const id = Math.max(0, ...lista.map((p) => p.id)) + 1;
    if (tipo === 'alumnos') this.alumnos.update((l) => [...l, { ...datos, id }]);
    else this.profesores.update((l) => [...l, { ...datos, id }]);
  }

  actualizar(tipo: TipoPersona, id: number, datos: any): void {
    if (tipo === 'alumnos') this.alumnos.update((l) => l.map((a) => (a.id === id ? { ...a, ...datos, id } : a)));
    else this.profesores.update((l) => l.map((p) => (p.id === id ? { ...p, ...datos, id } : p)));
  }

  eliminar(tipo: TipoPersona, id: number): void {
    if (tipo === 'alumnos') {
      this.alumnos.update((l) => l.filter((a) => a.id !== id));
      this.salidas.update((l) => l.filter((s) => s.alumnoId !== id));
    } else {
      this.profesores.update((l) => l.filter((p) => p.id !== id));
    }
  }

  private salidasDemo(): Salida[] {
    // [alumnoId, profesorId, hora, minuto, duración en minutos]
    const filas: [number, number, number, number, number][] = [
      [1, 2, 8, 20, 4], [2, 1, 8, 45, 7], [2, 3, 9, 30, 9], [3, 2, 9, 50, 3],
      [4, 1, 10, 10, 6], [2, 2, 10, 40, 8], [5, 3, 11, 5, 5], [4, 2, 11, 25, 10],
      [6, 1, 11, 50, 4], [2, 1, 12, 15, 7], [1, 3, 12, 40, 3], [4, 3, 13, 5, 9],
    ];
    const cerradas = filas.map(([alumnoId, profesorId, h, m, dur], i) => {
      const horaEntrada = hoy(h, m);
      return { id: i + 1, alumnoId, profesorId, horaEntrada, horaSalida: new Date(horaEntrada.getTime() + dur * 60000) };
    });
    // Una salida abierta para ver la lista "En el baño ahora"
    const abierta: Salida = { id: cerradas.length + 1, alumnoId: 3, profesorId: 2, horaEntrada: new Date(Date.now() - 4 * 60000) };
    return [...cerradas, abierta];
  }
}
