import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IDon, DonItem, DonService } from '../../../../../services/don.service';
import { Choix } from '../../../../../services/choix.service';

@Component({
  selector: 'creation-progression-connaissances',
  templateUrl: './connaissances.component.html'
})
export class JoueurPersonnageCreationProgressionConnaissancesComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private donService: DonService,
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;
  @Input() choixPersonnage: Choix[];

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedConnaissances: IDon[] = [];
  availableConnaissances = [];
  quantity = [];
  currentIndex: number = 0;

  ngOnInit() {
    this._getAvailableConnaissances();

    // Get the amount of connaissances to choose
    this.choixPersonnage.forEach((choix) => {
      if (choix.type == 'don' && choix.categorie == 'Connaissance' && choix.quantite > 0) {
        this.quantity = Array(choix.quantite).fill(1).map((x, i) => i); // Crée un array de la quantité de choix [1,2,3,...]
      }
    });

  }

  public get isCompleted(): boolean {
    return this.selectedConnaissances && this.selectedConnaissances.length == this.quantity.length ? true : false;
  }

  private async _getAvailableConnaissances(): Promise<void> {
    this.availableConnaissances[this.currentIndex] = await this.donService.getAvailableConnaissances(this.personnage);
  }

  public setConnaissance(index): void {

    // Set Current Index
    this.currentIndex = index + 1;

    // Set Current connaissance
    if (!this.personnage.dons) this.personnage.dons = [];

    const selectedConnaissanceItem: DonItem = new DonItem();
    selectedConnaissanceItem.don = this.selectedConnaissances[index];
    selectedConnaissanceItem.donRef = this.selectedConnaissances[index].id;
    selectedConnaissanceItem.niveauObtention = this.personnage.niveauReel;

    this.personnage.dons.push(selectedConnaissanceItem);

    // Refresh List of Available connaissances
    this._getAvailableConnaissances();

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