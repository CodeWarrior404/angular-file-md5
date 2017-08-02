// https://www.codeproject.com/Articles/830704/Gigabit-File-uploads-Over-HTTP

// This worker is used to split the file into chunks,
// and calculate the file checksum.
// Each chunk is sent back to the parent page to be
// uploaded by another worker

// Import additional scripts
// MD5 checksum library https://github.com/satazor/SparkMD5
importScripts('spark-md5.js');

// Global variables
// Note IE 10 does not recognize the const declaration so we have to use var
var LARGE_FILE = 500 * 1024 * 1024;
var workerdata = '';
var asyncstate = true;

// 1MB chunk sizes. The default
var BYTES_PER_CHUNK = 1 * 1024 * 1024;

// This function is used to read the file, calculate the checksum,
// and send the file chunk to the web worker that uploads the file chunk
function processFile(blob) {

  // Size of the file
  var SIZE = blob.size;

  // The total number of file chunks
  var Total_Number_of_Chunks = Math.ceil(blob.size / BYTES_PER_CHUNK);

  // Array used to hold the total number of chunks, the number of chunks that have been uploaded,
  // and the current chunk. This information is sent to the web worker that uploads the file chunks
  var chunkCount = {

    currentNumber: 1,
    numberOfChunks: Total_Number_of_Chunks,
    numberOfUploadedChunks: 0,
    starttime: new Date()
  };

  var start = 0;
  var end = BYTES_PER_CHUNK;

  var fileReader = new FileReaderSync();
  var spark = new SparkMD5.ArrayBuffer();

  while (start < SIZE) {

    var chunk = blob.slice(start, end);

    // Read the chunk into another variable to calculate the checksum
    var chunk1 = fileReader.readAsArrayBuffer(chunk);
    spark.append(chunk1);

    // Send the chunk back to the parent
    self.postMessage({ 'type': 'upload', 'filename': blob.name, 'blob': chunk, 'chunkCount':
    chunkCount, 'asyncstate': asyncstate,'id': workerdata.id });

    chunkCount.currentNumber++;
    chunkCount.numberOfUploadedChunks++;

    start = end;
    end = start + BYTES_PER_CHUNK;

    if(chunkCount.numberOfUploadedChunks == chunkCount.numberOfChunks) {

      // All done calculate the checksum
      var md5hash = spark.end();
      console.log('md5hash: ' + md5hash.toUpperCase());
      self.postMessage({ 'type': 'checksum', 'message': md5hash.toUpperCase(), 'id': workerdata.id
      });

      // Merge the file on the remote server
      self.postMessage({ 'type': 'merge', 'filename': blob.name, 'chunkCount': chunkCount, 'id':
      workerdata.id });
    }
  }

}


// This is where we start.
// The parent sends us the file as a part of the data
self.onmessage = function (e) {

  workerdata = e.data;

  // If we have an id greater than 5 then we abort. We upload five files at a time.
  if (workerdata.id > 5) {
    self.postMessage({ 'type': 'error', 'message': "We can only upload five files at a time.", 'id':
    workerdata.id });
    return;
  }

  // // If we have a large file we will use a synchronous upload by default.
  // // Large file is greater than 500GB
  // if(workerdata.files.size > LARGE_FILE && workerdata.uploadlargfileasync == false) {
  //   asyncstate = false;
  // }


  // Configure the bytes per chunk.
  // The default is 1MB
  switch (workerdata.bytesperchunk) {

    case'50MB':
      BYTES_PER_CHUNK = 50 * 1024 * 1024;
      break;
    case'20MB':
      BYTES_PER_CHUNK = 20 * 1024 * 1024;
      break;
    case'10MB':
      BYTES_PER_CHUNK = 10 * 1024 * 1024;
      break;
    case'5MB':
      BYTES_PER_CHUNK = 5 * 1024 * 1024;
      break;
    case'2MB':
      BYTES_PER_CHUNK = 2 * 1024 * 1024;
      break;
    case'1MB':
      BYTES_PER_CHUNK = 1 * 1024 * 1024;
      break;
    case'500K':
      BYTES_PER_CHUNK = 500 * 1024;
      break;
    case'256K':
      BYTES_PER_CHUNK = 256 * 1024;
    case'128K':
      BYTES_PER_CHUNK = 128 * 1024;
      break;
    case'64K':
      BYTES_PER_CHUNK = 64 * 1024;
      break;
    default:
      BYTES_PER_CHUNK = 1024 * 1024;
  }


  // // Process the file for uploading
  // //  Send a status message to the parent page
  // self.postMessage({ 'type': 'status', 'message': "Uploading file " + workerdata.files.name, 'id':
  // workerdata.id });

  // Start processing the file
  processFile(workerdata[0]);

};
