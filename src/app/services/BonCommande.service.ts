import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {BonCommandeModel} from "../models/bonCommande.model";

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {

  url = 'https://sky-optique-back2.herokuapp.com/bonCommande/';

  listBonCommandes : BonCommandeModel[];
  listBonCommandeSubject = new Subject<BonCommandeModel[]>();
  emitListBonCommandeModelSubject(){
    this.listBonCommandeSubject.next(this.listBonCommandes.slice());
  }
  constructor(private httpClient: HttpClient) { }

  getAllBonCommande() {
    return this.httpClient.get<any[]>(this.url).subscribe(
      (data) => {
        // @ts-ignore
        this.listBonCommandes = data;
        this.emitListBonCommandeModelSubject();
      }
    );
  }

  getBonCommandeById(idBonCommande : number) {
    return this.httpClient.get<any>(this.url+idBonCommande);
  }

  getFournisseurByIdBonCommande(idBonCommande : number) {
    return this.httpClient.get<any>(this.url+idBonCommande+"/fournisseur");
  }

  addBonCommande(bonLivraison : BonCommandeModel) {
    return this.httpClient.post(this.url, bonLivraison);
  }

  updateBonCommande(bonCommande : BonCommandeModel, idBonCommande : number) {
    return this.httpClient.put(this.url+idBonCommande, bonCommande);
  }

  deleteBonCommande(idBonCommande : number) {
    return this.httpClient.delete(this.url+idBonCommande);
  }

}
