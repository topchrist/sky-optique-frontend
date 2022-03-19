import {Component, OnInit, ViewChild} from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {ActivatedRoute, Router} from "@angular/router";
import {LentilleService} from "../services/lentille.service";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {CatalogueModel} from "../models/catalogue.model";
import {CatalogueService} from "../services/catalogue.service";
import {MontureModel} from "../models/monture.model";
import {map, startWith} from "rxjs/operators";
import {MarqueModel} from "../models/marque.model";

@Component({
  selector: 'app-edit-lentille',
  templateUrl: './edit-lentille.component.html',
  styleUrls: ['./edit-lentille.component.css']
})
export class EditLentilleComponent implements OnInit {

  isAddMode: boolean;
  lentilleForm: FormGroup;
  submitted = false;
  loading = false;
  stock = new StockModel(null, null, null, null, new LentilleModel(null, null, null, null, null));

  catalogue : CatalogueModel = null;
  filteredCatalogue : Observable<CatalogueModel[]>;
  listCatalogues : CatalogueModel[]=[];
  listCatalogueSubscription : Subscription;
  catalogueTriggerSubscription : Subscription;
  @ViewChild('autoCompleteCatalogue', { read: MatAutocompleteTrigger }) triggerCatalogue: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder,
              private catalogueService :  CatalogueService,
              private stockService :  StockService,
              private lentilleService : LentilleService,
              private router: Router,
              private route: ActivatedRoute) {
    this.stock.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.stock.id;
    this.initForm(this.stock);

    if (!this.isAddMode) {
      this.loading = true;
      this.stockService.getStockById(this.stock.id).subscribe((response) => {
        this.stock = response;
        console.log(this.stock);
        if((this.stock.produit as LentilleModel).catalogue!=null){
          // @ts-ignore
          this.catalogue = this.stock.produit.catalogue;
          // @ts-ignore
          //this.factureForm.get('catalogue').setValue(this.catalogue);
        }
        this.initForm(this.stock);
          this.filteredCatalogue = this.lentilleForm.get('catalogue').valueChanges.pipe(
            startWith(''),
            map( value => ( typeof value === 'string' ? value : value.nom)),
            map( nom => (nom ? this._filterCatalogue(nom) : this.listCatalogues.slice())),
          );
      },(error) => {
        console.log('Erreur ! : ' + error);
      }
      );
      this.loading = false;
    }
    else {
      this.filteredCatalogue = this.lentilleForm.get('catalogue').valueChanges.pipe(
        startWith(''),
        map( value => ( typeof value === 'string' ? value : value.nom)),
        map( nom => (nom ? this._filterCatalogue(nom) : this.listCatalogues.slice())),
      );
    }

    this.listCatalogueSubscription = this.catalogueService.listCatalogueSubject.subscribe(data => {
      this.listCatalogues = data;
    }, error => {
      console.log('Error ! : ' + error);
    });
    this.catalogueService.getAllCatalogues();

  }
  ngOnDestroy(): void {
    this.listCatalogueSubscription.unsubscribe();
    this.catalogueTriggerSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.catalogueTriggerSubscription = this.triggerCatalogue.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.catalogue != null){
          this.catalogue = null;
        }
      }
    },e => console.log('error', e));
  }

  private _filterCatalogue(value: string): CatalogueModel[] {
    if(value != null){
      const filterValue = value.toLowerCase();
      return this.listCatalogues.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
    }
    return this.listCatalogues;
  }
  displayCatalogue(catalogue: CatalogueModel): string {
    if(catalogue && catalogue.nom){
      return catalogue.nom;
    }
    return '';
  }
  getCatalogue(event) {
    this.catalogue = event.option.value;
  }

  initForm(stock : StockModel){
    console.log(stock);
    let lentille: LentilleModel = stock.produit as LentilleModel;
    this.lentilleForm = this.formBuilder.group({
      catalogue: [lentille.catalogue, Validators.compose([Validators.required])],
      sphere: [lentille.sphere, Validators.compose([Validators.required])],
      cylindre: [lentille.cylindre, Validators.compose([Validators.required])],
      axe: lentille.axe,
      addition: lentille.addition,
      qte: [stock.qte, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [stock.prixVente, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }

  get f() { return this.lentilleForm.controls; }

  onSubmitForm() {
    if(this.lentilleForm.get('catalogue').value && this.lentilleForm.get('catalogue').value.toString().trim()=='')
      this.lentilleForm.get('catalogue').setValue(null);

    this.submitted = true;
    if (this.lentilleForm.invalid) {
      return;
    }
    const formValue = this.lentilleForm.value;
    let editedStock = this.stock;
    let editedLentille = this.stock.produit as LentilleModel;

    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedStock.produit = editedLentille;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = formValue['qte'];
    if(this.catalogue!=null)
      editedLentille.catalogue = this.catalogue;
    else
      editedLentille.catalogue = new CatalogueModel(this.lentilleForm.get('catalogue').value.toString().trim());
    editedLentille.libelle = editedLentille.catalogue.nom;

    if (this.isAddMode) {
      this.addLentille(editedStock);
    } else {
      this.updateLentille(editedStock);
    }
  }

  onReset() {
    this.submitted = false;
    this.lentilleForm.reset();
  }


  private addLentille(stock : StockModel) {
    this.lentilleService.addLentille(stock.produit as LentilleModel).subscribe(data1=>{
      stock.produit = data1 as LentilleModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockLentille();
        this.router.navigate(['/lentilles']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  private updateLentille(stock : StockModel) {
    this.lentilleService.updateLentille(stock.produit as LentilleModel).subscribe(data1=>{
      stock.produit = data1 as LentilleModel;
      this.stockService.updateStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockLentille();
        this.router.navigate(['/lentilles']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

}
