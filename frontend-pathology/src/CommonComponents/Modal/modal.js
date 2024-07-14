import React,{useEffect,useState} from 'react'
import './modal.css';
import axios from 'axios';
import { alertClasses } from '@mui/material';

const Modal = ({setOpenCreate,item}) => {
    const [input,setInput] = useState({"name":"","age":"","address":"","mobile":"","examinedBy":"","examinedDate":"","selectedTest":"","reportDate":"", "result":"", 'status':'Pending'});
    const [listOfTest, setListOfTest] = useState([]);

    const handleInputs=(event)=>{
        setInput({...input,[event.target.name]:event.target.value})
    }

    const handleSubmit = async (event) => {
        try {
            console.log('input',input);
            const response = await axios.post('http://localhost:5000/patients', input);
            alertClasses('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    const clearForm = (e) =>{
        e.preventDefault();
        setInput({"name":"","age":"","address":"","mobile":"","examinedBy":"","examinedDate":"","selectedTest":"","reportDate":"", "result":"", 'status':'Pending'})
    }

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const data = await axios.get('http://localhost:5000/labTest/');
                setListOfTest(data.data);
               
            } catch (error) {
                console.error('Error fetching lab test data:', error);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if(item){
            setInput(item);
        }
    }, []);

    return (
        <div className="modal">
            <div className="modalCard">
                <div className="modalTitleBox">
                    <div className="modalTitle">{item?"Update Patient":"Create New"}</div>
                    <div className="xButton" onClick={() => { setOpenCreate(prev => !prev) }} >X</div>

                </div>
                <form>
                <div className="modalBody">
                    <div className="inputRowModal">
                        <div className="inputBox">
                            <div className="inputLabel">Name</div>
                            <input type='text' name='name' value={input.name} onChange={(e)=>{handleInputs(e)}} className='inputModal' placeholder='Enter a Name' />
                        </div>

                        <div className="inputBox">
                            <div className="inputLabel">Age</div>
                            <input type='text' name='age' value={input.age} onChange={(e)=>{handleInputs(e)}} className='inputModal' placeholder='Enter the age' />
                        </div>
                    </div>

                    <div className="inputRowModal">
                        <div className="inputBox">
                            <div className="inputLabel">Address</div>
                            <input type='text' name='address' value={input.address} onChange={(e)=>{handleInputs(e)}} className='inputModal' placeholder='Enter address' />
                        </div>

                        <div className="inputBox">
                            <div className="inputLabel">Mobile</div>
                            <input type='text' name='mobile' value={input.mobile} onChange={(e)=>{handleInputs(e)}} className='inputModal' placeholder='Enter Mobile No' />
                        </div>

                    </div>

                    <div className="inputRowModal">
                        <div className="inputBox">
                            <div className="inputLabel">Examined By</div>
                            <input type='text' name='examinedBy' value={input.examinedBy} onChange={(e)=>{handleInputs(e)}} className='inputModal' placeholder='Examined By' />
                        </div>

                        <div className="inputBox">
                            <div className="inputLabel">Examined Date</div>
                            <input type='date' name='examinedDate' value={input.examinedDate} onChange={(e)=>{handleInputs(e)}} className='inputModal' />
                        </div>

                    </div>

                    <div className="inputRowModal">
                        <div className="inputBox">
                            <div className="inputLabel">Select Test</div>
                            <select className='inputModal' name='selectedTest' onChange={(e)=>{handleInputs(e)}} >
                            <option value="select">select</option>
                            {listOfTest.map((record, index) => (
                              <option value={record.name}>{record.name}</option>
                             ))} 

                            </select>
                        </div>

                        <div className="inputBox">
                            <div className="inputLabel">Report Date</div>
                            <input type='date' name='reportDate' value={input.reportDate} onChange={(e)=>{handleInputs(e)}} className='inputModal' />
                        </div>
                    </div>

                    <div className="buttonDivModal">
                        <button  className="submitModal" onClick={handleSubmit}>Submit</button>
                        <button  className="submitModal" onClick={clearForm}>Clear</button>
                        
                    </div>

                </div>
                </form>
            </div>
        </div>


    )
}

export default Modal
