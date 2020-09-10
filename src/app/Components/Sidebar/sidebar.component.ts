import { Component } from "@angular/core"


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
  })


export class SidebarComponent{

    usuario: string = localStorage['name'];
   public testOut() {
      console.log("hovering outside sidebar");
      }
}