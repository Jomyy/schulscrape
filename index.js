const rp = require('request-promise');
const url = "https://infoscreen.friedensschule.de";
(function loop() {
    setTimeout(function () {
      // execute script
      rp(url)
  .then(function(html){
    var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');

    $ = cheerio.load(html);

    cheerioTableparser($);
    //#region load food
    
    var data = $(".ce-table").parsetable();
    
    data.shift();
    
    var fs = require('fs');
    var stringdat = JSON.stringify(data);
    
    
    fs.writeFile("fplan.json",stringdat.replace(/\\n/g, '').replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\t/g, ''), function(err, result) {
        
    });
    //#endregion

    //#region load vplan
    let vplan = $(".col_vplan")
    let vplansarr = vplan.find(".tx-friedensschule")
    let stundenfirst = []
    let stundensecond = []
    vplansarr.map((j,vplans) => {
       // put every tr in a json array 
        let vplanarr = $(vplans).find("tr")
            vplanarr.map((i,vplan) => {
                let vplanobj = {}
                let vplanarr = $(vplan).find("td")
                vplanarr.map((i,vplan) => {
                    vplanobj[i] = $(vplan).text()
                })
                if(j == 0){
                    stundenfirst.push(vplanobj);
                }
                if(j == 1){
                    stundensecond.push(vplanobj);
                }
                
            }
        )
        
        
    }
    )
    console.log(stundenfirst.length)
    stundenfirst.shift();
    stundensecond.shift();
    console.log(stundensecond.length)
    fs.writeFile("vplan.json", JSON.stringify(stundenfirst), function(err, result) {
        if(err) console.log('error', err);
    });
    fs.writeFile("vplannext.json", JSON.stringify(stundensecond), function(err, result) {
        if(err) console.log('error', err);
    });
  })
  .catch(function(err){
    //handle error
  });
      loop()
    }, 600000); //9000 = 9000ms = 9s 600000
  }());
