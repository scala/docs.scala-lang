module Jekyll
  class MdocConverter < Converter
    safe false
    priority :high

    def matches(ext)
      ext =~ /^\.(md|markdown)$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      content = content.gsub("```scala mdoc:fail\n", "```scala\n")
      content = content.gsub("```scala mdoc:crash\n", "```scala\n")
      content = content.gsub("```scala mdoc:nest\n", "```scala\n")
      content = content.gsub("```scala mdoc:reset\n", "```scala\n")
      content.gsub("```scala mdoc\n", "```scala\n")
    end
  end
end
