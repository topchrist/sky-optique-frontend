import { Component, OnInit } from '@angular/core';
import {FournisseurModel} from "../models/fournisseur.model";
import {Subscription} from "rxjs";
import {AgenceService} from "../services/agence.service";
import {AgenceModel} from "../models/agence.model";

@Component({
  selector: 'app-list-agences',
  templateUrl: './list-agences.component.html',
  styleUrls: ['./list-agences.component.css']
})
export class ListAgencesComponent implements OnInit {

  loading = false;
  agences: AgenceModel[];
  listAgencesSubscription : Subscription;

  constructor(private agenceService : AgenceService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listAgencesSubscription = this.agenceService.listAgenceSubject.subscribe(
      (agences: AgenceModel[]) => {
        this.agences = agences;
        this.loading = false;
      }
    );
    this.agenceService.getAllAgences();
  }

  ngOnDestroy(): void {
    this.listAgencesSubscription.unsubscribe();
  }

  deleteAgence(id: number) {
    this.loading = true;
    this.agenceService.deleteAgence(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.agenceService.getAllAgences();
      });

    this.loading = false;
  }

}
