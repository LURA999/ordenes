import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailModel } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  local = "http://localhost/API3.1/";

  constructor(private http : HttpClient) { }

  obtenerinformacioninstalador(cve_usuario:number){
 
    return this.http.get(this.local+"Instalador.php?cve_usuario="+cve_usuario);
  }


  notificarLevantamiento( Model :Array<EmailModel>, tipoinstalador : number , insertar : number){
   /* Model.forEach(element => {
      console.log(element);
    });*/
 //  return this.http.get("");
   return this.http.post(this.local+"Correos/correoAlta.php?tipo=1"+'&tipoinstalador='+tipoinstalador+'&insertar='+insertar, Model, {responseType: "text"});
  }
 
  notificarOrden(Model :Array<EmailModel>, tipoinstalador : number , insertar : number){
    Model.forEach(element => {
      console.log(element);
    });
    return this.http.post(this.local+"Correos/correoAlta.php?tipo=2"+'&tipoinstalador='+tipoinstalador+'&insertar='+insertar, Model, {responseType: "text"});
  } 
  
/*
  notificarOrdenYLev(cve_orden:number,nombrecliente:string,sucursal:string,ciudad:string,contacto:string,coordenadas:string,servicio:string,numero:string,desc_problema:string,fecha_programada,correoinstalador:string,tipoinstalador:number){
    return this.http.get(this.local+"Correos/correoAlta.php?tipo=3"+'&idorden='+cve_orden+'&nombrecliente='+nombrecliente+'&sucursal='+sucursal+
    '&ciudad='+ciudad+'&contacto='+contacto+'&coordenadas='+coordenadas+'&servicio='+servicio+'&numero='+numero+'&desc_problema='+desc_problema+
    '&fecha_programada='+fecha_programada+'&correoinstalador='+correoinstalador+'&correoinstalador2='+correoinstalador+'&tipoinstalador=2')
  }*/
}
