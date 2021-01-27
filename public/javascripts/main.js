// var request = require('request');
const $inputSearch = $('#input-search');
const $domainvalue = $('#cusSelectboxValue');
const $domain = $('#cusSelectbox');
const $results = $('#results');
const $recommendlink = $('#recommendlink');
const $recommendkey = $('#recommendkey');
const $loader = $('#loader');
const $btnPrev = $('#btn-prev');
const $btnNext = $('#btn-next');
const $pagination = $('#pagination');
const $imgSearch = $('#img-search');
const $Searchkey = $('#searchkey');
const $imgClose = $('#img-close');
const $imgCse = $('#img-cse');
const $imglogooutside = $('#logo-outside');
const $hotlink = $('.top-detail');
const $autocomplete = $('#input-searchautocomplete-list');
var currentPage = 'home';
var data;

const updatePagination = () => {
  $pagination.css('display', 'block');
  if (data.nextPage)
    $btnNext.removeClass('disabled');
  else
    $btnNext.addClass('disabled');
  if (data.previousPage)
    $btnPrev.removeClass('disabled');
  else
    $btnPrev.addClass('disabled');
}

const cse = (q, start) => {
  q = q.trim();
  $.get('/search', { q, start }).done(_data => {
    data = _data;
    $loader.css('display', 'none');
    $recommendkey.css('display', 'block');
    $recommendkey.css('visibility', 'visible');
    $recommendlink.css('display', 'block');
    $recommendlink.css('visibility', 'visible');
    if (data) {
      $results.html(`<li class="total">Đã tìm được ${data.totalResults} kết quả trong ${data.time} giây.</li>`);
      data.items.map(o => {
        $results.append(`
            <li class="item">
              <a target="_blank" href="${o.link}"  onclick="getLink('${data.q}','${o.link}','${o.title}')" class="title" id="vegar">${o.title}</a>         
            <div class="snippet">${o.link}</div>
              <div class="snippet">${o.snippet}</div>              
            </li>
        `);
        updatePagination();
      });
    } else {
      $pagination.css('display', 'none');
      $results.html(`<li class="total">Không tìm thấy kết quả.</li>`);
    }
  })
    .fail(err => console.log(err))
}

(() => {
  const updateViewOnSearch = () => {
    currentPage = 'result-page';
    $results.html('');
    $recommendkey.css('display', 'none');
    $recommendkey.css('visibility', 'hidden');
    $recommendlink.css('display', 'none');
    $recommendlink.css('visibility', 'hidden');
    $pagination.css('display', 'none');
    $loader.css('display', 'block');
    $imgClose.css('display', 'block');
    $inputSearch.css('width', '88.5%');
    $inputSearch.css('float', 'right');
    $inputSearch.css('margin-top', '0.2%');
    $inputSearch.css('margin-left', '0%');
    $domain.css('margin-top', '0.2%');
    $domain.css('margin-left', '11.5%');
    $imgSearch.css('margin-top', '1.7%');
    $imgSearch.css('right', '1%');
    $imgClose.css('margin-top', '1.7%');
    $imgClose.css('right', '3%');
    $imglogooutside.css('position', 'relative');
    $imglogooutside.css('width', '10%');
    $imglogooutside.css('left', '5%');
    $imglogooutside.css('margin-top', '1.8%');
    $imglogooutside.css('float', 'left');
    $autocomplete.css('margin-top', '20px');
    $autocomplete.css('width', '20%');
    $recommendlink.css('display', 'block');
    $recommendlink.css('float', 'right');
    $recommendlink.css('width', '30%');
    $recommendkey.css('display', 'block');
    $recommendkey.css('float', 'right');
    $recommendkey.css('width', '30%');
    $recommendkey.css('margin-left', '0%');
    $recommendkey.css('margin-top', '0%');
    $hotlink.css('display', 'none');
  }
  $inputSearch.on('input', (e) => {
    if ($inputSearch.val() != '') {
      $imgClose.css('display', 'block');
    }
    else
      $imgClose.css('display', 'none');
  })


  $imgSearch.click(() => {
    const q = $domainvalue.val() + " " + $inputSearch.val();
    if (!q || q === '') return;
    updateViewOnSearch();
    cse(q);
  })
  $btnNext.click(() => {
    updateViewOnSearch();
    cse(data.q, data.nextPage);
  });
  $btnPrev.click(() => {
    updateViewOnSearch();
    cse(data.q, data.previousPage);
  })
  $imgClose.click(() => {
    data = null;
    $inputSearch.val('');
    $imgClose.css('display', 'none');
  })
  $inputSearch.keyup(function () {
    if (currentPage == 'result-page') {
      $('#input-searchautocomplete-list').addClass('margrin-top-cus');
    }
  });

  function onInit() {
    var q = $inputSearch.val();
    if (q && q != '') {
      updateViewOnSearch();
      cse(q);
    }
  }
  onInit();
})();

function getLink(value, link, title) {
  let dateT = new Date(Date.now());
  $.post("http://localhost:1239/links",
    {
      "value": value,
      "link": link,
      "title": title,
      "date": dateT
    },
    function (data, status) {
    }).fail(function () {
      alert("loi ket noi toi server");
    });
};

