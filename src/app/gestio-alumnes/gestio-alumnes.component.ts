import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumne } from '../models/alumne';
import { AlumnesService } from '../services/alumnes.service';

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
    // falta cargar la lista de alumnes
  }

  crear() {
    // falta llamar a alumnesService.crear(...)
  }

  editar(alumne: Alumne) {
    // falta el formulario de edición
  }

  eliminar(alumne: Alumne) {
    // falta llamar a alumnesService.eliminar(...)
  }
}
