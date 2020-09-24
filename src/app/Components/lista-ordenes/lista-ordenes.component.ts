import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../Services/orden.service'
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-lista-ordenes',
  templateUrl: './lista-ordenes.component.html',
  styleUrls: ['./lista-ordenes.component.css']
})
export class ListaOrdenesComponent {

  ordenes: any[] = [];
  ordenesMostrar: any[] = [];
  estatus: number;
  fechaInicio: Date;
  fechaFin: Date;
  btnNext: boolean;
  btnPrev: boolean;
  totalPages: number;
  showPages: number;
  actualPage: number;
  lastElement: number;
  currentElement: number;

  constructor(private http: HttpClient, private ordenServ: OrdenService) {
    this.estatus = 0;
    this.populate();
  }

  populate() {
    this.ordenServ.getAllOrders(this.estatus).subscribe((response: any) => {
      this.ordenes = response;
      this.paginar(this.ordenes);
    });
  }

  filtrar() {
    if (this.estatus != undefined && this.fechaInicio != undefined && this.fechaFin != undefined) {

      if (this.fechaInicio > this.fechaFin) {
        alert("La fecha de inicio no puede ser mayor a la fecha final.");
      } else {
        this.ordenServ.getOrdersFilter(this.fechaInicio, this.fechaFin, this.estatus).subscribe((response: any) => {
          this.ordenes = response;
          this.paginar(this.ordenes);
        });
      }
    }else{
      if (this.estatus != undefined) {
        this.ordenServ.getAllOrders(this.estatus).subscribe((response: any) => {
          this.ordenes = response;
          this.paginar(this.ordenes);
        });
      }
    }

  }

  borrar(cve_orden: string) {
    var confirmacion = confirm("¿Desea eliminar la orden?",);
    if (confirmacion) {
      this.ordenServ.delete(cve_orden).subscribe((response: any) => {
        window.location.reload();
      });
    }

  }

  paginar(arreglo:any[]){
    if(arreglo.length <= 10){
      this.ordenesMostrar = arreglo;
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
          this.ordenesMostrar.push(arreglo[i]);
          this.currentElement = i;
      }
    }
  }

  public siguiente(){
    this.actualPage += 1;
    if(this.actualPage  == this.totalPages){
      this.btnNext=false;
      this.btnPrev=true;
      this.ordenesMostrar = [];
      for(let i = this.currentElement; i < this.lastElement; i++){
        this.ordenesMostrar.push(this.ordenes[i+1]);
      }
      this.currentElement = this.lastElement;
    }else{
      this.btnPrev=true;
      this.ordenesMostrar = [];
      for(let i = 0; i <=  9; i++){
        this.ordenesMostrar.push(this.ordenes[this.currentElement + 1]);
        this.currentElement ++;
      }

    }
  }


}

