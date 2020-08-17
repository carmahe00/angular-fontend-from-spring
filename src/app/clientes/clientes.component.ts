import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cliente } from './cliente';

import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  /**
   * 
   * @param _clienteService hace peticiones al servidor
   * @param activatedRoute obtiene parámetros (page)
   * @param modalService sirve para ocultar y mostrat el modal; además actualiza la foto en listado
   */
  constructor(private _clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe(params => {
      //convertimos a número
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this._clienteService.getClientes(page)
        .subscribe(
          (response: any) => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
    });
    //Actualiza la foto del cliente
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._clienteService.delete(cliente.id).subscribe(
          () => {
            //Filtramos todos los clientes menos el que eliminamos
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Su cliente ${cliente.nombre} ha sido eliminado.`,
              'success'
            )
          }
        )

      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
