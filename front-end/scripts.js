const pokeurl = "https://ptcg-api.herokuapp.com"

var AllCards = [];
var AllSets = [];

function Set(name, code, ptcgo_code, releaseDate)
{
    this.Name = name;
    this.Code = code;
    this.PTCGO_Code = ptcgo_code;
    this.ReleaseDate = releaseDate;
}

function Card(name, set, setCode, setNumber, releaseDate, image, tcgPlayerCardId, tcgPlayerCardUrl)
{
    this.Name = name;
    this.Set = set;
    this.SetCode = setCode;
    this.SetNumber = setNumber;
    this.ReleaseDate = releaseDate;
    this.Image = image;
    this.TCGPlayerId =  tcgPlayerCardId;
    this.TCGPlayerUrl = tcgPlayerCardUrl;
}

window.onload = function()
{
    EventListeners()
    this.Setup(GetAllSets);    
}

function Setup(GetAllSetsCallback)
{
    GetAllSetsCallback(GetAllCards)
}

function GetAllSets(GetAllCardsCallback)
{
    var language = document.getElementById("language");
    var apiUrl = pokeurl+"/api/sets";
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                for(index in data) {
                    if(language.value != "en_US")
                    {
                        if(Date.parse(data[index].releaseDate) > Date.parse('2010-01-01'))
                        {
                            AllSets.push(new Set(data[index].name, data[index].code, data[index].ptcgoCode, data[index].releaseDate));
                        }
                    }
                    else
                    {                        
                        AllSets.push(new Set(data[index].name, data[index].code, data[index].ptcgoCode, data[index].releaseDate));
                    }
                }
                GetAllCardsCallback(SetSetListBoxes);
            }).catch(err => {
                RefreshSection()
                console.log(err)
            });
}

function GetAllCards(SetSetListBoxCallback)
{
    var cardCounter = 0
    var language = document.getElementById("language");
    var apiUrl = pokeurl+"/api/cards?locale="+language.value
        fetch(apiUrl).then(response => { 
            return response.json(); 
        }).then(data => {
            for(index in data) {
                AllCards.push(new Card(data[index].name, data[index].set.name, data[index].set.code, data[index].number, data[index].set.releaseDate, data[index].imageUrlHiRes, data[index].tcgPlayerCardId, data[index].tcgPlayerCardUrl))
                cardCounter++ 
            }     

            if(cardCounter === data.length)
            {                      
                SetSetListBoxCallback(GetAllCardsInSetNoParam); 
            }

        }).catch(err => {
            RefreshSection()
            console.log(err)
        });
    
}

function RefreshSection()
{
    var img = document.getElementById("loadingImg").style.display="none";
    document.getElementById("refreshSection").style.display = "block"
}

function Refresh()
{    
    AllCards = [];
    AllSets = [];

    document.getElementById("refreshSection").style.display = "none"
    document.getElementById("loadingImg").style.display="inline";
    document.getElementById("cardName").style.display="none"; 
    document.getElementById("setName").style.display="none";
    document.getElementById("cardImage").style.display="none";
    document.getElementById("tabHeader").style.display="none";
    document.getElementById("div_BySet").style.display="none";
    document.getElementById("div_ByCardName").style.display="none";
    
    Setup(GetAllSets)
}

function SetSetListBoxes(GetCallCardsInSetCallBack)
{
    var setSelect = document.getElementById("setName")
    var sortedSets = AllSets.sort((a,b) => Date.parse(b.ReleaseDate) - Date.parse(a.ReleaseDate))
    
    var j, L = setSelect.options.length - 1;
    for(j = L; j >= 0; j--) {
        setSelect.remove(j);
    }

    for(var i = 0; i < sortedSets.length; i++)
    {
        setSelect.options[setSelect.options.length] = new Option(sortedSets[i].Name + " (" + sortedSets[i].PTCGO_Code + ")", sortedSets[i].Code);
    }
    
    setSelect.selectedIndex = "0";
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
        HideLoadImage()
    }
}

function GetSpecificCard(image)
{    
    var img = document.getElementById("cardImage")
    img.src = image
}

function HideLoadImage()
{    
    var img = document.getElementById("loadingImg").style.display="none";
    var cardSelect = document.getElementById("cardName").style.display="inline"; 
    var setCode = document.getElementById("setName").style.display="inline";
    var img = document.getElementById("cardImage").style.display="inline";
    var tab = document.getElementById("tabHeader").style.display="block";
    
    document.getElementById('btn_BySet').click()
}

function OpenTab(tabName) {
    var i, tabcontent;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    if(tabcontent.length === 0)
    {        
        tabcontent = document.getElementsByClassName("m_tabcontent");
    }

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
    document.getElementById("btn_refresh").addEventListener("click",function() {Refresh()})   
    document.getElementById("language").addEventListener("change",function() {Refresh()})   
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
    var mobile = false
    tabcontent = document.getElementsByClassName("tabcontent");
    if(tabcontent.length === 0)
    {        
        mobile = true
    }
    var imgs = document.getElementsByClassName("dynamicImage")
    while(imgs.length > 0) {
        imgs[0].parentNode.removeChild(imgs[0]);  
    }

    name = name.replace("`","'")
    name = name.replace("’","'")
    var nameWithHyphens = name.replace(" ","-").toLowerCase();
    var nameWithoutHyphens = name.replace("-"," ").toLowerCase()    
    var nameReplaceAnd = name.replace("and", "&").toLowerCase()
    var lowerCaseName = name.toLowerCase();

    var cardsByName = AllCards.filter(cards => 
        cards.Name.toLowerCase() === nameWithHyphens || 
        cards.Name.toLowerCase() === nameWithoutHyphens || 
        cards.Name.toLowerCase() === nameReplaceAnd || 
        cards.Name.toLowerCase() === lowerCaseName.trim() || 
        cards.Name.toLowerCase() === lowerCaseName || 
        cards.Name.toLowerCase().includes(lowerCaseName) ||
        cards.Name.toLowerCase().includes(nameWithHyphens) ||
        cards.Name.toLowerCase().includes(nameWithoutHyphens) ||
        cards.Name.toLowerCase().includes(nameReplaceAnd) ||
        cards.Name.toLowerCase().includes(lowerCaseName.trim()))
    var sortedCardsByName = cardsByName.sort((a,b) => Date.parse(b.ReleaseDate) - Date.parse(a.ReleaseDate))

    for(let i = 0; i < sortedCardsByName.length; i++)
    {
        var dynamicDiv = document.createElement("div");
        dynamicDiv.className += "mySlides fade dynamicImage"
        var imgElem = document.createElement("img");
        var captionElem = document.createElement("div");
        captionElem.className += " slideshowText"
        if(mobile)
        {
            imgElem.className += " m_cardSize"
        }
        else
        {
            imgElem.className += " cardSize"

        }
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