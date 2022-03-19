import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";

@Injectable({
  providedIn: 'root'
})
export class LentilleService {

  url = 'https://sky-optique-back2.herokuapp.com/lentille/';
  // @ts-ignore
  listLentilles : LentilleModel[];
  listLentilleSubject = new Subject<LentilleModel[]>();
  emitlistLentilleSubject(){
    this.listLentilleSubject.next(this.listLentilles);
  }

  constructor(private httpClient: HttpClient) { }

  getAllLentilles() {
    this.httpClient.get<LentilleModel[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        this.listLentilles = data;
        this.emitlistLentilleSubject();
      }
    );
  }

  getLentilleById(idLentille : number) {
    return this.httpClient.get<any>(this.url+idLentille);
  }

  addLentille(lentille : LentilleModel) {
    return this.httpClient.post(this.url, lentille);
  }

  updateLentille(lentille : LentilleModel) {
    return this.httpClient.put(this.url+lentille.id, lentille);
  }

  deleteLentille(idLentille : number) {
    return this.httpClient.delete(this.url+idLentille);
  }

}
