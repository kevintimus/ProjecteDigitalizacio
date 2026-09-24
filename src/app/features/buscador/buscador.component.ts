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
  tipus: TipusCerca = 'alumne'; // menú desplegable: buscar per professor o per alumne
  gmail = '';

  cercar() {
    // TODO: segons this.tipus, cridar professorsService o alumnesService amb this.gmail
  }
}
