import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";

@Component({
  selector: 'app-edit-marque',
  templateUrl: './edit-marque.component.html',
  styleUrls: ['./edit-marque.component.css']
})
export class EditMarqueComponent implements OnInit {

  isAddMode: boolean;
  marqueForm: FormGroup;
  submitted = false;
  loading = false;
  marque: MarqueModel = new MarqueModel(null);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private marqueService : MarqueService,
  ) {
    this.marque.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.marque.id;

    if (!this.isAddMode) {
      this.loading = true;
      this.marqueService.getMarqueById(this.marque.id).subscribe((response) => {
        this.marque = response;
        this.loading = false;
        this.initForm(this.marque);
        },(error) => {
        this.loading = false;
          console.log('Erreur ! : ' + error);
        }
      );
    }
    else
      this.initForm(this.marque);
  }

  initForm(marque : MarqueModel){
    this.marqueForm = this.formBuilder.group({
      nom: [marque.nom, Validators.compose([Validators.required])],
    });
  }

  get f() { return this.marqueForm.controls; }
  onSubmitForm(){
    if(this.marqueForm.get('nom').value && this.marqueForm.get('nom').value.toString().trim()=='')
      this.marqueForm.get('nom').setValue(null);
    this.submitted = true;
    if (this.marqueForm.invalid) {
      return;
    }

    const formValue = this.marqueForm.value;

    let editedMarque = this.marque;
    editedMarque.nom = (<string> formValue['nom']).trim();

    if (this.isAddMode) {
      this.addMarque(editedMarque);
    } else {
      this.updateMarque(editedMarque);
    }

  }
  onReset() {
    this.submitted = false;
    this.marqueForm.reset();
  }

  private addMarque(addedMarque: MarqueModel) {
    this.marqueService.addMarque(addedMarque).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.marqueService.getAllMarques();
      this.router.navigate(['/marques']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateMarque(addedMarque: MarqueModel) {
    addedMarque.id = this.marque.id;
    this.marqueService.updateMarque(addedMarque).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.marqueService.getAllMarques();
      this.router.navigate(['/marques']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }
}
