import {Component, OnInit, ViewChild} from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {Observable, Subscription} from "rxjs";
import {ProformaModel} from "../models/Proforma.model";
import {FactureClientService} from "../services/factureClient.service";
import {ProformaService} from "../services/proforma.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {PageEvent} from "@angular/material/paginator";
import {MarqueModel} from "../models/marque.model";
import {CompagniModel} from "../models/compagni.model";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MontureModel} from "../models/monture.model";
import {PersonneModel} from "../models/personne.model";
import {map, startWith} from "rxjs/operators";
import {CompagniService} from "../services/compagni.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-list-proformas',
  templateUrl: './list-proformas.component.html',
  styleUrls: ['./list-proformas.component.css']
})
export class ListProformasComponent implements OnInit {

  loading = false;
  factures: ProformaModel[];

  size : number = 10;
  page : number = 0;
  mc : string = "";
  idEntreprise : number = 0;
  idAssurance : number = 0;
  totalElements: number = 0;

  listEntreprises : CompagniModel[]=[];
  filteredEntreprises : Observable<CompagniModel[]>;
  entrepriseTriggerSubscription : Subscription;
  entrepriseControl = new FormControl();
  @ViewChild('autoCompleteEntreprise', { read: MatAutocompleteTrigger }) triggerEntreprise: MatAutocompleteTrigger;

  listAssurances : CompagniModel[]=[];
  filteredAssurances : Observable<CompagniModel[]>;
  assuranceTriggerSubscription : Subscription;
  assuranceControl = new FormControl();
  @ViewChild('autoCompleteAssurance', { read: MatAutocompleteTrigger }) triggerAssurance: MatAutocompleteTrigger;

  constructor(private spinnerService: NgxSpinnerService,
              private proformaService : ProformaService,
              private compagniService : CompagniService,
              private factureClientService : FactureClientService,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.spinnerService.show();

    this.compagniService.getAllCompagnis().subscribe(data2 => {
      this.listEntreprises = data2;
      console.log(data2);
      this.listAssurances = this.listEntreprises.filter(entr => entr.type == "assurance");
      this.spinnerService.hide();
      this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
    }, error => {
      this.spinnerService.hide();
      console.log('Error ! : ' + error);
    });

    this.filteredEntreprises = this.entrepriseControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
    );
    this.filteredAssurances = this.assuranceControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterAssurance(nom) : this.listAssurances.slice())
    );

  }

  ngOnDestroy(): void {
    this.assuranceTriggerSubscription.unsubscribe();
    this.entrepriseTriggerSubscription.unsubscribe();
  }
  ngAfterViewInit() {

     this.entrepriseTriggerSubscription = this.triggerEntreprise.panelClosingActions.subscribe(e => {
       if (!e) {
           this.idEntreprise = 0;
           this.entrepriseControl.reset();
         this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
       }
     },e => console.log('error', e));

    this.assuranceTriggerSubscription = this.triggerAssurance.panelClosingActions.subscribe(e => {
      if (!e) {
          this.idAssurance = 0;
          this.assuranceControl.reset();
        this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
      }
    },e => console.log('error', e));

  }

  private _filterEntreprise(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listEntreprises.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
  }
  private _filterAssurance(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listAssurances.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
  }
  displayEntreprise(entreprise: CompagniModel): string {
    if(entreprise && entreprise.nom){
      return entreprise.nom;
    }
    return '';
  }
  getEntreprise(event) {
    this.idEntreprise = event.option.value.id;
    this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
  }
  getAssurance(event) {
    this.idAssurance = event.option.value.id;
    this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
  }

  deleteFacture(id: number) {
    this.spinnerService.show();
    this.proformaService.deleteProforma(id).subscribe( data =>{
      console.log("ok deleting");
      this.spinnerService.hide();
      this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
    }, error => {
      this.spinnerService.hide();
    });
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

  onEditFactureClient(id: number) {
    this.router.navigate(['/edit-facture/'+id]);
  }

  getAllProformas(request){
    this.spinnerService.show();
    this.proformaService.getAllPagesProformas(request).subscribe((data: ProformaModel[]) => {
      console.log(data);
      this.factures = data['content'];
      this.totalElements = data['totalElements'];
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  nextPage(event: PageEvent) {
    const request = {};
    request['mc'] = this.mc;
    request['page'] = event.pageIndex.toString();
    this.page = event.pageIndex;
    request['size'] = event.pageSize.toString();
    this.size = event.pageSize;
    // @ts-ignore
    this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
  }

  onRecherche() {
    this.mc = this.mc.trim();
    this.getAllProformas({mc: this.mc.trim(), assurance: this.idAssurance, entreprise:this.idEntreprise, page: this.page, size: this.size });
  }

}
