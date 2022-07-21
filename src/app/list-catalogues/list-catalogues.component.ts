import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {CatalogueModel} from "../models/catalogue.model";
import {MarqueService} from "../services/marque.service";
import {MarqueModel} from "../models/marque.model";
import {CatalogueService} from "../services/catalogue.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-catalogues',
  templateUrl: './list-catalogues.component.html',
  styleUrls: ['./list-catalogues.component.css']
})
export class ListCataloguesComponent implements OnInit {

  loading = false;
  catalogues: CatalogueModel[];

  constructor(private spinnerService: NgxSpinnerService, private catalogueService : CatalogueService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.loading = true;
    this.catalogueService.getAllCatalogues().subscribe(
      (data) => {
        this.catalogues = data;
        this.spinnerService.hide();
      }, error => {
        this.spinnerService.hide();
        console.log('Error ! : ' + error);
      }
    );
  }

  deleteMarque(id: number) {
    this.loading = true;
    this.catalogueService.deleteCatalogue(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.catalogueService.getAllCatalogues();
      });

    this.loading = false;
  }


}
