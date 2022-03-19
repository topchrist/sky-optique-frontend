import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {StockModel} from "../models/stockModel";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  url = 'https://sky-optique-back2.herokuapp.com/stock/';

  listStocks : StockModel[];
  listStockSubject = new Subject<StockModel[]>();
  emitListStockSubject(){
    this.listStockSubject.next(this.listStocks.slice());
  }

  listStockMonture : StockModel[];
  listStockMontureSubject = new Subject<StockModel[]>();
  emitListStockMontureSubject(){
    this.listStockMontureSubject.next(this.listStockMonture.slice());
  }

  listStockLentille : StockModel[];
  listStockLentilleSubject = new Subject<StockModel[]>();
  emitListStockLentilleSubject(){
    this.listStockLentilleSubject.next(this.listStockLentille.slice());
  }



  constructor(private httpClient: HttpClient) { }

  getAllStocks() {
    return this.httpClient.get<any[]>(this.url).subscribe(
      (data: StockModel[]) => {
        this.listStocks = data;
        this.emitListStockSubject();
      }
    );
  }
  getAllStockMonture() {
    return this.httpClient.get<any[]>(this.url+'monture/').subscribe(
      (data: StockModel[]) => {
        this.listStockMonture = data;
        this.emitListStockMontureSubject();
      }
    );
  }
  getAllStockLentille() {
    return this.httpClient.get<any[]>(this.url+'lentille/').subscribe(
      (data: StockModel[]) => {
        this.listStockLentille = data;
        this.emitListStockLentilleSubject();
      }
    );
  }

  getAllStocksByQte(qte : number) {
    return this.httpClient.get<any[]>(this.url+'stockByQte/'+qte).subscribe(
      (data: StockModel[]) => {
        this.listStocks = data;
        this.emitListStockSubject();
      }
    );
  }

  getStockById(idStock : number) {
    return this.httpClient.get<any>(this.url+idStock);
  }

  addStock(stock : StockModel) {
    return this.httpClient.post(this.url, stock);
  }
  addStockMonture(stock : StockModel) {
    return this.httpClient.post(this.url+'monture/', stock);
  }
  addStockLentille(stock : StockModel) {
    return this.httpClient.post(this.url+'lentille/', stock);
  }

  updateStock(stock : StockModel) {
    return this.httpClient.put(this.url+stock.id, stock);
  }
  updateStockMonture(stock : StockModel) {
    return this.httpClient.put(this.url+'monture/'+stock.id, stock);
  }
  updateStockLentille(stock : StockModel) {
    return this.httpClient.put(this.url+'lentille/'+stock.id, stock);
  }

  deleteStock(idStock : number) {
    return this.httpClient.delete(this.url+idStock);
  }

}
