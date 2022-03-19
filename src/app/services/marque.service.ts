import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {MarqueModel} from "../models/marque.model";

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  url = 'https://sky-optique-back2.herokuapp.com/marque/';
  // @ts-ignore
  listMarques : MarqueModel[];
  listMarqueSubject = new Subject<MarqueModel[]>();
  emitListMarqueSubject(){
    this.listMarqueSubject.next(this.listMarques.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllMarques() {
    this.httpClient.get<MarqueModel[]>(this.url).subscribe(
      (data: any[]) => {
        // @ts-ignore
        this.listMarques = data;
        this.emitListMarqueSubject();
      }
    );
  }

  getMarqueById(idMarque : number) {
    return this.httpClient.get<any>(this.url+idMarque);
  }

  addMarque(marque : MarqueModel) {
    return this.httpClient.post(this.url, marque);
  }

  updateMarque(marque : MarqueModel) {
    return this.httpClient.put(this.url+marque.id, marque);
  }

  deleteMarque(idMarque : number) {
    return this.httpClient.delete(this.url+idMarque);
  }

}
