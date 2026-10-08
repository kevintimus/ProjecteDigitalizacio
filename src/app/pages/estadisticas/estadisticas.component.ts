import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { nombreCompleto } from '../../core/models';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/" class="volver">Volver al inicio</a>
      <h1>Estadísticas generales</h1>

      <section class="cifras" aria-label="Resumen de hoy">
        <div class="cifra"><span class="cifra-n">{{ total() }}</span><span>salidas registradas</span></div>
        <div class="cifra"><span class="cifra-n">{{ media() }} min</span><span>duración media</span></div>
        <div class="cifra"><span class="cifra-n">{{ data.fuera().length }}</span><span>en el baño ahora</span></div>
      </section>

      <div class="dos-col">
        <section class="panel" aria-labelledby="t-horas">
          <h2 id="t-horas">Salidas por hora</h2>
          <div class="barras">
            @for (h of porHora(); track h.hora) {
              <div class="barra-fila">
                <span>{{ h.hora }}:00</span>
                <div class="pista-barra"><span [style.width.%]="(h.n / maxHora()) * 100"></span></div>
                <strong>{{ h.n }}</strong>
              </div>
            }
          </div>
        </section>

        <section class="panel" aria-labelledby="t-top">
          <h2 id="t-top">Alumnos con más salidas</h2>
          <table class="tabla">
            <thead><tr><th scope="col">Alumno</th><th scope="col">Salidas</th></tr></thead>
            <tbody>
              @for (r of ranking(); track r.alumno.id) {
                <tr>
                  <td>{{ nombre(r.alumno) }} @if (r.alumno.susceptible) { <span class="chip chip-alerta">Susceptible</span> }</td>
                  <td>{{ r.n }}</td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      </div>
    </main>
  `,
})
export class EstadisticasComponent {
  data = inject(DataService);
  readonly nombre = nombreCompleto;
  private horas = [8, 9, 10, 11, 12, 13, 14];

  total = computed(() => this.data.salidas().length);

  media = computed(() => {
    const cerradas = this.data.salidas().filter((s) => s.horaSalida);
    if (!cerradas.length) return 0;
    const ms = cerradas.reduce((t, s) => t + (s.horaSalida!.getTime() - s.horaEntrada.getTime()), 0);
    return Math.round(ms / cerradas.length / 60000);
  });

  porHora = computed(() =>
    this.horas.map((hora) => ({ hora, n: this.data.salidas().filter((s) => s.horaEntrada.getHours() === hora).length })),
  );
  maxHora = computed(() => Math.max(1, ...this.porHora().map((h) => h.n)));

  ranking = computed(() =>
    this.data.alumnos()
      .map((alumno) => ({ alumno, n: this.data.totalSalidasDe(alumno.id) }))
      .filter((r) => r.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 5),
  );
}
