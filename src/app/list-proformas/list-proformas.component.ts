import { Component, OnInit } from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {Subscription} from "rxjs";
import {ProformaModel} from "../models/Proforma.model";
import {FactureClientService} from "../services/factureClient.service";
import {ProformaService} from "../services/proforma.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-list-proformas',
  templateUrl: './list-proformas.component.html',
  styleUrls: ['./list-proformas.component.css']
})
export class ListProformasComponent implements OnInit {

  loading = false;
  factures: ProformaModel[];
  listFactureSubscription : Subscription;

  constructor(private proformaService : ProformaService,
              private factureClientService : FactureClientService,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  ngOnInit(): void {
    this.loading = true;
    this.listFactureSubscription = this.proformaService.listProformaSubject.subscribe(
      (data: ProformaModel[]) => {
        this.factures = data;
        this.loading = false;
      }
    );
    this.proformaService.getAllProformas();
  }

  ngOnDestroy(): void {
    this.listFactureSubscription.unsubscribe();
  }

  deleteFacture(id: number) {
    this.loading = true;
    this.proformaService.deleteProforma(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.proformaService.getAllProformas();
      });

    this.loading = false;
  }

  onSaveFactureClient(id: number) {
    let facture : FactureClientModel = this.factures.filter(x => x.id == id)[0];
    facture.numero = null;
    facture.ventes.forEach(x => x.id=null);
    if(facture.couvertures)
      facture.couvertures.forEach(x => x.id=null);
    console.log(facture);

    this.factureClientService.addFactureClient(facture).subscribe(
      data =>{
        console.log(data);
        // @ts-ignore
        this.router.navigate(['/print-facture-client/'+data.id]);
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    );

  }
}
