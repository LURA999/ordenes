import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { levantamientoMostrarModel } from 'src/app/models/levantamientoMostrar.model';
import { levantamientoInstaladores } from 'src/app/models/levantamientoInstaladores.model';
import { ArchivosService } from 'src/app/services/archivos.service';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { LevantamientoService } from 'src/app/services/levantamiento.service';
import { OrdenService } from 'src/app/services/orden.service';
import Swal from 'sweetalert2';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { EmailModel } from 'src/app/models/email.model';


@Component({
  selector: 'app-detalle-levantamiento',
  templateUrl: './detalle-levantamiento.component.html',
  styleUrls: ['./detalle-levantamiento.component.css']
})
export class DetalleLevantamientoComponent implements OnInit {
  @Input() cve_levantamiento: number;
  instaladoresmas : any[] =[];

  private sub$ =new Subscription();

  private emailModal = new Array<EmailModel>();
  private emailModal2 = new Array<EmailModel>();

  levantamientoMostrar : levantamientoMostrarModel = new levantamientoMostrarModel();
  levantaInsta : levantamientoInstaladores = new levantamientoInstaladores();

  nivel : number;
  instaladores: any[] = [];
  instaLeva: any[] = [];
  modInstalador: boolean;
  modFecha : boolean;
  modVehiculo : boolean;
  repetidoras : any[] = [];
  formaCierre : FormGroup;
  ordenCompleta : boolean = false;
  horas : number[];
  vehiculos : any[];
  hh: string = "12";
  mm: string = "0";
  vehiculo :number =0;
  formData = new FormData(); 
  archivos : FormData[] = []; 
  documentos : any [];
  isChecked:any []=[];
  isChecked2:any []=[];
  imagen = "/API3.1.2/fotos/";
  nombres : string []=[];
  c : number=0;

  fecha: any;
  estatus: number;
  fechaFull : string;
  contacto: string;
  numero: string;
  coordenadas: string;
  servicio : string;
  ciudad : string;
  instalador : number;
  nombreusuario: string = "0";
  cve_vehiculo:number = 0;
  desc_problema: any ;
  fecha_programada : any;
  cliente: string;
  email: any;
  descripcion : any;
  sucursal : string;
  mb:any;

  constructor(private slevantamiento : LevantamientoService, private sOrden: OrdenService, private route : Router, 
    private fb: FormBuilder, private sCatalogo: CatalogueService, private arch: ArchivosService,
   private sEmail: EmailService, private sUser:UserService) { 

    this.nivel = parseInt(localStorage['level']);
  }

  ngOnInit(): void {
    
    this.getLevantamiento();
    this.getInstaladores();
    this.getRepetidoras();
    this.getInstaladorLevantamiento();
    this.buildForm();

  }

