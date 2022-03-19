import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {AgenceModel} from "../models/agence.model";

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  url = 'https://sky-optique-back2.herokuapp.com/agence/';
  // @ts-ignore
  listAgences : AgenceModel[];
  listAgenceSubject = new Subject<AgenceModel[]>();
  emitlistAgenceSubject(){
    this.listAgenceSubject.next(this.listAgences);
  }

  constructor(private httpClient: HttpClient) { }

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
