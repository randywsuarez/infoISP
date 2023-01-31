import moment from "moment";
moment.locale("es")

export default {
    fromNow: function(date){
        return moment(date).fromNow()
    },
    format: function(date, format){
    	return moment(date).format(format)
    }
}
