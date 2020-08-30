import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * AuthGuard verifica ue esté autenticado
 */
export class AuthGuard implements CanActivate {

  /**
   * 
   * @param authservice verifica que esté autenticado
   * @param router redirije a otra logn
   */
  constructor(private authservice: AuthService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authservice.isAuthenticated()) {
      if (this.isTokenExpirado()) {
        this.authservice.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  /**
   * método para verificar si el token expiro
   * primero obtenemos el token. Luego, obtener la infomación del token, 
   * después comparar los segundos
   */
  isTokenExpirado(): boolean {
    let token = this.authservice.token;
    let payload = this.authservice.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }
}
