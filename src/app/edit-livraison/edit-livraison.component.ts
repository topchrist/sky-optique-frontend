import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {LivraisonModel} from "../models/livraison.model";
import {ProduitModel} from "../models/produit.model";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ProduitService} from "../services/produit.service";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {LivraisonService} from "../services/Livraison.service";
import {StockModel} from "../models/stockModel";
import {BonLivraisonModel} from "../models/bonLivraison.model";


@Component({
  selector: 'app-edit-livraison',
  templateUrl: './edit-livraison.component.html',
  styleUrls: ['./edit-livraison.component.css']
})


export class EditLivraisonComponent implements OnInit {

  isAddMode: boolean;
  livraisonForm: FormGroup;
  submitted = false;
  loading = false;
  produit: ProduitModel = null;
  bonLivraison: BonLivraisonModel = new BonLivraisonModel(null, null);
  livraison: LivraisonModel = new LivraisonModel(null, null, null);
  listAllProduit: ProduitModel[]=[];
  listProduit: ProduitModel[]=[];
  filteredOptions: Observable<ProduitModel[]>;
  produitControl = new FormControl();
  typeControl = new FormControl();
  listProduitSubscription : Subscription;

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private produitService : ProduitService,
              private  livraisonService : LivraisonService
  ) {
    this.bonLivraison.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.isAddMode = !this.livraison.id;

    if (!this.isAddMode) {
      this.loading = true;
      this.livraisonService.getLivraisonById(this.livraison.id).subscribe((response) => {
          this.livraison = response;
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

    this.typeControl.setValue("ALL");
    this.listProduitSubscription = this.produitService.listProduitSubject.subscribe(Produits => {
      //console.log(Produits);
      this.listAllProduit = Produits;
      this.listProduit = Produits;
      this.produitControl.setValue("");
    }, error => {
      console.log('Error ! : ' + error);
    });
    this.produitService.getAllProduits();

    this.livraisonForm = this.formBuilder.group({
      prixAchat: ['', Validators.compose([Validators.required, Validators.min(0)])],
      qte: ['', Validators.compose([Validators.required, Validators.min(1)])],
      prixVente: ['', Validators.compose([Validators.required, Validators.min(0)])],
    });

    this.filteredOptions = this.produitControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.libelle),
        map(libelle => libelle ? this._filter(libelle) : this.listProduit.slice())
      );

  }

  ngOnDestroy(): void {
    this.listProduitSubscription.unsubscribe();;
  }

  ngAfterViewInit() {
    this.listProduitSubscription = this.trigger.panelClosingActions
      .subscribe(e => {
          if (!e) {
            this.produit = null;
            this.produitControl.reset();
          }
        },
        e => console.log('error', e));
  }
  displayFn(produit: ProduitModel): string {
    if(produit && produit.libelle){
      return produit.libelle;
    }
    return '';
  }
  private _filter(libelle: string): ProduitModel[] {
    const filterValue = libelle.toLowerCase();
    return this.listProduit.filter(produit => produit.libelle.toLowerCase().includes(filterValue));
  }
  getProduit(event) {
    this.produit = event.option.value;
  }
  onTypeChange(event) {
    if(this.typeControl.value =="ALL"){
      this.listProduit = this.listAllProduit;
    }
    if(this.typeControl.value =="L"){
      this.listProduit = this.listAllProduit.filter(produit => produit.discriminator.toUpperCase().includes("L"));
    }
    if(this.typeControl.value =="M"){
      this.listProduit = this.listAllProduit.filter(produit => produit.discriminator.toUpperCase().includes("M"));
    }
    if(this.typeControl.value =="A"){
      this.listProduit = this.listAllProduit.filter(produit => produit.discriminator.toUpperCase().includes("A"));
    }
    this.produit = null;
    this.produitControl.reset();
  }



  get f() { return this.livraisonForm.controls; }
  onSubmitForm(){
    this.submitted = true;
    if (this.livraisonForm.invalid) {
      return;
    }

    const formValue = this.livraisonForm.value;

    let addedLivraison : LivraisonModel = new LivraisonModel(
      formValue['prixAchat'],
      formValue['qte'],
      this.produit
      //new StockModel( formValue['prixVente'], formValue['qte'], this.produit)
    );

    if (this.isAddMode) {
      this.addLivraison(addedLivraison);
    } else {
      this.updateLivraison(addedLivraison);
    }
    this.produitControl.reset();
    this.produit = null;
    this.livraisonForm.reset();
  }
  onReset() {
    this.submitted = false;
    this.livraisonForm.reset();
    this.produit = null;
  }

  private addLivraison(livraison : LivraisonModel) {
    this.livraisonService.addLivraison(livraison).subscribe(data=>{
      console.log(data);
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.livraisonForm.value, null, 4));
      this.livraisonService.getAllLivraisonByBonLivraison(this.bonLivraison.id);
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateLivraison(livraison : LivraisonModel) {
    livraison.id = this.livraison.id;
    this.livraisonService.updateLivraison(livraison, livraison.id).subscribe(data=>{
      console.log(data);
      this.livraisonService.getAllLivraisonByBonLivraison(this.bonLivraison.id);
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
