import {LivraisonModel} from "./livraison.model";
import {FournisseurModel} from "./fournisseur.model";

export class BonLivraisonModel {

  constructor(
    public reference : string,
    public dateLivraison : string,
    public fournisseur? : FournisseurModel,
    public livraisons? : LivraisonModel[],
    public id? : number,
  ){}

}
