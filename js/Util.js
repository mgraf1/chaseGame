class Util {
    static normalize(vx, vy) {
        let hypotenuese = Math.sqrt((vx * vx) + (vy * vy));
        if (hypotenuese !== 0) {
            return { x: vx / hypotenuese, y: vy / hypotenuese };
        } else {
            return null;
        }
    }

    static dist(x, y, x2, y2) {
        return Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2));
    }
}