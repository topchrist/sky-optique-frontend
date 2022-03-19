import {ProduitModel} from "./produit.model";
import {PrescriptionModel} from "./prescription.model";
import {CatalogueModel} from "./catalogue.model";

export class LentilleModel extends ProduitModel{

  constructor(
    //public type:string,
    public sphere:number,
    public cylindre:number,
    public axe?:number,
    public addition?:number,
    public catalogue?:CatalogueModel,
    public id?:number
  ){
    super(null, null);
  }

}
