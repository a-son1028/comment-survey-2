import path from 'path';
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import "../src/configs/mongoose.config";
import Models from "../src/models";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
// main()
async function main() {
    const header = [
    {
      id: "stt",
      title: "#",
    },
		{
      id: "email",
      title: "Email",
    },
		{
      id: "numberOfNumber",
      title: "Number of comment",
    },
		{
      id: "comment",
      title: "Content of comment",
    },
		// 1
    {
      id: "question1value",
      title: "1 - Security and Privacy comment",
    },
    {
      id: "question1coppiedContent",
      title: "Textbox content of first question",
    },
		{
      id: "question1reason",
      title: "Textbox reason of first question",
    },

		// 2
		{
      id: "question2value",
      title: "2 - Security sentiment",
    },
    {
      id: "question2coppiedContent",
      title: "Textbox content of second question",
    },

		// 3 
		{
      id: "question3value",
      title: "3 - Security sentiment",
    },
    {
      id: "question3coppiedContent",
      title: "Textbox content of third question",
    },

		// 4 
		{
      id: "question4value",
      title: "4 - Permission",
    },

		// 4.1
		{
      id: "question5value",
      title: "4.1 - Specific permission",
    },
		{
      id: "question5selectedContent",
      title: "4.1 - related content",
    },


		// 5
		{
      id: "question6value",
      title: "5 - data collection",
    },
		{
      id: "question6coppiedContent",
      title: "Textbox content of the fifth question",
    },

		// 5.1
		{
      id: "question7value",
      title: "5.1 - purpose of data collection",
    },
		{
      id: "question7selectedContent",
      title: "Related content of the 5.1 question (checkbox value)",
    },
		{
      id: "question7others",
      title: "Related content of the 5.1 question (input value)",
    },

		// 6
		{
      id: "question8value",
      title: "6 - data sharing",
    },
		{
      id: "question8coppiedContent",
      title: "Textbox content of the sixth question",
    },


		// 6.1
		{
      id: "question9value",
      title: "6.1 - purpose of data sharing",
    },
		{
      id: "question9selectedContent",
      title: "Related content of the 6.1 question (checkbox value)",
    },
		{
      id: "question9others",
      title: "Related content of the 6.1 question (input value)",
    },

		// 6.2
		{
      id: "question10value",
      title: "6.2 - purpose of data sharing",
    },
		{
      id: "question10selectedContent",
      title: "Related content of the 6.2 question (checkbox value)",
    },
		{
      id: "question10others",
      title: "Related content of the 6.2 question (input value)",
    },
  ];
	const rows = []
	
	const comments = await Models.Comment.find()
	const answers = await Models.Answer.find({
		userId: '6248a4f93e326c00140e8ace'
	})

	let stt = 1
	for(let i = 0; i < answers.length; i++) {
		const answer = answers[i];
		const user = await Models.User.findById(answer.userId)

		answer.questions.forEach((question, index) => {

			const comment = comments.find(comment => comment.commentId === question.commentId)
			let row = {}

			let question1Value, question4Value, question5Value, question6Value;
			question.responses.forEach((response, questionIndex) => {
				
				questionIndex = questionIndex + 1

				switch (questionIndex) {
					case 1: {
						const lables = ["No", "Yes", "Maybe"]

						question1Value = response.value
						row = {
							...row,
							[`question${questionIndex}value`]: lables[response.value],
							[`question${questionIndex}coppiedContent`]: question1Value == 1 ? response.coppiedContent : '',
							[`question${questionIndex}reason`]: question1Value != 1 ? response.reason : '',
						}
						break;
					}
					case 2:
					case 3: {
						if(question1Value == 1) {
							const lables = ["Negative", "Positive", "Neutral", "None"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}coppiedContent`]: response.value != 3 ? response.coppiedContent : '',
							}
						}

						break;
					}
					case 4: {
						question4Value = response.value
						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
							}
						}

						break;
					}
					// 4.1
					case 5: {
						if(question1Value == 1 && question4Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
							}
						}
						break;
					}
					// 5
					case 6: {
						question5Value = response.value

						if(question1Value == 1) {

							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}coppiedContent`]: response.value == 1 ? response.coppiedContent : '',
							}
						}

						break;
					}
					// 5.1
					case 7: {
						if(question1Value == 1 && question5Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6
					case 8: {
						question6Value = response.value

						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}coppiedContent`]: response.value == 1 ? response.coppiedContent : ''
							}
						}
						break;
					}
					// 6.1
					case 9: {
						if(question1Value == 1 && question6Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6.2
					case 10: {
						if(question1Value == 1 && question6Value == 1) { 
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					default: {
						row = {
							...row,
							[`question${questionIndex}value`]: response.value == "1" ? "Yes" : (response.value == "0" ? "No" : "Maybe"),
							[`question${questionIndex}coppiedContent`]: response.coppiedContent,
							[`question${questionIndex}selectedContent`]: response.selectedContent.join(", "),
							[`question${questionIndex}reason`]: response.reason,
							[`question${questionIndex}others`]: response.others,
						}
						break
					}
				}
			})
			
			rows.push({
				stt: stt++,
				email: user.email,
				numberOfNumber: index + 1,
				comment: comment.comment,
				...row
			})
		})

		
	}

	const csvWriter = createCsvWriter({
    	path: "./report-user.csv",
		header,
	});
	await csvWriter.writeRecords(rows);

	console.log("DONE")
}

// lables()
async function lables() {
    const header = [
    {
      id: "stt",
      title: "#",
    },
		{
      id: "email",
      title: "Email",
    },
	{
      id: "numberOfNumber",
      title: "Number of comment",
    },
	{
      id: "comment",
      title: "Comment",
    },
	{
      id: "label",
      title: "Label",
    },	
  ];
	const rows = []
	
	const comments = await Models.Comment.find()
	const answers = await Models.Answer.find({
		userId: '6248a4f93e326c00140e8ace'
	})

	let stt = 1
	for(let i = 0; i < answers.length; i++) {
		const answer = answers[i];
		const user = await Models.User.findById(answer.userId)

		answer.questions.forEach((question, index) => {

			const comment = comments.find(comment => comment.commentId === question.commentId)
			let row = {}

			let question1Value, question4Value, question5Value, question6Value;

			let lable = ''
			question.responses.forEach((response, questionIndex) => {
				
				questionIndex = questionIndex + 1

				switch (questionIndex) {
					case 1: {
						const lables = ["No", "Yes", "Maybe"]

						question1Value = response.value
						lable += `${response.value == 1 ? 1 : 0}`
						break;
					}
					case 2:
					case 3: {
						if(question1Value == 1) {
							const lables = ["Negative", "Positive", "Neutral", "None"]

							if(response.value != 3) {
								lable += `, ${questionIndex}`
							}
						}

						break;
					}
					case 4: {
						question4Value = response.value
						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							
							if(response.value == 1) {
								lable += `, ${questionIndex}`
							}
						}

						break;
					}
					// 4.1
					case 5: {
						if(question1Value == 1 && question4Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
							}
						}
						break;
					}
					// 5
					case 6: {
						question5Value = response.value

						if(question1Value == 1) {

							const lables = ["No", "Yes"]
							if(response.value == 1) {
								lable += `, ${5}`
							}
						}

						break;
					}
					// 5.1
					case 7: {
						if(question1Value == 1 && question5Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6
					case 8: {
						question6Value = response.value

						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							
							if(response.value == 1) {
								lable += `, ${6}`
							}
						}
						break;
					}
					// 6.1
					case 9: {
						if(question1Value == 1 && question6Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6.2
					case 10: {
						if(question1Value == 1 && question6Value == 1) { 
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					default: {
						row = {
							...row,
							[`question${questionIndex}value`]: response.value == "1" ? "Yes" : (response.value == "0" ? "No" : "Maybe"),
							[`question${questionIndex}coppiedContent`]: response.coppiedContent,
							[`question${questionIndex}selectedContent`]: response.selectedContent.join(", "),
							[`question${questionIndex}reason`]: response.reason,
							[`question${questionIndex}others`]: response.others,
						}
						break
					}
				}
			})
			
			rows.push({
				stt: stt++,
				email: user.email,
				numberOfNumber: index + 1,
				comment: comment.comment,
				label: lable
			})
		})

		
	}

	const csvWriter = createCsvWriter({
    	path: "./report-label.csv",
		header,
	});
	await csvWriter.writeRecords(rows);

	console.log("DONE")
}

// lablesAndContents()
async function lablesAndContents() {
    const header = [
    {
      id: "stt",
      title: "#",
    },
		{
      id: "email",
      title: "Email",
    },
	{
      id: "numberOfNumber",
      title: "Number of comment",
    },
	{
      id: "comment",
      title: "Comment",
    },
		{
      id: "coppiedContent",
      title: "Copied content",
    },
	{
      id: "label",
      title: "Label",
    },	
  ];
	const rows = []
	
	const comments = await Models.Comment.find()
	const answers = await Models.Answer.find({
		userId: '6248a4f93e326c00140e8ace'
	})

	let stt = 1
	for(let i = 0; i < answers.length; i++) {
		const answer = answers[i];
		const user = await Models.User.findById(answer.userId)

		answer.questions.forEach((question, index) => {

			const comment = comments.find(comment => comment.commentId === question.commentId)
			let row = {}

			let question1Value, question4Value, question5Value, question6Value;

			let labels = []
			question.responses.forEach((response, questionIndex) => {
				
				questionIndex = questionIndex + 1

				switch (questionIndex) {
					case 1: {
						const lables = ["No", "Yes", "Maybe"]

						question1Value = response.value

						
						break;
					}
					case 2:
					case 3: {
						if(question1Value == 1) {
							const lables = ["Negative", "Positive", "Neutral", "None"]

							if(response.value != 3) {
								labels.push({
									label: questionIndex,
									coppiedContent: response.coppiedContent
								})
							}
						}

						break;
					}
					case 4: {
						question4Value = response.value
						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							
							if(response.value == 1) {
								labels.push({
									label: questionIndex,
									coppiedContent: response.coppiedContent
								})
							}
						}

						break;
					}
					// 4.1
					case 5: {
						if(question1Value == 1 && question4Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
							}
						}
						break;
					}
					// 5
					case 6: {
						question5Value = response.value

						if(question1Value == 1) {

							const lables = ["No", "Yes"]
							if(response.value == 1) {
								labels.push({
									label: 5,
									coppiedContent: response.coppiedContent
								})
							}
						}

						break;
					}
					// 5.1
					case 7: {
						if(question1Value == 1 && question5Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6
					case 8: {
						question6Value = response.value

						if(question1Value == 1) {
							const lables = ["No", "Yes"]
							
							if(response.value == 1) {
								labels.push({
									label: 6,
									coppiedContent: response.coppiedContent
								})
							}
						}
						break;
					}
					// 6.1
					case 9: {
						if(question1Value == 1 && question6Value == 1) {
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					// 6.2
					case 10: {
						if(question1Value == 1 && question6Value == 1) { 
							const lables = ["No", "Yes"]
							row = {
								...row,
								[`question${questionIndex}value`]: lables[response.value],
								[`question${questionIndex}selectedContent`]: response.value == 1 ? response.selectedContent.join(", ") : '',
								[`question${questionIndex}others`]: response.value == 1 ? response.others : '',
							}
						}
						
						break;
					}
					default: {
						row = {
							...row,
							[`question${questionIndex}value`]: response.value == "1" ? "Yes" : (response.value == "0" ? "No" : "Maybe"),
							[`question${questionIndex}coppiedContent`]: response.coppiedContent,
							[`question${questionIndex}selectedContent`]: response.selectedContent.join(", "),
							[`question${questionIndex}reason`]: response.reason,
							[`question${questionIndex}others`]: response.others,
						}
						break
					}

					
				}
			})

			if(labels && labels.length > 0) {
				const sttItem = stt++
				const numberOfNumber = index + 1;
				labels.forEach(item => {
					rows.push({
						stt: sttItem,
						email: user.email,
						numberOfNumber,
						comment: comment.comment,
						...item,
					})
				})
			}
			
		})

		
	}

	const csvWriter = createCsvWriter({
    	path: "./report-label-content.csv",
		header,
	});
	await csvWriter.writeRecords(rows);

	console.log("DONE")
}

// calculatePrecision()
async function calculatePrecision() {
	const header = [
    {
      id: "stt",
      title: "#",
    },
		{
      id: "label",
      title: "Label",
    },
		{
      id: "predictLabel",
      title: "Predict label",
    },
	{
      id: "comment",
      title: "Comment",
    },
  ];
	const testResult = await csv({
		noheader: true,
		output: "csv",
	}).fromFile("/Users/a1234/Downloads/tranning-testing/test_results.csv");

	const testingFile = await csv({
		noheader: true,
		output: "csv",
	}).fromFile("/Users/a1234/Downloads/tranning-testing/testing.csv");
	
	
	const rows = []
	testingFile.forEach((item, index) => {

		const predictLabel = Number(testResult[index][0]) > Number(testResult[index][1]) ? 0 : 1
		rows.push({
			stt: index + 1,
			label: item[0],
			predictLabel,
			comment: item[1],
		})
	})
	const csvWriter = createCsvWriter({
		path: "./report-label-merged-predict-label.csv",
		header,
	});
	await csvWriter.writeRecords(rows);


	let X = 0,
    Y = 0,
    Z = 0,
    W = 0;
	testingFile.forEach((item, index) => {

		const predictLabel = Number(testResult[index][0]) > Number(testResult[index][1]) ? 0 : 1
		const label = Number(item[0])

		if (predictLabel === 0 && label === 0) X++;
    else if (predictLabel === 1 && label === 0) Y++;
    else if (predictLabel === 0 && label === 1) Z++;
    else if (predictLabel === 1 && label === 1) W++;
	})

	const PrecisionBenign = X / (X + Z);
  const RecallBenign = X / (X + Y);
	const F1Benign =
    (2 * (PrecisionBenign * RecallBenign)) / (PrecisionBenign + RecallBenign);

	const Accuracy = (X + W) / (X + Y + Z + W);

	const headerAccuracy = [
    {
      id: "name",
      title: "",
    },
    {
      id: "begin",
      title: "",
    },
  ];

	const rowsAccuracy = [
    {
      name: "Percision",
      begin: PrecisionBenign,
    },
    {
      name: "Recall",
      begin: RecallBenign,
    },
    {
      name: "F1",
      begin: F1Benign,
    },
    {
      name: "Accuracy",
      begin: Accuracy,
    },
  ];

  const csvWriterAccuracy = createCsvWriter({
    path: "commentAccuracy.csv",
    header: headerAccuracy,
  });
  await csvWriterAccuracy.writeRecords(rowsAccuracy);

	console.log("DONE")
}
getUserDone()
async function getUserDone() {
	const header = [
    {
      id: "stt",
      title: "#",
    },
	{
      id: "id",
      title: "ID of microworker",
    },
		{
      id: "email",
      title: "Email",
    },
	{
      id: "time",
      title: "time",
    },
	{
      id: "num",
      title: "Total questions did",
    },
  ];
	const rows = []
	const dataFromMicro = await csv({
		noheader: true,
		output: "csv",
	}).fromFile("/Users/a1234/Downloads/CSVReport_7beca3259a6a_B_Page#1_With_PageSize#5000.csv");

	
	
	const answers = await Models.Answer.find()

	for(let i = 0; i < answers.length; i++) {
		const answer = answers[i];
		const user = await Models.User.findById(answer.userId)

		const resultInMicro = dataFromMicro.find(item => item[2].trim() === user.email)

		console.log(1, `${answer.questions.length.toString()}`)
		
		rows.push({
			stt: i + 1,
			id: resultInMicro ? resultInMicro[0] : '',
			email: user.email,
			time: resultInMicro ? resultInMicro[1] : '',
			num: `${answer.questions.length.toString()}`
		})
	}


	const csvWriter = createCsvWriter({
    	path: "./report-user(done-undone).csv",
		header,
	});
	await csvWriter.writeRecords(rows);
	console.log("DONE")
}