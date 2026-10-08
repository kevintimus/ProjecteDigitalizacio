import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumne } from '../models/alumne';
import { AlumnesService } from '../services/alumnes.service';
import { AlumneBanyComponent } from '../alumne-bany/alumne-bany.component';

@Component({
  selector: 'app-lector-codi-barres',
  standalone: true,
  imports: [FormsModule, AlumneBanyComponent],
  templateUrl: './lector-codi-barres.component.html',
  styleUrl: './lector-codi-barres.component.css',
})
export class LectorCodiBarresComponent {
  codiEscanejat = '';

  alumnesActius: Alumne[] = [];

  constructor(private alumnesService: AlumnesService) {}

  onCodiLlegit() {
    // la pistola escribe el id y da Enter
    // falta conectar con alumnesService.getPerId(...)
    this.codiEscanejat = '';
  }

  onAlumneSurt(alumneId: string) {
    this.alumnesActius = this.alumnesActius.filter((a) => a.id !== alumneId);
  }
}
