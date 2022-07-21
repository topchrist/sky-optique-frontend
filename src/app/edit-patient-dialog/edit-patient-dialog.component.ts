import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompagniModel} from "../models/compagni.model";
import {NgxSpinnerService} from "ngx-spinner";
import {PatientService} from "../services/patient.service";
import {CompagniService} from "../services/compagni.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PatientModel} from "../models/patient.model";
import {PersonneModel} from "../models/personne.model";
import {PersonneService} from "../services/personne.service";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MontureModel} from "../models/monture.model";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-edit-patient-dialog',
  templateUrl: './edit-patient-dialog.component.html',
  styleUrls: ['./edit-patient-dialog.component.css']
})
export class EditPatientDialogComponent implements OnInit {

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
              private personneService : PersonneService,
              private compagniService : CompagniService,
              public dialogRef: MatDialogRef<EditPatientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public patientToUpdate: any) { }

  ngOnInit(): void {
    console.log(this.patientToUpdate.patientToUpdate);
    this.isAddMode = this.patientToUpdate.patientToUpdate == null;
    this.initForm(this.patient);

    this.compagniService.getAllCompagnis().subscribe(data => {
      this.listEntreprises = data;
    },error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });


    if (!this.isAddMode) {
      // @ts-ignore
      //this.initForm(this.patientToUpdate.patientToUpdate as PatientModel);
      this.patient = this.patientToUpdate.patientToUpdate;

      if((this.patient.entreprise as CompagniModel) != null)
      { // @ts-ignore
        this.entreprise = this.patient.entreprise;
        // @ts-ignore
      }
      this.initForm(this.patient);
      this.f.entreprise.setValue(this.patient.entreprise);
    }

    this.filteredEntreprises = this.f.entreprise.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
    );

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

  initForm(patient : PatientModel){
    console.log(patient);

    this.patientForm = this.formBuilder.group({
      civilite: patient.civilite,
      //titre: personne.titre,
      nom: [patient.nom, Validators.compose([Validators.required])],
      prenom: patient.prenom,
      dateNaiss: patient.dateNaiss,
      email: [patient.email, Validators.compose([Validators.email])],
      adresse: patient.adresse,
      tel1: patient.tel1,
      tel2: patient.tel2,
      entreprise: ' ',
    });
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
      if(this.patientToUpdate.type == "patient")
        this.addPatient(editedPatient);
      else
      if(this.patientToUpdate.type == "assurePrincipal")
        this.addPersonne(editedPatient);
    }
    else{
      if(this.patient.discriminator == "CLIENT")
        this.updatePatient(editedPatient);
      else
        this.updatePersonne(editedPatient);
    }
  }

  onReset() {
    this.submitted = false;
    this.patientForm.reset();
  }

  private addPatient(patient : PatientModel) {
    this.spinnerService.show();
    console.log(patient);
    this.patientService.addPatient(patient).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }
  private updatePatient(patient : PatientModel) {
    this.spinnerService.show();
    //patient.id = this.patient.id;
    console.log(patient);
    this.patientService.updatePatient(patient).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

  private addPersonne(personne : PersonneModel) {
    this.spinnerService.show();
    console.log(personne);
    this.personneService.addPersonne(personne).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }
  private updatePersonne(personne : PersonneModel) {
    this.spinnerService.show();
    //patient.id = this.patient.id;
    console.log(personne);
    this.personneService.updatePersonne(personne).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }


}
