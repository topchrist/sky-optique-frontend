import {EntiteModel} from "./entite.model";


export class CompagniModel extends EntiteModel{

  constructor(
    public type?: string,
    public discriminator?: string,
    public rccm?: string,
    public id?:number,
  ) {
    super(null);
  }

}
