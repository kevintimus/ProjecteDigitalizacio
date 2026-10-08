export interface Professor {
  id: string;
  nom: string;
  cognom1: string;
  cognom2: string;
  gmail: string;
  isAdmin: boolean;   // controla si veu les opcions d'administració
  aula?: string;
  curs?: string;
  fotoUrl?: string;
}
