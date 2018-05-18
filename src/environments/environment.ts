// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  stripeKey: 'pk_test_otQnjjPy6y3fnMDITtKlPXJn',
  firebase: {
    apiKey: 'AIzaSyDsmkTI5qOzq0VU9Im0_XovyX1WJObcl10',
    authDomain: 'luxmartstore.firebaseapp.com',
    databaseURL: 'https://luxmartstore.firebaseio.com',
    projectId: 'luxmartstore',
    storageBucket: 'luxmartstore.appspot.com',
    messagingSenderId: '136515645539'
  }
};
