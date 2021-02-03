const $inputSearch = $('#input-search');
const $wrapsearch = $('.wrap-search');
const $domainvalue = $('#cusSelectboxValue');
const $domain = $('#cusSelectbox');
const $results = $('#results');
const $recommendlink = $('#recommendlink');
const $recommendkey = $('#recommendkey');
const $recommendlinkpage = $('#recommendlinkpage');
const $recommendkeypage = $('#recommendkeypage');
const $loader = $('#loader');
const $btnPrev = $('#btn-prev');
const $btnNext = $('#btn-next');
const $pagination = $('#pagination');
const $imgSearch = $('#img-search');
const $Searchkey = $('#searchkey');
const $imgClose = $('#img-close');
const $imgCse = $('#img-cse');
const $logoout = $('#logoout');
const $inputsearchout = $('#inputsearchout');
const $imglogooutside = $('#logo-outside');
const $hotlink = $('.top-detail');
const $autocomplete = $('#input-searchautocomplete-list');
const $wrapsearchin = $('.wrap-search-in');
const $logoin = $('.logoin');
var currentPage = 'home';
var data;

const url_string = window.location.href;
const url = new URL(url_string);
const s = url.searchParams.get("s");
var site = url.searchParams.get("site");
const topurl = url.searchParams.get("top");

// set description
document.getElementsByTagName("meta")[3].outerHTML = '<meta name="description" content="'+ s +' - Tìm Trên Fshare">';


if(s){
  document.title = s + " - Tìm Trên Fshare";
}


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
    $wrapsearchin.css('display', 'block');
    $wrapsearchin.css('visibility', 'visible');
    $logoin.css('display', 'block');
    $logoin.css('visibility', 'visible');
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
  $logoout.css('display', 'none');
  $logoout.css('visibility', 'hidden');
  $inputsearchout.css('display', 'none');
  $inputsearchout.css('visibility', 'hidden');
  $pagination.css('display', 'none');
  $loader.css('display', 'block');
  $imgClose.css('display', 'block');
  $hotlink.css('display', 'none');
  }
  $inputSearch.on('input', (e) => {
    if ($inputSearch.val() != '') {
      $imgClose.css('display', 'block');
    }
    else
      $imgClose.css('display', 'none');
  })

  // $imgSearch.click(() => {
  //   const q = $domainvalue.val() + " " + s;
  //   if (!q || q === '') return;
  //   updateViewOnSearch();
  //   cse(q);
  //   document.getElementById("input-search").value = s;
  // })
  
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

  function onInit() {
    if (site){
      var q ="inurl:"+site+" "+s;
    }else{
      var q = s;
    }
    if (s && s != '') {
      updateViewOnSearch();
      cse(q);
      document.getElementById("input-search-in").value = s;
      $domainvalue.val(site);

    }
  }
  onInit();
})();

function getLink(value, link, title) {
  let dateT = new Date(Date.now());
  $.post("/links",
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
  $logoout.css('display', 'none');
  $logoout.css('visibility', 'hidden');
  $inputsearchout.css('display', 'none');
  $inputsearchout.css('visibility', 'hidden');
  $pagination.css('display', 'none');
  $loader.css('display', 'block');
  $imgClose.css('display', 'block');
  $hotlink.css('display', 'none');
}

const updateViewOnTop = () => {
  currentPage = 'result-page';
  $results.html('');
  $recommendkeypage.css('display', 'block');
  $recommendkeypage.css('visibility', 'visible');
  $recommendlinkpage.css('display', 'block');
  $recommendlinkpage.css('visibility', 'visible');
  $logoout.css('display', 'none');
  $logoout.css('visibility', 'hidden');
  $inputsearchout.css('display', 'none');
  $inputsearchout.css('visibility', 'hidden');
  $wrapsearchin.css('display', 'block');
  $wrapsearchin.css('visibility', 'visible');
  $logoin.css('display', 'block');
  $logoin.css('visibility', 'visible');
  $pagination.css('display', 'none');
  $imgClose.css('display', 'block');
  $hotlink.css('display', 'none');
}

const gettopkey = (nametopkey) => {
  $.get('/topkey', { nametopkey }).done(_data => {
    const list = _data;
    $recommendkeypage.html(`<li class="total">Top 10 Từ Khóa | <a onclick="gettopkey('topkeyweek')" class="title" id="searchkey">Tuần</a>	| <a onclick="gettopkey('topkeymonth')" class="title" id="searchkey">Tháng</a>	| <a onclick="gettopkey('topkeyyear')" class="title" id="searchkey">Năm</a>	| <a onclick="gettopkey('topkeyall')" class="title" id="searchkey">Tất cả</a></li>`);
    $.each(list, function (index, value) {
      $recommendkeypage.append(`
      <li class="item">#${value[2]} 
      <a href="/?s=${value[0]}" class="title" id="searchkey">${value[0]}</a>
  </li>
      `);
    });
    $recommendkey.html(`<li class="total">Top 10 Từ Khóa | <a onclick="gettopkey('topkeyweek')" class="title" id="searchkey">Tuần</a>	| <a onclick="gettopkey('topkeymonth')" class="title" id="searchkey">Tháng</a>	| <a onclick="gettopkey('topkeyyear')" class="title" id="searchkey">Năm</a>	| <a onclick="gettopkey('topkeyall')" class="title" id="searchkey">Tất cả</a></li>`);
    $.each(list, function (index, value) {
      $recommendkey.append(`
      <li class="item">#${value[2]} 
      <a href="/?s=${value[0]}" class="title" id="searchkey">${value[0]}</a>
  </li>
      `);
    });
  })
    .fail(err => console.log("err:", err))
}

const gettoplink = (nametoplink) => {
  $.get('/toplink', { nametoplink }).done(_data => {
    const list = _data;
    $recommendlinkpage.html(`<li class="total">Top 10 Link | <a onclick="gettoplink('toplinkweek')" class="title" id="searchkey">Tuần</a> | <a onclick="gettoplink('toplinkmonth')" class="title" id="searchkey">Tháng</a>	| <a onclick="gettoplink('toplinkyear')" class="title" id="searchkey">Năm</a>	| <a onclick="gettoplink('toplinkall')" class="title" id="searchkey">Tất cả</a></li>`);
    $.each(list, function (index, value) {
      $recommendlinkpage.append(`
      <li class="item">#${value[3]} 
      <a target="_blank" href="${value[0]}" onclick="getLink('','${value[0]}','${value[2]}')" class="title" id="vegar">${value[2]}</a>
  </li>
      `);
    });
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


if(topurl){
  updateViewOnTop();
}