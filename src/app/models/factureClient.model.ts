import {ReglementModel} from "./reglement.model";
import {VenteModel} from "./vente.model";
import {CouvertureModel} from "./couverture.model";
import {PersonneModel} from "./personne.model";
import {PrescriptionModel} from "./prescription.model";
import {FactureModel} from "./facture.model";

export class FactureClientModel extends FactureModel{

  constructor(
    public reglements?:ReglementModel[],
    public id?:number,
    public checked?: boolean
  ) {
    super();
  }

}
