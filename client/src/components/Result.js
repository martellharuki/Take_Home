import './Result.css'
import {useParams} from 'react-router-dom'
import {useEffect} from 'react'
const Result = () => {
    let {first} = useParams()
    let {second} = useParams()
    let {third} = useParams()
    let {place} = useParams()
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.reload()
        }, 5000)
    }, [])
    return ( 
        <div className="main_result">
            <p className="text_result">1st: {first}</p>
            <p className="text_result">2nd: {second}</p>
            <p className="text_result">3rd: {third}</p>
            <p className="personal_result">You placed: {place}</p>
        </div>
    );
}
 
export default Result;