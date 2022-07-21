import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class LentilleService {

  //url = 'http://localhost:8080/lentille/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'lentille/';
  }

  getAllLentilles() {
    this.httpClient.get<LentilleModel[]>(this.url);
  }

  getLentilleById(idLentille : number) {
    return this.httpClient.get<any>(this.url+idLentille);
  }

  addLentille(lentille : LentilleModel) {
    return this.httpClient.post(this.url, lentille);
  }

  updateLentille(lentille : LentilleModel) {
    return this.httpClient.put(this.url+lentille.id, lentille);
  }

  deleteLentille(idLentille : number) {
    return this.httpClient.delete(this.url+idLentille);
  }

}
