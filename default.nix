# run with `nix-shell`

let 
  pkgs = import <nixpkgs>{};
  stdenv = pkgs.stdenv;
in
  stdenv.mkDerivation {
    name = "scala-documentation";
    buildInputs = with pkgs; [ 
      bundler
      stdenv
      pkgconfig
      libxslt
      zlib
      libxml2
      ruby
    ];
    shellHook = ''
    bundle install
    ~/.gem/ruby/2.3.0/bin/jekyll serve
    '';
  }
