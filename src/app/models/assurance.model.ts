import {CompagniModel} from "./compagni.model";

export class AssuranceModel extends CompagniModel{

  constructor(

    public id?:number,
  ) {
    super(null);
  }

}
