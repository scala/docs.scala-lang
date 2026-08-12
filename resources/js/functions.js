
// Sliding Panel and scala in a nutshell
$(document).ready(function() {
  $('.navigation-panel-button,.navigation-fade-screen,.navigation-panel-close').on('click touchstart', function(e) {
    $('.navigation-menu,.navigation-fade-screen').toggleClass('is-visible');
    e.preventDefault();
  });

  var menus = $('.items-menu');
  var allContents = $('.items-code');
  var allButtons = $('.scala-item');

  menus.each(function(index1, row) {
    var row = $(row);
    var items = row.find('.scala-item');
    var content = row.children('.items-content');
    var contents = content.children('.items-code');

    items.each(function(index2, button) {
      var jButton = $(button);
      jButton.click(function(event) {
        var activeCode = contents.eq(index2);
        var others = allContents.not(activeCode);
        allButtons.removeClass('active');
        others.hide();

        if (activeCode.is(":visible")) {
          activeCode.hide();
        } else {
          jButton.addClass('active')
          activeCode.show();
        }

      });
    });
  });
});

// Tooltip
$(document).ready(function() {
  // Tooltip only Text
  $('.masterTooltip').hover(function() {
    // Hover over code
    var title = $(this).attr('title');
    $(this).data('tipText', title).removeAttr('title');
    $('<p class="tooltip"></p>')
      .text(title)
      .appendTo('body')
      .fadeIn('slow');
  }, function() {
    // Hover out code
    $(this).attr('title', $(this).data('tipText'));
    $('.tooltip').remove();
  }).mousemove(function(e) {
    var mousex = e.pageX + 20; //Get X coordinates
    var mousey = e.pageY + 10; //Get Y coordinates
    $('.tooltip')
      .css({
        top: mousey,
        left: mousex
      })
  });
});

// Highlight
$(document).ready(function() {
  hljs.configure({
    languages: ["scala", "bash"],
    noHighlightRe: /^hljs-skip$/i
  })
  hljs.registerLanguage("scala", highlightDotty);
  hljs.highlightAll();
});

// Documentation menu dropdown toggle
$(document).ready(function() { // DOM ready
  // If a link has a dropdown, add sub menu toggle.
  $('nav ul li a:not(:only-child)').click(function(e) {

    // if mobile...
    if ($(".navigation-ellipsis").css("display") == "block") {

      // toggle the submenu associated with the clicked id
      var submenuId = $(this).attr('id');
      $(".doc-navigation-submenus #" + submenuId).toggle();

      // Close one dropdown when selecting another
      $('.navigation-submenu:not(#' + submenuId + ')').hide();

    } else { // not mobile

      // toggle the dropdown associted with the clicked li element
      $(this).siblings('.navigation-dropdown').toggle();

      // Close one dropdown when selecting another
      $('.navigation-dropdown').not($(this).siblings()).hide();
    }
    e.stopPropagation();
  });
  // Clicking away from dropdown will remove the dropdown class
  $('html').click(function() {
    $('.navigation-dropdown').hide();
    $('.navigation-submenu:not(.ellipsis-menu)').hide();
    // $('.ellipsis-menu').hide();
  });

  // expands doc menu on mobile
  $('.navigation-ellipsis').click(function(e) {
    $(".navigation-submenu.ellipsis-menu").toggle();
  });
}); // end DOM ready

// Expand button on cards (guides & overviews page)
$(document).ready(function() {
  $.fn.hasOverflow = function() {
    var $this = $(this);
    var $children = $this.find('*');
    var len = $children.length;

    if (len) {
      var maxWidth = 0;
      var maxHeight = 0
      $children.map(function() {
        maxWidth = Math.max(maxWidth, $(this).outerWidth(true));
        maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
      });

      return maxWidth > $this.width() || (maxHeight + 66) > $this.height();
    }

    return false;
  };
});


// populate language dropdown
$(document).ready(function() {
  var old = $("#available-languages");
  var items = $("#available-languages li");
  var newList = $("#dd .dropdown");
  items.each(function(index, value){
      newList.append(value);
  });
  old.empty();

  // if there are no translations, hide language dropdown box
  if (items.length === 0) {
    $("#dd").hide();
  }
});


