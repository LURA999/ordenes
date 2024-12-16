import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
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
    var   local='http://localhost';

  
 //   return this.http.get('http://localhost/xampp/API3.1/Login.php?user=brandon@red-7.net&contrasena=123456'
    return this.http.get(local+'/API3.1/Login.php?user='+ usuario.email +'&contrasena=' + usuario.password
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

  revisarVigenciaToken(){
    
  }
}
