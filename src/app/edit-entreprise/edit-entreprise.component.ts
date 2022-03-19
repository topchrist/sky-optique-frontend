import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LentilleModel} from "../models/lentille.model";
import {LentilleService} from "../services/lentille.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";

@Component({
  selector: 'app-edit-entreprise',
  templateUrl: './edit-entreprise.component.html',
  styleUrls: ['./edit-entreprise.component.css']
})
export class EditEntrepriseComponent implements OnInit {

  isAddMode: boolean;
  entrepriseForm: FormGroup;
  submitted = false;
  loading = false;
  entreprise = new CompagniModel();

  constructor(private formBuilder: FormBuilder, private compagniService : CompagniService, private router: Router, private route: ActivatedRoute) {
    this.entreprise.id = this.route.snapshot.params['id'];
  }


  ngOnInit(): void {
    this.isAddMode = !this.entreprise.id;
    this.initForm(this.entreprise);

    if (!this.isAddMode) {
      this.loading = true;
      this.compagniService.getCompagniById(this.entreprise.id).subscribe((response) => {
          this.entreprise = response;
          this.initForm(this.entreprise);
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }
  }

  initForm(entreprise : CompagniModel){
    this.entrepriseForm = this.formBuilder.group({
      nom: [entreprise.nom, Validators.compose([Validators.required])],
      email: [entreprise.email, Validators.compose([Validators.email])],
      adresse: entreprise.adresse,
      tel1: entreprise.tel1,
      //tel2: entreprise.tel2,
      bp: entreprise.bp,
      rccm: entreprise.rccm,
    });
  }

  get f() { return this.entrepriseForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.entrepriseForm.invalid) {
      return;
    }

    const formValue = this.entrepriseForm.value;
    let editedEntreprise = this.entreprise;
    editedEntreprise.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedEntreprise.email = formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedEntreprise.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedEntreprise.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];
    //editedEntreprise.tel2 = formValue['tel2'] ? (<string> formValue['tel2']).trim() : formValue['tel2'];
    editedEntreprise.bp = formValue['bp'] ? (<string> formValue['bp']).trim() : formValue['bp'];
    editedEntreprise.rccm = formValue['rccm'] ? (<string> formValue['rccm']).trim() : formValue['rccm'];
    editedEntreprise.type='assurance';
    console.log(editedEntreprise);

    if (this.isAddMode) {
      this.addEntreprise(editedEntreprise);
    } else {
      this.updateEntreprise(editedEntreprise);
    }
  }

  onReset() {
    this.submitted = false;
    this.entrepriseForm.reset();
  }

  private addEntreprise(entreprise : CompagniModel) {
    console.log(entreprise);
    this.compagniService.addCompagni(entreprise).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.compagniService.getAllCompagnis();
      this.router.navigate(['/entreprises']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateEntreprise(entreprise : CompagniModel) {
    entreprise.id = this.entreprise.id;
    this.compagniService.updateCompagni(entreprise).subscribe(data=>{
      console.log(data);
      this.compagniService.getAllCompagnis();
      this.router.navigate(['/entreprises']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
