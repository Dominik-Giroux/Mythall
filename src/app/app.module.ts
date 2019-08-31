//Modules
import { NgModule, Injector } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { FirebaseModule } from './modules/firebase.module';
import { MediaMatcher } from '@angular/cdk/layout';

//Services
import { AdminService } from './services/@core/admin.service';
import { ToastService } from './services/@core/toast.service';
import { AuthenticationService } from './services/@core/authentication.service';
import { AlignementService } from './services/alignement.service';
import { AptitudeService } from './services/aptitudes/aptitude.service';
import { ClasseService } from './services/classes/classe.service';
import { DieuService } from './services/dieu.service';
import { DomaineService } from './services/domaines/domaine-service';
import { DonService } from './services/dons/don.service';
import { DureeService } from './services/duree.service';
import { EcoleService } from './services/ecole.service';
import { EspritService } from './services/esprits/esprit-service';
import { FirestoreService } from './services/firestore/firestore.service';
import { FourberieService } from './services/fourberies/fourberie.service';
import { ImmuniteService } from './services/immunite.service';
import { OrdreService } from './services/ordres/ordre.service';
import { PersonnageService } from './services/personnages/personnage.service';
import { PorteService } from './services/porte.service';
import { RaceService } from './services/races/race.service';
import { ResistanceService } from './services/resistance.service';
import { StatistiqueService } from './services/statistique.service';
import { SortService } from './services/sorts/sort.service';
import { UserService } from './services/@core/user.service';
import { ZoneService } from './services/zone.service';

//Pipes
import { DocPipe } from './services/firestore/doc.pipe';

//Guards
import { JoueurGuard } from './services/@core/guards/joueur.guard';
import { AnimateurGuard } from './services/@core/guards/animateur.guard';
import { OrganisateurGuard } from './services/@core/guards/organisateur.guard';

//Core Elements
import { Snackbar } from './services/@core/models/snackbar';

//Layout
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NavbarAuthComponent } from './layout/navbar/auth/auth.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { DeleteDialogComponent } from './layout/dialogs/delete/delete.dialog.component';
import { ErrorDialogComponent } from './layout/dialogs/error/error.dialog.component';
import { LoadingDialogComponent } from './layout/dialogs/loading/loading.dialog.component';

//Content
import { HomeComponent } from './content/defaults/home/home.component';
import { LoginComponent } from './content/defaults/login/login.component';
import { PageNotFoundComponent } from './content/defaults/page-not-found/page-not-found.component';
import { ProfilComponent } from './content/joueur/profil/profil.component';
import { PrivacyPolicyComponent } from './content/defaults/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './content/defaults/terms-of-service/terms-of-service.component';

import { JeuAptitudesComponent } from './content/jeu/aptitudes/aptitudes.component';
import { JeuClassesComponent } from './content/jeu/classes/classes.component';
import { JeuClasseDetailsDialogComponent } from './content/jeu/classes/details/details.dialog.component';
import { JeuClassesPrestigeComponent } from './content/jeu/classes-prestige/classes-prestige.component';
import { JeuDonsComponent } from './content/jeu/dons/dons.component';
import { JeuRacesComponent } from './content/jeu/races/races.component';
import { JeuSortsComponent } from './content/jeu/sorts/sorts.component';
import { JeuSortDetailsDialogComponent } from './content/jeu/sorts/details/details.dialog.component';

import { AnimateurPersonnagesFormComponent } from './content/animateur/personnages/form/form.component';
import { AnimateurPersonnagesListComponent } from './content/animateur/personnages/list/list.component';
import { AnimateurUsersFormComponent } from './content/animateur/users/form/form.component';
import { AnimateurUsersListComponent } from './content/animateur/users/list/list.component';

