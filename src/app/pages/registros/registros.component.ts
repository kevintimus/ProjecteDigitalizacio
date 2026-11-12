import { Component } from '@angular/core';
import { RegistrosService } from '../../core/registros.service';


@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [],
  templateUrl: './registros.component.html',
})
export class RegistrosComponent {
  filas: any[] = [];
  columnas: string[] = [];

  ngOnInit() {
    this.verAlumnos();
  }

  constructor(private registrosServicio: RegistrosService) {}

  filtro = '';
  columnaFiltro = '';

  filasFiltradas() {
    const texto = this.filtro.toLowerCase();
    return this.filas.filter(fila => {
      if (this.columnaFiltro) {
        return String(fila[this.columnaFiltro] ?? '').toLowerCase().includes(texto);
      }
      return this.columnas.some(col => String(fila[col] ?? '').toLowerCase().includes(texto));
    });
  }

  verAlumnos() {
    this.registrosServicio.obtenerAlumnos().subscribe(datos => this.mostrar(datos));
  }

  verProfesores() {
    this.registrosServicio.obtenerProfesores().subscribe(datos => this.mostrar(datos));
  }

  verGrupos() {
    this.registrosServicio.obtenerGrupos().subscribe(datos => this.mostrar(datos));
  }

  verRegistros() {
    this.registrosServicio.obtenerRegistros().subscribe(datos => this.mostrar(datos));
  }

  mostrar(datos: any[]) {
    this.filtro = '';
    this.columnaFiltro = '';
    this.filas = datos;
    this.columnas = Object.keys(datos[0] ?? {});
  }
}

