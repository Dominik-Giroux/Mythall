import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IFourberie, FourberieService, FourberieItem } from '../../../../../services/fourberie.service';
import { Choix } from '../../../../../services/choix.service';

@Component({
  selector: 'creation-progression-fourberies',
  templateUrl: './fourberies.component.html'
})
export class JoueurPersonnageCreationProgressionFourberiesComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private fourberieService: FourberieService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;
  @Input() choixPersonnage: Choix[];

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedFourberies: IFourberie[] = [];
  availableFourberies = [];
  quantity = [];
  currentIndex: number = 0;

  ngOnInit() {
    this._getAvailableFourberies();

    // Get the amount of fourberies to choose
    if (this.choixPersonnage) {
      this.choixPersonnage.forEach((choix) => {
        if (choix.type == 'fourberie' && choix.quantite > 0) {
          this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
        }
      });
    }

  }

  public get isCompleted(): boolean {
    return (this.selectedFourberies && this.selectedFourberies.length == this.quantity.length) ? true : false;
  }

  private async _getAvailableFourberies(): Promise<void> {
    this.availableFourberies[this.currentIndex] = await this.fourberieService.getAvailableFourberies(this.personnage);
  }

  setFourberie(index) {

    // Set Current Index
    this.currentIndex = index + 1;

    // Set Current fourberie
    if (!this.personnage.fourberies) this.personnage.fourberies = [];

    const selectedFourberieItem: FourberieItem = new FourberieItem();
    selectedFourberieItem.fourberie = this.selectedFourberies[index];
    selectedFourberieItem.fourberieRef = this.selectedFourberies[index].id;
    selectedFourberieItem.niveauObtention = this.personnage.niveauReel;

    this.personnage.fourberies.push(selectedFourberieItem);

    // Refresh List of Available fourberies
    this._getAvailableFourberies();

  }

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