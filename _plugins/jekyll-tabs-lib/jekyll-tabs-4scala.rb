require 'erb'

module Jekyll
    module Tabs

        def self.unquote(string)
            string.gsub(/^['"]|['"]$/, '')
        end

        def self.asAnchor(title)
            title.gsub(/[^a-zA-Z0-9\-_]/, '-').gsub(/-{2,}/, '-').downcase
        end

        TabDetails = Struct.new(:label, :anchor, :defaultTab, :content, keyword_init: true)

        class TabsBlock < Liquid::Block
            SYNTAX = /^\s*(#{Liquid::QuotedFragment})(?=\s+class=(#{Liquid::QuotedFragment}))?/o
            Syntax = SYNTAX

            def initialize(block_name, markup, tokens)
                super

                if markup =~ SYNTAX
                    @name = Tabs::unquote($1)
                    @css_classes = ""
                    if $2
                        # append $2 to @css_classes
                        @css_classes = "#{@css_classes} #{Tabs::unquote($2)}"
                    end
                else
                    raise SyntaxError.new("Block #{block_name} requires 1 attribute")
                end
            end

            def render(context)
                environment = context.environments.first
                environment["tabs-#{@name}"] = [] # reset every time (so page translations can use the same name)
                super

                foundDefault = false

                allTabs = environment["tabs-#{@name}"]

                allTabs.each do | tab |
                    if tab.defaultTab
                        foundDefault = true
                    end
                end

                if !foundDefault and allTabs.length > 0
                    # set last tab to default
                    allTabs[-1].defaultTab = true
                end

                currentDirectory = File.dirname(__FILE__)
                templateFile = File.read(currentDirectory + '/template.erb')
                template = ERB.new(templateFile)
                template.result(binding)
            end
        end

        class TabBlock < Liquid::Block
            alias_method :render_block, :render

            SYNTAX = /^\s*(#{Liquid::QuotedFragment})\s+(?:for=(#{Liquid::QuotedFragment}))(?:\s+(defaultTab))?/o
            Syntax = SYNTAX

            def initialize(block_name, markup, tokens)
                super

                if markup =~ SYNTAX
                    @tab = Tabs::unquote($1)
                    @name = Tabs::unquote($2)
                    @anchor = Tabs::asAnchor(@tab)
                    if $3
                        @defaultTab = true
                    end
                else
                    raise SyntaxError.new("Block #{block_name} requires at least 2 attributes")
                end
            end

            def render(context)
                site = context.registers[:site]
                mdoc_converter = site.find_converter_instance(::Jekyll::MdocConverter)
                converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
                pre_content = mdoc_converter.convert(render_block(context))
                content = converter.convert(pre_content)
                tabcontent = TabDetails.new(label: @tab, anchor: @anchor, defaultTab: @defaultTab, content: content)
                environment = context.environments.first
                environment["tabs-#{@name}"] ||= []
                environment["tabs-#{@name}"] << tabcontent
            end
        end
    end
end

Liquid::Template.register_tag('tab', Jekyll::Tabs::TabBlock)
Liquid::Template.register_tag('tabs', Jekyll::Tabs::TabsBlock)
