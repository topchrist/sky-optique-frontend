import {PersonneModel} from "./personne.model";
import {FactureModel} from "./facture.model";

export class ReglementModel {

  constructor(
    public dateReglement: string,
    public montant: number,
    public entite: PersonneModel,
    public facture: FactureModel,
    public id?:number,
  ){}

}
