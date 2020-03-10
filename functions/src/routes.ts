
import * as express from 'express';

// Controllers
import { AlignementsController } from './controllers/alignements.controller';
import { DieuxController } from './controllers/dieux.controller';
import { DureesController } from './controllers/durees.controller';
import { EcolesController } from './controllers/ecoles.controller';
import { ImmunitesController } from './controllers/immunites.controller';
import { PortesController } from './controllers/portes.controller';
import { ResistancesController } from './controllers/resistances.controller';
import { StatistiquesController } from './controllers/statistiques.controller';
import { ZonesController } from './controllers/zones.controller';

export class Routes {

  constructor(
    public app = express.Router()
  ) {

    //Routes
    app.use('/alignements', new AlignementsController().app);
    app.use('/dieux', new DieuxController().app);
    app.use('/durees', new DureesController().app);
    app.use('/ecoles', new EcolesController().app);
    app.use('/immunites', new ImmunitesController().app);
    app.use('/portes', new PortesController().app);
    app.use('/resistances', new ResistancesController().app);
    app.use('/statistiques', new StatistiquesController().app);
    app.use('/zones', new ZonesController().app);

  }

}