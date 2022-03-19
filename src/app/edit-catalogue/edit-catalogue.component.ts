import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarqueModel} from "../models/marque.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogueService} from "../services/catalogue.service";
import {CatalogueModel} from "../models/catalogue.model";

@Component({
  selector: 'app-edit-catalogue',
  templateUrl: './edit-catalogue.component.html',
  styleUrls: ['./edit-catalogue.component.css']
})
export class EditCatalogueComponent implements OnInit {

  isAddMode: boolean;
  catalogueForm: FormGroup;
  submitted = false;
  loading = false;
  catalogue: CatalogueModel = new CatalogueModel(null);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private catalogueService : CatalogueService,
              ) {
    this.catalogue.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.catalogue.id;

    if (!this.isAddMode) {
      this.loading = true;
      this.catalogueService.getCatalogueById(this.catalogue.id).subscribe((response) => {
          this.catalogue = response;
          this.loading = false;
          this.initForm(this.catalogue);
        },(error) => {
          this.loading = false;
          console.log('Erreur ! : ' + error);
        }
      );
    }
    else
      this.initForm(this.catalogue);
  }

  initForm(catalogue: CatalogueModel){
    this.catalogueForm = this.formBuilder.group({
      nom: [catalogue.nom, Validators.compose([Validators.required])],
    });
  }

  get f() { return this.catalogueForm.controls; }
  onSubmitForm(){
    if(this.catalogueForm.get('nom').value && this.catalogueForm.get('nom').value.toString().trim()=='')
      this.catalogueForm.get('nom').setValue(null);
    this.submitted = true;
    if (this.catalogueForm.invalid) {
      return;
    }

    const formValue = this.catalogueForm.value;

    let edited = this.catalogue;
    edited.nom = (<string> formValue['nom']).trim();

    if (this.isAddMode) {
      this.addMarque(edited);
    } else {
      this.updateMarque(edited);
    }

  }
  onReset() {
    this.submitted = false;
    this.catalogueForm.reset();
  }

  private addMarque(catalogue: CatalogueModel) {
    this.catalogueService.addCatalogue(catalogue).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.catalogueService.getAllCatalogues();
      this.router.navigate(['/catalogues']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateMarque(catalogue: CatalogueModel) {
    this.catalogueService.updateCatalogue(catalogue).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.catalogueService.getAllCatalogues();
      this.router.navigate(['/catalogues']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
