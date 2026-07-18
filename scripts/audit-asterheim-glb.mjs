import fs from 'node:fs/promises';

const inventory = JSON.parse(await fs.readFile('reports/asterheim-assets-inventory.json', 'utf8'));
const glbs = inventory.filter((item) => item.extension === '.glb');
const results = [];

for (const item of glbs) {
  const handle = await fs.open(item.originalPath, 'r');
  try {
    const header = Buffer.alloc(20);
    await handle.read(header, 0, header.length, 0);
    const magic = header.toString('ascii', 0, 4);
    const version = header.readUInt32LE(4);
    const declaredLength = header.readUInt32LE(8);
    const jsonLength = header.readUInt32LE(12);
    const chunkType = header.toString('ascii', 16, 20);
    if (magic !== 'glTF' || version !== 2 || chunkType !== 'JSON' || declaredLength !== item.sizeBytes || jsonLength > 64 * 1024 * 1024) {
      results.push({ relativePath: item.relativePath, valid: false, reason: 'invalid-header-or-length', sizeBytes: item.sizeBytes });
      continue;
    }
    const jsonBuffer = Buffer.alloc(jsonLength);
    await handle.read(jsonBuffer, 0, jsonLength, 20);
    const document = JSON.parse(jsonBuffer.toString('utf8').trim());
    results.push({
      relativePath: item.relativePath,
      valid: true,
      version,
      sizeBytes: item.sizeBytes,
      scenes: document.scenes?.length ?? 0,
      nodes: document.nodes?.length ?? 0,
      meshes: document.meshes?.length ?? 0,
      materials: document.materials?.length ?? 0,
      textures: document.textures?.length ?? 0,
      animations: document.animations?.length ?? 0,
      externalUris: (document.buffers ?? []).filter((entry) => entry.uri).length + (document.images ?? []).filter((entry) => entry.uri).length,
      publicStatus: 'withheld-pending-commercial-authorization',
    });
  } catch (error) {
    results.push({ relativePath: item.relativePath, valid: false, reason: error.name, sizeBytes: item.sizeBytes });
  } finally {
    await handle.close();
  }
}

await fs.writeFile('reports/asterheim-glb-audit.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ files: results.length, valid: results.filter((item) => item.valid).length, invalid: results.filter((item) => !item.valid).length }));
