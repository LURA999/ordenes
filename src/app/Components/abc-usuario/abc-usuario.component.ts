import { Component } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CatalogueService } from 'src/app/services/catalogue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abc-usuario',
  templateUrl: './abc-usuario.component.html',
  styleUrls: ['./abc-usuario.component.css']
})
export class AbcUsuarioComponent  {
  usuario: UsuarioModel;
  cve_usuario:number;
  isUpdate: boolean = false;
  variable : any;
  ciudadCursor: number;
  titulo: string = "Nuevo usuario";
  ciudades : any [];
  ciudadesSelecionadas : any[] = [];
  constructor(private userservice: UserService, private route: Router, private aroute: ActivatedRoute, private sCatalogo: CatalogueService) { 
    this.usuario = new UsuarioModel();
    if(aroute.snapshot.paramMap.has('id')){
      this.isUpdate = true;
      this.titulo = "Editar usuario";
      userservice.get(aroute.snapshot.paramMap.get('id')).subscribe(resp=>{
        this.cve_usuario = parseInt(aroute.snapshot.paramMap.get('id'));
        this.obtenerCiudadesCatalogo();
        this.obtenerCiudadesUsuario();
        this.usuario.nombre = resp[0]["nombre"];
        this.usuario.email = resp[0]["email"];
        this.usuario.nivel = resp[0]["nivel"];
        this.usuario.password = "";
      });
      
      

    }else{
      this.isUpdate=false;
      this.usuario.ciudad = 0;
      this.obtenerCiudadesCatalogo();
    }
  } 

  actualizar(forma: NgForm){
    if(forma.invalid){
      alert("Error en datos");
    }else{
      if(this.usuario.password != ''){
        this.userservice.update(this.aroute.snapshot.paramMap.get('id'),this.usuario.email,this.usuario.nivel ,this.usuario.password)
        .subscribe(resp =>{
          this.route.navigateByUrl('/usuarios');
        });
      }else{
        this.userservice.update(this.aroute.snapshot.paramMap.get('id'),this.usuario.email,this.usuario.nivel)
        .subscribe(resp =>{
          this.route.navigateByUrl('/usuarios');
        });
      }
    }
  }

  obtenerCiudadesCatalogo(){
    this.ciudades=[];
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.ciudades = resp;
    });
  } 
   obtenerCiudadesUsuario(){
    this.ciudadesSelecionadas=[];
    this.sCatalogo.obtenerUsuarioCiudades(this.cve_usuario).subscribe((resp:any)=>{
      this.ciudadesSelecionadas = resp;
    });
  }


  agregarCiudad(){
    if(this.usuario.ciudad != undefined && this.usuario.ciudad != 0){
      if(!this.ciudadesSelecionadas.find(x => x.idciudad == this.usuario.ciudad)){
        this.ciudadesSelecionadas.push(this.ciudades.find(x => x.idciudad == this.usuario.ciudad));
        this.ciudades = this.ciudades.filter(x=> x.idciudad != this.usuario.ciudad);
      }else{
        Swal.fire({
          title: 'Ciudad ya agregada',
          icon: 'info'
        });
      }
    }
  }

  quitarCiudad(){
    if(this.ciudadCursor != undefined && this.ciudadCursor != 0){
      this.ciudades.push(this.ciudadesSelecionadas.find(x => x.idciudad == this.ciudadCursor));
      this.ciudadesSelecionadas = this.ciudadesSelecionadas.filter(x=>x.idciudad != this.ciudadCursor);
    }
  }


  

  onSubmit(forma: NgForm){
    if(forma.invalid && this.ciudadesSelecionadas.length < 0){
      Swal.fire({
        title: 'Favor de completar el formulario',
        icon: 'info'
      });
    }else{
      this.userservice.create(this.usuario, this.ciudadesSelecionadas).subscribe(resp=>{
        this.route.navigate(['/','usuarios',], {skipLocationChange: false});
      }, error=>{
        alert(error);
      });
    }
  }

}
