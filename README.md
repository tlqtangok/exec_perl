# exec_perl  
** [github: exec_perl](https://github.com/tlqtangok/exec_perl)

> Freedomly, fast. run native perl script in embeded javascript or Node.js, Node.js just is just another Perl! 

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i exec_perl --save
```

# Usage

** main function from exec_perl is exec_perl(), e_pl() is alias for exec_perl() **

* demo 1 

```js 
var e_pl = require( "exec_perl").e_pl ;
 $abc = "yes";
e_pl ( '$abc', ` $abc =~ s/yes/YES/g;(($abc));` );
console.log ( $abc );  // YES
```

* demo 2

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

See [test](./test/test.js) run by  for an full example of the `exec_perl` . run test by `node test.js`


## API

### [see file] (./index.js)



## About

**why we need exec_perl**

* Node.js is fast, Perl is fast and freedomly, how to choose from? Why don't we have both? I am a perl-er, and also a node.js-er, I am greedy~ .I take both _-:)


**Project goals**

* Embeded perl script into Node.js,and have them worked perfectly togather

## Author

**Jidor Tang**

+ [github/tlqtangok](https://github.com/tlqtangok)
+ [wechat account](tlqtangok)

## License

Copyright © 2016 Jidor Tang
Released under the MIT license.

***release log***
- first release 1.0.0 at 2016.12.05

***to do next***
- add array support 
- add object support



