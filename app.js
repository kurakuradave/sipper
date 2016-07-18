var config = require( './config.json' );
var async = require( 'async' );
ar dbDriver = require( './dbDriver.js' );

var currObjId = "";




var doIt = function( callback ) {
  async.waterfall( [
    function( wcb ) {
      dbDriver.sip( currObjId, function( err, docs ) {  
        if( err ) wcb( err );
        else{
          console.log( "sipped %d docs", docs.length );
          wcb( null, docs );
        } 
      } );
    },
    function( docs, wcb ) {
      async.eachSeries( docs, function( daDoc, ascb ) {  
        dbDriver.pooey( daDoc, function( err ) {  
          if( err ) ascb( err );
          else{ 
            ascb( null );
          }
        } );
      }, function( err ) {  
        if( err ) wcb( err );
        else{
          console.log( "pooey-ed %d docs", docs.length );   
          // set anchor
          currObjId = docs[ docs.length-1 ]['_id'];
          dbDriver.anchor( currObjId, function( err ) {  
            if( err ) wcb( err );
            else{
              console.log( "last doc anchored to %s" + currObjId );
              wcb( null );
            }
          } );     
        }
      } );
    },
    function( wcb ) {
      setTimeout( function(  ){
        wcb( null );
      }, config.sipDelay );
    }
  ], function( err ) { 
    if( err ) callback( err );
    else{
      console.log( ">>> one sip-pooey cycle done!" );
      callback( null );
    }
  } );
};




vvar onandon = function(  ) {
  doIt( function( err ) {  
    if( err ){
      console.log( "ERROR while sip-pooey-ing!" );
      console.log( err );
    } else {
      onandon();
    }
  } );
};




setTimeout( function(  ) {  
  onandon();
}, 5000 );