import { JoueurPersonnageFicheComponent } from './content/joueur/personnages/fiche/fiche.component';
import { JoueurPersonnagesListComponent } from './content/joueur/personnages/list/list.component';
import { JoueurPersonnageCreationProgressionComponent } from './content/joueur/personnages/creation-progression/creation-progression.component';
import { JoueurPersonnageCreationProgressionAlignementComponent } from './content/joueur/personnages/creation-progression/alignement/alignement.component';
import { JoueurPersonnageCreationProgressionRaceComponent } from './content/joueur/personnages/creation-progression/race/race.component';
import { JoueurPersonnageCreationProgressionClassesComponent } from './content/joueur/personnages/creation-progression/classes/classes.component';
import { JoueurPersonnageCreationProgressionConnaissancesComponent } from './content/joueur/personnages/creation-progression/connaissances/connaissances.component';
import { JoueurPersonnageCreationProgressionDieuComponent } from './content/joueur/personnages/creation-progression/dieu/dieu.component';
import { JoueurPersonnageCreationProgressionDonsComponent } from './content/joueur/personnages/creation-progression/dons/dons.component';
import { JoueurPersonnageCreationProgressionDomainesComponent } from './content/joueur/personnages/creation-progression/domaines/domaines.component';
import { JoueurPersonnageCreationProgressionEcoleComponent } from './content/joueur/personnages/creation-progression/ecole/ecole.component';
import { JoueurPersonnageCreationProgressionEspritComponent } from './content/joueur/personnages/creation-progression/esprit/esprit.component';
import { JoueurPersonnageCreationProgressionFourberiesComponent } from './content/joueur/personnages/creation-progression/fourberies/fourberies.component';
import { JoueurPersonnageCreationProgressionOrdreComponent } from './content/joueur/personnages/creation-progression/ordre/ordre.component';
import { JoueurPersonnageCreationProgressionSortsComponent } from './content/joueur/personnages/creation-progression/sorts/sorts.component';
import { JoueurPersonnageCreationProgressionSortsDomaineComponent } from './content/joueur/personnages/creation-progression/sorts-domaine/sorts-domaine.component';

