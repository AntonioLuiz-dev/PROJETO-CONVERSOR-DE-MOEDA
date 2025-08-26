const currencySelectFrom = document.querySelector(".currency-select-from");
const currencySelectTo = document.querySelector(".currency-select-to");
const arrowImg = document.querySelector(".arrow-img");
const inputField = document.querySelector(".input-currency");
const clickSound = document.getElementById("click-sound");

function formatInputValue() {
    let value = inputField.value.replace(/\D/g, "");
    if (!value) { inputField.value=""; updateValues(0); return; }
    value = (parseInt(value)/100).toFixed(2);
    const currencyFrom = currencySelectFrom.value.toUpperCase();
    inputField.value = new Intl.NumberFormat("pt-BR", {style:"currency", currency:currencyFrom}).format(value);
    updateValues(parseFloat(value));
}

function getNumericInputValue() { return parseFloat(inputField.value.replace(/\D/g,""))/100||0; }

function animateValue(element, iconElement) {
    element.classList.add("currency-update");
    if(iconElement){ iconElement.classList.add("icon-jump"); setTimeout(()=>{iconElement.classList.remove("icon-jump");},500);}
    setTimeout(()=>{element.classList.remove("currency-update");},400);
}

async function updateValues(inputCurrencyValue){
    const currencyValueToConvert=document.querySelector(".currency-value-to-convert");
    const currencyValueConverted=document.querySelector(".currency-value");
    const currencyFrom=currencySelectFrom.value.toUpperCase();
    const currencyTo=currencySelectTo.value.toUpperCase();
    const iconFrom=document.querySelector(".currency-img-from");
    const iconTo=document.querySelector(".currency-img-to");

    if(!inputCurrencyValue||inputCurrencyValue<=0){ currencyValueToConvert.innerHTML="0,00"; currencyValueConverted.innerHTML="0,00"; return;}
    if(currencyFrom===currencyTo){ currencyValueConverted.innerHTML="Escolha moedas diferentes!"; return; }

    try{
        const url=`https://economia.awesomeapi.com.br/json/last/${currencyFrom}-${currencyTo}`;
        const response=await fetch(url);
        const data=await response.json();
        const pairKey=currencyFrom+currencyTo;
        const cotacao=parseFloat(data[pairKey].bid);
        const convertido=(inputCurrencyValue*cotacao).toFixed(2);

        currencyValueToConvert.innerHTML=new Intl.NumberFormat("pt-BR",{style:"currency",currency:currencyFrom}).format(inputCurrencyValue);
        animateValue(currencyValueToConvert,iconFrom);

        currencyValueConverted.innerHTML=new Intl.NumberFormat("pt-BR",{style:"currency",currency:currencyTo}).format(convertido);
        animateValue(currencyValueConverted,iconTo);

    } catch(error){ console.error("Erro ao buscar cotação:",error); currencyValueConverted.innerHTML="Erro ao carregar cotação!"; }
}

function updateCardColors(){
    const boxFrom=document.querySelector(".currency-box:first-child");
    const boxTo=document.querySelector(".currency-box:last-child");
    boxFrom.classList.remove("from-brl","from-usd","from-eur","from-gbp");
    boxTo.classList.remove("to-brl","to-usd","to-eur","to-gbp");
    boxFrom.classList.add("from-"+currencySelectFrom.value);
    boxTo.classList.add("to-"+currencySelectTo.value);
}

function changeCurrency(){
    const currencyNameFrom=document.getElementById("currency-name-from");
    const currencyImageFrom=document.querySelector(".currency-img-from");
    const currencyNameTo=document.getElementById("currency-name-to");
    const currencyImageTo=document.querySelector(".currency-img-to");

    const updateInfo=(select,nameElement,imgElement)=>{
        if(select.value==="brl"){nameElement.innerHTML="Real Brasileiro"; imgElement.src="./assets/real.png";}
        if(select.value==="usd"){nameElement.innerHTML="Dólar Americano"; imgElement.src="./assets/dolar.png";}
        if(select.value==="eur"){nameElement.innerHTML="Euro"; imgElement.src="./assets/euro.png";}
        if(select.value==="gbp"){nameElement.innerHTML="Libra Esterlina"; imgElement.src="./assets/libra 1.png";}
    };

    updateInfo(currencySelectFrom,currencyNameFrom,currencyImageFrom);
    updateInfo(currencySelectTo,currencyNameTo,currencyImageTo);

    updateCardColors();
    updateValues(getNumericInputValue());
}

function swapCurrencies(){
    const temp=currencySelectFrom.value;
    currencySelectFrom.value=currencySelectTo.value;
    currencySelectTo.value=temp;
    changeCurrency();
}

// Eventos
currencySelectFrom.addEventListener("change", changeCurrency);
currencySelectTo.addEventListener("change", changeCurrency);
arrowImg.addEventListener("click", swapCurrencies);
inputField.addEventListener("input", formatInputValue);
document.querySelector(".convert-button").addEventListener("click",()=>{ clickSound.play(); });

updateValues(0);
