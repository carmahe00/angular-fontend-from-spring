import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {
  titulo: string = 'Crear Cliente';
  cliente: Cliente = new Cliente;
  regiones: Region[];
  errores: string[];

  /**
   * @param _clienteService es el servicio para hacer las peticiones http
   * @param router nos sirve para navegar a otras rutas
   * @param activateRouter podemos obtener datos que se envia desde la url
   */
  constructor(private _clienteService: ClienteService,
    private router: Router,
    private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this._clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  /**
   * método para cargar el cliente al formulario
   * @param activateRouter obtiene el id por medio de la @instance params
   */
  cargarCliente(): void {
    this.activateRouter.paramMap.subscribe(params => {
      let id = +params.get('id');
      if (id) {
        this._clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
      }
    })
  }

  /**
   * método para llamar el crear
   * nos subscribimos y luego redireccionamos a la url /clientes
   */
  create(): void {
    console.log(this.cliente);
    this._clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Cliente ${cliente.nombre} creado con éxito!`,
          showConfirmButton: false,
          timer: 1500
        })
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log(err)
      }
    );
  }

  /**
   * método actualizar cliente
   * @param cliente.facturas la asigna en null, por problema de recursividad cuando actualizar
   */
  update(): void {
    this.cliente.facturas = null;
    this._clienteService.update(this.cliente).subscribe(json => {
      this.router.navigate(['/clientes'])
      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Cliente ${json.cliente.nombre} actualizado con éxito!`,
        showConfirmButton: false,
        timer: 1500
      })
    },
      err => {
        this.errores = err.error.errors as string[];
        console.log(err)
      })
  }

  /**
   * métod para verificar el objeto region de la iteración con el del cliente para seleccionarlo
   * @param o1 región de las iteraciones
   * @param o2 región del cliente
   */
  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id
  }
}
