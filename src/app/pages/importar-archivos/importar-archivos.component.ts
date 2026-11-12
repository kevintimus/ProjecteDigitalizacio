import * as XLSX from 'xlsx';
import { Component } from '@angular/core';
import {Alumno, Grupo, Profesor} from '../../core/models';
import { Importacion } from '../../core/importacion';

const limpiar = (v: any) => {
  const t = String(v ?? '').trim();
  return t === '“”' ? '' : t;
};

@Component({
  selector: 'app-importar-archivos',
  standalone: true,
  imports: [],
  templateUrl: './importar-archivos.component.html'
})

export class ImportarArchivosComponent {

  constructor(private importacion: Importacion) {}

  arrastrandoArchivo = false;
  archivoSeleccionado: File | null = null;
  mensajeError = '';

  protected alArrastrarArchivo(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrandoArchivo = true;
  }

  protected alDejarZonaArchivo(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrandoArchivo = false;
  }

  protected alSoltarArchivo(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrandoArchivo = false;

    const archivoArrastrado = evento.dataTransfer?.files[0];

    if (archivoArrastrado) {
      this.validarArchivoSeleccionado(archivoArrastrado);
    }
  }

  protected alElegirArchivo(evento: Event): void {
    const entradaArchivo = evento.target as HTMLInputElement;
    const archivoElegido = entradaArchivo.files?.[0];

    if (archivoElegido) {
      this.validarArchivoSeleccionado(archivoElegido);
    }
  }

  protected validarArchivoSeleccionado(archivo: File): void {
    const nombreArchivo = archivo.name.toLowerCase();

    if (nombreArchivo.endsWith('.xls') || nombreArchivo.endsWith('.xlsx')) {
      this.archivoSeleccionado = archivo;
      this.mensajeError = '';
    } else {
      this.archivoSeleccionado = null;
      this.mensajeError = 'El archivo debe ser .xls o .xlsx.';
    }
  }

  protected quitarArchivoSeleccionado(
    evento: MouseEvent,
    entradaArchivo: HTMLInputElement
  ): void {
    evento.stopPropagation();

    this.archivoSeleccionado = null;
    this.mensajeError = '';
    entradaArchivo.value = '';
  }


  protected verContenidoArchivo(): void {
    console.log('Click en importar', this.archivoSeleccionado); // NUEVO

    if (!this.archivoSeleccionado) {
      return;
    }

    const lectorArchivo = new FileReader();

    lectorArchivo.onload = (evento) => {
      console.log('Archivo leído'); // NUEVO
      const contenido = evento.target?.result;

      if (contenido instanceof ArrayBuffer) {
        const libroExcel = XLSX.read(contenido);
        const nombrePrimeraHoja = libroExcel.SheetNames[0];

        if (!nombrePrimeraHoja) {
          this.mensajeError = 'El Excel no contiene hojas.';
          return;
        }

        const filas = XLSX.utils.sheet_to_json<any>(libroExcel.Sheets[nombrePrimeraHoja]);
        const columnas = Object.keys(filas[0] ?? {});

        console.log('Filas:', filas);
        console.log('Columnas:', columnas);

        if (columnas.includes('nom_alum')) {
          this.importarAlumnos(filas);
        } else if (columnas.includes('nom_prof')) {
          this.importarProfesores(filas);
        } else if (columnas.includes('curs') && columnas.includes('grup')) {
          this.importarGrupos(filas);
        } else {
          this.mensajeError = 'No reconozco las columnas del Excel.';
          console.log('Columnas no reconocidas');
        }
      }
    };

    lectorArchivo.readAsArrayBuffer(this.archivoSeleccionado);
  }

  private importarAlumnos(filas: any[]): void {
    const alumnos: Alumno[] = filas.map((fila) => ({
      id: fila.id_ieducat,
      nombre: fila.nom_alum,
      apellido1: limpiar(fila.cog1_alum),
      apellido2: limpiar(fila.cog2_alum),
      foto: fila.foto_alum,
      email: fila.correu_alum ?? '',
      susceptible: fila.susceptible === 1,
      grup: fila.codi_grup_mat,
    }));

    const total = alumnos.length;
    let creados = 0;
    let errores = 0;

    for (const alumno of alumnos) {
      this.importacion.crearAlum(alumno).subscribe({
        next: (respuesta) => {
          creados++;
          console.log('Creado:', respuesta);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        },
        error: (err) => {
          errores++;
          console.error('Error al crear', alumno.nombre, err);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        }
      });
    }
  }

  private importarProfesores(filas: any[]): void {
    const profesores: Profesor[] = filas.map((fila) => ({
      id: fila.id_jeduca_prof,
      nombre: fila.nom_prof,
      apellido1: limpiar(fila.cog1_prof),
      apellido2: limpiar(fila.cog2_prof),
      email: fila.correu ?? '',
      admin: fila.admin === 1,
      contrassenya: fila.contrasenya ?? '',
    }));

    let creados = 0;
    let errores = 0;
    const total = profesores.length;


    for (const profe of profesores) {
      this.importacion.crearProf(profe).subscribe({
        next: (respuesta) => {
          creados++;
          console.log('Creado:', respuesta);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        },
        error: (err) => {
          errores++;
          console.error('Error al crear', profe.id, err);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        }
      });
    }
  }

  private importarGrupos(filas: any[]): void {
    const grupos: Grupo[] = filas.map((fila) => ({
      id: fila.codi_grup_matricula,
      curs: fila.curs,
      grup: fila.grup,
    }));

    let creados = 0;
    let errores = 0;
    const total = grupos.length;


    for (const grupo of grupos) {
      this.importacion.crearGrup(grupo).subscribe({
        next: (respuesta) => {
          creados++;
          console.log('Creado:', respuesta);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        },
        error: (err) => {
          errores++;
          console.error('Error al crear', grupo.id, err);
          if (creados + errores === total) {
            console.log(`Terminado: ${creados} creados, ${errores} errores`);
          }
        }
      });
    }
  }
}
