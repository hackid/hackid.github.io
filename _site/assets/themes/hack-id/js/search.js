(function() {
  // Taken from Jekyll Casts: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        //Recreate card layout for each result item
        appendString += '<div class="col-md-4 col-sm-6 learning-item">';
        appendString += '<picture class="intrinsic intrinsic-item">';
        appendString += '<img class="img-responsive intrinsic-img" src="' + item.siteURL + '/assets/images/resources/' + item.image + '" alt="' + item.title + '">';
        appendString += '</picture>';
        appendString += '<h2><a href="' + item.resourceUrl + '" target="_blank">' +  item.title + '</a></h2>';
        appendString += '<p class="attribution">';
        if ( item.resourceAuthor ) {
          appendString += item.resourceAuthor + ', ';
        }
        appendString += item.resourceOrg + '</p>';
        appendString += item.contentHTML;
        appendString += '<div class="labels pull-right">';
        if (item.resourceType === "Ebook") {
          appendString += '<i class="glyphicon glyphicon-book"></i> ';
        }
        if (item.resourceType === "Course") {
          appendString += '<i class="glyphicon glyphicon-blackboard"></i> ';
        }
        if (item.resourceType === "Email Course") {
          appendString += '<i class="glyphicon glyphicon-send"></i> ';
        }
        if (item.resourceType === "Website") {
          appendString += '<i class="glyphicon glyphicon-link"></i> ';
        }
        if (item.resourceType === "Podcast") {
          appendString += '<i class="glyphicon glyphicon-headphones"></i> ';
        }
        appendString += item.resourceType + ' | ';
        if (item.access === "Requires Email") {
          appendString += '<i class="glyphicon glyphicon-envelope"></i> ';
        }
        if (item.access === "Requires Registration") {
          appendString += '<i class="glyphicon glyphicon-user"></i> ';
        }
        if (item.access === "Free") {
          appendString += '<i class="glyphicon glyphicon-download-alt"></i> ';
        }
        appendString += item.access + ' </div>';
        appendString += '<div class="post-sharing pull-right">';
        var learningItemURL = "https://hackid.github.io%23" + item.learningItemID;
        appendString += '<a href="https://twitter.com/share?url=' + learningItemURL + '&via=anthkris&hashtags=hackidlearning&text=' + item.title + ' free ' + item.resourceType + '" target="_blank">';
        appendString += '<img src="' + item.siteURL +'/assets/images/twitter-logo.svg" class="social-logo"/></a>';
        appendString += '<a href="https://plus.google.com/share?url=' + learningItemURL + '&title=' + item.title + ' free ' +  item.resourceType + '" target="_blank">';
        appendString += '<img src="' + item.siteURL + '/assets/images/google-plus.svg" class="social-logo"/></a></div>';
        appendString += '<a href="' + item.resourceUrl + '" target="_blank" class="button view-button">View</a>';
        appendString += '</div>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<div class="col-xs-12"><p class="no-results">No results found.<br /><a href="https://docs.google.com/forms/d/e/1FAIpQLSe-Vw60TcOyTjd_FgTLD7eZ_fPwYTXsUWWNZEN1NrLTPK-qKA/viewform" target="_blank">Try submitting a resource on this topic!</a></p></div>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('org');
      this.field('type');
      this.field('category');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].resourceAuthor,
        'org': window.store[key].resourceOrg,
        'type': window.store[key].resourceType,
        'category': window.store[key].category,
        'content': window.store[key].content
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();
