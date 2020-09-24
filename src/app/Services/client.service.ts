import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get('http://localhost/Cliente/Cliente.php');
  }

  getSucursales(id_cliente:string){
    return this.http.get('http://localhost/Cliente/Sucursal.php?cve_cliente='+id_cliente);
  }

  getContactos(id_sucursal:string){
    return this.http.get('http://localhost/Cliente/Contacto.php?cve_sucursal='+id_sucursal);
  }
}
