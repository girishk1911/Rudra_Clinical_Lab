import React, { useEffect, useState } from 'react';
import './report.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Report = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inputField, setInputField] = useState({ "name": "", "unit": "", "result": "", "biologicalReferenceRange": "" });
    const [records, setRecords] = useState({});
    const [labRecords, setLabRecords] = useState([]);

    useEffect(() => {
        // Fetch patient data
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/patients/${id}`);
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching patient test lab report data:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        // Fetch lab test data
        const fetchLabRecords = async () => {
            try {
                const response = await axios.get('http://localhost:5000/labTest/');
                setLabRecords(response.data);
            } catch (error) {
                console.error('Error fetching lab test data:', error);
            }
        };

        fetchLabRecords();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputField(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTestChange = (event) => {
        const selectedTest = labRecords.find(row => row.name === event.target.value);
        if (selectedTest) {
            setInputField({
                name: selectedTest.name,
                unit: selectedTest.unit,
                result: "",
                biologicalReferenceRange: selectedTest.biologicalReferenceRange
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/patient-report/${id}`, inputField);
            if (response.status === 200) {
                navigate(`/prescription/${id}`);
            }
        } catch (error) {
            console.error('Error updating patient report:', error);
        }
    };

    return (
        <div className="reportPage">
            <div className="reportDiv">
                <div className="reportInfos">
                    <div className="reportInfo">Name: {records.name}</div>
                    <div className="reportInfo">Examined By: {records.examinedBy}</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="reportInputBlock">
                        <div className="inputRow">
                            <div className="inputRowGroup">
                                <div className="inputTestName">Test name</div>
                                <select className='inputModal' name='name' onChange={handleTestChange} value={inputField.name}>
                                    <option value='select'>select</option>
                                    {labRecords.map((record, index) => (
                                        <option key={index} value={record.name}>{record.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="inputRowGroup">
                                <div className="inputTestName">Unit</div>
                                <input type='text' value={inputField.unit} name='unit' onChange={handleInputChange} className='inputFieldTests' />
                            </div>
                            <div className="inputRowGroup">
                                <div className="inputTestName">Result</div>
                                <input type='text' value={inputField.result} name='result' onChange={handleInputChange} className='inputFieldTests' />
                            </div>
                            <div className="inputRowGroup">
                                <div className="inputTestName">Biological Reference Range</div>
                                <input type='text' value={inputField.biologicalReferenceRange} name='biologicalReferenceRange' onChange={handleInputChange} className='inputFieldTests' />
                            </div>
                        </div>
                        <div className="btn-grp-add-rem">
                            <button type="submit" className="add-btn-row">Report</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Report;
