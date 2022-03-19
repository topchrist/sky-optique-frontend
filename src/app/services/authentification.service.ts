import { Injectable } from '@angular/core';
import { UtilisateurModel } from '../models/utilisateur.model';
import { Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {


  isLogin = false ;
  isLoginSubject = new Subject<boolean>();
  emitIsLoginSubject(){
    this.isLogin = true ;
    this.isLoginSubject.next(this.isLogin);
  }
  emitIsLogoutSubject(){
    this.isLogin = false ;
    this.isLoginSubject.next(this.isLogin);
  }

  constructor(private httpClient: HttpClient) { }

  authenticate(utilisateur : UtilisateurModel) {
    return this.httpClient
      .post('https://sky-optique-back2.herokuapp.com/utilisateur/login/', utilisateur);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('pseudo');
    if(!(user === null)){
      //this.emitIsLoginSubject();
      return true
    }
    return false;
  }





}
