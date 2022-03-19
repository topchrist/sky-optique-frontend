import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurModel } from '../models/utilisateur.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  utilisateur = new UtilisateurModel('', '', '');

  constructor(private authentificationService : AuthentificationService, private router: Router) { }

  ngOnInit() {
    //window.sessionStorage.removeItem('token');

  }

  onSubmit(form: NgForm) {
    this.utilisateur.pseudo = (<string> form.value['utilisateur_Pseudo']).trim();
    this.utilisateur.password = (<string> form.value['utilisateur_Password']).trim();
    this.loading = true;
    console.log(this.utilisateur);
    this.authentificationService.authenticate(this.utilisateur).subscribe(data=>{
      console.log(data);

      if (data != null) {
        // @ts-ignore
        this.utilisateur = data;
        console.log(this.utilisateur);
        this.onLogin(this.utilisateur)
        this.router.navigate(['/home']);
      } else {
        this.loading = false;
      }
      this.loading = false;
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  onLogin(utilisateur : UtilisateurModel) {
    // @ts-ignore
    sessionStorage.setItem('id', utilisateur.id.toString());
    sessionStorage.setItem('pseudo', utilisateur.pseudo);
    sessionStorage.setItem('nom', utilisateur.nom);
    this.authentificationService.emitIsLoginSubject();
  }

}
