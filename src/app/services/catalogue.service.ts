import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {CatalogueModel} from "../models/catalogue.model";

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  url = 'https://sky-optique-back2.herokuapp.com/catalogue/';
  // @ts-ignore
  listCatalogues : CatalogueModel[];
  listCatalogueSubject = new Subject<CatalogueModel[]>();
  emitListCatalogueSubject(){
    this.listCatalogueSubject.next(this.listCatalogues.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllCatalogues() {
    this.httpClient.get<CatalogueModel[]>(this.url).subscribe(
      (data: any[]) => {
        // @ts-ignore
        this.listCatalogues = data;
        this.emitListCatalogueSubject();
      }
    );
  }

  getCatalogueById(idCatalogue : number) {
    return this.httpClient.get<any>(this.url+idCatalogue);
  }

  addCatalogue(catalogue : CatalogueModel) {
    return this.httpClient.post(this.url, catalogue);
  }

  updateCatalogue(catalogue : CatalogueModel) {
    return this.httpClient.put(this.url+catalogue.id, catalogue);
  }

  deleteCatalogue(idCatalogue : number) {
    return this.httpClient.delete(this.url+idCatalogue);
  }

}
