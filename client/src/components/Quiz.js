import './Quiz.css'
import './Make.css'
import {useHistory} from 'react-router-dom'
import {useState} from 'react'
import {useEffect} from 'react'

let currQNum = 1
let responseData= {}
const Quiz = () => {
    const history = useHistory()
    const quiz = JSON.parse(sessionStorage.getItem('quiz'))
    const cred = JSON.parse(sessionStorage.getItem('cred'))
    let quizCheck = false;
    const checkData = () => {
        console.log("Quiz: ", quiz)
        if(quiz == null || quiz == {}){
            quizCheck = false
            history.push('/NoQuiz')
        } else {
            quizCheck = true
        }
    }
    checkData()
    const[question_num, setQuestionNum] = useState("Question 1")
    const renderDataQuestion = () => {
        if(quizCheck){
            return quiz.questions.question_1.question
        }
        return ""
    }
    const[question_text, setQuestionText] = useState(renderDataQuestion())
    const[error, setError] = useState("")
    const renderDataAnswer = (index) => {
        if(quizCheck){
            return quiz['questions']['question_1']['answer_' + index]
        }
        return ""
    }
    const [answer_entry, setAnswer] = useState([
        {text: renderDataAnswer(0), key: 0},
        {text: renderDataAnswer(1), key: 1},
        {text: renderDataAnswer(2), key: 2},
        {text: renderDataAnswer(3),  key: 3},
    ])
    const [isDisplayedPrev, setIsDisplayedPrev] = useState(false)
    const checkNext = () => {
        if(quizCheck){
            return quiz.num
        }
    }
    const [isDisplayedNext, setIsDisplayedNext] = useState(quizCheck && quiz.num_questions > 1)
    const [selected_radio, setRadio] = useState({value: ""})
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
    const nextButtonStyleMake = {
        borderRadius: "5px",
        backgroundColor: "#bdbdbd",
        width:"30%",
        fontSize:"30px",
        marginRight:"10%",
        marginLeft:"4%",
        padding:"1%",
        boxSizing:"border-box",
        cursor:"pointer",
        display: isDisplayedNext ? 'block' : 'none'
    }
    const checkPrevDisplay = (inc) => {
        if((currQNum === 2 && inc) || (currQNum === 1 && !inc)){
            setIsDisplayedPrev(!isDisplayedPrev)
        }
    }
    const checkNextDisplay = (inc) => {
        if((currQNum == quiz.num_questions && inc) || (currQNum === quiz.num_questions - 1 && !inc)){
            setIsDisplayedNext(!isDisplayedNext)
        }
    }

    const radioChanged = (event) =>{
        const newRadio = {...selected_radio}
        newRadio.value = event.target.value
        setRadio(newRadio)
        responseData['question_' + currQNum] = event.target.value
    }

    const nextClicked = () => {
        nextPrevUpdate(true)
    }
    const prevClicked = () => {
        nextPrevUpdate(false)
    }

    const nextPrevUpdate = (inc) => {
        setError("")
        //saveTest(currQNum)
        if(inc){
            currQNum++
        } else {
            currQNum--
        }
        setEntry()
        setQuestionNum("Question " + currQNum)
        checkPrevDisplay(inc)
        checkNextDisplay(inc)
    }

    const saveTest = (index) => {
        responseData['question_' + currQNum] = selected_radio.value
    }

    const setEntry = () => {
        const updatedTextEntry = [...answer_entry]
        console.log("Quiz right Before: ", quiz)
        for(let i = 0; i < 4; i++){
            updatedTextEntry[i]['text'] = quiz['questions']['question_' + currQNum]['answer_' + i]
        }
        setAnswer(updatedTextEntry)
        setQuestionText(quiz['questions']['question_' + currQNum]['question'])
        if(responseData['question_' + currQNum] != "none"){
            const newRadio = {...selected_radio}
            newRadio.value = responseData['question_' + currQNum]
            setRadio(newRadio)
        } else {
            const newRadio = {...selected_radio}
            newRadio.value = ""
            setRadio(newRadio)
        }
    }

    const submitResponse = () => {
        let score = 0;
        let output = {}
        for(let i = 1; i <= quiz.num_questions; i++){
            if(quiz['questions']['question_' + i]['correct_answer'] == responseData['question_' + i]){
                score++
            }
        }
        output['score'] = score
        output['id'] = cred.id
        output['username'] = cred.username
        fetch('http://localhost:2718/get_score', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(output)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Recieved Response: ', data)
                if(data['status'] === "failed") {
                    console.log("Server error")
                    setError('Failed To Submit, Try Again Later')
                } else if(data['status'] === "passed"){
                    let placeArr = []
                    for(let i=0; i < 3; i++){
                        if(data['place_' + i] == "none"){
                            placeArr[i] = "No Entry"
                        } else {
                            placeArr[i] = data["place_" + i]
                        }
                    }
                    sessionStorage.removeItem('cred')
                    sessionStorage.removeItem('quiz')
                    let tempPath = '/Result/' + placeArr[0] + "/" + placeArr[1] + '/' + placeArr[2] + '/' + data['place']
                    history.push(tempPath)
                    console.log("Response Data: ", data)
                }
            })
    }
    const answerClicked = (index) => {
        const newRadio = {...selected_radio}
        newRadio.value = 'option_' + (index + 1)
        setRadio(newRadio)
        responseData['question_' + currQNum] = 'option_' + (index + 1)
        console.log("response: ", responseData)
    }

    //setEntry()
    useEffect(() => {
        if(quizCheck){
            for(let i = 1; i <= quiz.num_questions; i++){
                console.log("Iterated")
                if(responseData['question_i'] == null){
                    responseData['question_' + i] = "none"
                }
            }
        }
    }, []);
    return (
        <div className="make_main">
            <div className="question_num_make"><p className="question_num_text_make">{question_num}</p></div>
        <div className="question_main_make">
            <div className="question_entry_make">
                <p className="question_entry_box_make">{question_text}</p>
                <p className="error_box_make">{error}</p>
                <div className="button_container_make">
                    <div className="next_prev_button_container_make">
                        <button onClick={prevClicked} className="next_button_make" style={prevButtonStyleMake}>Prev</button>
                        <button onClick={nextClicked} className="next_button_make" style={nextButtonStyleMake}>Next</button>
                    </div>
                    <button onClick={() => {
                            submitResponse()
                        }}className="submit_button_make">Submit</button>
                </div>
            </div>
            <div className="answer_entry_make">
                    {answer_entry.map((item) => {
                        return(
                            <div className="answer_entry_container_quiz" key={"answer_div_take_" + item.key}>
                                <input type="radio" className="radio_make" value={'option_' + (item.key + 1)} onChange={(event) => {
                                    radioChanged(event)}} checked={selected_radio.value === 'option_' + (item.key + 1)}/>
                                <p onClick={() => {
                                    answerClicked(item.key)
                                }}
                                className="answer_entry_box_quiz">{item.text}</p>
                        </div>
                        )
                    })}
            </div>
        </div>
        </div>
    );
}
 
export default Quiz;