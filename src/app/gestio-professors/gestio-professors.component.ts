import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Professor } from '../models/professor';
import { ProfessorsService } from '../services/professors.service';

@Component({
  selector: 'app-gestio-professors',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestio-professors.component.html',
  styleUrl: './gestio-professors.component.css',
})
export class GestioProfessorsComponent implements OnInit {
  professors: Professor[] = [];
  nouProfessor: Partial<Professor> = {};

  constructor(private professorsService: ProfessorsService) {}

  ngOnInit() {
    // falta subscribirse y guardar en this.professors
    this.professorsService.getTots().subscribe();
  }

  crear() {
    // falta llamar a professorsService.crear(...)
  }

  editar(professor: Professor) {
    // falta el formulario de edición
  }

  eliminar(professor: Professor) {
    // falta llamar a professorsService.eliminar(...)
  }
}
