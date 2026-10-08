import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Alumno, fechaLarga, iniciales, nombreCompleto } from '../../core/models';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <main class="page home">
      @if (auth.esAdmin()) {
        <section class="admin-barra" aria-label="Herramientas de administración">
          <form class="buscador" (ngSubmit)="irAFicha()">
            <div class="campo">
              <label for="buscar-correo">Buscar por correo</label>
              <input id="buscar-correo" name="correo" list="lista-correos" autocomplete="off"
                     [(ngModel)]="correo" placeholder="Empieza a escribir un correo" />
              <datalist id="lista-correos">
                @for (c of data.correos(); track c.tipo + c.id) {
                  <option [value]="c.email">{{ c.etiqueta }}</option>
                }
              </datalist>
            </div>
            <button class="btn btn-oscuro" type="submit">Ver ficha</button>
          </form>
          <a routerLink="/estadisticas" class="btn btn-oscuro">Estadísticas generales</a>
          @if (errorCorreo()) {
            <p class="msg msg-error admin-error" role="alert">{{ errorCorreo() }}</p>
          }
        </section>
      }

      <div class="col">
        <section class="escaner" aria-labelledby="t-escaner">
          <h1 id="t-escaner">Código del alumno</h1>
          <form class="escaner-form" (ngSubmit)="buscar()">
            <input #codigoInput name="codigo" [(ngModel)]="codigo" inputmode="numeric" autocomplete="off"
                   aria-label="Código del alumno" placeholder="Escanea o escribe el código" />
            <button class="btn btn-lima" type="submit">Buscar</button>
          </form>
          @if (error()) { <p class="msg msg-error" role="alert">{{ error() }}</p> }
          @if (aviso()) { <p class="msg msg-ok" role="status">{{ aviso() }}</p> }
          <!-- Quitar cuando haya base de datos -->
          <p class="pista">Códigos de prueba: 1001 a 1006</p>
        </section>

        @if (alumnoActual(); as a) {
          <section class="panel ficha" aria-label="Ficha del alumno">
            <div class="ficha-cab">
              <div class="avatar" aria-hidden="true">{{ iniciales(a) }}</div>
              <div>
                <h2>{{ nombre(a) }}</h2>
                @if (a.susceptible) { <span class="chip chip-alerta">Susceptible</span> }
              </div>
            </div>
            <dl class="datos">
              <div><dt>Permiso del profesor</dt><dd>{{ auth.user() ? nombre(auth.user()!) : '' }}</dd></div>
              <div><dt>Susceptible</dt><dd [class.texto-alerta]="a.susceptible">{{ a.susceptible ? 'Sí' : 'No' }}</dd></div>
              <div><dt>Fecha de nacimiento</dt><dd>{{ fecha(a.nacimiento) }}</dd></div>
              <div><dt>Salidas registradas</dt><dd>{{ data.totalSalidasDe(a.id) }}</dd></div>
              @if (salidaActual(); as s) {
                <div><dt>Hora de entrada</dt><dd>{{ s.horaEntrada | date: 'HH:mm' }}</dd></div>
              }
            </dl>
            <div class="acciones">
              <button #accionBtn type="button" class="btn btn-lima btn-grande" (click)="confirmar()">
                {{ salidaActual() ? 'Registrar salida' : 'Enviar al baño' }}
              </button>
              <button type="button" class="btn btn-claro" (click)="limpiar()">Cancelar</button>
            </div>
          </section>
        }
      </div>

      <aside class="col" aria-labelledby="t-fuera">
        <h2 id="t-fuera">En el baño ahora <span class="contador">{{ fuera().length }}</span></h2>
        @if (fuera().length === 0) {
          <p class="vacio">Nadie ha salido de clase. Escanea un código para registrar una salida.</p>
        }
        <ul class="fuera-lista">
          @for (f of fuera(); track f.salida.id) {
            <li class="tarjeta-fuera" [class.largo]="f.minutos >= 10">
              <div class="avatar peq" aria-hidden="true">{{ iniciales(f.alumno) }}</div>
              <div>
                <strong>{{ nombre(f.alumno) }}</strong>
                <div class="detalle">Entrada a las {{ f.salida.horaEntrada | date: 'HH:mm' }}</div>
              </div>
              <div class="tiempo" [attr.aria-label]="f.minutos + ' minutos fuera'">{{ f.minutos }} min</div>
              <button type="button" class="btn btn-claro" (click)="registrarSalida(f.salida.id, f.alumno.nombre)">Registrar salida</button>
            </li>
          }
        </ul>
      </aside>
    </main>
  `,
})
export class InicioComponent implements AfterViewInit, OnDestroy {
  auth = inject(AuthService);
  data = inject(DataService);
  private router = inject(Router);

  @ViewChild('codigoInput') codigoInput?: ElementRef<HTMLInputElement>;
  @ViewChild('accionBtn') accionBtn?: ElementRef<HTMLButtonElement>;

  readonly nombre = nombreCompleto;
  readonly iniciales = iniciales;
  readonly fecha = fechaLarga;

  codigo = '';
  correo = '';
  alumnoActual = signal<Alumno | null>(null);
  error = signal('');
  aviso = signal('');
  errorCorreo = signal('');
  private ahora = signal(Date.now());
  private timer = setInterval(() => this.ahora.set(Date.now()), 20000);

  salidaActual = computed(() => {
    const a = this.alumnoActual();
    return a ? this.data.salidaAbierta(a.id) : undefined;
  });

  fuera = computed(() =>
    this.data.fuera().flatMap((salida) => {
      const alumno = this.data.alumno(salida.alumnoId);
      return alumno
        ? [{ salida, alumno, minutos: Math.max(0, Math.floor((this.ahora() - salida.horaEntrada.getTime()) / 60000)) }]
        : [];
    }),
  );

  ngAfterViewInit(): void {
    this.enfocarCodigo();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.alumnoActual()) this.limpiar();
  }

  buscar(): void {
    const codigo = this.codigo.trim();
    if (!codigo) return;
    this.aviso.set('');
    const alumno = this.data.alumnoPorCodigo(codigo);
    if (!alumno) {
      this.alumnoActual.set(null);
      this.error.set(`No hay ningún alumno con el código ${codigo}. Revisa el número e inténtalo de nuevo.`);
      this.codigo = '';
      this.enfocarCodigo();
      return;
    }
    this.error.set('');
    this.alumnoActual.set(alumno);
    // El botón principal recibe el foco: otro Enter confirma sin usar el ratón
    setTimeout(() => this.accionBtn?.nativeElement.focus());
  }

  confirmar(): void {
    const a = this.alumnoActual();
    const profe = this.auth.user();
    if (!a || !profe) return;
    const abierta = this.data.salidaAbierta(a.id);
    if (abierta) {
      this.data.registrarSalida(abierta.id);
      this.aviso.set(`Salida registrada: ${a.nombre} ha vuelto a clase.`);
    } else {
      this.data.enviarAlBano(a.id, profe.id);
      this.aviso.set(`${a.nombre} está en el baño.`);
    }
    this.limpiar(false);
  }

  registrarSalida(salidaId: number, nombre: string): void {
    this.data.registrarSalida(salidaId);
    this.aviso.set(`Salida registrada: ${nombre} ha vuelto a clase.`);
    this.enfocarCodigo();
  }

  limpiar(borrarAviso = true): void {
    this.codigo = '';
    this.alumnoActual.set(null);
    this.error.set('');
    if (borrarAviso) this.aviso.set('');
    this.enfocarCodigo();
  }

  irAFicha(): void {
    const e = this.correo.trim().toLowerCase();
    if (!e) return;
    const c = this.data.correos().find((x) => x.email.toLowerCase() === e);
    if (!c) {
      this.errorCorreo.set('No hay ningún profesor ni alumno con ese correo.');
      return;
    }
    this.errorCorreo.set('');
    this.router.navigate(['/ficha', c.tipo, c.id]);
  }

  private enfocarCodigo(): void {
    setTimeout(() => this.codigoInput?.nativeElement.focus());
  }
}
