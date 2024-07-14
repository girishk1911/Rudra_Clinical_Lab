import React, { useState, useEffect, useRef } from 'react'
import './navbar.css'
import imglogo from '../../assets/pathology_logo.png'
import Modal from '../Modal/modal';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [clickAddTest, setClickAddTest] = useState(false);
  const [input, setInput] = useState({
    name: "",
    information: "",
    imageLink: "",
    description: "",
    unit: "",
    biologicalReferenceRange: ""
  });

  const ref = useRef();

  const handleSubmit = async (event) => {
    try {
        console.log('input',input);
        const response = await axios.post('http://localhost:5000/labTest', input);
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data');
    }
        
};

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (clickAddTest && ref.current && !ref.current.contains(e.target)) {
        setClickAddTest(false);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    }
  }, [clickAddTest]);

  const handleInput = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  }

  console.log(input);

  return (
    <div className="navbar">
      <Link to={'/'} className="leftSideNavbar">
        <img src={imglogo} className='imgLogoNavbar' alt='logo' />
      </Link>
      <div className="rightSideNavbar">
        <div className="linkstRightNavbar" onClick={() => { setOpenCreate(prev => !prev) }}>
          Create New
        </div>

        <Link to={'/status'} className="linkstRightNavbar">
          Report
        </Link>

        <div className="linkstRightNavbar">
          <div className="navLinkAddTest" onClick={() => { setClickAddTest(true) }}>
            Add Test
          </div>
          <form onSubmit={handleSubmit}>

          {clickAddTest && (
            <div className="addTestModal" ref={ref}>
              <div className="inputAddTestModal">
                <div className="inputAddTestLabel">Test Name</div>
                <input type='text' name='name' value={input.name} onChange={handleInput} className='inputAddTestbox' />
              </div>
              
              <div className="inputAddTestModal">
                <div className="inputAddTestLabel">Test Description</div>
                <input type='text' name='description' value={input.description} onChange={handleInput} className='inputAddTestbox' />
              </div>

              <div className="inputAddTestModal">
                <div className="inputAddTestLabel">Image Link</div>
                <input type='text' name='imageLink' value={input.imgLink} onChange={handleInput} className='inputAddTestbox' />
              </div>
              
              <div className="inputAddTestModal">
                <div className="inputAddTestLabel">Unit</div>
                <input type='text' name='unit' value={input.unit} onChange={handleInput} className='inputAddTestbox' />
              </div>
              <div className="inputAddTestModal">
                <div className="inputAddTestLabel">Biological Reference Range</div>
                <input type='text' name='biologicalReferenceRange' value={input.biologicalReferenceRange} onChange={handleInput} className='inputAddTestbox' />
              </div>
              <button  className="submitModal" type="submit">Create</button>
            </div>
          )}
          </form>
        </div>
      </div>
      {openCreate && <Modal setOpenCreate={setOpenCreate} />}
    </div>
  );
}

export default Navbar;
