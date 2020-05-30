import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IClasse, ClasseItem, ClasseService } from '../../../../../services/classe.service';

@Component({
  selector: 'creation-progression-classes',
  templateUrl: './classes.component.html'
})
export class JoueurPersonnageCreationProgressionClassesComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private classeService: ClasseService,
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedClasseChange: EventEmitter<ClasseItem> = new EventEmitter<ClasseItem>();

  selectedClasse: IClasse;
  selectedClasseItem: ClasseItem = new ClasseItem();
  availableClasses: IClasse[] = [];
  hideText: boolean = false;

  ngOnInit() {
    this._getAvailableClasses();
  }

  public get isCompleted(): boolean {
    return !!this.selectedClasse;
  }

  private async _getAvailableClasses(): Promise<void> {
    this.availableClasses = await this.classeService.getAvailableClasses(this.personnage);
  }

  private _levelClasse(): void {

    this.hideText = true;
    let classeFound: boolean = false;


    // Existing Classe
    this.personnage.classes.forEach(classeItem => {
      if (classeItem.classeRef == this.selectedClasse.id) {
        classeItem.niveau += 1;
        classeFound = true;

        this.selectedClasseItem = classeItem;

      }
    });

    // New Classe
    if (!classeFound) {
      this.selectedClasseItem.classe = this.selectedClasse;
      this.selectedClasseItem.classeRef = this.selectedClasse.id;
      this.personnage.classes.push(this.selectedClasseItem);
    }

  }

  public async next(): Promise<void> {
    if (this.isCompleted) {

      // Give Level
      this._levelClasse();

      // Rebuild Personnage
      const personnage = await this.personnageService.buildPersonnage(this.personnage);

      // Emit & Allow next step
      this.personnageChange.emit(personnage);
      this.selectedClasseChange.emit(this.selectedClasseItem);
      this.completedChange.emit(true);

    }
  }

}