import {FactureClientModel} from "./factureClient.model";
import {CompagniModel} from "./compagni.model";

export class BordereauModel {

  constructor(
    public dateDebut:Date,
    public dateFin:Date,
    public factureClients?:FactureClientModel[],
    public assurance?:CompagniModel,
    public numero?:string,
    public createAt?: Date,
    public id?:number,
  ){}

}
