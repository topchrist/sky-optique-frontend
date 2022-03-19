import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import {Subject} from "rxjs";
import {BordereauModel} from "../models/bordereau.model";

@Injectable({
  providedIn: 'root'
})
export class BordereauService {

  url = 'https://sky-optique-back2.herokuapp.com/bordereau/';
  // @ts-ignore
  listBordereau : BordereauModel[];
  listBordereauSubject = new Subject<BordereauModel[]>();
  emitlistBordereauSubject(){
    this.listBordereauSubject.next(this.listBordereau);
  }

  constructor(private httpClient: HttpClient) { }

  getAllBordereau() {
    this.httpClient.get<BordereauModel[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        this.listBordereau = data;
        this.emitlistBordereauSubject();
      }
    );
  }

  getBordereauById(idBordereau : number) {
    return this.httpClient.get<any>(this.url+idBordereau);
  }

  addBordereau(bordereau : BordereauModel) {
    return this.httpClient.post(this.url, bordereau);
  }

  /*updateBordereau(bordereau : BordereauModel) {
    return this.httpClient.put(this.url+bordereau.id, bordereau);
  }*/

  deleteBordereau(idBordereau : number) {
    return this.httpClient.delete(this.url+idBordereau);
  }

}
