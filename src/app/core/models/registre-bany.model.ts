export interface RegistreBany {
  id: string;
  alumneId: string;
  professorId: string;
  horaEntrada: Date;
  horaSortida: Date | null; // null mentre l'alumne encara és al bany
}
