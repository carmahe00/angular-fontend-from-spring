import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {
  titulo:string = 'Crear Cliente';
  cliente:Cliente = new Cliente;
  errores:string[];
  /**
   * @param _clienteService es el servicio para hacer las peticiones http
   * @param router nos sirve para navegar a otras rutas
   * @param activateRouter podemos obtener datos que se envia desde la url
   */
  constructor(private _clienteService: ClienteService, 
    private router:Router,
    private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  /**
   * método para cargar el cliente al formulario
   * @param activateRouter obtiene el id por medio de la @instance params
   */
  cargarCliente():void{
    this.activateRouter.params.subscribe( params => {
      let id = params['id'];
      if(id){
        this._clienteService.getCliente(id).subscribe( cliente => this.cliente = cliente)
      }
    })
  }

  /**
   * método para llamar el crear
   * nos subscribimos y luego redireccionamos a la url /clientes
   */
  create():void{
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
      err =>{
        this.errores = err.error.errors as string[];
        console.log(err)
      }
    );
  }

  update():void{
    this._clienteService.update(this.cliente).subscribe( json =>{
      this.router.navigate(['/clientes'])
      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Cliente ${json.cliente.nombre} actualizado con éxito!`,
        showConfirmButton: false,
        timer: 1500
      })
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.log(err)
    })
  }
  
  
}
