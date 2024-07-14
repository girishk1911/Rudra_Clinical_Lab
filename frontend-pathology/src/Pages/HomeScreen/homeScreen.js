import React, { useEffect, useState } from 'react';
import './homeScreen.css';
import LabPic from '../../assets/homeScreenImage.jpg';
import axios from 'axios';


const HomeScreen = () => {
  const [listOfTest, setListOfTest] = useState([]);
  const [activeIndexNav, setActiveIndexNav] = useState(0);
  const [selectedDetailedTest, setSelectedDetailedTest] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/labTest/');
        const data = res.data;
        console.log('Fetched lab tests:', data); // Log fetched data
        setListOfTest(data);
        setSelectedDetailedTest(data[0]);
      } catch (error) {
        console.error('Error fetching lab test data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickNavLink = (index) => {
    setActiveIndexNav(index);
    setSelectedDetailedTest(listOfTest[index]);
  };

  return (
    <div className="homeScreen">
      
      <div className="introHomeScreen">
        <div className="imgHomeScreenLogo">
          <div className="imgDiv">
            <img src={LabPic} className="imgclass" alt="Laboratory" />
          </div>
          <div className="introPart">
            <div className="titlemini">Enterprise Limited</div>
            <div className="titlemajor">Rudra Clinical Laboratory</div>
            <div className="description1">
              Welcome to Rudra Clinical Laboratory, your trusted partner in accurate diagnostic services. With state-of-the-art technology and expert pathologists, we deliver precise test results to support your healthcare journey. Our comprehensive tests provide timely and accurate information, empowering effective treatment plans. We prioritize your health with exceptional, compassionate service. Trust Rudra Clinical Laboratory for all your healthcare needs.
            </div>
            <div className="description2">
              At Rudra Clinical Laboratory, we prioritize accessibility and convenience in healthcare. We offer easy appointment scheduling, home sample collection, and quick turnaround times for results. Our friendly staff ensures a smooth, stress-free experience, adhering to the highest standards of quality and safety. Whether it's routine blood work or specialized testing, trust Rudra Clinical Laboratory for accurate diagnostics and informed health decisions.
            </div>
          </div>
        </div>
      </div>

      <div className="testHomeScreen">
        <div className="leftPartTest">
          <div className="totalTest">{listOfTest.length} Tests Available</div>
          <div className="testNameDiv">
            {listOfTest?.map((item, index) => (
              <div
                key={index}
                onClick={() => handleClickNavLink(index)}
                className={`testNameTitle ${activeIndexNav === index ? 'activeNavLink' : ''}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="rightPartTest">
          <div className="topRightPart">{selectedDetailedTest?.name}</div>
          <div className="bottomRightPart">
            <div className="topBottomRightPart">{selectedDetailedTest?.description}</div>
            <div className="bottomBottomRightPart">
              <div className="bBRightPartLeftSide">
                <div className="detailsBlock">
                  Unit: <span className="spanColorChange">{selectedDetailedTest?.unit}</span>
                </div>
                <div className="detailsBlock">
                  Biological Reference Range: <span className="spanColorChange">{selectedDetailedTest?.biologicalReferenceRange}</span>
                </div>
              </div>
              <div className="bBRightPartRightSide">
                <img src={selectedDetailedTest?.imageLink} className="bBImageClass" alt={selectedDetailedTest?.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
