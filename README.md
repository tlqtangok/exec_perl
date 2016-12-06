# exec_perl  
[github](https://github.com/tlqtangok/exec_perl)

> Freedomly, fastly run native embeded Perl script in Node.js, makes Node.js just another Perl! 

Install with [npm](https://www.npmjs.com/)

```shell
$ npm install exec_perl 
```

# Usage

- main function from exec_perl is exec_perl(), while `e_pl()` is alias for `exec_perl()` 

## demo 1 

```js 
var e_pl = require( "exec_perl").e_pl ;
$abc = "yes";

e_pl ( '$abc', ` $abc =~ s/yes/YES/g; (($abc)); ` );
console.log ( $abc );  // YES
```
* Try [demo1](https://runkit.com/tlqtangok/execperl-demo-01)  online

#

## demo 2

```js
var exec_perl = require('exec_perl').exec_perl;  
 // if not use global: 
 // var app_e_p = require('exec_perl') ; 
 // app_e_p.exec( a,b );

/* important */
/* important */
/* important */
// variable in exel_perl must be a global var
$abc = 'text of $abc var.';	
var perl_stm = 	`
	 $abc= $abc x 2;
	 $abc =~ s/text/TEXT/g; // use your comment
	 (($abc));  # another comment style,define return var
`;

// var ret_obj = app.e_pl ()... // also works 
var ret_obj = exec_perl ( 
	'$abc', 	// caution! it's name of var, not value
	perl_stm
);
console.log( $abc ) ; 
// console: TEXT of $abc var.TEXT of $abc var.
console.log ( ret_obj.ans );
console.log ( ret_obj.perl_stm ); // show the run statement,for debugging

```
* Try [demo2](https://runkit.com/tlqtangok/execperl-demo-02) online

See [test](./test/test.js). Run an full example of the exec_perl with `node test/test.js`


# API
- [see file] (./index.js)



# About

## Why we need exec_perl
- Node.js is fast, Perl is fast and freedomly, how to choose from? Why don't we have both? I am a perl-er, and also a node.js-er, I am greedy~ .I take both _-:)


## Project goals
- Embeded perl script into Node.js,and have them worked perfectly togather

## Author
**Jidor Tang**
- [github/tlqtangok](https://github.com/tlqtangok)
- wechat account : tlqtangok

## License
- Copyright © 2016 Jidor Tang. Released under the MIT license.

## Release log
- first release v1.0.0 at 2016.12.05

## To do
- add array support 
- add object support



