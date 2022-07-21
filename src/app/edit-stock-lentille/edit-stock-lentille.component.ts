import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CatalogueModel} from "../models/catalogue.model";
import {Observable, Subscription} from "rxjs";
import {AddMontureDialogComponent} from "../add-monture-dialog/add-monture-dialog.component";
import {LentilleModel} from "../models/lentille.model";
import {LentilleService} from "../services/lentille.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StockModel} from "../models/stockModel";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {CatalogueService} from "../services/catalogue.service";
import {StockService} from "../services/stock.service";
import {map, startWith} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-stock-lentille',
  templateUrl: './edit-stock-lentille.component.html',
  styleUrls: ['./edit-stock-lentille.component.css']
})
export class EditStockLentilleComponent implements OnInit {

  lentilleForm: FormGroup;
  submitted = false;
  loading = false;

  catalogue : CatalogueModel = null;
  filteredCatalogue : Observable<CatalogueModel[]>;
  listCatalogues : CatalogueModel[]=[];
  catalogueTriggerSubscription : Subscription;
  @ViewChild('autoCompleteCatalogue', { read: MatAutocompleteTrigger }) triggerCatalogue: MatAutocompleteTrigger;

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private catalogueService :  CatalogueService,
              private stockService :  StockService,
              private lentilleService : LentilleService,
              public dialogRef: MatDialogRef<AddMontureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public lentille: StockModel,
  ) { }

  ngOnInit(): void {

    this.spinnerService.show();

    if(this.lentille != undefined) console.log("Add mode");
    else console.log("Update mode");
    console.log(this.lentille);

    this.initForm();

    this.catalogueService.getAllCatalogues().subscribe(data => {
      this.listCatalogues = data;
    }, error => {
      console.log('Error ! : ' + error);
    });
    this.catalogueService.getAllCatalogues();
    this.filteredCatalogue = this.lentilleForm.get('catalogue').valueChanges.pipe(
        startWith(''),
        map( value => ( typeof value === 'string' ? value : value.nom)),
        map( nom => (nom ? this._filterCatalogue(nom) : this.listCatalogues.slice())),
    );
  }
  ngOnDestroy(): void {
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

  initForm(){
    this.lentilleForm = this.formBuilder.group({
      catalogue: [null, Validators.compose([Validators.required])],
      sphere: [null, Validators.compose([Validators.required])],
      cylindre: [null, Validators.compose([Validators.required])],
      axe: null,
      addition: null,
      prixVente: [null, Validators.compose([Validators.required, Validators.min(0)])],
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
    let editedStock = new StockModel(null, 1, null, null, new LentilleModel(null, null, null, null, null));

    let editedLentille = editedStock.produit as LentilleModel;

    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedStock.produit = editedLentille;
    editedStock.prixVente = formValue['prixVente'];
    if(this.catalogue!=null)
      editedLentille.catalogue = this.catalogue;
    else
      editedLentille.catalogue = new CatalogueModel(this.lentilleForm.get('catalogue').value.toString().trim());
    editedLentille.libelle = editedLentille.catalogue.nom;

    this.addLentille(editedStock);

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
        (data2 as StockModel).produit = data1 as LentilleModel;
        this.dialogRef.close(data2);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
