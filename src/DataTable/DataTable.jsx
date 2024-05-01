import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import './DataTable.css';
import { Link, useParams } from 'react-router-dom';
import { fetchDataWithToken } from '../Code/fetchWithToken';

function DataTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValues, setFilterValues] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    fonction: '',
    departement: ''
  });
  const [fonctions, setFonctions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const employesApiUrl = 'http://localhost:9000/Employe/getEmployesInfoBase';
      const fonctionsApiUrl = 'http://localhost:9000/Fonction/getAllFonctions';
      const departementsApiUrl = 'http://localhost:9000/Departement/getAllDepartements';

      const fetchedEmployesData = await fetchDataWithToken(employesApiUrl, token);
      const fetchedFonctions = await fetchDataWithToken(fonctionsApiUrl, token);
      const fetchedDepartements = await fetchDataWithToken(departementsApiUrl, token);

      setData(fetchedEmployesData || []);
      setFilteredData(fetchedEmployesData || []);
      setFonctions(fetchedFonctions || []);
      setDepartements(fetchedDepartements || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);




  if (isLoading) {
    return (
    <div className="loading">
    <div className="spinner"></div>
  </div>)
}



  const handleFilterChange = (event, columnName) => {
    const { value } = event.target;
    setFilterValues({ ...filterValues, [columnName]: value });

    const filtered = data.filter((row) => {
      if (columnName === 'fonction') {
        return row.fonction.nom.toLowerCase().includes(value.toLowerCase());
      }
      if (columnName === 'departement') {
        return row.departement.abreviation.toLowerCase().includes(value.toLowerCase());
      }
      return row[columnName].toLowerCase().includes(value.toLowerCase());
    });

    setFilteredData(filtered);
  };



  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='filter_container'>
        <div className="filterButton">
        <div className="pagination">
        <button onClick={() => paginate(currentPage - 1) } disabled={currentPage === 1} className="pagination_btn">
          Previous
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= filteredData.length} className="pagination_btn">
          Next
        </button>
      </div>
        </div>
        <div className="filter">
          <input type="text" placeholder="Rechercher par matricule..." value={filterValues.matricule} onChange={(e) => handleFilterChange(e, 'matricule')} />
          <input type="text" placeholder="Rechercher par nom..." value={filterValues.nom} onChange={(e) => handleFilterChange(e, 'nom')} />
          <input type="text" placeholder="Rechercher par prénom..." value={filterValues.prenom} onChange={(e) => handleFilterChange(e, 'prenom')} />
          <select value={filterValues.fonction} onChange={(e) => handleFilterChange(e, 'fonction')}>
            <option value="">Select fonction...</option>
            {fonctions.map((fonction) => (
              <option key={fonction.id} value={fonction.nom}>
                {fonction.nom}
              </option>
            ))}
          </select>
          <select value={filterValues.departement} onChange={(e) => handleFilterChange(e, 'departement')}>
            <option value="">Select departement...</option>
            {departements.map((departement) => (
              <option key={departement.id} value={departement.abreviation}>
                {departement.abreviation}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TableContainer component={Paper} id='Table'>
        <Table>
          <TableHead className='table_head'>
            <TableRow>
              <TableCell id='table_head_text'>Matricule</TableCell>
              <TableCell id='table_head_text'>Nom</TableCell>
              <TableCell id='table_head_text'>Prenom</TableCell>
              <TableCell id='table_head_text'>Fonction</TableCell>
              <TableCell id='table_head_text'>Département</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Aucune donnée correspondante trouvée</TableCell>
              </TableRow>
            ) : (
              currentItems.map((row) => (
                <TableRow key={row.id} className='table_row'>
                  <TableCell>{row.matricule}</TableCell>
                  <TableCell>{row.nom}</TableCell>
                  <TableCell>{row.prenom}</TableCell>
                  <TableCell>{row.fonction.nom}</TableCell>
                  <TableCell>{row.departement.abreviation}</TableCell>
                  <TableCell>
                    <Link to={`/profile/${row.id}`}>
                      <FontAwesomeIcon icon={faEye} id='SeeMore' />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}

    </div>
  );
}

export default DataTable;
