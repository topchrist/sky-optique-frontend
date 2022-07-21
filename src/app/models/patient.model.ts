import {PersonneModel} from "./personne.model";

export class PatientModel extends PersonneModel{

  constructor(
    public id?:number,
  ) {
    super();
  }

}
