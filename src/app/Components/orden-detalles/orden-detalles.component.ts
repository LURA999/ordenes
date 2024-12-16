import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { OrdenService } from 'src/app/services/orden.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ordenInstaladores } from 'src/app/models/ordenInstaladores.model';
import { EmailService } from 'src/app/services/email.service';
import { EmailModel } from 'src/app/models/email.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orden-detalles',
  templateUrl: './orden-detalles.component.html',
  styleUrls: ['./orden-detalles.component.css'],
})
export class OrdenDetallesComponent implements OnInit {
  @Input() cve_orden : number;


  /**Variable para subscribe**/
  sub$ = new Subscription();
  sub;
  /******/
  private emailModal = new Array<EmailModel>();
  private emailModal2 = new Array<EmailModel>();


  contDocs:number = 0;
  instaladores : any[] =[];
  instaladoresmas : any[] =[];
  ordenesInstaladores : ordenInstaladores = new ordenInstaladores();
  clave_comentario:string;
  sucursal: string;
  instaOrd: any[] = [];

  descripcion: string;
  modInstalador: boolean = false;
  modFecha: boolean = false;
  documentos : any [];
  comentarios : any [] = [];
  formData = new FormData(); 
  archivos : FormData[] = []; 
  nivel : number = localStorage['level'];
  imagen : string;
  horas: any[];
  vehiculos: any[];
  hh: string = "12";
  mm: string = "0";
  c:number = 0;
  modVehiculo:boolean = false;
  fecha : Date;
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
  estatus: number;

  isChecked:number []=[];
  isChecked2:number []=[];
  nombres : string []=[];

  constructor(private sOrden: OrdenService, private sCatalogo : CatalogueService, private route: Router, 
    private aroute: ActivatedRoute, private arch: ArchivosService, private sEmail :EmailService, private sUser : UserService) {
 
    this.iniciarHoras();
    this.obtenerVehiculos();
   }

