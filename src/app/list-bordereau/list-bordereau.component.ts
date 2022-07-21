import { Component, OnInit } from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {BordereauModel} from "../models/bordereau.model";
import {Subscription} from "rxjs";
import {FactureClientService} from "../services/factureClient.service";
import {BordereauService} from "../services/bordereau.service";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";
import {NgxSpinnerService} from "ngx-spinner";

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

  constructor(private spinnerService: NgxSpinnerService, private bordereauService : BordereauService, private compagniService : CompagniService) { }

  ngOnInit(): void {
    this.spinnerService.show();

    this.bordereauService.getAllBordereau().subscribe((data: BordereauModel[]) => {
        this.bordereaux = data;
        this.filtredBordereaux = this.bordereaux;
        this.compagniService.getAllCompagnis().subscribe(data => {
          this.listAssurances = (data as CompagniModel[]).filter(entr => entr.type == "assurance");
          this.spinnerService.hide();
        }, error => {
          console.log('Error ! : ' + error);
          this.spinnerService.hide();
        });
    }, error => {
        console.log('Error ! : ' + error);
        this.spinnerService.hide();
    });
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
