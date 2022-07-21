import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {FactureClientModel} from "../models/factureClient.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  //url = 'http://localhost:8080/factureClient/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'factureClient/';
  }

  getAllFactureClients() {
    return this.httpClient.get<FactureClientModel[]>(this.url);
  }

  getAllFactureClientsWithoutBordereau() {
    return this.httpClient.get<FactureClientModel[]>(this.url+'wbordereau/');
  }

  getFactureClientById(idFacture : number) {
    return this.httpClient.get<any>(this.url+idFacture);
  }

  addFactureClient(facture : FactureClientModel) {
    return this.httpClient.post(this.url, facture);
  }

  updateFactureClient(facture : FactureClientModel) {
    return this.httpClient.put(this.url+facture.id, facture);
  }

  deleteFactureClient(idFacture : number) {
    return this.httpClient.delete(this.url+idFacture);
  }

}
