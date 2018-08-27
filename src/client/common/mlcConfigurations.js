var _ = require('underscore');
var moment = require('moment');

const StatusSettings= [
    {
        'status': "QUEUE-LIST",
        'settings': {"HOME": true,"NEXT": true,"PREV": true, "WHITE": false,"BLACK": false,"HOLD": false,"ADDNL_INFO": false}
    },
    {
        'status': "WHITE-LIST",
        'settings': {"HOME": true,"NEXT": true,"PREV": true, "WHITE": false,"BLACK": false,"HOLD": false,"ADDNL_INFO": false}
    },
    {
        'status': "BLACK-LIST",
        'settings': {"HOME": true,"NEXT": true,"PREV": true, "WHITE": false,"BLACK": false,"HOLD": false,"ADDNL_INFO": false}
    },
    {
        'status': "HOLD-LIST",
        'settings': {"HOME": true,"NEXT": true,"PREV": true, "WHITE": false,"BLACK": false,"HOLD": false,"ADDNL_INFO": false}
    },
    {
        'status': "ADDITIONAL-LIST",
        'settings': {"HOME": true,"NEXT": true,"PREV": true, "WHITE": false,"BLACK": false,"HOLD": false,"ADDNL_INFO": false}
    }
];

const getRecordStatusName = function(pageName){
    var recSts = '';

    switch(pageName){
        case "QUEUE-LIST": recSts = "QUEUE";    break;
        case "WHITE-LIST": recSts = "WHITE";    break;
        case "BLACK-LIST": recSts = "BLACK";    break;
        case "HOLD-LIST": recSts = "HOLD";    break;
        case "ADDITIONAL-LIST": recSts = "ADDL_INFO";    break;
    }
    return recSts;
};

const getStatusSettings = function(pageName){
    var stsList = {};
    if(pageName){
         var stsSettings = _.findWhere(StatusSettings,{'status':pageName});
         stsList = stsSettings.settings;
    }
    return stsList;
};

function getFormattedDate(date) {
   return  moment(date).format("DD-MM-YYYY");
}

export default {getStatusSettings, getRecordStatusName, getFormattedDate};