const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const fs = require("fs");

const url = "https://infoscreen.friedensschule.de";
(function loop() {
  setTimeout(function () {
    // execute script
    rp(url)
      .then(function (html) {
        $ = cheerio.load(html);

        cheerioTableparser($);
        //#region load food

        var data = $(".ce-table").parsetable();

        data.shift();

        var stringdat = JSON.stringify(data);

        fs.writeFile("fplan.json", stringdat.replace(/\\n/g, "").replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\t/g, ""), function (err, result) {});
        //#endregion

        //#region load vplan
        let vplan = $(".col_vplan");
        let vplansarr = vplan.find(".tx-friedensschule");
        let stundenfirst = [];
        let stundensecond = [];
        vplansarr.map((j, vplans) => {
          // put every tr in a json array
          let vplanarr = $(vplans).find("tr");
          vplanarr.map((i, vplan) => {
            let vplanitemobj = [];
            let vplanarr = $(vplan).find("td");
            vplanarr.map((i, vplan) => {
              if (i != 0) {
                vplanitemobj.push($(vplan).text());
              }
            });
            if (j == 1) {
              if (vplanitemobj[1] != undefined) {
                stundensecond.push(vplanitemobj);
              }
            }
            if (j == 0) {
              if (vplanitemobj[1] != undefined) {
                stundenfirst.push(vplanitemobj);
              }
              //stundensecond.push(vplanitemobj);
            }
          });
          stundenfirst.shift();
          stundensecond.shift();
        });
        console.log(stundenfirst.length);
        stundenfirst.shift();
        stundensecond.shift();
        delete require.cache[require.resolve("./klassen.json")];
        const allclasses = require("./klassen.json", "utf8");
        stundenfirst.forEach((element) => {
          if (
            !allclasses.some(function (v) {
              return element[0].indexOf(v) >= 0;
            })
          ) {
            allclasses.push(element[0]);
          }
        });
        console.log(stundensecond.length);
        fs.writeFile("klassen.json", JSON.stringify(allclasses), function (err, result) {
          if (err) console.log("error", err);
        });
        fs.writeFile("vplannext.json", JSON.stringify(stundensecond), function (err, result) {
          if (err) console.log("error", err);
        });
        fs.writeFile("vplan.json", JSON.stringify(stundenfirst), function (err, result) {
          if (err) console.log("error", err);
        });
      })
      .catch(function (err) {
        //handle error
      });
    loop();
  }, 600000); //9000 = 9000ms = 9s 600000
})();
