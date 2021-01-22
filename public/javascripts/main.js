// var request = require('request');
  const $inputSearch = $('#input-search');
  const $domainvalue = $('#cusSelectboxValue');
  const $domain = $('#cusSelectbox');
  const $results = $('#results');
  const $recommend = $('#recommend');
  const $recommendkey = $('#recommendkey');
  const $tablerecommend = $('.wrap-recommend-out');
  const $tablerecommendkey = $('.wrap-recommendkey-out');
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

  // const top = (q, start) => {
  //   $.get('/search', { q, start }).done(_data => {
  //     data = _data;
  //     var i_link = 0;
  //     var i_key = 0; 
  //     $recommend.html(`<li class="total">Top 10 Link </li>`);   
      
  //     $.each(data.toplink, function(index, value) {
  //       i_link++;
  //       $recommend.append(`
  //       <li class="item">#${i_link} 
  //       <a href="#" onclick="getLink('${data.q}','${value[0]}','${value[2]}')" class="title" id="vegar">${value[2]}</a>
  //   </li>
  //       `); 
  //     });

      

  //     $recommendkey.html(`<li class="total">Top 10 Key Search </li>`);   
      
  //     $.each(data.topkey, function(index, value) {
  //       i_key++;
  //       $recommendkey.append(`
  //       <li class="item">#${i_key} 
  //       <a onclick="topkey1('${value[0]}')" class="title" id="searchkey">${value[0]}</a>
  //   </li>
  //       `); 
  //     });

  //     updatePagination();
  //   })
  // }

  const cse = (q, gettopkey, gettoplink, start) => {
    $.get('/search', { q, gettopkey, gettoplink, start }).done(_data => {
      data = _data;
      console.log(data);
      $loader.css('display', 'none');
      var i_link = 0;
      var i_key = 0;
      $recommend.html(`<li class="total">Top 10 Link | <a onclick="topkeypage()" class="title" id="searchkey">Week</a> | <a onclick="topkeypage()" class="title" id="searchkey">Month</a>	| <a onclick="topkeypage()" class="title" id="searchkey">Year</a>	| <a onclick="topkeypage()" class="title" id="searchkey">All</a></li>`);   
      
      $.each(data.toplink, function(index, value) {
        i_link++;
        $recommend.append(`
        <li class="item">#${value[3]} 
        <a target="_blank" href="${value[0]}" onclick="getLink('${data.q}','${value[0]}','${value[2]}')" class="title" id="vegar">${value[2]}</a>
    </li>
        `); 
      });

      

      $recommendkey.html(`<li class="total">Top 10 Key Search | <a onclick="topkeypage()" class="title" id="searchkey">Week</a>	| <a onclick="topkeypage()" class="title" id="searchkey">Month</a>	| <a onclick="topkeypage()" class="title" id="searchkey">Year</a>	| <a onclick="topkeypage()" class="title" id="searchkey">All</a></li>`);   
      
      $.each(data.topkey, function(index, value) {
        i_key++;
        $recommendkey.append(`
        <li class="item">#${value[2]} 
        <a onclick="topkey1('${value[0]}','all')" class="title" id="searchkey">${value[0]}</a>
    </li>
        `); 
      });


      
      
      $results.html(`<li class="total">Total about ${data.totalResults} results in ${data.time} seconds.</li>`);
      data.items.map(o => {
        $results.append(`
          <li class="item">
            <a target="_blank" href="${o.link}"  onclick="getLink('${data.q}','${o.link}','${o.title}')" class="title" id="vegar">${o.title}</a>
            
           <div class="snippet">${o.link}</div>
            <div class="snippet">${o.snippet}</div>
            
          </li>
        `);
      });
      
      
      updatePagination();
    })
      .fail(err => console.log(err))
  }

