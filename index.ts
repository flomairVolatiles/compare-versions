var semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

const indexOrEnd = (str: string, q: string) => str.indexOf(q) === -1 ? str.length : str.indexOf(q);

const split = (v: string) => {
  var patchIndex = indexOrEnd(v, '-');
  var arr = v.replace(/^v/, '').substring(0, patchIndex).split('.');
  arr.push(v.substring(patchIndex + 1));
  return arr;
}

const tryParse = (v: string) => isNaN(Number(v)) ? v : Number(v);

const validate = (version: string) => {
  if (typeof version !== 'string') {
    throw new TypeError('Invalid argument expected string');
  }
  if (!semver.test(version)) {
    throw new Error('Invalid argument not valid semver');
  }
}

export default function compareVersions(v1: string, v2: string) {
  [v1, v2].forEach(validate);

  const s1 = split(v1);
  const s2 = split(v2);

  for (let i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
    const n1 = parseInt(s1[i] || '0', 10);
    const n2 = parseInt(s2[i] || '0', 10);

    if (n1 > n2) return 1;
    if (n2 > n1) return -1;
  }

  const sp1 = s1[s1.length - 1];
  const sp2 = s2[s2.length - 1];

  if (sp1 && sp2) {
    const p1 = sp1.substring(0, indexOrEnd(sp1, '+')).split('.').map(tryParse);
    const p2 = sp2.substring(0, indexOrEnd(sp2, '+')).split('.').map(tryParse);

    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
      if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;

      if (p1[i] > p2[i]) return 1;
      if (p2[i] > p1[i]) return -1;
    }
  } else if (sp1 || sp2) {
    return sp1 ? -1 : 1;
  }

  return 0;
};
