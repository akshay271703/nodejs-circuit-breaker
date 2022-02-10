const errorInstance = (error, customError) =>{
  if(customError){
    return customError;
  }
  const err = new Error(error);
  const errorType = err.stack.split('/n')[0].split(':')[1].trim();
  return errorType;
}

// mocked reference errors
const referenceError = () =>{
  try {
    console.log(x/y);
  } catch (error){
    return errorInstance(error, null);
  }
}

// mocked type errors
const typeError = () =>{
  try {
    const res = undefined;
    console.log(res.send);
  } catch(error) {    
    return errorInstance(error, null);
  }
}

// mock db error. Random errors everytime this function is called
const dbConnectionError = () =>{
  const val = Math.random();
  if(val > 0.7){
    return errorInstance(null,'SequelizeDatabaseError');
  }
  if(val < 0.7 && val > 0.5){
    return errorInstance(null,'TimeoutError');
  }
  if(val < 0.5 && val > 0.3){
    return errorInstance(null,'SequelizeAccessDeniedError');
  }
  if(val < 0.3){
    return errorInstance(null,'SequelizeConnectionError');
  }  
}

module.exports = {
  referenceError,
  typeError,
  dbConnectionError
}