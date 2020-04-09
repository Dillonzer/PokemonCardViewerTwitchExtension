var AllCards = [];
var AllSets = [];

function Set(name, code, ptcgo_code, releaseDate)
{
    this.Name = name;
    this.Code = code;
    this.PTCGO_Code = ptcgo_code;
    this.ReleaseDate = releaseDate;
}

function Card(name, set, setCode, setNumber, releaseDate, image)
{
    this.Name = name;
    this.Set = set;
    this.SetCode = setCode;
    this.SetNumber = setNumber;
    this.ReleaseDate = releaseDate;
    this.Image = image;
}

window.onload = function()
{
    this.Setup(GetAllSets);    
}

function Setup(GetAllSetsCallback)
{
    GetAllSetsCallback(GetAllCards)
}

function GetAllSets(GetAllCardsCallback)
{
    var apiUrl = 'https://api.pokemontcg.io/v1/sets?&pageSize=1000';
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                for(index in data.sets) {
                    AllSets.push(new Set(data.sets[index].name, data.sets[index].code, data.sets[index].ptcgoCode, data.sets[index].releaseDate));
                }
                GetAllCardsCallback(SetSetListBoxes);
            }).catch(err => {
                console.log(err)
            });
}

function GetAllCards(SetSetListBoxCallback)
{
    var setCounter = 0
    var cardCounter = 0
    for(let i = 0; i < AllSets.length; i++)
    {
        let setCode = AllSets[i].Code;
        let setName = AllSets[i].Name;
        let releaseDate = AllSets[i].ReleaseDate
        var apiUrl = 'https://api.pokemontcg.io/v1/cards?setCode='+AllSets[i].Code+'&pageSize=1000';
            fetch(apiUrl).then(response => { 
                return response.json(); 
            }).then(data => {
                for(index in data.cards) {
                    AllCards.push(new Card(data.cards[index].name, setName, setCode, data.cards[index].number, releaseDate, data.cards[index].imageUrlHiRes))
                    cardCounter++
                }    
                setCounter++ 
                document.getElementById("loadingTxt").innerHTML = "Loading All Pokemon Cards... (" + (cardCounter / (117*AllSets.length) * 100).toFixed(0) + "%)"
                if(setCounter == AllSets.length)
                {
                    SetSetListBoxCallback(GetAllCardsInSetNoParam);
                }        
            }).catch(err => {
                console.log(err)
            });
    }
}

function SetSetListBoxes(GetCallCardsInSetCallBack)
{
    var setSelect = document.getElementById("setName")
    var sortedSets = AllSets.sort((a,b) => Date.parse(b.ReleaseDate) - Date.parse(a.ReleaseDate))

    for(var i = 0; i < sortedSets.length; i++)
    {
        setSelect.options[setSelect.options.length] = new Option(sortedSets[i].Name + " (" + sortedSets[i].PTCGO_Code + ")", sortedSets[i].Code);
    }
    setSelect.selectedIndex = "1";
    GetCallCardsInSetCallBack()


}

function GetAllCardsInSetNoParam()
{
    var setCode = document.getElementById("setName");
    GetAllCardsInSet(setCode.value)
}

function GetAllCardsInSet(setCode)
{ 
    var cardSelect = document.getElementById("cardName")
    var cardsInSet = AllCards.filter(cards => cards.SetCode === setCode)
    var sortedCardsInSet = cardsInSet.sort((a,b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0))
    cardSelect.options.length = 0;
    for (let i = 0; i < sortedCardsInSet.length; i++)
    {
        cardSelect.options[cardSelect.options.length] = new Option(sortedCardsInSet[i].Name + " (" + sortedCardsInSet[i].SetNumber + ")", sortedCardsInSet[i].Image);
    }
    GetSpecificCardNoParam()
}

function GetSpecificCardNoParam()
{
    var cardId = document.getElementById("cardName");
    GetSpecificCard(cardId.value)

    if(document.getElementById("loadingImg").style.display != "none")
    {
        HideLoadImage(EventListeners)
    }
}

function GetSpecificCard(image)
{    
    var img = document.getElementById("cardImage")
    img.src = image
}

