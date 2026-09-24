import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alumne } from '../../core/models/alumne.model';
import { RegistreBany } from '../../core/models/registre-bany.model';
import { RegistresBanyService } from '../../core/services/registres-bany.service';

@Component({
  selector: 'app-alumne-bany',
  standalone: true,
  templateUrl: './alumne-bany.component.html',
  styleUrl: './alumne-bany.component.css',
})
export class AlumneBanyComponent {
  @Input({ required: true }) alumne!: Alumne;
  @Input() professorId!: string;
  @Output() finalitzat = new EventEmitter<string>(); // emet l'id de l'alumne quan surt del bany

  registreActual: RegistreBany | null = null;

  constructor(private registresBanyService: RegistresBanyService) {}

  iniciarTemps() {
    // TODO: cridar registresBanyService.iniciar(this.alumne.id, this.professorId)
    // i guardar el resultat a this.registreActual per mostrar l'hora d'entrada
  }

  sortir() {
    // TODO: cridar registresBanyService.finalitzar(this.registreActual.id)
    // i després this.finalitzat.emit(this.alumne.id) perquè el lector el tregui de la llista
  }
}
