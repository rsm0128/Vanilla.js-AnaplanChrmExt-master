import * as $ from "jquery";
import { AnaplanLoadController } from '../../angular/src/app/services/anaplanload.controller'
import { AnaWorkspace } from "../../angular/src/app/models/anaplanmodel";
import { IdbController } from '../../angular/src/app/services/idb.controller';
import { MessageModel } from './model';
import ANAPLAN_CONST from '../../angular/src/app/services/varconstant';

$(document).ready(() => {
  console.log('ready');
  onInit();

  function onInit() {
    hideAllDiv();
    $('#mainTab').show();
  }

  const showMessage = (message, messageType = 'info', closeLinkId = '#mainTab', confirmLinkProp = null) => {
    hideAllDiv();
    $('#messageContent').html(message.split('\n').join('<br>'));
    $('#messageCloseBtn').val(closeLinkId);
    switch (messageType) {
      case 'warning':
        $('#messageTab').attr("class", "alert alert-warning");
        break;
      case 'info':
        $('#messageTab').attr("class", "alert alert-info");
        break;

      case 'danger':
        $('#messageTab').attr("class", "alert alert-danger");
        break;
      case 'success':
        $('#messageTab').attr("class", "alert alert-success");
        break;
    }
    if (confirmLinkProp) {
      $('#messageAction').show();
      if (confirmLinkProp.callback) {
        $('#messageAction').bind('click', () => {
          confirmLinkProp.callback();
        });
      }
    } else {
      $('#messageAction').hide();
    }
    $('#messageTab').show();
  }

  $('#messageCloseBtn').bind("click", (evt) => {
    const val = '' + $('#messageCloseBtn').val();
    $(val).show();
    $('#messageTab').hide();
  });

  function hideAllDiv() {

    $('#mainTab').hide();
    $('#historyTab').hide();
    $('#messageTab').hide();
    $('#messageAction').hide();
  }
  $('#reportBtn').bind("click", function (event) {
    const idxDBCtrler = new IdbController();
    idxDBCtrler.checkEmptyRepo().then((res) => {
      if (res) {
        chrome.tabs.create({
          url: 'index.html'
        })
      } else {
        showMessage('Please save the shapshot first', 'info');
      }
    })
  });
  $('#optimizationBtn').bind("click", function (event) {
    showMessage('Comming soon', 'info');
  });
  $('#snapshotBtn').bind("click", function (event) {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true }, function (tabs) {
      const message: MessageModel = {
        from: 'popup',
        to: 'content',
        msg: 'Role',
        content: 'User Role Check',
      }
      console.log(message);
      chrome.tabs.sendMessage(
        tabs[0].id,
        message,
        (reply: MessageModel) => {
          if (reply && reply.content) {
            if (reply.content === 'ADMIN') {
              functionLoadAnaplanData();
            } else {
              const message = 'Sorry, you should be Workspace Administrator to use this extension.';
              showMessage(message, 'warning');
            }
          } else {
            const message = 'Sorry, you should be positionned on an Anaplan model to take a Snapshot.';
            showMessage(message, 'warning');
          }
        });
    });
  });
  $('#historyBtn').bind("click", function (event) {
    hideAllDiv();
    loadHistoryTable();
    $('#historyTab').show();
  });

  $('#takeSnapShot').bind('click', (eve) => {
    $('#snapshotBtn').click();
  })
  function loadHistoryTable() {
    let data = [{
      date: '31/12/18',
      content: 'IF A=B THEN C'
    }, {
      date: '31/12/18',
      content: 'IF A=B THEN C'
    }]
    let dataHtml = '';
    for (let datum of data) {
      dataHtml += '<tr>'
      dataHtml += '<td>' + datum.date + '</td>'
      dataHtml += '<td>' + datum.content + '</td>'
      dataHtml += '</tr>'
    }
    $('#historyTbd').html(dataHtml);
  }

  $('#takeGoback').bind('click', () => {
    hideAllDiv();
    $('#mainTab').show();
  })
  $("#histsearchin").keyup(function () {
    const data = $('#histsearchin').val();
    console.log(data);
    if (data) {
      $('#navbarDropdownMenuLink').addClass('show');
    } else {
      $('#navbarDropdownMenuLink').removeClass('show');

    }
  });

  $('#navbarDropdownMenuLink').click((evt) => {
    const searchVal = evt.target.nodeValue;
    console.log(searchVal);
    console.log(evt);
    $('#histsearchin').val(searchVal);
    $('#navbarDropdownMenuLink').removeClass('show');
  });

  function functionLoadAnaplanData() {
    // const location = 'https://us1a.app.anaplan.com/core3006/anaplan/framework.jsp?selectedWorkspaceId=8a81b08e5054334f01514272df446a5f&selectedModelId=210092B897E34A4DB5451A97CF597395';
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      // ...and send a request for the DOM info...
      console.log('-------- tabs ----------');
      console.log(tabs);
      if (tabs && tabs.length === 1) {
        const message: MessageModel = {
          from: 'popup',
          to: 'content',
          msg: 'AnaplanInfo',
          content: 'load Data',
        }
        chrome.tabs.sendMessage(
          tabs[0].id, message,
          (reply: any) => {
            console.log('------------ content page reply ------- ');
            console.log(reply);
            if (reply && reply.from && reply.to && reply.msg
              && reply.from === 'content'
              && reply.msg == 'anaplanData'
              && reply.to == 'popup'
            ) {

              const url = reply.content.url;
              const params = (new URL(url)).searchParams;
              const selectedWorkspaceId = params.get('selectedWorkspaceId');
              const selectedModelId = params.get('selectedModelId');
              console.log("selectedWorkspaceId :" + selectedWorkspaceId);
              console.log("selectedModelId :" + selectedModelId);
              const content = JSON.parse(reply.content.data);

              loadAnaPlanData(content, selectedWorkspaceId, selectedModelId);
            } else {
              console.log('no snapshot data');
            }
          });
      } else {
        showMessage('✕ Error. No Active Window or Tabs.', 'danger');
      }
    });
  }


  function loadAnaPlanData(anadata, wsid, mdid) {

    const anaController = new AnaplanLoadController();
    anaController.loadFromAnaplan(anadata, wsid, mdid)
      .then(async (res) => {
        try {
          const idxDBCtrler = new IdbController();
          let ws: AnaWorkspace = new AnaWorkspace();
          ws = Object.assign(ws, res);

          const saveRlt = await idxDBCtrler.saveWorkspaceData(ws);
          anaController.saveWSInfoToLocalStorage(ws.code, ws.model.code, saveRlt.snapshoId);
          const msg = '✓ Snapshot was correctly saved.\n\n ∙ Workspace: ' + ws.code + '\n ∙ Model: ' + ws.model.code + '\n ∙ Snapshot: ' + saveRlt.snapshotVersion;
          showMessage(msg, 'success', '#mainTab', {
            res: 'success', callback: (() => {
              $('#reportBtn').click();
            })
          });

        } catch (err) {
          console.log(err);
          showMessage('✕ Error. Snapshot was not saved.', 'danger');
        }
      }, (err) => {
        console.log(err);
        showMessage('✕ Error. Anaplan Data Parse Error!.', 'danger');
        return null;
      });
  }

})