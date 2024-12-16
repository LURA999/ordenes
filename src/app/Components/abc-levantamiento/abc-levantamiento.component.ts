import { Component, OnInit } from '@angular/core';
import {LevantamientoModel} from '../../models/levantamiento.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { LevantamientoService } from '../../services/levantamiento.service';
import { ActivatedRoute, Router} from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { EmailService } from 'src/app/services/email.service';
import { EmailModel } from 'src/app/models/email.model';




@Component({
  selector: 'app-abc-levantamiento',
  templateUrl: './abc-levantamiento.component.html',
  styleUrls: ['./abc-levantamiento.component.css']
})




export class AbcLevantamientoComponent implements OnInit {
  public cve_levantamiento : string;
  public titulo : string;
  public formaLevantamiento: FormGroup;
  private emailModal = new Array<EmailModel>();

  public levantamiento : LevantamientoModel = new LevantamientoModel();
  public clientes : any[]= [];
  cliente: string;
  public sucursales : any[]= [];
  public contactos : any[]= [];
  public megass : any[]= [];
  public repetidoras : any[]= [];
  public servicios : any[]= [];
  public ciudades : any[]= [];
  public telefono : string = "";
  public correo : string = "";
  public esDetalle:  boolean = false;
  public instalacion: any[]=[];
  public mantenimiento: any[]=[];
  public emergencia: any[]=[];
  public otro: any[]=[];
  ultimolevantamiento: any[]=[];
  ultimo:number;
  ultimosdatos:any;
  sucursal: any;
  contacto: any;
  coordenadas: any;
  servicio: any;
  ultimo1:number;
  datosultima: any[]=[];
  desc_problema: any;
  ciudad: any;
  numero: any;
  fecha_programada: any;
  correoo:any;
  mb:any;
  kj: any;
  constructor(private fb: FormBuilder, private sCliente: ClientService,  private sEmail: EmailService,
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
      this.instalacion = this.servicios.filter(servicio => servicio.categoria == "Instalacion" );
      this.mantenimiento = this.servicios.filter(servicio => servicio.categoria == "Mantenimiento" );
      this.emergencia = this.servicios.filter(servicio => servicio.categoria == "Emergencias" );
      this.otro = this.servicios.filter(servicio => servicio.categoria == "Otros" );
    });

    this.obtenerCiudades();
    this.getultimolevanamiento();
  

    
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
      this.kj=this.levantamiento.ciudad = this.formaLevantamiento.controls['ciudad'].value == undefined ? 0 : this.formaLevantamiento.controls['ciudad'].value;
      this.levantamiento.cve_creador = localStorage['id'];
      this.levantamiento.repetidora = this.levantamiento.repetidora == undefined ? 0 : this.levantamiento.repetidora;
      this.levantamiento.megas = this.levantamiento.megas == undefined ? 0 : this.levantamiento.megas;
      this.levantamiento.servicio = this.formaLevantamiento.controls['servicio'].value == undefined ? 0 : this.formaLevantamiento.controls['servicio'].value;
      // this.levantamiento.servicio = this.levantamiento.servicio == undefined ? "0" : this.levantamiento.servicio;

      
     

      this.sLevantamiento.insertLevantamiento(this.levantamiento).subscribe((resp:any)=>{
        this.getdatosultima();
        this.route.navigate(['/','levantamientos',], {skipLocationChange: false});
      });
    }
  }


  getultimolevanamiento(){
    this.sLevantamiento.obtenerultimolevantamiento().subscribe((resp:any)=>{
      this.ultimolevantamiento = resp;
      this.ultimo= parseInt(this.ultimolevantamiento[0].cve_levantamiento)+1;
      
    });
  }

 async getdatosultima(){
  this.ultimosdatos =await this.sLevantamiento.getLevantamientosId(this.ultimo).toPromise();

    this.cliente=this.ultimosdatos[0].cliente;
    this.sucursal=this.ultimosdatos[0].sucursal;
    this.ciudad=this.ultimosdatos[0].ciudadNombre;
    this.contacto=this.ultimosdatos[0].contacto;
    this.coordenadas=this.ultimosdatos[0].coordenadas;
    this.servicio=this.ultimosdatos[0].servicio;
    this.numero=this.ultimosdatos[0].telefono;
    this.desc_problema=this.ultimosdatos[0].desc_problema;
    this.fecha_programada=this.ultimosdatos[0].fecha_programada;
    this.correoo=this.ultimosdatos[0].correo;
    this.mb=this.ultimosdatos[0].megas;

    let cve : number = +this.cve_levantamiento;
    
     await this.emailModal.push(new EmailModel(cve,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,"0",this.mb)); 

       await this.sEmail.notificarLevantamiento(this.emailModal, 1,2).subscribe((response:any)=>{
        this.sEmail = response;
      });
  
  
    
  }


 

}


