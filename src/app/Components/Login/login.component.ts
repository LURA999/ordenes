import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioModel } from '../../Models/usuario.model'
import { ErrorModel } from '../../Models/error.model'
import { AuthService } from '../../Services/auth.service'
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

export class LoginComponent implements OnInit{
  usuario: UsuarioModel;
  error:ErrorModel;
  sesion:ErrorModel;
  process: boolean = false;

  constructor( private auth: AuthService, private route: Router){
  
  }

  ngOnInit(){
    this.usuario = new UsuarioModel();
    this.error = new ErrorModel();
    this.sesion = new ErrorModel();
  }

  public onSubmit( form:NgForm ){
    this.cleanError();
    this.process = true;
    if( form.invalid){
      this.cleanError();
      this.error.error=true;
      this.process = false;
      this.error.descripcion="Favor de llenar correctamente los campos \n";
      return ;
    }
    this.auth.login( this.usuario ).subscribe( resp=>{
      if(this.auth.autenticado()){
        let obj = JSON.parse(atob(localStorage['token'].split('.')[1]));
       localStorage.setItem('name',obj.name);
       localStorage.setItem('id', obj.sub);
       localStorage.setItem('level',obj.level);
       localStorage.setItem('email',obj.email);
       this.process = false;
        this.route.navigateByUrl('/home');
      }else{
        this.process = false;
        this.sesion.error=true;
        this.sesion.descripcion="Credenciales invalidas";
      }
    }, (err)=>{
      this.process = false;
      this.sesion.error=true;
      this.sesion.descripcion="ERR_CONNECTION_REFUSED";
    });
 
  }

  cleanError(){
      this.sesion.descripcion= "";
      this.error.descripcion = "";
  }


}