import {FactureModel} from "./facture.model";
import {StockModel} from "./stockModel";

export class VenteModel {

  constructor(
    public pu:number,
    public qte:number,
    public montant:number,
    public remise:number,
    public total:number,
    public tva?:number,
    public stock?: StockModel,
    public facture?: FactureModel,
    public libelle?: string,
    public id?:number,
  ){}

}
