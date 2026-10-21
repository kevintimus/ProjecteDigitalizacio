import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { Alumno, obtenerNombreCompleto } from '../../core/models';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './estadisticas.component.html',
})
export class EstadisticasComponent {
  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  private horasDelDia = [8, 9, 10, 11, 12, 13, 14];

  constructor(public datosService: DataService) {}

  get totalSalidas(): number {
    return this.datosService.salidas.length;
  }

  get duracionMediaMinutos(): number {
    const salidasCerradas = this.datosService.salidas.filter((salida) => salida.horaSalida);
    if (salidasCerradas.length === 0) return 0;
    const duracionTotal = salidasCerradas.reduce((total, salida) => total + (salida.horaSalida!.getTime() - salida.horaEntrada.getTime()), 0);
    return Math.round(duracionTotal / salidasCerradas.length / 60000);
  }

  get salidasPorHora(): { hora: number; cantidadSalidas: number }[] {
    return this.horasDelDia.map((hora) => ({
      hora,
      cantidadSalidas: this.datosService.salidas.filter((salida) => salida.horaEntrada.getHours() === hora).length,
    }));
  }

  get maxSalidasPorHora(): number {
    return Math.max(1, ...this.salidasPorHora.map((registro) => registro.cantidadSalidas));
  }

  get rankingAlumnos(): { alumno: Alumno; cantidadSalidas: number }[] {
    return this.datosService.alumnos
      .map((alumno) => ({ alumno, cantidadSalidas: this.datosService.totalSalidasDe(alumno.id) }))
      .filter((registro) => registro.cantidadSalidas > 0)
      .sort((a, b) => b.cantidadSalidas - a.cantidadSalidas)
      .slice(0, 5);
  }
}
