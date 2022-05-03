import path from 'path';
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import "../src/configs/mongoose.config";
import Models from "../src/models";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
import CoreNLP, { Properties, Pipeline } from 'corenlp';
import _ from 'lodash';
var w2v = require('word2vec');
var w2vModel;
var w2vModelData = {}
const comment = 'Do not use this app, it is full of scammers. All they want you to do is take their word for how great the room is send you some generic pictures and ask for your security deposit without getting to see the room.'
const dataTypes = {
  Connection: [
    'Bluetooth',           'Companion devices',
    'Connectivity status', 'DNS',
    'Inet',                'IP',
    'Link',                'Socket',
    'MAC',                 'Mailto',
    'Network type',        'Proxy',
    'Route',               'SSL',
    'URI',                 'VPN',
    'HTTP',                'NSD',
    'RTP',                 'SIP',
    'Wifi',               
    'NFC',                 'URL',
    'Cookie',              'Authenticator',
    'IDN',                 'Cache'
  ],
  Hardware: [
    'Camera',               'Flash',
    'Buffer',              
    'Accelerometer sensor', 'Temperature sensor',
    'Other sensors',        'Gyroscope sensor',
    'Heart beat sensor',    'Heart rate sensor',
    'Light sensor',         'Acceleration sensor',
    'Location sensor',      'Biometric',
    'Device model',         'Lens',
    'Screen',               'Display',
    'Fingerprint',          'Hardware type',
    'Keyboard',             'USB',
    'IMEI'
  ],
  'Health&Fitness': [
    'Bluetooth device', 'Google Fit',
    'Fitness activity', 'Time',
    'Glucose',          'Blood pressure',
    'Body position',    'Body tempurature',
    'Cervical',         'Meal',
    'Menstrual flow',   'Ovulation',
    'Oxygen',           'Sleep',
  
  ],
  Location: [
    'Latitude',            'Longitude',
    'Address',             'Country',
                  'Local name',
    'Locale',              'Postal code',
    'Criteria',            'Geographic',
    'Local time',          'Measurement',
    'Navigation',          'GPS',
    'Longitude, Latitude', 'Destination',
    'Location type',       'Distance',
    'Accuracy',            'Speed',
    'Altitude',            'Bearing',
    'NMEA',                'Locale name',
    'Position',            'Location activity',
    'Vehicle',             'Duration',
    'Maps',                'Places',
    'Location name',       'Phone number'
  ],
  Media: [
    'Audio',         'Image',             'Player',
    'Video',         'Recorder',          'Scanner',
    'Microphone',    'Remote',            'Movie',
    'Music',         'Channels',          'Volume',
    'Device info',   'Audio manager',     'HDMI',
    'Sound',         'Playback',          'Headphone',
    'Presentation',                  'Media type',
    'Timestamp',     'Audio track',       'Video quality',
    'Camera',        'Interface',         'Length',
    'Face detector', 'Media Cas',         'Session',
    'Codec',         'Callback',          'Color',
    'Feature',       'Profile',           'Encoder',
    'Controller',    'Media description', 'Media ID',
    'Media name',    'DRM',               'Key',
    'Media format',  'Metadata',          'Muxer',
    'Players',       'Voice',             'Router',
    'Display',       'Media connection',  'Sync',
    'Rating',        'Ringtone',          'TONE',
    'Processing',    'Environtmental',    'Equalizer',
    'Virtualizer',   'Browser',           'Effect',
    'Midi',          'Projection',        'TV',
    'Preview',       'Program',           'Flash',
    'GPS',           'Speed',             'Lens',
    'Light',         'Adapter',           'HTTP',
    'Sensor',        'Widget'
  ],
  Telephony: [
    'MMS',               'SMS',
    'ThreadsColumns',    'Carrier',
    'Service',           'Network type',
    'MNC',               'Roaming',
    'Cell',              'ICC',
    'Session',           'Phone number',
    'Phone status',      'Subscription',
    'Telephony manager', 
    'Callback',          'UICC',
    'Voicemail',         'APN',
    'EUICC',             'Download',
    'File info',         'Group call',
    'MBMS'
  ],
  UserInfo: [
    'Account',       'Name',
    'Contact',       'User profile',
    'Address',       'Age',
    'Bigraphy',      'Birthdays',
    'Email',         'Gender',
    'Organizations', 'Bigraphic',
    'Nickname',      'Occupation',
    'Phone number',  'SIP',
    'URL'
  ]
}
const DATA_TYPES = ["Bluetooth","Companion devices","Connectivity status","DNS","Inet","IP","Link","Socket","MAC","Mailto","Network type","Proxy","Route","SSL","URI","VPN","HTTP","NSD","RTP","SIP","Wifi","NFC","URL","Cookie","Authenticator","IDN","Cache","Camera","Flash","Buffer","Accelerometer sensor","Temperature sensor","Other sensors","Gyroscope sensor","Heart beat sensor","Heart rate sensor","Light sensor","Acceleration sensor","Location sensor","Biometric","Device model","Lens","Screen","Display","Fingerprint","Hardware type","Keyboard","USB","IMEI","Bluetooth device","Google Fit","Fitness activity","Time","Glucose","Blood pressure","Body position","Body tempurature","Cervical","Meal","Menstrual flow","Ovulation","Oxygen","Sleep","Latitude","Longitude","Address","Country","Local name","Locale","Postal code","Criteria","Geographic","Local time","Measurement","Navigation","GPS","Longitude, Latitude","Destination","Location type","Distance","Accuracy","Speed","Altitude","Bearing","NMEA","Locale name","Position","Location activity","Vehicle","Duration","Maps","Places","Location name","Phone number","Audio","Image","Player","Video","Recorder","Scanner","Microphone","Remote","Movie","Music","Channels","Volume","Device info","Audio manager","HDMI","Sound","Playback","Headphone","Presentation","Media type","Timestamp","Audio track","Video quality","Interface","Length","Face detector","Media Cas","Session","Codec","Callback","Color","Feature","Profile","Encoder","Controller","Media description","Media ID","Media name","DRM","Key","Media format","Metadata","Muxer","Players","Voice","Router","Media connection","Sync","Rating","Ringtone","TONE","Processing","Environtmental","Equalizer","Virtualizer","Browser","Effect","Midi","Projection","TV","Preview","Program","Light","Adapter","Sensor","Widget","MMS","SMS","ThreadsColumns","Carrier","Service","MNC","Roaming","Cell","ICC","Phone status","Subscription","Telephony manager","UICC","Voicemail","APN","EUICC","Download","File info","Group call","MBMS","Account","Name","Contact","User profile","Age","Bigraphy","Birthdays","Email","Gender","Organizations","Bigraphic","Nickname","Occupation"]
const PERMISSIONS = ["Calendar","Connection","Media","Storage","Telephony"]
const THIRD_PARTIES = ["a.applovin.com","aarki.net","active.mobi","adactioninteractive.com","Adcolony","addthis.com","adfalcon.com","adjust.com","admin.appnext.com","admixer.co.kr","admobgeek.com","Adobe","adroll.com","adrta.com","Ads Moloco","Ads Server","Ads Symptotic","AdSafeProtected","agkn.com","airpush.com","akamaihd.net","algovid.com","Altitude-arena","altrooz.com","Amazon","api reporting review mobile ads","api.pingstart.com","App Adsp","app.appsflyer.com","apperol.com","applovin.com","appmakertw","appnext.com","appsflyer.com","AppsGeyser","apptrknow.com","appwalls.mobi","apsalar.com","aptrk.com","Avocarrot","Baidu","beacon.krxd.net","beaconsinspace.com","bidswitch.net","Bluekai.com","bttrack.com","casalemedia.com","cauly.co","chartbeat.net","choices.truste.com","clinkadtracking.com","control.kochava.com","cootek.com","criteo.com","cs.gssprt.jp","cs.nend.net","DoubleVerify","dpm.demdex.net","Dribbble","everesttech.net","Facebook","feedmob.com","Google Ads","Google Analytics","Google Data API","Google Doc","Google Firebase","Google Fonts","Google Map","Google Play","Google Tag Manager","Google Video","Google Vision","Google Youtube","gstatic.com","guest.wireless.cmu.edu","haloapps.com","Heyzap","http://timmystudios.com/","i-mobile.co.jp","impact.applifier.com","inmobi.com","inmobicdn.net","Instagram","intentiq.com","jennywsplash.com","Kakao","kika-backend.com","kikakeyboard.com","Kiosked","Leadbolt Ads","leadboltapps.net","lenzmx.com","lfstmedia.com","liftoff.io","lkqd.net","ludei.com","Microsoft","mixpanel.com","Moat Ads","mobile-up-date.com","mobile.btrll.com","mobilecore.com","Mobincube","mookie1.com","MoPub","mxptint.net","Mydas Mobi","Myi Ads","mysearch-online.com","Native Ads","nend.net","newoffer2017.com","nexac.com","online-metrix.net","paperlit.com","Payco","phonegame.so","play.king.com","Pub Ads","pubmatic.com","quantcount.com","Quiztapp","rayjump.com","sappsuma.com","sc.iasds01.com","Scorecard Research","searchmobileonline.com","Securepub Ads","silvermob.com","simpli.fi","sm-trk.com","smaato","smartadserver","Spotify","Start App Service","stat.appioapp.com","Sticky ads TV","sumatoad.com","SuperSonic Ads","Sync","tapad.com","tapjoy.com","tappx.com","Taptica","Te Ads","theappsgalore.com","tinyhoneybee.com","tlnk.io","turn.com","Twitter","Unity Ads","Unknown","vdopia.com","volo-mobile.com","vungle.com","w55c.net","www.appyet.com","www.blogger.com","www.cdnstabletransit.com","www.cmu.edu","www.gamefeat.net","www.nexogen.in","www.searchmobileonline.com","www.ssacdn.com","www.startappexchange.com","Yahoo","Yandex","ymtracking.com","yyapi.net"]
const PURPOSES = ["Advertisements","Analysis","Authentication","Authorization","Communicating with malware","Connection","Maintenance","Management","Marketing","Remote","Statistical","Storage","Tracking"]

