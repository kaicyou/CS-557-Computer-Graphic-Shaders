#version 330 compatibility

uniform float uWaterHeight;
uniform float Timer;
uniform float uTimeScale;
uniform int   uNumWaves;
uniform float uEta;
uniform float uTemp;

out vec3 vNormal;
out vec3 vEyeDir;
out vec4 vPos;

const float pi = 3.14159;
const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

float flag = 1;
float time = Timer * uTimeScale;
float amp[4];
float waveL[4];
float spd[4];
vec2  dir[4];

float wave(int i, float x, float z) {
    float frenq = 2*pi/waveL[i];
    float theta = dot(dir[i], vec2(x, z));
    float Phi = spd[i] * frenq;
    float waveEqua = amp[i] * sin(theta * frenq + time * Phi * flag);
    return waveEqua;
}

float vertexHeight(float x, float z) {
    float height = 0.0;
    for (int i = 0; i < uNumWaves; ++i)
        height += wave(i, x, z);
    return height;
}

float dHdx(int i, float x, float z) {
    float frenq = 2*pi/waveL[i];
    float A = amp[i] * dir[i].x * frenq;
    float theta = dot(dir[i], vec2(x, z));
    float Phi = spd[i] * frenq;
    float DxEqua = A * cos(theta * frenq + time * Phi * flag);
    return DxEqua;
}

float dHdz(int i, float x, float z) {
    float frenq = 2*pi/waveL[i];
    float A = amp[i] * dir[i].y * frenq;
    float theta = dot(dir[i], vec2(x, z));
    float Phi = spd[i] * frenq;
    float DzEqua = A * cos(theta * frenq + time * Phi * flag);
    return DzEqua;
}

vec3 newNormal(float x, float z) {
    float dx = 0.0;
    float dz = 0.0;
    for (int i = 0; i < uNumWaves; ++i) {
        dx += dHdx(i, x, z);
        dz += dHdz(i, x, z);
    }
    vec3 n = vec3(-dx, 1.0, -dz);
    return normalize(n);
}

void main() {
    amp[0] = 0.073;
    amp[1] = 0.085;
    amp[2] = 0.046;
    amp[3] = 0.113;
    waveL[0] = 2.238;
    waveL[1] = 0.866;
    waveL[2] = 1.281;
    waveL[3] = 2.238;
    spd[0] = 1.;
    spd[1] = 0.348;
    spd[2] = 0.683;
    spd[3] = 0.274;
    dir[0] = vec2(1, 0);
    dir[1] = vec2(0.3, 0.3);
    dir[2] = vec2(0.3, 0.6);
    dir[3] = vec2(0., 0.5);
    if(uTemp >= 1)
    {
        amp[0] = 0.073*1.5;
        amp[1] = 0.085*1.5;
        amp[2] = 0.046*1.5;
        amp[3] = 0.113*1.5;
        waveL[0] = 2.238*1.5;
        waveL[1] = 0.866*1.5;
        waveL[2] = 1.281*1.5;
        waveL[3] = 2.238*1.5;
        dir[0] = vec2(1, 0);
        dir[1] = vec2(0.3, -0.3);
        dir[2] = vec2(-0.3, -0.6);
        dir[3] = vec2(0., 0.5);
    }
    if(uTemp <= 0)
    {
        flag = 0;
    }
    vPos = gl_Vertex;
    vPos.y = uWaterHeight + vertexHeight(vPos.x, vPos.z);
    if(uTemp >= 1)
    {
        flag = 0.5;
        vPos.y += 0.75*uTemp;
    }
    vec3 ECposition = vec3( gl_ModelViewMatrix * vPos );
    vec3 eyeDir = normalize( ECposition ) - vec3(0.,0.,0.);
    vec3 worldNormal = newNormal(vPos.x, vPos.z);

    vEyeDir = eyeDir;
    vNormal = worldNormal;

    gl_Position = gl_ModelViewProjectionMatrix * vPos;
}
