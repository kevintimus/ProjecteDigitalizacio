import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alumne } from '../models/alumne';
import { RegistreBany } from '../models/registre-bany';
import { RegistresBanyService } from '../services/registres-bany.service';
import { AlumnesService } from '../services/alumnes.service';

@Component({
  selector: 'app-alumne-bany',
  standalone: true,
  templateUrl: './alumne-bany.component.html',
  styleUrl: './alumne-bany.component.css',
})
export class AlumneBanyComponent implements OnInit{
  /*
  @Input({ required: true }) alumne!: Alumne;
  @Input() professorId!: string;
  @Output() finalitzat = new EventEmitter<string>();

  registreActual: RegistreBany | null = null;
  */

  llistaPendents: any[] = []

  constructor(private s: RegistresBanyService, private alumS: AlumnesService, private cdr: ChangeDetectorRef) {
    this.llistaPendents = []
  }

  ngOnInit(): void {
    this.iniciarTemps()

    this.s.getActius().subscribe((pendents: any[]) => {
      pendents.forEach(pendent => {
        this.alumS.getAlumnesActius(pendent.idecat_alum).subscribe((alumnes: any[]) => {
          this.llistaPendents.push(alumnes)
          this.cdr.detectChanges()
        })
      })
    })
  }

  iniciarTemps() {
    // falta llamar a registresBanyService.iniciar(...)
  }

  sortir() {
    // falta llamar a registresBanyService.finalitzar(...)
  }
}
