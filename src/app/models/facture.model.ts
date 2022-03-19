import {VenteModel} from "./vente.model";
import {PersonneModel} from "./personne.model";
import {PrescriptionModel} from "./prescription.model";
import {CouvertureModel} from "./couverture.model";

export class FactureModel {

  constructor(
    public numero?:string,
    public patient?:PersonneModel,
    public ventes?:VenteModel[],
    public prescription?: PrescriptionModel,
    public createAt?: Date,

    public totalFacture?: number,
    public totalCouverture?: number,
    public totalFranchise?: number,
    public couvertures?:CouvertureModel[],
    public id?:number,
  ){}

}
