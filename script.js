var QUESTION_ARRAY = []

var doubtArea                = document.getElementById('doubtArea'),
    questionArea             = document.getElementById('questionArea'),
    responseArea             = document.getElementById('responseArea'),
// question area elements
    doubtQuestion            = document.getElementById('doubtQuestion'),
    doubtText                = document.getElementById('doubtText'),
    doubtButton              = document.getElementById('doubtButton'),
    // response  area elements
    responseButton           = document.getElementById('responseButton'),
    responses                = document.getElementById('responses'),
    responseQuestionDisplay  = document.getElementById('responseQuestionDisplay'),
    responseTextDisplay      = document.getElementById('responseTextDisplay'),
    responseQuestion         = document.getElementById('responseQuestion'),
    responseText             = document.getElementById('responseText'),
    // other components
    resolve                  = document.getElementById('resolve'),
    search                   = document.getElementById('search')
    
// pre needed things

var QUESTION_LENGTH = QUESTION_ARRAY.length,
    responseOpen    = false;

responseArea.style.display = "none"
getFromLocalStorage()
addQuestions()

// functions


function addQuestions(defaultArray = QUESTION_ARRAY){
    questionArea.innerHTML = ""

    defaultArray.forEach(function(obj){
        var div = document.createElement('div')
        div.className = "bg-light px-3 py-2"
        div.dataset.key = obj.key

        div.addEventListener("click",toggelRight)

        var h5 = document.createElement('h5')
        h5.className = "text-gray pb-0 mb-1"
        h5.innerText = obj.question

        var p = document.createElement('p')
        p.className = "m-0 p-0"
        p.innerText = obj.text

        div.appendChild(h5)
        div.appendChild(p)
        questionArea.appendChild(div)
    })

}

function addResponse(key){
    responses.innerHTML = ""
    QUESTION_ARRAY[key].responses.forEach(function(obj){
        var div = document.createElement('div')
        div.className = "bg-light px-3 py-2"
    
        div.addEventListener("click",toggelRight)
    
        var h5 = document.createElement('h6')
        h5.innerText = obj.user
    
        var p = document.createElement('p')
        p.innerText = obj.text
    
        div.appendChild(h5)
        div.appendChild(p)
        responses.appendChild(div)
    })
}

function toggelRight(){
    if(responseOpen){
        if(this.dataset.key === responseArea.dataset.key){
            responseArea.style.display = "none"
            doubtArea.style.display = "block"
            responseArea.dataset.key = undefined
            responseOpen = false
            return
        }
    }
    doubtArea.style.display = "none"
    responseArea.style.display = "block"
    responseArea.dataset.key = this.dataset.key
    responseOpen = true
    
    responseQuestionDisplay.innerText = this.children[0].innerText 
    responseTextDisplay.innerText = this.children[1].innerText 
    addResponse(this.dataset.key)
    
}

// event Listners
doubtButton.addEventListener('click',function(){
    if(doubtQuestion.value && doubtText.value){
        var obj = {
            key: QUESTION_LENGTH,
            question:doubtQuestion.value,
            text:doubtText.value,
            responses:[]
        }
    
        QUESTION_ARRAY.push(obj)
        QUESTION_LENGTH++
        addQuestions()
        addTOLocalStorage(obj)
    }
})
    
responseButton.addEventListener("click",function(){
    if(responseQuestion.value && responseText.value){
        var obj = {
            text:responseQuestion.value,
            user:responseText.value
        }
        QUESTION_ARRAY[responseArea.dataset.key].responses.push(obj)
        var key = responseArea.dataset.key
        addResponse(key)
        addTOLocalStorage(obj,false,key)
    }
})
    
resolve.addEventListener("click",function(){
    responseArea.style.display = "none"
    doubtArea.style.display = "block"
    responseOpen = false

    QUESTION_ARRAY.splice(responseArea.dataset.key,1)
    QUESTION_LENGTH--
    for(var i=responseArea.dataset.key;i<QUESTION_LENGTH;i++){
        QUESTION_ARRAY[i].key = i
    }
    deleteFromLocalStorage()
    addQuestions()
})

search.addEventListener("input",function(){
    if(search.value === ""){
        addQuestions()
    }
    var searchResult = QUESTION_ARRAY.filter(function(obj){
        if(obj.question.includes(search.value)){
            return true
        }
        return false
    })
    addQuestions(searchResult)
})

// local storage

function getFromLocalStorage(){
    var arr = localStorage.getItem('QUESTION_ARRAY')
    if(arr){
        arr = JSON.parse(arr)
        QUESTION_ARRAY = arr
    }
    else{
        var arr = []
        arr = JSON.stringify(arr)
        localStorage.setItem('QUESTION_ARRAY',arr)
    }
}

function addTOLocalStorage(obj,que = true,key=-1){
    var arr = localStorage.getItem('QUESTION_ARRAY')
    arr = JSON.parse(arr)
    if(que){
        arr.push(obj)
    }
    else{
        if(key === -1){
            alert("unexpected error try contacting developer");
            location.reload()
            return
        }
        else{
            arr[key].responses.push(obj)
        }
    }
    arr = JSON.stringify(arr)
    localStorage.setItem('QUESTION_ARRAY',arr)

    addQuestions()
}

function deleteFromLocalStorage(){
    localStorage.setItem('QUESTION_ARRAY',JSON.stringify(QUESTION_ARRAY))
}