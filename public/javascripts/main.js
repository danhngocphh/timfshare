// var request = require('request');

(() => {

  const $inputSearch = $('#input-search');
  const $results = $('#results');
  const $recommend = $('#recommend');
  const $loader = $('#loader');
  const $btnPrev = $('#btn-prev');
  const $btnNext = $('#btn-next');
  const $pagination = $('#pagination');
  const $imgSearch = $('#img-search');
  const $imgClose = $('#img-close');
  const $imgCse = $('#img-cse');

  



  let data;
  

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
    $.get('/search', { q, start }).done(_data => {
      data = _data;
      console.log(data);
      $loader.css('display', 'none');
      var i_link = 0;
      var i_key = 0;
      $recommend.html(`<li class="total">Top 10 Link </li>`);   
      
      $.each(data.toplink, function(index, value) {
        i_link++;
        $recommend.append(`#${i_link}
        <li class="item">
        <a href="#" onclick="getLink('${data.q}','${value[0]}','${value[2]}')" class="title" id="vegar">${value[2]}</a>
    </li>
        `); 
      });


      
      
      $results.html(`<li class="total">Total about ${data.totalResults} results in ${data.time} seconds.</li>`);
      data.items.map(o => {
        $results.append(`
          <li class="item">
            <a href="#"  onclick="getLink('${data.q}','${o.link}','${o.title}')" class="title" id="vegar">${o.title}</a>
            
           <div class="snippet">${o.link}</div>
            <div class="snippet">${o.snippet}</div>
            ${o.img ?
              `<a href=${o.img}><img src="${o.img}" alt="image"></a>`
              : ''}
          </li>
        `);
      });
      
      updatePagination();
    })
      .fail(err => console.log(err))
  }

  const updateViewOnSearch = () => {
    $results.html('');
    $recommend.html('');
    $pagination.css('display', 'none');
    $loader.css('display', 'block');
    $imgClose.css('display', 'block');
    $imgCse.css('display', 'none');
  }

  $inputSearch.on('input', (e) => {
    if ($inputSearch.val() != '')
      $imgClose.css('display', 'block');
    else
      $imgClose.css('display', 'none');
  })

  $inputSearch.on('keypress', (e) => {
    if (e.which !== 13) return;
    // only handle press enter key
    const q = $inputSearch.val();
    if (!q || q === '') return;
    updateViewOnSearch();
    cse(q);
  })

  $imgSearch.click(() => {
    const q = $inputSearch.val();
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

  function onInit() {
    const q = $inputSearch.val();
    if (q && q != '') {
      updateViewOnSearch();
      cse(q);
    }
  }

  onInit();

})();

function getLink( value, link, title) {
  // options = {
  //   uri: 'http://localhost:1239/values',
  //   method: 'POST',
  //   json: {
  //     "value": "test",
  //     "date": "test"
  //   }
  // };
  let dateT = new Date(Date.now());
  // dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
  $.post("https://fptda1admin.herokuapp.com/links",
  {
    "value": value,
    "link": link,
    "title": title,
    "date": dateT
  },
  function(data, status){
    //alert("Data: " + data + "\nStatus: " + status);
    window.location.href = link;
  }).fail(function() {
    alert( "loi ket noi toi server" );
  });

  
  
  // request(options, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body.id) // Print the shortened url.
  //   }
  // });
}
function getDate(){
  let today = new Date(Date.now());
  let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let d = date+' '+time;
  return d;
}
