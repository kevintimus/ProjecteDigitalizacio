import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PerfilProfessorComponent } from '../perfil-professor/perfil-professor.component';

@Component({
  selector: 'app-admin-profe',
  standalone: true,
  imports: [RouterLink, RouterOutlet, PerfilProfessorComponent],
  templateUrl: './admin-profe.component.html',
  styleUrl: './admin-profe.component.css',
})
export class AdminProfeComponent {
  constructor(public auth: AuthService) {}
}
