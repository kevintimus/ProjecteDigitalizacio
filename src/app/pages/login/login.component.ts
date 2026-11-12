import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { obtenerNombreCompleto } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly obtenerNombreCompleto = obtenerNombreCompleto;
  correoProfesor = "";
  contrasenya = "";
  errorLogin = "";

  constructor(public datosService: DataService, private sesionService: AuthService, private enrutador: Router) {

  }

  entrar(): void {
    if (this.sesionService.login(this.correoProfesor, this.contrasenya)) this.enrutador.navigate(['/']);
    else {
      this.errorLogin = "Credenciales incorrectas";
    }
  }
}
