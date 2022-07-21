import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import {Subject} from "rxjs";
import {BordereauModel} from "../models/bordereau.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class BordereauService {

  //url = 'http://localhost:8080/bordereau/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'bordereau/';
  }

  getAllBordereau() {
    return this.httpClient.get<BordereauModel[]>(this.url);
  }

  getBordereauById(idBordereau : number) {
    return this.httpClient.get<any>(this.url+idBordereau);
  }

  addBordereau(bordereau : BordereauModel) {
    return this.httpClient.post(this.url, bordereau);
  }

  /*updateBordereau(bordereau : BordereauModel) {
    return this.httpClient.put(this.url+bordereau.id, bordereau);
  }*/

  deleteBordereau(idBordereau : number) {
    return this.httpClient.delete(this.url+idBordereau);
  }

}
