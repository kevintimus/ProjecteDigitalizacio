import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumne } from '../../../core/models/alumne.model';
import { AlumnesService } from '../../../core/services/alumnes.service';

@Component({
  selector: 'app-gestio-alumnes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestio-alumnes.component.html',
  styleUrl: './gestio-alumnes.component.css',
})
export class GestioAlumnesComponent implements OnInit {
  alumnes: Alumne[] = [];
  nouAlumne: Partial<Alumne> = {};

  constructor(private alumnesService: AlumnesService) {}

  ngOnInit() {
    // TODO: carregar la llista d'alumnes (cal decidir l'endpoint: tots, per curs, etc.)
  }

  crear() {
    // TODO: cridar alumnesService.crear(this.nouAlumne) i refrescar la llista
  }

  editar(alumne: Alumne) {
    // TODO: obrir formulari d'edició (permís del professor, susceptible, etc.)
  }

  eliminar(alumne: Alumne) {
    // TODO: cridar alumnesService.eliminar(alumne.id) i refrescar la llista
  }
}
