import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {PrescripteurModel} from "../models/prescripteur.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class PrescripteurService {

  //url = 'http://localhost:8080/prescripteur/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'prescripteur/';
  }

  getAllPrescripteurSubject() {
    return this.httpClient.get<PrescripteurModel[]>(this.url);
  }

  getAllPrescripteurs() {
    return this.httpClient.get<PrescripteurModel[]>(this.url);
  }

  getPrescripteurById(idPrescripteur : number) {
    return this.httpClient.get<any>(this.url+idPrescripteur);
  }


  addPrescripteur(prescripteur : PrescripteurModel) {
    return this.httpClient.post(this.url, prescripteur);
  }

  updatePrescripteur(prescripteur : PrescripteurModel) {
    return this.httpClient.put(this.url+prescripteur.id, prescripteur);
  }

  deletePrescripteur(idPrescripteur : number) {
    return this.httpClient.delete(this.url+idPrescripteur);
  }

}
