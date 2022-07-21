import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PersonneModel} from "../models/personne.model";
import {PrescripteurModel} from "../models/prescripteur.model";
import {PersonneService} from "../services/personne.service";
import {CompagniService} from "../services/compagni.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PrescripteurService} from "../services/prescripteur.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-prescripteur',
  templateUrl: './edit-prescripteur.component.html',
  styleUrls: ['./edit-prescripteur.component.css']
})
export class EditPrescripteurComponent implements OnInit {

  isAddMode: boolean;
  prescripteurForm: FormGroup;
  submitted = false;
  loading = false;
  prescripteur = new PrescripteurModel();

  constructor(private spinnerService: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private prescripteurService : PrescripteurService,
              private router: Router,
              private route: ActivatedRoute) {
    this.prescripteur.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.prescripteur.id;
    this.initForm(this.prescripteur);

    if (!this.isAddMode) {
      this.loading = true;
      this.prescripteurService.getPrescripteurById(this.prescripteur.id).subscribe((response) => {
            this.prescripteur = response;
            console.log(response);
            this.initForm(this.prescripteur);
          },(error) => {
            console.log('Erreur ! : ' + error);
          }
      );
      this.loading = false;
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
      this.router.navigate(['/prescripteurs']);
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
      this.router.navigate(['/prescripteurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.spinnerService.hide();
    });
  }


}