//Tweet feed in frontpage
$('#tweet-feed').tweetMachine('', {
  backendScript: '/webscripts/ajax/getFromTwitter.php',
  endpoint: 'statuses/user_timeline',
  user_name: 'scala_lang',
  include_retweets: true,
  exclude_replies: false,
  limit: 6,
  pageLimit: 3,
  autoRefresh: false,
  animateIn: false,
  tweetFormat: `
    <div class="item-tweet">
            <img src="" class="avatar" alt="">
            <div class="tweet-text">
              <div class="header-tweet">
                <ul>
                  <li class="user"><a href="" class="userLink"></a></li>
                  <li class="username"><a href="" class="usernameLink"></a></li>
                </ul>
                <span class="date"></span>
              </div>
              <div class="main-tweet"></div>
            </div>
          </div>
      `
}, function(tweets, tweetsDisplayed) {
  $('.slider-twitter').unslider({});
});

// Scaladex autocomplete search
var prevResult = "";
var lastElementClicked;

$(document).mousedown(function(e) {
  lastElementClicked = $(e.target);
});

$(document).mouseup(function(e) {
  lastElementClicked = null;
});

function hideSuggestions() {
  $('.autocomplete-suggestions').hide();
  $('.autocomplete-suggestion').hide();
}

function showSuggestions() {
  $('.autocomplete-suggestions').show();
  $('.autocomplete-suggestion').show();
}

hideSuggestions();
$('#scaladex-search').on('input', function(e) {
  if ($("#scaladex-search").val() == "") hideSuggestions();
});

$('#scaladex-search').on('focus', function(e) {
  if ($("#scaladex-search").val() != "") showSuggestions();
});

$('#scaladex-search').on('blur', function(e) {
  if (!$(e.target).is('.autocomplete-suggestion')) {
    if (lastElementClicked != null && !lastElementClicked.is('.autocomplete-suggestion')) {
      hideSuggestions();
    }
  } else {
    hideSuggestions();
  }
});

$('#scaladex-search').autocomplete({
  paramName: 'q',
  serviceUrl: 'https://index.scala-lang.org/api/autocomplete',
  dataType: 'json',
  beforeRender: function() {
    showSuggestions();
  },
  onSearchStart: function(query) {
    if (query == "") {
      hideSuggestions()
    } else {
      showSuggestions();
    }
  },
  transformResult: function(response) {
    return {
      suggestions: $.map(response, function(dataItem) {
        return {
          value: dataItem.repository,
          data: 'https://scaladex.scala-lang.org/' + dataItem.organization + "/" + dataItem.repository
        };
      })
    };
  },
  onSearchComplete: function(query, suggestions) {
    suggestions.length > 0 ? showSuggestions() : hideSuggestions();
  },
  onSelect: function(suggestion) {
    if (suggestion.data != prevResult) {
      prevResult = suggestion.data;
      hideSuggestions();
      $("#scaladex-search").blur();
      window.open(suggestion.data, '_blank');
    }
  }

});

$(document).ready(function() {
  $(window).on("blur", function() {
    if ($("#scaladex-search").length) {
      $("#scaladex-search").blur();
      $("#scaladex-search").autocomplete().clear();
    }
  });
});

// TOC:
$(document).ready(function() {
  if ($("#sidebar-toc").length) {
    $('#toc').toc({
      exclude: 'h1, h4, h5, h6',
      context: '.toc-context',
      autoId: true,
      numerate: false
    });
    const target = $('#sidebar-toc .active');
    if (target.length) {
      const marginTop = $('#sidebar-toc .type-chapter').length ? 15 : 10;
      $('#sidebar-toc').animate({scrollTop: target.position().top - marginTop}, 200);
    };
  }
});

// Language dropdown
function DropDown(el) {
  this.dd = el;
  this.placeholder = this.dd.children('span');
  this.opts = this.dd.find('ul.dropdown > li');
  this.val = '';
  this.index = -1;
  this.href = '';
  this.initEvents();
}
DropDown.prototype = {
  initEvents: function() {
    var obj = this;

    obj.dd.on('click', function(event) {
      $(this).toggleClass('active');
      return false;
    });

    obj.opts.on('click', function() {
      var opt = $(this);
      obj.val = opt.text();
      obj.index = opt.index();
      obj.placeholder.text(obj.val);
      obj.href = opt.find('a').attr("href");
      window.location.href = obj.href;
    });
  },
  getValue: function() {
    return this.val;
  },
  getIndex: function() {
    return this.index;
  }
}

