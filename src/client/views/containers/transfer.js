import React, {Component} from 'react';
import * as XLSX from 'xlsx';
import axios from "axios/index";

export default class Transfer extends Component {

    constructor(props) {
        super(props);

        this.onFileInput = this.onFileInput.bind(this);
    }
    onFileInput(){
        var f = this.uploadInput1.files[0];
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);

            console.log("Data:",data);

            axios.post('/api/transferData',{"fileData" :data})
                .then((res) =>{
                    console.log("Response:",res);
                    if(res && res.data && res.data.status && res.data.status === "SUCCESS"){
                        alert(res.data.message);
                    }
                    else{
                        alert(res.data.message);
                    }
                });

        };
        reader.readAsBinaryString(f);
    }
    render() {

        return (
            <div style={{"marginTop":"30px"}}>
                <div style={{"marginLeft":"30px","align":'center'}}>
                    <input ref={(ref) => { this.uploadInput1 = ref;}} type="file"/>
                    <p>&nbsp;</p>
                    <button onClick={this.onFileInput}>Submit</button>
                </div>


            </div>
        )
    }
}