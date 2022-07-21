import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProduitModel} from "../models/produit.model";
import {LentilleModel} from "../models/lentille.model";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  //url = 'http://localhost:8080/produit/';

  listProduits : ProduitModel[];
  listProduitSubject = new Subject<ProduitModel[]>();
  emitlistProduitSubject(){
    this.listProduitSubject.next(this.listProduits.slice());
  }

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'produit/';
  }

  getAllProduits() {
    return this.httpClient.get<any[]>(this.url).subscribe(
      (produits: ProduitModel[]) => {
        this.listProduits = produits;
        this.emitlistProduitSubject();
      }
    );
  }

  filterProduits(str : string) {
    return this.httpClient.get<any[]>(this.url+"filterProduit?str="+str).subscribe(
      (produits: ProduitModel[]) => {
        this.listProduits = produits;
        this.emitlistProduitSubject();
      }
    );
  }

 /* getProduitById(idProduit : number) {
    return this.httpClient.get<any>(this.url+idProduit);
  }

  updateProduit(produit : ProduitModel, idProduit : number) {
    return this.httpClient.put(this.url+idProduit, produit);
  }

  deleteProduit(idProduit : number) {
    return this.httpClient.delete(this.url+idProduit);
  }*/

}
