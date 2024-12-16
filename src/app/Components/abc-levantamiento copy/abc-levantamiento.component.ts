import { Component, OnInit } from '@angular/core';
import {LevantamientoModel} from '../../Models/levantamiento.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../Services/client.service';
import { LevantamientoService } from '../../Services/levantamiento.service';
import { stringify } from '@angular/compiler/src/util';
import { ActivatedRoute, Router} from '@angular/router';
import { timestamp } from 'rxjs/operators';
import { CatalogueService } from 'src/app/Services/catalogue.service';
@Component({
  selector: 'app-abc-levantamiento',
  templateUrl: './abc-levantamiento.component.html',
  styleUrls: ['./abc-levantamiento.component.css']
})
export class AbcLevantamientoComponent implements OnInit {
  public cve_levantamiento : string;
  public titulo : string;
  public formaLevantamiento: FormGroup;
  public levantamiento : LevantamientoModel = new LevantamientoModel();
  public clientes : any[]= [];
  public sucursales : any[]= [];
  public contactos : any[]= [];
  public megass : any[]= [];
  public repetidoras : any[]= [];
  public servicios : any[]= [];
  public ciudades : any[]= [];
  public telefono : string = "";
  public correo : string = "";
  public esDetalle:  boolean = false;
  constructor(private fb: FormBuilder, private sCliente: ClientService, 
    private sLevantamiento: LevantamientoService, private aroute: ActivatedRoute, private route : Router, private sCatalogo: CatalogueService) {
    if(aroute.snapshot.paramMap.has('id')){
      this.cve_levantamiento = this.aroute.snapshot.paramMap.get('id');
      this.titulo = 'Levantamiento no. '+this.cve_levantamiento;
      this.esDetalle = true;
    }else{
      this.titulo = 'Nuevo levantamiento';
    }
   }

  ngOnInit(): void {
    this.construirForma();

    this.sCliente.getAll().subscribe((resp:any)=>{
      this.clientes = resp;
    });

    
    this.sLevantamiento.getRepetidoras().subscribe((resp:any)=>{
      this.repetidoras = resp;
    });

    this.sLevantamiento.getMegas().subscribe((resp:any)=>{
      this.megass = resp;
      
    });

    this.sLevantamiento.getServicios().subscribe((resp:any)=>{
      this.servicios = resp;
      
    });

    this.obtenerCiudades();
  
  }

  construirForma(){
    this.formaLevantamiento = this.fb.group({
      cve_cliente: new FormControl('', [Validators.required]),
      cve_sucursal: new FormControl('', [Validators.required]),
      cve_contacto: new FormControl('', [Validators.required]),
      coordenadas: new FormControl('',[Validators.required]),
      servicio: new FormControl(''),
      megas: new FormControl(''),
      ciudad: new FormControl('', [Validators.required]),
      repetidora : new FormControl('')
    
    });
  }

  public cargarSucursal(e: any) {
    this.sucursales = [];
    this.contactos = [];
    let name = e.target.value;
      if (name != '') {
      let id = this.clientes.filter(x => x.nombre === name)[0];

      if(id != undefined){
        console.log(id.idprospecto);
        this.levantamiento.cve_cliente = id.idprospecto;
        this.sCliente.getSucursales(id.idprospecto).subscribe((resp: any) => {
          this.sucursales = resp;
        })
        
      
        ;
      }
    }
  }

  public obtenerCiudades(){
    this.ciudades = [];
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.ciudades = resp;
    });
  }


 

  public cargarContactos(e: any) {
    this.contactos = [];
    let name = e.target.value;
      if (name != '') {
      let id = this.sucursales.filter(x => x.nombre === name)[0];
      if(id != undefined){
        console.log(id.idsucursal);
        this.levantamiento.cve_sucursal = id.idsucursal;
        this.sCliente.getContactos(id.idsucursal).subscribe((resp: any) => {
          this.contactos = resp;
        });
       
      }
    }
  }

  public asignarServicio(e: any) {
    let name = e.target.value;
      if (name != '') {
      let id = this.servicios.filter(x => x.descripcion === name)[0];
      console.log("sdsdsds");
      console.log(id);
      if(id != undefined){
        this.levantamiento.servicio = id.descripcion;
      }
    }
  }

  public asignarRepetidora(e: any) {
    let name = e.target.value;
      if (name != '') {
      let id = this.repetidoras.filter(x => x.nombre === name)[0];
      if(id != undefined){
        this.levantamiento.repetidora = id.idrepetidora;
      }
    }
  }

  public asignarMegas(e: any) {
    let name = e.target.value;
      if (name != '') {
      let id = this.megass.filter(x => x.descripcion === name)[0];
     
      if(id != undefined){
        this.levantamiento.megas = id.descripcion;
      }
    }
  }



  public datosContacto(e: any) {
    let name = e.target.value;
      if (name != '') {
      let id = this.contactos.filter(x => x.Nombre === name)[0];
      if(id != undefined){
        console.log(id.idcontacto);
        this.levantamiento.cve_contacto = id.idcontacto;
        this.telefono = id.Telefono;
        this.correo = id.correo;
      }
    }
  }

  onSubmit(){
    if(this.formaLevantamiento.valid){
    //  this.levantamiento.servicio = this.formaLevantamiento.controls['servicio'].value;
      this.levantamiento.coordenadas = this.formaLevantamiento.controls['coordenadas'].value;
//      this.levantamiento.megass = this.formaLevantamiento.controls['megass'].value == undefined ||  this.formaLevantamiento.controls['megass'].value == ""? 0 : this.formaLevantamiento.controls['megass'].value;
      this.levantamiento.ciudad = this.formaLevantamiento.controls['ciudad'].value == undefined ? 0 : this.formaLevantamiento.controls['ciudad'].value;
      this.levantamiento.cve_creador = localStorage['id'];
      this.levantamiento.repetidora = this.levantamiento.repetidora == undefined ? 0 : this.levantamiento.repetidora;
      this.levantamiento.megas = this.levantamiento.megas == undefined ? 0 : this.levantamiento.megas;
      this.levantamiento.servicio = this.levantamiento.servicio == undefined ? "0" : this.levantamiento.servicio;
      console.log(this.levantamiento.megas+"ssss");
      this.sLevantamiento.insertLevantamiento(this.levantamiento).subscribe((resp:any)=>{
        this.route.navigate(['/','levantamientos',], {skipLocationChange: false});
      });
    }
  }

}
