import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ComentarioService {
  local=environment.api;

  constructor(private http : HttpClient) { }
  

  insertComment(cve:  String, clave_serv : String, comentario : String, nombre :String, correo :String, tipo : number
    ,clave_conv :String ,fecha : String , cantidad : String){
    return this.http.post(this.local+'API/Comments/normalComments.php',{cve:cve,correo:correo,clave_serv:clave_serv,comentario:comentario,nombre:nombre
    ,tipo:tipo,clave_conv:clave_conv,fecha:fecha,cantidad:cantidad},  {responseType: 'text'});
  }

  insertCommentPay(cve:  String, clave_serv : String, comentario : String, nombre :String, correo :String, tipo : number
    ,clave_conv :String ,fecha : String , cantidad : String){
    return this.http.post(this.local+'API/Comments/payComments.php',{cve:cve,clave_serv:clave_serv,comentario:comentario,nombre:nombre
      ,correo:correo,tipo:tipo,clave_conv:clave_conv,fecha:fecha,cantidad:cantidad},  {responseType: 'text'});
  }

  insertCommentAgreement(cve:  String, clave_serv : String, comentario : String, nombre :String, correo :String, tipo : number
    ,clave_conv :String ,fecha : String , cantidad : String){
    return this.http.post(this.local+'API/Comments/commentsAgreements.php',{cve:cve,correo:correo,clave_serv:clave_serv,comentario:comentario,nombre:nombre
    ,tipo:tipo,clave_conv:clave_conv,fecha:fecha,cantidad:cantidad},  {responseType: 'text'});
  }

  getAllServClient(cve:String, fecha:String){
    return this.http.get(this.local+'API/Comments/serviceComments.php?cve='+cve+'&fecha='+fecha);
  }

  getAllServClientAgreements(cve:String, fecha:String, opc:number){
    return this.http.get(this.local+'API/Comments/commentsAgreements.php?cve='+cve+'&fecha='+fecha+'&opc='+opc);
  }

  getAllServClientPayments(cve:String, fecha:String){
    return this.http.get(this.local+'API/Comments/payComments.php?cve='+cve+'&fecha='+fecha);
  }

  getAllServClientComments(cve:String, fecha:String){
    return this.http.get(this.local+'API/Comments/normalComments.php?cve='+cve+'&fecha='+fecha);
  }

  updateComentario(opc :number,comentario : String,idcomentario:String,clave_serv:String,fecha:String,fecha2:String, cantidad:String,idconvenio: String){
    return this.http.patch(this.local+'Comentarios.php?opc='+opc+'&comentario='+comentario+'&id='+idcomentario+'&clave_serv='+clave_serv+'&fecha='+fecha+'&fecha2='+fecha2+'&cantidad='+cantidad+"&idconvenio="+idconvenio,  {responseType: 'text'});
  }

  deleteComentario(opc :number,idcomentario:String,clave_serv:String,fecha:String){
    return this.http.delete(this.local+'Comentarios.php?opc='+opc+'&id='+idcomentario+'&clave_serv='+clave_serv+'&fecha='+fecha,  {responseType: 'text'});
  }
  buscarId(opc:number,cve:String, fecha:String, id:number){
    return this.http.get(this.local+'Comentarios.php?opc='+opc+'&cve='+cve+'&fecha='+fecha+"&id="+id+"&uno=true");
  }
}