  getLevantamiento(){
    this.sub$.add(this.slevantamiento.mostrarInstaladoresDeLevantamiento(this.cve_levantamiento).subscribe((resp: any) => {
      this.instaladores = resp;
    }));
    this.obtenerVehiculos();
    this.sub$.add(this.slevantamiento.getLevantamientosId(this.cve_levantamiento).subscribe((resp:any)=>{
      this.iniciarHoras();

      if(parseInt(resp[0]['estatus']) == 3){
        this.ordenCompleta = true;
        this.estatus = parseInt(resp[0]['estatus']);
        this.levantamientoMostrar.nombreCliente = resp[0]['cliente'];
        this.levantamientoMostrar.sucursal = resp[0]['sucursal'];
        this.levantamientoMostrar.correo = resp[0]['correo'];
        this.levantamientoMostrar.telefono = resp[0]['telefono'];
        this.levantamientoMostrar.instalador = resp[0]['cve_instalador'];
        this.levantamientoMostrar.nombreInstalador = resp[0]['nombreInstalador'];
        this.levantamientoMostrar.fecha = this.formatoYMD(resp[0]['fecha_programada']);
        this.levantamientoMostrar.coordenadas = resp[0]['coordenadas'];
        this.levantamientoMostrar.descripcion = resp[0]['descripcion'];
        this.levantamientoMostrar.servicio = resp[0]['servicio'];
        this.levantamientoMostrar.fechaCierre = this.formatoYMD(resp[0]['fecha_terminada']);
        this.levantamientoMostrar.altura = resp[0]['altura'];
        this.levantamientoMostrar.tipo = resp[0]['tipo'];
        this.levantamientoMostrar.tipoTecho = resp[0]['tipo_techo'];
        this.levantamientoMostrar.energia = resp[0]['energia_electrica'];
        this.levantamientoMostrar.megas = resp[0]['megas'];
        this.levantamientoMostrar.rack = resp[0]['rack'];
        this.levantamientoMostrar.torre_mastil = resp[0]['torre_mastil'];
        this.vehiculo = resp[0]['cve_vehiculo'];

      }else{
        /* para mostrar en la pagina */
        this.levantamientoMostrar.correo = resp[0]['correo'];
        this.levantamientoMostrar.nombreCliente = resp[0]['cliente'];
        this.levantamientoMostrar.sucursal = resp[0]['sucursal'];
        this.levantamientoMostrar.telefono = resp[0]['telefono'];
        this.levantamientoMostrar.contacto = resp[0]['contacto'];
        this.levantamientoMostrar.megas = resp[0]['megas'];
        this.levantamientoMostrar.servicio = resp[0]['servicio'];
        this.levantamientoMostrar.descripcion = resp[0]['desc_servicio'];
        this.levantamientoMostrar.coordenadas = resp[0]['coordenadas'];
        this.levantamientoMostrar.fecha = resp[0]['fecha_cierre'];

        /**Para peticiones al php */
        this.mb = resp[0]["megas"];
        this.nombreusuario = localStorage.getItem('name');
        this.cliente = resp[0]['cliente'];
        this.sucursal = resp[0]['sucursal'];
        this.contacto = resp[0]['contacto'];
        this.coordenadas = resp[0]['coordenadas'];
        this.numero = resp[0]['telefono'];
        this.servicio = resp[0]['desc_servicio'];
        this.instalador = resp[0]['instalador'];
        this.fecha = resp[0]['fecha_programada'];
        this.descripcion = resp[0]['desc_problema'];
        this.estatus = resp[0]['estatus'];
        this.ciudad = resp[0]['ciudadNombre'];
        this.cve_vehiculo = resp[0]['cve_vehiculo'];
        this.desc_problema = resp[0]['desc_problema'];
        this.fecha_programada = resp[0]['fecha_programada'];
        this.levantamientoMostrar.megas = resp[0]['megas'];


      }
    }));
  }

  getRepetidoras(){
    this.sub$.add(this.slevantamiento.getRepetidoras().subscribe((resp:any)=>{
      this.repetidoras = resp;
    }));
  }

 

  buildForm(){
    this.formaCierre = this.fb.group({
      altura: ['',Validators.required],
      tipo: ['',Validators.required],
      tipoTecho: ['',Validators.required],
      torre: ['', Validators.required],
      repetidora: ['', Validators.required],
      energia: ['', Validators.required],
      rack: ['', Validators.required],
      linea: ['', Validators.required],
      observaciones: ['', Validators.required],
      cve_levantamiento: [this.cve_levantamiento]
    }); 
  }

  cambioInstalador(){
    if(this.isChecked2.length > 0 || this.isChecked.length > 0){
    this.modInstalador = true;
    }else{
      this.modInstalador = false;

    }
  }

  cambioFecha(e){
    this.modFecha = true;
  }

  cambioVehiculo(e){
    this.modVehiculo = true;
  }

  formatoYMD(datetime:string):Date{
    if(datetime == null){
      return null;
    }
    let auxiliar;
    auxiliar = datetime.toString().split(' ');
    return auxiliar[0];
  }

  actualizarOrden(){
    if(this.modFecha == true){
      this.sub$.add( this.slevantamiento.cambiarFecha(this.cve_levantamiento, this.levantamientoMostrar.fecha, this.hh+":"+this.mm).subscribe((resp:any) =>{
      this.modFecha= false;
       
     }));
    }
     if(this.modFecha ==true){
      this.sub$.add(this.slevantamiento.cambiarVehiculo(this.cve_levantamiento,this.vehiculo).subscribe((resp:any)=>{
      this.modVehiculo= false;
    }));
  }
    


       if(this.modInstalador == true){

      if(this.isChecked2.length > 0 && this.isChecked.length > 0){
       this.insertarInstaLevantamiento(1);
      }else if (this.isChecked2.length > 0){
        this.insertarInstaLevantamiento(0);
      }else if(this.isChecked.length > 0){
        this.eliminarInstaLevantamiento();
      }
    }

    
  }

  
  getInstaladorLevantamiento(){
    this.sub$.add(this.slevantamiento.selectListaInstaldoresLevantamiento(this.cve_levantamiento).subscribe((resp:any) => {
      this.instaLeva = resp;
      for(let y=0; y<this.instaLeva.length; y++){
        this.nombres [y]= this.instaLeva[y].nombre;
      }
      if(this.nombres[0] == undefined){
        this.nombres[0] = " ";
      }
    }));
  }
  
