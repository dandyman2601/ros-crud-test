import './App.css';
import { useState } from "react";
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {Form, Button, Modal, InputGroup, Table} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

function App() {


  const[name, setName] = useState("");
  const[age, setAge] = useState(0);
  const[country, setCountry] = useState("");
  const[position, setPosition] = useState("");
  const[wage, setWage] = useState(0);
  const [newWage, setNewWage] = useState(0);
  const [employeeList, setEmployeeList] = useState([])
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Modal Edit
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  //save id index



  //bootstrap table next
  const columns = [{
    dataField: 'name',
    text: 'Name'
  }, {
    dataField: 'age',
    text: 'Age'
  }, {
    dataField: 'country',
    text: 'Country'
  },{
    dataField: 'position',
    text: 'Position'
  },{
    dataField: 'wage',
    text: 'Wage'
  },
];



  // const onChange = event => newWage(event.target.value);

  const rowEvents = {
    onClick: (e, row) => {
      console.log(row)
    }
  }

  const addEmployee = () =>{    
    Axios.post('http://10.91.100.252:3001/create', {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage
    }).then(()=>{
      setEmployeeList([...employeeList, {
        name: name,
        age: age,
        country: country,
        position: position,
        wage: wage
      }])
    });

  }

  const getEmployees = () => {
    Axios.get('http://10.91.100.252:3001/employees').then((response) => {
      setEmployeeList(response.data)
    });
     
   
  };

  const updateEmployeeWage = (idemployees) => {
    Axios.put('http://10.91.100.252:3001/update', {
      wage: newWage,
      idemployees: idemployees
    }).then((response)=>{
      setEmployeeList(employeeList.map((val)=>{
        return val.idemployees == idemployees ? {idemployees: val.idemployees, name: val.name, country: val.country, age: val.age, position: val.position, wage: newWage} : val
      }))
      
      
      console.log('New Wage: ' + newWage + ' IDEmployee: ' + idemployees + '  Name: '+ name);
    })
    // console.log(employeeList.[6].name +' --call from updateFn---> '+ employeeList.map((val, index)=>{
    //   console.log(val.wage);
    // }))

    employeeList.map((val, index)=>{
      console.log(val.wage + ' ||| ' + val.idemployees);
    })
  }

  const deleteEmployee = (idemployees) =>{
    Axios.delete(`http://10.91.100.252:3001/delete/${idemployees}`).then((response)=>{
      setEmployeeList(employeeList.filter((val)=>{
        return val.idemployees != idemployees
      }))
    })
  }

  return (
    <div className="App">
      <h5 class="display-4">Register Of Sites</h5>
      <div className="information">
        <Button variant="primary" onClick={handleShow}>Create New Record</Button>
        <Button variant='info' onClick={getEmployees}>Show Employees</Button>

        <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
          <Modal.Header closeButton>
            <Modal.Title>Create New Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <label>Name:</label>
              <input type="text" onChange={(Event)=>setName(Event.target.value)}/>
              <label>Age:</label>
              <input type="number" onChange={(Event)=>setAge(Event.target.value)}/>
              <label>Country:</label>
              <input type="text" onChange={(Event)=>setCountry(Event.target.value)}/>
              <label>Position:</label>
              <input type="text" onChange={(Event)=>setPosition(Event.target.value)}/>
              <label>Wage(Year):</label>
              <input type="number" onChange={(Event)=>setWage(Event.target.value)}/>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={addEmployee}>Add Employee</Button>
          </Modal.Footer> 
        </Modal>
      </div>

       <Modal show={show1} onHide={handleClose1} dialogClassName="modal-90w" >
          <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
          </Modal.Header>
          <Modal.Body >
              <label>Name:</label>
              <input type="text" onChange={(Event)=>setName(Event.target.value)}/>
              <label>Age:</label>
              <input type="number" onChange={(Event)=>setAge(Event.target.value)}/>
              <label>Country:</label>
              <input type="text" onChange={(Event)=>setCountry(Event.target.value)}/>
              <label>Position:</label>
              <input type="text" onChange={(Event)=>setPosition(Event.target.value)}/>
              <label>Wage(Year):</label>
              <input type="number" onChange={(Event)=>setNewWage(Event.target.value)}/>
          </Modal.Body>
          <Modal.Footer>          
            <Button variant='primary' onClick={()=>{updateEmployeeWage()}} >Update</Button>
          </Modal.Footer> 
        </Modal>

      <Table striped bordered hover>
         <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Country</th>
              <th>Position</th>
              <th>Wage</th>
              <th></th>
            </tr>
          </thead>          
        {employeeList.map((val, key)=>{
          console.log(employeeList.[key].name + ' | ' + employeeList.[key].wage + ' | ' + employeeList.[key].idemployees)
          return <>
            <tbody>
              <tr>
                <td>{val.name}</td>
                <td>{val.age}</td>
                <td>{val.country}</td>
                <td>{val.position}</td>
                <td>{val.wage}</td>
                <td>
                  <input type="number" onChange={(Event)=>setNewWage(Event.target.value)}/>
                  <Button variant='primary' onClick={()=>{updateEmployeeWage(val.idemployees)}}>Update</Button>
                  <Button variant='warning' onClick={handleShow1}>EDIT</Button>
                  <Button variant='danger' onClick={()=>{deleteEmployee(val.idemployees)}}>Delete</Button>
                </td>                 
              </tr>
            </tbody> 
          </>
        })}
        
       </Table>    
       <BootstrapTable keyField='id' data={ employeeList } columns={ columns } cellEdit={cellEditFactory({mode: 'click'})} striped hover condensed rowEvents={rowEvents} /> 
    </div>
  );
}

export default App;
