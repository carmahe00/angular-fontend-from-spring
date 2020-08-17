import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {


  @Input() paginador:any;
  /**
   * @param paginas contiene el número de páginas
   */
  paginas: number[];
  desde:number;
  hasta:number;

  constructor() { }

  /**
   * @method ngOnInit sólo se ejecuta una vez
   */
  ngOnInit(): void {
    this.initPaginator();
  }

  /**
   * @method ngOnChanges se ejecuta cada vez que haya un cambio
   * @param changes obtiene el cambio del parámetro
   * si el paginador obtuvo un valor anterior ejecutamos @method initPaginator
   */
  ngOnChanges(changes:SimpleChanges){
    let paginadorActualizado = changes['paginador'];
    if(paginadorActualizado.previousValue){
      this.initPaginator();
    }
  }

  /**
   * @var desde obtiene el inicio del páginador
   * @var hasta obtiene el fin del páginador
   */
  private initPaginator():void{
    this.desde = Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages-5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+4),6);
    if(this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor, indice)=> indice+this.desde);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice)=> indice+1);
    }
  }
}
