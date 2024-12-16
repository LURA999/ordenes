import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {
  clientes : any[];
  clientesMostrar: any[];
  cliente : string;
  btnNext: boolean;
  btnPrev: boolean;
  totalPages: number;
  showPages: number;
  actualPage: number;
  lastElement: number;
  currentElement: number;

  constructor( private servicioCliente: ClientService) { 
    this.clientesMostrar = [];
    this.clientes = [];
    servicioCliente.getAll().subscribe((resp:any)=>{
      this.clientes = resp;
      this.paginar(this.clientes);
    });
  }

  ngOnInit(): void {
  }

  buscar(nombre:string){
    let auxiliar: any[]= [];
    //console.log("'a' = 'a'?", ciEquals('a', 'a'));

    //this.ciEquals("a","A");
    if(nombre == undefined || nombre == ""){
      this.paginar(this.clientes);
    }else{
      this.clientes.forEach(element => {
        if(element.nombre.match(nombre)){
          auxiliar.push(element);
        }
      });
      this.paginar(auxiliar);
    }

  }

   ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

  paginar(arreglo:any[]){
    if(arreglo.length <= 10){
      this.clientesMostrar = arreglo;
      this.btnNext = false;
      this.btnPrev = false;
      if(arreglo.length == 0){
        this.actualPage = 0;
        this.totalPages = 0;
      }else{
        this.actualPage = 1;
        this.totalPages = 1;
      }
    }else{
      this.btnNext = true;
      this.btnPrev = false;
      this.lastElement = arreglo.length-1;
      this.actualPage = 1;
      this.totalPages = arreglo.length/10;
      if((this.totalPages - Math.trunc(this.totalPages))>0 ){
        this.totalPages -= (this.totalPages - Math.trunc(this.totalPages));
        this.totalPages += 1;
      }
      for(let i=0; i <= 9; i++ ){
          this.clientesMostrar.push(arreglo[i]);
          this.currentElement = i;
      }
    }
  }

  public siguiente(){
    this.actualPage += 1;
    if(this.actualPage  == this.totalPages){
      this.btnNext=false;
      this.btnPrev=true;
      this.clientesMostrar = [];
      for(let i = this.currentElement; i < this.lastElement; i++){
        this.clientesMostrar.push(this.clientes[i+1]);
      }
      this.currentElement = this.lastElement;
    }else{
      this.btnPrev=true;
      this.clientesMostrar = [];
      for(let i = 0; i <=  9; i++){
        this.clientesMostrar.push(this.clientes[this.currentElement + 1]);
        this.currentElement ++;
      }
    }
  }

  public previo(){
      this.actualPage -= 1;
      this.btnNext = true;
      if(this.actualPage == 1){
        this.clientesMostrar = [];
        this.btnPrev = false;
        for(let i = 0; i<=9; i++){
          this.clientesMostrar.push(this.clientes[i]);
          this.currentElement = i ;
        }
      }else{
        this.currentElement = this.currentElement - (this.clientesMostrar.length+10);
        this.clientesMostrar = [];
        for(let i = 0; i<=9; i++){
          this.clientesMostrar.push(this.clientes
            [this.currentElement+1]);
          this.currentElement ++;
        }
      }
  }

}
