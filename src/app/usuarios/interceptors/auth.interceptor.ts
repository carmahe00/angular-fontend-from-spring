import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * 
   * @param req recibe de la respuesta
   * @param next envía la respuesta
   * @constant authReq clona @param next el request con el token
   */
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login'])
        }
        if (e.status == 403) {
          swal.fire({ title: 'Acceso denegado', text: `Hola ${this.authService.usuario.username} no tienes acceso!`, icon: 'warning' });
          this.router.navigate(['/clientes']);

        }
        return throwError(e);
      })
    );
  }
}