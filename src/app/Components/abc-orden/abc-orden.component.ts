import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { OrdenModel } from '../../models/orden.model';
import { OrdenService } from 'src/app/services/orden.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ordenInstaladores } from 'src/app/models/ordenInstaladores.model';

import { Router } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { EmailService } from 'src/app/services/email.service';
import { EmailModel } from 'src/app/models/email.model';


@Component({
  selector: 'app-abc-orden',
  templateUrl: './abc-orden.component.html',
  styleUrls: ['./abc-orden.component.css']
})
export class AbcOrdenComponent {
  isChecked:number []=[];
  ordenInsta : ordenInstaladores = new ordenInstaladores();
  private emailModal = new Array<EmailModel>();
  private emailModal2 = new Array<EmailModel>();

  titulo: string = "Nueva orden de servicio";
  esDetalle: boolean = false;
  cve_orden: number;
  orden: OrdenModel;
  clientes: any[];
  sucursales: any[];
  contactos: any[];
  instaladores: any[];
  servicios : any[]= [];
  ciudades: any[];
  cliente: string;
  numero: string;
  fecha: string;
  ultimo: number;
  clienteValido: boolean = false;
  sucursalValida: boolean = false;
  nivel : number = localStorage['level'];
  ultimaorden: any[]=[];
   instalacion: any[]=[];
   mantenimiento: any[]=[];
   emergencia: any[]=[];
   otro: any[]=[];
   ultimosdatos: any;

  nombreusuario: string;
  sucursal: any;
  contacto: any;
  coordenadas: any;
  servicio: any;
  ultimo1:number;
  datosultima: any[]=[];
  desc_problema: any;
  ciudad: any;
  fecha_programada: any;
  instalador:any;
  tipoinstalador:number;
  correoinstalador:any;

  constructor(private clientServ: ClientService, private ordenServ: OrdenService, private aroute: ActivatedRoute, 
    private route: Router, private sCatalogo:CatalogueService, private sEmail : EmailService,
    private sUser: UserService) {

    this.orden = new OrdenModel();
    if (aroute.snapshot.paramMap.has('id')) {
      this.cve_orden = parseInt(this.aroute.snapshot.paramMap.get('id'));
      this.titulo = "Orden de servicio No. " + this.cve_orden;
      this.esDetalle = true;
    } else {
      this.nuevaOrden();
    }
  }


  ngOnInit(): void {
    this.ordenServ.getServicios().subscribe((resp:any)=>{
      this.servicios = resp;
     
      this.instalacion = this.servicios.filter(servicio => servicio.categoria == "Instalacion" );
      this.mantenimiento = this.servicios.filter(servicio => servicio.categoria == "Mantenimiento" );
      this.emergencia = this.servicios.filter(servicio => servicio.categoria == "Emergencias" );
      this.otro = this.servicios.filter(servicio => servicio.categoria == "Otros" );
   
      this.getultimaorden();
      
    });
  }

  nuevaOrden() {
    this.clientServ.getAll().subscribe((resp: any) => {
      this.clientes = resp;
    });
    this.ordenServ.getInstallers().subscribe((resp: any) => {
      this.instaladores = resp;
    });
    this.getCiudades();
  }


  public cargarSucursal(e: any) {
    let name = e.target.value;
    if (name != '') {
      let id = this.clientes.filter(x => x.nombre === name)[0];
      if (id != undefined) {
        this.orden.idCliente = id.idprospecto;
        this.clientServ.getSucursales(id.idprospecto).subscribe((resp: any) => {
          this.sucursales = resp;
          if (this.sucursales.length > 0) {
            this.clienteValido = true;
            this.orden.idSucursal = null;
          } else {
            this.clienteValido = false;
          }
        });
      } else {
        alert("El cliente no esta registrado");
        this.cliente = "";
        this.orden.idSucursal = null;
        this.orden.idContacto = null;
        this.clienteValido = false;
      }
    } else {
      this.orden.idSucursal = null;
      this.orden.idContacto = null;
      this.clienteValido = false;
    }
  }

  public cargarContactos() {
    if (this.orden.idSucursal == null || this.orden.idSucursal == undefined) {
      this.orden.idSucursal = 0;
      this.sucursalValida = false;
      this.numero = "";
      this.orden.idSucursal = null;
    }

    this.clientServ.getContactos(this.orden.idSucursal.toString()).subscribe((resp: any) => {
      this.contactos = resp;
      if (this.contactos.length > 0) {
        this.sucursalValida = true;
      } else {
        this.sucursalValida = false;
      }

    });

  }

