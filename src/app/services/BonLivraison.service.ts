import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonService {

  //url = 'http://localhost:8080/bonLivraison/';

  listBonLivraisons : BonLivraisonModel[];
  listBonLivraisonSubject = new Subject<BonLivraisonModel[]>();
  emitListBonLivraisonSubject(){
    this.listBonLivraisonSubject.next(this.listBonLivraisons.slice());
  }
  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'bonLivraison/';
  }

  getAllBonLivraison() {
    return this.httpClient.get<BonLivraisonModel[]>(this.url).subscribe(
      (data) => {
        // @ts-ignore
        this.listBonLivraisons = data;
        this.emitListBonLivraisonSubject();
      }
    );
  }

  getBonLivraisonById(idBonLivraison : number) {
    return this.httpClient.get<any>(this.url+idBonLivraison);
  }

  getFournisseurByIdBonLivraison(idBonLivraison : number) {
    return this.httpClient.get<any>(this.url+idBonLivraison+"/fournisseur");
  }

  addBonLivraison(bonLivraison : BonLivraisonModel) {
    return this.httpClient.post(this.url, bonLivraison);
  }

  updateBonLivraison(bonLivraison : BonLivraisonModel, idBonLivraison : number) {
    return this.httpClient.put(this.url+idBonLivraison, bonLivraison);
  }

  deleteBonLivraison(idBonLivraison : number) {
    return this.httpClient.delete(this.url+idBonLivraison);
  }

}
