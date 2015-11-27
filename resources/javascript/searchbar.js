(function($) {
    var template =
        '<div class="aa-dataset-a">' +
        '</div>' +
        '<div class="branding-footer">' +
        '<div class="branding"><span>Powered by</span><a target="_blank" href="https://www.algolia.com/?utm_source=scaladocs"><img src="https://www.algolia.com/assets/algolia128x40.png"/></a></div>' +
        '</div>';

    var client = algoliasearch('BH4D9OD16A', '3403ae7bb4cb839fba71e2fae9ab1534');
    var index = client.initIndex('scaladocs');
    var ATTRIBUTES = ['content', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1' ];

    var capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var hitsSource = autocomplete.sources.hits(index, { hitsPerPage: 7, tagFilters: [ 'en' ], numericFilters: 'importance>0' });

    autocomplete('#q', {
        hint: false,
        debug: false,
        templates: {
            dropdownMenu: template
        }
    }, [
        {
            source: function(query, callback) {
                hitsSource(query, function(suggestions) {
                    var categories = {};
                    suggestions.forEach(function(suggestion) {
                        var enIndex = suggestion._tags.indexOf('en');
                        if(enIndex > -1) {
                            suggestion._tags.splice(enIndex, 1);
                        }
                        categories[suggestion._tags[0]] = categories[suggestion._tags[0]] || []
                        categories[suggestion._tags[0]].push(suggestion)
                    });

                    categories = $.map(Object.keys(categories).sort(), function(categoryName) {
                        var items = categories[categoryName];
                        items[0].isCategoryHeader = true;
                        items[0].categoryName = capitalize(categoryName);

                        return items;
                    });
                    callback(categories);
                });
            },
            name: 'a',
            displayKey: 'title',
            templates: {
                suggestion: function(suggestion) {
                    var html = [];
                    if(suggestion.isCategoryHeader) {
                        html.push('<div class="suggestion-category">' + suggestion.categoryName + '</div>');
                    }

                    var highlight = suggestion._highlightResult || {};
                    var snippet = suggestion._snippetResult || {};
                    var title = highlight.title.value;
                    var text = '';
                    for(var i = 0 ; i < ATTRIBUTES.length ; i++) {
                        if(highlight[ATTRIBUTES[i]] !== undefined) {
                            text = highlight[ATTRIBUTES[i]].value;
                            text = (snippet[ATTRIBUTES[i]] || {}).value || text;
                            break;
                        }
                    }

                    html.push('  <div class="suggestion-content">');
                    html.push('    <div class="suggestion-title">' + title  + '</div>');
                    html.push('    <div class="suggestion-text">' + text + '</div>');
                    html.push('  </div>');
                    return html.join(' ');
                }
            }
        }
    ]).on('autocomplete:selected', function(event, suggestion) {
        window.location.href = suggestion.link;
    });
})(jQuery);
