
let appHandler = (req, res) => {
    // do stuff here
    console.log("Yay I got the request for driver app");
    res.sendFile('../../public/pages/thank-you.html', {root: __dirname });
  }


  exports.appHandler = appHandler;