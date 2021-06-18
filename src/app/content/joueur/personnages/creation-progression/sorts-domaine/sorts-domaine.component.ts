import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Choix } from '../../../../../services/choix.service';
import { PersonnageService, IPersonnage, } from '../../../../../services/personnage.service';
import { IDon } from '../../../../../services/don.service';

@Component({
  selector: 'creation-progression-sorts-domaine',
  templateUrl: './sorts-domaine.component.html'
})
export class JoueurPersonnageCreationProgressionSortsDomaineComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;
  @Input() choixPersonnage: Choix[];

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedDons: IDon[] = [];
  availableDons = [];
  quantity = [];
  currentIndex: number = 0;

  ngOnInit() {
    // this.getAvailableDons();

    // // Get the amount of dons to choose
    // if (this.choixPersonnage) {
    //     this.choixPersonnage.forEach((choix) => {
    //         if (choix.type == 'don' && choix.categorie == 'Normal' && choix.quantite > 0) {
    //             this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
    //         }
    //     });
    // }

  }

  public get isCompleted(): boolean {

    return true;

    // if (this.selectedDons && this.selectedDons.length == this.quantity.length) {
    //     return true;
    // }

    // return false;

  }

  // getAvailableDons() {
  //     this.donService.getAvailableDons(this.personnage).then(response => {
  //         this.availableDons[this.currentIndex] = response;
  //     });
  // }

  // setDon(index) {

  //     // Set Current Index
  //     this.currentIndex = index + 1;

  //     // Set Current don
  //     if (!this.personnage.dons) this.personnage.dons = [];

  //     const selectedDonItem: DonItem = new DonItem();
  //     selectedDonItem.don = this.selectedDons[index];
  //     selectedDonItem.donRef = this.selectedDons[index].id;
  //     selectedDonItem.niveauObtention = this.personnage.niveauReel;

  //     this.personnage.dons.push(selectedDonItem);

  //     // Refresh List of Available dons
  //     this.getAvailableDons();

  // }

  public async next(): Promise<void> {
    if (this.isCompleted) {

      // Rebuild Personnage
      const personnage = await this.personnageService.buildPersonnage(this.personnage);

      // Emit & Allow next step
      this.personnageChange.emit(personnage);
      this.completedChange.emit(true);
      setTimeout(() => {
        this.stepper.next();
      });

    }
  }

}