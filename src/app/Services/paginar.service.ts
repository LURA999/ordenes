export class PaginarService {

  btnNext: boolean;
  btnPrev: boolean;
  totalPages: number;
  showPages: number;
  actualPage: number;
  lastElement: number;
  currentElement: number;
  arregloMostrar: any[];
  arregloPaginar: any[];

  constructor(public arreglo: any[]) {
    this.arregloPaginar = arreglo;
    this.arregloMostrar = [];
  }

  paginar(): any[] {
    if (this.arregloPaginar.length <= 10) {
      this.arregloMostrar = this.arregloPaginar;
      this.btnNext = false;
      this.btnPrev = false;
      if (this.arregloPaginar.length == 0) {
        this.actualPage = 0;
        this.totalPages = 0;
      } else {
        this.actualPage = 1;
        this.totalPages = 1;
      }
    } else {
      this.btnNext = true;
      this.btnPrev = false;
      this.lastElement = this.arregloPaginar.length - 1;
      this.actualPage = 1;
      this.totalPages = this.arregloPaginar.length / 10;
      if ((this.totalPages - Math.trunc(this.totalPages)) > 0) {
        this.totalPages -= (this.totalPages - Math.trunc(this.totalPages));
        this.totalPages += 1;
      }
      for (let i = 0; i <= 9; i++) {
        this.arregloMostrar.push(this.arregloPaginar[i]);
        this.currentElement = i;
      }
    }
    return this.arregloMostrar;
  }

  public siguiente() {
    this.actualPage += 1;
    if (this.actualPage == this.totalPages) {
      this.btnNext = false;
      this.btnPrev = true;
      this.arregloMostrar = [];
      for (let i = this.currentElement; i < this.lastElement; i++) {
        this.arregloMostrar.push(this.arregloPaginar[i + 1]);
      }
      this.currentElement = this.lastElement;
    } else {
      this.btnPrev = true;
      this.arregloMostrar = [];
      for (let i = 0; i <= 9; i++) {
        this.arregloMostrar.push(this.arregloPaginar[this.currentElement + 1]);
        this.currentElement++;
      }
    }

    return this.arregloMostrar;
  }

  public previo(): any {
    this.actualPage -= 1;
    this.btnNext = true;
    if (this.actualPage == 1) {
      this.arregloMostrar = [];
      this.btnPrev = false;
      for (let i = 0; i <= 9; i++) {
        this.arregloMostrar.push(this.arregloPaginar[i]);
        this.currentElement = i;
      }
    } else {
      this.currentElement = this.currentElement - (this.arregloMostrar.length + 10);
      this.arregloMostrar = [];
      for (let i = 0; i <= 9; i++) {
        this.arregloMostrar.push(this.arregloPaginar[this.currentElement + 1]);
        this.currentElement++;
      }
    }
    return this.arregloMostrar;
  }
}
