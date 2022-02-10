const {  referenceError,  typeError,  dbConnectionError} = require('./errorTypes');
const {  LOG_SPAMMING_GUARD,  logView, printConfig} = require('./config');
const moment = require('moment');
let errors = {};

// check if error should be printed or not
const isLoggable = (error) =>{
  if(!errors[error]){
    errors[error] = {
      count: 0,
      timerRunning: false,
      triggered: []
    }
    return true;
  } else {
    errors[error].count += 1;
    if(!LOG_SPAMMING_GUARD.ERROR_TYPES.includes(error)){ // bypassing and keeping track of the error type
      return true;
    } 
    if(errors[error].count < LOG_SPAMMING_GUARD.MAXIMUM_ERROR_COUNT){
      return true;
    } else {
      if(!errors[error].timerRunning){
        errors[error].timerRunning = true;
        if(errors[error].triggered.length < LOG_SPAMMING_GUARD.MAXIMUM_ERROR_TIMESTAMPS) {
          errors[error].triggered.push(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        } else {
          errors[error].triggered.shift();
          errors[error].triggered.push(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        }
        setTimeout(()=>{
          errors[error].count = 0;
          errors[error].triggered.push(new Date());
          errors[error].timerRunning = false;
        }, +LOG_SPAMMING_GUARD.BREAKER_OPEN_TIME_MINUTES * 60 * 1000);
      }
      return false;
    }
  }
}

const printErrors = () =>{
  // Mocked version for different types of errors.
  const errors = [referenceError(), typeError(), dbConnectionError()];
  errors.forEach(error=>{
    if(isLoggable(error)){
      console.log(error);
    }
  })
  console.log('');
  setTimeout(()=>{
    printErrors();
  }, 5000)
}

const printErrorStack = () =>{
  console.log('----------CURRENT ERROR STACK----------');
  console.log(errors);
  console.log('---------------------------------------');
  setTimeout(()=>{
    printErrorStack();
  }, +logView.errorStackTimer);
}

const bootstrap = () =>{
  if(logView.printConfig){
    printConfig();
  }
  if(logView.printErrorStack){
    printErrorStack();
  }
  printErrors();
}

bootstrap();

