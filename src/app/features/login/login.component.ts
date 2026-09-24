import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
    // TODO: cridar auth.login(...) i, si va bé, navegar a /admin
    this.auth.login(this.gmail, this.contrasenya);
    this.router.navigate(['/admin']);
  }
}
