import {Component, OnInit, ViewChild} from '@angular/core';
import {PersonneModel} from "../models/personne.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureService} from "../services/facture.service";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {PersonneService} from "../services/personne.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {FactureClientService} from "../services/factureClient.service";
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {PrescriptionModel} from "../models/prescription.model";
import {VenteModel} from "../models/vente.model";
import {FactureModel} from "../models/facture.model";
import {FactureClientModel} from "../models/factureClient.model";
import {CouvertureModel} from "../models/couverture.model";
import {PrescripteurService} from "../services/prescripteur.service";
import {PrescripteurModel} from "../models/prescripteur.model";
import {ProformaService} from "../services/proforma.service";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";
import {MontureService} from "../services/monture.service";
import {LentilleService} from "../services/lentille.service";
import {AddMontureDialogComponent} from "../add-monture-dialog/add-monture-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddLentilleDialogComponent} from "../add-lentille-dialog/add-lentille-dialog.component";
import {AddPatientDialogComponent} from "../add-patient-dialog/add-patient-dialog.component";
import {NgxSpinnerService} from "ngx-spinner";
import {PatientService} from "../services/patient.service";
import {EditPatientDialogComponent} from "../edit-patient-dialog/edit-patient-dialog.component";
import {PatientModel} from "../models/patient.model";
import {EditPrescripteurDialogComponent} from "../edit-prescripteur-dialog/edit-prescripteur-dialog.component";
import {EditMontureDialogComponent} from "../edit-monture-dialog/edit-monture-dialog.component";
import {EditLentilleDialogComponent} from "../edit-lentille-dialog/edit-lentille-dialog.component";
import {ProformaModel} from "../models/Proforma.model";

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css']
})
export class AddFactureComponent implements OnInit {

  factureForm: FormGroup;
  submitted = false;

  patient : PersonneModel = null;
  filteredPatients : Observable<PersonneModel[]>;
  listPatients : PersonneModel[]=[];
  patientTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient', { read: MatAutocompleteTrigger }) triggerPatient: MatAutocompleteTrigger;

  prescripteur : PersonneModel = null;
  filteredPrescripteurs : Observable<PersonneModel[]>;

  couverturePatient = new CouvertureModel(null, null, null, null, null, null, null, );
  listPrescripteurs : PersonneModel[]=[];
  prescripteurTriggerSubscription : Subscription;
  @ViewChild('autoCompletePrescripteur', { read: MatAutocompleteTrigger }) triggerPrescripteur: MatAutocompleteTrigger;

  assurePrincipal : PersonneModel = null;
  listAssurePrincipal : PersonneModel[] = [];
  filteredAssurePrincipals : Observable<PersonneModel[]>;
  assurePrincipalTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient2', { read: MatAutocompleteTrigger }) triggerAssurePrincipal: MatAutocompleteTrigger;

  entreprise : CompagniModel;
  listEntreprises : CompagniModel[]=[];
  filteredEntreprises : Observable<CompagniModel[]>;
  entrepriseTriggerSubscription : Subscription;
  @ViewChild('autoCompleteEntreprise', { read: MatAutocompleteTrigger }) triggerEntreprise: MatAutocompleteTrigger;

  assurance : CompagniModel;
  listAssurances : CompagniModel[]=[];
  filteredAssurances : Observable<CompagniModel[]>;
  assuranceTriggerSubscription : Subscription;
  @ViewChild('autoCompleteAssurance', { read: MatAutocompleteTrigger }) triggerAssurance: MatAutocompleteTrigger;

  listStocks : StockModel[]=[];
  listStocksSubscription : Subscription;

  monture : StockModel ;
  montureControl = new FormControl();
  filteredMontures : Observable<StockModel[]>;
  listMontures : StockModel[]=[];
  montureTriggerSubscription : Subscription;
  @ViewChild('autoCompleteMonture', { read: MatAutocompleteTrigger }) triggerMonture: MatAutocompleteTrigger;

  lentilleG : StockModel;
  lentilleGProd : LentilleModel;
  lentilleD : StockModel;
  lentilleDProd : LentilleModel;
  lentilleGControl = new FormControl();
  lentilleDControl = new FormControl();

  aPayer : number =0;

