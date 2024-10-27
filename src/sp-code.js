/* eslint-disable */

// Note this function is converted into a string at runtime
// Don't try and call external function inside your SP code
// If you want to bring in extneral input use the input() function

export function spCode() {
  let size = input(12, 10, 50.0);

  let gyroidSteps = input(.09, 0, .1);

  let s = getSpace();

  let scale = input(.50, 0, 2)

  let n = vectorContourNoise(s*scale+time*0.2, .05, 6)*.5+.5;

  n = pow(n, vec3(2))

  color(n)

  setMaxReflections(.01)

  let col = vec3(0, 1, 0);

  sphere(0.5);

  expand(n.z*.1)
}