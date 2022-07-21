import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {VenteModel} from "../models/vente.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  //url = 'http://localhost:8080/vente/';
  // @ts-ignore
  listVentes : VenteModel[];
  listVenteSubject = new Subject<VenteModel[]>();
  emitlistVenteSubject(){
    this.listVenteSubject.next(this.listVentes);
  }

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'vente/';
  }

  getAllVentes() {
    this.httpClient.get<VenteModel[]>(this.url).subscribe(
      (data: VenteModel[]) => {
        console.log(data);
        this.listVentes = data;
        this.emitlistVenteSubject();
      }
    );
  }

  getAllVentesByIdFacture(idFacture : number) {
    return this.httpClient.get<any>(this.url+idFacture);
  }

  getVenteById(idVente : number) {
    return this.httpClient.get<any>(this.url+idVente);
  }

  addVente(vente : VenteModel) {
    return this.httpClient.post(this.url, vente);
  }

  updateVente(vente : VenteModel) {
    return this.httpClient.put(this.url+vente.id, vente);
  }

  deleteVente(idVente : number) {
    return this.httpClient.delete(this.url+idVente);
  }

}
