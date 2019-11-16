import { MessageModel } from './model';


function checkAnaplanSite(url: string = window.location.href) {
  const expression = "https?://([a-zA-Z0-9()?=]{0,255}.)app\.anaplan\.[a-zA-Z]{3}\/.{1,500}selectedWorkspaceId=.{1,255}selectedModelId=.{1,255}";
  const regex = new RegExp(expression);
  if (url.match(regex)) {
    console.log("Url matches Successful!");
    return true;
  } else {
    console.log("Url no matches!");
    return false;
  }
}
function checkChromeExt(url: string = window.location.href) {
  const expression = "chrome-extension://";
  const regex = new RegExp(expression);
  if (url.match(regex)) {
    console.log("Url matches Chrome!");
    return true;
  } else {
    return false;
  }
}
function injectJs(link) {
  console.log('--------- injectJs  Start-------');
  const src = document.createElement('script');
  src.type = "text/javascript";
  src.src = link;
  document.getElementsByTagName('body')[0].appendChild(src);
  console.log('--------- injectJs End-------');
}

function getAnaplanVariable() {
  console.log('----***getApaPlanVariable Start***---');
  let data = document.getElementById("anadata-load-div").getAttribute('target-data')
  if (!data) {
    console.log('----***getApaPlanVariable***---');
    document.getElementById("anadata-load-div").click();
    data = document.getElementById("anadata-load-div").getAttribute('target-data')
  }
  console.log('---getApaPlanVariable---');
  return data;
}
function getAnaModuleData() {
  console.log('----***getAnaModule Start***---');
  let data = document.getElementById("anadata-load-div").getAttribute('target-moduledata')
  if (!data) {
    console.log('----***getAnaModule***---');
    document.getElementById("anadata-load-div").click();
    data = document.getElementById("anadata-load-div").getAttribute('target-moduledata')
  }
  console.log('---getAnaModule---');
  return data;
}
function getUserRoleVariable() {
  console.log('----***getUserRoleVariable Start***---');
  let data = document.getElementById("anadata-load-div").getAttribute('target-user')
  if (!data) {
    console.log('----***getUserRoleVariable***---');
    document.getElementById("anadata-load-div").click();
    data = document.getElementById("anadata-load-div").getAttribute('target-user')
  }
  console.log('---getUserRoleVariable---');
  return data;
}
function getAnaPlanInfo(resolve, reject) {
  const reply: MessageModel = {
    from: 'content',
    to: 'popup',
    msg: '',
    content: ''
  }
  const anaPlanInfo = getAnaplanVariable();
  const anaModuleInfo = getAnaModuleData();
  if (anaPlanInfo != null) {
    reply.msg = 'anaplanData';
    reply.content = {
      url: window.location.href,
      data: anaPlanInfo,
      module: anaModuleInfo
    }
    resolve(reply);
  } else {
    reply.msg = 'failed';
    reply.content = 'No anaplan Data';
    console.log('errr-----------');
    reject(reply);
  }
}

function getRoleInfo(resolve, reject) {
  const reply: MessageModel = {
    from: 'content',
    to: 'popup',
    msg: '',
    content: ''
  }
  const userRoleInfo = getUserRoleVariable();

  if (userRoleInfo != null) {
    reply.msg = 'userRole';
    reply.content = userRoleInfo;
    resolve(reply);
  } else {
    reply.msg = 'failed';
    reply.content = 'No anaplan Data';
    console.log('errr-----------');
    reject(reply);
  }
}

chrome.runtime.onMessage.addListener((request, sender, respond) => {
  const handler = new Promise((resolve, reject) => {
    console.log('---------- content page -------------');
    const reply: MessageModel = {
      from: 'content',
      to: 'popup',
      msg: '',
      content: ''
    }

    if (!checkAnaplanSite()) {
      reply.msg = 'failed';
      reply.content = 'Site url is not correct';
      reject(reply);
    }

    if (request) {
      console.log(request);
      switch (request.from) {
        case 'popup':
          switch (request.msg) {
            case 'AnaplanInfo':
              getAnaPlanInfo(resolve, reject);
              break;
            case 'Role':
              console.log('TTTTTTTTTTTT');
              getRoleInfo(resolve, reject);
              break;
            default:
          }
          reject('request is empty.');
      }
      reply.msg = 'pass';
      reply.content = 'not mine'
      resolve(reply);
    } else {
      reject('request is empty.');
    }
  });

  handler.then(message => {
    console.log(message);
    respond(message);
  }).catch(error => {
    console.log(error);
    respond(error);
  });

  return true;
});

function initialize() {
  if (checkAnaplanSite()) {
    injectJs(chrome.runtime.getURL('anaplan.js'));
  }
}

initialize();
