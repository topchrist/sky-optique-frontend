import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {MarqueModel} from "../models/marque.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'marque/';
  }

  getAllPagesMarques(request) {
    const params = request;
    return this.httpClient.get<MarqueModel[]>(this.url+"find", { params });
  }

  getAllMarques() {
    return this.httpClient.get<MarqueModel[]>(this.url);
  }

  getMarqueById(idMarque : number) {
    return this.httpClient.get<any>(this.url+idMarque);
  }

  addMarque(marque : MarqueModel) {
    return this.httpClient.post(this.url, marque);
  }

  updateMarque(marque : MarqueModel) {
    return this.httpClient.put(this.url+marque.id, marque);
  }

  deleteMarque(idMarque : number) {
    return this.httpClient.delete(this.url+idMarque);
  }

}
