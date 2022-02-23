import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken:string;
  

  constructor( private http: HttpClient) { 
    this.readToken();
  }
  //Crear nuevo usuario
  

  //Loggear usuario
  login (usuario:UsuarioModel){
   //var local='';
   var   local=environment.api;
    return this.http.get(local+'API/Users/userLogin.php?user='+ usuario.email +'&contrasena=' + usuario.password
    ).pipe( map( (resp ) =>{
      if(resp["error"] == false){
        this.saveToken( resp['token']);
      }
    })
    );
  }

  //cerrar sesion
  logout(){

  }

  private saveToken(idToken:string)
  {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  public readToken()
  {
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  autenticado(): boolean
  {
      if(!localStorage['token']){ return false }else{return true} ;
  }

  revisarVigenciaToken(){
    
  }
}
