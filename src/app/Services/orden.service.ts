import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenModel } from '../Models/orden.model';
@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private http: HttpClient) { }

  getAllOrders(status:number = 0){
    return this.http.get('http://localhost/OrdenServicio.php?id='+localStorage.getItem('id')+'&nivel='+
    localStorage.getItem('level')+'&cve_orden=0&estatus='+status);
  }

  getOrdersFilter(fechaInicio:Date, fechaFin:Date,status : number = 0){
    return this.http.get('http://localhost/OrdenServicio.php?id='+localStorage.getItem('id')+'&nivel='+
    localStorage.getItem('level')+'&cve_orden=0&estatus='+status+'&fechaInicio='+fechaInicio+'&fechaFin='+fechaFin);
  }

  getOrder(cve_orden:number){
    return this.http.get('http://localhost/OrdenServicio.php?id_orden='+cve_orden);
  }

  getInstallers(){
    return this.http.get('http://localhost/Instalador.php');
  }

  createOrder(orden : OrdenModel){
    console.log(orden);
    return this.http.post('http://localhost/OrdenServicio.php', orden,{responseType: 'text'});
  }

  delete(cve_orden:string){
    return this.http.delete('http://localhost/OrdenServicio.php?cve_orden='+cve_orden);
  }
}
