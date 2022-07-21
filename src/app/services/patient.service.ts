import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {PatientModel} from "../models/patient.model";
import {MarqueModel} from "../models/marque.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  //url = 'http://localhost:8080/patient/';
  // @ts-ignore
  listPatients : PatientModel[];
  listPatientSubject = new Subject<PatientModel[]>();
  emitListPatientSubject(){
    this.listPatientSubject.next(this.listPatients);
  }

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'patient/';
  }

  getAllPatientsSubject() {
    this.httpClient.get<PatientModel[]>(this.url).subscribe(
      (data: PatientModel[]) => {
        this.listPatients = data;
        this.emitListPatientSubject();
      }
    );
  }

  getAllPagesPatients(request) {
    const params = request;
    return this.httpClient.get<PatientModel[]>(this.url+"find", { params });
  }

  getAllPatients() {
    return this.httpClient.get<PatientModel[]>(this.url);
  }

  getPatientById(idPatient : number) {
    return this.httpClient.get<any>(this.url+idPatient);
  }


  addPatient(patient : PatientModel) {
    return this.httpClient.post(this.url, patient);
  }

  updatePatient(patient : PatientModel) {
    return this.httpClient.put(this.url+patient.id, patient);
  }

  deletePatient(idPatient : number) {
    return this.httpClient.delete(this.url+idPatient);
  }

}
