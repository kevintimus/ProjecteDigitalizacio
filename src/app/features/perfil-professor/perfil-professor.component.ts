import { Component, Input } from '@angular/core';
import { Professor } from '../../core/models/professor.model';

@Component({
  selector: 'app-perfil-professor',
  standalone: true,
  templateUrl: './perfil-professor.component.html',
  styleUrl: './perfil-professor.component.css',
})
export class PerfilProfessorComponent {
  @Input({ required: true }) professor!: Professor;
}
