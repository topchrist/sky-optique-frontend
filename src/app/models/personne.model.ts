import {EntiteModel} from "./entite.model";
import {FactureModel} from "./facture.model";
import {CompagniModel} from "./compagni.model";

export class PersonneModel extends EntiteModel{

  constructor(
    public prenom?: string,
    public dateNaiss?:string,
    public civilite?:string,
    public entreprise?: CompagniModel,
    public factures?: FactureModel[],
    public discriminator?: string,
    public id?:number,
  ) {
    super(null);
  }

}
