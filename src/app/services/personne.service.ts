import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {PersonneModel} from "../models/personne.model";

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  url = 'https://sky-optique-back2.herokuapp.com/personne/';

  // @ts-ignore
  listPersonnes : PersonneModel[];
  listPersonneSubject = new Subject<PersonneModel[]>();
  emitlistPersonneSubject(){
    this.listPersonneSubject.next(this.listPersonnes.slice());
  }

  listPatients : PersonneModel[];
  listPatientSubject = new Subject<PersonneModel[]>();
  emitlistPatientSubject(){
    this.listPatientSubject.next(this.listPatients.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllPersonnes() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listPersonnes = data;
        this.emitlistPersonneSubject();
      }
    );
  }

  getAllPatients() {
    this.httpClient.get<any[]>(this.url+"/client/").subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listPatients = data;
        this.emitlistPatientSubject();
      }
    );
  }

  getPersonneById(idPersonne : number) {
    return this.httpClient.get<any>(this.url+idPersonne);
  }

  addPersonne(personne : PersonneModel) {
    return this.httpClient.post(this.url, personne);
  }

  updatePersonne(personne : PersonneModel) {
    return this.httpClient.put(this.url+personne.id, personne);
  }

  deletePersonne(idPersonne : number) {
    return this.httpClient.delete(this.url+idPersonne);
  }

}
