# Avoid Spamming Logs

## How to run code

```
npm run start
```

## Configuration Object Definitions

### Can be modified in `config.js` file. All variables can be changed and played around.

```
const logView = {
  printConfig: BOOLEAN,
  printErrorStack: BOOLEAN,
  errorStackTimer: INTEGER (in MS)
}
```

```
const LOG_SPAMMING_GUARD = {
  MAXIMUM_ERROR_COUNT: INTEGER ,
  BREAKER_OPEN_TIME_MINUTES: INTEGER,
  ERROR_TYPES: []: ARRAY OF STRING,
  MAXIMUM_ERROR_TIMESTAMPS: INTEGER
}
```

`MAXIMUM_ERROR_COUNT`: How many times will we allow the same error to be logged before we stop logging it.

`BREAKER_OPEN_TIME_MINUTES`: Once that threshold has been reached, for how long will we stop logging that error.

`ERROR_TYPES`: List of the error types that should apply the log spamming guard logic. If an error type is not listed here, that means errors of that type will always be logged.

`MAXIMUM_ERROR_TIMESTAMPS`: The maximum number of timestamps stored. Will always store most recent ones.

`printConfig`: true if you want to print config object before logging starts.

`printErrorStack`: true if you want to print error history.

`errorStackTimer`: value in ms after which error stack is re-printed.

## Function Logic

- Identify type of error // SequelizeConnectionError / SequelizeAccessDeniedError
- Define object to hold all error types. Say errorStack
- Check if the passed parameter is included in errorStack
- If not then add object with key same as error type passed with 3 attributes

  - `count` -- the number of times this error is occurred
  - `timerRunning` -- to track the status if this error has reached the threshold. The value is true if the error occurrence crossed the threshold value defined in pm2 file.
  - `triggered` -- array containing the timestamps in which this particular error has crossed the allowed log-able limit.

- If this error type is already present in errorStack increment the count attribute
- If we do not want to trace it simply return true, which allows to print this error any number of times.
- In case we want to prevent logging, check if the recently incremented value exceeds the allowed limit.
- If no then return true, which in turn will allow the log to be printed.
- If yes, then check if the timer for this error is already running.
  - If timer is running, we simply return false, which stops the log to be printed.
  - If timer is not running
    - Set timer running as true.
    - Push the current timestamp in the triggered array.
    - Set a timeout whose time duration is equal to the circuit breakout time.
    - On timeout the timer running is again set to false and count as 0, which simply means this error can again be printed.
    - Return false

## Additional points to consider

- If we need to prevent all types errors the first condition in the above logic can be omitted. This will result into some important errors being omitted. For example `TypeError`.

- To track all sorts of error in the whole application up-time, a new route can be created to log all types of errors. Same errorStack object can be sent in the HTTP response.

- The errorInstance in the function definition can be checked by `error.stack.split('\n')[0].split(":")[1].trim()`
