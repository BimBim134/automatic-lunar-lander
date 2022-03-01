function vignette(
    alpha_max,
    radius = sqrt(sq(sx / 2) + sq(sy / 2))
    )
 {
    let vg = createGraphics(sx, sy);
    let alpha;
    for (let x = 0; x < sx; x++) {
        for (let y = 0; y < sy; y++) {
            alpha = map(sqrt(sq(x - sx / 2) + sq(y - sy / 2)), 0, radius, 0, 1);
            alpha = pow(alpha, 3);
            alpha = map(alpha, 0, 1, 0, alpha_max);
            vg.stroke(0, 0, 0, alpha);
            vg.point(x, y);
        }
    }
    return vg;
}

