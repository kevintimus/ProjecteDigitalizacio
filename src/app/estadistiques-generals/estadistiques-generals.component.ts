import { Component, OnInit } from '@angular/core';
import { RegistresBanyService } from '../services/registres-bany.service';

@Component({
  selector: 'app-estadistiques-generals',
  standalone: true,
  templateUrl: './estadistiques-generals.component.html',
  styleUrl: './estadistiques-generals.component.css',
})
export class EstadistiquesGeneralsComponent implements OnInit {
  dades: unknown; // falta definir qué estadísticas mostrar

  constructor(private registresBanyService: RegistresBanyService) {}

  ngOnInit() {
    // falta llamar a getEstadistiquesGenerals()
  }
}
