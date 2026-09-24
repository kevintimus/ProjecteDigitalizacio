import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumne } from '../../core/models/alumne.model';
import { AlumnesService } from '../../core/services/alumnes.service';
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
  // Un alumne per cada targeta oberta (permet tenir més d'un alumne fora alhora)
  alumnesActius: Alumne[] = [];

  constructor(private alumnesService: AlumnesService) {}

  onCodiLlegit() {
    // La pistola de codis de barres actua com un teclat: escriu l'ID i prem Enter
    // TODO: this.alumnesService.getPerId(this.codiEscanejat).subscribe(alumne => this.alumnesActius.push(alumne))
    this.codiEscanejat = '';
  }

  onAlumneSurt(alumneId: string) {
    this.alumnesActius = this.alumnesActius.filter((a) => a.id !== alumneId);
  }
}
