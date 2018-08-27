import React, { Component } from 'react';
import axios from 'axios';

export default class AllTests extends Component {
  constructor(props) {
    super(props);
    this.state = { username: null };
  }

  componentDidMount() {
    // var obj ={"username":"admin1@gmail.com","password":"raksan123","name":"Admin-1"};
    // axios.post('/api/createUser',obj)
    //   .then(res =>{
    //     console.log("RESP:",res);
    //
    //   });

      var obj ={"userId":"abc@gmail.com","password":"raksan123"};
    // axios.post('/api/login',obj)
    //   .then(res =>{
    //     console.log("RESP:",res);

    //   });
      // axios.post('/api/logout',{userId:'5b1b768de5d6421f47618654'})
      // .then(res=>{
      //   console.log("response",res);
      // })

      // axios.get('/api/save')
      // .then(res =>{
      //   console.log("RESP:",res);
      // });

      var newObj = {"userId":"5b1bb9e317eab725f698a029","newStatus":"ADDL_INFO","regRecId":"5b1adb28811475659a7b8d18"};
      // axios.get('/api/getRecord')
      // .then(res =>{
      //   console.log("RESP:",res);
      // });

      // axios.post('/api/updateStatus',newObj)
      // .then(res =>{
      //   console.log("RESP:",res);
      // });
      // axios.get("/api/MlcCountriesList")
      // .then((result) => {
      //   console.log("Resp:",result)
      // });
      // axios.get("/api/MlcCitieList")
      // .then((result) => {
      //   console.log("Resp:",result)
      // });
      // axios.get("/api/MlcCitizenshipList")
      // .then((result) => {
      //   console.log("Resp:",result)
      // });

        // api call to reset password
      // var obj ={"username":"admin1@gmail.com","password":"raksan12312"};
      // axios.post('/api/resetpassword',obj)
      //   .then(res =>{
      //     console.log("RESP:",res);
      
      //   });

  }

  render() {
    return (
      <div>
            <h1>Hello World</h1>

      </div>
    );
  }
}
