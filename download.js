// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var async = require('async');

var chapter = "01-01";

async.whilst(function () {
  var options ={};
  return options.chapter !== "15-01";
},
function (next) {

    var options = {
        host : 'ropas.snu.ac.kr',
        port : 80,
        path : '/~kwang/4190.310/mooc/'+chapter+'.mp4'
    };
    var req = http.request(options, function(res){
        if(res.statusCode === 404){ // statusCode 404
            
            var nextChapter =chapter.substring(0,2);
            nextChapter*=1;
            nextChapter = (++nextChapter < 10 ? '0'+nextChapter : nextChapter.toString() );
            chapter = nextChapter+'-01';
            next();
        }else if(res.statuscode === 200){

            var file_name = options.path.split('/')[4];
            var file = fs.createWriteStream('./'+file_name);

            res.on('data', function(data){
                file.write(data);    
            }).on('end', function(){
                console.log(file_name + ' downloaded end ');
                file.end();
                
                var currentChapter = chapter.substring(0,2)
                var nextSection = chapter.substring(3,5)
                nextSection*=1;
                nextSection = (++nextSection < 10 ? '0'+nextSection : nextSection.toString());
                chapter=currentChapter+'-'+nextSection;
                console.log("next chapter : " + chapter);
                next();
            }).on('error', function(e){
                console.log('problem with request: ${e.message}');
            });
        }
    });
    req.end();
    
    
},
function (err) {
    console.err("err : " + err);
});
