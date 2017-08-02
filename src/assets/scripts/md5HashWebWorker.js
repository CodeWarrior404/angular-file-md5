// https://www.codeproject.com/Articles/830704/Gigabit-File-uploads-Over-HTTP

// This worker is used to split the file into chunks,
// and calculate the file checksum.
// Each chunk is sent back to the parent page to be
// uploaded by another worker

// Import additional scripts
// MD5 checksum library https://github.com/satazor/SparkMD5
importScripts('spark-md5.js');

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
    currentNumber: 1
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

    chunkCount.currentNumber++;
    chunkCount.numberOfUploadedChunks++;

    var percentComplete = parseInt((chunkCount.currentNumber / Total_Number_of_Chunks * 100), 10);
    self.postMessage({ 'type': 'status', 'message': percentComplete});

    start = end;
    end = start + BYTES_PER_CHUNK;

    if(chunkCount.currentNumber == Total_Number_of_Chunks) {
      // All done calculate the checksum
      var md5hash = spark.end(null);
      console.log('md5hash: ' + md5hash.toUpperCase());
      self.postMessage({ 'type': 'checksum', 'message': md5hash.toUpperCase() });
    }
  }

}


// This is where we start.
// The parent sends us the file as a part of the data
self.onmessage = function (e) {
  // Start processing the file
  processFile(e.data[0]);
};
