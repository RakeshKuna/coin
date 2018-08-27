import moment from "moment/moment";

const validate = function validate(values) {
    //console.log("values...", values);
    const errors = {};
    let formIsValid = true;
    if (!values.firstName || values.firstName.trim() === '') {
        errors["firstName"] = 'Please enter your first name';
        formIsValid = false;
    }
    if (!values.lastName || values.lastName.trim() === '') {
        errors["lastName"] = 'Please enter your last name';
        formIsValid = false;
    }
    if (!values.gender || values.gender == 'Select Gender') {
        errors["gender"] = 'Please select your gender'
        formIsValid = false;
    }
    if (!values.countryId || values.countryId == 'Select Country') {
        errors["countryId"] = 'Please select your country of residence'
        formIsValid = false;
    }
    if (!values.cityId || values.cityId == 'Select City') {
        errors["cityId"] = 'Please select your city of residence'
        formIsValid = false;
    }
    if (!values.citizenshipId || values.citizenshipId == 'Select Citizenship') {
        errors["citizenshipId"] = 'Please select your country of citizenship'
        formIsValid = false;
    }
    // if (!values.typeofKYCDoc || values.typeofKYCDoc == '') {
    // //     errors["typeofKYCDoc"] = 'Please select your KYC document type'
    // //     formIsValid = false;
    // // }

    if (!values.emailId || values.emailId.trim() === '') {
        errors["emailId"] = 'Please enter your email id';
        formIsValid = false;
    }
    else if (values.emailId !== "undefined") {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(values["emailId"])) {
            formIsValid = false;
            errors["emailId"] = "*Please enter valid email id";
        }

    }

    if (!values.contactNumber || values.contactNumber.trim() === '') {
        errors["contactNumber"] = 'Please enter your Contact Number';
        formIsValid = false;
    }
    else if (values["contactNumber"] !== "undefined") {
        if (!values["contactNumber"].match(/^[0-9\b]+$/)) {
            formIsValid = false;
            errors["contactNumber"] = "*Please enter valid Contact Number";
        }
    }
    if (!values.address_1 || values.address_1.trim() === '') {
        errors["address_1"] = 'Please enter your address';
        formIsValid = false;
    }

    if (!values.address_2 || values.address_2.trim() === '') {
        errors["address_2"] = 'Please enter the PUBLIC address of ERC20 Cryptowallet';
        formIsValid = false;
    }
    else{
        if(values.address_2.length!=42){
            errors["address_2"] = 'Please enter valid PUBLIC Address of ERC20 Cryptowallet';
            formIsValid = false;
        }
    }

    if (!values.TC_1) {
        errors["TC"] = 'Please agree to the terms and conditions mentioned';
        formIsValid = false;
    }
    if (!values.TC_2) {
        errors["TC"] = 'Please agree to the terms and conditions mentioned';
        formIsValid = false;
    }
    if (!values.TC_3) {
        errors["TC"] = 'Please agree to the terms and conditions mentioned';
        formIsValid = false;
    }
    if (!values.TC_4) {
        errors["TC"] = 'Please agree to the terms and conditions mentioned';
        formIsValid = false;
    }
    if (!values.TC_5) {
        errors["TC"] = 'Please agree to the terms and conditions mentioned';
        formIsValid = false;
    }


    //const fileMinSize = 1 * 1000 * 1000; // 1MB
    // const fileMaxSize = 1.5 * 1000 * 1000; // 1.5MB
    // if (values.file1) {
    //     let fileSplits = values.file1.name.split(".");
    //     let file1Format = fileSplits[fileSplits.length - 1];
    //     if (checkIsExistsInArray(["jpg", "JPG", "png", "PNG", "pdf", "PDF", "jpeg", "JPEG"], file1Format)) {
    //
    //         // if (file.size < fileMinSize) {
    //         //     errors.file = 'Scan file must be atleast 1MB';
    //         //     }
    //         if (values.file1.size > fileMaxSize) {
    //             errors["file1"] = 'Please upload file which is less than 1.5 MB';
    //             formIsValid = false;
    //         }
    //     }
    //     else {
    //         errors["file1"] = "Please upload a .png, .jpg or .pdf file only";
    //         formIsValid = false;
    //     }
    // }
    // else {
    //     errors["file1"] = "Please upload first/front side of your KYC document with details visible";
    //     formIsValid = false;
    // }
    //
    // if (values.file2) {
    //     let fileSplits = values.file2.name.split(".");
    //     let file2Format = fileSplits[fileSplits.length - 1];
    //     if (checkIsExistsInArray(["jpg", "JPG", "png", "PNG", "pdf", "PDF", "jpeg", "JPEG"], file2Format)) {
    //
    //         // if (file.size < fileMinSize) {
    //         //     errors.file = 'Scan file must be atleast 1MB';
    //         //     }
    //         if (values.file2.size > fileMaxSize) {
    //             errors["file2"] = 'Please upload file which is less than 1.5 MB';
    //             formIsValid = false;
    //         }
    //     }
    //     else {
    //         errors["file2"] = "Please upload a .png, .jpg or .pdf file only";
    //         formIsValid = false;
    //     }
    // }
    // else {
    //     errors["file2"] = "Please upload last/reverse side of your KYC document with details visible";
    //     formIsValid = false;
    // }

    if(!values.ethValue){
        errors["ethValue"] = "Please enter your tentative ETH contribution";
    }
    else{
        var pattern = new RegExp(/^\d+(\.\d{1,2})?$/i);
        if (!pattern.test(values["ethValue"])) {
            formIsValid = false;
            errors["ethValue"] = "Please enter ETH value upto 2 decimals ONLY (Eg: 1.99)";
        }
        else{
            if(parseFloat(values["ethValue"]).toFixed(2)<"0.20"){
                formIsValid = false;
                errors["ethValue"] = "Please enter valid ETH value > 0.20";
            }
        }
    }

    if (!values.dateOfBirth) {
        errors["dateOfBirth"] = 'Please enter Date of birth';
        formIsValid = false;
    }
    else{
                // Don't check for 'format', here 'dateOfBirth' is passed as 'moment Date' object.
        // var dateReg =  /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
        // if (!dateReg.test(values["dateOfBirth"])) {
        //     errors["dateOfBirth"] = 'Please enter Date of birth in DD/MM/YYYY format';
        //     formIsValid = false;
        // }

        //if(formIsValid){
            var noOfYears = moment().diff(values["dateOfBirth"], 'years');
            //console.log("Age:",noOfYears);

             if(noOfYears<18){
                 errors["dateOfBirth"] = 'Age should be >18';
                 formIsValid = false;
             }
        //}
    }

    if (!values.sourceOfFunds || values.sourceOfFunds.trim() === '') {
        errors["sourceOfFunds"] = 'Please enter Source of funds';
        formIsValid = false;
    }


    return {"errors": errors,"isFormValid": formIsValid};

}

