#!/usr/bin/env ruby

# The workflow is pretty straightforward for using this script to
# reorganize a multi-file document.
#
# 1. Have a clean tree.
# 2. Use -x *.md to print an index; write that to a file.
# 3. Reorder the lines in the file to match your desired order.
# 4. Feed the index back in with -i.

require 'optparse'

def opts(args)
  options = {:encoding => 'UTF-8'}
  OptionParser.new do |opts|
    opts.banner = "Usage: ./renumber.rb [OPTIONS] [-i INDEX | FILES]"

    opts.on("-i", "--index FILE", "Use newline-separated list of files") do |i|
      options[:index] = i
    end
    opts.on("-e", "--encoding ENC", "Set character encoding") do |e|
      options[:encoding] = e
    end
    opts.on("-x", "--print-index", "Show index, don't change any files") do |x|
      options[:print_index] = true
    end
    opts.on("-s", "--start-from NUM", Integer, "Use fresh numbers instead of reorganizing the existing numbers") do |s|
      options[:start_from] = s
    end
  end.parse!(args)
  options
end

# `f`'s number and the num index location from its lines, or nil if
# none found.
def filenum(lines)
  marker = /^---\s*/
  s = lines.index {|l| marker =~ l}
  if s
    e = lines.drop(s+1).index {|l| marker =~ l}
    if e
      nl = lines[s+1, e].map {|l| /^num: (\d+)\s*/.match(l)}
      nli = nl.index {|l| l}
      if nli
        [nl[nli][1].to_i, s + 1 + nli]
      end
    end
  end
end

def setnum(n, nli, lines, fname)
  File.open(fname, "w") do |f|
    lines[0, nli].each {|l| f.write(l)}
    f.write("num: #{n}\n")
    lines[nli+1..-1].each {|l| f.write(l)}
  end
end

# List of (filename, number, number line index, lines) for each of
# files, or nil for entries with no number.
def filenums(files)
  files.map do |fname|
    lines = File.open(fname) {|f| f.readlines}
    fn = filenum(lines)
    if fn
      [fname] + fn + [lines]
    else
      warn("#{fname} has no num: index entry; skipping")
    end
  end
end

# Given filenums result and an optional number from which to create
# start new indices, write new indices.
def rewrite_indices(ns, start_from)
  nums = if start_from
           start_from..(start_from + ns.size - 1)
         else
           ns.map{|e| e[1]}.sort
         end
  nums.zip(ns) do |e|
    nn, oe = e
    fn, n, nli, lines = oe
    setnum(nn, nli, lines, fn)
  end
end

def print_index(ns)
  ns.sort{|x,y| x[1] <=> y[1]}.each{|n| puts(n[0])}
end

def main(args)
  o = opts(args)
  fileset = if o[:index]
              File.open(o[:index]) {|f| f.readlines}.map{|fn| fn.chomp}
            else
              args
            end
  ns = filenums(fileset).select{|e| e}
  if o[:print_index]
    print_index(ns)
  else
    rewrite_indices(ns, o[:start_from])
  end
end

main(ARGV)
