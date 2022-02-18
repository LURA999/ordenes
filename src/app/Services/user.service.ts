import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  local=environment.api;
  constructor( private http:HttpClient ) { 
    
  }

  public getEmail(id:number) {
    return this.http.get(this.local+'API/Users/user.php?uncorreo=true&cv='+id);
  }
  public get(id:string): any{
    return this.http.get(this.local+'API/Users/user.php?cve='+id);
 }

  public getAll(){
     return this.http.get(this.local+'API/Users/user.php?cve=-1');
  }

  public delete(id:number){
    return this.http.patch(this.local+'API/Users/user.php?cve='+id , {responseType : "text"});
  }

  public deleteUsuarioCiudades(cve:string){
    return this.http.delete(this.local+'API/Users/user.php?ciudades=true&cve='+cve);
  }

  public update(id:string, email: string, nivel: number, contrasena: string){
let response;
    if(email != undefined ){
      response = this.http.patch(this.local+'API/email.php',{id: id, email:email},{responseType: 'text'});
    }
    
    if(contrasena != undefined ){
      response = this.http.patch(this.local+'API/Users/userLogin.php',{id: id,contrasena: contrasena},{responseType: 'text'}
      );
    }
    
    if(nivel != undefined){
       response = this.http.patch(this.local+'API/Users/userLogin.php?',{id: id, nivel:nivel },{ responseType: 'text'}
      );
    }
 return response;
  }

  public create(user: UsuarioModel, ciudades : any[]){
    console.log(this.local+'API/Users/user.php')
    return this.http.post(this.local+'API/Users/user.php',{ nombre: user.nombre, email: user.email,
      password: user.password,nivel: user.nivel, ciudades: ciudades},{responseType: 'text'});
  }

  updateUltimaSesion(cve_usuario:number){
    this.http.patch(this.local+'Usuario.php', 
    {
      ultima_sesion:1,
      cve_usuario : cve_usuario
    },
    {responseType: 'text'});
  }
    
}