  ngOnInit(): void {
    this.sOrden.mostrarInstaladoresDeOrden(this.cve_orden).subscribe((resp: any) => {
      this.instaladores = resp;
      console.log(resp)
    });

    this.sOrden.getOrder(this.cve_orden).subscribe((resp:any)=>{
      this.nombreusuario = localStorage.getItem('name');
      this.cliente = resp[0]['cliente'];
      this.sucursal = resp[0]['sucursal'];
      this.contacto = resp[0]['contacto'];
      this.coordenadas = resp[0]['coordenadas'];
      this.numero = resp[0]['telefono'];
      this.servicio = resp[0]['desc_servicio'];
      this.instalador = resp[0]['instalador'];
      this.fecha = this.formatoYMD(resp[0]['fecha_programada']);
      this.fechaFull = resp[0]['fecha_programada'];
      this.descripcion = resp[0]['desc_problema'];
      this.estatus = resp[0]['estatus'];
      this.ciudad = resp[0]['ciudadNombre'];
      this.cve_vehiculo = resp[0]['cve_vehiculo'];
      this.desc_problema = resp[0]['desc_problema'];
      this.fecha_programada = resp[0]['fecha_programada'];

    });
     this.sOrden.getComentarios(this.cve_orden).subscribe((resp:any)=>{
      this.comentarios = resp;
    });

    this.getInstaladorOrden();
    this.getInstaladores();
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

   actualizarOrden(){

    if(this.modFecha== true){
     this.sOrden.updateDate(this.cve_orden, this.fecha, this.hh+":"+this.mm).toPromise();
    }

    if(this.modVehiculo == true){
      this.sOrden.updateVehiculo(this.cve_orden,this.cve_vehiculo).toPromise();
     }

    if(this.modInstalador == true){
      if(this.isChecked2.length > 0 && this.isChecked.length > 0){
        this.insertarInstaOrden(1);
      }else if (this.isChecked2.length > 0){
        this.insertarInstaOrden(0);
      }else if(this.isChecked.length > 0){
       this.eliminarInstaOrden();
      }
    }

  
    // this.route.navigate(['/','ordenes',], {skipLocationChange: false});
      //location.reload();
  }

  async insertarInstaOrden(opc:number){
    for await (const iterator of this.isChecked2) {
      console.log(iterator)
      this.ordenesInstaladores.cve_instalador = iterator;
      this.ordenesInstaladores.cve_orden= this.cve_orden;
       await this.sOrden.insertMasInstaladoresDeOrden(this.ordenesInstaladores).toPromise();
       const correo = await this.sUser.getEmail(iterator).toPromise();
       await this.emailModal2.push( new EmailModel(this.cve_orden,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,correo[0].email,""));
    }
    
      await  this.sEmail.notificarOrden(this.emailModal2, 1,3).subscribe((resp=>{
        if(opc ==1){
          this.eliminarInstaOrden();
        }else{
        location.reload();
        }
      }));
  }

  async eliminarInstaOrden(){
    
    for await (const iterator of this.isChecked) {
      await  this.sub$.add(this.sOrden.deleteInstaladorDeOrden(this.cve_orden,iterator).subscribe());
      const correo = await this.sUser.getEmail(iterator).toPromise();
      await this.emailModal.push(new EmailModel(this.cve_orden,this.cliente,this.sucursal,this.ciudad,this.contacto,this.coordenadas,this.servicio,this.numero,this.desc_problema,this.fecha_programada,correo[0].email,""));
   }
   await  this.sub$.add(this.sEmail.notificarOrden(this.emailModal, 1,2).subscribe((resp=>{
    location.reload();
  })));
  }

  ngOnDestroy(): void {
  this.sub$.unsubscribe();

  }
  
  agregarComentario(nuevoComentario:string){
    if(nuevoComentario != ""){
      this.sOrden.insertComentarios(this.cve_orden, parseInt(localStorage.getItem('id')), nuevoComentario).subscribe((resp:any)=>{
        var id = JSON.parse(resp);
        this.archivos.forEach(file => {
          this.arch.insertarArchivo(file,id[0]['id']).subscribe((resp:any)=>{
          });
         });
      });
      
      this.sOrden.getComentarios(this.cve_orden).subscribe((resp:any)=>{
        this.comentarios = resp;
      });
    }else{
      alert("Ingresar comentario");
    }
  }


  getInstaladorOrden(){
    this.sOrden.selectListaInstaldoresOrden(this.cve_orden).subscribe((resp:any) => {
      this.instaOrd = resp;
      for(let y=0; y<this.instaOrd.length; y++){
        this.nombres [y]= this.instaOrd[y].nombre;
      }
      if(this.nombres[0] == undefined){
        this.nombres[0] = " ";
      }

    });
  }
  getInstaladores(){
    this.sOrden.getInstallers().subscribe((resp: any) => {

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
});
}
   /* for(let z=0; z<resp.length; z++){
      this.c = 0;
      for(let x = 0; x<this.nombres.length; x++){
          if( resp[z].nombre != this.nombres[x]){
            this.c++;
            console.log(resp[z].nombre+ " "+this.nombres.length)

            if(this.c !== this.nombres.length ){
              this.instaladoresmas.push(resp[z]);
              
            }
          }
      }  
  }*/

  

  cerrarOrden(nuevoComentario:string){
    if(nuevoComentario != ""){
      this.sOrden.insertComentarios(this.cve_orden, parseInt(localStorage.getItem('id')), nuevoComentario).subscribe((resp:any)=>{
      });
      this.archivos.forEach(file => {
          this.arch.insertarArchivo(file,"a").subscribe((resp:any)=>{
          });
      });
      this.sOrden.cerrarOrden(this.cve_orden).subscribe((resp:any)=>{
        location.reload();
      });
    }else{
      alert("Debes ingresar un comentario para cerrar la orden");
    }
  }

 public cargandoImagen(file: FileList){
   this.archivos = [];
   this.contDocs = 0;
    for(let i=0;i<file.length;i++){
      this.contDocs ++;
      this.formData = new FormData();
      this.formData.append('info', file[i], file[i].name);
      this.archivos.push(this.formData);
    }
 }

  cargarDocumentos(cve:string){
    this.arch.getDocumentos(cve).subscribe((resp:any)=>{
      this.documentos = resp;
    });
  }

  cargarImagen(imagen:string){
    this.imagen = "http://localhost/API3.1/fotos/"+imagen;
  }

  iniciarHoras(){
    this.horas = [];
    for(let i = 0; i<24; i++){
      this.horas[i] = i+1;
    }
  }

  obtenerVehiculos(){
    this.vehiculos = [];
    this.sCatalogo.obtenerVehiculos().subscribe((resp:any)=>{
      this.vehiculos = resp;
    });
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
