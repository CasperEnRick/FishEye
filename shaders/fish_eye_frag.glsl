precision highp float;
uniform samplerCube map;
varying vec2 vUv;
#define M_PI 3.1415926535897932384626433832795;

void main()  {
  // float longitude = (1.- vUv.x) * 2. * M_PI - M_PI * .5;
  // float latitude = vUv.y * M_PI;
  // float sinLon = sin(longitude);
  // float sinLat = sin(latitude);
  // float cosLat = cos(latitude);
  // float cosLon = cos(longitude);
  // vec3 dir = normalize(vec3(-sinLon * sinLat, cosLat, -cosLon * sinLat));
  // gl_FragColor = textureCube(map, dir);
  float l = length(vUv);
  float latitude = l * M_PI;
  float sinLat = sin(latitude);
  float cosLat = cos(latitude);
  vec3 dir = vec3(vUv.x / l * sinLat, cosLat, vUv.y / l * sinLat);
  gl_FragColor = textureCube(map, dir);
}
