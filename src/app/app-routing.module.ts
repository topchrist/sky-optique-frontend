import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGaurdService } from './services/auth-gaurd.service';
import {ListMonturesComponent} from "./list-montures/list-montures.component";
import {EditMontureComponent} from "./edit-monture/edit-monture.component";
import {EditLentilleComponent} from "./edit-lentille/edit-lentille.component";
import {ListLentillesComponent} from "./list-lentilles/list-lentilles.component";
import {ListLivraisonsComponent} from "./list-livraisons/list-livraisons.component";
import {EditLivraisonComponent} from "./edit-livraison/edit-livraison.component";
import {ListBonLivraisonsComponent} from "./list-bon-livraisons/list-bon-livraisons.component";
import {EditBonLivraisonComponent} from "./edit-bon-livraison/edit-bon-livraison.component";
import {ListFournisseursComponent} from "./list-fournisseurs/list-fournisseurs.component";
import {EditFournisseurComponent} from "./edit-fournisseur/edit-fournisseur.component";
import {ListMarquesComponent} from "./list-marques/list-marques.component";
import {EditMarqueComponent} from "./edit-marque/edit-marque.component";
import {ListBonCommandesComponent} from "./list-bon-commandes/list-bon-commandes.component";
import {EditBonCommandeComponent} from "./edit-bon-commande/edit-bon-commande.component";
import {AddFactureComponent} from "./add-facture/add-facture.component";
import {UpdateFactureComponent} from "./update-facture/update-facture.component";
import {ListFacturesComponent} from "./list-factures/list-factures.component";
import {EditEntrepriseComponent} from "./edit-entreprise/edit-entreprise.component";
import {ListEntreprisesComponent} from "./list-entreprises/list-entreprises.component";
import {EditPersonneComponent} from "./edit-personne/edit-personne.component";
import {ListPersonnesComponent} from "./list-personnes/list-personnes.component";
import {AddProformaComponent} from "./add-proforma/add-proforma.component";
import {PrintProformaComponent} from "./print-proforma/print-proforma.component";
import {PrintFactureClientComponent} from "./print-facture-client/print-facture-client.component";
import {ListProformasComponent} from "./list-proformas/list-proformas.component";
import {ListAgencesComponent} from "./list-agences/list-agences.component";
import {EditAgenceComponent} from "./edit-agence/edit-agence.component";
import {ListBordereauComponent} from "./list-bordereau/list-bordereau.component";
import {EditBordereauComponent} from "./edit-bordereau/edit-bordereau.component";
import {PrintBordereauComponent} from "./print-bordereau/print-bordereau.component";
import {ListCataloguesComponent} from "./list-catalogues/list-catalogues.component";
import {EditCatalogueComponent} from "./edit-catalogue/edit-catalogue.component";
import {ListUtilisateursComponent} from "./list-utilisateurs/list-utilisateurs.component";
import {EditUtilisateurComponent} from "./edit-utilisateur/edit-utilisateur.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'home', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'login', component: LoginComponent },

  { path: 'montures', component: ListMonturesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-monture', component: EditMontureComponent, canActivate:[AuthGaurdService] },
  { path: 'update-monture/:id', component: EditMontureComponent, canActivate:[AuthGaurdService] },

  { path: 'lentilles', component: ListLentillesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-lentille', component: EditLentilleComponent, canActivate:[AuthGaurdService] },
  { path: 'update-lentille/:id', component: EditLentilleComponent, canActivate:[AuthGaurdService] },

  { path: 'marques', component: ListMarquesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-marque', component: EditMarqueComponent, canActivate:[AuthGaurdService] },
  { path: 'update-marque/:id', component: EditMarqueComponent, canActivate:[AuthGaurdService] },

  { path: 'catalogues', component: ListCataloguesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-catalogue', component: EditCatalogueComponent, canActivate:[AuthGaurdService] },
  { path: 'update-catalogue/:id', component: EditCatalogueComponent, canActivate:[AuthGaurdService] },

  { path: 'agences', component: ListAgencesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-agence', component: EditAgenceComponent, canActivate:[AuthGaurdService] },
  { path: 'update-agence/:id', component: EditAgenceComponent, canActivate:[AuthGaurdService] },

  { path: 'livraisons', component: ListLivraisonsComponent, canActivate:[AuthGaurdService] },
  { path: 'add-livraison', component: EditLivraisonComponent, canActivate:[AuthGaurdService] },
  { path: 'update-livraison/:id', component: EditLivraisonComponent, canActivate:[AuthGaurdService] },

  { path: 'bonLivraisons', component: ListBonLivraisonsComponent, canActivate:[AuthGaurdService] },
  { path: 'add-bonLivraison', component: EditBonLivraisonComponent, canActivate:[AuthGaurdService] },
  { path: 'update-bonLivraison/:id', component: EditBonLivraisonComponent, canActivate:[AuthGaurdService] },

  { path: 'bonCommandes', component: ListBonCommandesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-bonCommande', component: EditBonCommandeComponent, canActivate:[AuthGaurdService] },
  { path: 'update-bonCommande/:id', component: EditBonCommandeComponent, canActivate:[AuthGaurdService] },

  { path: 'fournisseurs', component: ListFournisseursComponent, canActivate:[AuthGaurdService] },
  { path: 'add-fournisseur', component: EditFournisseurComponent, canActivate:[AuthGaurdService] },
  { path: 'update-fournisseur/:id', component: EditFournisseurComponent, canActivate:[AuthGaurdService] },

  { path: 'proformas', component: ListProformasComponent, canActivate:[AuthGaurdService] },
  { path: 'factures', component: ListFacturesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-proforma', component: AddProformaComponent, canActivate:[AuthGaurdService] },
  { path: 'add-facture', component: AddFactureComponent, canActivate:[AuthGaurdService] },
  { path: 'update-facture/:id', component: UpdateFactureComponent, canActivate:[AuthGaurdService] },
  { path: 'Bordereaux', component: ListBordereauComponent, canActivate:[AuthGaurdService] },
  { path: 'add-bordereau', component: EditBordereauComponent, canActivate:[AuthGaurdService] },

  { path: 'entreprises', component: ListEntreprisesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-entreprise', component: EditEntrepriseComponent, canActivate:[AuthGaurdService] },
  { path: 'update-entreprise/:id', component: EditEntrepriseComponent, canActivate:[AuthGaurdService] },

  { path: 'personnes', component: ListPersonnesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-personne', component: EditPersonneComponent, canActivate:[AuthGaurdService] },
  { path: 'update-personne/:id', component: EditPersonneComponent, canActivate:[AuthGaurdService] },

  { path: 'utilisateurs', component: ListUtilisateursComponent, canActivate:[AuthGaurdService] },
  { path: 'add-utilisateur', component: EditUtilisateurComponent, canActivate:[AuthGaurdService] },
  { path: 'update-utilisateur/:id', component: EditUtilisateurComponent, canActivate:[AuthGaurdService] },

  { path: 'print-proforma/:id', component: PrintProformaComponent, canActivate:[AuthGaurdService] },
  { path: 'print-facture-client/:id', component: PrintFactureClientComponent, canActivate:[AuthGaurdService] },
  { path: 'print-bordereau/:id', component: PrintBordereauComponent, canActivate:[AuthGaurdService] },

  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
