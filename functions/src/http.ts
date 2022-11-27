import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
var serviceAccount = require("..service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
import * as express from 'express';
import * as cors from 'cors';


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

const app = express();
app.use(cors({origin:true}))

app.get('cat', (request, response) => {
    response.send('CAT');
})

app.get('dog', (request, response) => {
    response.send('DOG');
})

export const api = functions.https.onRequest(app);