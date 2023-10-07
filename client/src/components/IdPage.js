import './IdPage.css'
import {useParams} from 'react-router-dom'

const IdPage = () => {
    const {id} = useParams()
    return (
        <div className="mainid_page">
            <div className="text_container_pageid">
            <p>Your Quiz was Successfully Submitted!</p>
            <div className="second_line_pageid">
            <p>Your Quiz ID is: </p>
            <p className='number'> {id}</p>
            </div>
            </div>
        </div>
    );
}
 
export default IdPage;