function HideLoadImage(EventListenersCallBack)
{    
    var img = document.getElementById("loadingImg").style.display="none";
    var cardSelect = document.getElementById("cardName").style.display="inline"; 
    var setCode = document.getElementById("setName").style.display="inline";
    var img = document.getElementById("cardImage").style.display="inline";
    var tab = document.getElementById("tabHeader").style.display="block";
    
    EventListeners()

}

function OpenTab(tabName) {
    var i, tabcontent;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById('div_'+tabName).style.display = "block";
    document.getElementById('btn_'+tabName).className += " active";
}   

function EventListeners()
{
    document.getElementById("setName").addEventListener("change",function() {GetAllCardsInSetNoParam()})
    document.getElementById("cardName").addEventListener("change",function() {GetSpecificCardNoParam()})
    document.getElementById("btn_BySet").addEventListener("click",function() {OpenTab("BySet")})    
    document.getElementById("btn_ByCardName").addEventListener("click",function() {OpenTab("ByCardName")})
    document.getElementById("btn_searchCardByName").addEventListener("click",function() {GetCardsForSlideShowNoParam()})
    document.getElementById("txt_cardName").addEventListener("keyup",function() {GetCardsForSlideShowNoParamEnter(event)})
    document.getElementById("prevSlide").addEventListener("click",function() {plusSlides(-1)})
    document.getElementById("nextSlide").addEventListener("click",function() {plusSlides(1)})
    
    document.getElementById('btn_BySet').click()
}

//SLIDESHOW STUFF
var slideIndex = 1

function GetCardsForSlideShowNoParam()
{
    var cardName = document.getElementById("txt_cardName");
    GetCardsForSlideShow(cardName.value)
}

function GetCardsForSlideShowNoParamEnter(event)
{
        // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        
        var cardName = document.getElementById("txt_cardName");
        GetCardsForSlideShow(cardName.value)
    }
}

function GetCardsForSlideShow(name)
{    
    var imgs = document.getElementsByClassName("dynamicImage")
    while(imgs.length > 0) {
        imgs[0].parentNode.removeChild(imgs[0]);  
    }

    var nameWithHyphens = name.replace(" ","-").toLowerCase();
    var nameWithoutHyphens = name.replace("-"," ").toLowerCase();
    var lowerCaseName = name.toLowerCase();

    var cardsByName = AllCards.filter(cards => 
        cards.Name.toLowerCase() === nameWithHyphens || 
        cards.Name.toLowerCase() === nameWithoutHyphens || 
        cards.Name.toLowerCase() === lowerCaseName.trim() || 
        cards.Name.toLowerCase() === lowerCaseName || 
        cards.Name.toLowerCase().includes(lowerCaseName) ||
        cards.Name.toLowerCase().includes(nameWithHyphens) ||
        cards.Name.toLowerCase().includes(nameWithoutHyphens) ||
        cards.Name.toLowerCase().includes(lowerCaseName.trim()))
    var sortedCardsByName = cardsByName.sort((a,b) => Date.parse(b.ReleaseDate) - Date.parse(a.ReleaseDate))

    for(let i = 0; i < sortedCardsByName.length; i++)
    {
        var dynamicDiv = document.createElement("div");
        dynamicDiv.className += "mySlides fade dynamicImage"
        var imgElem = document.createElement("img");
        var captionElem = document.createElement("div");
        captionElem.className += " slideshowText"
        imgElem.className += " cardSize"
        imgElem.src = sortedCardsByName[i].Image
        captionElem.innerHTML = sortedCardsByName[i].Set + " </br> Release Date: " + sortedCardsByName[i].ReleaseDate
        document.getElementById("slideshow").appendChild(dynamicDiv);
        dynamicDiv.appendChild(imgElem);
        dynamicDiv.appendChild(captionElem);
    }
    
    if(sortedCardsByName.length <= 0)
    {
        var dynamicDiv = document.createElement("div");
        dynamicDiv.className += "mySlides fade dynamicImage"
        var pElem = document.createElement("p");
        pElem.className += " loadingText"
        pElem.innerHTML = "Could not find a card containing '" + name + "'"
        document.getElementById("slideshow").appendChild(dynamicDiv);
        dynamicDiv.appendChild(pElem);
    }
    slideIndex = 1
    showSlides(1)
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
  document.getElementById("prevSlide").style.display = "block"  
  document.getElementById("nextSlide").style.display = "block"
}