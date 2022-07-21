import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {PatientService} from "../services/patient.service";
import {PatientModel} from "../models/patient.model";
import {PageEvent} from "@angular/material/paginator";
import {MarqueModel} from "../models/marque.model";

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css']
})
export class ListPatientsComponent implements OnInit {

  patients : PatientModel[];

    size : number = 10;
    page : number = 0;
    mc : string = "";
    totalElements: number = 0;

  constructor(private spinnerService: NgxSpinnerService, private patientService : PatientService) { }

  ngOnInit(): void {
      this.getAllPatients({mc: this.mc, page: this.page, size: this.size });
  }

    getAllPatients(request){
        this.spinnerService.show();
        this.patientService.getAllPagesPatients(request).subscribe((data: PatientModel[]) => {
            this.patients = data['content'];
            this.totalElements = data['totalElements'];
            this.spinnerService.hide();
        },
        error => {
            this.spinnerService.hide();
        });

    }

  deletePatient(id: number) {
      this.spinnerService.show();
      this.patientService.deletePatient(id).subscribe( data =>{
        console.log("ok deleting");
        this.spinnerService.hide();
        this.getAllPatients({mc: this.mc.trim(), page: this.page, size: this.size });
        },
            error => {
                this.spinnerService.hide();
            }
        );
  }

    nextPage(event: PageEvent) {
        const request = {};
        request['mc'] = this.mc;
        request['page'] = event.pageIndex.toString();
        this.page = event.pageIndex;
        request['size'] = event.pageSize.toString();
        this.size = event.pageSize;
        // @ts-ignore
        this.getAllPatients(request);
    }

    onRecherche() {
        this.mc = this.mc.trim();
        this.getAllPatients({mc: this.mc, page: this.page, size: this.size });
    }

}
