import { Component, OnInit } from '@angular/core';
import {CompagniModel} from "../models/compagni.model";
import {Subscription} from "rxjs";
import {PersonneModel} from "../models/personne.model";
import {CompagniService} from "../services/compagni.service";
import {PersonneService} from "../services/personne.service";

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-personnes.component.html',
  styleUrls: ['./list-personnes.component.css']
})
export class ListPersonnesComponent implements OnInit {

  loading = false;
  personnes : PersonneModel[];
  listPersonneSubscription : Subscription;

  constructor(private personneService : PersonneService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.listPersonneSubscription = this.personneService.listPersonneSubject.subscribe(
      (data: PersonneModel[]) => {
        let listPersonnes = data;
        this.personnes = listPersonnes.filter(pers => pers.discriminator != "PRESCRIPTEUR");
        this.loading = false;
      }
    );
    this.personneService.getAllPersonnes();
  }

  ngOnDestroy(): void {
    this.listPersonneSubscription.unsubscribe();
  }

  deletePersonne(id: number) {
    this.loading = true;
    this.personneService.deletePersonne(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.personneService.getAllPersonnes();
      });

    this.loading = false;
  }

}
