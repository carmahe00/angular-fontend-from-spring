import { Producto } from './producto';
export class ItemFactura {
    producto:Producto;
    cantidad:number=1;
    importe:number;

    /**
     * método cuando se crea la línea
     */
    public calcularImporte(){
        return this.cantidad*this.producto.precio;
    }
}
