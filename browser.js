
function PublishForm(form, url) {

  function sendMessage(message) {
    fetch(url, {
      method: 'POST',
      body: message
    });
  }

  form.onsubmit = function() {
    var d = new Date();
    var n1 = d.getHours();
    var n2 = d.getMinutes();
    console.log(form.message.value)
    colo=document.querySelector('.kol').innerText
    
    let y1=form.message.value.replaceAll(':d', '<img src="./icons/hd.png">')
    let y2=y1.replaceAll(':)', '<img src="./icons/hp.png">')
    let y3=y2.replaceAll(':(', '<img src="./icons/sd.png">')
    let y4=y3.replaceAll(':o', '<img src="./icons/wo.png">')
    let y5=y4.replaceAll(':[', '<img src="./icons/si.png">')


    let message = "["+n1+":"+n2+"]<div class='t' style='color:"+colo+";'>"+document.querySelector(".txt").value+':</div> '+y5+"<p></p>";
    if (message) {
      sendMessage(message);
    }
    return false;
  };
}

function SubscribePane(elem, url) {

  function showMessage(message) {
    let messageElem = document.createElement('div');
    messageElem.innerHTML=message;
    elem.append(messageElem);
    const container =
      document.querySelector('#main');
      const ps = new
      PerfectScrollbar(container, {
      
      supperessScrollX: true
      });
      ps.update();
  }

  async function main() {
    let response = await fetch(url);

    if (response.status == 502) {
      await main();
    } else if (response.status != 200) {
      showMessage(response.statusText);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await main();
    } else {
      const container =
      document.querySelector('#main');
      const ps = new
      PerfectScrollbar(container, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20
      });
      ps.update();
      
      // Got message
      let message = await response.text();
      showMessage(message);
      ps.update();
      await main();
      ps.update();
    }
  }

  main();

}