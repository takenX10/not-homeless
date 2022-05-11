# NOT homeless 
A quick project to parse houses ads

var str = "";
var i = 1;
var list = [];
for( let key in req.body){
    if(req.body[key]){
        str += `${key}=\$${i} and`;
        i += 1;
        list += element;
    }
});

if(!str){
    throw exception;
}

str.substring(0, str.length - 3);

"select * from blacklist where "+str, list