function GetAllSets()
{
    var apiUrl = 'https://api.pokemontcg.io/v1/sets';
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                var select = document.getElementById("setName")
                data.sets.sort((a,b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate))
                for(index in data.sets) {
                    select.options[select.options.length] = new Option(data.sets[index].name, data.sets[index].code);
                }
            }).catch(err => {
                console.log(err)
            });
}

function GetAllCardsInSet(setCode)
{
    var apiUrl = 'https://api.pokemontcg.io/v1/cards?setCode='+setCode;
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                var select = document.getElementById("cardName")
                data.cards.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                select.options.length = 0;
                for(index in data.cards) {
                    select.options[select.options.length] = new Option(data.cards[index].name + " - Set Number:" + data.cards[index].number, data.cards[index].id);
                }
                GetSpecificCard(data.cards[0].id)
            }).catch(err => {
                console.log(err)
            });
}

function GetSpecificCard(id)
{
    var apiUrl = 'https://api.pokemontcg.io/v1/cards?id='+id;
    fetch(apiUrl).then(response => {
    return response.json();
    }).then(data => {
        var img = document.getElementById("cardImage")
        img.src = data.cards[0].imageUrlHiRes
    }).catch(err => {
        console.log(err)
    });
}