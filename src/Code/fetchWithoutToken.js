async function fetchDataWithoutToken(apiUrl) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Optional, depending on the API's requirements
      },
    };
  
    try {
      const response = await fetch(apiUrl, options);
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Or throw an error for further handling
    }
  }


  export { fetchDataWithoutToken }