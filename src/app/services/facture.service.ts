import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {FactureModel} from "../models/facture.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  //url = 'http://localhost:8080/facture/';
  // @ts-ignore
  listFactures : FactureModel[];
  listFactureSubject = new Subject<FactureModel[]>();
  emitlistFactureSubject(){
    this.listFactureSubject.next(this.listFactures);
  }

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'facture/';
  }

  getAllFactures() {
    this.httpClient.get<FactureModel[]>(this.url).subscribe(
      (data: FactureModel[]) => {
        console.log(data);
        this.listFactures = data;
        this.emitlistFactureSubject();
      }
    );
  }

  getFactureById(idFacture : number) {
    return this.httpClient.get<any>(this.url+idFacture);
  }

  addFacture(facture : FactureModel) {
    return this.httpClient.post(this.url, facture);
  }

  updateFacture(facture : FactureModel) {
    return this.httpClient.put(this.url+facture.id, facture);
  }

  deleteFacture(idFacture : number) {
    return this.httpClient.delete(this.url+idFacture);
  }

}
