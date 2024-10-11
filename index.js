const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const APIKEY = "CG-AAPrMa8U1fzokiaCD3GGdvgW";
const mongourl = "mongodb+srv://charanganesh10:YogDlFZ87khsJqT5@cluster0.p2x81xt.mongodb.net/KoinX";

const crytpoSchema = new mongoose.Schema({
    BTC: Object,
    ETH: Object,
    MATIC: Object
});

const crypto = mongoose.model('Crypto', crytpoSchema);
mongoose.connect(mongourl);
require("dotenv").config();



const standardDeviation = (arr) => {
    // arr contains the last n records of the coin in the form of an object
    // We need to compute the standard deviation of the current_price_usd
    // We can use the formula for standard deviation
    // sqrt((sum(x - mean)^2)/n)

    let sum = 0;
    let mean = 0;
    let n = arr.length > 100 ? 100 : arr.length;
    for (let i = 0; i < n; i++) {
        sum += arr[i]
    }
    mean = sum / n;
    let sum_diff = 0;

    for (let i = 0; i < n; i++) {
        sum_diff += Math.pow((arr[i]) - mean, 2);
    }
    console.log("Sum_diff: ", sum_diff);

    return Math.sqrt(sum_diff / n);
}


app.get("/", async (req, res) => {

    // This function checks if the server is up and running -> Working

    console.log("API: ", APIKEY);
    const url = 'https://api.coingecko.com/api/v3/ping';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': APIKEY
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        res.json(data);
    }
    catch (error) {
        console.log(error);
    }
})

app.get("/coins", async (req, res) => {

    // This function returns a list of objects containing the id, symbol, and name of all coins

    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': APIKEY }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        res.json(data);
    }
    catch (error) {
        console.log(error);
    }
})

app.get("/coins/:id", async (req, res) => {
    // This function returns the details of the id passed in the URL
    // id = [bitcoin, ethereum, matic-network]

    // ! We need to add a for loop for all the id's in the id list -> Done

    const url = `https://api.coingecko.com/api/v3/coins/${req.params.id}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': APIKEY }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        current_price_usd = data.market_data.current_price.usd;
        market_cap_usd = data.market_data.market_cap.usd;
        price_change_24h = data.market_data.price_change_24h;
        res.status(200).json({
            "current_price_usd": current_price_usd,
            "market_cap_usd": market_cap_usd,
            "price_change_24h": price_change_24h
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Coin not found");
    }

});


app.get("/task1", async (req, res) => {

    // This api endpoint returns the current_price, market_cap, and price_change_24h of the coins [bitcoin, ethereum, matic-network]

    const coins = ["bitcoin", "ethereum", "matic-network"];
    let response_data = [];
    for (let i = 0; i < coins.length; i++) {
        const url = `https://api.coingecko.com/api/v3/coins/${coins[i]}`;
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': APIKEY }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const current_price_usd = data.market_data.current_price.usd;
            const market_cap_usd = data.market_data.market_cap.usd;
            const price_change_24h = data.market_data.price_change_24h;
            response_data.push({
                "current_price_usd": current_price_usd,
                "market_cap_usd": market_cap_usd,
                "price_change_24h": price_change_24h
            });
        }
        catch (error) {
            console.log(error);
            res.status(404).send("Coin not found");
        }
    }

    try {
        crypto.create({
            "BTC": response_data[0],
            "ETH": response_data[1],
            "MATIC": response_data[2]
        });
        res.status(200).json({
            "success": true,
            "BTC": response_data[0],
            "ETH": response_data[1],
            "MATIC": response_data[2]
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            "success": false
        })
    }

})

app.get("/stats", async (req, res) => {
    // This has a query params as coin and returns the name of the coin
    // If the coin is not found, it returns an error

    const coin = req.query.coin;
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': APIKEY }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        current_price_usd = data.market_data.current_price.usd;
        market_cap_usd = data.market_data.market_cap.usd;
        price_change_24h = data.market_data.price_change_24h;
        res.status(200).json({
            "price": current_price_usd,
            "marketCap": market_cap_usd,
            "24hChange": price_change_24h
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Coin not found");
    }
})

app.get("/deviation", async (req, res) => {
    const coin = req.query.coin;
    var coinCode = ""
    if(coin == "bitcoin"){
        coinCode = "BTC";
    }
    else if(coin == "ethereum"){
        coinCode = "ETH";
    }
    else if(coin == "matic-network"){
        coinCode = "MATIC";
    }
    
    
    if (!coinCode) {
        return res.status(400).json({ error: "Please provide a coin query parameter" });
    }


    const dbquery = `${coinCode}`; 
    console.log(dbquery);
    try {
        const results = await crypto.find({}, {
            [dbquery]: 1, 
        })
        .sort({ _id: -1 })
        .limit(10);

        const data = results.map((result) => result[coinCode]['current_price_usd']);

        if (data.length === 0) {
            return res.status(404).json({ error: `No data found for coinCode: ${coinCode}` });
        }

        const stdDev = standardDeviation(data);

        res.status(200).json({
            "standard_deviation": stdDev
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("Error occurred");
    }
});


const hoursToSeconds = (hours) => {
    return hours * 60 * 60;
}

const time = 2000 //hoursToSeconds(2);

const fetchTask1 = () => {
    setInterval(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3000/task1");
            const data = await response.json();
            if (response.success == false) {
                console.log("Error");
            }
            else{
                console.log(data);
            }
        }
        fetchData();
    }, time)
}

// fetchTask1();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

