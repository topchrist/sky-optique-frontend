import {PersonneModel} from "./personne.model";

export class PrescripteurModel extends PersonneModel{

  constructor(
    public id?:number
  ) {
    super();
  }

}
