window.onload = function()
{
    this.GetAllSets();
    EventListeners();
    document.getElementById('btn_BySet').click()

}

function GetAllSets()
{
    var apiUrl = 'https://api.pokemontcg.io/v1/sets?&pageSize=1000';
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                var select = document.getElementById("setName")
                data.sets.sort((a,b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate))
                for(index in data.sets) {
                    select.options[select.options.length] = new Option(data.sets[index].name + " (" +data.sets[index].ptcgoCode + ")", data.sets[index].code);
                }
            }).catch(err => {
                console.log(err)
            });
}

function GetAllCardsInSetNoParam()
{
    var setCode = document.getElementById("setName");
    GetAllCardsInSet(setCode.value)
}

function GetAllCardsInSet(setCode)
{
    var apiUrl = 'https://api.pokemontcg.io/v1/cards?setCode='+setCode+'&pageSize=1000';
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                var select = document.getElementById("cardName")
                data.cards.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                select.options.length = 0;
                for(index in data.cards) {
                    select.options[select.options.length] = new Option(data.cards[index].name + " (" + data.cards[index].number + ")", data.cards[index].id);
                }
                GetSpecificCard(data.cards[0].id)
            }).catch(err => {
                console.log(err)
            });
}

function GetSpecificCardNoParam()
{
    var cardId = document.getElementById("cardName");
    GetSpecificCard(cardId.value)
}

function GetSpecificCard(id)
{
    var apiUrl = 'https://api.pokemontcg.io/v1/cards?id='+id;
    fetch(apiUrl).then(response => {
    return response.json();
    }).then(data => {
        var img = document.getElementById("cardImage")
        img.src = data.cards[0].imageUrlHiRes
        //CheckMagnifyingGlass()
    }).catch(err => {
        console.log(err)
    });
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
    //document.getElementById("chk_mgnfy_Glass").addEventListener("change",function() {CheckMagnifyingGlass()})   
    document.getElementById("btn_searchCardByName").addEventListener("click",function() {GetCardsForSlideShowNoParam()})
    document.getElementById("txt_cardName").addEventListener("keyup",function() {GetCardsForSlideShowNoParamEnter(event)})
    document.getElementById("prevSlide").addEventListener("click",function() {plusSlides(-1)})
    document.getElementById("nextSlide").addEventListener("click",function() {plusSlides(1)})
}

function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
  
    /* Create magnifier glass: */
    if(!document.getElementById("magnify_glass"))
    {
        glass = document.createElement("DIV");
        glass.setAttribute("class", "img_magnifier_glass");
        glass.setAttribute("id","magnify_glass")
        /* Insert magnifier glass: */
        img.parentElement.insertBefore(glass, img);
  
  
        /* Set background properties for the magnifier glass: */
        glass.style.backgroundImage = "url('" + img.src + "')";
        glass.style.backgroundRepeat = "no-repeat";
        glass.style.backgroundSize = (img.width  * zoom) + "px " + (img.height * zoom) + "px";
        bw = 3;
        w = glass.offsetWidth / 2;
        h = glass.offsetHeight / 2;
      
        /* Execute a function when someone moves the magnifier glass over the image: */
        glass.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("mousemove", moveMagnifier);
      
        /*and also for touch screens:*/
        glass.addEventListener("touchmove", moveMagnifier);
        img.addEventListener("touchmove", moveMagnifier);
    }
    

    function moveMagnifier(e) {
      var pos, x, y;
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /* Prevent the magnifier glass from being positioned outside the image: */
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
      if (x < w / zoom) {x = w / zoom;}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
      if (y < h / zoom) {y = h / zoom;}
      /* Set the position of the magnifier glass: */
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /* Display what the magnifier glass "sees": */
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
  
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
}

function CheckMagnifyingGlass()
{   
    var useMagnify = document.getElementById("chk_mgnfy_Glass").checked
    if(useMagnify)
    {
        magnify("cardImage",2);
        document.getElementById("magnify_glass").style.display = "block";
    }
    else
    {
        document.getElementById("magnify_glass").style.display = "none";
    }
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

    var apiUrl = 'https://api.pokemontcg.io/v1/cards?name='+name+'&pageSize=1000';
    fetch(apiUrl).then(response => {
    return response.json();
    }).then(data => {
        data.cards.sort((a,b) => a.set - b.set)
        for(index in data.cards) {
            var dynamicDiv = document.createElement("div");
            dynamicDiv.className += "mySlides fade dynamicImage"
            var imgElem = document.createElement("img");
            var captionElem = document.createElement("div");
            captionElem.className += " slideshowText"
            imgElem.className += " cardSize"
            imgElem.src = data.cards[index].imageUrlHiRes
            captionElem.innerHTML = data.cards[index].set
            document.getElementById("slideshow").appendChild(dynamicDiv);
            dynamicDiv.appendChild(imgElem);
            dynamicDiv.appendChild(captionElem);
        }

        showSlides(1)

    }).catch(err => {
        console.log(err)
    });
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