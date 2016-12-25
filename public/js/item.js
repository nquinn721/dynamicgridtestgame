function Item(x, y, w, h, id) {
    if(typeof x === 'object'){
        y = x.y;
        w = x.w;
        h = x.h;
        id = x.id;
        x = x.x;
    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
}