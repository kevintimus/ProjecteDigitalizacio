import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { fechaLarga, iniciales, nombreCompleto } from '../../core/models';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page estrecha">
      <a routerLink="/" class="volver">Volver al inicio</a>

      @if (alumno(); as a) {
        <section class="panel ficha" aria-label="Ficha del alumno">
          <div class="ficha-cab">
            <div class="avatar" aria-hidden="true">{{ iniciales(a) }}</div>
            <div>
              <h1>{{ nombre(a) }}</h1>
              @if (a.susceptible) { <span class="chip chip-alerta">Susceptible</span> }
            </div>
          </div>
          <dl class="datos">
            <div><dt>Correo</dt><dd>{{ a.email }}</dd></div>
            <div><dt>Código</dt><dd>{{ a.codigo }}</dd></div>
            <div><dt>Fecha de nacimiento</dt><dd>{{ fecha(a.nacimiento) }}</dd></div>
            <div><dt>Salidas registradas</dt><dd>{{ data.totalSalidasDe(a.id) }}</dd></div>
          </dl>
          <div class="acciones">
            <a class="btn btn-lima" [routerLink]="['/admin', 'alumnos', 'editar']" [queryParams]="{ correo: a.email }">Editar alumno</a>
            <a class="btn btn-claro" [routerLink]="['/admin', 'alumnos', 'borrar']" [queryParams]="{ correo: a.email }">Borrar alumno</a>
          </div>
        </section>
      } @else {
       @if (profesor(); as p) {
        <section class="panel ficha" aria-label="Ficha del profesor">
          <div class="ficha-cab">
            <div class="avatar" aria-hidden="true">{{ iniciales(p) }}</div>
            <div>
              <h1>{{ nombre(p) }}</h1>
              <span class="chip chip-rol">{{ p.rol === 'admin' ? 'Admin' : 'Profesor' }}</span>
            </div>
          </div>
          <dl class="datos">
            <div><dt>Correo</dt><dd>{{ p.email }}</dd></div>
            <div><dt>Aula</dt><dd>{{ p.aula || 'Sin indicar' }}</dd></div>
            <div><dt>Curso</dt><dd>{{ p.curso || 'Sin indicar' }}</dd></div>
            <div><dt>Fecha de nacimiento</dt><dd>{{ fecha(p.nacimiento) }}</dd></div>
          </dl>
          <div class="acciones">
            <a class="btn btn-lima" [routerLink]="['/admin', 'profesores', 'editar']" [queryParams]="{ correo: p.email }">Editar profesor</a>
            <a class="btn btn-claro" [routerLink]="['/admin', 'profesores', 'borrar']" [queryParams]="{ correo: p.email }">Borrar profesor</a>
          </div>
        </section>
       } @else {
        <section class="panel">
          <h1>No encontramos esa ficha</h1>
          <p>Es posible que se haya eliminado. Busca otra persona por su correo desde el inicio.</p>
          <a routerLink="/" class="btn btn-lima">Ir al inicio</a>
        </section>
       }
      }
    </main>
  `,
})
export class FichaComponent {
  data = inject(DataService);
  private params = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true });

  readonly nombre = nombreCompleto;
  readonly iniciales = iniciales;
  readonly fecha = fechaLarga;

  private id = computed(() => Number(this.params().get('id')));
  alumno = computed(() => (this.params().get('tipo') === 'alumnos' ? this.data.alumno(this.id()) : undefined));
  profesor = computed(() => (this.params().get('tipo') === 'profesores' ? this.data.profesor(this.id()) : undefined));
}
