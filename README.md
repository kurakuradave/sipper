# sipper
sippertool
db1 is source db2 is target
to start, run node app.js
if halted half-way, replace value of currObjId with the value in sipColName.data.lastObjId, then run again
Remember to create collection sipColName in db2, and insert one doc, containing one field: {lastObjId:""}
otherwise it cannot update nonexistent document!
