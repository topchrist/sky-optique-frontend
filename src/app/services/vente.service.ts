import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {VenteModel} from "../models/vente.model";

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  url = 'https://sky-optique-back2.herokuapp.com/vente/';
  // @ts-ignore
  listVentes : VenteModel[];
  listVenteSubject = new Subject<VenteModel[]>();
  emitlistVenteSubject(){
    this.listVenteSubject.next(this.listVentes);
  }

  constructor(private httpClient: HttpClient) { }

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