  getInstaladores(){
    this.sub$.add(this.sOrden.getInstallers().subscribe((resp: any) => {
    if(this.instaladores.length == 0){
      for( let i=0; i<resp.length; i++){
        this.instaladoresmas.push(resp[i]);
      }
    }else{
      for(let z=0; z<resp.length; z++){
        this.c = 0;
        for(let x = 0; x<this.instaladores.length; x++){
            if( resp[z].nombre == this.instaladores[x].nombre){
              this.c++;
            }      
        }
        if(this.c == 0 ){
          this.instaladoresmas.push(resp[z]);
        }
      }
    }
}));
}

  actualizarLevantamiento(){

    if(!this.formaCierre.valid){
      Swal.fire({
        icon: 'warning',
        text: 'sub$ los campos son obligatorios'
      });
    }else{
      this.slevantamiento.actualizarLevantamiento(parseInt(this.formaCierre.controls['altura'].value),
      this.formaCierre.controls['tipo'].value,
      this.formaCierre.controls['tipoTecho'].value,
      this.formaCierre.controls['torre'].value,
      parseInt(this.formaCierre.controls['repetidora'].value),
      parseInt(this.formaCierre.controls['rack'].value),
      parseInt(this.formaCierre.controls['linea'].value),
      this.formaCierre.controls['observaciones'].value,
      parseInt(this.formaCierre.controls['energia'].value),
      this.cve_levantamiento).subscribe((resp:any)=>{
        this.archivos.forEach(file => {
          this.sub$.add(this.arch.insertarArchivo(file,this.cve_levantamiento.toString()).subscribe((resp:any)=>{
            location.reload();
          }));
         });
      });
    }
  }

 async insertarInstaLevantamiento(opc :number){
   
    for await (const iterator of this.isChecked2) {
    this.levantaInsta.cve_instalador = iterator;
    this.levantaInsta.cve_levantamiento = this.cve_levantamiento;
     await this.slevantamiento.insertMasInstaladoresDeLevantamiento(this.levantaInsta).toPromise();
     const correo = await this.sUser.getEmail(iterator).toPromise();
     await this.emailModal2.push( new EmailModel(this.cve_levantamiento,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,correo[0].email,this.mb));
  }
  
    await  this.sub$.add(this.sEmail.notificarLevantamiento(this.emailModal2, 1,2).subscribe((resp=>{
      if(opc ==1){
        this.eliminarInstaLevantamiento();
      }else{
      location.reload();
      
      }
    })));
  }
  
  async eliminarInstaLevantamiento(){
    for await (const iterator of this.isChecked) {
      await  this.sub$.add(this.slevantamiento.deleteInstaladorDeLevantamiento(this.cve_levantamiento,iterator).subscribe());
      const correo = await this.sUser.getEmail(iterator).toPromise();
      await this.emailModal.push(new EmailModel(this.cve_levantamiento,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,correo[0].email,this.mb));
   }
   await  this.sub$.add(this.sEmail.notificarLevantamiento(this.emailModal, 1,1).subscribe((resp=>{
    location.reload();
  })));
  }

ngOnDestroy(): void {
  this.sub$.unsubscribe();
  
}
  imprimir(){
    window.print();
  }

  iniciarHoras(){
    this.horas = [];
    for(let i = 0; i<24; i++){
      this.horas[i] = i+1;
    }
  }


  obtenerVehiculos(){
    this.vehiculos = [];
    this.sub$.add(this.sCatalogo.obtenerVehiculos().subscribe((resp:any)=>{
      this.vehiculos = resp;
    }));
  }

  public cargandoImagen(file: FileList){
    this.archivos = [];
     for(let i=0;i<file.length;i++){
       this.formData = new FormData();
       this.formData.append('info', file[i], file[i].name);
       this.archivos.push(this.formData);
     }
  }

  cargarDocumentos(){
    this.sub$.add(this.arch.getDocumentosLevantamiento(this.cve_levantamiento.toString()).subscribe((resp:any)=>{
      this.documentos = resp;
    }));
  }

  cargarImagen(imagen:string){
    this.imagen = "http://localhost/API3.1/fotos/"+imagen;
  }

  seleccionandoInstalador(isChecked :number[], cve: number){
    var c =0;
    var num =0;
    isChecked.push(cve);
    for(let y =0; y<isChecked.length; y++){
      if(isChecked[y]==cve){
        c++;
        if(c==2){
        num = isChecked[isChecked.length-1];
        isChecked.pop(); 
        for(let y =0; y<isChecked.length; y++){
            if(num == isChecked[y])
            {
              isChecked.splice(y, 1);
            }
          }
        }
      }
    }
    this.cambioInstalador();
  }

}
