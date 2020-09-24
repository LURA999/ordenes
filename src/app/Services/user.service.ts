import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../Models/usuario.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor( private http:HttpClient ) { 
    
  }
  public get(id:string): any{
    return this.http.get('http://localhost/Usuario.php?cve='+id);
 }

  public getAll(){
     return this.http.get('http://localhost/Usuario.php?cve=0');
  }

  public delete(id:number){
    return this.http.delete('http://localhost/Usuario.php?cve='+id );
  }

  public update(id:string, email: string, contrasena?: string){
    if(contrasena != undefined ){
      console.log("Entro aqui");
      return this.http.patch('http://localhost/Usuario.php?',{
        cve_usuario: id,
        password: contrasena ,
        email:email
      },{
        responseType: 'text'
      }
      );
    }else{
      console.log("Entro entro aca");
      return this.http.patch('http://localhost/Usuario.php?',{
        cve_usuario: id,
        email:email
      },{
        responseType: 'text'
      }
      );
    }
  }

  public create(user: UsuarioModel){
    return this.http.post('http://localhost/Usuario.php',{
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      nivel: user.nivel
    },{
      responseType: 'text'
    });
  }
    
}