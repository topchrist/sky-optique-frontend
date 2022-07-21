import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MarqueService} from "../services/marque.service";
import {MarqueModel} from "../models/marque.model";
import {PageEvent} from "@angular/material/paginator";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-marques',
  templateUrl: './list-marques.component.html',
  styleUrls: ['./list-marques.component.css']
})
export class ListMarquesComponent implements OnInit {

    marques: MarqueModel[];

    size : number = 10;
    page : number = 0;
    mc : string = "";
    totalElements: number = 0;

    constructor(private spinnerService: NgxSpinnerService, private marqueService : MarqueService) { }

    ngOnInit(): void {
        this.getAllMarques({mc:"", page: "0", size: "10" });
    }

    getAllMarques(request){
        this.spinnerService.show();
        this.marqueService.getAllPagesMarques(request).subscribe((data: MarqueModel[]) => {
            console.log(data);
            this.marques = data['content'];
            this.totalElements = data['totalElements'];
            this.spinnerService.hide();
        }, error => {
            this.spinnerService.hide();
        });
    }

    deleteMarque(id: number) {
        this.spinnerService.show();
        this.marqueService.deleteMarque(id).subscribe( data =>{
            console.log("ok deleting");
            this.spinnerService.hide();
            this.getAllMarques({mc: this.mc.trim(), page: this.page, size: this.size });
        }, error => {
            this.spinnerService.hide();
        });
    }

    nextPage(event: PageEvent) {
        const request = {};
        request['mc'] = this.mc;
        request['page'] = event.pageIndex.toString();
        this.page = event.pageIndex;
        request['size'] = event.pageSize.toString();
        this.size = event.pageSize;
        // @ts-ignore
        this.getAllMarques(request);
    }


    onRecherche() {
        this.mc = this.mc.trim();
        this.getAllMarques({mc: this.mc, page: this.page, size: this.size });
    }
}
