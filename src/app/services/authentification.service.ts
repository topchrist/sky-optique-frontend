import { Injectable } from '@angular/core';
import { UtilisateurModel } from '../models/utilisateur.model';
import { Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "./url.service";

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

  url: string;

  constructor(private httpClient: HttpClient, urlService : UrlService) {
    this.url = urlService.url+'utilisateur/';
  }

  authenticate(utilisateur : UtilisateurModel) {
    return this.httpClient
      .post(this.url, utilisateur);
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