async function getSentenceStructure(comment) {
	const selectedKeys = ["dobj","compound","case","obl","amod","nsubj","nmod"]
	const result = []
	const props = new Properties({
		annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
		'outputFormat': 'json', 'timeout': 30000
	});
	const pipeline = new Pipeline(props, 'English'); // uses ConnectorServer by default
	const sent = new CoreNLP.simple.Expression(comment);

	const nlpResult = await pipeline.annotate(sent)

	nlpResult.toJSON().sentences.forEach(sentence => {
		const basicDependencies = sentence.toJSON()[3].toJSON()

		Object.entries(basicDependencies).forEach(([, dependent]) => {
			// {
			// 	dep: 'dobj',
			// 	governor: 31,
			// 	governorGloss: 'see',
			// 	dependent: 33,
			// 	dependentGloss: 'room'
			// }
			if(dependent.dep && selectedKeys.includes(dependent.dep)) {
				result.push(dependent)
			}
		})
	})

	return result
}
function getStructureBySimiWords(securityKeyWords, structure) {
	// get most similar words
	let securitySimiWords = {}
	
	for(let i = 0; i < securityKeyWords.length; i++) {
		const keyword = securityKeyWords[i];

		let mostSimilarWords
		if(w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword]
		else {
			mostSimilarWords = w2vModel.mostSimilar( keyword, 20 )

			w2vModelData[keyword] = mostSimilarWords
		}
		securitySimiWords[keyword] = mostSimilarWords
	}
	const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
		acc = [...acc, ..._.map(wordsByKey, 'word').map(item => item.toLowerCase())]
		return acc
	}, []) 

	const simiWordsSelected = []
	const result = structure.filter(item => {
		const isBoolean = words.includes(item.governorGloss) || words.includes(item.dependentGloss)

		words.forEach(item2 => {
			if(item2.toLowerCase() === item.governorGloss.toLowerCase()) simiWordsSelected.push(item.governorGloss)
			if(item2.toLowerCase() === item.dependentGloss.toLowerCase()) simiWordsSelected.push(item.dependentGloss)
		})

		return isBoolean
	})

	return [securitySimiWords, result, simiWordsSelected]
}

