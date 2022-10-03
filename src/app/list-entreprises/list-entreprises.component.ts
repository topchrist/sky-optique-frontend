import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {Subscription} from "rxjs";
import {CompagniModel} from "../models/compagni.model";
import {LentilleService} from "../services/lentille.service";
import {CompagniService} from "../services/compagni.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-list-entreprises',
  templateUrl: './list-entreprises.component.html',
  styleUrls: ['./list-entreprises.component.css']
})
export class ListEntreprisesComponent implements OnInit {

  entreprises: CompagniModel[];
  type: number;

  constructor(private route: ActivatedRoute, private router: Router, private spinnerService: NgxSpinnerService, private compagniService : CompagniService) {
      this.type = this.route.snapshot.params['type'];

  }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) =>{
        this.type = params['type'];
        console.log(this.type);

        this.spinnerService.show();
        this.compagniService.getAllCompagnis().subscribe(
            (entreprises: CompagniModel[]) => {
                let listEntreprises = entreprises;
                console.log(listEntreprises);
                if(this.type == 0)
                    this.entreprises = listEntreprises.filter(x => x.type == 'assurance');
                else if(this.type == 1)
                    this.entreprises = listEntreprises.filter(x => (x.type==null || x.type !='assurance'));
                this.spinnerService.hide();
            }, error => {
                this.spinnerService.hide();
                console.log('Error ! : ' + error);
            }
        );

    });


  }

  deleteEntreprise(id: number) {
    this.spinnerService.show();
    this.compagniService.deleteCompagni(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.compagniService.getAllCompagnis();
          this.spinnerService.hide();
    }, error => {
        this.spinnerService.hide();
        console.log('Error ! : ' + error);
      });


  }

}
