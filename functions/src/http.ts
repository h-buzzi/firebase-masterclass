import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const basicHTTP = functions.https.onRequest((request, response) => {
    var name;
    if(request.query.name){
        name = request.query.name;
    } else {
        name = request.query.Name;
    }
    if (name){
        response.send(`Hello ${name} from firebase!`);
    } else {
        response.status(422).send(`Query parameter name is ${name}, please insert a name!`);
    }
})