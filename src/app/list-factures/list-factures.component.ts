import { Component, OnInit } from '@angular/core';
 import {Subscription} from "rxjs";
import {FactureClientModel} from "../models/factureClient.model";
 import {FactureClientService} from "../services/factureClient.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-list-factures',
  templateUrl: './list-factures.component.html',
  styleUrls: ['./list-factures.component.css']
})
export class ListFacturesComponent implements OnInit {

  loading = false;
  factures: FactureClientModel[];
  filtredFactures: FactureClientModel[];
  listFactureSubscription : Subscription;
  dateDebut = null;
  dateFin = null;
  dateDebutControl = new FormControl(new Date(2022, 1, 1, 0, 0, 0, 0),[Validators.required]);


  constructor(private factureClientService : FactureClientService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listFactureSubscription = this.factureClientService.listFactureClientSubject.subscribe(
      (data: FactureClientModel[]) => {
        this.factures = data;
        this.filtredFactures = this.factures;
        this.loading = false;
      }
    );
    this.factureClientService.getAllFactureClients();
  }

  ngOnDestroy(): void {
    this.listFactureSubscription.unsubscribe();
  }

  deleteFacture(id: number) {
    this.loading = true;
    this.factureClientService.deleteFactureClient(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.factureClientService.getAllFactureClients();
      });

    this.loading = false;
  }

  onFiltreForm() {

  }

  onFIlterListe() {
    let tmp = this.factures;
    if(this.dateDebut != null)
      tmp = tmp.filter(fact => fact.createAt >= this.dateDebut);
    if(this.dateFin != null){
      let fin = new Date(this.dateFin);
      fin.setHours(23, 59, 59);
      tmp = tmp.filter(fact => new Date(fact.createAt) <= fin);
    }

    this.filtredFactures = tmp;
  }
}
