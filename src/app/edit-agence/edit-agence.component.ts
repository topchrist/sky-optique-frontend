import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StockModel} from "../models/stockModel";
import {MontureModel} from "../models/monture.model";
import {AgenceModel} from "../models/agence.model";
import {AgenceService} from "../services/agence.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FournisseurModel} from "../models/fournisseur.model";

@Component({
  selector: 'app-edit-agence',
  templateUrl: './edit-agence.component.html',
  styleUrls: ['./edit-agence.component.css']
})
export class EditAgenceComponent implements OnInit {

  isAddMode: boolean;
  agenceForm: FormGroup;
  submitted = false;
  loading = false;
  agence = new AgenceModel(null);

  constructor(private agenceService : AgenceService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.agence.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.agence.id;
    this.initForm(this.agence);

    if (!this.isAddMode) {
      this.loading = true;
      this.agenceService.getAgenceById(this.agence.id).subscribe((response) => {
          this.agence = response;
          this.initForm(this.agence);
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

  }

  initForm(agence : AgenceModel){
    this.agenceForm = this.formBuilder.group({
      nom: [agence.nom, Validators.compose([Validators.required])],
      adresse: agence.adresse,
      tel1: agence.tel1,
    });
  }
  get f() { return this.agenceForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.agenceForm.invalid) {
      return;
    }
    const formValue = this.agenceForm.value;
    let editedAgence = this.agence;
    editedAgence.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedAgence.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedAgence.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];

    if (this.isAddMode) {
      this.addAgence(editedAgence);
    } else {
      this.updateAgence(editedAgence);
    }
  }

  onReset() {
    this.submitted = false;
    this.agenceForm.reset();
  }

  private addAgence(agence : AgenceModel) {
    this.agenceService.addAgence(agence).subscribe(data=>{
      console.log(data);
      this.agenceService.getAllAgences();
      this.router.navigate(['/agences']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateAgence(agence : AgenceModel) {
    agence.id = this.agence.id;
    this.agenceService.updateAgence(agence).subscribe(data=>{
      console.log(data);
      this.agenceService.getAllAgences();
      this.router.navigate(['/agences']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
