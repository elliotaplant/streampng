var Base = require('./base.js');
var zlib = require('zlib');

/**
 * Compressed textual metadata.
 */

var CompressedText = Base.make('zTXt');
CompressedText.prototype.initialize = function initialize(data) {
  var p = this.getParser(data);
  this.keyword = p.eatString();
  this.compressionMethod = p.eatUInt(1);
  this.compressedText = p.eatRest();
  this.text = null;
};

CompressedText.prototype.out = function (callback) {
  zlib.deflate(this.text, function (err, data) {
    if (err)
      throw new Error('there was a problem deflating the text: ' + err);

    var length  = (this.keyword.length + 1) + 1 + data.length;
    var buf = this._outputPrepare(length);
    buf['data']
      .write(this.keyword)
      .write(this.compressionMethod)
      .write(data)
    callback(this._output(buf));
  }.bind(this));
};

module.exports = CompressedText;