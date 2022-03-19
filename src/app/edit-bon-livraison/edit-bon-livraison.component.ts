import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule, NgForm, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {LivraisonModel} from "../models/livraison.model";
import {ProduitModel} from "../models/produit.model";
import {LentilleService} from "../services/lentille.service";
import {MontureService} from "../services/monture.service";
import {Observable, Subject, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ProduitService} from "../services/produit.service";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {BonLivraisonService} from "../services/BonLivraison.service";
import {FournisseurModel} from "../models/fournisseur.model";
import {FournisseurService} from "../services/fournisseur.service";
import {StockModel} from "../models/stockModel";

@Component({
  selector: 'app-edit-bon-livraison',
  templateUrl: './edit-bon-livraison.component.html',
  styleUrls: ['./edit-bon-livraison.component.css']
})
export class EditBonLivraisonComponent implements OnInit {

  livraisonForm: FormGroup;
  isAddMode = true;
  loading = false;
  produit: ProduitModel = null;
  bonLivraison: BonLivraisonModel = new BonLivraisonModel(null, null);
  listAllProduit: ProduitModel[]=[];
  listProduit: ProduitModel[]=[];
  listLivraison: LivraisonModel[]=[];
  filteredOptions: Observable<ProduitModel[]>;
  produitControl = new FormControl('',[Validators.required]);
  typeControl = new FormControl();

  fournisseur : FournisseurModel = null;
  fournisseurControl = new FormControl();
  filteredFournisseurs : Observable<FournisseurModel[]>;
  listFournisseurs : FournisseurModel[]=[];

  listProduitSubscription : Subscription;
  listFournisseurSubscription : Subscription;

  subscription: any;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;
  @ViewChild('auto') auto1: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private produitService : ProduitService,
              private fournisseurService : FournisseurService,
              private lentilleService : LentilleService,
              private montureServiceService : MontureService,
              private  bonLivraisonService : BonLivraisonService) { }

  ngOnInit() {
    this.typeControl.setValue("ALL");
    this.listFournisseurSubscription = this.fournisseurService.listFournisseurSubject.subscribe(
      data => {
        this.listFournisseurs = data;
        this.fournisseurControl.setValue(new FournisseurModel(null,null,null,null, null, null));
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.listProduitSubscription = this.produitService.listProduitSubject.subscribe(Produits => {
        this.listAllProduit = Produits;
        this.listProduit = Produits;
      }, error => {
        console.log('Error ! : ' + error);
      });
    this.produitService.getAllProduits();
    this.fournisseurService.getAllFournisseurs();
    this.initForm();
    this.filteredOptions = this.produitControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.libelle),
        map(libelle => libelle ? this._filter(libelle) : this.listProduit.slice())
      );
    this.filteredFournisseurs = this.fournisseurControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nom),
        map(nom => nom ? this._filterFournisseur(nom) : this.listFournisseurs.slice())
      );
  }

  ngOnDestroy(): void {
    this.listProduitSubscription.unsubscribe();;
    this.listFournisseurSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
          if (!e) {
            this.produit = null;
          }
        },
        e => console.log('error', e));

    this.listFournisseurSubscription = this.trigger2.panelClosingActions
      .subscribe(e => {
          if (!e) {
            this.fournisseur = null;
            this.fournisseurControl.setValue(new FournisseurModel(null,null,null,null, null, null));
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
  displayFournisseur(fournisseur: FournisseurModel): string {
    if(fournisseur && fournisseur.nom){
      return fournisseur.nom;
    }
    return '';
  }

  private _filter(libelle: string): ProduitModel[] {
    const filterValue = libelle.toLowerCase();
    return this.listProduit.filter(produit => produit.libelle.toLowerCase().includes(filterValue));
  }
  private _filterFournisseur(nom: string): FournisseurModel[] {
    const filterValue = nom.toLowerCase();
    return this.listFournisseurs.filter(fournisseur => fournisseur.nom.toLowerCase().includes(filterValue));
  }

  initForm() {
    //let livraison : LivraisonModel = new LivraisonModel(null, null, []);
    this.livraisonForm = this.formBuilder.group({
      prixAchat: ['', Validators.compose([Validators.required, Validators.min(0)])],
      qte: ['', Validators.compose([Validators.required, Validators.min(1)])],
    });
  }

  onSubmitForm(value: any){
    const formValue = this.livraisonForm.value;
    let addedLivraison : LivraisonModel = new LivraisonModel(
      formValue['prixAchat'],
      formValue['qte'],
      this.produit
      //new StockModel(formValue['prixVente'], formValue['qte'], this.produit)
    );
    this.listLivraison.push(addedLivraison);
    this.produitControl.setValue("");
    this.produit = null;
    this.livraisonForm.reset();
  }

  getPosts(event) {
    this.produit = event.option.value;
  }
  getFournisseur(event) {
    this.fournisseur = event.option.value;
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
    this.produitControl.setValue("");
  }

  getErrorMessage(controlName: string) {
    if (this.livraisonForm.get(controlName).hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    else if (this.livraisonForm.get(controlName).hasError('min')) {
      return controlName == 'qte' ? 'la valeur doit être superieur ou égale à 1' : 'la valeur doit être superieur ou égale à 0';
    }

    //return this.livraisonForm.hasError('email') ? 'Not a valid email' : '';
  }

  removeProduit(i: any) {
    this.listLivraison.splice(i, 1);
  }

  onSubmit(form: NgForm) {
    this.bonLivraison.dateLivraison = <string> form.value['dateLivraison'];
    this.bonLivraison.reference = <string> form.value['reference'];
    this.bonLivraison.fournisseur = this.fournisseur;
    this.bonLivraison.livraisons = this.listLivraison;
    /*this.bonLivraison.livraisons.forEach(livr => {
      livr.lot.ref_lot = this.bonLivraison.reference+'-'+this.bonLivraison.dateLivraison;
    });*/
    console.log(this.bonLivraison);
    //this.loading = true;
    if (this.isAddMode) {
      this.addBonLivraison();
    } else {
      this.updateBonLivraison();
    }
  }

  private addBonLivraison() {
    console.log(this.bonLivraison);
    this.bonLivraisonService.addBonLivraison(this.bonLivraison).subscribe(
      data =>{
        console.log(data);
        //this.bonLivraisonService.getAllBonLivraison();
        //this.router.navigate(['/bonLivraisons']);
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    )
  }

  private updateBonLivraison() {

  }


}
