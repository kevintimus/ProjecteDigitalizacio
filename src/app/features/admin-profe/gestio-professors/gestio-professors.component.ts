import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Professor } from '../../../core/models/professor.model';
import { ProfessorsService } from '../../../core/services/professors.service';

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
    // TODO: subscriure's i omplir this.professors
    this.professorsService.getTots().subscribe();
  }

  crear() {
    // TODO: cridar professorsService.crear(this.nouProfessor) i refrescar la llista
  }

  editar(professor: Professor) {
    // TODO: obrir formulari d'edició i cridar professorsService.editar(...)
  }

  eliminar(professor: Professor) {
    // TODO: cridar professorsService.eliminar(professor.id) i refrescar la llista
  }
}
