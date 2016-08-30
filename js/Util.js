class Util {
    static normalize(vx, vy) {
        let hypotenuese = Math.sqrt((vx * vx) + (vy * vy));
        if (hypotenuese !== 0) {
            return { x: vx / hypotenuese, y: vy / hypotenuese };
        } else {
            return null;
        }
    }
}