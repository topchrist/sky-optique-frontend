import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PersonneModel} from "../models/personne.model";
import {CompagniModel} from "../models/compagni.model";
import {MontureService} from "../services/monture.service";
import {StockService} from "../services/stock.service";
import {MarqueService} from "../services/marque.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StockModel} from "../models/stockModel";
import {PersonneService} from "../services/personne.service";
import {AddMontureDialogComponent} from "../add-monture-dialog/add-monture-dialog.component";

@Component({
  selector: 'app-add-patient-dialog',
  templateUrl: './add-patient-dialog.component.html',
  styleUrls: ['./add-patient-dialog.component.css']
})
export class AddPatientDialogComponent implements OnInit {

  personneForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private personneService : PersonneService,
              public dialogRef: MatDialogRef<AddMontureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: StockModel,) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.personneForm = this.formBuilder.group({
      civilite: null,
      nom: [null, Validators.compose([Validators.required])],
      prenom: null,
      dateNaiss: null,
      email: [null, Validators.compose([Validators.email])],
      adresse: null,
      tel1: null,
      tel2: null,
    });
  }

  get f() { return this.personneForm.controls; }

  onSubmitForm() {
    if(this.personneForm.get('nom').value && this.personneForm.get('nom').value.toString().trim()=='')
      this.personneForm.get('nom').setValue(null);
    this.submitted = true;
    if (this.personneForm.invalid) {
      return;
    }

    const formValue = this.personneForm.value;
    let editedPersonne  = new PersonneModel(null, null);
    editedPersonne.civilite = formValue['civilite'] ? (<string> formValue['civilite']).trim() : formValue['civilite'];
    editedPersonne.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedPersonne.prenom = formValue['prenom'] ? (<string> formValue['prenom']).trim() : formValue['prenom'];
    editedPersonne.dateNaiss = formValue['dateNaiss'] ? (<string> formValue['dateNaiss']).trim() : formValue['dateNaiss'];
    editedPersonne.email = formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedPersonne.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedPersonne.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];

    this.addPersonne(editedPersonne);

  }

  onReset() {
    this.submitted = false;
    this.personneForm.reset();
  }

  private addPersonne(personne : PersonneModel) {
    console.log(personne);
    this.personneService.addPersonne(personne).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
