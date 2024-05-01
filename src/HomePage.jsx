import Navbar from './Navbar/NavBar'
import DataTable from './DataTable/DataTable'
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchDataWithoutToken } from './Code/fetchWithoutToken';
import {checkLogin} from './Code/noLogin';


function HomePage (props) {

  const [user, setUser] = useState([]);
  const token = localStorage.getItem('token') ;
  const navigate = useNavigate();

  checkLogin(token);

  useEffect(() => {
    try {
    const fetchData = async () => {
      const apiUrl = 'http://localhost:9000/Utilisateur/auth/GetUser?token='+token; // Replace with your actual API URL
      const fetchedData = await fetchDataWithoutToken(apiUrl);
      setUser(fetchedData || []);
      
       // Set data or empty array if no data
    };

    fetchData();

    

  } catch (error) {
    navigate('/login');
  }
  }, []);

  const handleGetUserInput = (data) => {
    props.onSetUserData(data); // Call the prop to update context data
  };


  handleGetUserInput(user);

  return (
    <div>
      <Navbar user={user} />
        <div>
          <DataTable />
        </div>
    </div>
  );
}

export default HomePage