var INDEX_STATE_OF_DEV = 0;
/* Chang this field when deploy*/

var STATE_OF_DEV = ["dev", "pro", "sta"];

Config = {
	DevStatus: STATE_OF_DEV[INDEX_STATE_OF_DEV], 

	GoogleApi : {
		TranslateKey : {
			dev : "AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY",
			pro : "",
			sta : ""
		}
	}
};