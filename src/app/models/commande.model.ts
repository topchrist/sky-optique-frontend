import {ProduitModel} from "./produit.model";
import {BonCommandeModel} from "./bonCommande.model";

export class CommandeModel {

  constructor(
    public qte : number,
    public produit? : ProduitModel,
    public bonCommande? : BonCommandeModel,
    public id? : number,
    ){}

}
