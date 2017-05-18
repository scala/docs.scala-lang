# run with `nix-shell`

let 
  pkgs = import <nixpkgs>{};
  stdenv = pkgs.stdenv;
in
  stdenv.mkDerivation {
    name = "bar";
    buildInputs = [ 
      pkgs.bundler
      pkgs.zlib
      pkgs.ruby
    ];
    shellHook = ''
    bundle install
    ~/.gem/ruby/2.3.0/bin/jekyll serve
    '';
  }