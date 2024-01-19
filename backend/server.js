import UpdateTokens from './src/update.js';
import DollysController from './src/dollys.js';
import CheckController from './src/check.js';
import TraitController from './src/traits.js';
import SignatureService from './src/signature.js';
import express from 'express';
import cors from 'cors';

(() => {
    'use-strict';

    const app = express();
    app.use(cors({
        origin: ['https://closet.hunnys.io', 'https://hunnys.io/wp-json/hunnys-closet/v1', 'https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/', 'https://pleasing-turkey-pleasing.ngrok-free.app', 'https://closetapi.hunnysnft.com', 'http://localhost:8081/wordpress/wp-json/hunnys-closet/v1/', 'https://staging-hunnys-closet-2.vercel.app', 'http://localhost:3000', 'http://localhost', 'http://localhost:8081', 'http://localhost:8081/wordpress', 'https://hunnys.io', 'https://testing.d35i3wnh0wry5j.amplifyapp.com']
    }));
    app.use(express.json());
    const port = process.env.PORT || 8081;

    // Middleware for logging various headers and request details
    app.use((req, res, next) => {
        
        const requestSize = JSON.stringify(req.headers).length + (req.body ? JSON.stringify(req.body).length : 0);

        next();
    });

    app.get('/update', (req, res) => {
        console.log('update started');
        let headerVal = req.get('X-API-KEY');
        let tokenIds = req.query.ids;
        // validate header & tokenIds 

        // update tokenIds
        UpdateTokens.update(tokenIds);
        res.send('Update triggered');
    })

    app.get('/dollys', async (req, res) => {
        console.log('get data');
        let headerVal = req.get('X-API-KEY');
        let wallet = req.query.wallet;
        // validate header & tokenIds 

        let data = await DollysController.getData(wallet);
        res.send(data);
    })

    app.get('/check', async (req, res) => {
        let headerVal = req.get('X-API-KEY');
        // validate header  

        await CheckController.checkDollys();
        res.send('Check triggert.');
    })
    
    app.get('/traits', async (req, res) => {
        let headerVal = req.get('X-API-KEY');
        // validate header  

        let data = await TraitController.getTraits();
        res.send(data);
    })

    app.use('/signature', SignatureService);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        // Optionally, send error details to a logging service or your server
        res.status(500).send('Something broke!');
    });
    
    app.listen(port, () => {
        console.log(`Hunnys Dollys WebService listening on port ${port}`)
    })

})();
