// App.js
import React, { useEffect, useState } from 'react';
import DataTable from './components/DataTable';
import Chart from './components/Chart.js';
import "./App.css"
import Header from './components/Header.js';
function App() {

  const [selectedRows, setSelectedRows] = useState([]);

  const [data, setData] = useState([]);


  useEffect(() => {

    //api call will be made here to fetch data i would prefer using axios 
    const getData = async () => {
      // using faker to generate 100 dummy data for now...

      fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(json => setData(json.products))
    }

    getData()
  },[])


  return (
    <div className="App">

     <Header/>
      <div style={{margin:"10px",display:'flex'}}>

      <DataTable selectedRows={selectedRows} data={data} setSelectedRows={setSelectedRows} />
      <Chart selectedRows={selectedRows} data={data} />
      </div>
    </div>
  );
}

export default App;