  public cargarTelefono() {
    let contacto = this.contactos.filter(x => x.idcontacto == this.orden.idContacto)[0];
    this.numero = contacto.Telefono;
  }

  onSubmit(forma: NgForm) {
    if (forma.invalid) {
      alert("Datos en rojo obligatorios");
    }if(forma.controls['sucursal'].value == undefined || forma.controls['contacto'].value == undefined){
      alert("Se requiere un contacto para poder dar la orden de alta");
    } else {
      if(this.orden.idInstalador == undefined){
        this.orden.idInstalador = 0;
      }

      if(this.orden.fechaProgramada == undefined){
        this.orden.fechaProgramada = null;
      }
      this.orden.idUsuario = parseInt(localStorage.getItem('id'));
      

      console.log("imprimiendo instaladores")
     

      this.ordenServ.createOrder(this.orden).subscribe((resp: any) => {
      this.getdatosultima();
    //  this.route.navigate(['/','ordenes',], {skipLocationChange: false});
      }
      , error => {
        console.log(error);
      });
      
      for(let y=0; y<this.isChecked.length; y++){
        this.ordenServ.insertInstaladoresDeOrden(this.isChecked[y]).subscribe(resp=>{ });
      }

    }
  }

  getCiudades(){
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.ciudades = resp;
    });
  }

  getultimaorden(){
    this.ordenServ.obtenerultimaorden().subscribe((resp:any)=>{
      this.ultimaorden = resp;
      this.ultimo1=parseInt(this.ultimaorden[0].cve_orden);
      this.ultimo= parseInt(this.ultimaorden[0].cve_orden)+1;
      
 
    });
  }

  async getdatosultima(){
     this.ultimosdatos = await this.ordenServ.getOrder(this.ultimo).toPromise();
     
    this.sucursal=await this.ultimosdatos[0].sucursal;
    this.ciudad=await this.ultimosdatos[0].ciudadNombre;
    this.contacto=await this.ultimosdatos[0].contacto;
    this.coordenadas=await this.ultimosdatos[0].coordenadas;
    this.servicio=await this.ultimosdatos[0].desc_servicio;
    this.numero=await this.ultimosdatos[0].telefono;
    this.desc_problema=await this.ultimosdatos[0].desc_problema;
    this.fecha_programada=await this.ultimosdatos[0].fecha_programada;
    this.instalador=await this.ultimosdatos[0].instalador;


//console.log(variableinstalador);
      if(this.isChecked.length == 0 || this.isChecked.length == null){
        this.tipoinstalador=0;
       await this.emailModal2.push( new EmailModel(this.cve_orden,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,"0",""));
        
      }else{
        this.tipoinstalador=1;
        for await (const iterator of this.isChecked) {
          console.log(iterator)
          this.ordenInsta.cve_instalador = iterator;
          this.ordenInsta.cve_orden= this.cve_orden;
           await this.ordenServ.insertMasInstaladoresDeOrden(this.ordenInsta).toPromise();
           const correo = await this.sUser.getEmail(iterator).toPromise();
           await this.emailModal2.push( new EmailModel(this.cve_orden,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,correo[0].email,""));
        }
      }
   
    if(this.tipoinstalador == 0){
      await  this.sEmail.notificarOrden(this.emailModal2, 1,1).toPromise();
    }else{
      await  this.sEmail.notificarOrden(this.emailModal2, 1,1).subscribe();
    }
  }
  seleccionandoInstalador(cve: number){
    var c =0;
    var num =0;
    this.isChecked.push(cve);
    for(let y =0; y<this.isChecked.length; y++){
      if(this.isChecked[y]==cve){
        c++;
        if(c==2){
        num = this.isChecked[this.isChecked.length-1];
        this.isChecked.pop(); 
        for(let y =0; y<this.isChecked.length; y++){
            if(num == this.isChecked[y])
            {
              this.isChecked.splice(y, 1);
            }
          }
        }
      }
    }
  }
 
  public asignarServicio(e: any) {
    let name = e.target.value;
      if (name != '') {
      let id = this.servicios.filter(x => x.descripcion === name)[0];
      if(id != undefined){
        this.orden.servicio = id.descripcion;
      }
    }
  }

}
