import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model'
import { ErrorModel } from '../../models/error.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    if(localStorage['token'] != undefined){
      route.navigate(['/home',{skipLocationChange:false}]);
      
    }
  }

  ngOnInit(){
    this.usuario = new UsuarioModel();
    this.error = new ErrorModel();
    this.sesion = new ErrorModel();
  }

  public onSubmit( form:NgForm ){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Cargando'
    });
    Swal.showLoading();
    if( form.invalid){
      Swal.close();
      Swal.fire({
        icon: 'warning',
        text: 'Favor de proporcionar toda la informacion'
      });
      return;
    }
    this.auth.login( this.usuario ).subscribe((resp:any)=>{
      if(this.auth.autenticado()){
        Swal.close();
        let obj = JSON.parse(atob(localStorage['token'].split('.')[1]));
       localStorage.setItem('name',obj.name);
       localStorage.setItem('id', obj.sub);
       localStorage.setItem('level',obj.level);
       localStorage.setItem('email',obj.email);
       let fechaVencimiento = new Date().getTime();
       fechaVencimiento = fechaVencimiento + 2400000;
       localStorage.setItem('endSeason',fechaVencimiento.toString());
       
        this.route.navigateByUrl('/home');
       
      }else{
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: 'Credenciales invalidas'
        });
      }
    }, (err)=>{
      Swal.close();
      Swal.fire({
        icon: 'error',
        text: 'ERR_CONNECTION_REFUSED'
      });
    });
 
  }

  cleanError(){
      this.sesion.descripcion= "";
      this.error.descripcion = "";
  }


}