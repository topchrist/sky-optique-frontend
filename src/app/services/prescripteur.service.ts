import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {PrescripteurModel} from "../models/prescripteur.model";

@Injectable({
  providedIn: 'root'
})
export class PrescripteurService {

  url = 'https://sky-optique-back2.herokuapp.com/prescripteur/';
  // @ts-ignore
  listPrescripteurs : PrescripteurModel[];
  listPrescripteurSubject = new Subject<PrescripteurModel[]>();
  emitListPrescripteurSubject(){
    this.listPrescripteurSubject.next(this.listPrescripteurs);
  }

  constructor(private httpClient: HttpClient) { }

  getAllPrescripteurs() {
    this.httpClient.get<PrescripteurModel[]>(this.url).subscribe(
      (data: PrescripteurModel[]) => {
        this.listPrescripteurs = data;
        this.emitListPrescripteurSubject();
      }
    );
  }

  getPrescripteurById(idPrescripteur : number) {
    return this.httpClient.get<any>(this.url+idPrescripteur);
  }


  addPrescripteur(fournisseur : PrescripteurModel) {
    return this.httpClient.post(this.url, fournisseur);
  }

  updatePrescripteur(prescripteur : PrescripteurModel) {
    return this.httpClient.put(this.url+prescripteur.id, prescripteur);
  }

  deletePrescripteur(idPrescripteur : number) {
    return this.httpClient.delete(this.url+idPrescripteur);
  }

}
