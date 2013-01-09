
window.onload = function() {

  // globals

  var uri = '', current_uri = '';

  // support functions

  var id = function(id) { return document.getElementById(id); };

  var html_encode = function(str) {
    return str.replace(/[&<>"']/g, function($0) {
      return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    });
  };

  var htm = function(str, target) {
//    id('text').value = str;
    var json = /\s*<!--\s*([\s\S]*?)\s*-->\s*/mgi.exec(str);
    if (json instanceof Array && typeof json[1] === 'string') {
console.log('json='+json[1])
      var text = /<!--[\s\S]*-->\s*([\s\S]*)\s*$/mgi.exec(str);
      if (text instanceof Array && typeof text[1] === 'string') {
console.log('text='+text[1])
//        id('text').value = json[1] + text[1];
//        id('text').value = str;
        if (id(target)) id(target).innerHTML = marked(text[1]);
      }
      var o = JSON.parse(json[1]);
      Object.keys(o).forEach(function(k) {
        if (k === 'script') {
          eval(o[k]);
        } else if (k === 'prepend') {
console.log("prepend="+target)
          var tmp = id(target).innerHTML;
          tmp = o[k] + tmp;
          id(target).innerHTML = tmp;
        } else if (k === 'append') {
console.log("append="+target)
          var tmp = id(target).innerHTML;
          tmp += o[k];
          id(target).innerHTML = tmp;
        } else if (k === 'alert') {
          alert(o[k]);
        } else {
//console.log("id(k)="+id(k))
          if (id(k)) id(k).innerHTML = o[k];
        }
      });
    } else {
//      id('text').value = str;
      if (id(target)) id(target).innerHTML = marked(str);
    }
  }

  window.onpopstate = function(e) {
    if (e.state !== null) {
      var state = e.state || {};
      if ('id' in state) {
        get(location, state.id, function() {
          var el = id(state.id);
          if (el.previousElementSibling.nodeName === 'A'
           && el.previousElementSibling.classList.contains('tree')) {
            if (el.previousElementSibling.classList.contains('open'))
              el.previousElementSibling.classList.remove('open');
            else
              el.previousElementSibling.classList.add('open');
          }
        });
      }
    }
  }

  var get = function(url, target, callback) {
    url = url || location;
    target = target || 'view';
console.log("get("+url+", "+target+", "+callback+")")
    if (url.hostname != location.hostname) {
      location = url;
      return false;
    }
    var newpath = '',
        urlpath = url.pathname;

    current_uri = urlpath;
    document.title = urlpath;
    history.pushState({id:target}, '', urlpath);

    if (urlpath.match(/^\/\d+$/)) {
      newpath = ['/lib/htm', urlpath, '.htm'].join('').replace(/\/\//g, '/');
    } else if (urlpath.match(/^\/.+$/)) {
      newpath = ['/lib/md', urlpath, '.md'].join('').replace(/\/\//g, '/');
    } else {
      newpath = 'README.md';
    }
    var cached = localStorage.getItem(urlpath);
    if (cached) {
      htm(cached, target);
      if (typeof callback === 'function') callback(target);
      return false;
    } else {
      var xhr = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          localStorage.setItem(urlpath, xhr.responseText);
          htm(xhr.responseText, target);
          if (typeof callback === 'function') callback(target);
          return false;
        }
      }
      xhr.open('GET', newpath, true); xhr.send();
    }
  }

  id('nav').onclick = function(e) {
console.log("NAV="+e.target)
    if (e.target.pathname == '/clear')
      localStorage.clear();
    else
      get(e.target);
    return false;
  };

  id('view').onclick = function(e) {
    var t = e.target;
    if (t.classList.contains('tree')) {
console.log("t.classList.contains(tree)")
      var i = t.pathname.replace(/(\/|\.|-)/g, '_').toLowerCase();
      if (t.classList.contains('cached')) {
        t.classList.toggle('open');
      } else {
//alert("t="+t+", i="+i)
        get(t, i, function() {
          t.classList.toggle('open');
          t.classList.add('cached');
          return false;
        })
      }
      return false;
    }
console.log("view.onclick fallthrough")
  };

  get();

};
