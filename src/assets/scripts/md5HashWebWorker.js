// https://www.codeproject.com/Articles/830704/Gigabit-File-uploads-Over-HTTP
// MD5 checksum library https://github.com/satazor/SparkMD5
importScripts('spark-md5.min.js');

var BYTES_PER_CHUNK = 1024 * 1024; // 1 MB chunk sizes

function processFile(blob) {
  var fileSize = blob.size;
  var totalNumberOfChunks = Math.ceil(blob.size / BYTES_PER_CHUNK);
  var processedChunkCounter = 0;

  var fileReader = new FileReaderSync();
  var spark = new SparkMD5.ArrayBuffer();

  var position = 0;
  while (position < fileSize) {
    spark.append(fileReader.readAsArrayBuffer(blob.slice(position, position + BYTES_PER_CHUNK)));
    processedChunkCounter++;

    var percentComplete = parseInt((processedChunkCounter / totalNumberOfChunks * 100), 10);
    self.postMessage({'type': 'status', 'message': percentComplete});

    if(processedChunkCounter === totalNumberOfChunks) {
      var md5hash = spark.end(null);
      self.postMessage({'type': 'checksum', 'message': md5hash.toUpperCase()});
      console.log('md5hash: ' + md5hash.toUpperCase());
    }
    position += BYTES_PER_CHUNK;
  }
}

self.onmessage = function (e) {
  processFile(e.data[0]);
};
