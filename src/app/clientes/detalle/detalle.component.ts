import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input()cliente:Cliente;
  titulo:string ="Detalle del cliente";
  fotoSeleccionada:File;
  progreso:number=0;

  /**
   * 
   * @param clienteService sirve para hacer peticiones
   * @param modalService sirve para cerrar el modal; además enviamos emite el cliente
   */
  constructor(private clienteService:ClienteService,
    private _modalService:ModalService,
    private _authService:AuthService) { }

  ngOnInit(): void { }

  get modalService(){
    return this._modalService;
  }

  get authService(){
    return this._authService;
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire({ title: "Error Seleccionar ", text: "Error: debe seleccionar una imagen", icon: 'error' });
      this.fotoSeleccionada= null;
    }
  }

  subirFoto(){
    if(!this.seleccionarFoto){
      swal.fire({ title: "Error", text: "Error: debe seleccionar una foto", icon: 'error' });
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event =>{
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;

          //Emitimos el cliete actualizado
          this.modalService.notificarUpload.emit(this.cliente);

          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.mensaje,
            showConfirmButton: false,
            timer: 1500
          })
        }
        
      });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada=null;
    this.progreso=0;
  }
}
