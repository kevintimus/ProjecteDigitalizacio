import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  Alumno,
  Profesor,
  Grupo,
  Salida,
  TipoPersona,
  Persona,
  obtenerNombreCompleto
} from './models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // URL del backend Express
  readonly api = 'http://localhost:3000/api';

  // Datos que utiliza el frontend.
  // Se rellenan con los datos recibidos de la base de datos.
  alumnos: Alumno[] = [];
  profesores: Profesor[] = [];
  grupos: Grupo[] = [];
  salidas: Salida[] = [];

  cargando = true;
  errorCarga = '';

  constructor(private http: HttpClient) {
    this.cargarDatosIniciales();
  }

  // =====================================================
  // CONVERSIÓN DE DATOS DE MYSQL A LOS MODELOS ANGULAR
  // =====================================================

  private mapAlumno(d: any): Alumno {
    return {
      id: Number(d.id_ieducat),
      nombre: d.nom_alum,
      apellido1: d.cog1_alum ?? '',
      apellido2: d.cog2_alum ?? '',
      foto: d.foto_alum ?? '',
      email: d.correu_alum,
      susceptible: Number(d.susceptible) === 1 ||
        d.susceptible === true,
      grup: String(d.id_grup)
    };
  }

  private mapProfesor(d: any): Profesor {
    return {
      id: Number(d.id_ieduca_prof),
      nombre: d.nom_prof,
      apellido1: d.cog1_prof ?? '',
      apellido2: d.cog2_prof ?? '',
      email: d.correu,
      contrassenya: d.contrasenya ?? '',
      admin: Number(d.admin) === 1 ||
        d.admin === true
    };
  }

  private mapGrupo(d: any): Grupo {
    return {
      id: String(d.id_grup),
      curs: String(d.curs),
      grup: String(d.grup)
    };
  }

  private mapSalida(d: any): Salida {
    return {
      id: Number(d.id_reg),
      alumnoId: Number(d.idecat_alum),
      profesorId: Number(d.idecat_prof),
      grupId: String(d.id_grup),
      data: d.data ? new Date(d.data) : new Date(),
      horaEntrada: new Date(d.hora_entrada),
      horaSalida: d.hora_sortida
        ? new Date(d.hora_sortida)
        : undefined
    };
  }

  // =====================================================
  // CARGA INICIAL DE LOS DATOS
  // =====================================================

  cargarDatosIniciales(): void {
    this.cargando = true;
    this.errorCarga = '';

    forkJoin({
      alumnos: this.http.get<any[]>(
        `${this.api}/getAlumnes`
      ),
      profesores: this.http.get<any[]>(
        `${this.api}/getProfe`
      ),
      grupos: this.http.get<any[]>(
        `${this.api}/getGrups`
      ),
      salidas: this.http.get<any[]>(
        `${this.api}/getRegistreLavabo`
      )
    }).subscribe({
      next: (datos) => {
        this.alumnos = datos.alumnos.map(
          alumno => this.mapAlumno(alumno)
        );

        this.profesores = datos.profesores.map(
          profesor => this.mapProfesor(profesor)
        );

        this.grupos = datos.grupos.map(
          grupo => this.mapGrupo(grupo)
        );

        this.salidas = datos.salidas.map(
          salida => this.mapSalida(salida)
        );

        this.cargando = false;
      },
      error: (error) => {
        console.error(
          'Error al cargar los datos del backend:',
          error
        );

        this.errorCarga =
          'No se han podido cargar los datos. Comprueba que el backend y MySQL estén funcionando.';

        this.cargando = false;
      }
    });
  }

  // =====================================================
  // OBTENER LISTAS DESDE EL BACKEND
  // =====================================================

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<any[]>(
      `${this.api}/getAlumnes`
    ).pipe(
      map(datos => datos.map(d => this.mapAlumno(d))),
      tap(datos => this.alumnos = datos)
    );
  }

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<any[]>(
      `${this.api}/getProfe`
    ).pipe(
      map(datos => datos.map(d => this.mapProfesor(d))),
      tap(datos => this.profesores = datos)
    );
  }

  getGrupos(): Observable<Grupo[]> {
    return this.http.get<any[]>(
      `${this.api}/getGrups`
    ).pipe(
      map(datos => datos.map(d => this.mapGrupo(d))),
      tap(datos => this.grupos = datos)
    );
  }

  getRegistros(): Observable<Salida[]> {
    return this.http.get<any[]>(
      `${this.api}/getRegistreLavabo`
    ).pipe(
      map(datos => datos.map(d => this.mapSalida(d))),
      tap(datos => this.salidas = datos)
    );
  }

  // Devuelve los registros que todavía están abiertos.
  get salidasAbiertas(): Salida[] {
    return this.salidas.filter(
      salida => !salida.horaSalida
    );
  }

  // =====================================================
  // OBTENER UNA PERSONA
  // =====================================================

  // Se mantiene síncrono porque las pantallas originales
  // utilizan estos métodos sin subscribe().
  // Los datos proceden de la carga inicial del backend.

  alumno(idAlumno: number | string): Alumno | undefined {
    return this.alumnos.find(
      alumno => String(alumno.id) === String(idAlumno)
    );
  }

  profesor(idProfesor: number | string): Profesor | undefined {
    return this.profesores.find(
      profesor => String(profesor.id) === String(idProfesor)
    );
  }

  // =====================================================
  // BÚSQUEDAS Y COMPROBACIONES
  // =====================================================

  get correos(): {
    email: string;
    etiqueta: string;
    tipo: TipoPersona;
    id: number;
  }[] {
    const correosProfesores = this.profesores.map(profesor => ({
      email: profesor.email,
      etiqueta: obtenerNombreCompleto(profesor),
      tipo: 'profesores' as TipoPersona,
      id: profesor.id
    }));

    const correosAlumnos = this.alumnos.map(alumno => ({
      email: alumno.email,
      etiqueta: obtenerNombreCompleto(alumno),
      tipo: 'alumnos' as TipoPersona,
      id: alumno.id
    }));

    return [...correosProfesores, ...correosAlumnos];
  }

  codigoEnUso(
    codigoAlumno: string,
    idAlumnoExcluido?: number
  ): boolean {
    const codigo = codigoAlumno.trim();

    return this.alumnos.some(alumno =>
      String(alumno.id) === codigo &&
      alumno.id !== idAlumnoExcluido
    );
  }

  buscarPorCorreo(
    tipoPersona: TipoPersona,
    correo: string
  ): Persona | undefined {
    const correoNormalizado = correo.trim().toLowerCase();

    const personas: Persona[] =
      tipoPersona === 'alumnos'
        ? this.alumnos
        : this.profesores;

    return personas.find(
      persona =>
        persona.email.toLowerCase() === correoNormalizado
    );
  }

  salidaAbierta(idAlumno: number): Salida | undefined {
    return this.salidas.find(
      salida =>
        salida.alumnoId === idAlumno &&
        !salida.horaSalida
    );
  }

  totalSalidasDe(idAlumno: number): number {
    return this.salidas.filter(
      salida => salida.alumnoId === idAlumno
    ).length;
  }

  // =====================================================
  // CREAR UN ALUMNO
  // =====================================================

  crearAlumno(datos: Partial<Alumno> & {
    codigo?: string;
  }): Observable<Alumno> {

    const body = {
      id_ieducat: Number(datos.codigo ?? datos.id),
      nom_alum: datos.nombre,
      cog1_alum: datos.apellido1,
      cog2_alum: datos.apellido2 || null,
      foto_alum: datos.foto || 'fotito',
      correu_alum: datos.email,
      susceptible: datos.susceptible ? 1 : 0,
      id_grup: datos.grup
    };

    return this.http.post<any>(
      `${this.api}/AfegirAlumne`,
      body
    ).pipe(
      map(datosRespuesta => this.mapAlumno(datosRespuesta)),
      tap(alumnoCreado => {
        this.alumnos = [
          ...this.alumnos,
          alumnoCreado
        ];
      })
    );
  }

  // =====================================================
  // MODIFICAR UN ALUMNO
  // =====================================================

  modificarAlumno(
    id: number,
    datos: Partial<Alumno>
  ): Observable<Alumno> {

    const body: any = {
      nom_alum: datos.nombre,
      cog1_alum: datos.apellido1,
      cog2_alum: datos.apellido2 || null,
      foto_alum: datos.foto,
      correu_alum: datos.email,
      id_grup: datos.grup
    };

    if (datos.susceptible !== undefined) {
      body.susceptible = datos.susceptible ? 1 : 0;
    }

    return this.http.put<any>(
      `${this.api}/ModificarAlumne/${id}`,
      body
    ).pipe(
      map(datosRespuesta => this.mapAlumno(datosRespuesta)),
      tap(alumnoModificado => {
        this.alumnos = this.alumnos.map(alumno =>
          alumno.id === id
            ? alumnoModificado
            : alumno
        );
      })
    );
  }

  // =====================================================
  // CREAR UN PROFESOR
  // =====================================================

  crearProfesor(datos: Partial<Profesor>): Observable<Profesor> {
    const body = {
      id_ieduca_prof: datos.id,
      nom_prof: datos.nombre,
      cog1_prof: datos.apellido1,
      cog2_prof: datos.apellido2 || null,
      correu: datos.email,
      contrasenya: datos.contrassenya,
      admin: datos.admin ? 1 : 0
    };

    return this.http.post<any>(
      `${this.api}/AfegirProfe`,
      body
    ).pipe(
      map(datosRespuesta => this.mapProfesor(datosRespuesta)),
      tap(profesorCreado => {
        this.profesores = [
          ...this.profesores,
          profesorCreado
        ];
      })
    );
  }

  // =====================================================
  // MODIFICAR UN PROFESOR
  // =====================================================

  modificarProfesor(
    id: number,
    datos: Partial<Profesor>
  ): Observable<Profesor> {

    const body = {
      nom_prof: datos.nombre,
      cog1_prof: datos.apellido1,
      cog2_prof: datos.apellido2 || null,
      correu: datos.email,
      admin: datos.admin ? 1 : 0
    };

    return this.http.put<any>(
      `${this.api}/ModificarProfessor/${id}`,
      body
    ).pipe(
      map(datosRespuesta => this.mapProfesor(datosRespuesta)),
      tap(profesorModificado => {
        this.profesores = this.profesores.map(profesor =>
          profesor.id === id
            ? profesorModificado
            : profesor
        );
      })
    );
  }

  // =====================================================
  // ELIMINAR ALUMNO O PROFESOR
  // =====================================================

  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/EliminarAlumne/${id}`
    ).pipe(
      tap(() => {
        this.alumnos = this.alumnos.filter(
          alumno => alumno.id !== id
        );

        this.salidas = this.salidas.filter(
          salida => salida.alumnoId !== id
        );
      })
    );
  }

  eliminarProfesor(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/EliminarProfessor/${id}`
    ).pipe(
      tap(() => {
        this.profesores = this.profesores.filter(
          profesor => profesor.id !== id
        );
      })
    );
  }

  // =====================================================
  // MÉTODOS UTILIZADOS POR EL FORMULARIO DE ADMINISTRACIÓN
  // =====================================================

  crear(tipoPersona: TipoPersona, datosPersona: any): void {
    if (tipoPersona === 'alumnos') {
      this.crearAlumno(datosPersona).subscribe({
        next: () => {
          console.log('Alumno creado correctamente.');
        },
        error: (error: any) => {
          console.error('Error al crear el alumno:', error);
        }
      });
    } else {
      this.crearProfesor(datosPersona).subscribe({
        next: () => {
          console.log('Profesor creado correctamente.');
        },
        error: (error: any) => {
          console.error('Error al crear el profesor:', error);
        }
      });
    }
  }


  actualizar(
    tipoPersona: TipoPersona,
    idPersona: number,
    datosActualizados: any
  ): void {
    if (tipoPersona === 'alumnos') {
      this.modificarAlumno(idPersona, datosActualizados).subscribe({
        next: () => {
          console.log('Alumno modificado correctamente.');
        },
        error: (error: any) => {
          console.error('Error al modificar el alumno:', error);
        }
      });
    } else {
      this.modificarProfesor(idPersona, datosActualizados).subscribe({
        next: () => {
          console.log('Profesor modificado correctamente.');
        },
        error: (error: any) => {
          console.error('Error al modificar el profesor:', error);
        }
      });
    }
  }


  eliminar(
    tipoPersona: TipoPersona,
    idPersona: number
  ): void {
    const peticion =
      tipoPersona === 'alumnos'
        ? this.eliminarAlumno(idPersona)
        : this.eliminarProfesor(idPersona);

    peticion.subscribe({
      next: () => {
        console.log('Persona eliminada correctamente.');
      },
      error: error => {
        console.error('Error al eliminar la persona:', error);
      }
    });
  }

  // =====================================================
  // REGISTROS DE SALIDAS AL BAÑO
  // =====================================================

  enviarAlBano(
    idAlumno: number,
    idProfesor: number
  ): void {
    const alumno = this.alumno(idAlumno);

    if (!alumno) {
      console.error(
        'No se puede crear el registro: alumno no encontrado.'
      );
      return;
    }

    const ahora = new Date();

    const fechaActual =
      `${ahora.getFullYear()}-` +
      `${String(ahora.getMonth() + 1).padStart(2, '0')}-` +
      `${String(ahora.getDate()).padStart(2, '0')}`;

    const body = {
      idecat_alum: idAlumno,
      idecat_prof: idProfesor,
      id_grup: alumno.grup,
      data: fechaActual,
      hora_entrada: ahora.toISOString(),
      hora_sortida: null
    };

    this.http.post<any>(
      `${this.api}/AfegirRegistreLavabo`,
      body
    ).subscribe({
      next: datosRespuesta => {
        const nuevaSalida = this.mapSalida(datosRespuesta);

        this.salidas = [
          ...this.salidas,
          nuevaSalida
        ];
      },
      error: error => {
        console.error(
          'Error al registrar la salida al baño:',
          error
        );
      }
    });
  }

  registrarSalida(idSalida: number): void {
    this.http.put<any>(
      `${this.api}/ModificarRegistreLavabo/${idSalida}`,
      {}
    ).subscribe({
      next: datosRespuesta => {
        const salidaActualizada = this.mapSalida(datosRespuesta);

        this.salidas = this.salidas.map(salida =>
          salida.id === idSalida
            ? salidaActualizada
            : salida
        );
      },
      error: error => {
        console.error(
          'Error al registrar el regreso del alumno:',
          error
        );
      }
    });
  }
}
