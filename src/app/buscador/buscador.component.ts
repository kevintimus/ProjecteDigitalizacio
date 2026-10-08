import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TipusCerca = 'professor' | 'alumne';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent {
  tipus: TipusCerca = 'alumne';
  gmail = '';

  cercar() {
    // falta llamar al servicio según this.tipus
  }
}
