// This js file is for testing the API calls only


const url = 'https://api.coingecko.com/api/v3/ping';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-AAPrMa8U1fzokiaCD3GGdvgW'}
};

const response = async () => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
}

response();