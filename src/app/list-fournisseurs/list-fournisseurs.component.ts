import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {FournisseurModel} from "../models/fournisseur.model";
import {LentilleService} from "../services/lentille.service";
import {FournisseurService} from "../services/fournisseur.service";
import {LentilleModel} from "../models/lentille.model";

@Component({
  selector: 'app-list-fournisseurs',
  templateUrl: './list-fournisseurs.component.html',
  styleUrls: ['./list-fournisseurs.component.css']
})
export class ListFournisseursComponent implements OnInit {

  loading = false;
  fournisseurs: FournisseurModel[];
  listFournisseurSubscription : Subscription;

  constructor(private fournisseurService : FournisseurService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listFournisseurSubscription = this.fournisseurService.listFournisseurSubject.subscribe(
      (fournisseurs: FournisseurModel[]) => {
        this.fournisseurs = fournisseurs;
        this.loading = false;
      }
    );
    this.fournisseurService.getAllFournisseurs();
  }

  ngOnDestroy(): void {
    this.listFournisseurSubscription.unsubscribe();
  }

  deleteFournisseur(id: number) {
    this.loading = true;
    this.fournisseurService.deleteFournisseur(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.fournisseurService.getAllFournisseurs();
      });

    this.loading = false;
  }

}
