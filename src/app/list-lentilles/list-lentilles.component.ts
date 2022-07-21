import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
 import {LentilleService} from "../services/lentille.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-lentilles',
  templateUrl: './list-lentilles.component.html',
  styleUrls: ['./list-lentilles.component.css']
})
export class ListLentillesComponent implements OnInit {

  lentilles: LentilleModel[];
  stocks: StockModel[];

  constructor(private spinnerService: NgxSpinnerService, private stockService : StockService, private lentilleService : LentilleService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.stockService.getAllStockLentille().subscribe(
  (data: StockModel[]) => {
    this.stocks = data;
    this.spinnerService.hide();
    }, error => {
        console.log('Error ! : ' + error);
        this.spinnerService.hide();
    });
  }

  deleteLentille(id: number) {
    this.spinnerService.show();
    this.lentilleService.deleteLentille(id).subscribe( data =>{
        console.log("ok deleting");
      this.stockService.getAllStockLentille().subscribe(
          (data: StockModel[]) => {
              this.stocks = data;
              this.spinnerService.hide();
          }, error => {
              console.log('Error ! : ' + error);
              this.spinnerService.hide();
          });
      }, error => {
          this.spinnerService.hide();
          console.log('Error ! : ' + error);
      });

  }

}
