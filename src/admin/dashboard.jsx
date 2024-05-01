import React, { useEffect, useState, useContext } from 'react';
import { fetchDataWithToken } from '../Code/fetchWithToken';
import { fetchDataWithoutToken } from '../Code/fetchWithoutToken';
import { Chart } from 'react-google-charts';
import { ProfileContext } from '../userContext';
import Navbar from '../Navbar/NavBar';
import {checkLogin} from '../Code/noLogin';
import "./Style/dashboard.css";

function Dashboard() {
    const token = localStorage.getItem('token');
    const [employeesData, setEmployeesData] = useState([]);
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    checkLogin(token);
    let { userData } = useContext(ProfileContext);


    if (userData == null) {
        useEffect(() => {
            try {
                const fetchData = async () => {
                    const apiUrl = 'http://localhost:9000/Utilisateur/auth/GetUser?token=' + token;
                    const fetchedData = await fetchDataWithoutToken(apiUrl);
                    setUser(fetchedData || []);
                };

                fetchData();
            } catch (error) {
                navigate('/login');
            }
        }, []);

        userData = user;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'http://localhost:9000/Employe/admin/getAll';
                const responseData = await fetchDataWithToken(apiUrl, token);
                setEmployeesData(responseData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);


    if (isLoading) {
        return (
        <div className="loading">
        <div className="spinner"></div>
      </div>)
    }

    console.log(employeesData);

    const functionCounts = {};
    const departmentCounts = {};
    const projectEmployeeCounts = {};
    const projectNames = {};
    const competenceCounts = {};
    let totalFormationsCount = 0;
    let totalAgeInYears = 0;
    let employeeCount = 0;


    employeesData.forEach(employee => {
        const fonction = employee.fonction.nom;
        const department = employee.departement.abreviation;
        totalFormationsCount += employee.formations.length;

        employee.employeProjet.forEach(project => {
            const projectId = project.projet.id;
            const projectName = project.projet.nom;
            projectEmployeeCounts[projectId] = (projectEmployeeCounts[projectId] || 0) + 1;
            projectNames[projectId] = projectName;
          });


          employee.competenceInformatique.forEach(competence => {
            const competenceName = competence.nom;
            competenceCounts[competenceName] = (competenceCounts[competenceName] || 0) + 1;
          });

        functionCounts[fonction] = (functionCounts[fonction] || 0) + 1;
        departmentCounts[department] = (departmentCounts[department] || 0) + 1;




        const birthDateStr = employee.dateDeNaissance; // Assuming "dateDeNaissance" holds the date string

        // Extract only the date part (YYYY-MM-DD)
        const birthDateParts = birthDateStr.split('T')[0];
    
        // Parse the date string into a Date object (ignores time)
        const birthDate = new Date(birthDateParts);
    
        // Calculate today's date
        const today = new Date();
    
        // Calculate age in days (ignores time difference)
        const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    
        // Convert days to years and add to total age
        totalAgeInYears += ageInDays / 365.25; // Assuming an average year length
        employeeCount++;

        
    });

    // Prepare data for Google Charts
    const functionData = Object.entries(functionCounts).map(([fonction, count]) => [fonction, count]);
    const departmentData = Object.entries(departmentCounts).map(([department, count]) => [department, count]);
    const projectEmployeeData = Object.entries(projectEmployeeCounts).map(([projectId, count]) => [
        projectNames[projectId] || `Project ${projectId}`, // Handle missing project names
        count,
      ]);

    const competenceData = Object.entries(competenceCounts).map(([competenceName, count]) => [
        competenceName,
        count,
      ]);

      const meanAgeInYears = totalAgeInYears / employeeCount;



    return (
        <div>
            <Navbar user={userData} />
            <div className="container">
            <div className="item">

            <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Department', 'Number of Employees'],
                        ...departmentData,
                    ]}
                    options={{
                        title: 'Nombre d\'employés par département',
                    }}
                />   

            </div>
            <div className="item">
                <h3>Nombre totale d'émployes</h3>
                <h1>{employeesData.length}</h1>
            </div>
            <div className="item">

            <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="ColumnChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Function', 'Number of Employees'],
                        ...functionData,
                    ]}
                    options={{
                        title: 'Nombre d\'employés par fonction',
                        legend: { position: 'none' },
                    }}
                />

            </div>
            </div>

            <div className="container_2">
            <div className="item">
                        <Chart
                width={'500px'}
                height={'300px'}
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Project Name', 'Number of Employees'],
                    ...projectEmployeeData,
                ]}
                options={{
                    title: 'Nombre d\'employés par projet',
                    legend: { position: 'none' },
                    hAxis: {
                    title: 'Projets',
                    },
                }}
                />
            </div>
            <div className="item">

            <Chart
            width={'500px'}
            height={'300px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[
                ['IT Competence', 'Number of Employees'],
                ...competenceData,
            ]}
            options={{
                title: 'Nombre d\'employés par compétence informatique',
                legend: { position: 'none' },
            }}
            />

            </div>
            <div className="item">
                <h3>Nombre total de formations</h3>
                <h1>{totalFormationsCount}</h1>
            </div>
            <div className="item">
                <h3>Age moyen des employés</h3>
                <h1>{meanAgeInYears.toFixed(1)} ans</h1>
            </div>
            </div>
        </div>
    );
}

export default Dashboard;
