const axios = require('axios');
const lunr = require('lunr');

var textProcessing = require('../models/textprocess');
var empty = require('is-empty');
 
function cSearch() {
  
  this.searchAction = function(req,res,next) {

    var keyword = req.body.keyword;
    var businessModel = req.body.businessModel;
    var location = req.body.location;
    var roundInvestment = req.body.roundInvestment;
    var vertical = req.body.vertical;
    var yearEstablished = req.body.yearEstablished;

    console.log(keyword);
    console.log(businessModel);
    console.log(location);
    console.log(roundInvestment);
    console.log(vertical);
    console.log(yearEstablished);

    axios.get('https://minerva.dailysocial.id/sampoerna.json')
      .then(response => {

        var documents = response.data;

        var idx = lunr(function () {
          this.field('name')
          this.field('description')
          this.field('city')
          this.field('category')
          this.field('yearEstablished')
          this.field('businessModel')
          this.field('lastRound')
          //this.ref('name')

          documents.forEach(function (doc) {
            this.add(doc)
          }, this)
         
        });

        if(!empty(keyword)){

          if(Array.isArray(keyword)){

            if(keyword.length > 1){
              var arr = keyword.join(" ");
              var q = textProcessing.removeStopwordsID(arr);
              q = q.replace(/gudang/g, "*gudang*");
              q = q.replace(/ecommerce/g, "e-commerce");
            }else{
              var q = textProcessing.removeStopwordsID(keyword[0]);
              q = q.replace(/gudang/g, "*gudang*");
              q = q.replace(/ecommerce/g, "e-commerce");
            }

          }else{

            var q = textProcessing.removeStopwordsID(keyword);
            q = q.replace(/gudang/g, "*gudang*");
            q = q.replace(/ecommerce/g, "e-commerce");
          }

        }else{
          var q = "";
        }

        console.log(q);

        var ret = idx.search(q);

        var resLunr = [];
        var resLunrScore = [];

        for (var i = 0; i < ret.length; i++) {
          resLunr.push(ret[i].ref);
          resLunrScore.push(ret[i].score);

        }

        var dt = response.data;
        var finalRet = [];

        for (var i = 0; i < dt.length; i++) {

          var pass = {
              businessModel: true, 
              keyword: true, 
              location: true, 
              roundInvestment: true, 
              vertical: true, 
              yearEstablished: true
          };
          
          if(resLunr.includes(dt[i].id)){

            var index = resLunr.indexOf(dt[i].id);
            var score = resLunrScore[index];

            if (!empty(businessModel)) {
                if (!businessModel.includes(dt[i].businessModel)) {
                    pass.businessModel = false;
                } else {
                    pass.businessModel = true;                                    
                }
            }

            if (!empty(location)) {
                if (!location.includes(dt[i].city)) {
                    pass.location = false;
                } else {
                    pass.location = true;                                    
                }
            }

            if (!empty(roundInvestment)) {
                if (!roundInvestment.includes(dt[i].lastRound)) {
                    pass.roundInvestment = false;
                } else {
                    pass.roundInvestment = true;                                    
                }
            }

            if (!empty(vertical)) {
                for (var x=0;x<vertical.length;x++) {
                    if (!dt[i].category.includes(vertical[x])) {
                        pass.vertical = false;
                    } else {
                        pass.vertical = true;
                        break;                                        
                    }
                }
            }

            if (!empty(yearEstablished)) {
                if (!yearEstablished.includes(dt[i].yearEstablished)) {
                    pass.yearEstablished = false;
                } else {
                    pass.yearEstablished = true;                                    
                }
            }

            if (pass.businessModel == true && pass.location == true && pass.roundInvestment == true && pass.vertical == true && pass.yearEstablished == true) {

              finalRet.push({
                "id": dt[i].id,
                "name": dt[i].name,
                "description": dt[i].description,
                "descriptionEn": dt[i].descriptionEn,
                "city": dt[i].city,
                "country": dt[i].country,
                "category": dt[i].category,
                "yearEstablished": dt[i].yearEstablished,
                "notes": dt[i].notes,
                "website": dt[i].website,
                "avatar": dt[i].avatar,
                "urlNews": dt[i].urlNews,
                "operationStatus": dt[i].operationStatus,
                "businessModel": dt[i].businessModel,
                "provenRevenueModel": dt[i].provenRevenueModel,
                "provenBusinessModel": dt[i].provenBusinessModel,
                "editorialRating": dt[i].editorialRating,
                "investment": dt[i].investment,
                "lastRound": dt[i].lastRound,
                "founder": dt[i].founder,
                "score": score
              });
            }

          } 
        }

        finalRet.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
            //return a.provenBusinessModel < b.provenBusinessModel;
        });

        return res.status(200).json({statusCode:200,success:true,data:finalRet});
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({statusCode:500,message: "Read search failed."});
      });
  };

  this.searchEnAction = function(req,res,next) {

    var keyword = req.body.keyword;
    var businessModel = req.body.businessModel;
    var location = req.body.location;
    var roundInvestment = req.body.roundInvestment;
    var vertical = req.body.vertical;
    var yearEstablished = req.body.yearEstablished;

    console.log(keyword);
    console.log(businessModel);
    console.log(location);
    console.log(roundInvestment);
    console.log(vertical);
    console.log(yearEstablished);

    axios.get('https://minerva.dailysocial.id/sampoerna.json')
      .then(response => {

        var documents = response.data;

        var idx = lunr(function () {
          this.field('name')
          this.field('descriptionEn')
          this.field('city')
          this.field('category')
          this.field('yearEstablished')
          this.field('businessModel')
          this.field('lastRound')
          //this.ref('name')

          documents.forEach(function (doc) {
            this.add(doc)
          }, this)
         
        });

        if(!empty(keyword)){

          if(Array.isArray(keyword)){

            if(keyword.length > 1){
              var arr = keyword.join(" ");
              var q = textProcessing.removeStopwordsID(arr);
              q = q.replace(/gudang/g, "*gudang*");
              q = q.replace(/ecommerce/g, "e-commerce");
            }else{
              var q = textProcessing.removeStopwordsID(keyword[0]);
              q = q.replace(/gudang/g, "*gudang*");
              q = q.replace(/ecommerce/g, "e-commerce");
            }

          }else{

            var q = textProcessing.removeStopwordsID(keyword);
            q = q.replace(/gudang/g, "*gudang*");
            q = q.replace(/ecommerce/g, "e-commerce");
          }

        }else{
          var q = "";
        }

        console.log(q);

        var ret = idx.search(q);

        var resLunr = [];
        var resLunrScore = [];

        for (var i = 0; i < ret.length; i++) {
          resLunr.push(ret[i].ref);
          resLunrScore.push(ret[i].score);

        }

        var dt = response.data;
        var finalRet = [];

        for (var i = 0; i < dt.length; i++) {

          var pass = {
              businessModel: true, 
              keyword: true, 
              location: true, 
              roundInvestment: true, 
              vertical: true, 
              yearEstablished: true
          };
          
          if(resLunr.includes(dt[i].id)){

            var index = resLunr.indexOf(dt[i].id);
            var score = resLunrScore[index];

            if (!empty(businessModel)) {
                if (!businessModel.includes(dt[i].businessModel)) {
                    pass.businessModel = false;
                } else {
                    pass.businessModel = true;                                    
                }
            }

            if (!empty(location)) {
                if (!location.includes(dt[i].city)) {
                    pass.location = false;
                } else {
                    pass.location = true;                                    
                }
            }

            if (!empty(roundInvestment)) {
                if (!roundInvestment.includes(dt[i].lastRound)) {
                    pass.roundInvestment = false;
                } else {
                    pass.roundInvestment = true;                                    
                }
            }

            if (!empty(vertical)) {
                for (var x=0;x<vertical.length;x++) {
                    if (!dt[i].category.includes(vertical[x])) {
                        pass.vertical = false;
                    } else {
                        pass.vertical = true;
                        break;                                        
                    }
                }
            }

            if (!empty(yearEstablished)) {
                if (!yearEstablished.includes(dt[i].yearEstablished)) {
                    pass.yearEstablished = false;
                } else {
                    pass.yearEstablished = true;                                    
                }
            }

            if (pass.businessModel == true && pass.location == true && pass.roundInvestment == true && pass.vertical == true && pass.yearEstablished == true) {

              finalRet.push({
                "id": dt[i].id,
                "name": dt[i].name,
                "description": dt[i].description,
                "descriptionEn": dt[i].descriptionEn,
                "city": dt[i].city,
                "country": dt[i].country,
                "category": dt[i].category,
                "yearEstablished": dt[i].yearEstablished,
                "notes": dt[i].notes,
                "website": dt[i].website,
                "avatar": dt[i].avatar,
                "urlNews": dt[i].urlNews,
                "operationStatus": dt[i].operationStatus,
                "businessModel": dt[i].businessModel,
                "provenRevenueModel": dt[i].provenRevenueModel,
                "provenBusinessModel": dt[i].provenBusinessModel,
                "editorialRating": dt[i].editorialRating,
                "investment": dt[i].investment,
                "lastRound": dt[i].lastRound,
                "founder": dt[i].founder,
                "score": score
              });
            }

          } 
        }

        finalRet.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
            //return a.provenBusinessModel < b.provenBusinessModel;
        });

        return res.status(200).json({statusCode:200,success:true,data:finalRet});
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({statusCode:500,message: "Read search failed."});
      });
  };

  this.lunrAction = function(req,res,next) {

    var documents = 
    [
      {
        "title": "Tokopedia",
        "body": "Tokopedia adalah marketplace terbesar di Indonesia",
        "founder": "William",
        "year": ["2014","2017"],
        "id": "0jkuyvbc78m"
      }, 
      {
        "title": "Traveloka",
        "body": "Traveloka adalah platform hospitality di Indonesia",
        "author": "Bagus Rinaldhi",
        "year": ["2015","2017"],
        "id": "0jkuyvbc78r"
      }, 
      {
        "title": "Lazada",
        "body": "Lazada merupakan platform e-commerce yang memberikan layanan gratis ongkir",
        "author": "Bens",
        "year": ["2016","2018"],
        "id": "0jkuyvbc78f"
      }
    ]


    var idx = lunr(function () {
      this.field('title')
      this.field('body')
      this.field('year');

      documents.forEach(function (doc) {
        this.add(doc)
      }, this)
     
    });

    var string = "saya ingin tahu startup hospitality 2018 2014 2015";

    var ret = idx.search("saya ingin tahu startup hospitality 2018 2014 2015");

    var x = textProcessing.removeStopwordsID(string)

    return res.status(200).json({statusCode:200,success:true,data:x});

  };

  

}
module.exports = new cSearch();