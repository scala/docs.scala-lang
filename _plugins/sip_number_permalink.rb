# frozen_string_literal: true

# This plugin allows using front matter variables in permalinks and redirect_from.
# For example: permalink: /sips/:number will use the 'number' front matter field.

Jekyll::Hooks.register :site, :after_init do
  Jekyll::Drops::UrlDrop.class_eval do
    def number
      @obj.data["number"].to_s if @obj.data["number"]
    end
  end
end

# Expand :number and :title in redirect_from values
Jekyll::Hooks.register :documents, :pre_render do |doc|
  next unless doc.data["redirect_from"]

  redirects = doc.data["redirect_from"]
  redirects = [redirects] unless redirects.is_a?(Array)

  doc.data["redirect_from"] = redirects.map do |redirect|
    result = redirect
    result = result.gsub(":number", doc.data["number"].to_s) if doc.data["number"]
    result = result.gsub(":title", Jekyll::Utils.slugify(doc.data["title"])) if doc.data["title"]
    result
  end
end
