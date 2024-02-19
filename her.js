const url = "https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd";
const params = new URLSearchParams({
  referenceCurrencyUuid: "yhjMzLPhuIDl",
  timePeriod: "24h",
});

const headers = {
  "X-RapidAPI-Key": "fc331a67cfmsh78064abd550eabep135218jsn9b642102e51c",
  "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
};

const options = {
  method: "GET",
  headers: headers,
};

try {
    const response = await fetch(`${url}?${params}`, options);
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error(error);
}

let p = "erer"

