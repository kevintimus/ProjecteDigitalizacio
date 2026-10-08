import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { TipoPersona, nombreCompleto } from '../../core/models';

type Accion = 'nuevo' | 'editar' | 'borrar';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page estrecha">
      <a routerLink="/" class="volver">Volver al inicio</a>
      <h1>{{ titulo }}</h1>

      <form class="panel formulario" (ngSubmit)="enviar()" novalidate>
        @if (accion !== 'nuevo') {
          <div class="campo">
            <label for="f-buscar">Correo del {{ singular }}</label>
            <input id="f-buscar" name="buscar" type="email" list="lista-correos" autocomplete="off"
                   [(ngModel)]="f.email" (ngModelChange)="alCambiarCorreo()" placeholder="Empieza a escribir el correo" />
            <datalist id="lista-correos">
              @for (c of correos; track c.email) { <option [value]="c.email">{{ c.etiqueta }}</option> }
            </datalist>
          </div>
        }

        @if (accion === 'borrar') {
          @if (seleccionado) {
            <p class="resumen"><strong>{{ nombreSel }}</strong> se eliminará de forma definitiva.</p>
          }
        } @else if (accion === 'nuevo' || seleccionado) {
          <div class="fila-3">
            <div class="campo"><label for="f-nombre">Nombre</label><input id="f-nombre" name="nombre" [(ngModel)]="f.nombre" /></div>
            <div class="campo"><label for="f-ap1">Primer apellido</label><input id="f-ap1" name="apellido1" [(ngModel)]="f.apellido1" /></div>
            <div class="campo"><label for="f-ap2">Segundo apellido</label><input id="f-ap2" name="apellido2" [(ngModel)]="f.apellido2" /></div>
          </div>
          @if (accion === 'nuevo') {
            <div class="campo"><label for="f-email">Correo</label><input id="f-email" name="email" type="email" [(ngModel)]="f.email" /></div>
          }
          @if (tipo === 'alumnos') {
            <div class="fila-2">
              <div class="campo"><label for="f-codigo">Código</label><input id="f-codigo" name="codigo" inputmode="numeric" [(ngModel)]="f.codigo" /></div>
              <div class="campo"><label for="f-nac">Fecha de nacimiento</label><input id="f-nac" name="nacimiento" type="date" [(ngModel)]="f.nacimiento" /></div>
            </div>
            <label class="campo check">
              <input name="susceptible" type="checkbox" [(ngModel)]="f.susceptible" />
              <span>Alumno susceptible</span>
            </label>
          } @else {
            <div class="fila-2">
              <div class="campo"><label for="f-aula">Aula</label><input id="f-aula" name="aula" [(ngModel)]="f.aula" /></div>
              <div class="campo"><label for="f-curso">Curso</label><input id="f-curso" name="curso" [(ngModel)]="f.curso" /></div>
            </div>
            <div class="fila-2">
              <div class="campo"><label for="f-nac">Fecha de nacimiento</label><input id="f-nac" name="nacimiento" type="date" [(ngModel)]="f.nacimiento" /></div>
              <div class="campo">
                <label for="f-rol">Rol</label>
                <select id="f-rol" name="rol" [(ngModel)]="f.rol">
                  <option value="profe">Profesor (solo envía alumnos al baño)</option>
                  <option value="admin">Admin (puede modificar datos)</option>
                </select>
              </div>
            </div>
          }
        }

        @if (mensaje(); as m) {
          <p class="msg" [class.msg-ok]="m.tipo === 'ok'" [class.msg-error]="m.tipo === 'error'"
             [attr.role]="m.tipo === 'error' ? 'alert' : 'status'">{{ m.texto }}</p>
        }

        <div class="acciones">
          @if (accion === 'borrar' && confirmando()) {
            <p class="aviso-borrar" role="alert">¿Seguro? No se puede deshacer.</p>
            <button type="submit" class="btn btn-peligro">Sí, eliminar</button>
            <button type="button" class="btn btn-claro" (click)="confirmando.set(false)">Cancelar</button>
          } @else {
            <button type="submit" class="btn" [class.btn-peligro]="accion === 'borrar'" [class.btn-lima]="accion !== 'borrar'"
                    [disabled]="accion !== 'nuevo' && !seleccionado">{{ textoBoton }}</button>
            <a routerLink="/" class="btn btn-claro">Cancelar</a>
          }
        </div>
      </form>
    </main>
  `,
})
export class PersonaFormComponent {
  private data = inject(DataService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tipo: TipoPersona = 'alumnos';
  accion: Accion = 'nuevo';
  f: any = {};
  seleccionado: any;
  mensaje = signal<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  confirmando = signal(false);

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed())
      .subscribe(([p, q]) => {
        const tipo = p.get('tipo');
        const accion = p.get('accion');
        if ((tipo !== 'alumnos' && tipo !== 'profesores') || !['nuevo', 'editar', 'borrar'].includes(accion ?? '')) {
          this.router.navigate(['/']);
          return;
        }
        this.tipo = tipo;
        this.accion = accion as Accion;
        this.reset();
        const correo = q.get('correo');
        if (correo && this.accion !== 'nuevo') {
          this.f.email = correo;
          this.alCambiarCorreo();
        }
      });
  }

  get singular(): string { return this.tipo === 'alumnos' ? 'alumno' : 'profesor'; }
  get titulo(): string {
    const verbo = { nuevo: 'Añadir', editar: 'Editar', borrar: 'Borrar' }[this.accion];
    return `${verbo} ${this.singular}`;
  }
  get textoBoton(): string {
    return { nuevo: `Crear ${this.singular}`, editar: 'Guardar cambios', borrar: 'Eliminar' }[this.accion];
  }
  get correos() { return this.data.correos().filter((c) => c.tipo === this.tipo); }
  get nombreSel(): string { return this.seleccionado ? nombreCompleto(this.seleccionado) : ''; }

  alCambiarCorreo(): void {
    this.confirmando.set(false);
    this.mensaje.set(null);
    if (this.accion === 'nuevo') return;
    const p = this.data.buscarPorCorreo(this.tipo, this.f.email ?? '');
    this.seleccionado = p;
    if (p && this.accion === 'editar') this.f = { ...p };
  }

  enviar(): void {
    this.mensaje.set(null);
    if (this.accion === 'borrar') { this.borrar(); return; }
    if (this.accion === 'editar' && !this.seleccionado) { this.error('Elige primero un correo de la lista.'); return; }

    const f = this.f;
    if (![f.nombre, f.apellido1, f.email].every((v) => String(v ?? '').trim())) {
      this.error('Rellena nombre, primer apellido y correo.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(String(f.email).trim())) { this.error('El correo no tiene un formato válido.'); return; }

    const idActual: number | undefined = this.seleccionado?.id;
    const existente = this.data.buscarPorCorreo(this.tipo, f.email);
    if (existente && existente.id !== idActual) { this.error('Ya existe alguien con ese correo.'); return; }
    if (this.tipo === 'alumnos') {
      if (!String(f.codigo ?? '').trim()) { this.error('El alumno necesita un código.'); return; }
      if (this.data.codigoEnUso(f.codigo, idActual)) { this.error('Ese código ya lo tiene otro alumno.'); return; }
    }

    const datos = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    if (this.accion === 'nuevo') {
      this.data.crear(this.tipo, datos);
      const nombre = datos['nombre'];
      this.reset();
      this.mensaje.set({ tipo: 'ok', texto: `${nombre} se ha creado.` });
    } else {
      this.data.actualizar(this.tipo, idActual!, datos);
      this.mensaje.set({ tipo: 'ok', texto: 'Cambios guardados.' });
    }
  }

  private borrar(): void {
    if (!this.seleccionado) { this.error('Elige primero un correo de la lista.'); return; }
    if (this.tipo === 'profesores' && this.seleccionado.id === this.auth.user()?.id) {
      this.error('No puedes eliminar tu propio usuario.');
      return;
    }
    if (!this.confirmando()) { this.confirmando.set(true); return; }
    const nombre = this.nombreSel;
    this.data.eliminar(this.tipo, this.seleccionado.id);
    this.reset();
    this.mensaje.set({ tipo: 'ok', texto: `${nombre} se ha eliminado.` });
  }

  private error(texto: string): void { this.mensaje.set({ tipo: 'error', texto }); }

  private reset(): void {
    this.seleccionado = undefined;
    this.confirmando.set(false);
    this.mensaje.set(null);
    this.f = this.tipo === 'alumnos'
      ? { nombre: '', apellido1: '', apellido2: '', email: '', codigo: '', nacimiento: '', susceptible: false }
      : { nombre: '', apellido1: '', apellido2: '', email: '', aula: '', curso: '', nacimiento: '', rol: 'profe' };
  }
}