  id : number;
  proforma : ProformaModel = null;

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private factureService : FactureService,
              private compagniService : CompagniService,
              private personneService : PersonneService,
              private patientService : PatientService,
              private prescripteurService : PrescripteurService,
              private factureClientService : FactureClientService,
              private proformaService : ProformaService,
              private stockService : StockService,
              private lentilleService : LentilleService,
              public dialog: MatDialog,
              ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {

    this.initForm();
    this.onAddCouverture();
    this.onAddPrescription();
    this.loadData();

  }

  loadData(){
    this.spinnerService.show();

    this.personneService.getAllPersonnes().subscribe(data1 => {
      let list : PersonneModel[] = data1;
      console.log(data1);
      this.listPatients = list.filter(x => x.discriminator == "CLIENT");
      this.listAssurePrincipal = list.filter(x => x.discriminator != "PRESCRIPTEUR");
      this.listPrescripteurs = list.filter(x => x.discriminator == "PRESCRIPTEUR");
      this.compagniService.getAllCompagnis().subscribe(data2 => {
        this.listEntreprises = data2;
        console.log(data2);
        this.listAssurances = this.listEntreprises.filter(entr => entr.type == "assurance");
        this.stockService.getAllStockMonture().subscribe(data4 => {
          this.listMontures = data4;
          this.spinnerService.hide();
          if (this.id) {
            this.loadEditedFacture();
          }
        }, error => {
          this.spinnerService.hide();
          console.log('Error ! : ' + error);
        });
      }, error => {
        this.spinnerService.hide();
        console.log('Error ! : ' + error);
      });
    }, error => {
      this.spinnerService.hide();
      console.log('Error ! : ' + error);
    });

    this.filteredPatients = this.factureForm.get('nomPatient').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterPatient(nom) : this.listPatients.slice())
    );
    this.filteredPrescripteurs = this.prescription.at(0).get('nomPrescripteur').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterPrescripteur(nom) : this.listPrescripteurs.slice())
    );

    this.filteredAssurePrincipals = this.couverture.at(0).get('nomAssurePrincipal').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterAssurePrincipal(nom) : this.listAssurePrincipal.slice())
    );


    /*this.filteredEntreprises = this.couverture.at(0).get('entrepriseAssurePrincipal').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
    );*/
    this.filteredAssurances = this.couverture.at(0).get('assurance').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterAssurance(nom) : this.listAssurances.slice())
    );
    this.filteredMontures = this.montureControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.libelle),
        map(libelle => libelle ? this._filterMonture(libelle) : this.listMontures.slice())
    );

  }
  loadPersonne(){
    this.personneService.getAllPersonnes().subscribe(data1 => {
      let list : PersonneModel[] = data1;
      this.listPatients = list.filter(x => x.discriminator == "CLIENT");
      this.listAssurePrincipal = list.filter(x => x.discriminator != "PRESCRIPTEUR");
      this.listPrescripteurs = list.filter(x => x.discriminator == "PRESCRIPTEUR");
    }, error => {
      this.spinnerService.hide();
      console.log('Error ! : ' + error);
    });
  }
  loadEditedFacture(){
    this.spinnerService.show();
    this.proformaService.getProformaById(this.id).subscribe((response) => {
      this.proforma = response;
      this.spinnerService.hide();
      this.patient = this.proforma.patient;
      this.factureForm.get('nomPatient').setValue(this.patient);
      if(this.proforma.prescription){
        this.prescripteur = this.proforma.prescription.prescripteur;
        this.prescription.at(0).get('nomPrescripteur').setValue(this.prescripteur);
        this.prescription.at(0).get('datePrescription').setValue(this.proforma.prescription.datePrescription);
        this.prescription.at(0).get('dateLimite').setValue(this.proforma.prescription.deadline);
        this.prescription.at(0).get('eyeVision').setValue(this.proforma.prescription.eyeVision);
        this.prescription.at(0).get('port').setValue(this.proforma.prescription.port);
      }
      if(this.proforma.couvertures && this.proforma.couvertures.length > 0){
        this.assurePrincipal = this.proforma.couvertures[0].assurePrincipal;
        this.couverture.at(0).get('nomAssurePrincipal').setValue(this.assurePrincipal);
        this.couverture.at(0).get('numeroDocument').setValue(this.proforma.couvertures[0].numeroDocument);
        this.couverture.at(0).get('dateDocument').setValue(this.proforma.couvertures[0].dateDocument);
        this.couverture.at(0).get('relation').setValue(this.proforma.couvertures[0].relation);
        this.couverture.at(0).get('couvertureMonture').setValue(this.proforma.couvertures[0].couvertureMonture);
        this.couverture.at(0).get('couvertureVerre').setValue(this.proforma.couvertures[0].couvertureVerre);
        this.assurance = this.proforma.couvertures[0].assurance;
        this.couverture.at(0).get('assurance').setValue(this.assurance);
      }
      this.proforma.ventes.forEach(x =>{
        if(x.libelle == 'monture'){
          this.monture = x.stock;
          this.montureControl.setValue(this.monture);
        }
        else if(x.libelle == "lentilleD"){
          this.lentilleD = x.stock;
          this.lentilleDControl.setValue(this.lentilleD);
        }
        else if(x.libelle == "lentilleG"){
          this.lentilleG = x.stock;
          this.lentilleDControl.setValue(this.lentilleG);
        }
      });
      this.onCalculValeurs();
      console.log(this.proforma);
    },(error) => {
      console.log('Erreur ! : ' + error);
      this.spinnerService.hide();
    });
  }

  ngOnDestroy(): void {
    this.patientTriggerSubscription.unsubscribe();
    this.assurePrincipalTriggerSubscription.unsubscribe();
    this.prescripteurTriggerSubscription.unsubscribe();
    this.montureTriggerSubscription.unsubscribe();
    this.assuranceTriggerSubscription.unsubscribe();
    //this.entrepriseTriggerSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.patientTriggerSubscription = this.triggerPatient.panelClosingActions.subscribe(e => {
      if (!e) {
        this.patient = null;
        this.factureForm.get('nomPatient').setValue(this.patient);
      }
    },e => console.log('error', e));
    this.prescripteurTriggerSubscription = this.triggerPrescripteur.panelClosingActions.subscribe(e => {
      if (!e) {
        this.prescripteur = null;
        this.prescription.at(0).get('nomPrescripteur').setValue(this.prescripteur);
      }
    },e => console.log('error', e));

    this.assurePrincipalTriggerSubscription = this.triggerAssurePrincipal.panelClosingActions.subscribe(e => {
      if (!e) {
        this.assurePrincipal = null;
        if(this.couverture.length == 1){
          this.couverture.at(0).get('nomAssurePrincipal').setValue(this.assurePrincipal);
        }
      }
    },e => console.log('error', e));

    /* this.entrepriseTriggerSubscription = this.triggerEntreprise.panelClosingActions.subscribe(e => {
       if (!e) {
         if(this.entreprise != null){
           this.entreprise = null;
         }
       }
     },e => console.log('error', e));*/

    this.assuranceTriggerSubscription = this.triggerAssurance.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.assurance != null){
          this.assurance = null;
        }
      }
    },e => console.log('error', e));

    this.montureTriggerSubscription = this.triggerMonture.panelClosingActions.subscribe(e => {
      if (!e) {
        this.monture = null;
        this.montureControl.setValue(new MontureModel(null,null,null,null, null, null));
        this.factureForm.get('qteMonture').reset(1);
        this.factureForm.get('remiseMonture').reset(0);
        this.onCalculValeurs();
      }
    },e => console.log('error', e));
  }

  private _filterPatient(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    return this.listPatients.filter(option => {
      if(option.prenom == null)
        return option.nom.toLowerCase().includes(filterValue.trim())
      else
        return (option.nom.toLowerCase()+' '+option.prenom.toLowerCase()).includes(filterValue.trim())
    });
  }
  displayPatient(patient: PersonneModel): string {
    let val='';
    if(patient){
      if(patient.nom != null)
        val = val+patient.nom+' ';
      if(patient.prenom != null)
        val = val+patient.prenom;
    }
    return val.trim();
  }
  getPatient(event) {
    if((this.patient!=null && this.assurePrincipal!=null && this.patient.id == this.assurePrincipal.id) || this.assurePrincipal == null){
      this.patient = event.option.value;
      this.assurePrincipal = this.patient;
      if(this.couverture && this.couverture.length > 0)
        this.couverture.at(0).get('nomAssurePrincipal').setValue(this.assurePrincipal);
    }
    else
      this.patient = event.option.value;
  }
  openPatientDialog() {
    let dialogRef : MatDialogRef<any> ;
    if(this.patient != null)
      dialogRef = this.dialog.open(EditPatientDialogComponent, {width: '600px', data: { patientToUpdate: this.patient, type:"patient" }});
    else
      dialogRef = this.dialog.open(EditPatientDialogComponent, {width: '600px', data: { patientToUpdate: null, type:"patient" }});
    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        if(this.assurePrincipal == null || this.patient.id == this.assurePrincipal.id){
          this.patient = result as PatientModel;
          this.factureForm.get('nomPatient').setValue(this.patient);
          this.assurePrincipal = this.patient;
          if(this.couverture && this.couverture.length > 0)
            this.couverture.at(0).get('nomAssurePrincipal').setValue(this.assurePrincipal);
        }
        else{
          this.patient = result as PatientModel;
          this.factureForm.get('nomPatient').setValue(this.patient);
        }
        this.loadPersonne();
      }
    });
  }
  onRemoveSelectedPatient(){
    this.patient = null;
    this.factureForm.get('nomPatient').reset();
  }

  private _filterPrescripteur(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    let val='';
    return this.listPrescripteurs.filter(option => {
      let val='';
      if(option.nom != null)
        val = val+option.nom+' ';
      if(option.prenom != null)
        val = val+option.prenom;
      return val.toLowerCase().includes(filterValue.trim())
    });
  }
  displayPrescripteur(prescripteur: PersonneModel): string {
    let val='';
    if(prescripteur){
      if(prescripteur.nom != null)
        val = val+prescripteur.nom+' ';
      if(prescripteur.prenom != null)
        val = val+prescripteur.prenom;
    }
    return val.trim();
  }
  getPrescripteur(event) {
    this.prescripteur = event.option.value;
  }
  openPrescripteurDialog() {
    let dialogRef : MatDialogRef<any> ;
    if(this.prescripteur != null)
      dialogRef = this.dialog.open(EditPrescripteurDialogComponent, {width: '600px', data: { prescripteurToUpdate: this.prescripteur }});
    else
      dialogRef = this.dialog.open(EditPrescripteurDialogComponent, {width: '600px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        this.prescripteur = result as PrescripteurModel;
        this.prescription.at(0).get('nomPrescripteur').setValue(this.prescripteur);
        this.prescripteurService.getAllPrescripteurs().subscribe(
            (data: PrescripteurModel[]) => {
              this.listPrescripteurs = data;
            }, error => {
              console.log("error : "+error);
            });
      }
    });
  }

  private _filterAssurePrincipal(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    return this.listAssurePrincipal.filter(option => {
      if(option.prenom == null)
        return option.nom.toLowerCase().includes(filterValue.trim())
      else
        return (option.nom.toLowerCase()+' '+option.prenom.toLowerCase()).includes(filterValue.trim())
    });
  }
  getAssurePrincipal(event) {
    this.assurePrincipal = event.option.value;
  }
  openAssurePrincipalDialog() {
    let dialogRef : MatDialogRef<any> ;
    if(this.assurePrincipal != null)
      dialogRef = this.dialog.open(EditPatientDialogComponent, {width: '600px', data: { patientToUpdate: this.assurePrincipal, type:"assurePrincipal" }});
    else
      dialogRef = this.dialog.open(EditPatientDialogComponent, {width: '600px', data: { patientToUpdate: null, type:"assurePrincipal" }});
    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        this.assurePrincipal = result as PersonneModel;
        this.couverture.at(0).get('nomAssurePrincipal').setValue(this.assurePrincipal);
        this.loadPersonne();;
      }
    });
  }
  onRemoveSelectedAssurePrincipal(){
    this.assurePrincipal = null;
    this.couverture.at(0).get('nomAssurePrincipal').reset();
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
    this.entreprise = event.option.value;
  }
  getAssurance(event) {
    this.assurance = event.option.value;
  }

  displayProduit(stock: StockModel): string {
    if(stock && stock.produit){
      return stock.produit.libelle;
    }
    return '';
  }
  private _filterMonture(value: string): StockModel[] {
    const filterValue = value.toLowerCase();
    return this.listMontures.filter(option => option.produit.libelle.toLowerCase().includes(filterValue.trim()));
  }
  getMonture(event) {
    this.monture = event.option.value;
    this.onCalculValeurs();
  }

  initForm(){
    this.factureForm = this.formBuilder.group({
      nomPatient: [null, Validators.compose([Validators.required])],

      prescription: this.formBuilder.array([]),
      couverture: this.formBuilder.array([]),

      qteMonture: [1, Validators.compose([Validators.required, Validators.min(1)])],
      qteLentilleG: [1, Validators.compose([Validators.required, Validators.min(1)])],
      qteLentilleD: [1, Validators.compose([Validators.required, Validators.min(1)])],
      remiseMonture:[0, Validators.compose([Validators.min(0)])],
      remiseLentilleG: 0,
      remiseLentilleD: 0,
      montantMonture: 0,
      montantLentilleG: 0,
      montantLentilleD: 0,
      totalMonture: 0,
      totalLentilleG: new FormControl(),
      totalLentilleD : new FormControl(),

      priseEnCharge : 0,
      franchise : 0,

    });
    //this.onDisablePatientForm();
  }
  get f() { return this.factureForm.controls; }

  get prescription(): FormArray {
    return this.factureForm.get('prescription') as FormArray;
  }
  onAddPrescription(){
    this.prescription.push(this.formBuilder.group({
      nomPrescripteur: ['', Validators.compose([Validators.required])],
      //prenomPrescripteur: new FormControl(),
      datePrescription: new FormControl(),
      dateLimite: new FormControl(),
      eyeVision: new FormControl(),
      port: new FormControl()
    }));
  }
  onDeletePrescription(index: number){
    this.prescription.removeAt(index);
    this.prescripteur = null;
  }

  get couverture(): FormArray {
    return this.f.couverture as FormArray;
  }
  onAddCouverture(){
    this.couverture.push(this.formBuilder.group({
      civiliteAssurePrincipal: new FormControl(),
      nomAssurePrincipal: [this.assurePrincipal, Validators.compose([Validators.required])],
      prenomAssurePrincipal: new FormControl(),
      dateNaissAssurePrincipal: new FormControl(),
      emailAssurePrincipal: [null, Validators.compose([Validators.email])],
      adresseAssurePrincipal: new FormControl(),
      tel1AssurePrincipal: new FormControl(),
      //entrepriseAssurePrincipal : ['', Validators.compose([Validators.required])],

      assurance : ['', Validators.compose([Validators.required])],
      couvertureVerre : [100, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      couvertureMonture : [100, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      numeroDocument : '',
      dateDocument : '',
      relation : ''
    }));
    this.onCalculValeurs();
  }
  onDeleteCouverture(index: number){
    this.couverture.removeAt(index);
    this.assurePrincipal = null;
    this.onCalculValeurs();
  }

  onCalculValeurs(){
    console.log("onCalculValeurs()")

    if(this.monture != null) {
      this.f.montantMonture.setValue(this.monture.prixVente * (1 - this.f.remiseMonture.value/100));
      this.f.totalMonture.setValue(this.monture.prixVente * (1 - this.f.remiseMonture.value/100) * this.f.qteMonture.value);

    }
    else{
      this.f.montantMonture.setValue(0);
      this.f.totalMonture.setValue(0);
    }

    if(this.lentilleG != null) {
      this.f.montantLentilleG.setValue(this.lentilleG.prixVente * (1 - this.f.remiseLentilleG.value/100));
      this.f.totalLentilleG.setValue(this.lentilleG.prixVente * (1 - this.f.remiseLentilleG.value/100) * this.f.qteLentilleG.value);
    }
    else{
      this.f.montantLentilleG.setValue(0);
      this.f.totalLentilleG.setValue(0);
    }

    if(this.lentilleD != null) {
      this.f.montantLentilleD.setValue(this.lentilleD.prixVente * (1 - this.f.remiseLentilleD.value/100));
      this.f.totalLentilleD.setValue(this.lentilleD.prixVente * (1 - this.f.remiseLentilleD.value/100) * this.f.qteLentilleD.value);
    }
    else{
      this.f.montantLentilleD.setValue(0);
      this.f.totalLentilleD.setValue(0);
    }

    if(this.couverture.length ==1){
      this.f.priseEnCharge.setValue(this.f.totalMonture.value * this.couverture.at(0).get('couvertureMonture').value/100 + this.f.totalLentilleG.value * this.couverture.at(0).get('couvertureVerre').value/100 + this.f.totalLentilleD.value*this.couverture.at(0).get('couvertureVerre').value/100);
      this.f.franchise.setValue((this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value;
    }
    else {
      this.f.priseEnCharge.setValue(0);
      this.f.franchise.setValue(0);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value);
    }


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

  openMontureDialog() {
    let dialogRef : MatDialogRef<any> ;
    if(this.monture != null)
      dialogRef = this.dialog.open(EditMontureDialogComponent, {width: '600px', data: { montureToUpdate: this.monture }});
    else
      dialogRef = this.dialog.open(EditMontureDialogComponent, {width: '600px', data: { montureToUpdate: null }});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        this.monture = result as StockModel;
        this.montureControl.setValue(this.monture);
        this.stockService.getAllStockMonture().subscribe(
            (data: StockModel[]) => {
              this.listMontures = data;
            }, error => {
              console.log("error : "+error);
            });
      }
      this.onCalculValeurs();
    });
  }
  onDeleteMonture() {
    this.monture = null;
    this.montureControl.setValue(new MontureModel(null,null,null,null, null, null));
    this.factureForm.get('qteMonture').reset(1);
    this.factureForm.get('remiseMonture').reset(0);
    this.onCalculValeurs();
  }

  openLentilleDDialog() {
    let dialogRef : MatDialogRef<any> ;
    if(this.lentilleD != null)
      dialogRef = this.dialog.open(EditLentilleDialogComponent, {width: '600px', data: { lentilleToUpdate: this.lentilleD }});
    else
      dialogRef = this.dialog.open(EditLentilleDialogComponent, {width: '600px', data: { lentilleToUpdate: null }});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        this.lentilleD = result as StockModel;
        this.lentilleDProd = this.lentilleD.produit as LentilleModel;
        this.lentilleDControl.setValue(this.lentilleD.produit.libelle);
      }
      this.onCalculValeurs();
    });
  }
  onDeleteLentilleD() {
    this.spinnerService.show();
    this.lentilleService.deleteLentille(this.lentilleD.id).subscribe( data =>{
      this.spinnerService.hide();
    }, error => {
      console.log("error : "+error);
      this.spinnerService.hide();
    });
    this.lentilleD = null;
    this.lentilleDProd = null;
    this.lentilleDControl = null;
  }

  openLentilleGDialog() {
    console.log(this.lentilleG);
    let dialogRef : MatDialogRef<any> ;
    if(this.lentilleG != null)
      dialogRef = this.dialog.open(EditLentilleDialogComponent, {width: '600px', data: { lentilleToUpdate: this.lentilleG }});
    else
      dialogRef = this.dialog.open(EditLentilleDialogComponent, {width: '600px', data: { lentilleToUpdate: null }});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null || result != undefined){
        this.lentilleG = result as StockModel;
        this.lentilleGProd = this.lentilleG.produit as LentilleModel;
        this.lentilleGControl.setValue(this.lentilleG.produit.libelle);
      }
      this.onCalculValeurs();
    });
  }
  onDeleteLentilleG() {
    this.spinnerService.show();
    this.lentilleService.deleteLentille(this.lentilleG.id).subscribe( data =>{
      this.spinnerService.hide();
    }, error => {
      console.log("error : "+error);
      this.spinnerService.hide();
    });
    this.lentilleG = null;
    this.lentilleGProd = null;
    this.lentilleGControl = null;
  }

  onReset() {
    this.submitted = false;
    this.factureForm.reset();
    this.patient = null;
  }
  onSubmitForm() {
    console.log("onSubmitForm");
    this.submitted = true;
    if (this.factureForm.invalid) {
      console.log("factureForm.invalid");
      return;
    }

    const formValue = this.factureForm.value;

    let isVente = false;
    if(this.monture && formValue['qteMonture'] >= 1){
      isVente = true;
    }
    if(this.lentilleD && formValue['qteLentilleD'] >= 1){
      isVente = true;
    }
    if(this.lentilleG && formValue['qteLentilleG'] >= 1){
      isVente = true;
    }
    if(isVente == false){
      alert("Veillez selectionner au moin un produit");
      return;
    }

    let editedFacture = new FactureClientModel();
    if(this.patient){
      editedFacture.patient = this.patient;
    }
    else {
      alert("Veillez éditer le patient");
      return;
    }

    if(this.prescription.length == 1){
      let editedPrescription = new PrescriptionModel(null, null, null, null);
      editedPrescription.datePrescription = this.prescription.at(0).get('datePrescription').value;
      editedPrescription.deadline = this.prescription.at(0).get('dateLimite').value;
      editedPrescription.eyeVision = this.prescription.at(0).get('eyeVision').value;
      editedPrescription.port = this.prescription.at(0).get('port').value;
      if(this.prescripteur){
        editedPrescription.prescripteur = this.prescripteur;
      }
      else {
        alert("Veillez éditer un prescripteur");
        return;
      }
      editedFacture.prescription = editedPrescription;
    }

    let editedVente : VenteModel[]=[];
    if(this.monture && formValue['qteMonture'] >= 1){
      /*if(formValue['qteMonture'] > this.monture.qte){
        alert("La quantité de monture "+this.monture.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }*/
      let vente1 = new VenteModel(this.monture.prixVente, formValue['qteMonture'], formValue['montantMonture'], formValue['remiseMonture'], formValue['totalMonture']);
      vente1.stock = this.monture;
      vente1.libelle = "monture";
      editedVente.push(vente1);
    }
    if(this.lentilleD && formValue['qteLentilleD'] >= 1){
      /*if(formValue['qteLentilleD'] > this.lentilleD.qte){
        alert("La quantité de lentille "+this.lentilleD.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }*/
      let vente2 = new VenteModel(this.lentilleD.prixVente, formValue['qteLentilleD'], formValue['montantLentilleD'], formValue['remiseLentilleD'], formValue['totalLentilleD']);
      vente2.stock = this.lentilleD;
      vente2.libelle = "lentilleD";
      editedVente.push(vente2);
    }
    if(this.lentilleG && formValue['qteLentilleG'] >= 1){
      /*if(formValue['qteLentilleG'] > this.lentilleG.qte){
        alert("La quantité de lentille "+this.lentilleG.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }*/
      let vente3 = new VenteModel(this.lentilleG.prixVente, formValue['qteLentilleG'], formValue['montantLentilleG'], formValue['remiseLentilleG'], formValue['totalLentilleG']);
      vente3.stock = this.lentilleG;
      vente3.libelle = "lentilleG";
      editedVente.push(vente3);
    }
    if(editedVente.length < 1){
      alert("Veillez selectionner au moin un produit");
      return;
    }
    editedFacture.ventes = editedVente;

    if(this.couverture.length == 1){
      const formValue2 = this.couverture.at(0).value;
      let editedCouverture : CouvertureModel[]=[];
      let editCouverture = new CouvertureModel(null, null, null, null, null, null)

      if(this.assurePrincipal){
        editCouverture.assurePrincipal = this.assurePrincipal;
      }
      else {
        alert("Veillez éditer l'assuré principal");
        return;
      }
      editCouverture.couvertureVerre = formValue2['couvertureVerre'];
      editCouverture.couvertureMonture = formValue2['couvertureMonture'];
      editCouverture.dateDocument = formValue2['dateDocument'];
      editCouverture.numeroDocument = formValue2['numeroDocument'];
      editCouverture.priseEnCharge = formValue['priseEnCharge'];
      editCouverture.franchise = formValue['franchise'];
      editCouverture.relation = formValue2['relation'];
      editCouverture.entreprise = this.assurePrincipal.entreprise;

      if(this.assurance){
        editCouverture.assurance = this.assurance;
      }
      else {
        let editedAssurance = new CompagniModel();
        editedAssurance.nom = formValue2['assurance'] ? (<string> formValue2['assurance']).trim() : formValue2['assurance'];
        editedAssurance.type = 'assurance';
        editCouverture.assurance = editedAssurance;
      }

      editedCouverture.push(editCouverture);
      editedFacture.couvertures = editedCouverture;
    }

    this.addFactureClient(editedFacture);
  }

  private addFactureClient(facture : FactureModel) {
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

}


