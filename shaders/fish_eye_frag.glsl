precision highp       float;
uniform   samplerCube map;
varying   vec2        vUv;
#define M_PI 3.1415926535897932384626433832795
void main()  {
  // vec2 uv = vUv;
  // float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;
  // float latitude = uv.y * M_PI;
  // vec3 dir = vec3(
  // - sin( longitude ) * sin( latitude ),
  // cos( latitude ),
  // - cos( longitude ) * sin( latitude )
  // );
  // normalize( dir );
  // gl_FragColor = textureCube( map, dir );
  float l = length(vUv);
  float latitude = l * M_PI;
  float sinOfLatitude = sin(latitude);
  float cosOfLatitude = cos(latitude);
  vec3 dir = vec3(vUv.x/l * sinOfLatitude, cosOfLatitude, vUv.y/l * sinOfLatitude);
  gl_FragColor = textureCube( map, dir );
}
