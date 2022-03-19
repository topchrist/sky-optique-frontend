import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
 import {LentilleService} from "../services/lentille.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";

@Component({
  selector: 'app-list-lentilles',
  templateUrl: './list-lentilles.component.html',
  styleUrls: ['./list-lentilles.component.css']
})
export class ListLentillesComponent implements OnInit {

  loading = false;
  lentilles: LentilleModel[];
  stocks: StockModel[];
  listLentilleSubscription : Subscription;

  constructor(private stockService : StockService, private lentilleService : LentilleService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listLentilleSubscription = this.stockService.listStockLentilleSubject.subscribe(
      (data: StockModel[]) => {
        this.stocks = data;
        console.log(data);
        this.loading = false;
      }
    );
    this.stockService.getAllStockLentille();
  }

  ngOnDestroy(): void {
    this.listLentilleSubscription.unsubscribe();
  }

  deleteLentille(id: number) {
    this.loading = true;
    this.lentilleService.deleteLentille(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.stockService.getAllStockLentille();
      });

    this.loading = false;
  }

}
