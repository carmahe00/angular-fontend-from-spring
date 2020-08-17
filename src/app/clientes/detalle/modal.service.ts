import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * ModalService: sirve para abrir y cerrar el modal; además emite el cliente
 */
export class ModalService {

  modal:boolean=false;
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  }

  abrirModal(){
    this.modal = true;
  }
  cerrarModal(){
    this.modal = false;
  }
}
