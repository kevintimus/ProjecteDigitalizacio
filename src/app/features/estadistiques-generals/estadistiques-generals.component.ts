import { Component, OnInit } from '@angular/core';
import { RegistresBanyService } from '../../core/services/registres-bany.service';

@Component({
  selector: 'app-estadistiques-generals',
  standalone: true,
  templateUrl: './estadistiques-generals.component.html',
  styleUrl: './estadistiques-generals.component.css',
})
export class EstadistiquesGeneralsComponent implements OnInit {
  dades: unknown; // TODO: definir una interfície quan es decideixi què es mostra (temps mitjà, alumnes més freqüents, etc.)

  constructor(private registresBanyService: RegistresBanyService) {}

  ngOnInit() {
    // TODO: this.registresBanyService.getEstadistiquesGenerals().subscribe(...)
  }
}
