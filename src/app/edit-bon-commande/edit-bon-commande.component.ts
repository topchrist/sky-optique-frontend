import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {ProduitModel} from "../models/produit.model";
import {LivraisonModel} from "../models/livraison.model";
import {Observable, Subscription} from "rxjs";
import {FournisseurModel} from "../models/fournisseur.model";
import {BonCommandeModel} from "../models/bonCommande.model";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {ActivatedRoute, Router} from "@angular/router";
import {ProduitService} from "../services/produit.service";
import {FournisseurService} from "../services/fournisseur.service";
import {LentilleService} from "../services/lentille.service";
import {MontureService} from "../services/monture.service";
import {BonCommandeService} from "../services/BonCommande.service";
import {map, startWith} from "rxjs/operators";
import {StockModel} from "../models/stockModel";
import {CommandeModel} from "../models/commande.model";

@Component({
  selector: 'app-edit-bon-commande',
  templateUrl: './edit-bon-commande.component.html',
  styleUrls: ['./edit-bon-commande.component.css']
})
export class EditBonCommandeComponent implements OnInit {

  commandeForm: FormGroup;
  isAddMode = true;
  loading = false;
  produit: ProduitModel = null;
  bonCommande: BonCommandeModel = new BonCommandeModel(null);
  listAllProduit: ProduitModel[]=[];
  listProduit: ProduitModel[]=[];
  listCommande: CommandeModel[]=[];
  filteredOptions: Observable<ProduitModel[]>;
  produitControl = new FormControl();
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

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private produitService : ProduitService,
              private fournisseurService : FournisseurService,
              private lentilleService : LentilleService,
              private montureServiceService : MontureService,
              private  bonCommandeService : BonCommandeService) { }

  ngOnInit(): void {
    this.typeControl.setValue("ALL");
    this.listFournisseurSubscription = this.fournisseurService.listFournisseurSubject.subscribe(
      fournisseurs => {
        this.listFournisseurs = fournisseurs;
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

  private _filter(libelle: string): ProduitModel[] {
    const filterValue = libelle.toLowerCase();
    return this.listProduit.filter(produit => produit.libelle.toLowerCase().includes(filterValue));
  }
  private _filterFournisseur(nom: string): FournisseurModel[] {
    const filterValue = nom.toLowerCase();
    return this.listFournisseurs.filter(fournisseur => fournisseur.nom.toLowerCase().includes(filterValue));
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

  initForm() {
    //let livraison : LivraisonModel = new LivraisonModel(null, null, []);
    this.commandeForm = this.formBuilder.group({
      qte: ['', Validators.compose([Validators.required, Validators.min(1)])],
    });
  }

  onSubmitForm(value: any){
    const formValue = this.commandeForm.value;
    let addedcommande : CommandeModel = new CommandeModel(
      formValue['qte'], this.produit
    );
    console.log(addedcommande);
    this.listCommande.push(addedcommande);
    this.produitControl.setValue('');
    this.produit = null;
    this.commandeForm.reset();
  }

  getProduit(event) {
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
    if (this.commandeForm.get(controlName).hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    else if (this.commandeForm.get(controlName).hasError('min')) {
      return controlName == 'qte' ? 'la valeur doit être superieur ou égale à 1' : 'la valeur doit être superieur ou égale à 0';
    }

    //return this.livraisonForm.hasError('email') ? 'Not a valid email' : '';
  }

  removeProduit(i: any) {
    this.listCommande.splice(i, 1);
  }

  onSubmit(form: NgForm) {
    this.bonCommande.fournisseur = this.fournisseur;
    this.bonCommande.commandes = this.listCommande;
    console.log(this.bonCommande);
    //this.loading = true;
    if (this.isAddMode) {
      this.addBonCommande();
    } else {
      this.updateBonCommande();
    }
  }

  private addBonCommande() {
    console.log(this.bonCommande);
    this.bonCommandeService.addBonCommande(this.bonCommande).subscribe(
      data =>{
        console.log(data);
        this.bonCommandeService.getAllBonCommande();
        //this.router.navigate(['/bonLivraisons']);
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    )
  }

  private updateBonCommande() {

  }

}
