(function() {
    var template =
        '<div class="aa-dataset-a">' +
        '</div>' +
        '<div class="branding-footer">' +
        '<div class="branding"><span>Powered by</span><a target="_blank" href="https://algolia.com"><img src="https://www.algolia.com/assets/algolia128x40.png"/></a></div>' +
        '</div>';

    var client = algoliasearch('XT7HFL89G3', '9110ba06379a1615458dbce9604b1e2a');
    var index = client.initIndex('scaladocs');
    var ATTRIBUTES = ['content', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1' ];

    var capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    autocomplete('#q', {
        hint: false,
        debug: false,
        templates: {
            dropdownMenu: template
        }
    }, [
        {
            source: autocomplete.sources.hits(index, { hitsPerPage: 5, tagFilters: [ 'en' ], numericFilters: 'importance>0' }),
            name: 'a',
            displayKey: 'title',
            templates: {
                suggestion: function(suggestion) {
                    for(var i = 0 ; i < ATTRIBUTES.length ; i++) {
                        if(suggestion._highlightResult[ATTRIBUTES[i]] !== undefined) {
                            return '<span class="title"><strong>' + capitalize(suggestion._tags[1]) + '</strong>: ' + suggestion._highlightResult.title.value + '</span><span class="text">' + suggestion._highlightResult[ATTRIBUTES[i]].value + '</span>';
                        }
                    }
                }
            }
        }
    ]).on('autocomplete:selected', function(event, suggestion) {
        window.location.href = suggestion.link;
    });
})();
