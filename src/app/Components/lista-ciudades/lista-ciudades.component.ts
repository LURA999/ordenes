import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogueService } from 'src/app/services/catalogue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-ciudades',
  templateUrl: './lista-ciudades.component.html',
  styleUrls: ['./lista-ciudades.component.css']
})
export class ListaCiudadesComponent implements OnInit {
  ciudades: any[];
  nuevaCiudad : string;
  constructor(private sCatalogo: CatalogueService) { 
    this.obtenerCiudades();
  }

  ngOnInit(): void {
    
  }

  obtenerCiudades(){
    this.ciudades = [];
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.ciudades = resp;
    });
  }

  guardarCiudad(){
    if(this.nuevaCiudad == undefined || this.nuevaCiudad == ""){
      Swal.fire({
        icon: 'warning',
        text: 'Ingresar un nombre'
      });
    }else{
      this.sCatalogo.insertarCiudad(this.nuevaCiudad).subscribe((resp:any)=>{
        this.obtenerCiudades();
      });
    }
  }

}
