import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {BonLivraisonService} from "../services/BonLivraison.service";
import {BonCommandeModel} from "../models/bonCommande.model";
import {BonCommandeService} from "../services/BonCommande.service";

@Component({
  selector: 'app-list-bon-commandes',
  templateUrl: './list-bon-commandes.component.html',
  styleUrls: ['./list-bon-commandes.component.css']
})
export class ListBonCommandesComponent implements OnInit {

  loading = false;
  bonCommandes: BonCommandeModel[];
  listBonCommandeSubscription : Subscription;

  constructor(public bonCommandesService : BonCommandeService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listBonCommandeSubscription = this.bonCommandesService.listBonCommandeSubject.subscribe(
      (bonCommandes : BonCommandeModel[]) => {
        this.bonCommandes = bonCommandes;
      }
    );
    this.bonCommandesService.getAllBonCommande();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.listBonCommandeSubscription.unsubscribe();
  }

  deleteBonLivraison(id: number) {
    this.loading = true;
    this.bonCommandesService.deleteBonCommande(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.bonCommandesService.getAllBonCommande();
      });

    this.loading = false;
  }


}
