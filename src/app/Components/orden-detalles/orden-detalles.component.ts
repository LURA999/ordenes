import { Component, OnInit, Input } from '@angular/core';
import { OrdenService } from 'src/app/Services/orden.service';

@Component({
  selector: 'app-orden-detalles',
  templateUrl: './orden-detalles.component.html',
  styleUrls: ['./orden-detalles.component.css']
})
export class OrdenDetallesComponent implements OnInit {
  @Input() cve_orden : number;
  instaladores : any[];
  cliente: string;
  sucursal: string;
  contacto: string;
  numero: string;
  servicio : string;
  instalador : number;

  constructor(private sOrden: OrdenService) {
    this.sOrden.getInstallers().subscribe((resp: any) => {
      this.instaladores = resp;
    });
   }

  ngOnInit(): void {
    this.sOrden.getOrder(this.cve_orden).subscribe((resp:any)=>{
      this.cliente = resp[0]['cliente'];
      this.sucursal = resp[0]['sucursal'];
      this.contacto = resp[0]['contacto'];
      this.numero = resp[0]['telefono'];
      this.servicio = resp[0]['desc_servicio'];
      this.instalador = resp[0]['instalador'];
    });
  }

}
