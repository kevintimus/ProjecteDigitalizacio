import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private sesionService: AuthService, private enrutador: Router) {}

  canActivate(): boolean | UrlTree {
    return this.sesionService.user ? true : this.enrutador.createUrlTree(['/login']);
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private sesionService: AuthService, private enrutador: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.sesionService.user) return this.enrutador.createUrlTree(['/login']);
    return this.sesionService.esAdmin ? true : this.enrutador.createUrlTree(['/']);
  }
}
