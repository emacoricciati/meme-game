

function Image(id, filename, captions){
    this.id = id;
    this.filename = filename;
    this.captions = captions;
}

function Caption(id, text, correct){
    this.id = id;
    this.text = text;
    this.correct = correct;
}

export {Image, Caption}