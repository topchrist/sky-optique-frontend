export class ProduitModel {

  constructor(
    public discriminator: string,
    public libelle: string,
    public id? : number
  ){}

}
