import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CompagniModel} from "../models/compagni.model";
import {PersonneModel} from "../models/personne.model";
import {CompagniService} from "../services/compagni.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonneService} from "../services/personne.service";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-personne.component.html',
  styleUrls: ['./edit-personne.component.css']
})
export class EditPersonneComponent implements OnInit {

  isAddMode: boolean;
  personneForm: FormGroup;
  submitted = false;
  loading = false;
  personne = new PersonneModel(null, null, null, new CompagniModel(), null );

  //entreprise : CompagniModel;
  listEntreprises : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;

  constructor(private formBuilder: FormBuilder,
              private personneService : PersonneService,
              private compagniService : CompagniService,
              private router: Router,
              private route: ActivatedRoute) {
    this.personne.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.personne.id;
    this.initForm(this.personne);

    this.listEntreprisesSubscription = this.compagniService.listCompagniSubject.subscribe(
      data => {
        this.listEntreprises = data;
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.compagniService.getAllCompagnis();

    if (!this.isAddMode) {
      this.loading = true;
      this.personneService.getPersonneById(this.personne.id).subscribe((response) => {
          this.personne = response;
          console.log(response);
          this.initForm(this.personne);
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

  }

  ngOnDestroy(): void {
    this.listEntreprisesSubscription.unsubscribe();
  }


  initForm(personne : PersonneModel){
    this.personneForm = this.formBuilder.group({
      civilite: personne.civilite,
      //titre: personne.titre,
      nom: [personne.nom, Validators.compose([Validators.required])],
      prenom: personne.prenom,
      dateNaiss: personne.dateNaiss,
      email: [personne.email, Validators.compose([Validators.email])],
      adresse: personne.adresse,
      tel1: personne.tel1,
      tel2: personne.tel2,
      idEntreprise: personne.entreprise ? personne.entreprise.id : null,
    });
  }

  get f() { return this.personneForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.personneForm.invalid) {
      return;
    }

    const formValue = this.personneForm.value;
    let editedPersonne  = this.personne;
    editedPersonne.civilite = formValue['civilite'] ? (<string> formValue['civilite']).trim() : formValue['civilite'];
    editedPersonne.nom = formValue['nom'] ? (<string> formValue['nom']).trim() : formValue['nom'];
    editedPersonne.prenom = formValue['prenom'] ? (<string> formValue['prenom']).trim() : formValue['prenom'];
    editedPersonne.dateNaiss = formValue['dateNaiss'] ? (<string> formValue['dateNaiss']).trim() : formValue['dateNaiss'];
    editedPersonne.email = formValue['email'] ? (<string> formValue['email']).trim() : formValue['email'];
    editedPersonne.adresse = formValue['adresse'] ? (<string> formValue['adresse']).trim() : formValue['adresse'];
    editedPersonne.tel1 = formValue['tel1'] ? (<string> formValue['tel1']).trim() : formValue['tel1'];
    editedPersonne.tel2 = formValue['tel2'] ? (<string> formValue['tel2']).trim() : formValue['tel2'];
    if(formValue['idEntreprise']){
      editedPersonne.entreprise = this.listEntreprises.filter(entre => entre.id == formValue['idEntreprise'])[0];
    }
    else {
      editedPersonne.entreprise = null;
    }


    //console.log(editedPersonne);

    if (this.isAddMode) {
      this.addPersonne(editedPersonne);
    } else {
      this.updatePersonne(editedPersonne);
    }
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
      this.personneService.getAllPersonnes();
      this.router.navigate(['/personnes']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updatePersonne(personne : PersonneModel) {
    //personne.id = this.personne.id;
    console.log(personne);
    this.personneService.updatePersonne(personne).subscribe(data=>{
      console.log(data);
      this.personneService.getAllPersonnes();
      this.router.navigate(['/personnes']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
