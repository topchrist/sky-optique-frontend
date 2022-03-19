import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {UtilisateurModel} from "../models/utilisateur.model";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  url = 'https://sky-optique-back2.herokuapp.com/utilisateur/';
  // @ts-ignore
  listUtilisateurs : UtilisateurModel[];
  listUtilisateurSubject = new Subject<UtilisateurModel[]>();
  emitListUtilisateurSubject(){
    this.listUtilisateurSubject.next(this.listUtilisateurs.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllUtilisateurs() {
    this.httpClient.get<UtilisateurModel[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listUtilisateurs = data;
        this.emitListUtilisateurSubject();
      }
    );
  }

  getUtilisateurById(idUtilisateur : number) {
    return this.httpClient.get<any>(this.url+idUtilisateur);
  }

  addUtilisateur(utilisateur : UtilisateurModel) {
    return this.httpClient.post(this.url, utilisateur);
  }

  updateUtilisateur(utilisateur : UtilisateurModel) {
    return this.httpClient.put(this.url+utilisateur.id, utilisateur);
  }

  deleteUtilisateur(idUtilisateur : number) {
    return this.httpClient.delete(this.url+idUtilisateur);
  }

}
