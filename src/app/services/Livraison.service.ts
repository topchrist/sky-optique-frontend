import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProduitModel} from "../models/produit.model";
import {LentilleModel} from "../models/lentille.model";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {LivraisonModel} from "../models/livraison.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  //url = 'http://localhost:8080/livraison/';

  listLivraisons : LivraisonModel[];
  listLivraisonSubject = new Subject<LivraisonModel[]>();
  emitListLivraisonSubject(){
    this.listLivraisonSubject.next(this.listLivraisons.slice());
  }
  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'livraison/';
  }

  getAllLivraison() {
    return this.httpClient.get<LivraisonModel[]>(this.url).subscribe(
      (data) => {
        // @ts-ignore
        this.listBonLivraisons = data;
        this.emitListLivraisonSubject();
      }
    );
  }

  getAllLivraisonByBonLivraison(idBonLivraison : number) {
    return this.httpClient.get<LivraisonModel[]>(this.url).subscribe(
      (data) => {
        // @ts-ignore
        this.listBonLivraisons = data;
        this.emitListLivraisonSubject();
      }
    );
  }

  getLivraisonById(idLivraison : number) {
    return this.httpClient.get<any>(this.url+idLivraison);
  }

  addLivraison(livraison : LivraisonModel) {
    return this.httpClient.post(this.url, livraison);
  }

  updateLivraison(livraison : LivraisonModel, idLivraison : number) {
    return this.httpClient.put(this.url+idLivraison, livraison);
  }

  deleteLivraison(idLivraison : number) {
    return this.httpClient.delete(this.url+idLivraison);
  }

}