function getStructureByTypes(types, structure) {
	// get most similar words
	let securitySimiWords = {}
	
	for(let typeName of types) {
		const subItems = types[typeName]
	}

	for(let i = 0; i < securityKeyWords.length; i++) {
		const keyword = securityKeyWords[i];

		const mostSimilarWords = w2vModel.mostSimilar( keyword, 20 )
		securitySimiWords[keyword] = mostSimilarWords
	}
	console.log(3, securitySimiWords)
	
	const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
		acc = [...acc, ..._.map(wordsByKey, 'word').map(item => item.toLowerCase())]
		return acc
	}, []) 
	
	const result = structure.filter(item => {
		return words.includes(item.governorGloss) || words.includes(item.dependentGloss)
	})

	return [securitySimiWords, result]
}

// getStructureComment(comment)
async function getStructureComment(comment){ 
	console.log("getSentenceStructure")
	const structure = await getSentenceStructure(comment)

	return structure
}

async function getStructureBySimis(structure) {
	const securityKeyWords = ['security']
	let [securitySimiWords, securityStructure] = getStructureBySimiWords(securityKeyWords, structure)
	let [, securityStructureWithKeywords] = getStructureBySimiWords(['bad', 'good'], securityStructure)
	
	const privacyKeyWords = ['privacy']
	const [privacySimiWords, privacyStructure] = getStructureBySimiWords(privacyKeyWords, structure)
	let [, privacyStructureWithKeyWords] = getStructureBySimiWords(['bad', 'good'], privacyStructure)

	const permissionKeyWords = ['permission']
	const [permissionSimiWords, permissionStructure] = getStructureBySimiWords(permissionKeyWords, structure)
	let [, permissionStructureWithKeyWords] = getStructureBySimiWords(['bad', 'good'], permissionStructure)

	const collectionKeyWords = ['collection']
	const [collectionSimiWords, collectionStructure] = getStructureBySimiWords(collectionKeyWords, structure)
	const collectionDataTypes = {}

	for(let typeName in dataTypes) {
		const subItems = dataTypes[typeName]

	
		subItems.forEach(item => {
			let [simiWordsByItem, collectionStructureWithKeyWords, simiWordsSelected] = getStructureBySimiWords([item], collectionStructure)
			collectionSimiWords[item] = simiWordsByItem

			if(collectionStructureWithKeyWords && collectionStructureWithKeyWords.length) {
				if(!collectionDataTypes[typeName]) collectionDataTypes[typeName] = []

					
				simiWordsSelected.forEach(item => collectionDataTypes[typeName].push(item))
				
				collectionDataTypes[typeName] = _.uniq(collectionDataTypes[typeName])
			}
		})
	}

	const sharingKeyWords = ['sharing']
	const [sharingSimiWords, sharingStructure] = getStructureBySimiWords(sharingKeyWords, structure)
	const sharingDataTypes = {}
	for(let typeName in dataTypes) {
		const subItems = dataTypes[typeName]

		subItems.forEach(item => {
			let [simiWordsByItem, sharingStructureWithKeyWords, simiWordsSelected] = getStructureBySimiWords([item], sharingStructure)
			sharingSimiWords[item] = simiWordsByItem

			if(sharingStructureWithKeyWords && sharingStructureWithKeyWords.length) {
				if(!sharingDataTypes[typeName]) sharingDataTypes[typeName] = []


				simiWordsSelected.forEach(item => sharingDataTypes[typeName].push(item))
				
				sharingDataTypes[typeName] = _.uniq(sharingDataTypes[typeName])
			}
		})
	}
	return [
		securityKeyWords, securitySimiWords, securityStructure, securityStructureWithKeywords,
		privacyKeyWords, privacySimiWords, privacyStructure, privacyStructureWithKeyWords,
		permissionKeyWords, permissionSimiWords, permissionStructure, permissionStructureWithKeyWords,
		collectionKeyWords, collectionSimiWords, collectionStructure, collectionDataTypes,
		sharingKeyWords, sharingSimiWords, sharingStructure, sharingDataTypes
	]
}

