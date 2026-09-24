import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Bloqueja l'accés a les pantalles d'administració (afegir/editar/esborrar profes i alumnes)
// si el professor loguejat no té isAdmin = true
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.esAdmin()) return true;

  router.navigate(['/admin']); // torna al dashboard normal
  return false;
};
