import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {Subscription} from "rxjs";
import {CompagniModel} from "../models/compagni.model";
import {LentilleService} from "../services/lentille.service";
import {CompagniService} from "../services/compagni.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-entreprises',
  templateUrl: './list-entreprises.component.html',
  styleUrls: ['./list-entreprises.component.css']
})
export class ListEntreprisesComponent implements OnInit {

  entreprises: CompagniModel[];

  constructor(private spinnerService: NgxSpinnerService, private compagniService : CompagniService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.compagniService.getAllCompagnis().subscribe(
      (entreprises: CompagniModel[]) => {
        let listEntreprises = entreprises;
        this.entreprises = listEntreprises.filter(x => x.type == 'assurance');
          this.spinnerService.hide();
      }
    );
  }

  deleteEntreprise(id: number) {
    this.spinnerService.show();
    this.compagniService.deleteCompagni(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.compagniService.getAllCompagnis();
          this.spinnerService.hide();
    });


  }

}
