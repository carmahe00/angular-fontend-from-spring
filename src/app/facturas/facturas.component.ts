import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styles: [
  ]
})
export class FacturasComponent implements OnInit {
  titulo:string = 'Nueva Factura';
  factura:Factura = new Factura(); 
  autoCompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Tablet', 'CellPhone'];
  /**
   * @param productosFiltrados obtiene los productos filtrados
   */
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService:ClienteService, 
    private activateRouter: ActivatedRoute, private facturaService:FacturaService,
    private router:Router) { }

  /**
   * @method map cuando selecciona un objeto deja de ser string, así que devuelvel string
   * @method flatMap convierte un Observable a otro Observable
   */
  ngOnInit(): void {
    this.activateRouter.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente)

    });
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string'? value: value.nombre),
        flatMap(value => value?this._filter(value): [])
      );
  }


  /**
   * método para filtrar los productos búscados
   * @param value el valor a buscar
   * @returns devuleve los productos filtrados
   */
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue)
  }

  /**
   * método para mostrar el producto seleccionado
   * @param producto producto que pasa cuando selecciona
   */
  mostrarNombre(producto?:Producto):string | undefined{
    return producto?producto.nombre: undefined;
  }

  /**
   * 
   * @param event campo seleccionado
   */
  seleccionarProducto(event:MatAutocompleteSelectedEvent):void{
    let producto = event.option.value as Producto;
    console.log(event);
    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  /**
   * método para actualizar la cantidad
   * @param id identificador del producto
   * @param event valor del input
   */
  actualizarCantidad(id:number, event):void{
    let cantidad:number = event.target.value as number;
    if(cantidad ==0){
      return this.eliminarItem(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura )=>{
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  /**
   * método para verificar si ya esta seleccionado el producto
   * @param id identifica del producto
   */
  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item:ItemFactura) =>{
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura )=>{
      if(id === item.producto.id){
        ++item.cantidad ;
      }
      return item;
    });
  }

  eliminarItem(id:number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm):void{
    if(this.factura.items.length ==0){
      this.autoCompleteControl.setErrors({'invalid': true})
    }
    if(facturaForm.form.valid || this.factura.items.length >0){
      this.facturaService.create(this.factura).subscribe(factura => {
        swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Factura ${factura.descripcion} creado con éxito!`,
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/clientes']);
      })
    }
  }
}
