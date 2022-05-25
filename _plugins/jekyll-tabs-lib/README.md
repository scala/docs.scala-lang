originally sourced from https://github.com/Ovski4/jekyll-tabs.

changes:
- template.erb adapted to match the pre-existing tab html structure for docs.scala-lang.org
- `tabs` do not use secure random uuid as the id, the `tabs` name parameter is used instead.
- for the `tabs` block, add an optional second `class='foo bar'` parameter to allow custom classes for the tabs.
- for the `tab` block, reorder the parameters: the tab label comes first, followed by the name of the parent `tabs`.
- addition of a third `defaultTab` attribute for `tab`, which defaults to the final tab if not set.
