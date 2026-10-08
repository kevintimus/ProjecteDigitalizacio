import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  gmail = '';
  contrasenya = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    // falta comprobar que el login sea correcto antes de navegar
    this.auth.login(this.gmail, this.contrasenya);
    this.router.navigate(['/admin']);
  }
}
