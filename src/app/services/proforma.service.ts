import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProformaModel} from "../models/Proforma.model";

@Injectable({
  providedIn: 'root'
})
export class ProformaService {

  url = 'https://sky-optique-back2.herokuapp.com/proforma/';
  // @ts-ignore
  listProformas : ProformaModel[];
  listProformaSubject = new Subject<ProformaModel[]>();
  emitlistProformaSubject(){
    this.listProformaSubject.next(this.listProformas);
  }

  constructor(private httpClient: HttpClient) { }

  getAllProformas() {
    this.httpClient.get<ProformaModel[]>(this.url).subscribe(
      (data: ProformaModel[]) => {
        console.log(data);
        this.listProformas = data;
        this.emitlistProformaSubject();
      }
    );
  }

  getProformaById(idProforma : number) {
    return this.httpClient.get<any>(this.url+idProforma);
  }

  addProforma(proforma : ProformaModel) {
    return this.httpClient.post(this.url, proforma);
  }

  updateProforma(proforma : ProformaModel) {
    return this.httpClient.put(this.url+proforma.id, proforma);
  }

  deleteProforma(idProforma : number) {
    return this.httpClient.delete(this.url+idProforma);
  }

}
