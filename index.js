
const externalHostname = "https://static-links-page.signalnerve.workers.dev/static/html"

const redirectMap = new Map([
  ["/", externalHostname],
  ["/links", "json"],
])

const socialLinkData =[
  {name: "github", url: "https://www.github.com/Geneveroth"},
  {name: "linkedin", url: "https://www.linkedin.com/in/sam-black-he-him-8281b825/"},
  {name: "facebook", url: "https://www.facebook.com/sam.hicks.9638"},
  {name: "stackoverflow", url: "https://stackoverflow.com/users/12902241/sam-black"}
]
const linkData =[
  {name: "Massively OP", url: "https://www.massivelyop.com/"},
  {name: "Etsy", url: "https://www.etsy.com/shop/TheInfernalFarmhouse"},
  {name: "Cloudflare", url: "https://www.cloudflare.com"}
]

async function handleRequest(request) {
  const requestURL = new URL(request.url)
  const path = requestURL.pathname;
  const location = redirectMap.get(path)

  if (location === "json") {
    linkDataJson = JSON.stringify(linkData, null, 2);
    return new Response(linkDataJson, { 
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  }
  // If not a json request, display default static page
  else{
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(externalHostname, init)
    const results = await gatherResponse(response)
    var res = new Response(results, init)
    return new HTMLRewriter().on("*", new ElementHandler()).transform(res)
  }
  
}
//== Function for fetch to gather response
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

//===== EVENT LISTENER
addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})



//===== HTML REWRITER

class ElementHandler {
  element(element) {

    if(element.getAttribute('id') == 'links'){
      var data = linksTransformer(linkData, false);
      element.setInnerContent(data, {html: true});
    }
    else if (element.getAttribute('id') == 'profile'){
      element.setAttribute('style', 'display:block')
    }
    else if (element.getAttribute('id') == "avatar"){
      element.setAttribute('src', 'https://live.staticflickr.com/65535/50527146326_ebd6fc0932_n.jpg')
    }
    else if(element.getAttribute('id') == 'social'){
      var data = linksTransformer(socialLinkData, true);
      element.setInnerContent(data, {html:true})
      element.setAttribute('style', 'display:flex')
    }
    else if(element.tagName == 'title'){
      element.setInnerContent('Sam Black');
    }
    else if (element.tagName == 'body'){
      element.setAttribute('style', 'background-color:green')
    }
  }
}

function linksTransformer(data, hasIcons){
    var links = '';
    if(hasIcons){
      data.forEach(element =>{
        var icon = '<img height="32" width="32" src="https://unpkg.com/simple-icons@v3/icons/' + element.name +'.svg" />'
        links += '<a href="'+element.url+'"target="_blank"">'+ icon +'</a>'
        });
    }
    else{
      data.forEach(element =>
        links += '<a href="'+element.url+'"target="_blank"">'+element.name+'</a>'
        );
    }
    
    return links;
}

