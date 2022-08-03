require 'erb'

module Jekyll
    module AltDetails
        class AltDetailsBlock < Liquid::Block
            SYNTAX = /^\s*(#{Liquid::QuotedFragment})\s+(#{Liquid::QuotedFragment})(?=\s+class=(#{Liquid::QuotedFragment}))?/o
            Syntax = SYNTAX

            alias_method :render_block, :render

            def unquote(string)
                string.gsub(/^['"]|['"]$/, '')
            end

            def initialize(block_name, markup, tokens)
                super

                if markup =~ SYNTAX
                    @name = unquote($1)
                    @title = unquote($2)
                    @css_classes = ""
                    if $3
                        # append $3 to @css_classes
                        @css_classes = "#{@css_classes} #{unquote($3)}"
                    end
                else
                    raise SyntaxError.new("Block #{block_name} requires an id and a title")
                end
            end

            def render(context)
                site = context.registers[:site]
                converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
                altDetailsContent = converter.convert(render_block(context))
                currentDirectory = File.dirname(__FILE__)
                templateFile = File.read(currentDirectory + '/template.erb')
                template = ERB.new(templateFile)
                template.result(binding)
            end
        end
    end
end

Liquid::Template.register_tag('altDetails', Jekyll::AltDetails::AltDetailsBlock)