$(function() {

  var dd = new DropDown($('#dd'));

  $(document).click(function() {
    // all dropdowns
    $('.wrapper-dropdown').removeClass('active');
  });

});

// Blog search
$(document).ready(function() {
  if ($("#blog-search-bar").length) {
    SimpleJekyllSearch({
      searchInput: document.getElementById('blog-search-bar'),
      resultsContainer: document.getElementById('result-container'),
      json: '/resources/json/search.json',
      searchResultTemplate: '<li><a href="{url}">{title}</a></li>',
      limit: 5,
    });

    $("#blog-search-bar").on("change paste keyup", function() {
      if ($(this).val()) {
        $("#result-container").show();
      } else {
        $("#result-container").hide();
      }
    });
  }
});

// Scala in the browser
$(document).ready(function() {
  if ($("#scastie-textarea").length) {
    var editor = CodeMirror.fromTextArea(document.getElementById("scastie-textarea"), {
      lineNumbers: true,
      matchBrackets: true,
      theme: "monokai",
      mode: "text/x-scala",
      autoRefresh: true,
      fixedGutter: false
    });
    editor.setSize("100%", ($("#scastie-code-container").height()));

    var codeSnippet = "List(\"Hello\", \"World\").mkString(\"\", \", \", \"!\")";
    editor.getDoc().setValue(codeSnippet);
    editor.refresh();

    $('.btn-run').click(function() {
      // TODO: Code to connect to the scastie server would be here, what follows is just a simulation for the UI elements:
      $('.btn-run').addClass("inactive");
      $('.btn-run i').removeClass("fa fa-play").addClass("fa fa-spinner fa-spin");
      setTimeout(function() {
        var currentCodeSnippet = editor.getDoc().getValue();
        console.log("Current code snippet: " + currentCodeSnippet);
        $('.btn-run').removeClass("inactive");
        $('.btn-run i').removeClass("fa-spinner fa-spin").addClass("fa fa-play");
      }, 2000);
    })
  }
});

// Browser Storage Support (https://stackoverflow.com/a/41462752/2538602)
function storageAvailable(type) {
  try {
    var storage = window[type],
        x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return false;
  }
}

// Store preference for Scala 2 vs 3
$(document).ready(function() {

  const Storage = (namespace) => {
    return ({
      getPreference(key, defaultValue) {
        const res = localStorage.getItem(`${namespace}.${key}`);
        return res === null ? defaultValue : res;
      },
      setPreference(key, value, onChange) {
        const old = this.getPreference(key, null);
        if (old !== value) { // activate effect only if value changed.
          localStorage.setItem(`${namespace}.${key}`, value);
          onChange(old);
        }
      }
    });
  };

  function activateTab(tabs, value) {
    // check the code tab corresponding to the preferred value
    tabs.find('input[data-target=' + value + ']').prop("checked", true);
  }

  /** Links all tabs created in Liquid templates with class ".tabs-$namespace"
   *  on the page together, such that
   *  changing a tab to some value will activate all other tab sections to
   *  also change to that value.
   *  Also records a preference for the tab in localStorage, so
   *  that when the page is refreshed, the same tab will be selected.
   *  On page load, selects the tab corresponding to stored value.
   */
  function setupTabs(tabs, namespace, defaultValue, storage) {
    const preferredValue = storage.getPreference(namespace, defaultValue);

    activateTab(tabs, preferredValue)

    // setup listeners to record new preferred Scala version.
    tabs.find('input').on('change', function() {
      // if checked then set the preferred version, and activate the other tabs on page.
      if ($(this).is(':checked')) {
        const parent = $(this).parent();
        const newValue = $(this).data('target');

        storage.setPreference(namespace, newValue, _ => {
          // when we set a new scalaVersion, find scalaVersionTabs except current one
          // and activate those tabs.
          activateTab(tabs.not(parent), newValue);
        });

      }

    });
  }

  function setupAlertCancel(alert, storage) {
    const messageId = alert.data('message_id');
    let onHide = () => {};
    if (messageId) {
      const key = `alert.${messageId}`;
      const isHidden = storage.getPreference(key, 'show') === 'hidden';
      if (isHidden) {
        alert.hide();
      }
      onHide = () => storage.setPreference(key, 'hidden', _ => {});
    }


    alert.find('.hide').click(function() {
      alert.hide(), onHide();
    });
  }

  function setupAllTabs(storage) {
    var scalaVersionTabs = $(".tabsection.tabs-scala-version");
    if (scalaVersionTabs.length) {
      setupTabs(scalaVersionTabs, "scalaVersion", "scala-3", storage);
    }
    var buildToolTabs = $(".tabsection.tabs-build-tool");
    if (buildToolTabs.length) {
      setupTabs(buildToolTabs, "buildTool", "scala-cli", storage);
    }
  }

  function setupAllAlertCancels(storage) {
    var alertBanners = $(".new-on-the-blog.alert-warning");
    if (alertBanners.length) {
      setupAlertCancel(alertBanners, storage);
    }
  }

  if (storageAvailable('localStorage')) {
    const PreferenceStorage = Storage('org.scala-lang.docs.preferences');
    setupAllTabs(PreferenceStorage);
    setupAllAlertCancels(PreferenceStorage);
  }

});

