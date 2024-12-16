import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  local='http://localhost';
  //local='';

  constructor( private http:HttpClient ) { 
    
  }

  public getEmail(id:number) {
    return this.http.get(this.local+'/API3.1/Usuario.php?uncorreo=true&cv='+id);
  }
  public get(id:string): any{
    return this.http.get(this.local+'/API3.1/Usuario.php?cve='+id);
 }

  public getAll(){
     return this.http.get(this.local+'/API3.1/Usuario.php?cve=0');
  }

  public delete(id:number){
    return this.http.delete(this.local+'/API3.1/Usuario.php?cve='+id );
  }

  public update(id:string, email: string, nivel: number, contrasena?: string){
    if(contrasena != undefined ){
      return this.http.patch(this.local+'/API3.1/Usuario.php?',{
        cve_usuario: id,
        password: contrasena ,
        email:email
      },{
        responseType: 'text'
      }
      );
    }if(nivel != undefined){
      return this.http.patch(this.local+'/API3.1/Usuario.php?',{
        cve_usuario: id,
        nivel:nivel
      },{
        responseType: 'text'
      }
      );
    }
    
    else{
      return this.http.patch(this.local+'/API3.1/Usuario.php?',{
        cve_usuario: id,
        email:email
      },{
        responseType: 'text'
      }
      );
    }

    
  }

  public create(user: UsuarioModel, ciudades : any[]){
    return this.http.post(this.local+'/API3.1/Usuario.php',{
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      nivel: user.nivel,
      ciudades: ciudades
    },{
      responseType: 'text'
    });
  }

  updateUltimaSesion(cve_usuario:number){
    this.http.patch(this.local+'/API3.1/Usuario.php', 
    {
      ultima_sesion:1,
      cve_usuario : cve_usuario
    },
    {responseType: 'text'});
  }
    
}