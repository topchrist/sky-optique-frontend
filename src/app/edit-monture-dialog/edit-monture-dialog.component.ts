import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MarqueModel} from "../models/marque.model";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MontureService} from "../services/monture.service";
import {StockService} from "../services/stock.service";
import {MarqueService} from "../services/marque.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StockModel} from "../models/stockModel";
import {PatientModel} from "../models/patient.model";
import {MontureModel} from "../models/monture.model";
import {map, startWith} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-monture-dialog',
  templateUrl: './edit-monture-dialog.component.html',
  styleUrls: ['./edit-monture-dialog.component.css']
})
export class EditMontureDialogComponent implements OnInit {

  montureForm: FormGroup;
  submitted = false;
  isAddMode: boolean;

  marque : MarqueModel = null;
  filteredMarque : Observable<MarqueModel[]>;
  listMarques : MarqueModel[]=[];
  marqueControl = new FormControl();
  marqueTriggerSubscription : Subscription;
  @ViewChild('autoCompleteMarque', { read: MatAutocompleteTrigger }) triggerMarque: MatAutocompleteTrigger;

  stock = new StockModel(null, null, null, null, new MontureModel(null, null, null, null, null, null, null));

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private montureService :  MontureService,
              private stockService :  StockService,
              private marqueService : MarqueService,
              public dialogRef: MatDialogRef<EditMontureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public montureToUpdate: any,) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.isAddMode = this.montureToUpdate.montureToUpdate == null;
    this.initForm(this.stock);

    this.marqueService.getAllMarques().subscribe(data => {
      this.listMarques = data;
      this.spinnerService.hide();
      if (!this.isAddMode) {
        // @ts-ignore
        this.stock = this.montureToUpdate.montureToUpdate;

        if((this.stock.produit as MontureModel).marque!=null)
        { // @ts-ignore
          this.marque = this.stock.produit.marque;
          console.log(this.marque.nom);
          // @ts-ignore
          this.marqueControl.setValue(this.marque);
        }


        this.initForm(this.stock);
      }
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
    this.filteredMarque = this.marqueControl.valueChanges.pipe(
        startWith(''),
        map( value => ( typeof value === 'string' ? value : value.nom)),
        map( nom => (nom ? this._filterMarque(nom) : this.listMarques.slice())),
    );


  }

  ngOnDestroy(): void {
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

  initForm(stock : StockModel){
    console.log(stock);
    let monture: MontureModel = stock.produit as MontureModel;
    console.log(monture);
    this.montureForm = this.formBuilder.group({
      reference: [monture.reference, Validators.compose([Validators.required])],
      //libelle: [monture.libelle, Validators.compose([Validators.required])],
      modele: monture.modele,
      matiere: monture.matiere,
      genre: monture.genre,
      taille: monture.taille,
      forme: monture.forme,
      coloris: monture.coloris,
      lngBrn: monture.lngBrn,
      catAge: monture.catAge,
      //marque: monture.marque ? monture.marque.nom : null,
      //qte: [stock.qte, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [stock.prixVente, Validators.compose([Validators.required, Validators.min(0)])],
    });
    //this.marqueControl.setValue(monture.marque);
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
    let editedStock = this.stock;
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

    if (this.isAddMode) {
      this.addMonture(editedStock);
    } else {
      this.updateMonture(editedStock);
    }
  }

  onReset() {
    this.submitted = false;
    this.montureForm.reset();
  }

  private addMonture(stock : StockModel) {
    this.spinnerService.show();
    this.montureService.addMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        this.spinnerService.hide();
        this.dialogRef.close(data2);
      }, error => {
        console.log('Error ! : ' + error);
        this.spinnerService.hide();
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });

  }

  private updateMonture(stock : StockModel) {
    this.spinnerService.show();
    console.log(stock.produit as MontureModel);
    this.montureService.updateMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      this.stockService.updateStock(stock).subscribe(data2=>{
        this.spinnerService.hide();
        this.dialogRef.close(data2);
      }, error => {
        console.log('Error ! : ' + error);
        this.spinnerService.hide();
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
