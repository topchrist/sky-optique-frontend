import { Component, OnInit } from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {Subscription} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {FactureClientService} from "../services/factureClient.service";
import {CompagniService} from "../services/compagni.service";
import {CompagniModel} from "../models/compagni.model";
import {BordereauModel} from "../models/bordereau.model";
import {BordereauService} from "../services/bordereau.service";
import {LentilleService} from "../services/lentille.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-bordereau',
  templateUrl: './edit-bordereau.component.html',
  styleUrls: ['./edit-bordereau.component.css']
})
export class EditBordereauComponent implements OnInit {

  factures: FactureClientModel[];
  filtredFactures: FactureClientModel[];
  selectedFactures: FactureClientModel[];
  //listFactureSubscription : Subscription;
  dateDebut = null;
  dateFin = null;

  idAssurance = null;
  listAssurances : CompagniModel[]=[];

  isSelected =false;

  constructor(private spinnerService: NgxSpinnerService,
              private factureClientService : FactureClientService,
              private compagniService : CompagniService,
              private bordereauService : BordereauService,
              private router: Router) { }

  ngOnInit(): void {
    this.spinnerService.show();

    this.compagniService.getAllCompagnis().subscribe(data => {
      this.listAssurances = (data as CompagniModel[]).filter(entr => entr.type == "assurance");
      this.factureClientService.getAllFactureClientsWithoutBordereau().subscribe((data: FactureClientModel[]) => {
        this.factures = data;
        this.filtredFactures = [];
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

  onRemoveFacture(id: number) {
    this.spinnerService.show();
    this.factureClientService.deleteFactureClient(id).subscribe( data =>{
        console.log("ok deleting");
        this.spinnerService.hide();
        //this.factureClientService.getAllFactureClients();
      }, error =>{
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

  onFIlterListe() {
    let tmp = [];
    if(this.idAssurance != '' && this.dateDebut != null && this.dateFin != null){
      let fin = new Date(this.dateFin);
      fin.setHours(23, 59, 59);
      console.log(fin);
      tmp = this.factures.filter(fact => fact.couvertures[0].assurance.id == this.idAssurance && fact.createAt >= this.dateDebut && new Date(fact.createAt) <= fin);
    }
    this.filtredFactures = tmp;
  }

  onAssuranceChange($event: any) {
    let tmp = [];
    if(this.idAssurance != ''){
      tmp = this.factures.filter(fact => fact.couvertures[0].assurance.id == this.idAssurance);
    }
    this.filtredFactures = tmp;
  }

  checkAllCheckBox(ev: any) { // Angular 13
    this.filtredFactures.forEach(x => x.checked = ev.target.checked);
    this.onFactureSelected();
  }

  isAllCheckBoxChecked() {
    if (this.filtredFactures != null){
      let val = this.filtredFactures.every(p => p.checked);
      this.onFactureSelected();
      return val;
    }
  }

  onDateFormat(date: any) {
    return new Date(date).toLocaleString();
  }

  formatMillier( nombre){
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while( reg.test( nombre)) {
      nombre = nombre.replace( reg, '$1' +sep +'$2');
    }
    return nombre;
  }

  onFactureSelected(){
    this.isSelected = false;
    if (this.idAssurance!=null && this.filtredFactures != null){
      this.filtredFactures.forEach(x => {
        if(x.checked == true){
          this.isSelected = true;
        }
      });
    }
  }

  onSubmit(bordereauForm: any) {
    this.spinnerService.show();
    let fin = new Date(this.dateFin);
    fin.setHours(23, 59, 59);
    let bordereau = new BordereauModel(this.dateDebut, fin, this.filtredFactures.filter( x => x.checked));
    bordereau.assurance = this.listAssurances.filter(x => x.id == this.idAssurance)[0];
    console.log(bordereau);
    this.bordereauService.addBordereau(bordereau).subscribe(data =>{
      console.log(data);
      this.spinnerService.hide();
      // @ts-ignore
      this.router.navigate(['/print-bordereau/'+data.id]);
    }, error => {
      this.spinnerService.hide();
      console.log('error : '+error);
    })
  }
}
