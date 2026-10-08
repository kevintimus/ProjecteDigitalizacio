import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { nombreCompleto } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="login">
      <form class="panel formulario" (ngSubmit)="entrar()">
        <h1>Entrar al control del baño</h1>
        <p class="ayuda">Modo demostración: elige un profesor. El acceso real se conectará a la base de datos más adelante.</p>
        <div class="campo">
          <label for="login-correo">Profesor</label>
          <select id="login-correo" name="correo" [(ngModel)]="correo">
            @for (p of data.profesores(); track p.id) {
              <option [value]="p.email">{{ nombre(p) }} ({{ p.rol === 'admin' ? 'admin' : 'profesor' }})</option>
            }
          </select>
        </div>
        <button type="submit" class="btn btn-lima">Entrar</button>
      </form>
    </main>
  `,
})
export class LoginComponent {
  data = inject(DataService);
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly nombre = nombreCompleto;
  correo = this.data.profesores()[0]?.email ?? '';

  entrar(): void {
    if (this.auth.login(this.correo)) this.router.navigate(['/']);
  }
}
