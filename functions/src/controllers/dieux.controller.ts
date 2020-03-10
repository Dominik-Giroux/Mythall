
import * as express from 'express';
import * as admin from 'firebase-admin';
import { Error, ErrorCodes } from '../models/error';

export class DieuxController {

    constructor(
        public app = express.Router()
    ) {

        //Get All
        app.get('/', (req, res) => {

            return admin.firestore().collection('dieux').get().then((response) => {
                const result: any[] = [];
                response.forEach(snapshot => {
                    const data: any = snapshot.data();
                    data.id = snapshot.id;
                    result.push(data);
                });
                return res.status(200).json(result);
            }).catch(error => {
                return res.status(400).json(new Error(ErrorCodes.firestore, error));
            });

        });

        // Get By ID
        app.get('/:id', (req, res) => {

            return admin.firestore().collection('dieux').doc(req.params.id).get().then((response) => {
                const result: any = response.data();
                result.id = response.id;
                return res.status(200).json(result);
            }).catch(error => {
                return res.status(400).json(new Error(ErrorCodes.firestore, error));
            });

        });

        // Add
        app.post('/', (req, res) => {

            return admin.firestore().collection('dieux').add(req.body).then(response => {
                req.body.id = response.id;
                return res.status(200).json(req.body);
            }).catch(error => {
                return res.status(400).json(new Error(ErrorCodes.firestore, error));
            });

        });

        // Update
        app.put('/', (req, res) => {

            // Request Validation
            if (!req.body || !req.body.id || req.body.id === '') {
                return res.status(400).json(new Error(ErrorCodes.badRequest, 'Request is missing ID'));
            }

            // Firestore
            return admin.firestore().collection('dieux').doc(req.body.id).update(req.body.data).then(response => {
                return res.status(200).json(req.body.data);
            }).catch(error => {
                return res.status(400).json(new Error(ErrorCodes.firestore, error));
            });

        });

        // Delete
        app.delete('/', (req, res) => {

            // Request Validation
            if (!req.query || !req.query.id) {
                return res.status(400).json(new Error(ErrorCodes.badRequest, 'Request is missing ID'));
            }

            // Firestore
            return admin.firestore().collection('dieux').doc(req.query.id).delete().then((response) => {
                return res.status(200).json(true);
            }).catch(error => {
                return res.status(400).json(new Error(ErrorCodes.firestore, error));
            })

        });

    }

}