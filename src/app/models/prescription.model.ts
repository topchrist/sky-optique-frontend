import {PersonneModel} from "./personne.model";

export class PrescriptionModel {

  constructor(
    public datePrescription: Date,
    public deadline: Date,
    public eyeVision: String,
    public port: String,
    public prescripteur?: PersonneModel,
    public id?:number
  ){}

}
