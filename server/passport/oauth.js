var ids = {
  facebook: {
    clientID: '481488238866098',
    clientSecret: 'f2ca65f45e67e0b3885311999ea1c862',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    consumerKey: 'KxUwfyf2V3pzZ5h6RO7zD3QFZ',
    consumerSecret: 'TAYv3GpBrK1mEIonEM4GmI10zbUQy27WZnbCTOqeWpR9ZXx0tz',
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  google: {
    clientID: '712957510419-hh9fevf2430m113k9bomi0fir3rdks61.apps.googleusercontent.com',
    clientSecret: 'q1h-_jrWncrHG5gaHwn77tP6',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }
};

module.exports = ids;
//passport secrets for social login