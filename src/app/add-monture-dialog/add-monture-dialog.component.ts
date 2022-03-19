import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StockModel} from "../models/stockModel";
import {MontureModel} from "../models/monture.model";
import {MarqueModel} from "../models/marque.model";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MontureService} from "../services/monture.service";
import {StockService} from "../services/stock.service";
import {MarqueService} from "../services/marque.service";
import {map, startWith} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-monture-dialog',
  templateUrl: './add-monture-dialog.component.html',
  styleUrls: ['./add-monture-dialog.component.css']
})
export class AddMontureDialogComponent implements OnInit {

  montureForm: FormGroup;
  submitted = false;
  loading = false;
  //stock = new StockModel(1000, 100, 0, null, new MontureModel('ref000154', 'rdxv', 'Bronze', null, null, null, null));
  //monture = new MontureModel(null, null, null, null, null, null, null);

  marque : MarqueModel = null;
  filteredMarque : Observable<MarqueModel[]>;
  listMarques : MarqueModel[]=[];
  marqueControl = new FormControl();
  listMarqueSubscription : Subscription;
  marqueTriggerSubscription : Subscription;
  @ViewChild('autoCompleteMarque', { read: MatAutocompleteTrigger }) triggerMarque: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder,
              private montureService :  MontureService,
              private stockService :  StockService,
              private marqueService : MarqueService,
              public dialogRef: MatDialogRef<AddMontureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: StockModel,) { }

  ngOnInit(): void {
    this.initForm();

    this.listMarqueSubscription = this.marqueService.listMarqueSubject.subscribe(data => {
      this.listMarques = data;
    }, error => {
      console.log('Error ! : ' + error);
    });
    this.marqueService.getAllMarques();

    this.filteredMarque = this.marqueControl.valueChanges.pipe(
      startWith(''),
      map( value => ( typeof value === 'string' ? value : value.nom)),
      map( nom => (nom ? this._filterMarque(nom) : this.listMarques.slice())),
    );

  }

  ngOnDestroy(): void {
    this.listMarqueSubscription.unsubscribe();
    this.marqueTriggerSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.marqueTriggerSubscription = this.triggerMarque.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.marque != null){
          this.marque = null;
        }
      }
    },e => console.log('error', e));
  }

  private _filterMarque(value: string): MarqueModel[] {
    if(value != null){
      const filterValue = value.toLowerCase();
      return this.listMarques.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
    }
    return this.listMarques;
  }
  displayMarque(marque: MarqueModel): string {
    if(marque && marque.nom){
      return marque.nom;
    }
    return '';
  }
  getMarque(event) {
    this.marque = event.option.value;
  }

  initForm(){
    this.montureForm = this.formBuilder.group({
      reference: [null, Validators.compose([Validators.required])],
      //libelle: [monture.libelle, Validators.compose([Validators.required])],
      modele: null,
      matiere: null,
      genre: null,
      taille: null,
      forme: null,
      coloris: null,
      lngBrn: null,
      catAge: null,
      //marque: monture.marque ? monture.marque.nom : null,
      prixVente: [null, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }

  get f() { return this.montureForm.controls; }

  onSubmitForm() {
    if(this.montureForm.get('reference').value && this.montureForm.get('reference').value.toString().trim()=='')
      this.montureForm.get('reference').setValue(null);

    this.submitted = true;
    if (this.montureForm.invalid) {
      return;
    }
    const formValue = this.montureForm.value;
    let editedStock = new StockModel(1000, 100, 0, null, new MontureModel(null, null, null, null, null, null, null));
    let editedMonture = editedStock.produit as MontureModel;

    editedMonture.reference=formValue['reference'] ? ( <string>formValue['reference']).trim() : formValue['reference'];
    editedMonture.modele= formValue['modele'] ? (<string> formValue['modele']).trim() : formValue['modele'];
    editedMonture.matiere= formValue['matiere'] ? (<string> formValue['matiere']).trim() : formValue['matiere'];
    editedMonture.genre= formValue['genre'] ? (<string> formValue['genre']).trim() : formValue['genre'];
    editedMonture.taille= formValue['taille'] ? (<string> formValue['taille']).trim() : formValue['taille'];
    editedMonture.forme= formValue['forme'] ? (<string> formValue['forme']).trim() : formValue['forme'];
    editedMonture.libelle = editedMonture.reference
    if(this.marque!=null)
      editedMonture.marque = this.marque;
    else if(this.marqueControl.value !=null && this.marqueControl.value.toString().trim()!=''){
      editedMonture.marque = new MarqueModel(this.marqueControl.value.toString().trim());
    }
    else
      editedMonture.marque = null;
    editedStock.produit = editedMonture;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = 1;

    this.addMonture(editedStock);
  }

  onReset() {
    this.submitted = false;
    this.montureForm.reset();
  }

  private addMonture(stock : StockModel) {
    this.montureService.addMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        this.loading = false;
        this.stockService.getAllStockMonture();
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
