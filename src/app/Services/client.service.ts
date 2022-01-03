import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  local=environment.api;

  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get(this.local+'Cliente/Cliente.php?todo='+true);
  }

  getServicios(id_servicio:String){
    return this.http.get(this.local+'Cliente/Cliente.php?id_servicio='+id_servicio);
  }

  getTotalDeServiciosCliente(cve:String){
    return this.http.get(this.local+'Cliente/Cliente.php?contador=true&cve='+cve);
  }

  insertClientes(cve:String,nombre:String,colonia:String,calle:String,num:String,celular1:String,celular2:String,ciudad:String,estado:String){
    return this.http.post(this.local+'Cliente/Cliente.php?insertarExcel1=1'
    +"&cve="+cve+"&nombre="+nombre+"&colonia="+colonia+"&calle="+calle+"&num="+num+"&celular1="+celular1+"&celular2="+celular2+"&ciudad="+ciudad+"&estado="+estado
    , {responseType: 'text'});
  }
  
  insertClientesServ(cve,clave_serv,servicio,cantidad,interes){
    return this.http.post(this.local+'Cliente/Cliente.php?insertarExcel2=1'+"&cve="+cve+"&clave_serv="+clave_serv+"&servicio="+servicio+"&cantidad="+cantidad+"&interes="+interes
    , {responseType: 'text'});
  }

  getTotalDeServiciosClienteID(cveserv:String,cve:String){
    return this.http.get(this.local+'Cliente/Cliente.php?idcliente='+cve+'&idserv='+cveserv+'&buscarIDserv=true');
  }
  
  id(cve:String){
    return this.http.get(this.local+'Cliente/Cliente.php?id=true&cve='+cve);
  }
  
  actualizarEstatus(estatus: String, cve : String){
    return this.http.patch(this.local+'Cliente/Cliente.php?cve='+cve+'&estatus='+estatus,{responseType: 'text'});
  }
  clienteRepetido(cve : String){
    return this.http.get(this.local+'Cliente/Cliente.php?repetidosClientes=true&cve='+cve);
  }
}
