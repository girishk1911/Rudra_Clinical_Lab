import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import imglogo from '../../assets/pathology_logo.png';
import './prescription.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Prescription = () => {
    const { id } = useParams();
    const [records, setRecords] = useState({});
    const [testDetails, setTestDetails] = useState({});

    useEffect(() => {
        // Fetch patient data from the API
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/patientLabReport/${id}`);
                setRecords(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching patient test lab report data:', error);
            }
        };

        fetchPatientData();
    }, [id]);

    useEffect(() => {
        // Fetch test details after records have been set
        const fetchTestDetails = async () => {
            if (records.selectedTest) {
                try {
                    const res = await axios.get('http://localhost:5000/labTest');
                    const filtered = res.data.filter(test => test.name === records.selectedTest);
                    console.log(filtered);
                    setTestDetails(filtered[0] || {}); // assuming you want the first matched result
                } catch (error) {
                    console.error('Error fetching test details:', error);
                }
            }
        };

        fetchTestDetails();
    }, [records]);

    const downLoadPDF = () => {
        const input = document.getElementById("pdfDownload");

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${records.name}.pdf`);
        });
    };

    return (
        <div className="prescription">
            
            <div className="presdownload" id="pdfDownload">
                <div className="header-logos">
                    <img src={imglogo} className="presc-logo" alt="Logo" />
                    <div className="pathologyDesc">
                        <div className="namePathalogy">Rudra Clinical Laboratory</div>
                        <div className="addressDetails">Shop no 1 Sau.Sushilabai narayanrao mate complex, fatepurwadi mothi umri Akola.</div>
                        <div className="mobNO">+91-9822678729</div>
                    </div>
                </div>
                <div className="patient-info">
                    <div className="patient-info-row">
                        <div className="info-detail">
                            <div className="patient-name-attr">Name :</div>
                            <div className="patient-name-value">{records.name}</div>
                        </div>
                        <div className="info-detail-age">
                            <div className="patient-name-attr">Age :</div>
                            <div className="patient-name-value">{records.age}</div>
                        </div>
                        <div className="info-detail">
                            <div className="patient-name-attr">Address :</div>
                            <div className="patient-name-value">{records.address}</div>
                        </div>
                    </div>
                    <div className="patient-info-row">
                        <div className="info-detail">
                            <div className="patient-name-attr">Examined By :</div>
                            <div className="patient-name-value">{records.examinedBy}</div>
                        </div>
                        <div className="info-detail-age">
                            <div className="patient-name-attr">MobNo :</div>
                            <div className="patient-name-value">{records.mobile}</div>
                        </div>
                        <div className="info-detail">
                            <div className="patient-name-attr">Examined Date :</div>
                            <div className="patient-name-value">{records.examinedDate}</div>
                        </div>
                    </div>
                </div>
                <div className="result-section">
                    <div className="particular-test">
                        <table className="table">
                            <thead className="thead">
                                <tr>
                                    <th>Test</th>
                                    <th>Result</th>
                                    <th>Unit</th>
                                    <th>Biological Reference Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{records.selectedTest}</td>
                                    <td>{records.result}</td>
                                    <td>{testDetails.unit}</td>
                                    <td>{testDetails.biologicalReferenceRange}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="footer-prescription">
                            <div className="examineedBy">
                                <div className="signature">
                                    <div>Time : 9am to 9pm</div>
                                </div>
                                <div className="signature">
                                    <div>Report Date</div>
                                    <div>{records.reportDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pdf-down-btn" onClick={downLoadPDF}>
                Download
            </div>
        </div>
    );
};

export default Prescription;