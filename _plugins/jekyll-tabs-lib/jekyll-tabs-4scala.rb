require 'erb'

module Jekyll
    module Tabs

        ScalaVersions = Set.new ['Scala 2', 'Scala 3']

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
                    @is_scala_tabs = false
                    if $2
                        css_class = Tabs::unquote($2)
                        css_class.strip!
                        if css_class == "tabs-scala-version"
                            @is_scala_tabs = true
                        end
                        # append $2 to @css_classes
                        @css_classes = " #{css_class}"
                    end
                else
                    raise SyntaxError.new("Block #{block_name} requires 1 attribute")
                end
            end

            def render(context)
                environment = context.environments.first
                environment["tabs-#{@name}"] = [] # reset every time (so page translations can use the same name)
                if environment["CURRENT_TABS_ENV"].nil?
                    environment["CURRENT_TABS_ENV"] = @name
                else
                    raise SyntaxError.new("Nested tabs are not supported")
                end
                super # super call renders the internal content
                environment["CURRENT_TABS_ENV"] = nil # reset after rendering
                foundDefault = false

                allTabs = environment["tabs-#{@name}"]

                seenTabs = Set.new

                allTabs.each do | tab |
                    if seenTabs.include? tab.label
                        raise SyntaxError.new("Duplicate tab label '#{tab.label}' in tabs '#{@name}'")
                    end
                    seenTabs.add tab.label
                    if tab.defaultTab
                        foundDefault = true
                    end
                end

                if !foundDefault and allTabs.length > 0
                    # set last tab to default
                    allTabs[-1].defaultTab = true
                end

                if @is_scala_tabs
                    allTabs.each do | tab |
                        if !Tabs::ScalaVersions.include?(tab.label)
                            joined_versions = Tabs::ScalaVersions.to_a.map{|item| "'#{item}'"}.join(", ")
                            raise SyntaxError.new(
                                "Scala version tab label '#{tab.label}' is not valid for tabs '#{@name}' with " +
                                "class=tabs-scala-version. Valid tab labels are: #{joined_versions}")
                        end
                    end
                end

                currentDirectory = File.dirname(__FILE__)
                templateFile = File.read(currentDirectory + '/template.erb')
                template = ERB.new(templateFile)
                template.result(binding)
            end
        end

        class TabBlock < Liquid::Block
            alias_method :render_block, :render

            SYNTAX = /^\s*(#{Liquid::QuotedFragment})\s+(?:for=(#{Liquid::QuotedFragment}))?(?:\s+(defaultTab))?/o
            Syntax = SYNTAX

            def initialize(block_name, markup, tokens)
                super

                if markup =~ SYNTAX
                    @tab = Tabs::unquote($1)
                    if $2
                        @name = Tabs::unquote($2)
                    end
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
                tab_env = environment["CURRENT_TABS_ENV"]
                if tab_env.nil?
                    raise SyntaxError.new("Tab block '#{tabcontent.label}' must be inside a tabs block")
                end
                if !@name.nil? && tab_env != @name
                    raise SyntaxError.new(
                        "Tab block '#{@tab}' for=#{@name} does not match its enclosing tabs block #{tab_env}")
                end
                environment["tabs-#{tab_env}"] ||= []
                environment["tabs-#{tab_env}"] << tabcontent
            end
        end
    end
end

Liquid::Template.register_tag('tab', Jekyll::Tabs::TabBlock)
Liquid::Template.register_tag('tabs', Jekyll::Tabs::TabsBlock)
