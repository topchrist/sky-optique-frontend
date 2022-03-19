import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  loading = false;
  constructor(private authentificationService : AuthentificationService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.onLogOut();
    this.router.navigate(['/login']);
  }

  onLogOut() {
    sessionStorage.removeItem('pseudo');
    sessionStorage.removeItem('nom');
    this.authentificationService.emitIsLogoutSubject();
  }


}
