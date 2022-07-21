import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PersonneModel} from "../models/personne.model";
import {CompagniModel} from "../models/compagni.model";
import {Observable, Subscription} from "rxjs";
import {PatientModel} from "../models/patient.model";
import {PersonneService} from "../services/personne.service";
import {CompagniService} from "../services/compagni.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddMontureDialogComponent} from "../add-monture-dialog/add-monture-dialog.component";
import {StockModel} from "../models/stockModel";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MontureModel} from "../models/monture.model";
import {map, startWith} from "rxjs/operators";
import {MarqueModel} from "../models/marque.model";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  isAddMode: boolean;
  patientForm: FormGroup;
  submitted = false;
  patient = new PatientModel(null,  );

  entreprise : CompagniModel;
  listEntreprises : CompagniModel[]=[];
  filteredEntreprises : Observable<CompagniModel[]>;
  entrepriseTriggerSubscription : Subscription;
  @ViewChild('autoCompleteEntreprise', { read: MatAutocompleteTrigger }) triggerEntreprise: MatAutocompleteTrigger;

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private patientService : PatientService,
              private compagniService : CompagniService,
              private router: Router,
              private route: ActivatedRoute) {
    this.patient.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.isAddMode = !this.patient.id;
    this.initForm(this.patient);

    this.compagniService.getAllCompagnis().subscribe(data => {
      this.listEntreprises = data;

      console.log(data);
      if (!this.isAddMode) {
            this.patientService.getPatientById(this.patient.id).subscribe((response) => {
              this.patient = response;
              if(this.patient.entreprise != null){
                this.entreprise = this.patient.entreprise;
              }
              this.spinnerService.hide();
              this.initForm(this.patient);
              this.f.entreprise.setValue(this.patient.entreprise);

              this.filteredEntreprises = this.f.entreprise.valueChanges.pipe(
                  startWith(''),
                  map(value => typeof value === 'string' ? value : ''),
                  map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
              );

              },(error) => {
                console.log('Erreur ! : ' + error);
                this.spinnerService.hide();
              }
            );
          }
      else{
        this.spinnerService.hide();
        this.filteredEntreprises = this.f.entreprise.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : ''),
            map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
        );
      }


      }, error => {
        console.log('Error ! : ' + error);
        this.spinnerService.hide();
      }

    );



  }

  initForm(patient : PatientModel){
    this.patientForm = this.formBuilder.group({
      civilite: patient.civilite,
      //titre: personne.titre,
      nom: [patient.nom, Validators.compose([Validators.required])],
      prenom: patient.prenom,
      dateNaiss: patient.dateNaiss,
      email: [patient.email, Validators.compose([Validators.email])],
      adresse: patient.adresse,
      tel1: patient.tel1,
      entreprise: null,
    });
  }

  ngOnDestroy(): void {
    this.entrepriseTriggerSubscription.unsubscribe();
  }
  ngAfterViewInit() {

    this.entrepriseTriggerSubscription = this.triggerEntreprise.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.entreprise != null){
          this.entreprise = null;
        }
      }
    },e => console.log('error', e));

  }

  private _filterEntreprise(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listEntreprises.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
  }
  displayEntreprise(entreprise: CompagniModel): string {
    if(entreprise && entreprise.nom){
      return entreprise.nom;
    }
    return '';
  }
  getEntreprise(event) {
    this.entreprise = event.option.value;
    console.log(this.patient);
  }

  get f() { return this.patientForm.controls; }

  onSubmitForm() {
    if(this.patientForm.get('nom').value && this.patientForm.get('nom').value.toString().trim()=='')
      this.patientForm.get('nom').setValue(null);

    this.submitted = true;
    if (this.patientForm.invalid) {
      return;
    }

    const formValue = this.patientForm.value;
    let editedPatient  = this.patient;
    editedPatient.civilite = formValue['civilite'] ? (<string> formValue['civilite']).trim() : formValue['civilite'];
    editedPatient.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedPatient.prenom = formValue['prenom'] ? (<string> formValue['prenom']).trim() : formValue['prenom'];
    editedPatient.dateNaiss = formValue['dateNaiss'] ? (<string> formValue['dateNaiss']).trim() : formValue['dateNaiss'];
    editedPatient.email = formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedPatient.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedPatient.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];
    editedPatient.tel2 = formValue['tel2'] ? (<string> formValue['tel2']).trim() : formValue['tel2'];
    if(this.entreprise!=null)
      editedPatient.entreprise = this.entreprise;
    else if(formValue['entreprise'] !=null && formValue['entreprise'].toString().trim()!=''){
      editedPatient.entreprise = new CompagniModel();
      editedPatient.entreprise.nom = formValue['entreprise'].toString().trim();
    }
    else
      editedPatient.entreprise = null;


    if (this.isAddMode) {
      this.addPersonne(editedPatient);
    } else {
      this.updatePersonne(editedPatient);
    }
  }

  onReset() {
    this.submitted = false;
    this.patientForm.reset();
  }

  private addPersonne(patient : PatientModel) {
    this.spinnerService.show();
    console.log(patient);
    this.patientService.addPatient(patient).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.router.navigate(['/patients']);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

  private updatePersonne(patient : PatientModel) {
    this.spinnerService.show();
    //patient.id = this.patient.id;
    console.log(patient);
    this.patientService.updatePatient(patient).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.router.navigate(['/patients']);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

}
