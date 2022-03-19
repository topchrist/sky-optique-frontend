import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {CatalogueModel} from "../models/catalogue.model";
import {MarqueService} from "../services/marque.service";
import {MarqueModel} from "../models/marque.model";
import {CatalogueService} from "../services/catalogue.service";

@Component({
  selector: 'app-list-catalogues',
  templateUrl: './list-catalogues.component.html',
  styleUrls: ['./list-catalogues.component.css']
})
export class ListCataloguesComponent implements OnInit {

  loading = false;
  catalogues: CatalogueModel[];
  listSubscription : Subscription;

  constructor(private catalogueService : CatalogueService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listSubscription = this.catalogueService.listCatalogueSubject.subscribe(
      (data: MarqueModel[]) => {
        this.catalogues = data;
        this.loading = false;
      }
    );
    this.catalogueService.getAllCatalogues();
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
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
