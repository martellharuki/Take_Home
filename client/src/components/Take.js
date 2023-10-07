import './Take.css'
import {useState} from 'react'
import {useHistory} from "react-router-dom"


const Take = () => {
    const history = useHistory()
    const [cred_entry, setCred] = useState([
        {value: "", placeholder: 'Test Id', key: 0},
        {value: "", placeholder: 'Username', key: 1},
    ])
    const [error, setError] = useState('')

    const credChange = (event, key) => {
        const newCred = [...cred_entry]
        newCred[key]['value'] = event.target.value
        setCred(newCred)
    }

    const enter_clicked = () => {
        if(checkValidInputs()){
            let quizCreds = {}
            const cred_list = cred_entry.map(item => item.value)
            quizCreds['id'] = cred_list[0]
            quizCreds['username'] = cred_list[1]
            fetch('http://localhost:2718/get_quiz', {
                method: 'POST',
                body: JSON.stringify(quizCreds),
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if(data.status === "failed"){
                        setError('Failed to Retrieve Test Try Again Later')
                    } else if(data.status === "no test"){
                        setError('No Quiz of that ID')
                    } else if(data.status === "dupe user"){
                        setError('Username is Already Taken')
                    } else if(data.status === "passed"){
                        console.log(data)
                        let tempPath = '/Quiz'
                        let cred = {}
                        cred.id = quizCreds['id']
                        cred.username = quizCreds.username
                        sessionStorage.setItem('quiz', "")
                        sessionStorage.setItem('cred', "")
                        sessionStorage.setItem('quiz', JSON.stringify(data.quiz))
                        sessionStorage.setItem('cred', JSON.stringify(cred))
                        history.push(tempPath)
                    }
                })
        } else {
        }
        
    }

    const checkValidInputs = () => {
        const cred_list = cred_entry.map(item => item.value)
        console.log(cred_list)
        if(cred_list[0] === '' || !checkDigits(cred_list[0]) || cred_list[0] < 1000 || cred_list[0] > 9999){
            setError('Enter A Valid Test ID')
            return false
        } else if(cred_list[1] === ''){
            setError('Enter A Unique Username')
            return false
        }
        return true
    }

    const checkDigits = (input) => {
        const exp = /^\d+$/
        return exp.test(input)
    }

    return (
        <div className="take_main">
            <div className="cred_entry_container_take">
            {cred_entry.map((item) => {
                return(
                    <input  type="text" value={item.value} onChange={(event) => {
                        credChange(event, item.key)
                    }}className="cred_entry_take" placeholder={item.placeholder}key={"cred_" + item.key}></input>
                )
            })}
            <button onClick={enter_clicked}className="find_button_take">Enter</button>
            </div>
            <div className="error_box_take">
                <p>{error}</p>
            </div>
        </div>
    );
}
 
export default Take;