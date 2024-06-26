function Meme(id, filename, captions){
    this.id = id;
    this.filename = filename;
    this.captions = captions;
}

function Caption(id, text){
    this.id = id;
    this.text = text;
}

export {Meme, Caption}