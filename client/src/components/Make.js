import './Make.css'
import { useState } from 'react';
import { useHistory } from "react-router-dom"

let currQNum = 1
let quizData = {
    num_questions: 0,
    questions: {},
}
const Make = () => {
    const history = useHistory()
    const [error, setError] = useState('')
    const [answer_entry, setAnswer] = useState([
        {value: "", placeholder: 'Answer 1', key: 0},
        {value: "", placeholder: 'Answer 2', key: 1},
        {value: "", placeholder: 'Answer 3', key: 2},
        {value: "", placeholder: 'Answer 4', key: 3},
    ])
    const [selected_radio, setRadio] = useState({value: ""})
    const [question_entry, setQuestion] = useState({value: ""})
    const [isDisplayedPrev, setIsDisplayedPrev] = useState(false)
    const [questionNum, setQuestionNum] = useState("Question 1")
    const prevButtonStyleMake = {
        borderRadius: "5px",
        backgroundColor: "#bdbdbd",
        width:"30%",
        fontSize:"30px",
        marginRight:"10%",
        marginLeft:"4%",
        padding:"1%",
        boxSizing:"border-box",
        cursor:"pointer",
        display: isDisplayedPrev ? 'block' : 'none'
    }

    const setBaseError = () => {
        setError("")
    }
    const checkPrevDisplay = (inc) => {
        if((currQNum === 2 && inc) || (currQNum === 1 && !inc)){
            setIsDisplayedPrev(!isDisplayedPrev)
        }
    }
    const submitClicked = () => {
        let check = false
        if(checkInputted(true)){
            saveTest(currQNum)
            check = true
        }
        if(check || currQNum > 1){
        fetch('http://localhost:2718/submit_quiz', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(quizData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Recieved Response: ', data)
                if(data['status'] === "failed") {
                    console.log("Server error")
                    setError('Failed To Submit, Try Again Later')
                } else if(data['status'] === "passed"){
                    let path = '/IdPage/' + data['id']
                    history.push(path)
                }
            })
        } else {
            setError("Must be at Least One Complete Question")
        }
    }

    const answerChanged = (event, index) =>{
        const updatedTextEntry = [...answer_entry]
        updatedTextEntry[index]['value'] = event.target.value
        setAnswer(updatedTextEntry)
    }

    const questionChanged = (event) => {
        const newState = {...question_entry}
        newState.value = event.target.value
        setQuestion(newState)
    }
    const nextClicked = () => {
        nextPrevUpdate(true)
    }
    const prevClicked = () => {
        nextPrevUpdate(false)
    }
    const nextPrevUpdate = (inc) => {
        setBaseError()
        if(checkInputted(inc)){
            saveTest(currQNum)
            if(inc){
                currQNum++
            } else {
                currQNum--
            }
            setEntry(currQNum <= quizData['num_questions'])
            updateQuestionNum()
            checkPrevDisplay(inc)
        }
    }

    const updateQuestionNum = () => {
        setQuestionNum("Question " + currQNum)
    }
    const checkInputted = (inc) => {
        let returnValue = true
        if(inc){
            answer_entry.map((item) => {
                if(item.value === ""){
                    setError("You Must Fill Out 4 Answer Choices")
                    returnValue = false
                } else {
                }
            })
            if(returnValue){
                if(question_entry.value === "" || question_entry.value === undefined){
                    setError("You Must Fill Out a Question")
                    returnValue = false
                }
                else {
                }
                if(returnValue){
                    if(selected_radio.value === "" || selected_radio.value === undefined){
                        setError("You Must Select a Correct Answer")
                        returnValue = false
                    }
                }
            }
    }
        return returnValue
    }

    const radioChanged = (event) =>{
        const newRadio = {...selected_radio}
        newRadio.value = event.target.value
        setRadio(newRadio)
    }
    const saveTest = (index) => {
        if(index > quizData['num_questions']){
            quizData['num_questions'] = quizData['num_questions'] + 1
        }
        quizData['questions']['question_' + index] = {}
        quizData['questions']['question_' + index]['question'] = question_entry.value
        answer_entry.map((item) => {
            quizData['questions']['question_' + index]['answer_' + item.key] = item.value
        })
        quizData['questions']['question_' + index]['correct_answer'] = selected_radio.value
        console.log("Submitted: ", quizData)
    }

    const setEntry = (check) => {
        const updatedTextEntry = [...answer_entry]
        for(let i = 0; i < 4; i++){
            if(check){
                updatedTextEntry[i]['value'] = quizData['questions']['question_' + currQNum]['answer_' + i]
            } else {
                updatedTextEntry[i]['value'] = ""
            }
        }
        setAnswer(updatedTextEntry)
        const newState = {...question_entry}
        if(check){
            newState.value = quizData['questions']['question_' + currQNum]['question']
        } else {
            newState.value = ""
        }
        setQuestion(newState)
        const newRadio = {...selected_radio}
        if(check){
            newRadio.value = quizData['questions']['question_' + currQNum]['correct_answer']
        } else {
            newRadio.value = ""
        }
        setRadio(newRadio)
    }

    return (
        <div className="make_main">
            <div className="question_num_make"><p className="question_num_text_make">{questionNum}</p></div>
            
            <div className="question_main_make">
                <div className="question_entry_make">
                    <textarea onChange={(event) => {
                        questionChanged(event)
                    }} placeholder="Question" className="question_entry_box_make" value={question_entry.value}></textarea>
                    <p className="error_box_make">{error}</p>
                    <div className="button_container_make">
                        <div className="next_prev_button_container_make">
                            <button onClick={prevClicked} className="next_button_make" style={prevButtonStyleMake}>Prev</button>
                            <button onClick={nextClicked} className="next_button_make">Next</button>
                        </div>
                        <button onClick={() => {
                            submitClicked()
                        }}className="submit_button_make">Submit</button>
                    </div>
                </div>
                <div className="answer_entry_make">
                    {answer_entry.map((item) => {
                        return(
                            <div className="answer_entry_container_make" key={"answer_div_" + item.key}>
                                <input type="radio" className="radio_make" value={'option_' + (item.key + 1)} onChange={(event) => {
                                    radioChanged(event)}} checked={selected_radio.value === 'option_' + (item.key + 1)} key={"radio_" + item.key}/>
                                <textarea onChange={(event) => {
                                answerChanged(event, item.key)
                                }}id = {"ans_entry_" + item.key}placeholder={item.placeholder} key={item.key} value={item.value}className='answer_entry_box_make'></textarea>
                        </div>
                        )
                    })}
                </div>
            </div>
            </div>
    );
}
 
export default Make;