# frozen_string_literal: true

# This plugin allows using front matter variables in permalinks.
# For example: permalink: /sips/:number will use the 'number' front matter field.

Jekyll::Hooks.register :site, :after_init do
  Jekyll::Drops::UrlDrop.class_eval do
    def number
      @obj.data["number"].to_s if @obj.data["number"]
    end
  end
end
