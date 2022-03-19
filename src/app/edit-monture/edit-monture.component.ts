import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {PersonneModel} from "../models/personne.model";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-edit-monture',
  templateUrl: './edit-monture.component.html',
  styleUrls: ['./edit-monture.component.css']
})
export class EditMontureComponent implements OnInit {

  isAddMode: boolean;
  montureForm: FormGroup;
  submitted = false;
  loading = false;
  stock = new StockModel(null, null, null, null, new MontureModel(null, null, null, null, null, null, null));
  monture = new MontureModel(null, null, null, null, null, null, null);

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
              private router: Router,
              private route: ActivatedRoute) {
    this.stock.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.stock.id;
    this.initForm(this.stock);

    this.listMarqueSubscription = this.marqueService.listMarqueSubject.subscribe(data => {
      this.listMarques = data;
    }, error => {
      console.log('Error ! : ' + error);
    });
    this.marqueService.getAllMarques();

    if (!this.isAddMode) {
      this.loading = true;
      this.stockService.getStockById(this.stock.id).subscribe((response) => {
        this.stock = response;
        if((this.stock.produit as MontureModel).marque!=null)
        { // @ts-ignore
          this.marque = this.stock.produit.marque;
          console.log(this.marque.nom);
          // @ts-ignore
          this.marqueControl.setValue(this.marque);
        }
        this.initForm(this.stock);
      },(error) => {
        console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

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

  initForm(stock : StockModel){
    let monture: MontureModel = stock.produit as MontureModel;
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
      qte: [stock.qte, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [stock.prixVente, Validators.compose([Validators.required, Validators.min(0)])],
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
    let editedStock = this.stock;
    let editedMonture = this.stock.produit as MontureModel;

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
    editedStock.qte = formValue['qte'];

    console.log(editedMonture);

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
    this.montureService.addMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        this.loading = false;
        this.stockService.getAllStockMonture();
        this.router.navigate(['/montures']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  private updateMonture(stock : StockModel) {
    stock.id = this.stock.id;
    this.montureService.updateMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      console.log(stock.produit);
      console.log(stock);
      this.stockService.updateStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockMonture();
        this.router.navigate(['/montures']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
