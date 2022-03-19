import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MarqueService} from "../services/marque.service";
import {MarqueModel} from "../models/marque.model";

@Component({
  selector: 'app-list-marques',
  templateUrl: './list-marques.component.html',
  styleUrls: ['./list-marques.component.css']
})
export class ListMarquesComponent implements OnInit {

  loading = false;
  marques: MarqueModel[];
  listSubscription : Subscription;

  constructor(private marqueService : MarqueService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listSubscription = this.marqueService.listMarqueSubject.subscribe(
      (data: MarqueModel[]) => {
        this.marques = data;
        this.loading = false;
      }
    );
    this.marqueService.getAllMarques();
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
  }

  deleteMarque(id: number) {
    this.loading = true;
    this.marqueService.deleteMarque(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.marqueService.getAllMarques();
      });

    this.loading = false;
  }


}
