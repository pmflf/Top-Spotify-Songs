import {promises as fs} from 'fs';

/**
 * reads data from a given path
 * @param {string} path 
 * @returns a collection of string objects
 */
async function read(path){
  try{
    let data = await fs.readFile(path, 'utf-8');
    // NOTE removes the BOM (byte order mark)
    data = data.slice(1);
    const parsed = data.split(/\r?\n/);
    return parsed;
  }catch (err) {
    console.error(err);
    return [];
  }
}

export default read;