export interface RegistreBany {
  id_reg: number;
  idecat_alum: number;
  idecat_prof: number;
  id_grup: string;
  data: string;
  hora_entrada: string;
  hora_sortida: string | null;
}
