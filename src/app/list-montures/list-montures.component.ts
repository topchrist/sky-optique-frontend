import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {StockService} from "../services/stock.service";
import {StockModel} from "../models/stockModel";

@Component({
  selector: 'app-list-montures',
  templateUrl: './list-montures.component.html',
  styleUrls: ['./list-montures.component.css']
})
export class ListMonturesComponent implements OnInit {

  loading = false;
  // @ts-ignore
  montures: MontureModel[];
  stocks: StockModel[];
  // @ts-ignore
  listMontureSubscription : Subscription;
  constructor(private stockService : StockService, private montureService : MontureService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listMontureSubscription = this.stockService.listStockMontureSubject.subscribe(
      (data: StockModel[]) => {
        this.stocks = data;
      }
    );
    this.stockService.getAllStockMonture();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.listMontureSubscription.unsubscribe();
  }

  deleteMonture(id: number) {
    this.loading = true;
    this.montureService.deleteMonture(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.stockService.getAllStockMonture();
      });

    this.loading = false;
  }

}
