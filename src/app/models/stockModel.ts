import {ProduitModel} from "./produit.model";
import {LivraisonModel} from "./livraison.model";

export class StockModel {

  constructor(
    public prixVente:number,
    public qte:number,
    public remiseMax:number,
    public etat:string,
    //public minimum:number,
    public produit? : ProduitModel,
    public id?:number
  ){}

}
