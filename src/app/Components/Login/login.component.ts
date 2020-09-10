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
  constructor( private auth: AuthService, private route: Router){
  
  }

  ngOnInit(){
    this.usuario = new UsuarioModel();
    this.error = new ErrorModel();
    this.sesion = new ErrorModel();
  }

  public onSubmit( form:NgForm ){
    if( form.invalid){
      this.error.error=true;
      this.error.descripcion="Favor de llenar correctamente los campos \n";
      return ;}

    this.auth.login( this.usuario ).subscribe( resp=>{
      if(this.auth.autenticado()){

        let obj = JSON.parse(atob(localStorage['token'].split('.')[1]));
       // console.log(obj);
       localStorage.setItem('name',obj.name);
       localStorage.setItem('level',obj.level);
       localStorage.setItem('email',obj.email);
        this.route.navigateByUrl('/home');
      }else{
        this.sesion.error=true;
        this.sesion.descripcion="Error en credenciales";
      }
    }, (err)=>{
      this.error.descripcion="Error";
    });
 
  }


}