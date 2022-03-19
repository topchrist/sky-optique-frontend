import {ProduitModel} from "./produit.model";
import {MarqueModel} from "./marque.model";

export class MontureModel extends ProduitModel{

  constructor(
    public reference:string,
    public modele:string,
    public matiere:string,
    public genre:string,
    public taille:string,
    public forme?:string,
    public coloris?:string,
    public lngBrn?:string,
    public catAge?:string,
    public marque?:MarqueModel,
    public id?:number
  ) {
    super(null, null);
  }

}
