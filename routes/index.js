const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fbApp = require('../models/firebase');

const router = express.Router();
router.use(bodyParser.urlencoded())
db = fbApp.firestore();

require('dotenv').config();

let msEndpoint = ''

router.get('/', (req, res) => {
	const scope =  process.env.SCOPES.replace(/\s/g, "%20");
	msEndpoint = `https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&response_mode=query&scope=${scope}&state=00042`
	res.render('index', {data: {endPoint: msEndpoint, currentUser: null}})
})

router.get('/redirect', (req, res) => {
	const code = req.query.code
	const tokenEndpoint = "https://login.microsoftonline.com/organizations/oauth2/v2.0/token"
	const creds = {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: process.env.REDIRECT_URI,
		grant_type: 'authorization_code',
		scope: process.env.SCOPES,
		code: code
	}

	const params = new URLSearchParams();
	for (i in creds){
		params.append(`${i}`, `${creds[i]}`)
	}

	const config = {
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		}
	  }

	axios.post(tokenEndpoint, params, config).then((response) => {
		const accessToken = response.data.access_token;
		const configr = {headers: {'Authorization': `Bearer ${accessToken}`}}
		axios.post('https://graph.microsoft.com/oidc/userinfo', {}, configr).then((resp) => {
			console.log(resp.data)
			res.render('index', {data: {endPoint: msEndpoint, currentUser: resp}})
		}).catch((err) => console.log(err))
	}).catch((err) => {
		console.log(err.message)
	})
	
}) 

module.exports = router;
