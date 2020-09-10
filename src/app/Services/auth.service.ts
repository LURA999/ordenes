import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../Models/usuario.model';
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
    return this.http.get('http://localhost/Login.php?user='+ usuario.email +'&contrasena=' + usuario.password
    ).pipe( map( resp =>{
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
}
