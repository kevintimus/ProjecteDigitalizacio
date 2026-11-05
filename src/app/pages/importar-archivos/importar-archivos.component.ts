import * as XLSX from 'xlsx';
import { Component } from '@angular/core';
import {Alumno} from '../../core/models';
import { AlumnoService } from '../../core/alumnoService';

@Component({
  selector: 'app-importar-archivos',
  standalone: true,
  imports: [],
  templateUrl: './importar-archivos.component.html'
})
export class ImportarArchivosComponent {

  constructor(private alumnoServicio: AlumnoService) {}

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
    if (!this.archivoSeleccionado) {
      return;
    }

    const lectorArchivo = new FileReader();

    lectorArchivo.onload = (evento) => {
      const contenido = evento.target?.result;

      if (contenido instanceof ArrayBuffer) {
        const libroExcel = XLSX.read(contenido);
        const nombrePrimeraHoja = libroExcel.SheetNames[0];

        if (!nombrePrimeraHoja) {
          this.mensajeError = 'El Excel no contiene hojas.';
          return;
        }

        const hojaExcel = libroExcel.Sheets[nombrePrimeraHoja];

        const filas = XLSX.utils.sheet_to_json<any>(hojaExcel);


        const limpiar = (v: any) => {
          const t = String(v ?? '').trim();
          return t === '“”' ? '' : t;
        };

        const alumnos: Alumno[] = filas.map((fila) => ({
          id: fila.id_ieducat,
          nombre: fila.nom_alum,
          apellido1: limpiar(fila.cog1_alum),
          apellido2: limpiar(fila.cog2_alum),
          foto: fila.foto_alum,
          email: fila.correu_alum ?? '',
          susceptible: fila.susceptible === 1,
          codigo: fila.codi_grup_mat,
        }));

        let creados = 0;
        let errores = 0;

        console.log('Alumnos a importar:', alumnos);

        for (const alumno of alumnos) {
          this.alumnoServicio.crear(alumno).subscribe({
            next: (respuesta) => {
              creados++;
              console.log('Creado:', respuesta);
            },
            error: (err) => {
              errores++;
              console.error('Error al crear', alumno.nombre, err);
            }
          });
        }

      }
    };

    lectorArchivo.readAsArrayBuffer(this.archivoSeleccionado);

  }
}
