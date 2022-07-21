import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrescripteurModel} from "../models/prescripteur.model";
import {PrescripteurService} from "../services/prescripteur.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PatientModel} from "../models/patient.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-prescripteur-dialog',
  templateUrl: './edit-prescripteur-dialog.component.html',
  styleUrls: ['./edit-prescripteur-dialog.component.css']
})
export class EditPrescripteurDialogComponent implements OnInit {

  isAddMode: boolean;
  prescripteurForm: FormGroup;
  submitted = false;
  prescripteur = new PrescripteurModel();

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private prescripteurService : PrescripteurService,
              public dialogRef: MatDialogRef<EditPrescripteurDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public prescripteurToUpdate: PrescripteurModel) { }

  ngOnInit(): void {
    this.isAddMode = this.prescripteurToUpdate == undefined;
    this.initForm(new PrescripteurModel(null  ));

    if (!this.isAddMode) {
      // @ts-ignore
      this.prescripteur = this.prescripteurToUpdate.prescripteurToUpdate;
      this.initForm(this.prescripteur);
    }
  }

  initForm(prescripteur : PrescripteurModel){
    this.prescripteurForm = this.formBuilder.group({
      titre: prescripteur.titre,
      nom: [prescripteur.nom, Validators.compose([Validators.required])],
    });
  }

  get f() { return this.prescripteurForm.controls; }

  onSubmitForm() {
    if(this.prescripteurForm.get('nom').value && this.prescripteurForm.get('nom').value.toString().trim()=='')
      this.prescripteurForm.get('nom').setValue(null);
    this.submitted = true;
    if (this.prescripteurForm.invalid) {
      return;
    }

    const formValue = this.prescripteurForm.value;
    let editedprescripteur  = this.prescripteur;
    editedprescripteur.titre = formValue['titre'] ? (<string> formValue['titre']).trim() : formValue['titre'];
    editedprescripteur.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];

    if (this.isAddMode) {
      this.addPrescripteur(editedprescripteur);
    } else {
      this.updatePrescripteur(editedprescripteur);
    }
  }

  onReset() {
    this.submitted = false;
    this.prescripteurForm.reset();
  }

  private addPrescripteur(prescripteur : PrescripteurModel) {
    this.spinnerService.show();
    this.prescripteurService.addPrescripteur(prescripteur).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }

  private updatePrescripteur(prescripteur : PrescripteurModel) {
    this.spinnerService.show();
    console.log(prescripteur);
    this.prescripteurService.updatePrescripteur(prescripteur).subscribe(data=>{
      console.log(data);
      this.spinnerService.hide();
      this.dialogRef.close(data);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }


}
