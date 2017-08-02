module Jekyll
  class TutConverter < Converter
    safe false
    priority :high

    def matches(ext)
      ext =~ /^\.(md|markdown)$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
        content.gsub("```tut\n", "```scala\n")
    end
  end
end
