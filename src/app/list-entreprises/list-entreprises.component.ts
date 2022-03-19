import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {Subscription} from "rxjs";
import {CompagniModel} from "../models/compagni.model";
import {LentilleService} from "../services/lentille.service";
import {CompagniService} from "../services/compagni.service";

@Component({
  selector: 'app-list-entreprises',
  templateUrl: './list-entreprises.component.html',
  styleUrls: ['./list-entreprises.component.css']
})
export class ListEntreprisesComponent implements OnInit {

  loading = false;
  entreprises: CompagniModel[];
  listEntrepriseSubscription : Subscription;

  constructor(private compagniService : CompagniService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listEntrepriseSubscription = this.compagniService.listCompagniSubject.subscribe(
      (entreprises: CompagniModel[]) => {
        let listEntreprises = entreprises;
        this.entreprises = listEntreprises.filter(x => x.type == 'assurance');
        this.loading = false;
      }
    );
    this.compagniService.getAllCompagnis();
  }

  ngOnDestroy(): void {
    this.listEntrepriseSubscription.unsubscribe();
  }

  deleteEntreprise(id: number) {
    this.loading = true;
    this.compagniService.deleteCompagni(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.compagniService.getAllCompagnis();
      });

    this.loading = false;
  }

}
