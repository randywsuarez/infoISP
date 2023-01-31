import { toast } from "react-toastify";

var config = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true
}

export default {
	error: msg => toast.error(msg,config),
	info: msg => toast.info(msg,config),
	success: msg => toast.success(msg,config),
	warn: msg => toast.warn(msg,config),
	default: msg => toast(msg,config)
}