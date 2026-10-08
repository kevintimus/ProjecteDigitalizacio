import {AfterViewInit, Component, NgZone} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  gmail = '';
  contrasenya = '';
  error = '';

  constructor(private auth: AuthService, private router: Router, private zone: NgZone) {}

  ngAfterViewInit() {
    if (typeof google === 'undefined') return; // el script de Google aún no ha cargado

    google.accounts.id.initialize({
      client_id: '983059310825-7avis087hgknmhrov9pe7kcbjqt59tcv.apps.googleusercontent.com',
      callback: (resp: { credential: string }) => {
        // Google llama a esto fuera de Angular; zone.run hace que la pantalla se actualice
        this.zone.run(() => {
          this.auth.loginConGoogle(resp.credential).subscribe({
            next: () => this.router.navigate(['/admin']),
            error: () => (this.error = 'No se pudo entrar con Google. ¿Tu correo está dado de alta?'),
          });
        });
      },
    });
    google.accounts.id.renderButton(document.getElementById('btn-google'), {
      theme: 'filled_green',
      size: 'large',
    });
  }

  onSubmit() {
    // falta comprobar que el login sea correcto antes de navegar
    this.auth.login(this.gmail, this.contrasenya);
    this.router.navigate(['/admin']);
  }
}
