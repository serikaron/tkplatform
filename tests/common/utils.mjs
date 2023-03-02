export function genPhone() {
    const prefix = ['130', '131', '132', '133', '135', '136', '137', '138', '139', '147', '150', '151', '152', '153', '155', '156', '157', '158', '159', '186', '187', '188', '198'];
    const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomSuffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${randomPrefix}${randomSuffix}`
}