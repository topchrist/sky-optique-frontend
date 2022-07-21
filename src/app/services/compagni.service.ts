import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {CompagniModel} from "../models/compagni.model";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class CompagniService {

  url = 'http://localhost:8080/compagni/';
  // @ts-ignore
  listCompagnis : CompagniModel[];
  listCompagniSubject = new Subject<CompagniModel[]>();
  emitListCompagniSubject(){
    this.listCompagniSubject.next(this.listCompagnis);
  }

  constructor(private SpinnerService: NgxSpinnerService, private httpClient: HttpClient) { }

  getAllCompagnisSubject() {
    this.httpClient.get<CompagniModel[]>(this.url).subscribe(
      (data: CompagniModel[]) => {
        // @ts-ignore
        this.listCompagnis = data;
        this.emitListCompagniSubject();
      }
    );
  }

  getAllCompagnis() {
    return this.httpClient.get<CompagniModel[]>(this.url);
  }

  getCompagniById(idCompagni : number) {
    return this.httpClient.get<any>(this.url+idCompagni);
  }

  getCompagniByPersonne(idPersonne : number) {
    return this.httpClient.get<any>("http://localhost:8080/personne/"+idPersonne+"/entreprise");
  }


  addCompagni(compagni : CompagniModel) {
    return this.httpClient.post(this.url, compagni);
  }

  updateCompagni(compagni : CompagniModel) {
    return this.httpClient.put(this.url+compagni.id, compagni);
  }

  deleteCompagni(idCompagni : number) {
    return this.httpClient.delete(this.url+idCompagni);
  }

}
