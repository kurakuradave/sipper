var config = require( './config.json' );
var async = require( 'async' );
var dbDriver = require( './dbDriver.js' );

var currObjId = null;




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
        dbDriver.spit( daDoc, function( err ) {  
          if( err ) ascb( err );
          else{ 
            ascb( null );
          }
        } );
      }, function( err ) {  
        if( err ) wcb( err );
        else{
          console.log( "spit %d docs", docs.length );   
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
      console.log( ">>> one sip-spit cycle done!" );
      callback( null );
    }
  } );
};




var onandon = function(  ) {
  doIt( function( err ) {  
    if( err ){
      console.log( "ERROR while sip-spittting!" );
      console.log( err );
    } else {
      onandon();
    }
  } );
};




setTimeout( function(  ) {  
  onandon();
}, 5000 );
