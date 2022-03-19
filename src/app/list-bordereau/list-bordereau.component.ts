import { Component, OnInit } from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {BordereauModel} from "../models/bordereau.model";
import {Subscription} from "rxjs";
import {FactureClientService} from "../services/factureClient.service";
import {BordereauService} from "../services/bordereau.service";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";

@Component({
  selector: 'app-list-bordereau',
  templateUrl: './list-bordereau.component.html',
  styleUrls: ['./list-bordereau.component.css']
})
export class ListBordereauComponent implements OnInit {

  loading = false;
  bordereaux: BordereauModel[] = [];
  filtredBordereaux: BordereauModel[] = [];
  listBordereauSubscription : Subscription;
  listAssurances : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;
  idAssurance = null;

  constructor(private bordereauService : BordereauService, private compagniService : CompagniService) { }

  ngOnInit(): void {
    this.loading = true;

    this.listEntreprisesSubscription = this.compagniService.listCompagniSubject.subscribe(
      data => {
        this.listAssurances = (data as CompagniModel[]).filter(entr => entr.type == "assurance");
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.compagniService.getAllCompagnis();

    this.listBordereauSubscription = this.bordereauService.listBordereauSubject.subscribe(
      (data: BordereauModel[]) => {
        this.bordereaux = data;
        this.filtredBordereaux = this.bordereaux;
        this.loading = false;
      }
    );
    this.bordereauService.getAllBordereau();
  }

  ngOnDestroy(): void {
    this.listBordereauSubscription.unsubscribe();
    this.listEntreprisesSubscription.unsubscribe();
  }

  onDateFormat(date: any) {
    return new Date(date).toLocaleString();
  }

  onAssuranceChange() {
    if(this.idAssurance != ''){
      this.filtredBordereaux = this.bordereaux.filter(bor => bor.assurance.id == this.idAssurance);
    }
    else
      this.filtredBordereaux = this.bordereaux;
  }

}
