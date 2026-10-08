export interface Alumne {
  id: string;          // ve del codi de barres
  nom: string;
  cognom1: string;
  cognom2: string;
  permisProfessor: boolean;
  susceptible: boolean; // marca alumnes a vigilar més de prop
  fotoUrl?: string;
}