async function step1() {
	const comments = await Models.Comment.find({
		isGetStructure: {$ne: true}
	})
	
	for(let i = 0; i < comments.length; i++) {
		console.log(`Running ${i+ 1}/${comments.length}`)
		const comment = comments[i];


		// const [securityKeyWords, securitySimiWords, securityStructure, structure] = await getStructureComment(comment.comment)
		const structure = await retry(getStructureComment(comment.comment), 10)

		await Models.Comment.updateOne({
			_id: comment.id
		}, {
			isGetStructure: true
		})

		await Models.CommentMeta.insertMany([
			// {
			// 	commentId: comment.id,
			// 	key: 'securityKeyWords',
			// 	value: JSON.stringify(securityKeyWords)
			// },
			// {
			// 	commentId: comment.id,
			// 	key: 'securitySimiWords',
			// 	value: JSON.stringify(securitySimiWords)
			// },
			// {
			// 	commentId: comment.id,
			// 	key: 'securityStructure',
			// 	value: JSON.stringify(securityStructure)
			// },
			{
				commentId: comment.id,
				key: 'structure',
				value: JSON.stringify(structure)
			}
		])
	}
}

async function step2() {
	console.log("Load model")
	// https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
	w2vModel  = await new Promise((resolve, reject) => {
		w2v.loadModel( process.env.W2V_MODEL, function( error, model ) {
			if(error) reject(error)
			
			resolve(model)
		});
	})

	const comments = await Models.Comment.find({
		isAnalyzed: {
			$ne: true
		},
		isLabeled: true,
	})

	const step2ByApp = async(comment) => {
		let structure = await Models.CommentMeta.findOne({
			commentId: comment.id,
			key: 'structure'
		})
		structure = JSON.parse(structure.value)
		
		const [ securityKeyWords, securitySimiWords, securityStructure, securityStructureWithKeywords,
			privacyKeyWords, privacySimiWords, privacyStructure, privacyStructureWithKeyWords,
			permissionKeyWords, permissionSimiWords, permissionStructure, permissionStructureWithKeyWords,
			collectionKeyWords, collectionSimiWords, collectionStructure, collectionDataTypes,
			sharingKeyWords, sharingSimiWords, sharingStructure, sharingDataTypes
		] = await getStructureBySimis(structure)
		
		await Models.Comment.updateOne({
			_id: comment.id
		}, {
			securityKeyWords, securitySimiWords, securityStructure, securityStructureWithKeywords,
			privacyKeyWords, privacySimiWords, privacyStructure, privacyStructureWithKeyWords,
			permissionKeyWords, permissionSimiWords, permissionStructure, permissionStructureWithKeyWords,
			collectionKeyWords, collectionSimiWords, collectionStructure, collectionDataTypes,
			sharingKeyWords, sharingSimiWords, sharingStructure, sharingDataTypes,
			isAnalyzed: true
		})

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securityKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securitySimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securityStructure'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securityStructureWithKeywords'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacyKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacySimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacyStructure'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacyStructureWithKeyWords'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'permissionKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'permissionSimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'permissionStructure'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'permissionStructureWithKeyWords'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionSimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionStructure'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionDataTypes'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingSimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingStructure'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingDataTypes'});

		await Models.CommentMeta.insertMany([
			{
				commentId: comment.id,
				key: 'securityKeyWords',
				value: JSON.stringify(securityKeyWords)
			},
			{
				commentId: comment.id,
				key: 'securitySimiWords',
				value: JSON.stringify(securitySimiWords)
			},
			{
				commentId: comment.id,
				key: 'securityStructure',
				value: JSON.stringify(securityStructure)
			},
			{
				commentId: comment.id,
				key: 'securityStructureWithKeywords',
				value: JSON.stringify(securityStructureWithKeywords)
			},

			{
				commentId: comment.id,
				key: 'privacyKeyWords',
				value: JSON.stringify(privacyKeyWords)
			},
			{
				commentId: comment.id,
				key: 'privacySimiWords',
				value: JSON.stringify(privacySimiWords)
			},
			{
				commentId: comment.id,
				key: 'privacyStructure',
				value: JSON.stringify(privacyStructure)
			},
			{
				commentId: comment.id,
				key: 'privacyStructureWithKeyWords',
				value: JSON.stringify(privacyStructureWithKeyWords)
			},

			{
				commentId: comment.id,
				key: 'permissionKeyWords',
				value: JSON.stringify(permissionKeyWords)
			},
			{
				commentId: comment.id,
				key: 'permissionSimiWords',
				value: JSON.stringify(permissionSimiWords)
			},
			{
				commentId: comment.id,
				key: 'permissionStructure',
				value: JSON.stringify(permissionStructure)
			},
			{
				commentId: comment.id,
				key: 'permissionStructureWithKeyWords',
				value: JSON.stringify(permissionStructureWithKeyWords)
			},


			{
				commentId: comment.id,
				key: 'collectionKeyWords',
				value: JSON.stringify(collectionKeyWords)
			},
			{
				commentId: comment.id,
				key: 'collectionSimiWords',
				value: JSON.stringify(collectionSimiWords)
			},
			{
				commentId: comment.id,
				key: 'collectionStructure',
				value: JSON.stringify(collectionStructure)
			},
			{
				commentId: comment.id,
				key: 'collectionDataTypes',
				value: JSON.stringify(collectionDataTypes)
			},

			{
				commentId: comment.id,
				key: 'sharingKeyWords',
				value: JSON.stringify(sharingKeyWords)
			},
			{
				commentId: comment.id,
				key: 'sharingSimiWords',
				value: JSON.stringify(sharingSimiWords)
			},
			{
				commentId: comment.id,
				key: 'sharingStructure',
				value: JSON.stringify(sharingStructure)
			},
			{
				commentId: comment.id,
				key: 'sharingDataTypes',
				value: JSON.stringify(sharingDataTypes)
			},
		])
	}

	const commentChunks = _.chunk(comments, 100)
	for(let i = 0; i < commentChunks.length; i++) {
		console.log(`Running ${i+ 1}/${commentChunks.length}`) 
		const chunk = commentChunks[i];
		
		await Promise.all(chunk.map(step2ByApp))
	}
}


