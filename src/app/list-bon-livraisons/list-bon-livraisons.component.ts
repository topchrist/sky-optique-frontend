import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {Subscription} from "rxjs";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {LentilleService} from "../services/lentille.service";
import {BonLivraisonService} from "../services/BonLivraison.service";

@Component({
  selector: 'app-list-bon-livraisons',
  templateUrl: './list-bon-livraisons.component.html',
  styleUrls: ['./list-bon-livraisons.component.css']
})
export class ListBonLivraisonsComponent implements OnInit {

  loading = false;
  bonLivraisons: BonLivraisonModel[];
  listBonLivraisonSubscription : Subscription;

  constructor(public bonLivraisonService : BonLivraisonService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listBonLivraisonSubscription = this.bonLivraisonService.listBonLivraisonSubject.subscribe(
      (bonLivraisons : BonLivraisonModel[]) => {
        this.bonLivraisons = bonLivraisons;
      }
    );
    this.bonLivraisonService.getAllBonLivraison();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.listBonLivraisonSubscription.unsubscribe();
  }

  deleteBonLivraison(id: number) {
    this.loading = true;
    this.bonLivraisonService.deleteBonLivraison(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.bonLivraisonService.getAllBonLivraison();
      });

    this.loading = false;
  }

}
