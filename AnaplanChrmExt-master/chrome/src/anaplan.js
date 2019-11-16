const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function getAnaplanData() {
  return JSON.stringify(eval("anaplan"), getCircularReplacer());
}

function getModuleData(callback) {
  const hrefURL = new URL(window.location.href);
  const workspaceId = hrefURL.searchParams.get("selectedWorkspaceId");
  const moduleId = hrefURL.searchParams.get("selectedModelId");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  const url = '/extensions/0/2/workspaces/' + workspaceId + '/models/' + moduleId + '/modules';
  xhttp.open("GET", url, true);
  xhttp.send();
}

function getUserRoleData() {

  try {
    return eval("anaplan.data.ModelContentCache._userInfo.loggedInUserWorkspaceRole");
  } catch (ex) {}
  try {
    return eval("anaplan.common.SelectiveAccess._userInfo._userInfo.loggedInUserWorkspaceRole");
  } catch (ex) {}
  return '';
}


function loadData() {
  const fakeDiv = document.getElementById("anadata-load-div");
  const data = getAnaplanData();
  if (data) {
    fakeDiv.setAttribute('target-data', data);
  }
  const userData = getUserRoleData();
  if (userData) {
    fakeDiv.setAttribute('target-user', userData);
  }

  getModuleData((res) => {
    const data = res;
    console.log(data);
    if (data) {
      fakeDiv.setAttribute('target-moduledata', data);
    }
  });




}
if (!document.getElementById("anadata-load-div")) {
  const fakeDiv = document.createElement("Div");
  fakeDiv.setAttribute("id", "anadata-load-div");
  fakeDiv.setAttribute("style", "display:none");
  fakeDiv.setAttribute("onclick", "loadData()");
  document.getElementsByTagName('body')[0].appendChild(fakeDiv);
  // loadData();
}