function getDate() {
  let today = new Date(Date.now());
  let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let d = date + ' ' + time;
  return d;
}

const updateViewOnSearch = () => {
  currentPage = 'result-page';
  $results.html('');
  $recommendkey.css('display', 'none');
  $recommendkey.css('visibility', 'hidden');
  $recommendlink.css('display', 'none');
  $recommendlink.css('visibility', 'hidden');
  $pagination.css('display', 'none');
  $loader.css('display', 'block');
  $imgClose.css('display', 'block');
  $inputSearch.css('width', '88.5%');
  $inputSearch.css('float', 'right');
  $inputSearch.css('margin-top', '0.2%');
  $inputSearch.css('margin-left', '0%');
  $domain.css('margin-top', '0.2%');
  $domain.css('margin-left', '11.5%');
  $imgSearch.css('margin-top', '1.7%');
  $imgSearch.css('right', '1%');
  $imgClose.css('margin-top', '1.7%');
  $imgClose.css('right', '3%');
  $imglogooutside.css('position', 'relative');
  $imglogooutside.css('width', '10%');
  $imglogooutside.css('left', '5%');
  $imglogooutside.css('margin-top', '1.8%');
  $imglogooutside.css('float', 'left');
  $autocomplete.css('margin-top', '20px');
  $autocomplete.css('width', '20%');
  $recommendlink.css('display', 'block');
  $recommendlink.css('float', 'right');
  $recommendlink.css('width', '30%');
  $recommendkey.css('display', 'block');
  $recommendkey.css('float', 'right');
  $recommendkey.css('width', '30%');
  $recommendkey.css('margin-left', '0%');
  $recommendkey.css('margin-top', '0%');
  $hotlink.css('display', 'none');
}

const updateViewOnTop = () => {
  currentPage = 'result-page';
  $results.html('');
  $recommendkey.css('display', 'block');
  $recommendkey.css('visibility', 'visible');
  $recommendlink.css('display', 'block');
  $recommendlink.css('visibility', 'visible');
  $pagination.css('display', 'none');
  $imgClose.css('display', 'block');
  $inputSearch.css('width', '88.5%');
  $inputSearch.css('float', 'right');
  $inputSearch.css('margin-top', '0.2%');
  $inputSearch.css('margin-left', '0%');
  $domain.css('margin-top', '0.2%');
  $domain.css('margin-left', '11.5%');
  $imgSearch.css('margin-top', '1.7%');
  $imgSearch.css('right', '1%');
  $imgClose.css('margin-top', '1.7%');
  $imgClose.css('right', '3%');
  $imglogooutside.css('position', 'relative');
  $imglogooutside.css('width', '10%');
  $imglogooutside.css('left', '5%');
  $imglogooutside.css('margin-top', '1.8%');
  $imglogooutside.css('float', 'left');
  $autocomplete.css('margin-top', '20px');
  $autocomplete.css('width', '20%');
  $recommendlink.css('display', 'block');
  $recommendlink.css('float', 'left');
  $recommendlink.css('width', '40%');
  $recommendkey.css('display', 'block');
  $recommendkey.css('float', 'right');
  $recommendkey.css('width', '40%');
  $recommendkey.css('margin-top', '-50%');
  $hotlink.css('display', 'none');
}

function _searchkey(q) {
  updateViewOnSearch();
  cse(q);
  document.getElementById("input-search").value = q;
}

const gettopkey = (nametopkey) => {
  $.get('/topkey', { nametopkey }).done(_data => {
    const list = _data;
    $recommendkey.html(`<li class="total">Top 10 Từ Khóa | <a onclick="gettopkey('topkeyweek')" class="title" id="searchkey">Tuần</a>	| <a onclick="gettopkey('topkeymonth')" class="title" id="searchkey">Tháng</a>	| <a onclick="gettopkey('topkeyyear')" class="title" id="searchkey">Năm</a>	| <a onclick="gettopkey('topkeyall')" class="title" id="searchkey">Tất cả</a></li>`);
    $.each(list, function (index, value) {
      $recommendkey.append(`
      <li class="item">#${value[2]} 
      <a onclick="_searchkey('${value[0]}')" class="title" id="searchkey">${value[0]}</a>
  </li>
      `);
    });
  })
    .fail(err => console.log("err:", err))
}

const gettoplink = (nametoplink) => {
  $.get('/toplink', { nametoplink }).done(_data => {
    const list = _data;
    $recommendlink.html(`<li class="total">Top 10 Link | <a onclick="gettoplink('toplinkweek')" class="title" id="searchkey">Tuần</a> | <a onclick="gettoplink('toplinkmonth')" class="title" id="searchkey">Tháng</a>	| <a onclick="gettoplink('toplinkyear')" class="title" id="searchkey">Năm</a>	| <a onclick="gettoplink('toplinkall')" class="title" id="searchkey">Tất cả</a></li>`);
    $.each(list, function (index, value) {
      $recommendlink.append(`
      <li class="item">#${value[3]} 
      <a target="_blank" href="${value[0]}" onclick="getLink('','${value[0]}','${value[2]}')" class="title" id="vegar">${value[2]}</a>
  </li>
      `);
    });
  })
    .fail(err => console.log("err:", err))
}

gettopkey("topkeyall");
gettoplink("toplinkall");  
