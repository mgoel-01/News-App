const newsForm=document.querySelector(".newsForm");
const searchInput=document.querySelector(".searchInput");
const card=document.querySelector(".card");
const apiKey="fa6a6f8211144d51b47be056a298d7a3";
window.addEventListener("load",async event =>{
    try{
        const topHeadlines= await getNewsData();
        displayNews(topHeadlines);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }
})
newsForm.addEventListener("submit",async event=>{
    event.preventDefault();
    const news=searchInput.value;
    console.log(news);
    if(news){
        try{
            const newsData=await getNewsData(news);
            displayNews(newsData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter something!!");
    }
});
async function getNewsData(news=""){
    let apiUrl="";
    if(news){
        const today= new Date();
        const threeDays= new Date(today);
        threeDays.setDate(today.getDate()-3);
        const formattedDate= threeDays.toISOString().split('T')[0];
        apiUrl=`https://newsapi.org/v2/everything?q=${news}&from=${threeDays}&sortBy=popularity&apiKey=${apiKey}`;
    }
    else{
        apiUrl=`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    }
    const response=await fetch(apiUrl);
    if(!response.ok){
        throw new Error("Could not fetch data");
    }
    return await response.json();
}
function displayNews(newsData){
    // const {articles:[{source:{id,name},author,title,content,publishedAt}]}=newsData;
    card.textContent="";
    card.style.display="flex";
    const {articles}=newsData;
    if(!articles || articles.length===0){
        displayError("No News Found:(");
    }
    let c=0;
    articles.forEach(({source,author,title,content,publishedAt,url,urlToImage}) => {
        const newsCard=document.createElement("div");
        const authorDisplay=document.createElement("div");
        const titleDisplay=document.createElement("h2");
        const contentDisplay=document.createElement("p");
        const urlDisplay=document.createElement("a");
        const img=document.createElement("img");
        const publishedAtDisplay=document.createElement("p");
        const idDisplay=document.createElement("div");
        const nameDisplay=document.createElement("div");
         
        urlDisplay.href=url;
        img.src=urlToImage;
        img.alt=title;

        const date=new Date(publishedAt).toLocaleString();

        idDisplay.textContent=`ID: ${source.id}`;
        nameDisplay.textContent=`Name: ${source.name}`;
        authorDisplay.textContent=`Author: ${author}`;
        titleDisplay.textContent=`${title}`;
        contentDisplay.textContent=`${content}`;
        urlDisplay.textContent="Read Full Article";
        publishedAtDisplay.textContent=`Published At: ${date}`;
        
        urlDisplay.target="_blank";
        newsCard.classList.add("newsCard");
        idDisplay.classList.add("idDisplay","rightDisplay");
        nameDisplay.classList.add("nameDisplay","rightDisplay");
        authorDisplay.classList.add("authorDisplay","rightDisplay");
        titleDisplay.classList.add("titleDisplay");
        contentDisplay.classList.add("contentDisplay");
        urlDisplay.classList.add("urlDisplay");
        img.classList.add("contentDisplay");
        
        publishedAtDisplay.classList.add("publishedAtDisplay");
        newsCard.appendChild(titleDisplay);
        newsCard.appendChild(contentDisplay);
        newsCard.appendChild(img);
        newsCard.appendChild(urlDisplay);
        newsCard.appendChild(publishedAtDisplay);
        newsCard.appendChild(authorDisplay);
        newsCard.appendChild(idDisplay);
        newsCard.appendChild(nameDisplay);
        card.appendChild(newsCard);
    });
}
function displayError(message){
    const errorDisplay=document.createElement("p");
    errorDisplay.textContent=message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent="";
    card.style.display="flex";
    card.appendChild(errorDisplay);
}