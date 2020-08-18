import { Injectable } from '@angular/core';
import { Cliente } from './cliente';

import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  /**
   * @param urlEndPoint es la url por defecto
   */
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  /**
   * @param httpHeaders es el tipo de informaciones que enviamos(JSON)
   */
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * @returns devulve todas las regiones
   */
  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  /**
   * método para devolver el listado de clientes
   * @method tap sólo muestra los clientes
   * @param page es el número de la página
   * @method map devuelve lista de clientes en mayuscula
   */
  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente);
        })
      }),
      map((response: any) => {

        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        })
        return response;
      })
    );
  }

  /**
   * método para crear
   * @param cliente es el cliente que recibe del formulario
   * @method post (dirección url, objeto (Cliente), formato en que se envia)
   * @method catchError tiene dos posibles estado que se manejan de fotma diferente (400  y 500)
   */
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e);
        swal.fire({ title: e.error.mensaje, text: e.error.error, icon: 'error' });
        return throwError(e);
      })
    );
  }

  /**
   * método para llamar al cliente
   * @param id el identidicador del cliente
   * @method catchError obtiene el error (404 y 500)
   */
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e);
        swal.fire('Error al buscar el cliente', e.error.mensaje, 'error');
        return catchError(e)
      })
    );
  }

  /**
   * método para actualizar
   * @param cliente lo recibe del formulario
   * @method put (dirección url+id, objeto (Cliente), formato en que se envia)
   * @method catchError tiene dos posibles estado que se manejan de fotma diferente (400  y 500)
   */
  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e);
        swal.fire({ title: e.error.mensaje, text: e.error.error, icon: 'error' });
        return throwError(e);
      })
    );
  }

  /**
   * método para eliminar
   * @param id es el identificador del cliente
   */
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e);
        swal.fire({ title: e.error.mensaje, text: e.error.error, icon: 'error' });
        return throwError(e);
      })
    );
  }

  /**
   * método para subir foto
   * @param archivo es el la foto
   * @param id el identificador del cliente
   * @returns devulve un Observable<HttpEvent<{}>> para mostrar la carga de imagen
   */
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    })

    return this.http.request(req);
  }
}
