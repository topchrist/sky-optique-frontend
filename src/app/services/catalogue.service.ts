import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {CatalogueModel} from "../models/catalogue.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  //url = 'http://localhost:8080/catalogue/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'catalogue/';
  }

  getAllCatalogues() {
    return this.httpClient.get<CatalogueModel[]>(this.url);
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
