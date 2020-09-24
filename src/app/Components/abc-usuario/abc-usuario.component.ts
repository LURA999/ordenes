import { Component } from '@angular/core';
import { UsuarioModel } from 'src/app/Models/usuario.model';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-abc-usuario',
  templateUrl: './abc-usuario.component.html',
  styleUrls: ['./abc-usuario.component.css']
})
export class AbcUsuarioComponent  {
  usuario: UsuarioModel;
  isUpdate: boolean = false;
  titulo: string = "Nuevo usuario";

  constructor(private userservice: UserService, private route: Router, private aroute: ActivatedRoute) { 
    this.usuario = new UsuarioModel();
    if(aroute.snapshot.paramMap.has('id')){
      this.isUpdate = true;
      console.log(this.isUpdate);
      this.titulo = "Editar usuario";
      userservice.get(aroute.snapshot.paramMap.get('id')).subscribe(resp=>{
        this.usuario.nombre = resp[0]["nombre"];
        this.usuario.email = resp[0]["email"];
        this.usuario.nivel = resp[0]["nivel"];
        this.usuario.password = "";
      });
    }else{
      this.isUpdate=false;
      console.log(this.isUpdate);
    }
  } 

  actualizar(forma: NgForm){
    if(forma.invalid){
      alert("Error en datos");
    }else{
      if(this.usuario.password != ''){
        this.userservice.update(this.aroute.snapshot.paramMap.get('id'),this.usuario.email ,this.usuario.password)
        .subscribe(resp =>{
          this.route.navigateByUrl('/listaUsuarios');
        });
      }else{
        console.log(this.usuario.email);
        this.userservice.update(this.aroute.snapshot.paramMap.get('id'),this.usuario.email)
        .subscribe(resp =>{
          this.route.navigateByUrl('/listaUsuarios');
        });
      }
    }

  }

  onSubmit(forma: NgForm){
    if(forma.invalid){
      alert("Datos incorrectos");
    }else{
      this.userservice.create(this.usuario).subscribe(resp=>{
        this.route.navigate(['/','listaUsuarios',], {skipLocationChange: false});
      }, error=>{
        alert(error);
      });
    }
  }

}
