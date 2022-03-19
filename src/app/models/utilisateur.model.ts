import {AgenceModel} from "./agence.model";

export class UtilisateurModel {

  constructor(
    public pseudo:string,
    public password:string,
    public nom:string,
    public prenom?:string,
    public email?:string,
    public adresse?:string,
    public tel1?:string,
    public id?:number,
  ){}

}
