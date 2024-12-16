export class EmailModel {
    cve :number;
    cliente : String;
    sucursal : String;
    ciudad : String;
    contacto : String;
    coordenadas : String;
    servicio : String;
    numero : String;
    desc_problema : String;
    fecha_programada : String;
    correo : String;
    mb : String;
    
  constructor(cve :number,
    cliente : String,
    sucursal : String,
    ciudad : String,
    contacto : String,
    coordenadas : String,
    servicio : String,
    numero : String,
    desc_problema : String,
    fecha_programada : String,
    correo : String,
    mb : String){
        this.cve =cve;
        this.cliente = cliente;
        this.sucursal = sucursal;
        this.ciudad = ciudad;
        this.contacto = contacto;
        this.coordenadas = coordenadas;
        this.servicio = servicio;
        this.numero = numero;
        this.desc_problema = desc_problema;
        this.fecha_programada = fecha_programada;
        this.correo = correo;
        this.mb = mb;
    }
}