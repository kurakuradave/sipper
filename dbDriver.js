// mongodb
var mongodb = require( 'mongodb' );
var config = require( './config.json' );
var db1Conn = {};
var db2Conn = {};




var connectDB = function( adb, callback ){  
  console.log( "Connecting to DB %s ...", adb.db );
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect( adb.connectStr, function(err, db) {
    if( err ) callback( err );
    else {  
      console.log( "... Connected to %s!", adb.db );
      callback( null, db );
    }
  } );
};




var persistConn = function( aconn, adb, callback ) {
  connectDB( adb, function( err, db ) {  
    if( err )callback(err);
    else{
      aconn = db;
      callback( null );
    }
  } );
};



// obtain connection for db1 (source)
persistConn( db1Conn, config.db1, function( err ) {  
  if( err ){
    console.log( "Error in Connecting to %s! Quitting.", config.db1.db );
    console.log( err );
    process.exit( 1 );
  } else{ 
    console.log( "Persistent Connection To %s Obtained! Binding methods...", config.db1.db );
    // bind methods
    var sip = function( anId, sipcb ) {
      db1Conn.collection( config.db1.col )
      .find( { ['_id'] : { $gt:anId } } )
      .sort( ['_id'] )
      .limit( config.sipLength )
      .toArray( function( err, docs ) {  
        if( err ) sipcb( err );
        else{
          sipcb( null, docs );
        }
      } );
    };
    // declare exports
    module.exports.sip = sip;
  }
} );




// obtain connection for db2 (target)
persistConn( db2Conn, config.db2, function( err ) {  
  if( err ){
    console.log( "Error in Connecting to %s! Quitting.", config.db2.db );
    console.log( err );
    process.exit( 1 );
  } else{ 
    console.log( "Persistent Connection To %s Obtained! Binding methods...", config.db1.db );
    // bind methods
    var spit = function( anObj, spitcb ) {
      db2Conn.collection( config.db2.col )
      .insert( anObj, function( err, inscb ) {  
        if( err ) spitcb( err );
        else{
          spitcb( null );
        }
      } );
    };
    
    var anchor = function( anObjId, acb ) {
      db2Conn.collection( config.spitColName )
      .update( {}, { $set: { 'lastObjId' : anObjId } }, function( err ) {  
        if( err ) acb( err );
        else acb( null );
      } );     
    };
    // declare exports
    module.exports.spit = spit;
    module.exports.anchor = anchor;
  }
} );



