var lang = localStorage.getItem("currentLang");

if (!lang || lang === "SPA") {
    var wpwlOptions = {
        style: "card",
        locale: "es",
        labels: {
            cvv: "CVV",
            cardHolder: "Nombre (Igual que en la tarjeta)"
        }
    }
} else {
    var wpwlOptions = {
        style: "card",
        locale: "en",
        labels: {
            cvv: "CVV",
            cardHolder: "Name (Same as on the card)"
        }
    }
}