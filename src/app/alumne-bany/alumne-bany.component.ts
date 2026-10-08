import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alumne } from '../models/alumne';
import { RegistreBany } from '../models/registre-bany';
import { RegistresBanyService } from '../services/registres-bany.service';

@Component({
  selector: 'app-alumne-bany',
  standalone: true,
  templateUrl: './alumne-bany.component.html',
  styleUrl: './alumne-bany.component.css',
})
export class AlumneBanyComponent {
  @Input({ required: true }) alumne!: Alumne;
  @Input() professorId!: string;
  @Output() finalitzat = new EventEmitter<string>();

  registreActual: RegistreBany | null = null;

  constructor(private registresBanyService: RegistresBanyService) {}

  iniciarTemps() {
    // falta llamar a registresBanyService.iniciar(...)
  }

  sortir() {
    // falta llamar a registresBanyService.finalitzar(...)
  }
}
