import { fetchDataWithoutToken } from './fetchWithoutToken';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function checkLogin(token) {
    const [tokenIsValid, setTokenIsValid] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        try {
          const fetchData = async () => {
            const apiUrl = 'http://localhost:9000/Utilisateur/auth/validate-token?token='+token; // Replace with your actual API URL
            const fetchedData = await fetchDataWithoutToken(apiUrl)
            setTokenIsValid(fetchedData); // Set fetched data or whatever response you get from the API
          };
    
          fetchData();
        } catch (error) {
          navigate('/login');
        }
      }, []);
    
      
    
    
    
    
      if((tokenIsValid == 1) || (token == null)) {
        navigate('/login');
      }
    

}

export {checkLogin}