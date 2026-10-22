import { Component } from '@angular/core';

@Component({
  selector: 'app-importar-archivos',
  standalone: true,
  imports: [],
  templateUrl: './importar-archivos.component.html'
})
export class ImportarArchivosComponent {
  archivoSeleccionado: File | null = null;
  arrastrandoArchivo = false;
  mensajeEstado: { tipo: 'ok' | 'error'; texto: string } | null = null;


  protected alArrastrarArchivo($event: DragEvent): void {
    $event.preventDefault();
    this.arrastrandoArchivo = true;
  }

  protected alDejarZonaArchivo($event: DragEvent): void {
    $event.preventDefault();
    this.arrastrandoArchivo = false;
  }

  protected alSoltarArchivo($event: DragEvent): void {
    const archivoArrastrado = $event.dataTransfer?.files?.[0];
    $event.preventDefault();
    this.arrastrandoArchivo = false;
    if (archivoArrastrado) this.validarArchivoSeleccionado(archivoArrastrado);
  }

  protected alElegirArchivo($event: Event): void {
    const elementoEntrada = $event.target as HTMLInputElement;
    const archivoElegido = elementoEntrada.files?.[0];
    if (archivoElegido) this.validarArchivoSeleccionado(archivoElegido);
  }

  protected validarArchivoSeleccionado(archivo: File): void {
    if (archivo.name.toLowerCase().endsWith('.csv')) {
      this.archivoSeleccionado = archivo;
    } else {
      this.mostrarError('El archivo debe tener extensión .csv.');
    }
  }

  protected quitarArchivoSeleccionado($event: MouseEvent, elementoEntrada: HTMLInputElement): void {
    $event.stopPropagation();
    this.archivoSeleccionado = null;
    elementoEntrada.value = '';
  }

  private mostrarError(textoError: string): void {
    this.mensajeEstado = { tipo: 'error', texto: textoError };
  }
}
