const axios = require('axios')
const { JSDOM } = require("jsdom")
const cheerio = require("cheerio");
const fs = require('fs');

const params = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
};

axios.get('https://www.jjfoodservice.com/search?b&page=0&q=nestle&size=12', params)
    .then(response => {
        // HTML is inside response.data
        const dom = new JSDOM(response.data);
        
        // parse the html using cheerio
        const $ = cheerio.load(response.data);
        
        // select all elements with class name "item"
        const cereals = $(".SearchPagestyle__ResultsWrapper-sc-1c66j3i-8");
        
        console.log("connected")
        
        // create json file
        let newJSON = JSON.stringify("Adimo take home test challenge 1");
        fs.writeFileSync('adimoChallenge1.json', newJSON + '\n');
        
        // array of prices for averaging price of all items
        var priceArray = [];
        
        // loop to get each product as it's own object
        for (const cereal of cereals) {
        	structuredData = {
        		"Title": $(cereal).find("a.Productstyle__Name-sc-1ssfvqo-9").text().trim(),
        		"Image URL": $(cereal).find("img.Imagestyle__Img-sc-1o9v7pr-0").attr("src"),
        		"Price": $(cereal).find("div.Productstyle__PriceText-sc-1ssfvqo-33").text(),
        	};
        	
        // add products to the json file
        let data = JSON.stringify(structuredData);
        fs.appendFileSync('adimoChallenge1.json', data + '\n');
        
        console.log(structuredData);
        
        // add the price to array of prices, removing the £ sign
        priceArray.push(parseFloat(structuredData.Price.replace("£", "")));
        }
        
        /* 
        add the number of cheeses to the json file
        calculated by taking the length of cheeses constant created
        earlier
        */
        let numCereals = JSON.stringify("Number of objects: " + cereals.length);
        fs.appendFileSync('adimoChallenge1.json', numCereals + '\n');

		/*
		helper function used to calculate the average of an array
		*/
		function arrayAverage(array) {
			var total = 0;
			
			array.forEach(function(value){
				total += value;
			});
			
			return total / array.length;
		}
		
		// calculate average price and add to the json
		let avgPrice = JSON.stringify("Average price of cheeses: £" + arrayAverage(priceArray));
        fs.appendFileSync('adimoChallenge1.json', avgPrice + '\n');
    })
    
    .catch(error => {
        //Print error if any occured
        console.log(error)
    })