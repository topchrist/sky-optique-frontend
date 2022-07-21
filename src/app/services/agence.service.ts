import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {AgenceModel} from "../models/agence.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  //url = 'http://localhost:8080/agence/';
  // @ts-ignore
  listAgences : AgenceModel[];
  listAgenceSubject = new Subject<AgenceModel[]>();
  emitlistAgenceSubject(){
    this.listAgenceSubject.next(this.listAgences);
  }

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'agence/';
  }

  getAllAgences() {
    this.httpClient.get<AgenceModel[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        this.listAgences = data;
        this.emitlistAgenceSubject();
      }
    );
  }

  getAgenceById(idAgence : number) {
    return this.httpClient.get<any>(this.url+idAgence);
  }

  addAgence(agence : AgenceModel) {
    return this.httpClient.post(this.url, agence);
  }

  updateAgence(agence : AgenceModel) {
    return this.httpClient.put(this.url+agence.id, agence);
  }

  deleteAgence(idAgence : number) {
    return this.httpClient.delete(this.url+idAgence);
  }

}
