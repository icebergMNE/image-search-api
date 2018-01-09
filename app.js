'use strict';
const express = require('express')
const https = require('https');
const app = express()

const subscriptionKey = '0de50d63be5c49e588ac9ba976bc0a18';
const host = 'api.cognitive.microsoft.com';
const path = '/bing/v7.0/images/search';

app.get('/', (req,res)=>{



    res.send('working')
})



app.get('/api/:query?', (req,res) =>{

    let qOffset = 0;
    if(req.query.offset && Number(req.query.offset)){
        qOffset = req.query.offset 
    }
    
    const fullPath = `${path}?q=${encodeURIComponent(req.params.query)}&count=10&offset=${qOffset*10}`


    const options = {
        method : 'GET',
        hostname : host,
        path : fullPath,
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    }

    let httpsReq  = https.request(options, (response)=>{
        let body = '';
        response.on('data', function (d) {
            body += d;
        });

        response.on('end', function(){
            console.log(body)

            let data = JSON.parse(body).value;

            let formated = data.map(function (d){
                let newD = {};
                newD.imageUrl = d.contentUrl;
                newD.altText = d.name;
                newD.pageUrl = d.hostPageUrl;
                return newD;
            });

            res.send(formated)
            // res.send(data)

        })

        response.on('error', function (e) {
            console.log('Error: ' + e.message);
            res.send('Error: ' + e.message);
        });
        
    })
    httpsReq.end()
})

app.get('/test/:moze?', (req,res)=>{
    res.send(req.query)
})
app.listen(process.env.PORT || 3004)
























let term = 'dogs';
