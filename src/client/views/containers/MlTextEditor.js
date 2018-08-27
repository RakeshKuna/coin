import React, {Component} from 'react';
import CKEditor from "react-ckeditor-component";

export default class TextEditor extends Component {

    constructor(props) {
        super(props);
        this.updateContent = this.updateContent.bind(this);
    }

    updateContent(evt) {
        var newbodyContent = evt.editor.getData();
        this.props.contentHandler(newbodyContent);
        //console.log("onChange fired with event info: ",evt, "and data: ",evt.editor.getData());
    }

    render() {
       // console.log("Child props are:", this.props);
        return (
            <div>
                <CKEditor activeClass={this.props.activeClass} content={this.props.content} events = {{ "change" : this.updateContent}} key ={this.props.content}/>
            </div>
        )
    }
}
