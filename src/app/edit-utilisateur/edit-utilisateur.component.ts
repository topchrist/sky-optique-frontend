import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilisateurModel} from "../models/utilisateur.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilisateurService} from "../services/utilisateur.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-utilisateur',
  templateUrl: './edit-utilisateur.component.html',
  styleUrls: ['./edit-utilisateur.component.css']
})
export class EditUtilisateurComponent implements OnInit {

  isAddMode: boolean;
  utilisateurForm: FormGroup;
  submitted = false;
  loading = false;
  utilisateur = new UtilisateurModel(null, null, null);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private utilisateurService : UtilisateurService
  ) {
    this.utilisateur.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.utilisateur.id;

    if (!this.isAddMode) {
      this.loading = true;
      this.utilisateurService.getUtilisateurById(this.utilisateur.id).subscribe((response) => {
          this.utilisateur = response;
          this.loading = false;
          this.initForm(this.utilisateur);
        },(error) => {
          this.loading = false;
          console.log('Erreur ! : ' + error);
        }
      );
    }
    else
      this.initForm(this.utilisateur);
  }

  ngOnDestroy(): void {
  }

  initForm(utilisateur : UtilisateurModel){
    this.utilisateurForm = this.formBuilder.group({
      pseudo: [utilisateur.pseudo, Validators.compose([Validators.required])],
      password: [utilisateur.password, Validators.compose([Validators.required])],
      nom: [utilisateur.nom, Validators.compose([Validators.required])],
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      adresse: utilisateur.adresse,
      tel1: utilisateur.tel1,
    });
  }

  get f() { return this.utilisateurForm.controls; }
  onSubmitForm(){
    this.submitted = true;
    if (this.utilisateurForm.invalid) {
      return;
    }

    const formValue = this.utilisateurForm.value;

    let editedUtilisateur = this.utilisateur;
    editedUtilisateur.nom = (<string> formValue['nom']).trim();
    editedUtilisateur.pseudo = (<string> formValue['pseudo']).trim();
    editedUtilisateur.password = (<string> formValue['password']).trim();
    editedUtilisateur.prenom= formValue['prenom'] ? (<string> formValue['prenom']).trim() : formValue['prenom'];
    editedUtilisateur.email= formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedUtilisateur.adresse= formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedUtilisateur.tel1= formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];

    if (this.isAddMode) {
      this.addUtilisateur(editedUtilisateur);
    } else {
      this.updateUtilisateur(editedUtilisateur);
    }

  }
  onReset() {
    this.submitted = false;
    this.utilisateurForm.reset();
  }

  private addUtilisateur(addedUtilisateur: UtilisateurModel) {
    this.utilisateurService.addUtilisateur(addedUtilisateur).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.utilisateurService.getAllUtilisateurs();
      this.router.navigate(['/utilisateurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateUtilisateur(addedUtilisateur: UtilisateurModel) {
    this.utilisateurService.addUtilisateur(addedUtilisateur).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.utilisateurService.getAllUtilisateurs();
      this.router.navigate(['/utilisateurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
