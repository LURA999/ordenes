import { Component, OnInit } from '@angular/core';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { VehiculoModel } from 'src/app/models/vehiculo.model'
import { PaginarService } from 'src/app/services/paginar.service'
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lista-vehiculos',
  templateUrl: './lista-vehiculos.component.html',
  styleUrls: ['./lista-vehiculos.component.css']
})
export class ListaVehiculosComponent implements OnInit {
  vehiculos : any[] = [] ;
  ciudades : any[] ;
  vehiculoNuevo: VehiculoModel;
  paginar : PaginarService;
  constructor(private sCatalogo: CatalogueService) {
    this.vehiculoNuevo = new VehiculoModel();
    this.obtenerVehiculos();
   }

  ngOnInit(): void {
    this.obtenerCiudades();
  }
  
  obtenerVehiculos(){
    this.sCatalogo.obtenerVehiculos().subscribe((resp:any)=>{
      this.paginar = new PaginarService(resp);
      this.vehiculos = this.paginar.paginar();
    });
  }

  obtenerCiudades(){
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.ciudades = resp;
    });
  }
  guardarVehiculo(vehiculo: NgForm){
    if(vehiculo.valid){
      this.sCatalogo.insertarVehiculo(vehiculo.controls['descripcion'].value,
      vehiculo.controls['placa'].value,
      parseInt(vehiculo.controls['ciudad'].value)).subscribe((resp:any)=>{
        location.reload();
      });
    }else{
      Swal.fire({
        icon: 'info',
        text: 'Todos los datos son obligatorios'
      })
    }
  }


  previo(){
    this.vehiculos = this.paginar.previo();
  }

  siguiente(){
    this.vehiculos = this.paginar.siguiente();
  }

  borrar(cve_vehiculo : number){
    Swal.fire({
      icon: 'question',
      title: '¿Desea eliminar este vehiculo?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this.sCatalogo.actualizarEstatusVehiculo(cve_vehiculo,0).subscribe((resp:any)=>{
          this.obtenerVehiculos();
        }) ; 
    }
    });
  }

  cambiarEstatus(estatus:number, cve_vehiculo:number){
    Swal.fire({
      icon: 'question',
      title: '¿Cambiar estatus del vehiculo?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this.sCatalogo.actualizarEstatusVehiculo(cve_vehiculo,estatus).subscribe((resp:any)=>{
          this.obtenerVehiculos();
        }) ;   
      }
    });
  }

}
