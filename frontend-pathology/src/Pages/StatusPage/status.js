import React, { useState, useEffect } from 'react';
import './status.css';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import Modal from '../../CommonComponents/Modal/modal';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Status = () => {
    const [activeBar, setActiveBar] = useState("Pending");
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [clickedUpdate, setClickedUpdate] = useState(false);
    const [clickedPatient, setClickedPatient] = useState(null);
    const [fetch, setFetch] = useState(true);

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/patients-data');
                const data = res.data;
                setRecords(data);
            } catch (err) {
                console.error('Error fetching lab test data:', err);
            }
        };

        if (fetch) {
            fetchData();
        }
    }, [fetch]);

    useEffect(() => {
        const filtered = records.filter(record => record.status === activeBar);
        setData(filtered);
    }, [activeBar, records]);

    const updateIconClick = (item) => {
        setClickedUpdate(true);
        setClickedPatient(item);
    };

    const deletePatient = (id) => {
        setFetch(false);
        axios.delete(`http://localhost:5000/patients/${id}`)
            .then(res => {
                console.log('Patient deleted');
                setFetch(true);
            })
            .catch(err => {
                console.error('Error deleting patient', err);
                setFetch(true);
            });
    }

    return (
        <div className="statusPage">
            <div className="statusPageWorkDiv">
                <div className="statusBar">
                    <div className={`statusTitle ${activeBar === 'Pending' ? "activeBarStatus" : ''}`} onClick={() => setActiveBar("Pending")}>Pending</div>
                    <div className={`statusTitle ${activeBar === 'Completed' ? "activeBarStatus" : ''}`} onClick={() => setActiveBar("Completed")}>Completed</div>
                </div>

                <div className="statusList">
                    {
                        data && data.map((item, index) => {
                            return (
                                <div key={index} className="statusRowList">
                                    <div className="statusName">{item.name}</div>
                                    <div className="statusDrDetails">
                                        <div className="statusDrName">{item.examinedBy}</div>
                                        <div className="statusDrName">{item.examinedDate}</div>
                                    </div>
                                    <div className="statusbtn">
                                        {activeBar === "Pending" && <div className="icons" onClick={() => updateIconClick(item)}><UpdateIcon /></div>}
                                        {activeBar === "Pending" && <div className="icons" onClick={() => deletePatient(item.id)}><DeleteIcon /></div>}
                                        {activeBar === "Pending" && <Link to={`/report/${item.id}`} className="icons"><ArticleIcon /></Link>}
                                        {activeBar === "Completed" && <Link to={`/prescription/${item.id}`} className="icons"><ArticleIcon /></Link>}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            {clickedUpdate && (<Modal item={clickedPatient} setOpenCreate={setClickedUpdate} />)}
        </div>
    );
}

export default Status;