function checkIsExistsInArray(checkInArray, checkWith) {
    var checkRes = false;
    if (checkWith && checkInArray && checkInArray.length > 0) {
        var recIndex = checkInArray.findIndex(function (chkRec) {
            if (chkRec == checkWith) {
                return chkRec;
            }
        });

        if (recIndex != -1) {
            checkRes = true;
        }
    }
    return checkRes;
}

const whiteListFormValidator = function(formValues){
    let isWhiteListFormValid = true;
    const whiteLisFormErrors = {};

                    // Email ID validation:
    if(!formValues.emailId){
        whiteLisFormErrors["emailId"] = 'Please enter your email id';
        isWhiteListFormValid = false;
    }
    else if (formValues.emailId !== "undefined") {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(formValues["emailId"])) {
            isWhiteListFormValid = false;
            whiteLisFormErrors["emailId"] = "Please enter valid email id";
        }
    }

                    // Registration ID validation:
    // if(!formValues.uniqueId){
    //     whiteLisFormErrors["uniqueId"] = 'Please enter your unique id';
    //     isWhiteListFormValid = false;
    // }
    // else{
    //     if(formValues.uniqueId.length !== 12){
    //         whiteLisFormErrors["uniqueId"] = 'Please enter valid unique id';
    //         isWhiteListFormValid = false;
    //     }
    // }

                    // ETH Validation:
    if(!formValues.ethTransfered){
        whiteLisFormErrors["ethTransfered"] = "Please enter your ETH";
    }
    else{
        var pattern = new RegExp(/^\d+(\.\d{1,2})?$/i);
        if (!pattern.test(formValues["ethTransfered"])) {
            isWhiteListFormValid = false;
            whiteLisFormErrors["ethTransfered"] = "Please enter ETH value upto 2 decimals ONLY (Eg: 1.99)";
        }
        else{
            if(parseFloat(formValues["ethTransfered"]).toFixed(2)<"0.20"){
                isWhiteListFormValid = false;
                whiteLisFormErrors["ethTransfered"] = "Please enter valid ETH value > 0.20";
            }
        }
    }

    if (!formValues.address || formValues.address.trim() === '') {
        whiteLisFormErrors["address"] = 'Please enter the PUBLIC address of ERC20 Cryptowallet';
        isWhiteListFormValid = false;
    }
    else{
        if(formValues.address.length!=42){
            whiteLisFormErrors["address"] = 'Please enter valid PUBLIC Address of ERC20 Cryptowallet';
            isWhiteListFormValid = false;
        }
    }

    if (!formValues.txHash || formValues.txHash.trim() === '') {
        whiteLisFormErrors["txHash"] = 'Please enter Tx hash';
        isWhiteListFormValid = false;
    }

    if (!formValues.dateOfTransfer) {
        whiteLisFormErrors["dateOfTransfer"] = 'Please enter transfer date';
        isWhiteListFormValid = false;
    }
    if (!formValues.TC_1) {
        whiteLisFormErrors["TC"] = 'Please agree to the terms and conditions mentioned';
        isWhiteListFormValid = false;
    }
    if (!formValues.TC_2) {
        whiteLisFormErrors["TC"] = 'Please agree to the terms and conditions mentioned';
        isWhiteListFormValid = false;
    }

    return {"whiteLisFormErrors": whiteLisFormErrors,"isFormValid": isWhiteListFormValid};

};
 const additionalInfoFileUploadValidation= function(values){
     //console.log("values...",values);
     var errors = {};
     var formIsValid = true;

    const fileMaxSize = 1.5 * 1000 * 1000; // 1.5MB
    if (values && values.file1 && values.file1.name) {
        let fileSplits = values.file1.name.split(".");
        let fileFormat = fileSplits[fileSplits.length - 1];
        if (checkIsExistsInArray(["jpg", "JPG", "png", "PNG", "pdf", "PDF", "jpeg", "JPEG"], fileFormat)) {
            if (values.file1.size > fileMaxSize) {
                errors["file1"] = 'Please upload file which is less than 1.5 MB';
                formIsValid = false;
            }
        }
        else {
            errors["file1"] = "Please upload a .png, .jpg or .pdf file only";
            formIsValid = false;
        }
    }
    else {
        errors["file1"] = "Please upload document";
        formIsValid = false;
    }
    return {"additionalInfoFileUploadErrors":errors,"isFormValid" : formIsValid};

}
const secondaryRegistrationValidation = function(values){
    var errors={};
    let formIsValid=true;
    if (!values.Name || values.Name.trim() === '') {
        errors["Name"] = 'Please enter your name';
        formIsValid = false;
    }
    if (!values.countryId || values.countryId == 'Select Country') {
        errors["countryId"] = 'Please select your country of residence'
        formIsValid = false;
    }
    if (!values.emailId || values.emailId.trim() === '') {
        errors["emailId"] = 'Please enter your email id';
        formIsValid = false;
    }
    else if (values.emailId !== "undefined") {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(values["emailId"])) {
            formIsValid = false;
            errors["emailId"] = "*Please enter valid email id";
        }

    }
    if (!values.contactNumber || values.contactNumber.trim() === '') {
        errors["contactNumber"] = 'Please enter your Contact Number';
        formIsValid = false;
    }
    else if (values["contactNumber"] !== "undefined") {
        if (!values["contactNumber"].match(/^[0-9\b]+$/)) {
            formIsValid = false;
            errors["contactNumber"] = "*Please enter valid Contact Number";
        }
    }
    return {"secondaryRegistrationValidation":errors,"isFormValid" : formIsValid};
}

export default { validate, whiteListFormValidator, additionalInfoFileUploadValidation,secondaryRegistrationValidation};