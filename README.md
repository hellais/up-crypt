# What is up-crypt
up-crypt is a POC demonstrating how the HTML5 FileAPI can be used to
implement client side AES encrypted file upload.

The crypto part is done by crypto-js (https://code.google.com/p/crypto-js/),
a "growing collection of standard and secure cryptographic algorithms implemented 
in JavaScript using best practices and patterns".

For managing big numbers in javascript it uses Big Integer Library by Leemon Baird 
(http://leemon.com/crypto/BigInt.js)

Currently this POC has been tested on Firefox 4 and Chrome 12, yet it will probably also
work on other browser versions that implement the HTML5 FileAPI.

# TODO
In future releases it would be nice to have the following:

* Support "true" multi-part POST
Currently the file is not split up into multiple parts. This could be achieved by using the slice
FileAPI method[2], or by loading the whole file into memory and sending it part by part with standard
js string manipulation techniques.

* Figure out a way to retrieve the file efficiently.
Currently the was to get the file back to the user is to use the data URI scheme [3],
while this method works ok for small files, its performance is uncertain for 
files over 1M ("The LITLEN (1024) limits the number of characters which can appear in a single
attribute value literal"[3]).
To sum this issue up in one line, we want the user to click on download file, and get his browser
to fetch the encrypted content from the server, decrypt it locally (this can be achieved easily) and
then present allow him to do "save as" (this is the tricky part).



[2] http://www.w3.org/TR/FileAPI/#dfn-slice
[3] http://tools.ietf.org/html/rfc2397


