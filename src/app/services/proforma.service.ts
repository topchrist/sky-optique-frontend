import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProformaModel} from "../models/Proforma.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class ProformaService {

  //url = 'http://localhost:8080/proforma/';

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'proforma/';
  }

  getAllPagesProformas(request) {
    const params = request;
    return this.httpClient.get<ProformaModel[]>(this.url+"find", { params });
  }

  getAllProformas() {
    return this.httpClient.get<ProformaModel[]>(this.url);
  }

  getProformaById(idProforma : number) {
    return this.httpClient.get<any>(this.url+idProforma);
  }

  addProforma(proforma : ProformaModel) {
    return this.httpClient.post(this.url, proforma);
  }

  updateProforma(proforma : ProformaModel) {
    return this.httpClient.put(this.url+proforma.id, proforma);
  }

  deleteProforma(idProforma : number) {
    return this.httpClient.delete(this.url+idProforma);
  }

}
