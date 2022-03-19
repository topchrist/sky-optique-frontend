import {FactureModel} from "./facture.model";
import {PersonneModel} from "./personne.model";
import {CompagniModel} from "./compagni.model";
import {AssuranceModel} from "./assurance.model";

export class CouvertureModel {

  constructor(

    public couvertureVerre: string,
    public couvertureMonture: string,
    public dateDocument: string,
    public numeroDocument: string,
    public priseEnCharge: number,
    public franchise: number,
    public facture?: FactureModel,
    public assurance?: AssuranceModel,
    public entreprise?: CompagniModel,
    public assurePrincipal?: PersonneModel,
    public relation?: string,
    public id?:number,

  ){}

}
