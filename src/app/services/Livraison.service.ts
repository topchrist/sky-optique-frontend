import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProduitModel} from "../models/produit.model";
import {LentilleModel} from "../models/lentille.model";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {LivraisonModel} from "../models/livraison.model";

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  url = 'https://sky-optique-back2.herokuapp.com/livraison/';

  listLivraisons : LivraisonModel[];
  listLivraisonSubject = new Subject<LivraisonModel[]>();
  emitListLivraisonSubject(){
    this.listLivraisonSubject.next(this.listLivraisons.slice());
  }
  constructor(private httpClient: HttpClient) { }

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