import { OrganisateurAdminComponent } from './content/organisateur/admin/admin.component';
import { OrganisateurAlignementsFormComponent } from './content/organisateur/alignements/form/form.component';
import { OrganisateurAlignementsListComponent } from './content/organisateur/alignements/list/list.component';
import { OrganisateurAptitudesFormComponent } from './content/organisateur/aptitudes/form/form.component';
import { OrganisateurAptitudesListComponent } from './content/organisateur/aptitudes/list/list.component';
import { OrganisateurClassesFormComponent } from './content/organisateur/classes/form/form.component';
import { OrganisateurClassesListComponent } from './content/organisateur/classes/list/list.component';
import { OrganisateurDieuxFormComponent } from './content/organisateur/dieux/form/form.component';
import { OrganisateurDieuxListComponent } from './content/organisateur/dieux/list/list.component';
import { OrganisateurDomainesFormComponent } from './content/organisateur/domaines/form/form.component';
import { OrganisateurDomainesListComponent } from './content/organisateur/domaines/list/list.component';
import { OrganisateurDonsFormComponent } from './content/organisateur/dons/form/form.component';
import { OrganisateurDonsListComponent } from './content/organisateur/dons/list/list.component';
import { OrganisateurDureesFormComponent } from './content/organisateur/durees/form/form.component';
import { OrganisateurDureesListComponent } from './content/organisateur/durees/list/list.component';
import { OrganisateurEcolesFormComponent } from './content/organisateur/ecoles/form/form.component';
import { OrganisateurEcolesListComponent } from './content/organisateur/ecoles/list/list.component';
import { OrganisateurEspritsFormComponent } from './content/organisateur/esprits/form/form.component';
import { OrganisateurEspritsListComponent } from './content/organisateur/esprits/list/list.component';
import { OrganisateurFourberiesFormComponent } from './content/organisateur/fourberies/form/form.component';
import { OrganisateurFourberiesListComponent } from './content/organisateur/fourberies/list/list.component';
import { OrganisateurImmunitesFormComponent } from './content/organisateur/immunites/form/form.component';
import { OrganisateurImmunitesListComponent } from './content/organisateur/immunites/list/list.component';
import { OrganisateurOrdresFormComponent } from './content/organisateur/ordres/form/form.component';
import { OrganisateurOrdresListComponent } from './content/organisateur/ordres/list/list.component';
import { OrganisateurPortesFormComponent } from './content/organisateur/portes/form/form.component';
import { OrganisateurPortesListComponent } from './content/organisateur/portes/list/list.component';
import { OrganisateurRacesFormComponent } from './content/organisateur/races/form/form.component';
import { OrganisateurRacesListComponent } from './content/organisateur/races/list/list.component';
import { OrganisateurResistancesFormComponent } from './content/organisateur/resistances/form/form.component';
import { OrganisateurResistancesListComponent } from './content/organisateur/resistances/list/list.component';
import { OrganisateurStatistiquesFormComponent } from './content/organisateur/statistiques/form/form.component';
import { OrganisateurStatistiquesListComponent } from './content/organisateur/statistiques/list/list.component';
import { OrganisateurSortsFormComponent } from './content/organisateur/sorts/form/form.component';
import { OrganisateurSortsListComponent } from './content/organisateur/sorts/list/list.component';
import { OrganisateurZonesFormComponent } from './content/organisateur/zones/form/form.component';
import { OrganisateurZonesListComponent } from './content/organisateur/zones/list/list.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Privacy-Policy', component: PrivacyPolicyComponent },
  { path: 'Terms-Of-Service', component: TermsOfServiceComponent },

  { path: 'jeu/aptitudes', component: JeuAptitudesComponent },
  { path: 'jeu/classes', component: JeuClassesComponent },
  { path: 'jeu/classes-prestige', component: JeuClassesPrestigeComponent },
  { path: 'jeu/dons', component: JeuDonsComponent },
  { path: 'jeu/races', component: JeuRacesComponent },
  { path: 'jeu/sorts', component: JeuSortsComponent },

  {
    path: 'joueur', canActivate: [JoueurGuard], children: [
      { path: 'profil', component: ProfilComponent },
      { path: 'personnage/creation', component: JoueurPersonnageCreationProgressionComponent },
      { path: 'personnage/progression/:id', component: JoueurPersonnageCreationProgressionComponent },
      { path: 'personnage/:id', component: JoueurPersonnageFicheComponent },
      { path: 'personnages', component: JoueurPersonnagesListComponent },
    ]
  },

  {
    path: 'animateur', canActivate: [AnimateurGuard], children: [

      { path: 'personnages/form', component: AnimateurPersonnagesFormComponent },
      { path: 'personnages/form/:id', component: AnimateurPersonnagesFormComponent },
      { path: 'personnages/list', component: AnimateurPersonnagesListComponent },

      { path: 'users/form', component: AnimateurUsersFormComponent },
      { path: 'users/form/:id', component: AnimateurUsersFormComponent },
      { path: 'users/list', component: AnimateurUsersListComponent }
    ]
  },

  {
    path: 'organisateur', canActivate: [OrganisateurGuard], children: [

      { path: 'admin', component: OrganisateurAdminComponent },

      { path: 'alignements/form', component: OrganisateurAlignementsFormComponent },
      { path: 'alignements/form/:id', component: OrganisateurAlignementsFormComponent },
      { path: 'alignements/list', component: OrganisateurAlignementsListComponent },

      { path: 'aptitudes/form', component: OrganisateurAptitudesFormComponent },
      { path: 'aptitudes/form/:id', component: OrganisateurAptitudesFormComponent },
      { path: 'aptitudes/list', component: OrganisateurAptitudesListComponent },

      { path: 'classes/form', component: OrganisateurClassesFormComponent },
      { path: 'classes/form/:id', component: OrganisateurClassesFormComponent },
      { path: 'classes/list', component: OrganisateurClassesListComponent },

      { path: 'dieux/form', component: OrganisateurDieuxFormComponent },
      { path: 'dieux/form/:id', component: OrganisateurDieuxFormComponent },
      { path: 'dieux/list', component: OrganisateurDieuxListComponent },

      { path: 'domaines/form', component: OrganisateurDomainesFormComponent },
      { path: 'domaines/form/:id', component: OrganisateurDomainesFormComponent },
      { path: 'domaines/list', component: OrganisateurDomainesListComponent },

      { path: 'dons/form', component: OrganisateurDonsFormComponent },
      { path: 'dons/form/:id', component: OrganisateurDonsFormComponent },
      { path: 'dons/list', component: OrganisateurDonsListComponent },

      { path: 'durees/form', component: OrganisateurDureesFormComponent },
      { path: 'durees/form/:id', component: OrganisateurDureesFormComponent },
      { path: 'durees/list', component: OrganisateurDureesListComponent },

      { path: 'ecoles/form', component: OrganisateurEcolesFormComponent },
      { path: 'ecoles/form/:id', component: OrganisateurEcolesFormComponent },
      { path: 'ecoles/list', component: OrganisateurEcolesListComponent },

      { path: 'esprits/form', component: OrganisateurEspritsFormComponent },
      { path: 'esprits/form/:id', component: OrganisateurEspritsFormComponent },
      { path: 'esprits/list', component: OrganisateurEspritsListComponent },

      { path: 'fourberies/form', component: OrganisateurFourberiesFormComponent },
      { path: 'fourberies/form/:id', component: OrganisateurFourberiesFormComponent },
      { path: 'fourberies/list', component: OrganisateurFourberiesListComponent },

      { path: 'immunites/form', component: OrganisateurImmunitesFormComponent },
      { path: 'immunites/form/:id', component: OrganisateurImmunitesFormComponent },
      { path: 'immunites/list', component: OrganisateurImmunitesListComponent },

      { path: 'ordres/form', component: OrganisateurOrdresFormComponent },
      { path: 'ordres/form/:id', component: OrganisateurOrdresFormComponent },
      { path: 'ordres/list', component: OrganisateurOrdresListComponent },

      { path: 'races/form', component: OrganisateurRacesFormComponent },
      { path: 'races/form/:id', component: OrganisateurRacesFormComponent },
      { path: 'races/list', component: OrganisateurRacesListComponent },

      { path: 'resistances/form', component: OrganisateurResistancesFormComponent },
      { path: 'resistances/form/:id', component: OrganisateurResistancesFormComponent },
      { path: 'resistances/list', component: OrganisateurResistancesListComponent },

      { path: 'statistiques/form', component: OrganisateurStatistiquesFormComponent },
      { path: 'statistiques/form/:id', component: OrganisateurStatistiquesFormComponent },
      { path: 'statistiques/list', component: OrganisateurStatistiquesListComponent },

      { path: 'portes/form', component: OrganisateurPortesFormComponent },
      { path: 'portes/form/:id', component: OrganisateurPortesFormComponent },
      { path: 'portes/list', component: OrganisateurPortesListComponent },

      { path: 'sorts/form', component: OrganisateurSortsFormComponent },
      { path: 'sorts/form/:id', component: OrganisateurSortsFormComponent },
      { path: 'sorts/list', component: OrganisateurSortsListComponent },

      { path: 'zones/form', component: OrganisateurZonesFormComponent },
      { path: 'zones/form/:id', component: OrganisateurZonesFormComponent },
      { path: 'zones/list', component: OrganisateurZonesListComponent },

    ]
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  entryComponents: [
    DeleteDialogComponent,
    ErrorDialogComponent,
    LoadingDialogComponent,
    JeuClasseDetailsDialogComponent,
    JeuSortDetailsDialogComponent
  ],
  declarations: [
    AppComponent,
    DocPipe,
    NavbarComponent,
    NavbarAuthComponent,
    SidenavComponent,
    DeleteDialogComponent,
    ErrorDialogComponent,
    LoadingDialogComponent,
    HomeComponent,
    LoginComponent,
    PageNotFoundComponent,
    ProfilComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    JeuAptitudesComponent,
    JeuClassesComponent,
    JeuClasseDetailsDialogComponent,
    JeuClassesPrestigeComponent,
    JeuDonsComponent,
    JeuRacesComponent,
    JeuSortsComponent,
    JeuSortDetailsDialogComponent,
    JoueurPersonnageFicheComponent,
    JoueurPersonnagesListComponent,
    JoueurPersonnageCreationProgressionComponent,
    JoueurPersonnageCreationProgressionAlignementComponent,
    JoueurPersonnageCreationProgressionRaceComponent,
    JoueurPersonnageCreationProgressionClassesComponent,
    JoueurPersonnageCreationProgressionConnaissancesComponent,
    JoueurPersonnageCreationProgressionDieuComponent,
    JoueurPersonnageCreationProgressionDonsComponent,
    JoueurPersonnageCreationProgressionDomainesComponent,
    JoueurPersonnageCreationProgressionEcoleComponent,
    JoueurPersonnageCreationProgressionEspritComponent,
    JoueurPersonnageCreationProgressionFourberiesComponent,
    JoueurPersonnageCreationProgressionOrdreComponent,
    JoueurPersonnageCreationProgressionSortsComponent,
    JoueurPersonnageCreationProgressionSortsDomaineComponent,
    OrganisateurAdminComponent,
    OrganisateurAlignementsFormComponent,
    OrganisateurAlignementsListComponent,
    OrganisateurAptitudesFormComponent,
    OrganisateurAptitudesListComponent,
    OrganisateurClassesFormComponent,
    OrganisateurClassesListComponent,
    OrganisateurDieuxFormComponent,
    OrganisateurDieuxListComponent,
    OrganisateurDomainesFormComponent,
    OrganisateurDomainesListComponent,
    OrganisateurDonsFormComponent,
    OrganisateurDonsListComponent,
    OrganisateurDureesFormComponent,
    OrganisateurDureesListComponent,
    OrganisateurEcolesFormComponent,
    OrganisateurEcolesListComponent,
    OrganisateurEspritsFormComponent,
    OrganisateurEspritsListComponent,
    OrganisateurFourberiesFormComponent,
    OrganisateurFourberiesListComponent,
    OrganisateurImmunitesFormComponent,
    OrganisateurImmunitesListComponent,
    AnimateurPersonnagesFormComponent,
    AnimateurPersonnagesListComponent,
    OrganisateurOrdresFormComponent,
    OrganisateurOrdresListComponent,
    OrganisateurPortesFormComponent,
    OrganisateurPortesListComponent,
    OrganisateurRacesFormComponent,
    OrganisateurRacesListComponent,
    OrganisateurResistancesFormComponent,
    OrganisateurResistancesListComponent,
    OrganisateurStatistiquesFormComponent,
    OrganisateurStatistiquesListComponent,
    OrganisateurSortsFormComponent,
    OrganisateurSortsListComponent,
    AnimateurUsersFormComponent,
    AnimateurUsersListComponent,
    OrganisateurZonesFormComponent,
    OrganisateurZonesListComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    FirebaseModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [
    JoueurGuard,
    AnimateurGuard,
    OrganisateurGuard,
    AdminService,
    ToastService,
    AuthenticationService,
    AptitudeService,
    FirestoreService,
    AlignementService,
    ClasseService,
    DieuService,
    DomaineService,
    DonService,
    DureeService,
    EcoleService,
    EspritService,
    FourberieService,
    ImmuniteService,
    OrdreService,
    PersonnageService,
    PorteService,
    RaceService,
    ResistanceService,
    StatistiqueService,
    SortService,
    UserService,
    ZoneService,
    MediaMatcher,
    Snackbar
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  //Allow Singleton Injector from Models (Class) outside of constructor
  static injector: Injector;
  constructor(
    injector: Injector
  ) {
    AppModule.injector = injector;
  }

}