(() => {

  // const $inputSearch = $('#input-search');
  // const $results = $('#results');
  // const $recommend = $('#recommend');
  // const $recommendkey = $('#recommendkey');
  // const $loader = $('#loader');
  // const $btnPrev = $('#btn-prev');
  // const $btnNext = $('#btn-next');
  // const $pagination = $('#pagination');
  // const $imgSearch = $('#img-search');
  // const $Searchkey = $('#searchkey');
  // const $imgClose = $('#img-close');
  // const $imgCse = $('#img-cse');

  



  // let data;
  





  const updateViewOnSearch = () => {
    currentPage = 'result-page';
  $results.html('');
  $recommend.html('');
  $recommendkey.html('');
  $pagination.css('display', 'none');
  $loader.css('display', 'block');
  $imgClose.css('display', 'block');
  // $imgSearch.css('display', 'none');
  // $imgClose.css('display', 'none');
  // $imgCse.css('display', 'none');
  // $imglogooutside.css('display', 'none');
  // float: right;
  // margin-top: 25%;
  // margin-left: 15%;	
  // top: 5%;
	// right: 3.5%;

  $inputSearch.css('width', '88.5%');
  $inputSearch.css('float', 'right');
  $inputSearch.css('margin-top', '0.2%');
  $inputSearch.css('margin-left', '0%');
  $domain.css('margin-top', '0.2%');
  $domain.css('margin-left', '11.5%');
  // $domain.css('float', 'right');
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
  $recommend.css('display', 'block');
  $recommendkey.css('display', 'block');
  $hotlink.css('display', 'none');
  }

  $inputSearch.on('input', (e) => {
    if ($inputSearch.val() != '')
    {
      // $autocomplete.css('margin-top', '20px');
      // $autocomplete.css('width', '20%');
      $imgClose.css('display', 'block');
    }
     
    else
      $imgClose.css('display', 'none');
  })

  // $inputSearch.on('keypress', (e) => {
  //   if (e.which !== 13) return;
  //   console.log("Enter handle");
  //   // only handle press enter key
  //   const q = $domain.val()+" "+$inputSearch.val();
  //   if (!q || q === '') return;
  //   updateViewOnSearch();
  //   cse(q);
  // })

  $imgSearch.click(() => {
    
    const q = $domainvalue.val()+" "+$inputSearch.val();

    if (!q || q === '') return;
    updateViewOnSearch();
    cse(q);
  })

  // $Searchkey.click(() => {
  //   const q = $domain.val()+"Searchkey "+$inputSearch.val();
  //   if (!q || q === '') return;
  //   updateViewOnSearch();
  //   cse(q);
  // })

  $btnNext.click(() => {
    updateViewOnSearch();
    cse(data.q,'all','all', data.nextPage);
  });

  $btnPrev.click(() => {
    updateViewOnSearch();
    cse(data.q,'all','all', data.previousPage);
  })

  $imgClose.click(() => {
    data = null;
    $inputSearch.val('');
    $imgClose.css('display', 'none');
  })

//   $inputSearch.on('keypress',function(e) {
//     if(e.which == 13) {
//       const q = $domain.val()+" "+$inputSearch.val();

//       if (!q || q === '') return;
//       updateViewOnSearch();
//       cse(q);
//     }
// });

  $inputSearch.keyup(function(){
   
      console.log("__keyup");
      console.log("__keyup-curr-page", currentPage);
      // setTimeout(function(){ 
        
        if(currentPage == 'result-page'){
          $('#input-searchautocomplete-list').addClass('margrin-top-cus');
          // $autocomplete.css('margin-top', '20px');
          // $autocomplete.css('width', '20%');
  
        }
      
      // }, 200);
     
    
  });

  function onInit() {

    var q = $inputSearch.val();


    
    if (q && q != '') {
      updateViewOnSearch();
      cse(q);x
    }
    // top("123");
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


    // window.open(
    //   link,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
  }).fail(function() {
    alert( "loi ket noi toi server" );
  });
};
  
  
  // request(options, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body.id) // Print the shortened url.
  //   }
  // });

function getDate(){
  let today = new Date(Date.now());
  let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let d = date+' '+time;
  return d;
}

const updateViewOnSearch = () => {
  currentPage = 'result-page';
  $results.html('');
  $recommend.html('');
  $recommendkey.html('');
  $pagination.css('display', 'none');
  $loader.css('display', 'block');
  $imgClose.css('display', 'block');
  // $imgSearch.css('display', 'none');
  // $imgClose.css('display', 'none');
  // $imgCse.css('display', 'none');
  // $imglogooutside.css('display', 'none');
  // float: right;
  // margin-top: 25%;
  // margin-left: 15%;	
  // top: 5%;
	// right: 3.5%;

  $inputSearch.css('width', '88.5%');
  $inputSearch.css('float', 'right');
  $inputSearch.css('margin-top', '0.2%');
  $inputSearch.css('margin-left', '0%');
  $domain.css('margin-top', '0.2%');
  $domain.css('margin-left', '11.5%');
  // $domain.css('float', 'right');
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
  $recommend.css('display', 'block');
  $recommendkey.css('display', 'block');
  $tablerecommend.css('display', 'none');
  $tablerecommendkey.css('display', 'none');
  $hotlink.css('display', 'none');
}

const updateViewOnTop = () => {
  currentPage = 'result-page';
  $results.html('');
  $recommend.html('');
  $recommendkey.html('');
  $pagination.css('display', 'none');
  
  $imgClose.css('display', 'block');
  // $imgSearch.css('display', 'none');
  // $imgClose.css('display', 'none');
  // $imgCse.css('display', 'none');
  // $imglogooutside.css('display', 'none');
  // float: right;
  // margin-top: 25%;
  // margin-left: 15%;	
  // top: 5%;
	// right: 3.5%;

  $inputSearch.css('width', '88.5%');
  $inputSearch.css('float', 'right');
  $inputSearch.css('margin-top', '0.2%');
  $inputSearch.css('margin-left', '0%');
  $domain.css('margin-top', '0.2%');
  $domain.css('margin-left', '11.5%');
  // $domain.css('float', 'right');
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
  $recommend.css('display', 'block');
  $recommendkey.css('display', 'block');
  $tablerecommend.css('display', 'block');
  $tablerecommendkey.css('display', 'block');
  $hotlink.css('display', 'none');
}

function topkey1(q ,gettopkey, gettoplink,start) {
    
    
  updateViewOnSearch();
  cse(q, gettopkey,gettoplink,start);
  document.getElementById("input-search").value = q;

  
}

function topkeypage() {
    
    
  updateViewOnTop();
  // cse(q, gettopkey,gettoplink,start);
  // document.getElementById("input-search").value = q;

  
}