// OS detection
function getOS() {
  var osname = "linux";
  if (navigator.appVersion.indexOf("Win") != -1) osname = "windows";
  if (navigator.appVersion.indexOf("Mac") != -1) osname = "macos";
  if (navigator.appVersion.indexOf("Linux") != -1) osname = "linux";
  if (navigator.appVersion.indexOf("X11") != -1) osname = "unix";
  return osname;
}

$(document).ready(function () {
  // for each code snippet area, find the copy button,
  // and add a click listener that will copy text from
  // the code area to the clipboard
  $(".code-snippet-area").each(function () {
    var area = this;
    $(area).children(".code-snippet-buttons").children("button.copy-button").click(function () {
      var code = $(area).children(".code-snippet-display").children("code").text();
      window.navigator.clipboard.writeText(code);
    });
  });
});

$(document).ready(function () {
  // click the get-started tab corresponding to the users OS.
  var platformOSOptions = $(".tabsection.platform-os-options");
  if (platformOSOptions.length) {
    var os = getOS();
    if (os === 'unix') {
      os = 'linux';
    }
    platformOSOptions.find('input[data-target=' + os + ']').prop("checked", true);
  }
});

var image = {
  width: 1680,
  height: 1100
};
var target = {
  x: 1028,
  y: 290
};

var pointer = $('#position-marker');

$(document).ready(updatePointer);
$(window).resize(updatePointer);

function updatePointer() {

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var xScale = windowWidth / image.width;
  var yScale = windowHeight / image.height;

  pointer.css('top', (target.y));
  pointer.css('left', (target.x) * xScale);
}


// Glossary search
$(document).ready(function() {

$('#filter-glossary-terms').focus();

  $("#filter-glossary-terms").keyup(function(){

      // Retrieve the input field text and reset the count to zero
      var filter = $(this).val(), count = 0;

      // Loop through the comment list
      $(".glossary .toc-context > ul li").each(function(){
            // If the name of the glossary term does not contain the text phrase fade it out
          if (jQuery(this).find("h3").text().search(new RegExp(filter, "i")) < 0) {
              $(this).fadeOut();

          // Show the list item if the phrase matches and increase the count by 1
          } else {
              $(this).show();
              count++;
          }
      });

      // Update the count
      var numberItems = count;
      $("#filter-count").text("Found "+count+" occurrences.").css('visibility', 'visible');

      // check if input is empty, and if so, hide filter count
      if (!filter.trim()) {
        $("#filter-count").css('visibility', 'hidden');
      }
  });
});


//Footer scroll to top button
$(document).ready(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#scroll-to-top-btn').fadeIn();
        } else {
            $('#scroll-to-top-btn').fadeOut();
        }
    });
    $('#scroll-to-top-btn').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});