async function step22() {
	console.log("Load model")
	// https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
	w2vModel  = await new Promise((resolve, reject) => {
		w2v.loadModel( process.env.W2V_MODEL, function( error, model ) {
			if(error) reject(error)
			
			resolve(model)
		});
	})
	
	const getSimiWord = (keyword) => {
		let mostSimilarWords
		if(w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword]
		else {
			mostSimilarWords = w2vModel.mostSimilar( keyword, 20 )
			w2vModelData[keyword] = mostSimilarWords
		}

		const words = mostSimilarWords ? _.map(mostSimilarWords, 'word').map(item => item.toLowerCase()) : []
		return words
	}

	const getData = async (comment) => {
		const commentText = comment.comment
		const subComments = commentText.split(".").map(item => item.trim()).filter(item => !!item)
		
		// 
		const simiSecurity = getSimiWord('security')
		let securitySentences = subComments.filter(subComment => {
			return simiSecurity.some(word => subComment.toLowerCase().includes(word.toLowerCase()))
		})
		securitySentences = _.uniq(securitySentences)

		// 
		const simiPrivacy = getSimiWord('privacy')
		let privacySentences = subComments.filter(subComment => {
			return simiPrivacy.some(word => subComment.toLowerCase().includes(word.toLowerCase()))
		})
		privacySentences = _.uniq(privacySentences)

		// 
		const simiPermission = getSimiWord('permission')
		const hasPermission = simiPermission.some(word => commentText.toLowerCase().includes(word.toLowerCase()))
		let permissionSentences = []
		if(hasPermission) {
			const simiPermissionItems = PERMISSIONS.reduce((acc, item) => {
				return acc = [...acc, ...getSimiWord(item)]
			}, [])
			permissionSentences = subComments.filter(subComment => {
				return simiPermissionItems.some(word => subComment.toLowerCase().includes(word.toLowerCase()))
			})
		}
		
		// 
		const simiCollection = getSimiWord('collection')
		const hasCollection = simiCollection.some(word => commentText.toLowerCase().includes(word.toLowerCase()))
		let collectionSentences = []
		if(hasCollection) {
			const simiItems = [...DATA_TYPES, ...PURPOSES].reduce((acc, item) => {
				return acc = [...acc, ...getSimiWord(item)]
			}, [])

			collectionSentences = subComments.filter(subComment => {
				return simiItems.some(word => subComment.toLowerCase().includes(word.toLowerCase()))
			})
		}
		collectionSentences = _.uniq(collectionSentences)

		// 
		const simiSharing = getSimiWord('sharing')
		const hasSharing = simiSharing.some(word => commentText.toLowerCase().includes(word.toLowerCase()))
		let sharingSentences = []
		if(hasSharing) {
			const simiItems = [...DATA_TYPES, ...PURPOSES, ...THIRD_PARTIES].reduce((acc, item) => {
				return acc = [...acc, ...getSimiWord(item)]
			}, [])

			sharingSentences = subComments.filter(subComment => {
				return simiItems.some(word => subComment.toLowerCase().includes(word.toLowerCase()))
			})
		}
		sharingSentences = _.uniq(sharingSentences)

		const result = { securitySentences, privacySentences, permissionSentences, collectionSentences, sharingSentences }

		await Models.Comment.updateOne({
			_id: comment.id
		}, result)
		return 
	}

	const comments = await Models.Comment.find({
		isLabeled: true,
	})


	// for(let i = 0; i < comments.length; i++) {
	// 	const comment = comments[i]

	// 	await getData(comment.comment)
	// }

	const commentChunks = _.chunk(comments, 100)
	for(let i = 0; i < commentChunks.length; i++) {
		console.log(`Running ${i+ 1}/${commentChunks.length}`) 
		const chunk = commentChunks[i];
		
		await Promise.all(chunk.map(getData))
	}
}
main()
async function main() {
	// await step1()
	// await step2()
	await step22()
}

// file2()
async function file2(){
	let result = {}
	const data = await csv({
			noheader: true,
			output: "csv",
	}).fromFile("/Users/a1234/Downloads/file2.csv");

	data.forEach(item => {
		if(!result[item[1]]) result[item[1]] = []

		if(!result[item[1]].includes(item[7])) result[item[1]].push(item[7])
	})

	console.log(result)
}

async function retry (promise, time) {
  let counter = 1
  let status = false
  let result

  do {
    try {
      result = await promise
      status = true
    } catch (error) {
      result = error
      counter++

			await sleep(10 * 1000)
    }
  } while (!status && counter <= time)

  if (!status) throw result

  return result
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}