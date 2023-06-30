const axios = require('axios')
const { JSDOM } = require("jsdom")
const cheerio = require("cheerio");
const fs = require('fs');

axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
    .then(response => {
        // HTML is inside response.data
        const dom = new JSDOM(response.data);
        
        // parse the html using cheerio
        const $ = cheerio.load(response.data);
        
        // select all elements with class name "item"
        const cheeses = $(".item");
        
        // create json file
        let newJSON = JSON.stringify("Adimo take home test");
        fs.writeFileSync('adimoCheese.json', newJSON + '\n');
        
        // array of prices for averaging price of all items
        var priceArray = [];
        
        // loop to get each product as it's own object
        for (const cheese of cheeses) {
        	structuredData = {
        		"Title": $(cheese).find("h1").text().trim(),
        		"Image URL": $(cheese).find("img").attr('src'),
        		"Price": $(cheese).find(".price").text(),
        	};
        	
        // add products to the json file
        let data = JSON.stringify(structuredData);
        fs.appendFileSync('adimoCheese.json', data + '\n');
        
        // add the price to array of prices, removing the £ sign
        priceArray.push(parseFloat(structuredData.Price.replace("£", "")));
        }
        
        /* 
        add the number of cheeses to the json file
        calculated by taking the length of cheeses constant created
        earlier
        */
        let numCheese = JSON.stringify("Number of objects: " + cheeses.length);
        fs.appendFileSync('adimoCheese.json', numCheese + '\n');

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
        fs.appendFileSync('adimoCheese.json', avgPrice + '\n');
    })
    
    .catch(error => {
        //Print error if any occured
        console.log(error)
    })