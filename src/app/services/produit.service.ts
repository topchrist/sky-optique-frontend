import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProduitModel} from "../models/produit.model";
import {LentilleModel} from "../models/lentille.model";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  url = 'https://sky-optique-back2.herokuapp.com/produit/';

  listProduits : ProduitModel[];
  listProduitSubject = new Subject<ProduitModel[]>();
  emitlistProduitSubject(){
    this.listProduitSubject.next(this.listProduits.slice());
  }
  constructor(private httpClient: HttpClient) { }

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
