const BASE_URL =
  "https://v6.exchangerate-api.com/v6/6390ed5fee4e722dfc3276be/latest/USD"; // Fixed URL

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "BDT") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = BASE_URL; // Now using the fixed URL for USD as base currency
  console.log(`Fetching data from URL: ${URL}`);

  try {
    let response = await fetch(URL);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log("API Response Data:", data);

    // Check if conversion rates are present in the response
    if (data.conversion_rates && data.conversion_rates[toCurr.value]) {
      let rate = data.conversion_rates[toCurr.value];
      let finalAmount = (amtVal * rate).toFixed(2); // rounding to 2 decimal places
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText =
        "Error fetching the exchange rate. Please check the currency codes.";
      console.error("Conversion rates not available in the response data.");
    }
  } catch (error) {
    msg.innerText = "Failed to retrieve exchange rate data.";
    console.error("Fetch Error:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
window.addEventListener("load", () => {
  updateExchangeRate();
});
