const fs = require('fs');
window.$ = window.jQuery = require('jquery-serializejson')
window.$ = window.jQuery = require('jquery')

const SECRET = "src/secret.json"



function makeTable(){
  $( 'table > tbody' ).empty()  
  const data = loadJSON(SECRET)

  for (var key in data){
    for (var entry in data[key]){
      var username = data[key][entry]["username"]
      var email = data[key][entry]["email"]
      var password = data[key][entry]["password"]
      var id = data[key][entry]["id"]
      $('table > tbody:last-child').append(`
        <tr>
          <td>${key}</td>
          <td>${username}</td>
          <td>${email}</td>
          <td>${password}</td>
          <td><button class="uk-button uk-button-default" type="button" href='#modal-update-${key}-${id}' uk-toggle > EDIT </button></td>
        </tr>
      `)
      $('body').append(updateModal(key, id, username, email, password))
    }
  }
}

function updateModal(service, id, username, email, password){
  // console.log(service, id, username, email, password)
  return `<div id="modal-update-${service}-${id}" uk-modal>
  <div class="uk-modal-dialog">
      <button class="uk-modal-close-default" type="button" uk-close></button>
  <div class="uk-modal-header">
      <h2 class="uk-modal-title lobby-text">update entry</h2>
  </div>
  
  <div class="uk-modal-body uk-text-center">    
    <form action="#" id="form-update" onsubmit="return updateEntry(this, '${service}', ${id})"> 
      <div class="uk-margin">
              <div class="uk-inline">
                  <span class="uk-form-icon" uk-icon="icon: user"></span>
                  <input class="uk-input" type="text" name="service" placeholder="service" value="${service}">
              </div>
      </div>

      <div class="uk-margin">
              <div class="uk-inline">
                  <span class="uk-form-icon" uk-icon="icon: user"></span>
                  <input class="uk-input" type="text" name="username" placeholder="username" value="${username}">
              </div>
      </div>

      <div class="uk-margin">
              <div class="uk-inline">
                  <span class="uk-form-icon" uk-icon="icon: user"></span>
                  <input class="uk-input" type="email" name="email" placeholder="email" value="${email}">
              </div>
      </div>

      <div class="uk-margin">
              <div class="uk-inline">
                  <span class="uk-form-icon uk-form-icon" uk-icon="icon: lock"></span>
                  <input class="uk-input" type="password" name="password" placeholder="password" value="${password}">
              </div>
      </div>

      <div class="uk-modal-footer uk-text-center">
        <input class="uk-button lobby-button" type="submit" id="updateform" value="Submit"></input><br>
      </div>                                                              
    </form>
    <button class="uk-button uk-button-default" type="button" onClick="return removeEntry('${service}', ${id})" uk-close > REMOVE </button>
  </div>
  </div>
</div>`
}
function togglePassword(){
  var psw = document.getElementById("password").type
  if(psw=='password')
    psw.type = "text"
  else
    psw.type = "password"
}

function newEntry(form){
  var formData = $( form ).serializeJSON()
  var jsonData = loadJSON(SECRET)
  var service = formData['service'].toUpperCase()
  delete formData.service

  if (service in jsonData){
    var id = jsonData[service][jsonData[service].length-1]["id"]
    formData.id = id+1
    jsonData[service].push(formData)
  }
  else{
    jsonData[service] = [formData]
    jsonData[service][0].id = 0
  }

  saveJSON(SECRET, jsonData)
  $( form ).trigger.reset()
  makeTable()
  return false
}

function updateEntry(form, service, id ){
  var jsonData = loadJSON(SECRET)
  var formData = ($( form ).serializeJSON())
  var key = formData['service'].toUpperCase()
  delete formData.service

  formData.id = id
  if(key == service)
    jsonData[service][id] = formData
  else{
    newEntry(form)
    return false
  }
  saveJSON(SECRET, jsonData)
  makeTable()
  return false
}

function removeEntry(service, id){
  var jsonData = loadJSON(SECRET)
  if (jsonData[service].length == 1){
    delete jsonData[service]
    saveJSON(SECRET, jsonData)
    makeTable()
    return false
  }
  jsonData[service].splice(id, 1)
  saveJSON(SECRET, jsonData)
  makeTable()
  return false
}

function loadJSON(filename) {
  return JSON.parse(
    fs.existsSync(filename)
      ? fs.readFileSync(filename).toString()
      : '{}'
  )
}

function saveJSON(filename, json){
  return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
}