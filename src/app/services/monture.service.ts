import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MontureService {

  url = 'https://sky-optique-back2.herokuapp.com/monture/';
  // @ts-ignore
  listMontures : MontureModel[];
  listMontureSubject = new Subject<MontureModel[]>();
  emitlistMontureSubject(){
    this.listMontureSubject.next(this.listMontures.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllMontures() {
    this.httpClient.get<MontureModel[]>(this.url).subscribe(
      (data: any[]) => {
        // @ts-ignore
        this.listMontures = data;
        this.emitlistMontureSubject();
      }
    );
  }

  getMontureById(idMonture : number) {
    return this.httpClient.get<any>(this.url+idMonture);
  }

  addMonture(monture : MontureModel) {
    return this.httpClient.post(this.url, monture);
  }

  updateMonture(monture : MontureModel) {
    return this.httpClient.put(this.url+monture.id, monture);
  }

  deleteMonture(idMonture : number) {
    return this.httpClient.delete(this.url+idMonture);
  }

}
