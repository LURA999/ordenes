import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClienteModel } from '../models/cliente.model';
import { SucursalModel} from '../models/sucursal.model';
import { ContactoModel } from '../models/contacto.model';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  local='http://localhost';
  //local='';
  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get(this.local+'/API3.1/Cliente/Cliente.php');
  }

  getSucursales(id_cliente:string){
    return this.http.get(this.local+'/API3.1/Cliente/Sucursal.php?cve_cliente='+id_cliente);
  }

  getContactos(id_sucursal:string){
    return this.http.get(this.local+'/API3.1/Cliente/Contacto.php?cve_sucursal='+id_sucursal);
  }
  getCoordenadas(id_sucursal:string){
    return this.http.get(this.local+'/API3.1/Cliente/Coordenadas.php?cve_sucursal='+id_sucursal);
  }

  crearCliente(cliente : ClienteModel){
    console.log(cliente);
    return this.http.post(this.local+'/API3.1/Cliente/Cliente.php',cliente, {responseType: 'text'});
  }

  buscarCliente(id_cliente : number){
    return this.http.get(this.local+'/API3.1/Cliente/Cliente.php?id_cliente='+id_cliente, {responseType : 'text'});
  }

  crearSucursal(  sucursal : SucursalModel){
    return this.http.post(this.local+'/API3.1/Cliente/Sucursal.php',sucursal, {responseType : 'text'});
  }

  agregarContacto( contacto : ContactoModel){
    return this.http.post(this.local+'/API3.1/Cliente/Contacto.php',contacto, {responseType : 'text'});
  }
}
