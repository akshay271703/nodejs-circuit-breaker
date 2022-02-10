const LOG_SPAMMING_GUARD = {
  MAXIMUM_ERROR_COUNT: 2,
  BREAKER_OPEN_TIME_MINUTES: 2,
  ERROR_TYPES: [
    'SequelizeConnectionError', // VPN OFF
    'SequelizeAccessDeniedError', // Incorrect credentials in PM2 Files
    'TimeoutError', //  VPN turned off in between resource request
    'SequelizeGenericPoolErrors',
    'SequelizeDatabaseError',
    'ReferenceError'
  ],
  MAXIMUM_ERROR_TIMESTAMPS: 1
};

const logView = {
  printConfig: true, // invoke printConfig
  printErrorStack: false, // This prints error stacks after every errorStackTimer seconds
  errorStackTimer: 30000 // 30 seconds
};

const printConfig = () =>{
  console.log();
  console.log('----------------------------------------');
  console.log('-------------CONFIGURATIONS-------------');
  console.log(`------MAXIMUM ERROR COUNT = ${LOG_SPAMMING_GUARD.MAXIMUM_ERROR_COUNT} TIMES-----`);
  console.log(`-----REPRINTING ERROR AFTER = ${LOG_SPAMMING_GUARD.BREAKER_OPEN_TIME_MINUTES} MIN-----`);
  console.log(`---MAXIMUM ERROR TIMESTAMPS = ${LOG_SPAMMING_GUARD.MAXIMUM_ERROR_TIMESTAMPS} TIMES---`);
  console.log('----------------------------------------');
  console.log();
}

module.exports = {
  LOG_SPAMMING_GUARD,
  logView,
  printConfig
}
