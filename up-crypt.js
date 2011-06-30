
// Takes as input a Base64 string
// outputs Base64 encrypted string
function Base64Crypt(b64string, key) {
  var bytes = Crypto.util.base64ToBytes(b64string);
  var crypt = Crypto.AES.encrypt(Crypto.charenc.Binary.bytesToString(bytes), key);
  return crypt;
}


// Takes as input a Base64 string
// Ouputs the unencrypted Base64 string
function Base64Decrypt(b64string, key) {
  var decrypt = Crypto.AES.decrypt(b64string, key);
  return Crypto.util.bytesToBase64(Crypto.charenc.Binary.stringToBytes(decrypt));
}

function PackData(boundary, data, filename, varname) {
  var datapack = '';
  datapack += '--' + boundary + '\r\n';
  datapack += 'Content-Disposition: form-data; ';
  datapack += 'name="' + varname + '"; filename="' + filename + '"\r\n';
  datapack += 'Content-Type: application/octet-stream\r\n\r\n';
  datapack += data;
  datapack += '\r\n';
  datapack += '--' + boundary + '--';
  return datapack;
}

function UploadData(url, datapack, boundary) {
  var xhr = new XMLHttpRequest();
  /*
  xhr.onreadystatechange = function() {
      if(this.readyState == 4)
         alert("error in upload!");
  }
  */
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  xhr.send(datapack);
}

function PullData(file, outelement, key) {
	xhr.onreadystatechange = function() {
	console.log("pulling!");

	    if(xhr.readyState == 4){
	    	var outdata = xhr.responseText;
	    	var decrypted = "data:application/octet-stream;base64,";
	    	console.log(outdata);
	    	try {
	    		console.log(outelement.href);
	    		if(!outelement.href.match("base64")) {
			    	decrypted += Base64Decrypt(outdata, key);
			    	console.log(decrypted);
			    	outelement.href = decrypted;
			    	outelement.className = "downloaded";
			    	//outelement.innerHTML = file+"(pulled! click to saveas)";
		    	}
	    	}
	    	catch(err) {
	    		alert("wrong key!");
	    	}
		};
	}
  	xhr.open('GET', "uploads/"+file, true);
 	xhr.send();
 	return false;
}

document.getElementById("upload").addEventListener('submit', upload, true);

function upload(event) {
  if ( event.preventDefault ) event.preventDefault();
  event.returnValue = false;
  var reader = new FileReader();

  // This is used to get the various elements, file, password etc.
  var files = document.getElementById('files').files;
  var key = document.getElementById('password').value;
  //var filename = document.getElementById('filename').value;
  var filename = document.getElementById('files').value;
 
  if(!key) {
    alert("key not set!");
    return false;
  }
  if(!files[0]) {
    alert("no file selected!")
    return false;
  }
  reader.onload = function() {
    
    var b64str = reader.result.split(",")[1];
    console.log(b64str);

    document.getElementById('status').innerHTML = "doing client side encryption....";

    var crypt = Base64Crypt(b64str, key);

    // For debug purposes set the value of the encrypt box
    //document.getElementById('encrypt').innerHTML = crypt; 
    
    // For debug purposes set the value of the decrypt box
    //document.getElementById('raw').innerHTML = Crypto.AES.decrypt(crypt, key);
    document.getElementById('status').innerHTML = "uploading....";
    // Generate a random boundary
    var boundary = "-----------------"+Math.floor(Math.random()*32768)+Math.floor(Math.random()*32768);
    
    var datapack = PackData(boundary, crypt, filename, "fileupload");
    try {
      UploadData("upload.php", datapack, boundary);
      
      document.getElementById('status').innerHTML = "uploaded successfully!";
    }
    catch(er) {
      document.getElementById('status').innerHTML = "error uploading!";
    }
    
};
  
  reader.readAsDataURL(files[0]);
  
  return false;
}

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if(xhr.readyState == 4){
    var files = xhr.responseText;
    var filelist = "<ul>";
    files = files.split(";");
    
    for(var i in files) {
      if(files[i].length > 1){
        filelist += '<li><a href="#" class="fileel" id="' + files[i] + '">'+files[i]+'</a></li>';
      }
    }
    filelist += "</ul>";
    document.getElementById("stored").innerHTML = filelist;
  var links = document.getElementsByTagName("a");
  for (var i in links) {
    if(links[i].className == "fileel") {
      links[i].addEventListener('click', function(e){
        PullData(e.target.id, e.target, document.getElementById('decryptkey').value)
      }, false);
      }
    }
    
  }
};
  
xhr.open('GET', "upload.php?getfilelist", true);
xhr.send();
console.log(xhr.responseText);
