import {ProduitModel} from "./produit.model";
import {StockModel} from "./stockModel";
import {BonLivraisonModel} from "./bonLivraison.model";

export class LivraisonModel {

  constructor(
    public prixAchat : number,
    public qte : number,
    //public prixVente:number,
    //public lot? : StockModel,
    public produit? : ProduitModel,
    public bonLivraison? : BonLivraisonModel,
    public id? : number,
    ){}

}
