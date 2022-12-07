export const Decorate = {
    bytesToKilobytes: function(bytes: number): string {
        let v = bytes;

        if (v < 1024) {
            return v + 'b';
        }

        if (v < Math.pow( 1024, 2)) {
            v /= 1024;
            return v.toFixed(2) + 'Kb (' + bytes + ')';
        }

        if (v < Math.pow(1024, 3)) {
            v /= Math.pow(1024, 2);
            return v.toFixed(2) + 'Mb (' + bytes + ')';
        }

        return '(' + bytes + ')';
    }
}