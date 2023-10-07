const express = require("express")
const app = express()
const parser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
app.use(parser.json())
app.use(cors())
app.get('/api', (req, res) => {
    
})

app.listen(2718, () => {
    console.log("Server started on port 2718")
})

app.post('/submit_quiz', (req, res) => {
    console.log("POST req received: submit")
    const submitted = req.body
    let returnData = {}
    let idData = {}
    fs.readFile('./data_base/quiz_data/valid_id.json', 'utf-8', (err, data) => {
        if(err){
            console.log('Error occured when reading valid IDs')
            returnData['status'] = "failed"
            res.json(returnData)
            return
        } else {
            idData = JSON.parse(data)
            console.log("File: ", data, "\nData: ", idData)
        }
    })
    fs.readFile('./data_base/quiz_data/quizes.json', 'utf8', (err, data) => {
        if(err){
            console.log('Error occured when reading all quizes')
            returnData['status'] = "failed"
            res.json(returnData)
        } else {
            let quizData = JSON.parse(data)
            console.log("File: ", data, "\nData: ", idData)
            let check = true
            let temp = 0
            while(check){
                temp = Math.floor(Math.random() * (9001) + 1000);
                console.log('Fishing new ID')
                if(checkUnique(temp, idData)){
                    quizData['quiz_' + temp] = submitted
                    check = false
                    let targetName = '/data_base/response_data/quiz_' + temp
                    const finalPath = path.join(__dirname, targetName)
                    fs.mkdir(finalPath, {recursive: true}, (err) => {
                        if(err){
                            console.log("Error occured when making new dir")
                            returnData['status'] = 'failed'
                            res.json(returnData)  
                        }
                    })
                    sortNewId(idData, temp)
                    fs.writeFile('./data_base/quiz_data/valid_id.json', JSON.stringify(idData), 'utf-8', (err) => {
                        if(err){
                            console.log("Error occured when writing file")
                            returnData['status'] = 'failed'
                            res.json(returnData) 
                        }
                    })
                    fs.writeFile('./data_base/quiz_data/quizes.json', JSON.stringify(quizData), 'utf-8', (err) => {
                        if(err){
                            console.log("Error occured when writing file")
                            returnData['status'] = 'failed'
                            res.json(returnData)
                        } else {
                            console.log("Added Successfully as ID: " + temp)
                            returnData['status'] = 'passed'
                            returnData['id'] = temp
                            res.json(returnData)
                        }
                    })
                }
            }
        }
    })
})

app.post('/get_quiz', (req, res) => {
    console.log("POST req received: Get Quiz")
    const submitted = req.body
    let returnData = {}
    let userData = {}
    let tempPath = './data_base/response_data/quiz_' + submitted.id
    console.log("Path: ", tempPath)
    if(fs.existsSync(tempPath)){
        if(fs.existsSync(tempPath + '/users.json')){
            console.log("Check failed")
            fs.readFile(tempPath + '/users.json', 'utf-8', (err, data) => {
                if(err){
                    console.log("Error occured: Reading user file")
                    returnData['status'] = "failed"
                    res.json(returnData)
                    return
                } else {
                    userData = JSON.parse(data)
                    let iter = 0;
                    while(userData['user_' + iter] != undefined){
                        if(userData['user_' + iter] == submitted.username){
                            returnData['status'] = "dupe user"
                            res.json(returnData)
                            return 
                        }
                        iter++
                    }
                }
            })
        } else {
            const input = JSON.stringify(userData, null, 2)
            fs.writeFile(tempPath + '/users.json', input, (err) => {
                if(err){
                    console.log("Error occured: Writing new User file")
                    returnData['status'] = "failed"
                    res.json(returnData)
                    return
                }
            })
        }
        returnData['quiz'] = {}
        let quizData = {}
        fs.readFile('./data_base/quiz_data/quizes.json', 'utf-8', (err, data) => {
            console.log("Retreving")
            if(err){
                console.log("Error occured: Reading user file")
                    returnData['status'] = "failed"
                    res.json(returnData)
                    return
            } else {
                console.log("retrieved data")
                quizData = JSON.parse(data)
                returnData['quiz'] = quizData['quiz_' + submitted.id]
            console.log("Quiz data: ", quizData)
            console.log("response: ", returnData['quiz'])
            if(returnData['quiz'] != undefined){
                returnData['status'] = "passed"
                res.json(returnData)
                return
            }
        console.log("Error occured: Quiz is undefined but passed all checks")
        returnData['status'] = "failed"
        res.json(returnData)
            }
        } )
        
        
    } else {
        returnData['status'] = "no test"
        res.json(returnData)
        return
    }
})

