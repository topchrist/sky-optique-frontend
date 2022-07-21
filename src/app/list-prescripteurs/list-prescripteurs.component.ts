import { Component, OnInit } from '@angular/core';
import {PersonneModel} from "../models/personne.model";
import {Subscription} from "rxjs";
import {PrescripteurModel} from "../models/prescripteur.model";
import {PersonneService} from "../services/personne.service";
import {PrescripteurService} from "../services/prescripteur.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-prescripteurs',
  templateUrl: './list-prescripteurs.component.html',
  styleUrls: ['./list-prescripteurs.component.css']
})
export class ListPrescripteursComponent implements OnInit {

  prescripteurs : PrescripteurModel[];

  constructor(private spinnerService: NgxSpinnerService, private prescripteurService : PrescripteurService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.prescripteurService.getAllPrescripteurs().subscribe(
    (data: PrescripteurModel[]) => {
      this.prescripteurs = data;
        this.spinnerService.hide();
    }, error => {
        this.spinnerService.hide();
        console.log("error : "+error);
    });
  }

    deletePrescripteur(id: number) {
        this.spinnerService.show();
        this.prescripteurService.deletePrescripteur(id).subscribe( data =>{
            console.log("ok deleting");
            this.prescripteurService.getAllPrescripteurs().subscribe((data: PrescripteurModel[]) => {
                this.prescripteurs = data;
                this.spinnerService.hide();
            }, error => {
                this.spinnerService.hide();
                console.log("error : "+error);
            });
        });
    }


}
