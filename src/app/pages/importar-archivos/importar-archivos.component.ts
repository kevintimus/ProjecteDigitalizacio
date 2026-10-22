
import { Component } from '@angular/core';

@Component({
  selector: 'app-importar-archivos',
  standalone: true,
  imports: [],
  templateUrl: './importar-archivos.component.html'
})
export class ImportarArchivosComponent {

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
    if (archivo.name.toLowerCase().endsWith('.csv' || archivo.name.toLowerCase().endsWith('.xls'))) {
      this.archivoSeleccionado = archivo;
      this.mensajeError = '';
    } else {
      this.archivoSeleccionado = null;
      this.mensajeError = 'El archivo debe tener extensión .csv o .xls.';
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

    lectorArchivo.onload = () => {
      console.log(lectorArchivo.result);
    };

    lectorArchivo.readAsText(this.archivoSeleccionado);
  }

}