app.post('/get_score', (req, res) => {
    console.log("Submitted Post Response: Get Score")
    const submitted = req.body
    console.log("Data: ", submitted)
    const tempPath = "./data_base/response_data/quiz_" + submitted['id']
    let scoreData = {}
    let returnData = {}
    console.log("tempPath: ", tempPath)
    // fs.readFile(tempPath + '/users.json', 'utf-8', (err, data) => {
    //     if(err){
    //         console.log("error")
    //         returnData['status'] = "failed"
    //         res.json(returnData)
    //         return
    //     }
    //     console.log("Data: ", data)
    //     let users = {}
    //     try{
    //         users = JSON.parse(data)
    //     } catch{
    //         users = {}
    //         console.log("Dan it")
    //     }
        
    //     updateUsers(users, submitted.username)
    //     fs.writeFile(tempPath + '/users.json', JSON.stringify(users), (err) => {
    //         if(err){
    //             console.log("error")
    //             returnData['status'] = "failed"
    //             res.json(returnData)
    //             return
    //         }
    //     })
    // })
    if(fs.existsSync(tempPath + "/scores.json")){
        fs.readFile(tempPath + "/scores.json", 'utf-8', (err, data) => {
            if(err){
                console.log("Error Occured: Getting Scores")
                returnData['status'] = "failed"
                res.json(returnData)
                return
        }
        scoreData = JSON.parse(data)
        let placement = sortScores(scoreData, submitted.score, submitted.username)
        getTopThree(returnData, scoreData)
        fs.writeFile(tempPath + '/scores.json', JSON.stringify(scoreData), (err) => {
            if(err){
            console.log("Error occured: writing new File")
            }
        })
        returnData['status'] = "passed"
        returnData['place'] = placement
        res.json(returnData)
        })
    } else {
        console.log("Making new Res Json")
        scoreData['num_response'] = 1
        scoreData['response_0'] = {}
        scoreData['response_0']['username'] = submitted.username
        scoreData['response_0']['score'] = submitted.score
        returnData['place_0'] = submitted.username
        returnData['place_1'] = "none"
        returnData['place_2'] = "none"
        fs.writeFile(tempPath + '/scores.json', JSON.stringify(scoreData), (err) => {
            if(err){
                console.log("Error Occured: Writing new JSON")
                returnData['status'] = "failed"
                res.json(returnData)
                return
            }
            returnData['status'] = "passed"
            returnData['place'] = 1
            res.json(returnData)
        }) 
    }
})
function checkUnique(input, data){
    let iter = 0
    while(data['id_' + iter] != undefined){
        if(data['id_' + iter] == (input)) return false
        iter++
    }
    return true
}

function sortNewId(data, entry){
    console.log("Sorting: ", data, " and: ", entry)
    iter = 0
    while(data['id_' + iter] != undefined){
        if(data['id_' + iter] > entry){
            for(let i = (data['total_id']); i > iter; i--){
                data['id_' + i] = data['id_' + (i - 1)]
            }
            data['id_' + (iter)] = entry
            data['total_id'] = data['total_id'] + 1
            return
        }
        iter++
    }
    data['id_' + iter] = entry
    data['total_id'] = data['total_id'] + 1
}

function sortScores(data, entry, username){
    console.log("Min data: ", data)
    for(let i = 0; i < data.num_response; i++){
        if(entry > data['response_' + i]['score']){
            for(let j = data.num_response; j > i; j--){
                data['response_' + (j)] = data['response_' + (j - 1)]
            }
            data['response_' + i]['score'] = entry
            data['response_' + i]['username'] = username
            data.num_response = data.num_response + 1
            return i + 1
        }
    }
        data['response_' + data.num_response] = {}
        data['response_' + data.num_response]['score'] = entry
            data['response_' + data.num_response]['username'] = username
            data.num_response = data.num_response + 1
            return data.num_response
}

function getTopThree(output, data){
    for(let i = 0; i < 3; i++){
        if(data['response_' + i] == undefined){
            output['place_' + i] = "none" 
        } else {
            output['place_' + i] = data['response_' + i]['username']
        }
    }
}

function updateUsers(data, entry){
    let i = 0;
    while(data['user_' + i] != undefined){
        i++
    }
    data["user_" + i] = entry
}