//Contributors widget
// see https://stackoverflow.com/a/19200303/4496364
$(document).ready(function () {
  let githubApiUrl = 'https://api.github.com/repos/scala/docs.scala-lang/commits';
  let identiconsUrl = 'https://github.com/identicons';
  /* - we need to transform "/tour/basics.html" to "_ba/tour/basics.md"
   * - some files aren't prefixed with underscore, see rootFiles
   * - some files are placed in _overviews but rendered to its folder, see overviewsFolders
   */

  let rootFiles = ['getting-started', 'learn', 'glossary'];
  let overviewsFolders = ['FAQ', 'cheatsheets', 'collections', 'compiler-options',
    'core', 'jdk-compatibility', 'macros', 'parallel-collections',
    'plugins', 'quasiquotes', 'reflection',
    'repl', 'scaladoc', 'tutorials'
  ];

  let thisPageUrl = window.location.pathname;
  // chop off beginning slash and ending .html
  thisPageUrl = thisPageUrl.substring(1, thisPageUrl.lastIndexOf('.'));
  let isRootFile = rootFiles.some(rf => thisPageUrl.startsWith(rf));
  let isInOverviewsFolder = overviewsFolders.some(of => thisPageUrl.startsWith(of));
  if(isRootFile) {
    thisPageUrl = thisPageUrl + '.md';
  } else if(thisPageUrl.indexOf("tutorials/FAQ/") == 0) {
    thisPageUrl = '_overviews/' + thisPageUrl.substring("tutorials/".length) + '.md';
  } else if(isInOverviewsFolder) {
    thisPageUrl = '_overviews/'+ thisPageUrl + '.md';
  } else if (thisPageUrl.startsWith('scala3/book')) {
    thisPageUrl = '_overviews/scala3-book/' + thisPageUrl.substring("scala3/book/".length) + '.md';
  } else {
    thisPageUrl = '_' + thisPageUrl + '.md';
  }

  let url = githubApiUrl + '?path=' + thisPageUrl;
  $.get(url, function (data, status) {
    if(!data || data.length < 1) {
      $('.content-contributors').html(''); // clear content
      return false; // break
    }
    let contributorsUnique = [];
    data.forEach(commit => {
      // add if not already in array
      let addedToList = contributorsUnique.find(c => {
        let matches = c.authorName == commit.commit.author.name;
        if (!matches && commit.author) {
          matches = c.authorName == commit.author.login;
        }
        return matches;
      });

      if (!addedToList) {
        // first set fallback properties
        let authorName = commit.commit.author.name;
        let authorLink = '';
        let authorImageLink = identiconsUrl + '/' + commit.commit.author.name + '.png';
        // if author present, fill these preferably
        if (commit.author) {
          authorName = commit.author.login;
          authorLink = commit.author.html_url;
          authorImageLink = commit.author.avatar_url;
        }
        contributorsUnique.push({
          'authorName': authorName,
          'authorLink': authorLink,
          'authorImageLink': authorImageLink
        });
      }
    });

    let contributorsHtml = '';
    contributorsUnique.forEach(contributor => {
      let contributorHtml = '<div>';
      contributorHtml += '<img src="' + contributor.authorImageLink + '">';
      if (contributor.authorLink)
        contributorHtml += '<a href="' + contributor.authorLink + '">' + contributor.authorName + '</a>';
      else
        contributorHtml += '<a>' + contributor.authorName + '</a>';
      contributorHtml += '</div>';
      contributorsHtml += contributorHtml;
    });
    $('#contributors').html(contributorsHtml);
  });
});

$(document).ready(function() {
  const icon = '<i class="fa fa-link fa-2xs" aria-hidden="true"></i>'
  const anchor = '<a class="heading-anchor" aria-hidden="true"></a>'

  $('.content-primary.documentation').find('h1, h2, h3, h4, h5, h6').each(function() {
    const id = $(this).attr('id');
    if (id) {
      $(this).append($(anchor).attr('href', '#' + id).html(icon));
    }
  });
});



$(document).ready(function () {
  $("pre > code").each(function () {
    const $code = $(this);
    // Skip if it's already wrapped in a .code-snippet-area
    if ($code.closest(".code-snippet-area").length) return;

    const $pre = $code.parent();
    const $wrapper = $('<div class="code-snippet-area"></div>');
    const $buttons = $(`
      <div class="code-snippet-buttons">
        <button class="copy-button">
          <i class="far fa-clone"></i>
        </button>
      </div>
    `);

    $pre.wrap($wrapper);
    $pre.before($buttons);
  });

  $(document).on("click", ".copy-button", function () {
    const $button = $(this);
    const $area = $button.closest(".code-snippet-area");
    const codeText = $area.find("code").text().trim();
    navigator.clipboard.writeText(codeText)
  });
});