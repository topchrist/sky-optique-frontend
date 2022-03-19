import {FournisseurModel} from "./fournisseur.model";
import {CommandeModel} from "./commande.model";

export class BonCommandeModel {

  constructor(
    public reference : string,
    public fournisseur? : FournisseurModel,
    public commandes? : CommandeModel[],
    public id? : number,
  ){}

}
