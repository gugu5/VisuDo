// Parameters

let graphConfig = {
    baseWidth : 800,
    baseHeight : 600,
    padding : 20,
    margin : { top: 20, right: 0, bottom: 50, left: 50 },
    axis: {
        y:{
            extraOffsetPercent : 4
        }
    },
    labelX: { offsetY: 20},
    labelY: { offsetX: 12},
    // we want to be responsive on the graph size
    getWidth: function() {
        // very small: fixed
        if (window.innerWidth < 100) {
            return 100;
        }
        // adapted to windows width
        if (window.innerWidth < 800) {
            return window.innerWidth - this.margin.right - this.margin.left;
        }
        // bigger => fixed
        return this.baseWidth;
    },
    getHeigth: function() {
        return this.baseHeight;
    },
}