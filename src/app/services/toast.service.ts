import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ToastService {

  constructor(
    private msb: MatSnackBar
  ) { }

  add(name: string) {
    this.msb.open(name + " ajouté avec succès.", "Fermer", {
      duration: 3000,
    });
  }

  update(name: string) {
    this.msb.open(name + " modifié avec succès.", "Fermer", {
      duration: 3000,
    });
  }

  delete(name: string) {
    this.msb.open(name + " supprimé avec succès.", "Fermer", {
      duration: 3000,
    });
  }

}