import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {FactureClientModel} from "../models/factureClient.model";

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  url = 'https://sky-optique-back2.herokuapp.com/factureClient/';
  // @ts-ignore
  listFactureClients : FactureClientModel[];
  listFactureClientSubject = new Subject<FactureClientModel[]>();
  emitlistFactureClientSubject(){
    this.listFactureClientSubject.next(this.listFactureClients);
  }

  constructor(private httpClient: HttpClient) { }

  getAllFactureClients() {
    this.httpClient.get<FactureClientModel[]>(this.url).subscribe(
      (data: FactureClientModel[]) => {
        console.log(data);
        this.listFactureClients = data;
        this.emitlistFactureClientSubject();
      }
    );
  }

  getAllFactureClientsWithoutBordereau() {
    return this.httpClient.get<FactureClientModel[]>(this.url+'wbordereau/');
  }

  getFactureClientById(idFacture : number) {
    return this.httpClient.get<any>(this.url+idFacture);
  }

  addFactureClient(facture : FactureClientModel) {
    return this.httpClient.post(this.url, facture);
  }

  updateFactureClient(facture : FactureClientModel) {
    return this.httpClient.put(this.url+facture.id, facture);
  }

  deleteFactureClient(idFacture : number) {
    return this.httpClient.delete(this.url+idFacture);
  }

}
