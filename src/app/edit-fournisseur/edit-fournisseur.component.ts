import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {FournisseurModel} from "../models/fournisseur.model";
import {LentilleService} from "../services/lentille.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FournisseurService} from "../services/fournisseur.service";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-fournisseur',
  templateUrl: './edit-fournisseur.component.html',
  styleUrls: ['./edit-fournisseur.component.css']
})
export class EditFournisseurComponent implements OnInit {

  isAddMode: boolean;
  loading = false;
  submitted = false;
  fournisseur = new FournisseurModel(null, null, null, null, null, null);
  fournisseurForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private fournisseurService : FournisseurService, private router: Router, private route: ActivatedRoute) {
    this.fournisseur.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.fournisseur.id;
    this.initForm(this.fournisseur);

    if (!this.isAddMode) {
      this.loading = true;
      this.fournisseurService.getFournisseurById(this.fournisseur.id).subscribe((response) => {
        this.fournisseur = response;
        this.initForm(this.fournisseur);
        this.loading = false;
        },(error) => {
          this.loading = false;
          console.log('Erreur ! : ' + error);
        }
      );
    }
  }

  initForm(fournisseur : FournisseurModel){
    this.fournisseurForm = this.formBuilder.group({
      nom: [fournisseur.nom, Validators.compose([Validators.required])],
      adresse: fournisseur.adresse,
      email: [fournisseur.email, Validators.compose([Validators.required, Validators.email])],
      tel1: [fournisseur.tel1, Validators.compose([Validators.required])],
      tel2: fournisseur.tel2,
      bp: fournisseur.bp
    });
  }

  get f() { return this.fournisseurForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.fournisseurForm.invalid) {
      return;
    }
    const formValue = this.fournisseurForm.value;
    let editedFournisseur = this.fournisseur;
    editedFournisseur.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedFournisseur.email = formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedFournisseur.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedFournisseur.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];
    editedFournisseur.tel2 = formValue['tel2'] ? (<string> formValue['tel2']).trim() : formValue['tel2'];
    editedFournisseur.bp = formValue['bp'] ? (<string> formValue['bp']).trim() : formValue['bp'];

    if (this.isAddMode) {
      this.addFournisseur(editedFournisseur);
    } else {
      this.updateFournisseur(editedFournisseur);
    }
  }

  onReset() {
    this.submitted = false;
    this.fournisseurForm.reset();
  }

  private addFournisseur(fournisseur : FournisseurModel) {
    this.fournisseurService.addFournisseur(fournisseur).subscribe(data=>{
      console.log(data);
      this.fournisseurService.getAllFournisseurs();
      this.router.navigate(['/fournisseurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateFournisseur(fournisseur : FournisseurModel) {
    fournisseur.id = this.fournisseur.id;
    this.fournisseurService.updateFournisseur(fournisseur).subscribe(data=>{
      console.log(data);
      this.fournisseurService.getAllFournisseurs();
      this.router.navigate(['/fournisseurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
